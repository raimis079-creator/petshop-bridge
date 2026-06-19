import { chromium } from "playwright";
import fs from "fs";

const url = process.argv[2];
if (!url) { console.error("Truksta URL"); process.exit(1); }

fs.mkdirSync("screenshots", { recursive: true });

const browser = await chromium.launch();

const UA_DESKTOP = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
const UA_MOBILE = "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1";

async function shot(name, viewport, isMobile) {
  const ctx = await browser.newContext({
    viewport, isMobile, deviceScaleFactor: 1,
    userAgent: isMobile ? UA_MOBILE : UA_DESKTOP,
    locale: "lt-LT",
  });
  const page = await ctx.newPage();
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
  } catch (e) { console.log("goto warn:", e.message); }
  try { await page.waitForLoadState("networkidle", { timeout: 20000 }); } catch {}

  // Scroll per visa puslapi, kad uzsikrautu lazy turinys
  await page.evaluate(async () => {
    await new Promise((res) => {
      let y = 0; const step = 400;
      const t = setInterval(() => {
        window.scrollBy(0, step); y += step;
        if (y >= document.body.scrollHeight - window.innerHeight) { clearInterval(t); res(); }
      }, 150);
    });
  });
  await page.waitForTimeout(2000);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(1500);

  await page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
  await ctx.close();
  console.log("OK:", name);
}

await shot("desktop", { width: 1366, height: 900 }, false);
await shot("mobile", { width: 390, height: 844 }, true);

await browser.close();

fs.writeFileSync("screenshots/info.txt", `url: ${url}\ntime: ${new Date().toISOString()}\n`);
console.log("Done");
