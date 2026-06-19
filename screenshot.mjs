import { chromium } from "playwright";
import fs from "fs";

const url = process.argv[2];
if (!url) { console.error("Truksta URL"); process.exit(1); }

fs.mkdirSync("screenshots", { recursive: true });

const browser = await chromium.launch();

async function shot(name, viewport, isMobile) {
  const ctx = await browser.newContext({ viewport, isMobile, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  try {
    await page.goto(url, { waitUntil: "load", timeout: 60000 });
  } catch (e) {
    console.log("goto warn:", e.message);
  }
  await page.waitForTimeout(3500);
  await page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
  await ctx.close();
  console.log("OK:", name);
}

await shot("desktop", { width: 1366, height: 900 }, false);
await shot("mobile", { width: 390, height: 844 }, true);

await browser.close();

fs.writeFileSync(
  "screenshots/info.txt",
  `url: ${url}\ntime: ${new Date().toISOString()}\n`
);
console.log("Done");
