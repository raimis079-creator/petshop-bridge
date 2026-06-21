import { chromium } from "playwright";
import { execSync } from "child_process";
import fs from "fs";
fs.mkdirSync("screenshots", { recursive: true });
const base = "https://dev.avesa.lt";
const passClean = (process.env.WP_APP_PASS || "").replace(/\s+/g, "");
const env = { ...process.env, WP_PASS_CLEAN: passClean };
const out = {};
// preseto 34104 filtru struktura per maza diag snippet? Vietoj to - tikrinam ar terms egzistuoja taksonomijoj
try {
  // ar pa_tipas turi termina "Striuke" ir kiek prekiu
  const terms = JSON.parse(execSync(`curl -sk --max-time 25 -u "$WP_USER:$WP_PASS_CLEAN" "${base}/wp-json/wc/v3/products/attributes"`,{encoding:"utf8",env,maxBuffer:5*1024*1024}));
  out.attrs = terms.map(a=>a.slug+":"+a.id);
} catch(e){ out.at_err=String(e).slice(0,60); }
try {
  const b = await chromium.launch({ args:["--no-sandbox"] });
  const ctx = await b.newContext({ viewport:{width:1440,height:1200}, locale:"lt-LT", ignoreHTTPSErrors:true });
  const page = await ctx.newPage();
  await page.goto("https://dev.avesa.lt/kategorija/sunims/apranga-sunims/?nocache="+Date.now(), { waitUntil:"domcontentloaded", timeout:60000 });
  try { await page.waitForLoadState("networkidle",{timeout:15000}); } catch {}
  await page.waitForTimeout(3000);
  out.filters = await page.evaluate(()=>{
    const r=[]; document.querySelectorAll(".yith-wcan-filters .yith-wcan-filter").forEach(f=>{
      const h=f.querySelector(".filter-title");
      r.push({title:h?h.textContent.trim():"?", tax:f.getAttribute("data-taxonomy")||f.className.match(/filter-[a-z_]+/)?.[0]||"", nterms:f.querySelectorAll(".filter-content li").length});
    }); return r;
  });
  // ar yra koks nors elementas su pa_tipas
  out.raw_has_tipas = await page.evaluate(()=> document.body.innerHTML.indexOf('pa_tipas')>=0 || document.body.innerHTML.indexOf('filter_tipas')>=0);
  await page.screenshot({ path:"screenshots/apranga_filtras.png" });
  await b.close();
} catch(e){ out.page_err=String(e).slice(0,100); }
fs.writeFileSync("screenshots/apranga_diag2.txt", JSON.stringify(out,null,2));
