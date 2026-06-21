import { chromium } from "playwright";
import fs from "fs";
fs.mkdirSync("screenshots", { recursive: true });
const out={};
const b = await chromium.launch({ args:["--no-sandbox"] });
const page = await (await b.newContext({ viewport:{width:1300,height:1250}, ignoreHTTPSErrors:true })).newPage();
try {
  await page.goto("https://dev.avesa.lt/kategorija/sunims/sampunai-sunims/",{waitUntil:"domcontentloaded",timeout:35000});
  await page.waitForTimeout(3500);
  const txt = await page.evaluate(()=>{const el=document.querySelector('.yith-wcan-filters,.widget-area,aside');return el?el.innerText.slice(0,500):'NORA';});
  out.sidebar=txt;
  out.paskirtis_opened = /Antiparazitinis|Universalus/.test(txt);
  out.veisles = (txt.match(/Labradorai|Maltos|Cu|Škotijos|aviganiai/g)||[]).length;
  await page.screenshot({ path:"screenshots/FINAL.png", clip:{x:88,y:120,width:450,height:680} });
} catch(e){ out.err=String(e).slice(0,100); }
await b.close();
fs.writeFileSync("screenshots/final_check.txt", JSON.stringify(out,null,1));
