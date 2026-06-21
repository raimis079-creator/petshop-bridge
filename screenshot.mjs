import { chromium } from "playwright";
import { execSync } from "child_process";
import fs from "fs";
fs.mkdirSync("screenshots", { recursive: true });
const base = "https://dev.avesa.lt";
const passClean = (process.env.WP_APP_PASS || "").replace(/\s+/g, "");
const env = { ...process.env, WP_PASS_CLEAN: passClean };
const out = {};
try {
  const s = JSON.parse(execSync(`curl -sk --max-time 25 -u "$WP_USER:$WP_PASS_CLEAN" "${base}/wp-json/code-snippets/v1/snippets/332"`,{encoding:"utf8",env,maxBuffer:5*1024*1024}));
  out.snip332 = s.name; out.has_drask=(s.code||"").indexOf("draskykliu-filtras")>=0;
} catch(e){ out.s_err=(e.stderr||String(e)).slice(0,60); }
try {
  const b = await chromium.launch({ args:["--no-sandbox"] });
  const ctx = await b.newContext({ viewport:{width:1440,height:1200}, locale:"lt-LT", ignoreHTTPSErrors:true });
  const page = await ctx.newPage();
  await page.goto("https://dev.avesa.lt/kategorija/katems/draskykles-katems/?nocache="+Date.now(), { waitUntil:"domcontentloaded", timeout:60000 });
  try { await page.waitForLoadState("networkidle",{timeout:14000}); } catch {}
  await page.waitForTimeout(3000);
  out.count = await page.evaluate(()=> (document.querySelector(".woocommerce-result-count")||{}).textContent?.trim()||"");
  out.filters = await page.evaluate(()=>{
    const r=[]; document.querySelectorAll(".yith-wcan-filters .yith-wcan-filter").forEach(f=>{
      const h=f.querySelector(".filter-title");
      r.push({title:h?h.textContent.trim():"?", tax:f.getAttribute("data-taxonomy")||"", niche:f.classList.contains("ps-niche"), nterms:f.querySelectorAll(".filter-content li").length});
    }); return r;
  });
  await page.screenshot({ path:"screenshots/draskykles_filtras.png" });
  await b.close();
} catch(e){ out.page_err=(e.stderr||String(e)).slice(0,100); }
fs.writeFileSync("screenshots/drask_verify_"+Date.now()+".txt", JSON.stringify(out,null,2));
fs.writeFileSync("screenshots/drask_verify.txt", JSON.stringify(out,null,2));
