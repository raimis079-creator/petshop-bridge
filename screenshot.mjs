import { chromium } from "playwright";
import fs from "fs";
fs.mkdirSync("screenshots", { recursive: true });
const url = "https://dev.avesa.lt/kategorija/sunims/zaislai-sunims/";
const b = await chromium.launch({ args: ["--no-sandbox"] });
const ctx = await b.newContext({ viewport: { width: 1440, height: 1100 }, userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36", locale: "lt-LT", ignoreHTTPSErrors: true });
const page = await ctx.newPage();
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
try { await page.waitForLoadState("networkidle", { timeout: 15000 }); } catch {}
await page.waitForTimeout(2500);
const info = await page.evaluate(() => {
  const out = { filters: [] };
  out.count = (document.querySelector(".woocommerce-result-count")||{}).textContent?.trim() || "";
  document.querySelectorAll(".yith-wcan-filters .yith-wcan-filter, .yith-wcan-filters .filter").forEach(f => {
    const h = f.querySelector(".filter-title, .filter-name");
    const terms = [];
    f.querySelectorAll(".filter-content li, .filter-content option").forEach(li => {
      const t = (li.querySelector(".term-name, label, a, span") || li).textContent.trim().replace(/\s+/g,' ');
      if (t) terms.push(t.slice(0,30));
    });
    out.filters.push({ title: h ? h.textContent.trim() : "?", n: terms.length, terms: terms.slice(0,12) });
  });
  return out;
});
fs.writeFileSync("screenshots/zfinal.txt", JSON.stringify(info, null, 2));
await page.screenshot({ path: "screenshots/zaislai_final.png", fullPage: false });
await b.close();
