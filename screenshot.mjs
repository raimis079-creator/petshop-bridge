import { chromium } from "playwright";
import { execSync } from "child_process";
import fs from "fs";
fs.mkdirSync("screenshots", { recursive: true });
const base = "https://dev.avesa.lt";
const passClean = (process.env.WP_APP_PASS || "").replace(/\s+/g, "");
const env = { ...process.env, WP_PASS_CLEAN: passClean };
const out={};
// re-inspect sampunu f1 (ar rebuild prilipo)
try {
  const insp=execSync(`curl -sk --max-time 30 "${base}/?ps_samp_inspect=1&k=ps2026"`,{encoding:"utf8",env});
  out.inspect = insp.slice(0,400);
} catch(e){ out.insp_err=String(e).slice(0,80); }
// screenshot draskykliu DESKTOP
const b = await chromium.launch({ args:["--no-sandbox"] });
const page = await (await b.newContext({ viewport:{width:1280,height:1200}, ignoreHTTPSErrors:true })).newPage();
try {
  await page.goto("https://dev.avesa.lt/kategorija/katems/draskykles-katems/",{waitUntil:"domcontentloaded",timeout:45000});
  await page.waitForTimeout(4500);
  const txt = await page.evaluate(()=>{const el=document.querySelector('.widget-area,aside,.sidebar,.yith-wcan-filters');return el?el.innerText.slice(0,500):'NORA';});
  out.drask_sidebar=txt;
  out.drask_expanded=/Stovas|Lenta|Kartonin|Stulpas/.test(txt);
  await page.screenshot({ path:"screenshots/cmp_drask_desktop.png", clip:{x:90,y:130,width:420,height:560} });
} catch(e){ out.drask_err=String(e).slice(0,100); }
await b.close();
fs.writeFileSync("screenshots/cmp_drask_desktop.txt", JSON.stringify(out,null,1));
