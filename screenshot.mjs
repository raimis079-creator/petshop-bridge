import { execSync } from "child_process";
import fs from "fs";
fs.mkdirSync("screenshots", { recursive: true });
const base = "https://dev.avesa.lt";
const passClean = (process.env.WP_APP_PASS || "").replace(/\s+/g, "");
const env = { ...process.env, WP_PASS_CLEAN: passClean };
function probe(label, args) {
  try {
    const code = execSync(`curl -sk -o /tmp/b.txt -w "%{http_code}" --max-time 30 ${args}`, { encoding: "utf8", env }).trim();
    let head = ""; try { head = fs.readFileSync("/tmp/b.txt", "utf8").slice(0, 140).replace(/\s+/g, " "); } catch (e) {}
    return { label, code, head };
  } catch (e) { return { label, error: String(e).slice(0, 120) }; }
}
const r = [];
r.push(probe("A unauth root", `"${base}/wp-json/"`));
r.push(probe("B auth root (-u)", `-u "$WP_USER:$WP_PASS_CLEAN" "${base}/wp-json/"`));
r.push(probe("C auth wc/v3 products", `-u "$WP_USER:$WP_PASS_CLEAN" "${base}/wp-json/wc/v3/products?per_page=1"`));
r.push(probe("D auth wp/v2 users/me", `-u "$WP_USER:$WP_PASS_CLEAN" "${base}/wp-json/wp/v2/users/me?context=edit"`));
r.push(probe("E unauth wc/v3 products", `"${base}/wp-json/wc/v3/products?per_page=1"`));
r.push(probe("F explicit Auth header", `-H "Authorization: Basic $(printf '%s' "$WP_USER:$WP_PASS_CLEAN" | base64 -w0)" "${base}/wp-json/"`));
fs.writeFileSync("screenshots/probe.txt", JSON.stringify(r, null, 2));
