import { chromium } from "playwright";
import fs from "fs";
const base = process.argv[2];
fs.mkdirSync("screenshots", { recursive: true });
const b = await chromium.launch({ args: ["--no-sandbox"] });
const ctx = await b.newContext({ viewport: { width: 1440, height: 1000 }, userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36", locale: "lt-LT", ignoreHTTPSErrors: true });
const page = await ctx.newPage();
await page.goto(base, { waitUntil: "domcontentloaded", timeout: 60000 });
try { await page.waitForLoadState("networkidle", { timeout: 12000 }); } catch {}
await page.waitForTimeout(1500);
// pirmo produkto nuoroda
const links = await page.evaluate(() => {
  const a = document.querySelector(".product-small a.woocommerce-LoopProduct-link, .product-small .name a, p.name.product-title a");
  return a ? a.href : "";
});
const out = { category: base, product_url: links, attributes: [] };
if (links) {
  await page.goto(links, { waitUntil: "domcontentloaded", timeout: 60000 });
  try { await page.waitForLoadState("networkidle", { timeout: 12000 }); } catch {}
  await page.waitForTimeout(1500);
  out.product_title = await page.title();
  out.attributes = await page.evaluate(() => {
    const rows = [];
    document.querySelectorAll(".woocommerce-product-attributes tr, table.shop_attributes tr").forEach(tr => {
      const k = tr.querySelector("th"); const v = tr.querySelector("td");
      if (k && v) rows.push(k.textContent.trim() + ": " + v.textContent.trim().replace(/\s+/g,' '));
    });
    return rows;
  });
}
fs.writeFileSync("screenshots/pcheck.txt", JSON.stringify(out, null, 2));
await b.close();
