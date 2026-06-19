import { chromium } from "playwright";
import fs from "fs";
const url = process.argv[2];
fs.mkdirSync("screenshots", { recursive: true });
const b = await chromium.launch({ args: ["--no-sandbox"] });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36", locale: "lt-LT", ignoreHTTPSErrors: true });
const page = await ctx.newPage();
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
try { await page.waitForLoadState("networkidle", { timeout: 15000 }); } catch {}
await page.waitForTimeout(2500);
const m = await page.evaluate(() => {
  const res = {};
  const group = document.querySelector(".yith-wcan-filters .yith-wcan-filter");
  if (group) { const gs = getComputedStyle(group); res.group = { marginBottom: gs.marginBottom, paddingBottom: gs.paddingBottom }; }
  const filt = [...document.querySelectorAll(".yith-wcan-filters .yith-wcan-filter")].find(f => f.querySelector("ul li"));
  if (filt) {
    const ul = filt.querySelector("ul");
    const lis = [...ul.children].filter(e => e.tagName === "LI");
    res.itemCount = lis.length;
    if (lis.length >= 2) {
      const r0 = lis[0].getBoundingClientRect(), r1 = lis[1].getBoundingClientRect();
      res.rowPitch_px = Math.round(r1.top - r0.top);
      res.liHeight_px = Math.round(r0.height);
      const ls = getComputedStyle(lis[0]);
      res.li = { marginBottom: ls.marginBottom, paddingTop: ls.paddingTop, paddingBottom: ls.paddingBottom, minHeight: ls.minHeight, lineHeight: ls.lineHeight };
      const lab = lis[0].querySelector("label, a");
      if (lab) { const L = getComputedStyle(lab); res.label = { lineHeight: L.lineHeight, fontSize: L.fontSize, paddingTop: L.paddingTop, paddingBottom: L.paddingBottom, minHeight: L.minHeight, marginBottom: L.marginBottom, display: L.display }; res.labelTag = lab.tagName; }
    }
  }
  return res;
});
fs.writeFileSync("screenshots/measure.txt", JSON.stringify(m, null, 2));
await b.close();
