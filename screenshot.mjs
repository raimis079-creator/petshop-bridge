import { execSync } from "child_process";
import fs from "fs";
fs.mkdirSync("screenshots", { recursive: true });
const base = "https://dev.avesa.lt";
const passClean = (process.env.WP_APP_PASS || "").replace(/\s+/g, "");
const env = { ...process.env, WP_PASS_CLEAN: passClean };
const out = {};
// 1) homepage GET (verbose error)
try {
  const r = execSync(`curl -sk -o /dev/null -w "HTTP:%{http_code} time:%{time_total}" --max-time 25 "${base}/" 2>&1`,{encoding:"utf8",env});
  out.home = r;
} catch(e){ out.home_err = (e.stderr||e.message||String(e)).slice(0,150); out.home_status=e.status; }
// 2) wc/v3 read (kaip recon)
try {
  const r = execSync(`curl -sk -o /dev/null -w "HTTP:%{http_code} time:%{time_total}" --max-time 25 -u "$WP_USER:$WP_PASS_CLEAN" "${base}/wp-json/wc/v3/products/categories?per_page=1" 2>&1`,{encoding:"utf8",env});
  out.wc_read = r;
} catch(e){ out.wc_err = (e.stderr||e.message||String(e)).slice(0,150); out.wc_status=e.status; }
// 3) DNS/ping lygis - curl tik connect
try {
  const r = execSync(`curl -sk -o /dev/null -w "connect:%{time_connect} code:%{http_code}" --max-time 15 --connect-timeout 10 "${base}/" 2>&1`,{encoding:"utf8",env});
  out.connect = r;
} catch(e){ out.connect_err=(e.stderr||e.message||String(e)).slice(0,150); }
fs.writeFileSync("screenshots/health.txt", JSON.stringify(out,null,2));
