import { chromium } from "playwright";
import { execSync } from "child_process";
import fs from "fs";
fs.mkdirSync("screenshots", { recursive: true });
const base = "https://dev.avesa.lt";
const out = {};
try {
  const b = await chromium.launch({ args:["--no-sandbox"] });
  const ctx = await b.newContext({ viewport:{width:1440,height:1300}, locale:"lt-LT", ignoreHTTPSErrors:true });
  const page = await ctx.newPage();
  await page.goto(base+"/kategorija/katems/draskykles-katems/?z="+Date.now(), { waitUntil:"domcontentloaded", timeout:60000 });
  try { await page.waitForLoadState("networkidle",{timeout:14000}); } catch {}
  await page.waitForTimeout(2500);
  // filtro terminu skaiciai
  out.tipas_terms = await page.evaluate(()=>{
    const r=[]; document.querySelectorAll(".yith-wcan-filters .yith-wcan-filter").forEach(f=>{
      const h=f.querySelector(".filter-title"); if(!h||!/tipas/i.test(h.textContent))return;
      f.querySelectorAll(".filter-content li").forEach(li=>{ r.push(li.textContent.trim().replace(/\s+/g,' ')); });
    }); return r;
  });
  await page.screenshot({ path:"screenshots/drask_filter_full.png" });
  // paspaudziam "Lenta"
  const clicked = await page.evaluate(()=>{
    const els=[...document.querySelectorAll(".yith-wcan-filters .filter-content li a, .yith-wcan-filters .filter-content li label")];
    const lenta=els.find(e=>/^\s*Lenta\b/i.test(e.textContent.trim()));
    if(lenta){ lenta.click(); return true; } return false;
  });
  out.lenta_clicked = clicked;
  if(clicked){
    try { await page.waitForLoadState("networkidle",{timeout:15000}); } catch {}
    await page.waitForTimeout(3500);
    out.lenta_url = page.url();
    out.lenta_count = await page.evaluate(()=> (document.querySelector(".woocommerce-result-count")||{}).textContent?.trim()||"");
    out.lenta_products = await page.evaluate(()=>{
      const r=[]; document.querySelectorAll("li.product .woocommerce-loop-product__title, li.product h2, .product-title").forEach(t=>{const x=t.textContent.trim();if(x)r.push(x.slice(0,55));}); return r.slice(0,15);
    });
    await page.screenshot({ path:"screenshots/drask_lenta.png" });
  }
  await b.close();
} catch(e){ out.err=(e.stderr||String(e)).slice(0,140); }
fs.writeFileSync("screenshots/drask_visual.txt", JSON.stringify(out,null,2));
