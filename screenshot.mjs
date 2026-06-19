import { chromium } from "playwright";
import fs from "fs";
const url = process.argv[2];
fs.mkdirSync("screenshots", { recursive: true });
const b = await chromium.launch({ args: ["--no-sandbox"] });
const ctx = await b.newContext({ viewport: { width: 1440, height: 1000 }, userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36", locale: "lt-LT", ignoreHTTPSErrors: true });
const page = await ctx.newPage();
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
try { await page.waitForLoadState("networkidle", { timeout: 15000 }); } catch {}
await page.waitForTimeout(2500);
const info = await page.evaluate(() => {
  const out = {};
  out.title = document.title;
  out.count = (document.querySelector(".woocommerce-result-count")||{}).textContent || "";
  // YITH filtru blokai + ju terminai
  const filters = [];
  document.querySelectorAll(".yith-wcan-filters .yith-wcan-filter").forEach(f => {
    const h = f.querySelector(".filter-title");
    const terms = [];
    f.querySelectorAll(".filter-content li").forEach(li => {
      const t = (li.querySelector(".term-label, label, a, span") || li).textContent.trim();
      if (t) terms.push(t.replace(/\s+/g,' ').slice(0,40));
    });
    filters.push({ title: h ? h.textContent.trim() : "?", terms: terms.slice(0,20) });
  });
  out.filters = filters;
  out.pilnas_js = !!document.querySelector(".yith-wcan-filter[data-ps-init], .ps-niche");
  return out;
});
fs.writeFileSync("screenshots/zverify.txt", JSON.stringify(info, null, 2));
await page.screenshot({ path: "screenshots/desktop.png", fullPage: true });
await b.close();
