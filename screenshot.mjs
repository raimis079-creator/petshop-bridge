import { chromium } from "playwright";
import { execSync } from "child_process";
import fs from "fs";
fs.mkdirSync("screenshots", { recursive: true });
const base = "https://dev.avesa.lt";
const passClean = (process.env.WP_APP_PASS || "").replace(/\s+/g, "");
const env = { ...process.env, WP_PASS_CLEAN: passClean };
const out = {};
try { out.apply = JSON.parse(execSync(`curl -sk --max-time 45 "${base}/?ps_menu_apranga=1&confirm=APPLY&k=ps2026"`,{encoding:"utf8",env,maxBuffer:5*1024*1024})); } catch(e){ out.apply_err=(e.stderr||String(e)).slice(0,120); }
// patikra: gyvas meniu po SUNIMS
try {
  const b = await chromium.launch({ args:["--no-sandbox"] });
  const ctx = await b.newContext({ viewport:{width:1440,height:1000}, locale:"lt-LT", ignoreHTTPSErrors:true });
  const page = await ctx.newPage();
  await page.goto(base+"/?z="+Date.now(), { waitUntil:"domcontentloaded", timeout:60000 });
  await page.waitForTimeout(2500);
  out.aksesuarai_items = await page.evaluate(()=>{
    let res=[];
    document.querySelectorAll("ul.header-nav li, ul.nav li.menu-item").forEach(li=>{
      const a=li.querySelector(":scope > a"); if(!a) return;
      const t=a.textContent.trim();
      if(/aksesuarai/i.test(t)){
        const kids=[]; li.querySelectorAll("ul li > a").forEach(k=>kids.push(k.textContent.trim()));
        if(kids.length) res.push(kids);
      }
    });
    return res;
  });
  out.apranga_in_menu = JSON.stringify(out.aksesuarai_items).toLowerCase().indexOf("apranga")>=0;
  await b.close();
} catch(e){ out.verify_err=(e.stderr||String(e)).slice(0,120); }
fs.writeFileSync("screenshots/menu_apply.txt", JSON.stringify(out,null,2));
