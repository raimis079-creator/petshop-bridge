import { chromium } from "playwright";
import fs from "fs";

const url = process.argv[2];
fs.mkdirSync("screenshots", { recursive: true });

const browser = await chromium.launch({ args: ["--no-sandbox"] });
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, userAgent: UA, locale: "lt-LT", ignoreHTTPSErrors: true });
const page = await ctx.newPage();
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
try { await page.waitForLoadState("networkidle", { timeout: 15000 }); } catch {}
await page.waitForTimeout(2500);

const info = await page.evaluate(() => {
  const out = {};
  const sb = document.getElementById("shop-sidebar");
  out.shop_sidebar_exists = !!sb;
  if (sb) {
    const cs = getComputedStyle(sb);
    out.parent = sb.parentElement ? (sb.parentElement.tagName + "." + (sb.parentElement.className||"").split(" ").slice(0,2).join(".")) : "?";
    out.display = cs.display;
    out.visibility = cs.visibility;
    out.in_body_direct = sb.parentElement === document.body;
    const r = sb.getBoundingClientRect();
    out.rect = { w: Math.round(r.width), h: Math.round(r.height), x: Math.round(r.x), y: Math.round(r.y) };
  }
  out.yith_filters = document.querySelectorAll(".yith-wcan-filters").length;
  out.has_left_sidebar = !!document.querySelector(".sidebar-inner, .shop-sidebar, #secondary, .col.large-3");
  out.body_class = document.body.className.slice(0, 300);
  const fb = document.querySelector("a.filter-button, [data-open='#shop-sidebar']");
  out.filter_button = fb ? (getComputedStyle(fb).display + " | " + fb.textContent.trim().slice(0,30)) : "NERA";
  return out;
});

fs.writeFileSync("screenshots/filter-diag.txt", JSON.stringify(info, null, 2));
await page.screenshot({ path: "screenshots/desktop.png", fullPage: true });
await browser.close();
console.log("Done");
