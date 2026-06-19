import { chromium } from "playwright";
import fs from "fs";
const url = process.argv[2];
fs.mkdirSync("screenshots", { recursive: true });
const b = await chromium.launch({ args: ["--no-sandbox"] });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36", locale: "lt-LT", ignoreHTTPSErrors: true });
const page = await ctx.newPage();
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
try { await page.waitForLoadState("networkidle", { timeout: 15000 }); } catch {}
await page.waitForTimeout(2800);
const m = await page.evaluate(() => {
  const res = {};
  // PILNAS JS markeriai (ps-niche, ps-collapsed, data-ps-init)
  res.pilnas_js_active = !!document.querySelector(".yith-wcan-filter[data-ps-init], .yith-wcan-filter.ps-niche, .yith-wcan-filter.ps-collapsed");
  res.ps_niche_count = document.querySelectorAll(".yith-wcan-filter.ps-niche").length;
  res.ps_init_count = document.querySelectorAll(".yith-wcan-filter[data-ps-init]").length;
  // spacing (v13 CSS markeris)
  const filt = [...document.querySelectorAll(".yith-wcan-filters .yith-wcan-filter")].find(f => f.querySelector("li"));
  if (filt) {
    const ul = filt.querySelector("ul");
    const lis = [...ul.children].filter(e => e.tagName === "LI");
    if (lis.length >= 2) res.rowPitch_px = Math.round(lis[1].getBoundingClientRect().top - lis[0].getBoundingClientRect().top);
    const lab = filt.querySelector("li label, li a");
    if (lab) { const L = getComputedStyle(lab); res.label_display = L.display; res.label_lineHeight = L.lineHeight; }
  }
  // shop-sidebar vieta (desktop turi likti kolonoje)
  const sb = document.getElementById("shop-sidebar");
  res.shop_sidebar_parent = sb && sb.parentElement ? (sb.parentElement.tagName + "." + (sb.parentElement.className||"").split(" ").slice(0,2).join(".")) : "nera";
  res.yith_filters = document.querySelectorAll(".yith-wcan-filters").length;
  return res;
});
fs.writeFileSync("screenshots/pstate.txt", JSON.stringify(m, null, 2));
await b.close();
