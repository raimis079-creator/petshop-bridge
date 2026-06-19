import { chromium } from "playwright";
import fs from "fs";
const url = process.argv[2];
fs.mkdirSync("screenshots", { recursive: true });
const browser = await chromium.launch({ args: ["--no-sandbox"] });
const UA_D = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
const UA_M = "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1";
async function shot(name, viewport, isMobile, ua) {
  const ctx = await browser.newContext({ viewport, isMobile, userAgent: ua, locale: "lt-LT", ignoreHTTPSErrors: true });
  const page = await ctx.newPage();
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
  try { await page.waitForLoadState("networkidle", { timeout: 15000 }); } catch {}
  await page.evaluate(async()=>{await new Promise(r=>{let y=0;const t=setInterval(()=>{window.scrollBy(0,500);y+=500;if(y>=document.body.scrollHeight-window.innerHeight){clearInterval(t);r();}},120);});});
  await page.waitForTimeout(1200);
  await page.evaluate(()=>window.scrollTo(0,0));
  await page.waitForTimeout(700);
  await page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
  await ctx.close();
}
await shot("desktop", { width: 1440, height: 900 }, false, UA_D);
await shot("mobile", { width: 390, height: 844 }, true, UA_M);
await browser.close();
fs.writeFileSync("screenshots/info.txt", `url: ${url}\ntime: ${new Date().toISOString()}\n`);
