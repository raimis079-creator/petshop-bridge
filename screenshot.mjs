import { execSync } from "child_process";
import fs from "fs";
fs.mkdirSync("screenshots", { recursive: true });
const base = "https://dev.avesa.lt";
const passClean = (process.env.WP_APP_PASS || "").replace(/\s+/g, "");
const out = { user_set: !!process.env.WP_USER, pass_len: passClean.length };
try {
  const env = { ...process.env, WP_PASS_CLEAN: passClean };
  const body = execSync(
    `curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "${base}/wp-json/wp/v2/users/me?context=edit"`,
    { encoding: "utf8", env, maxBuffer: 5 * 1024 * 1024 }
  );
  try {
    const j = JSON.parse(body);
    if (j.id) {
      out.auth = "OK";
      out.id = j.id;
      out.slug = j.slug;
      out.roles = j.roles;
      out.can_edit_products = j.capabilities ? !!j.capabilities.edit_products : "?";
    } else {
      out.auth = "FAIL"; out.code = j.code; out.message = j.message;
    }
  } catch (e) { out.auth = "PARSE_ERR"; out.head = body.slice(0, 300); }
} catch (e) { out.error = String(e).slice(0, 200); }
fs.writeFileSync("screenshots/auth.txt", JSON.stringify(out, null, 2));
