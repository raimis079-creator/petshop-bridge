import { chromium } from "playwright";
import fs from "fs";
fs.mkdirSync("screenshots", { recursive: true });
const out={};
const b = await chromium.launch({ args:["--no-sandbox"] });
const page = await (await b.newContext({ viewport:{width:1300,height:1200}, ignoreHTTPSErrors:true })).newPage();
try {
  await page.goto("https://dev.avesa.lt/kategorija/sunims/sampunai-sunims/",{waitUntil:"domcontentloaded",timeout:45000});
  await page.waitForTimeout(7000); // AJAX filtrams
  const txt = await page.evaluate(()=>{const el=document.querySelector('.yith-wcan-filters,.widget-area,aside');return el?el.innerText.slice(0,400):'NORA';});
  out.sidebar=txt;
  out.opened = /Antiparazitinis|Universalus|Baltam/.test(txt);
  await page.screenshot({ path:"screenshots/toggle_check.png", clip:{x:90,y:120,width:430,height:600} });
} catch(e){ out.err=String(e).slice(0,100); }
await b.close();
fs.writeFileSync("screenshots/toggle_check.txt", JSON.stringify(out,null,1));
