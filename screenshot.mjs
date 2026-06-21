import { execSync } from "child_process";
import fs from "fs";
fs.mkdirSync("screenshots", { recursive: true });
const base = "https://dev.avesa.lt";
const passClean = (process.env.WP_APP_PASS || "").replace(/\s+/g, "");
const env = { ...process.env, WP_PASS_CLEAN: passClean };
const out = {};
// 1) snippet 332 busena
try {
  const s = JSON.parse(execSync(`curl -sk --max-time 25 -u "$WP_USER:$WP_PASS_CLEAN" "${base}/wp-json/code-snippets/v1/snippets/332"`,{encoding:"utf8",env,maxBuffer:5*1024*1024}));
  out.snip332_name = s.name; out.snip332_has_apranga = (s.code||"").indexOf("apranga-filtras")>=0;
} catch(e){ out.s_err=String(e).slice(0,80); }
// 2) sample produktu atributai
try {
  const samples = [14492,14108,14078];
  out.products = samples.map(id=>{
    const p = JSON.parse(execSync(`curl -sk --max-time 25 -u "$WP_USER:$WP_PASS_CLEAN" "${base}/wp-json/wc/v3/products/${id}?_fields=id,name,attributes"`,{encoding:"utf8",env,maxBuffer:5*1024*1024}));
    const attrs = (p.attributes||[]).map(a=>a.name+":"+(a.options||[]).join("/"));
    return {id:p.id, name:(p.name||"").slice(0,35), attrs};
  });
} catch(e){ out.p_err=String(e).slice(0,80); }
// 3) ar apranga-filtras presetas yra (per modulio snippet liste paieska netinka; tikrinam per kategorijos psl. veliau)
fs.writeFileSync("screenshots/apranga_state.txt", JSON.stringify(out,null,2));
