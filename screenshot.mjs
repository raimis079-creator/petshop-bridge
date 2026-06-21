import { chromium } from "playwright";
import { execSync } from "child_process";
import fs from "fs";
fs.mkdirSync("screenshots", { recursive: true });
const base = "https://dev.avesa.lt";
const passClean = (process.env.WP_APP_PASS || "").replace(/\s+/g, "");
const env = { ...process.env, WP_PASS_CLEAN: passClean };
function wc(p){ return JSON.parse(execSync(`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "${base}/wp-json/wc/v3/${p}"`,{encoding:"utf8",env,maxBuffer:10*1024*1024})); }
const out = {};
// 1) apranga kategorija
try {
  const c = wc("products/categories?per_page=100&search=apranga");
  out.cats = c.map(x=>({id:x.id,name:x.name,slug:x.slug,count:x.count,parent:x.parent}));
} catch(e){ out.cat_err=String(e).slice(0,80); }
// 2) preset apranga-filtras
try {
  const s = JSON.parse(execSync(`curl -sk --max-time 25 -u "$WP_USER:$WP_PASS_CLEAN" "${base}/wp-json/code-snippets/v1/snippets/332"`,{encoding:"utf8",env,maxBuffer:5*1024*1024}));
  out.snip332=s.name; out.has_apranga=(s.code||"").indexOf("apranga-filtras")>=0; out.has_drask=(s.code||"").indexOf("draskykliu-filtras")>=0;
} catch(e){ out.s_err=String(e).slice(0,60); }
// 3) puslapis - bandau apranga kategorijos URL (vaikine 305)
let slug = (out.cats||[]).filter(c=>c.slug.indexOf('apranga')>=0).sort((a,b)=>b.count-a.count)[0];
out.target = slug;
try {
  const b = await chromium.launch({ args:["--no-sandbox"] });
  const ctx = await b.newContext({ viewport:{width:1440,height:1100}, locale:"lt-LT", ignoreHTTPSErrors:true });
  const page = await ctx.newPage();
  const url = "https://dev.avesa.lt/kategorija/sunims/"+(slug?slug.slug:"apranga-sunims")+"/?z="+Date.now();
  out.url=url;
  const resp = await page.goto(url, { waitUntil:"domcontentloaded", timeout:60000 });
  out.http = resp ? resp.status() : 0;
  try { await page.waitForLoadState("networkidle",{timeout:14000}); } catch {}
  await page.waitForTimeout(3000);
  out.h1 = await page.evaluate(()=> (document.querySelector("h1")||{}).textContent?.trim()||"");
  out.filters = await page.evaluate(()=>{
    const r=[]; document.querySelectorAll(".yith-wcan-filters .yith-wcan-filter").forEach(f=>{
      const h=f.querySelector(".filter-title");
      r.push({title:h?h.textContent.trim():"?", tax:f.getAttribute("data-taxonomy")||"", nterms:f.querySelectorAll(".filter-content li").length});
    }); return r;
  });
  await page.screenshot({ path:"screenshots/apranga_check.png" });
  await b.close();
} catch(e){ out.page_err=(e.stderr||String(e)).slice(0,120); }
fs.writeFileSync("screenshots/apr_check.txt", JSON.stringify(out,null,2));
