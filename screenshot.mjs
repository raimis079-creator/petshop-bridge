import { chromium } from "playwright";
import fs from "fs";
fs.mkdirSync("screenshots", { recursive: true });
const out={};
const b = await chromium.launch({ args:["--no-sandbox"] });
const page = await (await b.newContext({ viewport:{width:1280,height:1700}, ignoreHTTPSErrors:true })).newPage();
await page.goto("https://dev.avesa.lt/kategorija/sunims/sampunai-sunims/",{waitUntil:"networkidle",timeout:60000});
await page.waitForTimeout(2500);
// klikinti filtru antrastes, kad issiskleistu
try {
  const heads = await page.$$('.yith-wcan-filter-title, .filter-title, .yith-wcan-filters h4, .widget-title');
  for(const h of heads){ try{ await h.click({timeout:1500}); await page.waitForTimeout(400);}catch(e){} }
} catch(e){ out.click_err=String(e).slice(0,80); }
await page.waitForTimeout(1500);
const txt = await page.evaluate(()=>{
  const el=document.querySelector('.yith-wcan-filters, .widget-area, aside, .sidebar');
  return el?el.innerText:document.body.innerText;
});
out.sidebar_txt = txt.slice(0,1200);
await page.screenshot({ path:"screenshots/samp_filter3.png", fullPage:false });
await b.close();
fs.writeFileSync("screenshots/samp_filter3.txt", JSON.stringify(out,null,1));
