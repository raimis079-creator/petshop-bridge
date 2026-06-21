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
function gridHtml(items){
  const cells=items.map(p=>`<div class="c"><img src="${p.img}"><div class="id">#${p.id} <b>[${p.t||'—'}]</b></div><div class="nm">${(p.name||'').replace(/</g,'').slice(0,48)}</div></div>`).join("");
  return `<!doctype html><meta charset="utf-8"><style>body{font:12px Arial;margin:0;background:#fff}.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:5px;padding:6px}.c{border:1px solid #ccc;padding:4px;text-align:center;height:215px;overflow:hidden}.c img{width:140px;height:140px;object-fit:contain;background:#f6f6f6}.id{margin-top:3px;color:#0a6;font-size:12px}.nm{font-size:11px;color:#222;line-height:1.15}</style><div class="grid">${cells}</div>`;
}
const b = await chromium.launch({ args:["--no-sandbox"] });
const ctx = await b.newContext({ viewport:{width:620,height:1600}, ignoreHTTPSErrors:true });
const half=Math.ceil(prods.length/2);
for(const [idx,slice] of [[1,prods.slice(0,half)],[2,prods.slice(half)]]){
  fs.writeFileSync(`/tmp/g${idx}.html`, gridHtml(slice));
  const page=await ctx.newPage();
  await page.goto(`file:///tmp/g${idx}.html`,{waitUntil:"domcontentloaded",timeout:60000});
  // laukti kol VISOS nuotraukos uzsikraus (ar fail)
  await page.evaluate(async()=>{ await Promise.all([...document.images].map(im=>im.complete?1:new Promise(r=>{im.onload=im.onerror=r;}))); });
  await page.waitForTimeout(2500);
  const h=await page.evaluate(()=>document.body.scrollHeight);
  await page.setViewportSize({width:620,height:Math.min(h+20,4500)});
  await page.waitForTimeout(800);
  await page.screenshot({ path:`screenshots/drask_grid${idx}.png` });
  await page.close();
}
await b.close();
fs.writeFileSync("screenshots/drask_grid_done.txt", JSON.stringify({n:prods.length},null,1));
