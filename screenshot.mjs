import { execSync } from "child_process";
import fs from "fs";
fs.mkdirSync("screenshots", { recursive: true });
const base = "https://dev.avesa.lt";
const passClean = (process.env.WP_APP_PASS || "").replace(/\s+/g, "");
const env = { ...process.env, WP_PASS_CLEAN: passClean };
function wc(p){ return JSON.parse(execSync(`curl -sk --max-time 35 -u "$WP_USER:$WP_PASS_CLEAN" "${base}/wp-json/wc/v3/${p}"`,{encoding:"utf8",env,maxBuffer:20*1024*1024})); }
const out={};
// rasti sukos/sepeci/zirkl kategorijas
let cats=[],seen={};
for(const q of ["sukos","sepeci","zirkl","sepetys","furminator"]){
  try { const c=wc(`products/categories?per_page=100&search=${q}`); for(const x of c){ if(!seen[x.id]){seen[x.id]=1;cats.push({id:x.id,name:x.name,slug:x.slug,count:x.count,parent:x.parent});} } } catch(e){}
}
out.cats=cats.map(c=>({id:c.id,name:c.name,slug:c.slug,count:c.count}));
const targets=cats.filter(c=>/sukos|sepeci|zirkl/i.test(c.slug));
out.targets=targets.map(t=>({id:t.id,name:t.name,slug:t.slug,count:t.count}));
let prods=[];
for(const t of targets){
  for(let p=1;p<=2;p++){
    const r=wc(`products?category=${t.id}&per_page=100&page=${p}&status=any&_fields=id,name`);
    prods=prods.concat(r.map(x=>({id:x.id,name:x.name,cat:t.slug})));
    if(r.length<100) break;
  }
}
out.n=prods.length; out.products=prods;
fs.writeFileSync("screenshots/sukos_recon.txt", JSON.stringify(out,null,1));
