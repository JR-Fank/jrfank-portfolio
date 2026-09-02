import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import type { ReactNode } from 'react';

import '@fontsource/cormorant-garamond/latin-400.css';
import '@fontsource/ibm-plex-sans/latin-500.css';
import '@fontsource/ibm-plex-sans/latin-700.css';
import '@fontsource/noto-sans-tc/chinese-traditional-500.css';

import { GlobalExperience } from '@/components/runtime/global-experience';
import { siteConfig } from '@/content';
import { getSocialImage } from '@/lib/media';
import { siteIndexable, siteUrl } from '@/lib/metadata';

import '@/styles/tokens.css';
import '@/styles/typography.css';
import '@/styles/globals.css';
import '@/styles/home.css';
import '@/styles/about.css';

const defaultDescription = 'A bilingual editorial photography and film portfolio foundation.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: siteConfig.name, template: `%s — ${siteConfig.name}` },
  description: defaultDescription,
  robots: { index: siteIndexable, follow: siteIndexable },
  openGraph: {
    title: siteConfig.name,
    description: defaultDescription,
    type: 'website',
    images: [{ url: getSocialImage('site.social-default'), width: 1200, height: 630 }],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#101114' },
    { media: '(prefers-color-scheme: light)', color: '#e8e5f0' },
  ],
};

const themeBoot = `try{if(localStorage.getItem('light-mode')==='true'){document.documentElement.classList.add('light-mode')}}catch(e){}`;

export default function RootLayout({ children }: { readonly children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Script id="theme-boot" strategy="beforeInteractive">{themeBoot}</Script>
        <GlobalExperience site={siteConfig}>{children}</GlobalExperience>
      </body>
    </html>
  );
}
