// Pass this function to playwright-cli run-code with localhost:3000 running.
async(page)=>{
await page.emulateMedia({reducedMotion:'no-preference'});await page.waitForTimeout(300);
await page.addInitScript(()=>{const entries=[];const add=EventTarget.prototype.addEventListener,remove=EventTarget.prototype.removeEventListener;
EventTarget.prototype.addEventListener=function(type,fn,opts){const capture=typeof opts==='boolean'?opts:!!opts?.capture;if((this===window||this===document)&&!entries.some(e=>e.target===this&&e.type===type&&e.fn===fn&&e.capture===capture))entries.push({target:this,type,fn,capture});return add.call(this,type,fn,opts)};
EventTarget.prototype.removeEventListener=function(type,fn,opts){const capture=typeof opts==='boolean'?opts:!!opts?.capture;const i=entries.findIndex(e=>e.target===this&&e.type===type&&e.fn===fn&&e.capture===capture);if(i>=0)entries.splice(i,1);return remove.call(this,type,fn,opts)};
window.__qaListeners=()=>entries.reduce((a,e)=>{const k=(e.target===window?'window:':'document:')+e.type;a[k]=(a[k]||0)+1;return a},{})});
await page.goto('http://localhost:3000/');await page.waitForTimeout(2000);const results=[];
const state=async(label)=>results.push(await page.evaluate(label=>({label,debug:window.__PORTFOLIO_DEBUG__,listeners:window.__qaListeners()}),label));
const go=async(sel)=>{const l=page.locator(sel).first();await l.scrollIntoViewIfNeeded();await page.waitForTimeout(900);await l.click();await page.waitForTimeout(3000)};
for(let i=0;i<3;i++){await state(`home-${i}`);await go('.site-header a[href="/stills/"]');await state(`index-${i}`);await go('.stills-index-cta');await state(`case-${i}`);await page.locator('.stills-gallery-thumb[href="#3"]').click();await page.waitForTimeout(900);await page.locator('.stills-explore').evaluate(e=>e.scrollIntoView({block:'center'}));await page.waitForTimeout(1000);await go('.splide__slide:not(.splide__slide--clone) a');await state(`case-b-${i}`);await go('.site-header a[href="/stills/"]');await go('.site-header a[href="/about/"]');await state(`about-${i}`);await go('.site-wordmark');}
return results;
}
