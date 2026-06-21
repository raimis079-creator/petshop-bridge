import { execSync } from "child_process";
import fs from "fs";
fs.mkdirSync("screenshots", { recursive: true });
const base = "https://dev.avesa.lt";
const passClean = (process.env.WP_APP_PASS || "").replace(/\s+/g, "");
const env = { ...process.env, WP_PASS_CLEAN: passClean };
function wc(path){ return JSON.parse(execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "${base}/wp-json/wc/v3/${path}"`,{encoding:"utf8",env,maxBuffer:20*1024*1024})); }
const out = {};
try {
  let cats = [];
  for (const q of ["apranga","drabuz","rubai","apavas","batai"]) {
    const c = wc(`products/categories?per_page=100&search=${q}`);
    cats = cats.concat(c.map(x=>({id:x.id,name:x.name,slug:x.slug,count:x.count,parent:x.parent})));
  }
  // dedup
  const seen={}; out.cats = cats.filter(c=>{ if(seen[c.id])return false; seen[c.id]=1; return true; });
} catch(e){ out.cat_err = String(e).slice(0,150); }
// produktus is apranga sunims kategorijos (didziausia tinkanti)
try {
  const target = out.cats.filter(c=>/apranga|drabuz|rubai/i.test(c.slug) && /sun/i.test(c.slug+c.name)).sort((a,b)=>b.count-a.count)[0]
    || out.cats.filter(c=>/apranga|drabuz|rubai/i.test(c.slug)).sort((a,b)=>b.count-a.count)[0];
  if (target) {
    out.target = {id:target.id, slug:target.slug, name:target.name, count:target.count};
    let all=[];
    for (let p=1;p<=2;p++){
      const prods = wc(`products?category=${target.id}&per_page=100&page=${p}&status=any&_fields=id,name`);
      all=all.concat(prods.map(x=>({id:x.id,name:x.name})));
      if (prods.length<100) break;
    }
    out.products = all; out.n = all.length;
  }
} catch(e){ out.prod_err = String(e).slice(0,150); }
fs.writeFileSync("screenshots/apranga.txt", JSON.stringify(out, null, 2));
