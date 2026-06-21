import { execSync } from "child_process";
import fs from "fs";
fs.mkdirSync("screenshots", { recursive: true });
const base = "https://dev.avesa.lt";
const passClean = (process.env.WP_APP_PASS || "").replace(/\s+/g, "");
const env = { ...process.env, WP_PASS_CLEAN: passClean };
function wc(path){ return JSON.parse(execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "${base}/wp-json/wc/v3/${path}"`,{encoding:"utf8",env,maxBuffer:20*1024*1024})); }
const out = { cats: [] };
const seen={};
for (const q of ["pagalba","sveikat","vaistin","higien","prieziur","veterin","medicin","tvarsl","zaizd","pirmoji"]) {
  try {
    const c = wc(`products/categories?per_page=50&search=${q}`);
    for (const x of c) { if(!seen[x.id]){ seen[x.id]=1; out.cats.push({id:x.id,name:x.name,slug:x.slug,count:x.count,parent:x.parent}); } }
  } catch(e){}
}
// ar yra kitu "itvaras" prekiu kitur kataloge?
try {
  const pr = wc(`products?search=itvaras&per_page=20&status=any&_fields=id,name,categories`);
  out.itvaras_products = pr.map(p=>({id:p.id,name:p.name,cats:(p.categories||[]).map(c=>c.id+':'+c.name)}));
} catch(e){ out.ip_err=String(e).slice(0,100); }
fs.writeFileSync("screenshots/health_cats.txt", JSON.stringify(out, null, 2));
