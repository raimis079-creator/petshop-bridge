import { execSync } from "child_process";
import fs from "fs";
fs.mkdirSync("screenshots", { recursive: true });
const base = "https://dev.avesa.lt";
const passClean = (process.env.WP_APP_PASS || "").replace(/\s+/g, "");
const env = { ...process.env, WP_PASS_CLEAN: passClean };
function wc(p){ try { return JSON.parse(execSync(`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "${base}/wp-json/wc/v3/${p}"`,{encoding:"utf8",env,maxBuffer:20*1024*1024})); } catch(e){ return []; } }
const out={errs:[]};
let cats=[],seen={};
for(const q of ["sukos","sepeci","zirkl"]){
  const c=wc(`products/categories?per_page=100&search=${q}`);
  if(Array.isArray(c)) for(const x of c){ if(!seen[x.id]){seen[x.id]=1;cats.push(x);} }
}
out.all_grooming_cats = cats.map(c=>({id:c.id,name:c.name,slug:c.slug,count:c.count}));
const catTargets=cats.filter(c=>/katem/i.test(c.slug));
out.cat_categories=catTargets.map(t=>({id:t.id,name:t.name,slug:t.slug,count:t.count}));
let catProds=[];
for(const t of catTargets){
  for(let p=1;p<=2;p++){
    const r=wc(`products?category=${t.id}&per_page=100&page=${p}&status=any&_fields=id,name`);
    if(Array.isArray(r)){ catProds=catProds.concat(r.map(x=>({id:x.id,name:x.name}))); if(r.length<100) break; } else break;
  }
}
out.cat_n=catProds.length; out.cat_products=catProds;
fs.writeFileSync("screenshots/cat_recon2.txt", JSON.stringify(out,null,1));
