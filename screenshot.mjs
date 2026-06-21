import { execSync } from "child_process";
import fs from "fs";
fs.mkdirSync("screenshots", { recursive: true });
const base = "https://dev.avesa.lt";
const passClean = (process.env.WP_APP_PASS || "").replace(/\s+/g, "");
const env = { ...process.env, WP_PASS_CLEAN: passClean };
function wc(path){ return JSON.parse(execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "${base}/wp-json/wc/v3/${path}"`,{encoding:"utf8",env,maxBuffer:20*1024*1024})); }
const out = { found: [] };
const terms = ["medicin","sveikat","pagalb","prieziur","veterin","reabilit","ortoped","tvarst","pirmoji","higien","priemon"];
const seen={};
for (const q of terms) {
  try {
    const c = wc(`products/categories?per_page=100&search=${q}`);
    for (const x of c) { if(!seen[x.id]){ seen[x.id]=1; out.found.push({id:x.id,name:x.name,slug:x.slug,count:x.count,parent:x.parent}); } }
  } catch(e){}
}
fs.writeFileSync("screenshots/medcats.txt", JSON.stringify(out, null, 2));
