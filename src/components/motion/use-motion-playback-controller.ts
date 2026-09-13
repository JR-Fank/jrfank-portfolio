'use client';

import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';

import { useRouteAnimationScope } from '@/components/runtime/route-animation-boundary';
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
type ActivePlaybackMode = Exclude<PlaybackMode, 'none'>;

interface ActiveMediaSource {
  readonly mode: ActivePlaybackMode;
  readonly src: string;
  readonly requestVersion: number;
}

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
  const scope = useRouteAnimationScope();
  const videoRef = useRef<HTMLVideoElement>(null);
  const modeRef = useRef<PlaybackMode>('none');
  const requestVersionRef = useRef(0);
  const activeSourceRef = useRef<ActiveMediaSource | null>(null);
  const loadedMetadataRequestVersionRef = useRef<number | null>(null);
  const stateRef = useRef<MotionPlaybackState>('poster');
  const mountedRef = useRef(false);
  const [state, setState] = useState<MotionPlaybackState>('poster');
  const [hasFilmStarted, setHasFilmStarted] = useState(false);

  const commitState = useCallback((nextState: MotionPlaybackState) => {
    stateRef.current = nextState;
    setState(nextState);
  }, []);

  const getActiveSourceMode = useCallback((allowEmptyFailedSource = false): ActivePlaybackMode | null => {
    const video = videoRef.current;
    const activeSource = activeSourceRef.current;
    if (
      !video ||
      !mountedRef.current ||
      !activeSource ||
      activeSource.requestVersion !== requestVersionRef.current ||
      activeSource.mode !== modeRef.current ||
      video.src !== activeSource.src
    ) {
      return null;
    }

    if (video.currentSrc === activeSource.src) return activeSource.mode;
    if (allowEmptyFailedSource && !video.currentSrc && video.error) return activeSource.mode;
    return null;
  }, []);

  const handleRejectedPlay = useCallback((mode: PlaybackMode, requestVersion: number) => {
    if (!mountedRef.current || modeRef.current !== mode || requestVersionRef.current !== requestVersion) return;
    const video = videoRef.current;
    if (mode === 'preview') {
      modeRef.current = 'none';
      activeSourceRef.current = null;
      loadedMetadataRequestVersionRef.current = null;
      video?.pause();
      video?.removeAttribute('src');
      if (video) video.preload = 'none';
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

    const requestVersion = requestVersionRef.current + 1;
    requestVersionRef.current = requestVersion;
    modeRef.current = 'film';
    activeSourceRef.current = null;
    loadedMetadataRequestVersionRef.current = null;
    video.pause();
    setHasFilmStarted(false);
    commitState('film-loading');
    video.loop = false;
    video.preload = 'auto';
    video.defaultMuted = audioPolicy === 'muted-preview-muted-full';
    video.muted = audioPolicy === 'muted-preview-muted-full';
    video.src = fullFilmSrc;
    activeSourceRef.current = { mode: 'film', src: video.src, requestVersion };
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
      activeSourceRef.current = null;
      loadedMetadataRequestVersionRef.current = null;
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
      activeSourceRef.current = null;
      loadedMetadataRequestVersionRef.current = null;
      commitState('preview-loading');
      video.preload = 'metadata';
      video.defaultMuted = true;
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.src = previewSrc;
      activeSourceRef.current = { mode: 'preview', src: video.src, requestVersion };
      video.load();
      requestNativePlay('preview', requestVersion);
    };

    const onLoadedMetadata = () => {
      const activeMode = getActiveSourceMode();
      const activeSource = activeSourceRef.current;
      if (
        !activeMode ||
        !activeSource ||
        video.readyState < HTMLMediaElement.HAVE_METADATA
      ) return;
      loadedMetadataRequestVersionRef.current = activeSource.requestVersion;
      if (activeMode !== 'film') return;
      try {
        video.currentTime = 0;
      } catch {
        // The subsequent native error event owns failure state if the source is unusable.
      }
    };
    const onPlay = () => {
      const activeMode = getActiveSourceMode();
      if (!activeMode || video.paused) return;
      if (activeMode === 'preview') commitState('preview-loading');
      if (activeMode === 'film') commitState('film-loading');
    };
    const onPlaying = () => {
      const activeMode = getActiveSourceMode();
      const activeSource = activeSourceRef.current;
      if (
        !activeMode ||
        !activeSource ||
        loadedMetadataRequestVersionRef.current !== activeSource.requestVersion ||
        video.paused ||
        video.ended ||
        video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA
      ) return;
      if (activeMode === 'preview') commitState('preview-playing');
      if (activeMode === 'film') {
        setHasFilmStarted(true);
        commitState('film-playing');
      }
    };
    const onPause = () => {
      const activeMode = getActiveSourceMode();
      if (!video.paused) return;
      if (activeMode === 'preview' && stateRef.current === 'preview-playing') {
        releaseToPoster();
      }
      if (activeMode === 'film' && stateRef.current === 'film-playing') {
        commitState('film-paused');
      }
    };
    const onWaiting = () => {
      const activeMode = getActiveSourceMode();
      if (
        !activeMode ||
        video.paused ||
        video.readyState > HTMLMediaElement.HAVE_CURRENT_DATA
      ) return;
      if (activeMode === 'preview') commitState('preview-loading');
      if (activeMode === 'film') commitState('film-loading');
    };
    const onEnded = () => {
      const activeMode = getActiveSourceMode();
      if (!video.ended) return;
      if (activeMode === 'preview') {
        releaseToPoster();
        return;
      }
      if (activeMode === 'film') commitState('film-paused');
    };
    const onError = () => {
      const activeMode = getActiveSourceMode(true);
      if (!video.error) return;
      if (activeMode === 'preview') {
        releaseToPoster();
        return;
      }
      if (activeMode === 'film') commitState('error');
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

    let disposed = false;
    const dispose = () => {
      if (disposed) return;
      disposed = true;
      mountedRef.current = false;
      requestVersionRef.current += 1;
      modeRef.current = 'none';
      activeSourceRef.current = null;
      loadedMetadataRequestVersionRef.current = null;
      motionPreference.removeEventListener('change', onMotionPreferenceChange);
      video.pause();
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
      video.removeEventListener('play', onPlay);
      video.removeEventListener('playing', onPlaying);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('waiting', onWaiting);
      video.removeEventListener('ended', onEnded);
      video.removeEventListener('error', onError);
      video.removeAttribute('src');
      video.preload = 'none';
      video.load();
      setHasFilmStarted(false);
      commitState('poster');
    };

    scope.addCleanup(dispose);
    if (!disposed && !motionPreference.matches) startPreview();
    return dispose;
  }, [commitState, getActiveSourceMode, previewSrc, requestNativePlay, scope]);

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
