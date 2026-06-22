import { execSync } from "child_process";
import fs from "fs";
fs.mkdirSync("screenshots", { recursive: true });
const base = "https://dev.avesa.lt";
const passClean = (process.env.WP_APP_PASS || "").replace(/\s+/g, "");
const env = { ...process.env, WP_PASS_CLEAN: passClean };
function wc(p){ return JSON.parse(execSync(`curl -sk --max-time 35 -u "$WP_USER:$WP_PASS_CLEAN" "${base}/wp-json/wc/v3/${p}"`,{encoding:"utf8",env,maxBuffer:20*1024*1024})); }
const out={};
// rasti katems sukos kategorija
let cats=[],seen={};
for(const q of ["sukos","sepeci","zirkl","katem"]){
  try { const c=wc(`products/categories?per_page=100&search=${q}`); for(const x of c){ if(!seen[x.id]){seen[x.id]=1;cats.push(x);} } } catch(e){}
}
const catTargets=cats.filter(c=>/sukos|sepeci|zirkl/i.test(c.slug)&&/katem/i.test(c.slug));
out.cat_categories=catTargets.map(t=>({id:t.id,name:t.name,slug:t.slug,count:t.count}));
let catProds=[];
for(const t of catTargets){
  for(let p=1;p<=2;p++){
    const r=wc(`products?category=${t.id}&per_page=100&page=${p}&status=any&_fields=id,name`);
    catProds=catProds.concat(r.map(x=>({id:x.id,name:x.name})));
    if(r.length<100) break;
  }
}
out.cat_n=catProds.length; out.cat_products=catProds;
// Higienos kategorija (dantu perkelimui)
let hyg=[];
for(const q of ["higien","prieziur"]){
  try { const c=wc(`products/categories?per_page=100&search=${q}`); for(const x of c){ if(/higien/i.test(x.slug)&&/sunim/i.test(x.slug)){ hyg.push({id:x.id,name:x.name,slug:x.slug,count:x.count}); } } } catch(e){}
}
out.higienos_cat = hyg;
// katems aksesuaru kategorija (arkai 14177)
let acc=[];
try { const c=wc(`products/categories?per_page=100&search=aksesuar`); for(const x of c){ if(/katem/i.test(x.slug)){ acc.push({id:x.id,name:x.name,slug:x.slug}); } } } catch(e){}
out.katems_acc = acc;
fs.writeFileSync("screenshots/cat_recon.txt", JSON.stringify(out,null,1));
