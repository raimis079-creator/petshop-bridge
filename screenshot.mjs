import { execSync } from "child_process";
import fs from "fs";
fs.mkdirSync("screenshots", { recursive: true });
const base = "https://dev.avesa.lt";
const passClean = (process.env.WP_APP_PASS || "").replace(/\s+/g, "");
const env = { ...process.env, WP_PASS_CLEAN: passClean };
function wc(p){ return JSON.parse(execSync(`curl -sk --max-time 35 -u "$WP_USER:$WP_PASS_CLEAN" "${base}/wp-json/wc/v3/${p}"`,{encoding:"utf8",env,maxBuffer:20*1024*1024})); }
const out={};
// A) breed prekiu statusas
try {
  out.breeds=[17333,15709,15706,15703,15700,15697,15674,15671,15694,15692,15659,15662,15689].map(id=>{
    const p=wc(`products/${id}?_fields=id,name,status`);
    return {id,st:p.status,n:(p.name||'').slice(0,42)};
  });
} catch(e){ out.breed_err=String(e).slice(0,90); }
// B) preset toggle skirtumas: deploy laikina inspector snippet? Ne - naudosim koda-snippet maker'i kuris ISPAUSDINA _filters
fs.writeFileSync("screenshots/samp_diag.txt", JSON.stringify(out,null,1));
