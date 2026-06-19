import { execSync } from "child_process";
import fs from "fs";
fs.mkdirSync("screenshots", { recursive: true });
const base = "https://dev.avesa.lt";
const passClean = (process.env.WP_APP_PASS || "").replace(/\s+/g, "");
const env = { ...process.env, WP_PASS_CLEAN: passClean };
const out = {};
// aktyvuojam zaislai moduli 468
try {
  const c = execSync(`curl -sk -o /tmp/a.txt -w "%{http_code}" --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" -X POST "${base}/wp-json/code-snippets/v1/snippets/468/activate"`,{encoding:"utf8",env}).trim();
  out.activate_code = c;
  try { const j = JSON.parse(fs.readFileSync("/tmp/a.txt","utf8")); out.active_now = j.active; } catch(e){ out.head = fs.readFileSync("/tmp/a.txt","utf8").slice(0,150); }
} catch(e){ out.err = String(e).slice(0,120); }
// galutinis sveikatos patikra
try {
  const all = JSON.parse(execSync(`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "${base}/wp-json/code-snippets/v1/snippets?ts=${Date.now()}"`,{encoding:"utf8",env,maxBuffer:10*1024*1024}));
  out.active_count = all.filter(s=>s.active).length;
  out.key_active = all.filter(s=>s.active && /kontekstas|pilnas|modulis|rele|rikiavimas/i.test(s.name||"")).map(s=>`${s.id}:${s.name.slice(0,40)}`);
} catch(e){ out.list_err = String(e).slice(0,80); }
fs.writeFileSync("screenshots/activate.txt", JSON.stringify(out, null, 2));
