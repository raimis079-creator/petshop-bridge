import { execSync } from "child_process";
import fs from "fs";
fs.mkdirSync("screenshots", { recursive: true });
const base = "https://dev.avesa.lt";
const passClean = (process.env.WP_APP_PASS || "").replace(/\s+/g, "");
const env = { ...process.env, WP_PASS_CLEAN: passClean };
function wc(path){ return JSON.parse(execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "${base}/wp-json/wc/v3/${path}"`,{encoding:"utf8",env,maxBuffer:20*1024*1024})); }
const out = {};
// 1) surasti zaislai katems kategorija
try {
  const cats = wc("products/categories?per_page=100&search=zaisl");
  out.cat_candidates = cats.map(c=>({id:c.id,name:c.name,slug:c.slug,count:c.count}));
} catch(e){ out.cat_err = String(e).slice(0,150); }
// 2) produktus is zaislai-katems (jei radom id)
try {
  const cats = wc("products/categories?per_page=100&search=zaisl");
  const katems = cats.find(c=>/katem/i.test(c.slug)||/kat\u0117m/i.test(c.name));
  if (katems) {
    out.katems = {id:katems.id, slug:katems.slug, count:katems.count};
    let all = [];
    for (let p=1; p<=3; p++){
      const prods = wc(`products?category=${katems.id}&per_page=100&page=${p}&status=any&_fields=id,name`);
      all = all.concat(prods.map(x=>({id:x.id,name:x.name})));
      if (prods.length < 100) break;
    }
    out.products = all;
    out.n = all.length;
  } else { out.no_katems = true; }
} catch(e){ out.prod_err = String(e).slice(0,150); }
fs.writeFileSync("screenshots/katems.txt", JSON.stringify(out, null, 2));
