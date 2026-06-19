import { chromium } from "playwright";
import fs from "fs";

const url = process.argv[2];
if (!url) { console.error("Truksta URL"); process.exit(1); }
fs.mkdirSync("screenshots", { recursive: true });

const browser = await chromium.launch({ args: ["--no-sandbox"] });
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

const ctx = await browser.newContext({
  viewport: { width: 1366, height: 900 },
  userAgent: UA,
  locale: "lt-LT",
  ignoreHTTPSErrors: true,
});
const page = await ctx.newPage();

let status = 0, err = "";
try {
  const r = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
  status = r ? r.status() : 0;
} catch (e) { err = e.message; }
try { await page.waitForLoadState("networkidle", { timeout: 15000 }); } catch {}
await page.waitForTimeout(3000);

const title = await page.title();
const html = await page.content();
const finalUrl = page.url();

fs.writeFileSync("screenshots/page.html", html);
fs.writeFileSync("screenshots/diag.txt",
  `requested: ${url}\nfinal: ${finalUrl}\nstatus: ${status}\nerror: ${err}\ntitle: ${title}\nhtml_len: ${html.length}\n`);

await page.screenshot({ path: "screenshots/desktop.png", fullPage: true });
await browser.close();
console.log("status", status, "err", err);
