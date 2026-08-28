import type { SiteConfig } from './types';

export const siteConfig = {
  name: 'Portfolio',
  navigation: [
    { label: { en: 'Stills', zhHant: '攝影' }, href: '/stills/', placement: 'primary' },
    { label: { en: 'Motion', zhHant: '動態' }, href: '/motion/', placement: 'primary' },
    { label: { en: 'About', zhHant: '關於' }, href: '/about/', placement: 'primary' },
    { label: { en: 'Instagram' }, href: 'https://www.instagram.com/', external: true, placement: 'utility' },
    { label: { en: 'Email' }, href: 'mailto:hello@example.com', external: true, placement: 'utility' },
  ],
  contact: {
    email: 'HELLO@EXAMPLE.COM',
    copyright: 'PORTFOLIO © 2026',
    credit: 'FOUNDATION BUILD',
    social: [
      { label: { en: 'YouTube' }, href: 'https://www.youtube.com/', external: true, placement: 'menu' },
      { label: { en: 'Instagram' }, href: 'https://www.instagram.com/', external: true, placement: 'menu' },
      { label: { en: 'Vimeo' }, href: 'https://vimeo.com/', external: true, placement: 'menu' },
    ],
  },
} satisfies SiteConfig;
