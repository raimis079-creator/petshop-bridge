import { execSync } from "child_process";
import fs from "fs";
fs.mkdirSync("screenshots", { recursive: true });
const base = "https://dev.avesa.lt";
const passClean = (process.env.WP_APP_PASS || "").replace(/\s+/g, "");
const env = { ...process.env, WP_PASS_CLEAN: passClean };
const out = {};
const t0=Date.now();
let rc=0;
try {
  execSync(`curl -sk -o /tmp/ap.html -w "%{http_code}|%{time_total}" --max-time 35 "${base}/?petshop_attr_apranga=apply&confirm=APPLY&k=ps2026" > /tmp/meta.txt 2>/tmp/cerr.txt`,{encoding:"utf8",env});
} catch(e){ rc = e.status||-1; }
out.curl_exit = rc;
out.secs = Math.round((Date.now()-t0)/1000);
try { out.meta = fs.readFileSync("/tmp/meta.txt","utf8").slice(0,60); } catch(e){}
try { const b=fs.readFileSync("/tmp/ap.html","utf8"); out.body_len=b.length; out.body_head=b.slice(0,250).replace(/\s+/g,' '); } catch(e){ out.body_err=String(e).slice(0,60); }
fs.writeFileSync("screenshots/apply_diag.txt", JSON.stringify(out,null,2));
