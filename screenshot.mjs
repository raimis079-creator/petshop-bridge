import { execSync } from "child_process";
import fs from "fs";
fs.mkdirSync("screenshots", { recursive: true });
const base = "https://dev.avesa.lt";
const passClean = (process.env.WP_APP_PASS || "").replace(/\s+/g, "");
const env = { ...process.env, WP_PASS_CLEAN: passClean };
const out = {};
const t0 = Date.now();
try {
  const code = execSync(`curl -sk -o /tmp/ap.html -w "%{http_code}" --max-time 100 "${base}/?petshop_attr_apranga=apply&confirm=APPLY&k=ps2026"`,{encoding:"utf8",env}).trim();
  out.http = code;
  out.secs = Math.round((Date.now()-t0)/1000);
  const body = fs.readFileSync("/tmp/ap.html","utf8");
  out.body_len = body.length;
  const m = body.match(/Viso:.*?REVIEW: <b>\d+<\/b>/s);
  out.summary = m ? m[0].replace(/<[^>]+>/g,'') : body.slice(0,300);
  out.applied = /APPLY \(irasyta\)/.test(body);
} catch(e){ out.err = String(e).slice(0,200); out.secs = Math.round((Date.now()-t0)/1000); }
fs.writeFileSync("screenshots/apranga_applyonly.txt", JSON.stringify(out,null,2));
