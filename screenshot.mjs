import { chromium } from "playwright";
import { execSync } from "child_process";
import fs from "fs";
fs.mkdirSync("screenshots", { recursive: true });
const base = "https://dev.avesa.lt";
const passClean = (process.env.WP_APP_PASS || "").replace(/\s+/g, "");
const env = { ...process.env, WP_PASS_CLEAN: passClean };
const out = {};
let prods=[];
try {
  for(let p=1;p<=2;p++){
    const r=JSON.parse(execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "${base}/wp-json/wc/v3/products?category=124&per_page=100&page=${p}&status=any&_fields=id,name,images,attributes"`,{encoding:"utf8",env,maxBuffer:25*1024*1024}));
    prods=prods.concat(r.map(x=>{
      const t=(x.attributes||[]).filter(a=>/tipas/i.test(a.name)).map(a=>(a.options||[]).join(",")).join("");
      return {id:x.id,name:x.name,img:(x.images&&x.images[0]?x.images[0].src:""),t};
    }));
    if(r.length<100) break;
  }
  out.n=prods.length;
} catch(e){ out.err=String(e).slice(0,100); }
// HTML tinklelis
const cells = prods.map(p=>`<div class="c"><img src="${p.img}" loading="eager"><div class="id">#${p.id} <b>[${p.t||'—'}]</b></div><div class="nm">${(p.name||'').replace(/</g,'')}</div></div>`).join("");
const html=`<!doctype html><meta charset="utf-8"><style>
body{font:12px Arial;margin:0;background:#fff}
.grid{display:grid;grid-template-columns:repeat(5,1fr);gap:6px;padding:8px}
.c{border:1px solid #ccc;padding:5px;text-align:center}
.c img{width:150px;height:150px;object-fit:contain;background:#f7f7f7}
.id{margin-top:4px;color:#0a6}.nm{font-size:11px;color:#333;line-height:1.2;margin-top:2px}
</style><div class="grid">${cells}</div>`;
fs.writeFileSync("/tmp/grid.html", html);
try {
  const b = await chromium.launch({ args:["--no-sandbox"] });
  const page = await (await b.newContext({ viewport:{width:820,height:1000}, ignoreHTTPSErrors:true })).newPage();
  await page.goto("file:///tmp/grid.html", { waitUntil:"networkidle", timeout:60000 });
  await page.waitForTimeout(4000);
  await page.screenshot({ path:"screenshots/drask_grid.png", fullPage:true });
  await b.close();
} catch(e){ out.png_err=(e.stderr||String(e)).slice(0,120); }
fs.writeFileSync("screenshots/drask_grid.txt", JSON.stringify(prods.map(p=>({id:p.id,t:p.t,name:p.name})),null,1));
