import { chromium } from "playwright";
import { execSync } from "child_process";
import fs from "fs";
fs.mkdirSync("screenshots", { recursive: true });
const base = "https://dev.avesa.lt";
const passClean = (process.env.WP_APP_PASS || "").replace(/\s+/g, "");
const env = { ...process.env, WP_PASS_CLEAN: passClean };
function wc(p){ return JSON.parse(execSync(`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "${base}/wp-json/wc/v3/${p}"`,{encoding:"utf8",env,maxBuffer:10*1024*1024})); }
const out = {};
// 1) apranga + Sunims kat nustatymai
try {
  const ap = wc("products/categories/305");
  out.apranga = {id:ap.id,name:ap.name,slug:ap.slug,parent:ap.parent,count:ap.count,menu_order:ap.menu_order,display:ap.display};
  const sun = wc("products/categories/70");
  out.sunims = {id:sun.id,name:sun.name,slug:sun.slug,parent:sun.parent,count:sun.count,display:sun.display};
} catch(e){ out.cat_err=String(e).slice(0,80); }
// 2) Sunims pokategoriai (parent=70)
try {
  const subs = wc("products/categories?parent=70&per_page=100&orderby=menu_order&_fields=id,name,slug,count,menu_order,display");
  out.sunims_subs = subs.map(s=>({id:s.id,name:s.name,slug:s.slug,count:s.count,mo:s.menu_order,disp:s.display}));
} catch(e){ out.subs_err=String(e).slice(0,80); }
// 3) Meniu po SUNIMS (homepage nav)
try {
  const b = await chromium.launch({ args:["--no-sandbox"] });
  const ctx = await b.newContext({ viewport:{width:1440,height:1000}, locale:"lt-LT", ignoreHTTPSErrors:true });
  const page = await ctx.newPage();
  await page.goto(base+"/?z="+Date.now(), { waitUntil:"domcontentloaded", timeout:60000 });
  await page.waitForTimeout(2500);
  // top meniu top-level + SUNIMS submenu
  out.nav = await page.evaluate(()=>{
    const res={top:[],sunims_sub:[]};
    document.querySelectorAll("header li.menu-item > a, header nav li > a").forEach(()=>{});
    // top-level
    const items=document.querySelectorAll("ul.header-nav > li, ul.nav > li.menu-item");
    items.forEach(li=>{
      const a=li.querySelector(":scope > a"); if(!a) return;
      const txt=a.textContent.trim();
      res.top.push(txt);
      if(/sunims/i.test(txt) || /šunims/i.test(txt)){
        li.querySelectorAll("ul li > a").forEach(sa=>res.sunims_sub.push(sa.textContent.trim()));
      }
    });
    return res;
  });
  // 4) Sunims kategorijos puslapis - pokategoriju plyteles
  await page.goto(base+"/kategorija/sunims/?z="+Date.now(), { waitUntil:"domcontentloaded", timeout:60000 });
  await page.waitForTimeout(2500);
  out.sunims_page_tiles = await page.evaluate(()=>{
    const t=[]; document.querySelectorAll(".product-category a, li.product-category h2, .category-grid a").forEach(a=>{const x=a.textContent.trim(); if(x)t.push(x);}); return [...new Set(t)];
  });
  await page.screenshot({ path:"screenshots/sunims_page.png", fullPage:false });
  await b.close();
} catch(e){ out.nav_err=(e.stderr||String(e)).slice(0,120); }
fs.writeFileSync("screenshots/apranga_diag.txt", JSON.stringify(out,null,2));
