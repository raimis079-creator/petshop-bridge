import { chromium } from "playwright";
import fs from "fs";
fs.mkdirSync("screenshots", { recursive: true });
const out={};
const b = await chromium.launch({ args:["--no-sandbox"] });
const page = await (await b.newContext({ viewport:{width:1300,height:1250}, ignoreHTTPSErrors:true })).newPage();
try {
  await page.goto("https://dev.avesa.lt/kategorija/katems/sukos-sepeciai-zirkles-katems/",{waitUntil:"domcontentloaded",timeout:45000});
  await page.waitForTimeout(4000);
  out.sidebar = await page.evaluate(()=>{const el=document.querySelector('.yith-wcan-filters');return el?el.innerText.slice(0,400):'NORA';});
  out.heading = await page.evaluate(()=>{const h=document.querySelector('.page-title,h1');return h?h.innerText:'?';});
  await page.screenshot({ path:"screenshots/CAT_GROOM.png", clip:{x:88,y:120,width:460,height:720} });
} catch(e){ out.err=String(e).slice(0,110); }
await b.close();
fs.writeFileSync("screenshots/cat_groom_shot.txt", JSON.stringify(out,null,1));
