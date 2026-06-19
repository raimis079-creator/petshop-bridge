import { execSync } from "child_process";
import fs from "fs";
fs.mkdirSync("screenshots", { recursive: true });
const base = "https://dev.avesa.lt";
const passClean = (process.env.WP_APP_PASS || "").replace(/\s+/g, "");
const env = { ...process.env, WP_PASS_CLEAN: passClean };
function wc(path){ return JSON.parse(execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "${base}/wp-json/wc/v3/${path}"`,{encoding:"utf8",env,maxBuffer:20*1024*1024})); }
const out = {};
try {
  const cats = wc("products/categories?per_page=100&search=kraik");
  out.kraik_cats = cats.map(c=>({id:c.id,name:c.name,slug:c.slug,count:c.count,parent:c.parent}));
  // ir tualetai (galimas overlap)
  const cats2 = wc("products/categories?per_page=100&search=tualet");
  out.tualet_cats = cats2.map(c=>({id:c.id,name:c.name,slug:c.slug,count:c.count,parent:c.parent}));
} catch(e){ out.cat_err = String(e).slice(0,150); }
// produktus is didziausios kraikai kategorijos
try {
  const cats = wc("products/categories?per_page=100&search=kraik");
  // imam katems kraika (ne grauzikams)
  const target = cats.filter(c=>!/grauzik|narveli/i.test(c.slug)).sort((a,b)=>b.count-a.count)[0];
  if (target) {
    out.target = {id:target.id, slug:target.slug, name:target.name, count:target.count};
    let all=[];
    for (let p=1;p<=3;p++){
      const prods = wc(`products?category=${target.id}&per_page=100&page=${p}&status=any&_fields=id,name`);
      all=all.concat(prods.map(x=>({id:x.id,name:x.name})));
      if (prods.length<100) break;
    }
    out.products = all; out.n = all.length;
  }
} catch(e){ out.prod_err = String(e).slice(0,150); }
fs.writeFileSync("screenshots/kraikai.txt", JSON.stringify(out, null, 2));
