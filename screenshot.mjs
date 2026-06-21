import { execSync } from "child_process";
import fs from "fs";
fs.mkdirSync("screenshots", { recursive: true });
const base = "https://dev.avesa.lt";
const passClean = (process.env.WP_APP_PASS || "").replace(/\s+/g, "");
const env = { ...process.env, WP_PASS_CLEAN: passClean };
const out = { t: new Date().toISOString() };
try {
  const r = execSync(`curl -sk --max-time 25 -u "$WP_USER:$WP_PASS_CLEAN" "${base}/wp-json/wc/v3/products/categories/305?_fields=id,name,count"`,{encoding:"utf8",env});
  out.cat = JSON.parse(r);
} catch(e){ out.err=(e.stderr||String(e)).slice(0,80); }
fs.writeFileSync("screenshots/speedtest.txt", JSON.stringify(out,null,2));
