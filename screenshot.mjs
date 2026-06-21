import { chromium } from "playwright";
import fs from "fs";
fs.mkdirSync("screenshots", { recursive: true });
const out={};
const b = await chromium.launch({ args:["--no-sandbox"] });
const page = await (await b.newContext({ viewport:{width:760,height:1300}, ignoreHTTPSErrors:true })).newPage();
try {
  await page.goto("https://dev.avesa.lt/kategorija/sunims/sampunai-sunims/",{waitUntil:"domcontentloaded",timeout:45000});
  await page.waitForTimeout(4000);
  const txt = await page.evaluate(()=>{const el=document.querySelector('.widget-area,aside,.sidebar');return el?el.innerText.slice(0,600):'';});
  out.sidebar=txt;
  await page.screenshot({ path:"screenshots/samp_final.png", clip:{x:0,y:120,width:480,height:700} });
} catch(e){ out.err=String(e).slice(0,100); }
await b.close();
fs.writeFileSync("screenshots/samp_final.txt", JSON.stringify(out,null,1));
