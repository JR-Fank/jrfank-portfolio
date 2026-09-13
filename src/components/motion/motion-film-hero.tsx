'use client';

import type { ReactNode } from 'react';

import type { MotionAudioPolicy } from '@/content/types';

import { useMotionPlaybackController } from './use-motion-playback-controller';

interface MotionFilmHeroProps {
  readonly slug: string;
  readonly titleEn: string;
  readonly titleZh?: string;
  readonly poster: ReactNode;
  readonly previewSrc?: string;
  readonly fullFilmSrc: string;
  readonly audioPolicy: MotionAudioPolicy;
}

const statusLabels = {
  poster: '',
  'preview-loading': 'Loading muted preview',
  'preview-playing': 'Muted preview playing',
  'film-loading': 'Loading film',
  'film-playing': 'Film playing',
  'film-paused': 'Film paused',
  error: 'Film could not be played',
} as const;

export function MotionFilmHero({
  slug,
  titleEn,
  titleZh,
  poster,
  previewSrc,
  fullFilmSrc,
  audioPolicy,
}: MotionFilmHeroProps) {
  const playback = useMotionPlaybackController({ previewSrc, fullFilmSrc, audioPolicy });
  const isFilmPresentation = playback.hasFilmStarted && playback.state !== 'error';
  const isLoadingFilm = playback.state === 'film-loading';
  const showWatch = playback.state === 'poster' || playback.state.startsWith('preview-');
  const showRetry = playback.state === 'error';
  const showFloatingControl = playback.hasFilmStarted && playback.state !== 'error';
  const isPaused = playback.state === 'film-paused';
  const titleId = `motion-case-title-${slug}`;

  return (
    <section
      className="motion-case-hero"
      aria-labelledby={titleId}
      data-motion-film-hero
      data-playback-state={playback.state}
      data-film-presentation={isFilmPresentation ? 'true' : 'false'}
      data-film-started={playback.hasFilmStarted ? 'true' : 'false'}
    >
      <div className="motion-case-hero-heading">
        <p className="motion-case-kicker">MOTION STUDY</p>
        <h1 id={titleId}>
          <span>{titleEn}</span>
          {titleZh ? <span lang="zh-Hant">{titleZh}</span> : null}
        </h1>
      </div>

      <div className="motion-film-frame" aria-busy={isLoadingFilm || undefined}>
        <div className="motion-film-poster">{poster}</div>
        <video
          ref={playback.videoRef}
          className="motion-film-video"
          preload="none"
          playsInline
          muted
          aria-label={`${titleEn} film presentation`}
          data-motion-film-video
        />
        <div className="motion-film-shade" aria-hidden="true" />

        <div className="motion-film-primary-control">
          {showWatch ? (
            <button className="motion-watch-button" type="button" onClick={playback.watch}>
              <span>WATCH VIDEO</span>
              <span aria-hidden="true" className="motion-watch-play">▶</span>
            </button>
          ) : null}
          {isLoadingFilm && !playback.hasFilmStarted ? (
            <span className="motion-film-loading" role="status">LOADING FILM</span>
          ) : null}
          {showRetry ? (
            <div className="motion-film-error" role="alert">
              <span>PLAYBACK UNAVAILABLE</span>
              <button className="outline-pill" type="button" onClick={playback.retry}>RETRY</button>
            </div>
          ) : null}
        </div>

        {showFloatingControl ? (
          <button
            className="motion-film-floating-control"
            type="button"
            onClick={playback.togglePlayback}
            disabled={isLoadingFilm}
            aria-label={isLoadingFilm ? 'Film buffering' : isPaused ? 'Resume film' : 'Pause film'}
          >
            <span aria-hidden="true">{isLoadingFilm ? '…' : isPaused ? '▶' : 'Ⅱ'}</span>
          </button>
        ) : null}
      </div>

      <span className="sr-only" aria-live="polite">{statusLabels[playback.state]}</span>
    </section>
  );
}
