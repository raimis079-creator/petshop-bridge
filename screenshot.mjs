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
  const filt = [...document.querySelectorAll(".yith-wcan-filters .yith-wcan-filter")].find(f => f.querySelector("li"));
  if (!filt) return { err: "no filter with li" };
  res.filter_class = filt.className;
  res.has_filter_content = !!filt.querySelector(".filter-content");
  // visi ul su jU klasem
  res.uls = [...filt.querySelectorAll("ul")].map(u => u.className || "(no-class)");
  const ul = filt.querySelector("ul");
  const li = ul ? ul.querySelector("li") : null;
  if (li) {
    res.ul_class = ul.className || "(no-class)";
    res.li_class = li.className || "(no-class)";
    const lab = li.querySelector("label, a");
    res.label_tag = lab ? lab.tagName : "none";
    res.label_class = lab ? (lab.className || "(no-class)") : "";
    res.label_display = lab ? getComputedStyle(lab).display : "";
    res.label_lineHeight = lab ? getComputedStyle(lab).lineHeight : "";
    // ar nera filter-content tarp ul ir filter?
    res.ul_parent_class = ul.parentElement ? (ul.parentElement.className || ul.parentElement.tagName) : "?";
  }
  const lis = [...ul.children].filter(e => e.tagName === "LI");
  if (lis.length >= 2) {
    res.rowPitch_px = Math.round(lis[1].getBoundingClientRect().top - lis[0].getBoundingClientRect().top);
  }
  // ar v13 selektorius butu pataikes?
  res.test_sel_match = !!filt.querySelector(".filter-content ul:not(.filter-label) li label, .filter-content ul:not(.filter-label) li > a");
  return res;
});
fs.writeFileSync("screenshots/struct.txt", JSON.stringify(m, null, 2));
await b.close();
