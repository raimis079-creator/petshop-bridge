import { chromium } from "playwright";
import fs from "fs";
fs.mkdirSync("screenshots", { recursive: true });
const out={};
const b = await chromium.launch({ args:["--no-sandbox"] });
const page = await (await b.newContext({ viewport:{width:1280,height:1200}, ignoreHTTPSErrors:true })).newPage();
try {
  await page.goto("https://dev.avesa.lt/kategorija/sunims/sampunai-sunims/",{waitUntil:"domcontentloaded",timeout:45000});
  await page.waitForTimeout(4500);
  const txt = await page.evaluate(()=>{const el=document.querySelector('.widget-area,aside,.sidebar,.yith-wcan-filters');return el?el.innerText.slice(0,500):'NORA';});
  out.sidebar=txt;
  out.paskirtis_expanded = /Antiparazitinis/.test(txt); // jei terminai matomi tekste -> isskleista
  await page.screenshot({ path:"screenshots/samp_desktop.png", clip:{x:90,y:130,width:420,height:560} });
} catch(e){ out.err=String(e).slice(0,100); }
await b.close();
fs.writeFileSync("screenshots/samp_desktop.txt", JSON.stringify(out,null,1));
