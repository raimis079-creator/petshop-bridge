import { execSync } from "child_process";
import fs from "fs";
fs.mkdirSync("screenshots", { recursive: true });
const base = "https://dev.avesa.lt";
const passClean = (process.env.WP_APP_PASS || "").replace(/\s+/g, "");
const env = { ...process.env, WP_PASS_CLEAN: passClean };
const out = {};
// 1) Code Snippets REST read
try {
  const code = execSync(`curl -sk -o /tmp/cs.txt -w "%{http_code}" --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "${base}/wp-json/code-snippets/v1/snippets"`, { encoding: "utf8", env }).trim();
  out.snippets_read = { code };
  const t = fs.readFileSync("/tmp/cs.txt", "utf8");
  try { const j = JSON.parse(t); out.snippets_read.count = Array.isArray(j) ? j.length : "obj"; out.snippets_read.sample = Array.isArray(j) ? j.slice(0,4).map(s=>({id:s.id,name:s.name,active:s.active})) : Object.keys(j).slice(0,6); }
  catch (e) { out.snippets_read.head = t.slice(0,160).replace(/\s+/g," "); }
} catch (e) { out.snippets_read = { error: String(e).slice(0,120) }; }
// 2) WC WRITE test: create hidden draft -> delete
try {
  fs.writeFileSync("/tmp/new.json", JSON.stringify({ name: "__bridge_write_test__", type: "simple", status: "draft", catalog_visibility: "hidden" }));
  const cr = execSync(`curl -sk -o /tmp/cr.txt -w "%{http_code}" --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -X POST -d @/tmp/new.json "${base}/wp-json/wc/v3/products"`, { encoding: "utf8", env }).trim();
  out.wc_create = { code: cr };
  let nid = null;
  try { const j = JSON.parse(fs.readFileSync("/tmp/cr.txt","utf8")); nid = j.id; out.wc_create.id = nid; out.wc_create.status = j.status; }
  catch (e) { out.wc_create.head = fs.readFileSync("/tmp/cr.txt","utf8").slice(0,160).replace(/\s+/g," "); }
  if (nid) {
    const del = execSync(`curl -sk -o /tmp/del.txt -w "%{http_code}" --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" -X DELETE "${base}/wp-json/wc/v3/products/${nid}?force=true"`, { encoding: "utf8", env }).trim();
    out.wc_delete = { code: del };
    try { const j = JSON.parse(fs.readFileSync("/tmp/del.txt","utf8")); out.wc_delete.ok = (j.id === nid); } catch (e) {}
  }
} catch (e) { out.wc_write = { error: String(e).slice(0,160) }; }
fs.writeFileSync("screenshots/wtest.txt", JSON.stringify(out, null, 2));
