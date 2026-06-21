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
  out.snip332 = s.name; out.has_apranga=(s.code||"").indexOf("apranga-filtras")>=0;
} catch(e){ out.s_err=String(e).slice(0,60); }
try {
  const p = JSON.parse(execSync(`curl -sk --max-time 25 -u "$WP_USER:$WP_PASS_CLEAN" "${base}/wp-json/wc/v3/products/14492?_fields=attributes"`,{encoding:"utf8",env,maxBuffer:5*1024*1024}));
  out.p14492=(p.attributes||[]).map(a=>a.name+":"+(a.options||[]).join("/"));
} catch(e){}
try {
  const b = await chromium.launch({ args:["--no-sandbox"] });
  const ctx = await b.newContext({ viewport:{width:1440,height:1150}, locale:"lt-LT", ignoreHTTPSErrors:true });
  const page = await ctx.newPage();
  await page.goto("https://dev.avesa.lt/kategorija/sunims/apranga-sunims/", { waitUntil:"domcontentloaded", timeout:60000 });
  try { await page.waitForLoadState("networkidle",{timeout:12000}); } catch {}
  await page.waitForTimeout(2200);
  out.count = await page.evaluate(()=> (document.querySelector(".woocommerce-result-count")||{}).textContent?.trim()||"");
  out.filters = await page.evaluate(()=>{
    const r=[]; document.querySelectorAll(".yith-wcan-filters .yith-wcan-filter").forEach(f=>{
      const h=f.querySelector(".filter-title"); const terms=[];
      f.querySelectorAll(".filter-content li").forEach(li=>{const t=(li.querySelector("label,a,span")||li).textContent.trim().replace(/\s+/g,' ');if(t)terms.push(t.slice(0,16));});
      r.push({title:h?h.textContent.trim():"?", niche:f.classList.contains("ps-niche"), terms:terms.slice(0,8)});
    }); return r;
  });
  await page.screenshot({ path:"screenshots/apranga_filtras.png" });
  await b.close();
} catch(e){ out.page_err=String(e).slice(0,100); }
fs.writeFileSync("screenshots/apranga_final.txt", JSON.stringify(out,null,2));
