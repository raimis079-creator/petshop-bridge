import { execSync } from "child_process";
import fs from "fs";
fs.mkdirSync("screenshots", { recursive: true });
const base = "https://dev.avesa.lt";
const passClean = (process.env.WP_APP_PASS || "").replace(/\s+/g, "");
const env = { ...process.env, WP_PASS_CLEAN: passClean };
function cs(path) {
  const t = execSync(`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "${base}/wp-json/code-snippets/v1/${path}"`, { encoding: "utf8", env, maxBuffer: 10*1024*1024 });
  return JSON.parse(t);
}
const out = {};
for (const id of [332, 329]) {
  try { const s = cs("snippets/" + id); out["s" + id] = { name: s.name, active: !!s.active, scope: s.scope, code: s.code }; }
  catch (e) { out["s" + id] = { error: String(e).slice(0,150) }; }
}
fs.writeFileSync("screenshots/full332.txt", out.s332 ? out.s332.code || "" : "");
fs.writeFileSync("screenshots/full329.txt", out.s329 ? out.s329.code || "" : "");
fs.writeFileSync("screenshots/meta.txt", JSON.stringify({ s332: { name: out.s332?.name, len: (out.s332?.code||"").length }, s329: { name: out.s329?.name, len: (out.s329?.code||"").length } }, null, 2));
