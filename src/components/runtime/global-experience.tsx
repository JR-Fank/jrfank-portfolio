'use client';

import type { ReactNode } from 'react';

import type { SiteConfig } from '@/content/types';
import { SiteHeader } from '@/components/chrome/site-header';

import { PreloadProvider } from './preload-provider';
import { RouteTransitionProvider } from './route-transition-provider';
import { SmoothScrollProvider } from './smooth-scroll-provider';
import { ThemeProvider } from './theme-provider';

export function GlobalExperience({ children, site }: { readonly children: ReactNode; readonly site: SiteConfig }) {
  return (
    <ThemeProvider>
      <PreloadProvider>
        <SmoothScrollProvider>
          <RouteTransitionProvider>
            <SiteHeader site={site} />
            {children}
          </RouteTransitionProvider>
        </SmoothScrollProvider>
      </PreloadProvider>
    </ThemeProvider>
  );
}
