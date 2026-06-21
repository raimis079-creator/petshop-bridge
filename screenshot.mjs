import { chromium } from "playwright";
import fs from "fs";
fs.mkdirSync("screenshots", { recursive: true });
const b = await chromium.launch({ args:["--no-sandbox"] });
const ctx = await b.newContext({ viewport:{width:1440,height:1200}, locale:"lt-LT", ignoreHTTPSErrors:true });
const page = await ctx.newPage();
await page.goto("https://dev.avesa.lt/kategorija/sunims/apranga-sunims/", { waitUntil:"domcontentloaded", timeout:60000 });
try { await page.waitForLoadState("networkidle",{timeout:15000}); } catch {}
await page.waitForTimeout(2500);
const out = {};
out.count = await page.evaluate(()=> (document.querySelector(".woocommerce-result-count")||{}).textContent?.trim()||"");
out.filters = await page.evaluate(()=>{
  const r=[]; document.querySelectorAll(".yith-wcan-filters .yith-wcan-filter").forEach(f=>{
    const h=f.querySelector(".filter-title"); const terms=[];
    f.querySelectorAll(".filter-content li").forEach(li=>{const t=(li.querySelector("label,a,span")||li).textContent.trim().replace(/\s+/g,' ');if(t)terms.push(t.slice(0,18));});
    r.push({title:h?h.textContent.trim():"?", tax:f.getAttribute("data-taxonomy")||"", niche:f.classList.contains("ps-niche"), collapsed:f.classList.contains("ps-collapsed"), terms:terms.slice(0,8)});
  }); return r;
});
await page.screenshot({ path:"screenshots/apranga_filtras.png" });
await b.close();
fs.writeFileSync("screenshots/apranga_done.txt", JSON.stringify(out,null,2));
