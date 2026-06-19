import { chromium } from "playwright";
import fs from "fs";
const base = process.argv[2];
fs.mkdirSync("screenshots", { recursive: true });
const b = await chromium.launch({ args: ["--no-sandbox"] });
const ctx = await b.newContext({ viewport: { width: 1440, height: 1200 }, userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36", locale: "lt-LT", ignoreHTTPSErrors: true });
const page = await ctx.newPage();
const all = new Set();
let count = "", finalUrl = "", reached = 0;
for (let n = 1; n <= 6; n++) {
  const url = n === 1 ? base : base.replace(/\/$/, "") + "/page/" + n + "/";
  let ok = true;
  try {
    const r = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
    if (r) { reached = r.status(); finalUrl = page.url(); }
  } catch (e) { ok = false; }
  if (!ok) break;
  try { await page.waitForLoadState("networkidle", { timeout: 12000 }); } catch {}
  await page.waitForTimeout(800);
  const data = await page.evaluate(() => {
    const sels = ".product-small .name a, p.name.product-title a, .woocommerce-loop-product__title, .product-title a, .box-text .name a";
    const out = [];
    document.querySelectorAll(sels).forEach(e => { const t = e.textContent.trim(); if (t) out.push(t); });
    const rc = document.querySelector(".woocommerce-result-count");
    return { titles: out, count: rc ? rc.textContent.trim() : "" };
  });
  if (n === 1) count = data.count;
  if (data.titles.length === 0) break;
  data.titles.forEach(t => all.add(t));
  if (all.size >= 120) break;
}
fs.writeFileSync("screenshots/recon.txt", JSON.stringify({ base, finalUrl, status: reached, count, unique_titles: all.size, titles: [...all] }, null, 2));
await b.close();
