import { chromium } from "playwright";
import fs from "fs";
fs.mkdirSync("screenshots", { recursive: true });
const b = await chromium.launch({ args: ["--no-sandbox"] });
const ctx = await b.newContext({ viewport: { width: 1440, height: 1150 }, userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36", locale: "lt-LT", ignoreHTTPSErrors: true });
const page = await ctx.newPage();
await page.goto("https://dev.avesa.lt/kategorija/katems/kraikai-kaciu-tualetams/", { waitUntil: "domcontentloaded", timeout: 60000 });
try { await page.waitForLoadState("networkidle", { timeout: 15000 }); } catch {}
await page.waitForTimeout(2500);
const out = {};
out.url = page.url();
out.count = await page.evaluate(()=> (document.querySelector(".woocommerce-result-count")||{}).textContent?.trim() || "");
out.filters = await page.evaluate(() => {
  const r = [];
  document.querySelectorAll(".yith-wcan-filters .yith-wcan-filter").forEach(f => {
    const h = f.querySelector(".filter-title");
    const terms = [];
    f.querySelectorAll(".filter-content li").forEach(li => { const t=(li.querySelector("label,a,span")||li).textContent.trim().replace(/\s+/g,' '); if(t) terms.push(t.slice(0,22)); });
    r.push({ title: h?h.textContent.trim():"?", tax: f.getAttribute("data-taxonomy")||"", niche: f.classList.contains("ps-niche"), collapsed: f.classList.contains("ps-collapsed"), terms: terms.slice(0,8) });
  });
  return r;
});
await page.screenshot({ path: "screenshots/kraikai_filtras.png", fullPage: false });
await b.close();
fs.writeFileSync("screenshots/kraikai_verify.txt", JSON.stringify(out, null, 2));
