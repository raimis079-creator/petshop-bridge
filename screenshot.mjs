import { execSync } from "child_process";
import fs from "fs";
fs.mkdirSync("screenshots", { recursive: true });
const base = "https://dev.avesa.lt";
const passClean = (process.env.WP_APP_PASS || "").replace(/\s+/g, "");
const env = { ...process.env, WP_PASS_CLEAN: passClean };
const out = {};
try {
  const ap = execSync(`curl -sk --max-time 70 "${base}/?petshop_attr_drask=apply&confirm=APPLY&k=ps2026"`,{encoding:"utf8",env,maxBuffer:10*1024*1024});
  const m = ap.match(/Viso:.*?REVIEW: <b>\d+<\/b>/s);
  out.apply_summary = m ? m[0].replace(/<[^>]+>/g,'') : ap.slice(0,120);
} catch(e){ out.apply_err=(e.stderr||String(e)).slice(0,120); }
try {
  out.check = [23320,20274,14211].map(id=>{
    const p = JSON.parse(execSync(`curl -sk --max-time 25 -u "$WP_USER:$WP_PASS_CLEAN" "${base}/wp-json/wc/v3/products/${id}?_fields=id,attributes"`,{encoding:"utf8",env,maxBuffer:5*1024*1024}));
    return {id, t:(p.attributes||[]).map(a=>a.name+":"+(a.options||[]).join("/")).filter(x=>x.indexOf('Tipas')>=0||x.indexOf('Gyv')>=0)};
  });
} catch(e){ out.check_err=(e.stderr||String(e)).slice(0,80); }
fs.writeFileSync("screenshots/drask_apply_"+Date.now()+".txt", JSON.stringify(out,null,2));
fs.writeFileSync("screenshots/drask_apply.txt", JSON.stringify(out,null,2));
