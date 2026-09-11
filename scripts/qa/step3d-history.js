// Pass this function to playwright-cli run-code with localhost:3000 running.
async(page)=>{
const results=[];await page.setViewportSize({width:1440,height:900});
const state=async(label)=>results.push(await page.evaluate(label=>({label,path:location.pathname,hash:location.hash,y:scrollY,active:document.querySelector('.stills-gallery-thumb[aria-current]')?.getAttribute('href'),debug:window.__PORTFOLIO_DEBUG__}),label));
for(const slug of ['quiet-current','tidal-archive']) for(const hash of ['1','3','last']){await page.goto(`http://localhost:3000/stills/${slug}/#${hash}`);await page.waitForTimeout(3000);await state(`direct-${slug}-${hash}`);}
await page.goto('http://localhost:3000/stills/');await page.waitForTimeout(1300);
await page.locator('.stills-index-cta').first().scrollIntoViewIfNeeded();await page.waitForTimeout(800);await page.locator('.stills-index-cta').first().click();await page.waitForTimeout(3000);
for(const id of ['1','3']){await page.locator(`.stills-gallery-thumb[href="#${id}"]`).click();await page.waitForTimeout(900);await state(`click-${id}`);}
await page.locator('.stills-explore').evaluate(e=>e.scrollIntoView({block:'center'}));await page.waitForTimeout(1000);await page.locator('.splide__slide:not(.splide__slide--clone) a').first().click();await page.waitForTimeout(3000);await state('case-b');
await page.goBack();await page.waitForTimeout(3000);await state('back-case-a-3');await page.goBack();await page.waitForTimeout(1000);await state('back-hash-1');await page.goForward();await page.waitForTimeout(1000);await state('forward-hash-3');
const items=await page.locator('[data-gallery-item]').evaluateAll(es=>es.map(e=>({id:e.id,y:scrollY+e.getBoundingClientRect().top,height:e.offsetHeight})));
for(const direction of [1,-1]){
 const from=direction===1?items[0].y:items[4].y;const to=direction===1?items[4].y:items[0].y;
 for(let i=0;i<=40;i++){await page.evaluate(y=>window.scrollTo(0,y),from+(to-from)*i/40-150);await page.waitForTimeout(150);await state(`slow-${direction}-${i}`);}
}
return results;
}
