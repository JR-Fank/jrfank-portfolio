// Pass this function to playwright-cli run-code with localhost:3000 running.
async (page) => {
 const results=[];const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const [width,height] of [[1440,900],[390,844]]) for(const slug of ['quiet-current','tidal-archive','after-rain','stone-light']) {
  await page.setViewportSize({width,height});await page.goto(`http://localhost:3000/stills/${slug}/`);await page.waitForTimeout(1800);
  await page.screenshot({path:`output/playwright/case-${slug}-${width}-hero.png`});
  const blocks=await page.locator('.stills-case-blocks > *').evaluateAll(es=>es.map(e=>({class:e.className,height:e.getBoundingClientRect().height})));
  for(const el of await page.locator('.stills-case-blocks > *').all()){await el.scrollIntoViewIfNeeded();await page.waitForTimeout(180);}
  await page.locator('.stills-gallery-thumb[href="#3"]').click();await page.waitForTimeout(900);
  await page.screenshot({path:`output/playwright/case-${slug}-${width}-gallery.png`});
  results.push(await page.evaluate(({slug,width,blocks})=>({slug,width,blocks,hash:location.hash,active:document.querySelector('[aria-current]')?.getAttribute('href'),activeCount:document.querySelectorAll('.stills-gallery-thumb[aria-current]').length,overflow:document.documentElement.scrollWidth>innerWidth,broken:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src),debug:window.__PORTFOLIO_DEBUG__}),{slug,width,blocks}));
  await page.getByRole('button',{name:/Switch to light/}).click();await page.waitForTimeout(600);await page.screenshot({path:`output/playwright/case-${slug}-${width}-light.png`});
  await page.getByRole('button',{name:/Switch to dark/}).click();
 }
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('http://localhost:3000/stills/quiet-current/#last');await page.waitForTimeout(3000);
 await page.locator('.stills-gallery-thumb[href="#2"]').focus();await page.keyboard.press('Enter');await page.waitForTimeout(700);
 results.push(await page.evaluate(()=>({reduced:true,hash:location.hash,active:document.querySelector('.stills-gallery-thumb[aria-current]')?.getAttribute('href'),focus:document.activeElement.id,debug:window.__PORTFOLIO_DEBUG__,overflow:document.documentElement.scrollWidth>innerWidth})));
 await page.screenshot({path:'output/playwright/reduced-gallery.png'});await page.emulateMedia({reducedMotion:'no-preference'});
 return {results,errors};
}
