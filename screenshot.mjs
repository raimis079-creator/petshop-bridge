import { execSync } from "child_process";
import fs from "fs";
fs.mkdirSync("screenshots", { recursive: true });
const base = "https://dev.avesa.lt";
const passClean = (process.env.WP_APP_PASS || "").replace(/\s+/g, "");
const env = { ...process.env, WP_PASS_CLEAN: passClean };
const out = {};
try {
  const p = JSON.parse(execSync(`curl -sk --max-time 25 -u "$WP_USER:$WP_PASS_CLEAN" "${base}/wp-json/wc/v3/products/14492?_fields=id,attributes"`,{encoding:"utf8",env,maxBuffer:5*1024*1024}));
  out.p14492 = (p.attributes||[]).map(a=>a.name+":"+(a.options||[]).join("/"));
} catch(e){ out.err=String(e).slice(0,80); }
// taip pat tikrinam ar Engine pluginas turi petshop_attr_apply funkcija, per maza diagnostini endpoint'a:
try {
  const code = execSync(`curl -sk -o /tmp/d.html -w "%{http_code}" --max-time 30 "${base}/?petshop_attr_apranga=dry&k=ps2026"`,{encoding:"utf8",env}).trim();
  out.dry_http = code;
  const body=fs.readFileSync("/tmp/d.html","utf8");
  const m=body.match(/Viso:.*?REVIEW: <b>\d+<\/b>/s);
  out.dry_summary = m?m[0].replace(/<[^>]+>/g,''):body.slice(0,120);
} catch(e){ out.dry_err=String(e).slice(0,80); }
fs.writeFileSync("screenshots/apranga_recheck.txt", JSON.stringify(out,null,2));
