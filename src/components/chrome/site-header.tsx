'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import type { NavigationItem, SiteConfig } from '@/content/types';
import { TransitionLink } from '@/components/primitives/transition-link';
import { useSmoothScroll } from '@/components/runtime/smooth-scroll-provider';

import { FStopControl } from './f-stop-control';

function ExternalLink({ item, className, tabIndex }: { readonly item: NavigationItem; readonly className?: string; readonly tabIndex?: number }) {
  const opensNewTab = item.href.startsWith('http');
  return (
    <a
      className={className}
      href={item.href}
      target={opensNewTab ? '_blank' : undefined}
      rel={opensNewTab ? 'noopener noreferrer' : undefined}
      tabIndex={tabIndex}
    >
      {item.label.en}
    </a>
  );
}

export function SiteHeader({ site }: { readonly site: SiteConfig }) {
  const pathname = usePathname();
  const { setLocked } = useSmoothScroll();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuPanelRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const primary = site.navigation.filter((item) => item.placement === 'primary');
  const utility = site.navigation.filter((item) => item.placement === 'utility');

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    setLocked('menu', menuOpen);
    const routeContent = Array.from(document.querySelectorAll<HTMLElement>('[data-route-content]'));
    for (const element of routeContent) {
      element.inert = menuOpen;
    }
    if (!menuOpen) {
      return () => undefined;
    }

    const panel = menuPanelRef.current;
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusable = Array.from(
      panel?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? [],
    );
    focusable[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        return;
      }
      if (event.key !== 'Tab' || focusable.length === 0) {
        return;
      }
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus();
      for (const element of routeContent) {
        element.inert = false;
      }
      setLocked('menu', false);
    };
  }, [menuOpen, setLocked]);

  return (
    <>
      <header className="site-header">
        <nav className="site-navigation" aria-label="Primary navigation">
          <div className="nav-group nav-group-primary">
            {primary.map((item) => (
              <TransitionLink className="outline-pill" href={item.href} key={item.href}>
                {item.label.en}
              </TransitionLink>
            ))}
          </div>

          <TransitionLink className="site-wordmark" href="/" aria-label={`${site.name} home`}>
            {site.name}
            <span className="wordmark-dots" aria-hidden="true"><i /><i /></span>
          </TransitionLink>

          <div className="nav-group nav-group-utility">
            {utility.map((item) => (
              <ExternalLink className="outline-pill utility-link" item={item} key={item.href} />
            ))}
            <FStopControl />
            <button
              ref={menuButtonRef}
              type="button"
              className="outline-pill menu-trigger"
              aria-expanded={menuOpen}
              aria-controls="site-menu"
              onClick={() => setMenuOpen((current) => !current)}
            >
              <span className="menu-label-window" aria-hidden="true">
                <span className="menu-label-track"><span>Menu</span><span>Close</span></span>
              </span>
              <span className="sr-only">{menuOpen ? 'Close menu' : 'Open menu'}</span>
            </button>
          </div>
        </nav>
      </header>

      <div id="site-menu" className="menu-overlay" data-open={menuOpen} aria-hidden={!menuOpen}>
        <div ref={menuPanelRef} className="menu-panel" role="dialog" aria-modal="true" aria-label="Site menu">
          <div className="menu-links">
            {primary.map((item) => (
              <TransitionLink href={item.href} key={item.href} tabIndex={menuOpen ? 0 : -1} onClick={() => setMenuOpen(false)}>
                {item.label.en}
              </TransitionLink>
            ))}
            {utility.map((item) => (
              <ExternalLink item={item} key={item.href} className={!menuOpen ? 'menu-link-disabled' : undefined} tabIndex={menuOpen ? 0 : -1} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
