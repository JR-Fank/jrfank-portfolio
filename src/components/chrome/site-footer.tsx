'use client';

import { useEffect, useRef, useState } from 'react';

import type { SiteConfig } from '@/content/types';

type ContactState = 'idle' | 'hover' | 'copied';

export function SiteFooter({ site }: { readonly site: SiteConfig }) {
  const [contactState, setContactState] = useState<ContactState>('idle');
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const helper = contactState === 'copied' ? 'COPIED ✨' : contactState === 'hover' ? 'CLICK TO COPY' : 'GET IN TOUCH';

  useEffect(
    () => () => {
      if (resetTimer.current) {
        clearTimeout(resetTimer.current);
      }
    },
    [],
  );

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(site.contact.email);
      setContactState('copied');
      if (resetTimer.current) {
        clearTimeout(resetTimer.current);
      }
      resetTimer.current = setTimeout(() => setContactState('idle'), 1800);
    } catch {
      setContactState('idle');
    }
  };

  return (
    <footer className="site-footer">
      <div className="footer-contact">
        <span className="footer-helper" aria-live="polite">{helper}</span>
        <button
          type="button"
          className="footer-email"
          onPointerEnter={() => setContactState((current) => (current === 'copied' ? current : 'hover'))}
          onPointerLeave={() => setContactState((current) => (current === 'copied' ? current : 'idle'))}
          onFocus={() => setContactState((current) => (current === 'copied' ? current : 'hover'))}
          onBlur={() => setContactState((current) => (current === 'copied' ? current : 'idle'))}
          onClick={() => void copyEmail()}
        >
          {site.contact.email}
        </button>
      </div>
      <div className="footer-meta">
        <span>{site.contact.copyright}</span>
        <div className="footer-social" aria-label="Social links">
          {site.contact.social.map((item) => (
            <a className="outline-pill" href={item.href} target="_blank" rel="noopener noreferrer" key={item.href}>
              {item.label.en}
            </a>
          ))}
        </div>
        <span>{site.contact.credit}</span>
      </div>
    </footer>
  );
}
