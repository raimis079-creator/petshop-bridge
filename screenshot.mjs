import { chromium } from "playwright";
import { execSync } from "child_process";
import fs from "fs";
fs.mkdirSync("screenshots", { recursive: true });
const base = "https://dev.avesa.lt";
const passClean = (process.env.WP_APP_PASS || "").replace(/\s+/g, "");
const env = { ...process.env, WP_PASS_CLEAN: passClean };
let prods=[];
for(let p=1;p<=2;p++){
  const r=JSON.parse(execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "${base}/wp-json/wc/v3/products?category=124&per_page=100&page=${p}&status=any&_fields=id,name,images,attributes"`,{encoding:"utf8",env,maxBuffer:25*1024*1024}));
  prods=prods.concat(r.map(x=>{
    const t=(x.attributes||[]).filter(a=>/tipas/i.test(a.name)).map(a=>(a.options||[]).join(",")).join("");
    return {id:x.id,name:x.name,img:(x.images&&x.images[0]?x.images[0].src:""),t};
  }));
  if(r.length<100) break;
}
const cells = prods.map(p=>`<div class="c"><img src="${p.img}"><div class="id">#${p.id} <b>[${p.t||'—'}]</b></div><div class="nm">${(p.name||'').replace(/</g,'').slice(0,46)}</div></div>`).join("");
const html=`<!doctype html><meta charset="utf-8"><style>body{font:12px Arial;margin:0;background:#fff}.grid{display:grid;grid-template-columns:repeat(5,1fr);gap:5px;padding:6px}.c{border:1px solid #ccc;padding:4px;text-align:center}.c img{width:140px;height:140px;object-fit:contain;background:#f6f6f6}.id{margin-top:3px;color:#0a6}.nm{font-size:11px;color:#222;line-height:1.15}</style><div class="grid">${cells}</div>`;
fs.writeFileSync("/tmp/grid.html", html);
const b = await chromium.launch({ args:["--no-sandbox"] });
const page = await (await b.newContext({ viewport:{width:840,height:1000}, ignoreHTTPSErrors:true })).newPage();
await page.goto("file:///tmp/grid.html",{waitUntil:"domcontentloaded",timeout:60000});
await page.evaluate(async()=>{ await Promise.all([...document.images].map(im=>im.complete?1:new Promise(r=>{im.onload=im.onerror=r;}))); });
await page.waitForTimeout(2500);
await page.screenshot({ path:"screenshots/drask_grid_v12.png", fullPage:true });
await b.close();
fs.writeFileSync("screenshots/drask_grid_v12_done.txt", "ok "+prods.length);
