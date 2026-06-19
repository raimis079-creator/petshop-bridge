import { execSync } from "child_process";
import { chromium } from "playwright";
import fs from "fs";
fs.mkdirSync("screenshots", { recursive: true });
const base = "https://dev.avesa.lt";
const passClean = (process.env.WP_APP_PASS || "").replace(/\s+/g, "");
const env = { ...process.env, WP_PASS_CLEAN: passClean };
const out = {};
// 1) APPLY per tilta
try {
  const ap = execSync(`curl -sk --max-time 60 "${base}/?petshop_attr_zaislai_k=apply&confirm=APPLY&k=ps2026"`, { encoding: "utf8", env, maxBuffer: 10*1024*1024 });
  const m = ap.match(/Viso:.*?SKIP: <b>\d+<\/b>/s);
  out.apply_summary = m ? m[0].replace(/<[^>]+>/g,'') : ap.slice(0,150);
  out.applied = /APPLY \(irasyta\)/.test(ap);
} catch(e){ out.apply_err = String(e).slice(0,150); }
// 2) VERIFY filtras gyvai (katems puslapis)
try {
  execSync("sleep 3");
  const b = await chromium.launch({ args: ["--no-sandbox"] });
  const ctx = await b.newContext({ viewport: { width: 1440, height: 1100 }, userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36", locale: "lt-LT", ignoreHTTPSErrors: true });
  const page = await ctx.newPage();
  await page.goto("https://dev.avesa.lt/kategorija/katems/zaislai-katems/", { waitUntil: "domcontentloaded", timeout: 60000 });
  let st = page.url();
  // jei 404 - bandom kita slug kelia
  if (await page.locator("body.error404").count() > 0) {
    await page.goto("https://dev.avesa.lt/product-category/zaislai-katems/", { waitUntil: "domcontentloaded", timeout: 60000 });
  }
  try { await page.waitForLoadState("networkidle", { timeout: 15000 }); } catch {}
  await page.waitForTimeout(2500);
  out.url = page.url();
  out.count = await page.evaluate(()=> (document.querySelector(".woocommerce-result-count")||{}).textContent?.trim() || "");
  out.filters = await page.evaluate(() => {
    const r = [];
    document.querySelectorAll(".yith-wcan-filters .yith-wcan-filter").forEach(f => {
      const h = f.querySelector(".filter-title");
      const terms = [];
      f.querySelectorAll(".filter-content li").forEach(li => { const t=(li.querySelector("label,a,span")||li).textContent.trim().replace(/\s+/g,' '); if(t) terms.push(t.slice(0,22)); });
      r.push({ title: h?h.textContent.trim():"?", tax: f.getAttribute("data-taxonomy")||"", niche: f.classList.contains("ps-niche"), collapsed: f.classList.contains("ps-collapsed"), n: terms.length, terms: terms.slice(0,12) });
    });
    return r;
  });
  await page.screenshot({ path: "screenshots/katems_filtras.png", fullPage: false });
  await b.close();
} catch(e){ out.verify_err = String(e).slice(0,200); }
fs.writeFileSync("screenshots/katems_apply.txt", JSON.stringify(out, null, 2));
