'use client';

import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';

import type { MotionAudioPolicy } from '@/content/types';

export type MotionPlaybackState =
  | 'poster'
  | 'preview-loading'
  | 'preview-playing'
  | 'film-loading'
  | 'film-playing'
  | 'film-paused'
  | 'error';

type PlaybackMode = 'none' | 'preview' | 'film';

interface MotionPlaybackControllerOptions {
  readonly previewSrc?: string;
  readonly fullFilmSrc: string;
  readonly audioPolicy: MotionAudioPolicy;
}

interface MotionPlaybackController {
  readonly videoRef: RefObject<HTMLVideoElement | null>;
  readonly state: MotionPlaybackState;
  readonly hasFilmStarted: boolean;
  readonly watch: () => void;
  readonly togglePlayback: () => void;
  readonly retry: () => void;
}

export function useMotionPlaybackController({
  previewSrc,
  fullFilmSrc,
  audioPolicy,
}: MotionPlaybackControllerOptions): MotionPlaybackController {
  const videoRef = useRef<HTMLVideoElement>(null);
  const modeRef = useRef<PlaybackMode>('none');
  const requestVersionRef = useRef(0);
  const stateRef = useRef<MotionPlaybackState>('poster');
  const mountedRef = useRef(false);
  const [state, setState] = useState<MotionPlaybackState>('poster');
  const [hasFilmStarted, setHasFilmStarted] = useState(false);

  const commitState = useCallback((nextState: MotionPlaybackState) => {
    stateRef.current = nextState;
    setState(nextState);
  }, []);

  const handleRejectedPlay = useCallback((mode: PlaybackMode, requestVersion: number) => {
    if (!mountedRef.current || modeRef.current !== mode || requestVersionRef.current !== requestVersion) return;
    const video = videoRef.current;
    if (mode === 'preview') {
      modeRef.current = 'none';
      video?.pause();
      video?.removeAttribute('src');
      video?.load();
      commitState('poster');
      return;
    }
    commitState('error');
  }, [commitState]);

  const requestNativePlay = useCallback((mode: PlaybackMode, requestVersion = requestVersionRef.current) => {
    const video = videoRef.current;
    if (!video) return;
    void video.play().catch(() => handleRejectedPlay(mode, requestVersion));
  }, [handleRejectedPlay]);

  const loadFullFilm = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.pause();
    const requestVersion = requestVersionRef.current + 1;
    requestVersionRef.current = requestVersion;
    modeRef.current = 'film';
    setHasFilmStarted(false);
    commitState('film-loading');
    video.loop = false;
    video.preload = 'auto';
    video.defaultMuted = audioPolicy === 'muted-preview-muted-full';
    video.muted = audioPolicy === 'muted-preview-muted-full';
    video.src = fullFilmSrc;
    try {
      video.currentTime = 0;
    } catch {
      // Metadata may not exist yet; loadedmetadata performs the authoritative reset.
    }
    video.load();
    requestNativePlay('film', requestVersion);
  }, [audioPolicy, commitState, fullFilmSrc, requestNativePlay]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    mountedRef.current = true;

    const releaseToPoster = () => {
      requestVersionRef.current += 1;
      modeRef.current = 'none';
      video.pause();
      video.removeAttribute('src');
      video.preload = 'none';
      video.load();
      setHasFilmStarted(false);
      commitState('poster');
    };

    const startPreview = () => {
      if (!previewSrc || modeRef.current !== 'none') return;
      const requestVersion = requestVersionRef.current + 1;
      requestVersionRef.current = requestVersion;
      modeRef.current = 'preview';
      commitState('preview-loading');
      video.preload = 'metadata';
      video.defaultMuted = true;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.src = previewSrc;
      video.load();
      requestNativePlay('preview', requestVersion);
    };

    const onLoadedMetadata = () => {
      if (modeRef.current !== 'film') return;
      try {
        video.currentTime = 0;
      } catch {
        // The subsequent native error event owns failure state if the source is unusable.
      }
    };
    const onPlay = () => {
      if (modeRef.current === 'preview') commitState('preview-loading');
      if (modeRef.current === 'film') commitState('film-loading');
    };
    const onPlaying = () => {
      if (modeRef.current === 'preview') commitState('preview-playing');
      if (modeRef.current === 'film') {
        setHasFilmStarted(true);
        commitState('film-playing');
      }
    };
    const onPause = () => {
      if (modeRef.current === 'preview' && stateRef.current === 'preview-playing') {
        releaseToPoster();
      }
      if (modeRef.current === 'film' && stateRef.current === 'film-playing') {
        commitState('film-paused');
      }
    };
    const onWaiting = () => {
      if (modeRef.current === 'preview') commitState('preview-loading');
      if (modeRef.current === 'film') commitState('film-loading');
    };
    const onEnded = () => {
      if (modeRef.current === 'preview') {
        releaseToPoster();
        return;
      }
      if (modeRef.current === 'film') commitState('film-paused');
    };
    const onError = () => {
      if (modeRef.current === 'preview') {
        releaseToPoster();
        return;
      }
      if (modeRef.current === 'film') commitState('error');
    };

    video.addEventListener('loadedmetadata', onLoadedMetadata);
    video.addEventListener('play', onPlay);
    video.addEventListener('playing', onPlaying);
    video.addEventListener('pause', onPause);
    video.addEventListener('waiting', onWaiting);
    video.addEventListener('ended', onEnded);
    video.addEventListener('error', onError);

    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotionPreferenceChange = () => {
      if (motionPreference.matches && modeRef.current === 'preview') {
        releaseToPoster();
      } else if (!motionPreference.matches && modeRef.current === 'none') {
        startPreview();
      }
    };
    motionPreference.addEventListener('change', onMotionPreferenceChange);
    if (!motionPreference.matches) startPreview();

    return () => {
      mountedRef.current = false;
      requestVersionRef.current += 1;
      motionPreference.removeEventListener('change', onMotionPreferenceChange);
      video.pause();
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      video.removeEventListener('play', onPlay);
      video.removeEventListener('playing', onPlaying);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('waiting', onWaiting);
      video.removeEventListener('ended', onEnded);
      video.removeEventListener('error', onError);
      modeRef.current = 'none';
      video.removeAttribute('src');
      video.preload = 'none';
      video.load();
    };
  }, [commitState, previewSrc, requestNativePlay]);

  const togglePlayback = useCallback(() => {
    const video = videoRef.current;
    if (!video || modeRef.current !== 'film') return;
    if (stateRef.current === 'film-playing') {
      video.pause();
      return;
    }
    if (stateRef.current === 'film-paused') {
      if (video.ended || video.currentTime >= video.duration) video.currentTime = 0;
      requestNativePlay('film');
    }
  }, [requestNativePlay]);

  return {
    videoRef,
    state,
    hasFilmStarted,
    watch: loadFullFilm,
    togglePlayback,
    retry: loadFullFilm,
  };
}
