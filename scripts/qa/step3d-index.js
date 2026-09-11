// Pass this function to playwright-cli run-code with localhost:3000 running.
async (page) => {
 const results=[];
 for (const [width,height] of [[1440,900],[1280,800],[1024,768],[992,800],[991,800],[820,1180],[768,1024],[767,1024],[600,900],[479,844],[430,932],[390,844],[360,800]]) {
  await page.setViewportSize({width,height}); await page.goto('http://localhost:3000/stills/'); await page.waitForTimeout(1400);
  const stages=await page.locator('[data-stills-index-stage]').evaluateAll(es=>es.map(e=>({top:e.offsetTop,height:e.offsetHeight})));
  const samples=[];
  for(let i=0;i<stages.length;i++) for(const p of [.25,.5,.75,.5,.25]) {
   const y=stages[i].top-height+(stages[i].height+height)*p;
   await page.evaluate(y=>window.scrollTo(0,y),y); await page.waitForTimeout(650);
   samples.push(await page.locator('[data-stills-index-stage]').nth(i).evaluate((e)=>({y:scrollY,overflow:document.documentElement.scrollWidth>innerWidth,copyOpacity:getComputedStyle(e.querySelector('[data-index-center]')).opacity,images:[...e.querySelectorAll('[data-index-side]')].map(el=>{const r=el.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,visible:r.right>0&&r.left<innerWidth&&r.bottom>64&&r.top<innerHeight};})})));
   if(i===0&&p===.5) await page.screenshot({path:`output/playwright/index-${width}.png`});
  }
  results.push({width,height,samples});
 }
 return results;
}
