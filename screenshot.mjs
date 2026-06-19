import { chromium } from "playwright";
import fs from "fs";

const url = process.argv[2];
if (!url) { console.error("Truksta URL"); process.exit(1); }
fs.mkdirSync("screenshots", { recursive: true });

const browser = await chromium.launch();
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 }, userAgent: UA, locale: "lt-LT" });
const page = await ctx.newPage();

let status = 0;
try {
  const resp = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
  status = resp ? resp.status() : 0;
} catch (e) { console.log("goto warn:", e.message); }
try { await page.waitForLoadState("networkidle", { timeout: 20000 }); } catch {}
await page.waitForTimeout(3000);

const title = await page.title();
const html = await page.content();
const bodyText = await page.evaluate(() => document.body ? document.body.innerText.slice(0, 1500) : "NO BODY");
const finalUrl = page.url();

fs.writeFileSync("screenshots/page.html", html);
fs.writeFileSync("screenshots/diag.txt",
  `requested: ${url}\nfinal: ${finalUrl}\nstatus: ${status}\ntitle: ${title}\nhtml_len: ${html.length}\n\n--- bodyText ---\n${bodyText}\n`);

await page.screenshot({ path: "screenshots/desktop.png", fullPage: true });
await browser.close();
console.log("Done. status=", status, "title=", title);
