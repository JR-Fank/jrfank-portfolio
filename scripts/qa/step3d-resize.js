// Pass this function to playwright-cli run-code after opening the target local server.
async (page) => {
  const baseUrl = page.url().split('/').slice(0, 3).join('/');
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${baseUrl}/stills/quiet-current/#3`);
  await page.waitForTimeout(3000);

  await page.evaluate(() => {
    const records = [];
    for (const name of ['IntersectionObserver', 'ResizeObserver']) {
      const Original = window[name];
      window[name] = class extends Original {
        constructor(...args) {
          super(...args);
          this.targets = new Set();
          this.kind = name;
          this.margin = args[1]?.rootMargin;
          records.push(this);
        }
        observe(target, ...args) {
          this.targets.add(target);
          return super.observe(target, ...args);
        }
        unobserve(target) {
          this.targets.delete(target);
          return super.unobserve(target);
        }
        disconnect() {
          this.targets.clear();
          return super.disconnect();
        }
      };
    }
    window.__resizeObservers = () => records
      .filter((observer) => observer.targets.size)
      .map((observer) => ({ kind: observer.kind, margin: observer.margin, count: observer.targets.size }));
  });

  // Client navigation remounts the route while preserving the installed shim.
  await page.locator('.site-header a[href="/stills/"]').click();
  await page.waitForTimeout(3000);
  await page.locator('.stills-index-cta').first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(700);
  await page.locator('.stills-index-cta').first().click();
  await page.waitForTimeout(3000);

  const results = [];
  const widths = [1440, 1180, 1024, 992, 991, 820, 768, 767, 600, 479, 430, 390, 360];
  for (const width of [...widths, ...widths.slice(0, -1).reverse()]) {
    await page.setViewportSize({ width, height: width < 768 ? 844 : 900 });
    await page.waitForTimeout(500);
    const before = await page.evaluate(() => ({
      hash: location.hash,
      active: document.querySelector('.stills-gallery-thumb[aria-current]')?.getAttribute('href'),
    }));
    await page.locator('.stills-gallery-thumb[href="#3"]').click();
    await page.waitForTimeout(900);
    results.push(await page.evaluate(({ width, before }) => {
      const rail = document.querySelector('.stills-gallery-rail');
      const track = document.querySelector('.splide__track').getBoundingClientRect();
      const card = document.querySelector('.splide__slide:not(.splide__slide--clone)').getBoundingClientRect();
      const image = document.getElementById('3').getBoundingClientRect();
      return {
        width,
        before,
        hash: location.hash,
        active: document.querySelector('.stills-gallery-thumb[aria-current]')?.getAttribute('href'),
        activeCount: document.querySelectorAll('.stills-gallery-thumb[aria-current]').length,
        overflow: document.documentElement.scrollWidth > innerWidth,
        imageVisible: image.top < innerHeight && image.bottom > 64,
        rail: {
          width: rail.getBoundingClientRect().width,
          top: rail.getBoundingClientRect().top,
          position: getComputedStyle(rail).position,
        },
        perPage: Math.round((track.width + 16) / (card.width + 16)),
        observers: window.__resizeObservers(),
        debug: window.__PORTFOLIO_DEBUG__,
      };
    }, { width, before }));
  }

  await page.locator('.stills-explore').evaluate((element) => element.scrollIntoView({ block: 'center' }));
  await page.waitForTimeout(1200);
  const list = page.locator('.splide__list');
  const dragBefore = await list.evaluate((element) => getComputedStyle(element).transform);
  const box = await page.locator('.splide__track').boundingBox();
  await page.mouse.move(box.x + box.width * 0.8, box.y + 150);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.2, box.y + 150, { steps: 30 });
  await page.mouse.up();
  await page.waitForTimeout(1500);
  results.push({ dragBefore, dragAfter: await list.evaluate((element) => getComputedStyle(element).transform) });

  const clone = page.locator('.splide__slide--clone a').first();
  const clonePath = await clone.getAttribute('href');
  await clone.evaluate((element) => element.click());
  await page.waitForTimeout(150);
  results.push({ clonePhase: await page.evaluate(() => window.__PORTFOLIO_DEBUG__?.transitionPhase ?? 'production') });
  await page.waitForTimeout(3000);
  results.push({ clonePath, actual: page.url(), debug: await page.evaluate(() => window.__PORTFOLIO_DEBUG__) });
  return results;
}
