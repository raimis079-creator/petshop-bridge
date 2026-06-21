import { execSync } from "child_process";
import fs from "fs";
fs.mkdirSync("screenshots", { recursive: true });
const base = "https://dev.avesa.lt";
const passClean = (process.env.WP_APP_PASS || "").replace(/\s+/g, "");
const env = { ...process.env, WP_PASS_CLEAN: passClean };
function wc(p){ return JSON.parse(execSync(`curl -sk --max-time 35 -u "$WP_USER:$WP_PASS_CLEAN" "${base}/wp-json/wc/v3/${p}"`,{encoding:"utf8",env,maxBuffer:20*1024*1024})); }
const out={};
let cats=[],seen={};
for(const q of ["sampun","sampunai","kailio"]){
  try{ const c=wc(`products/categories?per_page=100&search=${q}`); for(const x of c){if(!seen[x.id]){seen[x.id]=1;cats.push({id:x.id,name:x.name,slug:x.slug,count:x.count,parent:x.parent});}} }catch(e){}
}
out.cats=cats;
const tgt=cats.filter(c=>/sampun/i.test(c.slug)||/ampun/i.test(c.name)).sort((a,b)=>b.count-a.count);
out.targets=tgt;
out.products={};
for(const c of tgt){
  let all=[];
  for(let p=1;p<=2;p++){
    const r=wc(`products?category=${c.id}&per_page=100&page=${p}&status=any&_fields=id,name`);
    all=all.concat(r.map(x=>({id:x.id,name:x.name})));
    if(r.length<100)break;
  }
  out.products[c.id]={slug:c.slug,n:all.length,items:all};
}
fs.writeFileSync("screenshots/sampun_recon.txt", JSON.stringify(out,null,1));
