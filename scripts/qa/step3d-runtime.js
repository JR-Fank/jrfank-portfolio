// Pass this function to playwright-cli run-code with a running localhost:3000 dev server.
async (page) => {
  const results = [];
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error' || /hydration|did not match/i.test(message.text())) errors.push(message.text());
  });
  await page.addInitScript(() => {
    const observed = [];
    for (const name of ['IntersectionObserver', 'ResizeObserver']) {
      const Original = window[name];
      window[name] = class extends Original {
        constructor(...args) { super(...args); this.targets = new Set(); observed.push(this); }
        observe(target, ...args) { this.targets.add(target); return super.observe(target, ...args); }
        unobserve(target) { this.targets.delete(target); return super.unobserve(target); }
        disconnect() { this.targets.clear(); return super.disconnect(); }
      };
    }
    window.__qaObservers = () => observed.filter((observer) => observer.targets.size > 0).length;
  });
  const settle = async () => {
    await page.waitForFunction(() => window.__PORTFOLIO_DEBUG__?.transitionPhase === 'idle' && window.__PORTFOLIO_DEBUG__?.preloadState === 'ready');
    await page.waitForTimeout(350);
  };
  const state = async (label) => {
    const value = await page.evaluate(() => ({
      path: location.pathname, hash: location.hash, y: scrollY,
      active: document.querySelector('.stills-gallery-thumb[aria-current]')?.getAttribute('href'),
      debug: window.__PORTFOLIO_DEBUG__, observers: window.__qaObservers(),
      rails: document.querySelectorAll('[data-gallery-observer="active"]').length,
      overflow: document.documentElement.scrollWidth > innerWidth,
    }));
    results.push({ label, ...value });
    if (value.overflow || value.debug.lenisInstances !== 1 || value.debug.gsapTickerDrivers !== 1 || value.debug.activeRouteScopes !== 1) throw new Error(`${label}: runtime invariant ${JSON.stringify(value)}`);
    return value;
  };
  const navigate = async (locator, path) => {
    await locator.click();
    await page.waitForURL(`http://localhost:3000${path}`);
    await settle();
  };
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/');
  await settle();
  for (let cycle = 1; cycle <= 3; cycle++) {
    await state(`cycle-${cycle}-home`);
    await navigate(page.locator('.site-header a[href="/stills/"]'), '/stills/');
    await state(`cycle-${cycle}-index`);
    await navigate(page.locator('.stills-index-cta').first(), '/stills/quiet-current/');
    for (const id of [1, 5, 2, 4, 3]) {
      await page.locator(`.stills-gallery-thumb[href="#${id}"]`).click();
      await page.waitForTimeout(750);
      const current = await state(`cycle-${cycle}-hash-${id}`);
      if (current.hash !== `#${id}` || current.active !== `#${id}`) throw new Error(`Hash/active mismatch: ${JSON.stringify(current)}`);
    }
    await navigate(page.locator('.splide__slide:not(.splide__slide--clone) a').first(), '/stills/tidal-archive/');
    await state(`cycle-${cycle}-case-b`);
    await navigate(page.locator('.site-header a[href="/stills/"]'), '/stills/');
    await state(`cycle-${cycle}-index-return`);
    await navigate(page.locator('.site-wordmark'), '/');
  }
  await page.goBack(); await settle(); await state('back-index');
  await page.goForward(); await settle(); await state('forward-home');
  for (const hash of ['1', '3', 'last']) {
    await page.goto(`http://localhost:3000/stills/quiet-current/#${hash}`);
    await settle(); await page.waitForTimeout(2800);
    const current = await state(`direct-${hash}`);
    if (current.active !== `#${hash === 'last' ? 5 : hash}`) throw new Error(`Direct hash mismatch: ${hash}`);
  }
  const widths = [1440, 1180, 992, 991, 820, 768, 767, 600, 479, 390, 360];
  for (const width of [...widths, ...widths.slice(0, -1).reverse()]) {
    await page.setViewportSize({ width, height: width < 768 ? 844 : 900 });
    await page.waitForTimeout(400);
    await page.locator('.stills-gallery-thumb[href="#3"]').click();
    await page.waitForTimeout(750);
    const current = await state(`live-resize-${width}`);
    if (current.active !== '#3') throw new Error(`Resize tracking mismatch: ${width}`);
    const geometry = await page.evaluate(() => {
      const track = document.querySelector('.splide__track').getBoundingClientRect();
      const card = document.querySelector('.splide__slide:not(.splide__slide--clone)').getBoundingClientRect();
      return { width: innerWidth, perPage: Math.round((track.width + 16) / (card.width + 16)), railWidth: document.querySelector('.stills-gallery-rail').getBoundingClientRect().width };
    });
    results.push({ label: 'carousel-geometry', ...geometry });
    if (geometry.perPage !== (width <= 478 ? 1 : width <= 767 ? 2 : 3)) throw new Error(`Carousel breakpoint mismatch: ${width}`);
  }
  for (const id of [1, 2, 3, 4, 5, 4, 3, 2, 1]) {
    await page.locator(`[data-gallery-item][id="${id}"]`).evaluate((element) => element.scrollIntoView({ block: 'center', behavior: 'smooth' }));
    await page.waitForTimeout(1300);
    const current = await state(`tracking-${id}`);
    if (current.active !== `#${id}`) throw new Error(`Tracking mismatch: ${id}`);
  }
  const rail = page.locator('.stills-gallery-thumb[href="#3"]');
  await rail.focus();
  await page.keyboard.press('Enter'); await page.waitForTimeout(800);
  results.push({ label: 'keyboard', focused: await page.evaluate(() => document.activeElement?.id) });
  if (await page.evaluate(() => document.activeElement?.id) !== '3') throw new Error('Keyboard hash focus was stranded');
  const target = page.locator('.stills-gallery-thumb[href="#2"]');
  await target.hover(); await page.waitForTimeout(300);
  results.push({ label: 'rail-hover', transform: await target.evaluate((element) => getComputedStyle(element).transform) });
  const carousel = page.locator('.splide__list');
  await page.locator('.stills-explore').evaluate((element) => element.scrollIntoView({ block: 'center' }));
  const before = await carousel.evaluate((element) => getComputedStyle(element).transform);
  const box = await page.locator('.splide__track').boundingBox();
  await page.mouse.move(box.x + box.width * 0.8, box.y + 100);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.2, box.y + 100, { steps: 30 });
  await page.mouse.up(); await page.waitForTimeout(1500);
  results.push({ label: 'drag', before, after: await carousel.evaluate((element) => getComputedStyle(element).transform) });
  // Exercise a cloned DOM anchor explicitly; originals were clicked in all three cycles.
  const clone = page.locator('.splide__slide--clone a').first();
  const clonePath = await clone.getAttribute('href');
  await clone.evaluate((element) => element.click());
  await page.waitForTimeout(100);
  results.push({ label: 'clone-overlay', phase: await page.evaluate(() => window.__PORTFOLIO_DEBUG__.transitionPhase) });
  await page.waitForURL(`http://localhost:3000${clonePath}`); await settle();
  await state('clone-destination');
  await page.goBack(); await settle(); await state('clone-back');
  await page.goForward(); await settle(); await state('clone-forward');
  results.push({ label: 'console', errors });
  if (errors.length) throw new Error(JSON.stringify(errors));
  return results;
}
