import { execSync } from "child_process";
import fs from "fs";
fs.mkdirSync("screenshots", { recursive: true });
const base = (process.argv[2] || "https://dev.avesa.lt").replace(/\/$/, "");
let out = { base };
try {
  const body = execSync(`curl -sk --max-time 30 "${base}/wp-json/"`, { encoding: "utf8", maxBuffer: 10*1024*1024 });
  out.raw_len = body.length;
  try {
    const j = JSON.parse(body);
    out.name = j.name;
    out.namespaces = j.namespaces || [];
    out.has_wc = (j.namespaces || []).some(n => String(n).startsWith("wc/"));
    out.has_wp = (j.namespaces || []).some(n => String(n).startsWith("wp/"));
    out.authentication = j.authentication || {};
  } catch (e) { out.parse_error = String(e); out.head = body.slice(0, 400); }
} catch (e) { out.error = String(e).slice(0,300); }
fs.writeFileSync("screenshots/rest.txt", JSON.stringify(out, null, 2));
