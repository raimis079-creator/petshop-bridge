import { execSync } from "child_process";
import fs from "fs";
fs.mkdirSync("screenshots", { recursive: true });
const base = "https://dev.avesa.lt";
const passClean = (process.env.WP_APP_PASS || "").replace(/\s+/g, "");
const env = { ...process.env, WP_PASS_CLEAN: passClean };
function wc(path){ return JSON.parse(execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "${base}/wp-json/wc/v3/${path}"`,{encoding:"utf8",env,maxBuffer:20*1024*1024})); }
const out = {};
try {
  let cats=[]; const seen={};
  for (const q of ["draskykl","draskykle","nagu"]) {
    const c = wc(`products/categories?per_page=100&search=${q}`);
    for (const x of c){ if(!seen[x.id]){seen[x.id]=1; cats.push({id:x.id,name:x.name,slug:x.slug,count:x.count,parent:x.parent});} }
  }
  out.cats = cats;
  const target = cats.sort((a,b)=>b.count-a.count)[0];
  if (target){
    out.target={id:target.id,slug:target.slug,name:target.name,count:target.count};
    let all=[];
    for (let p=1;p<=2;p++){
      const prods = wc(`products?category=${target.id}&per_page=100&page=${p}&status=any&_fields=id,name`);
      all=all.concat(prods.map(x=>({id:x.id,name:x.name})));
      if (prods.length<100) break;
    }
    out.products=all; out.n=all.length;
  }
} catch(e){ out.err=String(e).slice(0,150); }
fs.writeFileSync("screenshots/draskykles.txt", JSON.stringify(out, null, 2));
