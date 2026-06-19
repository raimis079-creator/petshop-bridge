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
const out = { matches: [] };
try {
  const all = cs("snippets");
  out.total = all.length;
  const rx = /(kontekstas|pilnas|filtrai|filtru|zaislai|žaislai|dubeneliai|attribute|atribut|rikiavimas|rele|relė|app password|baltymu|baltymų|audit)/i;
  const hits = all.filter(s => rx.test(s.name || ""));
  out.hit_list = hits.map(s => ({ id: s.id, name: s.name, active: !!s.active, scope: s.scope }));
  // pilnas kodas tik svarbiems (Kontekstas + PILNAS/Filtrai)
  const deep = hits.filter(s => /(kontekstas|pilnas|filtrai|filtru)/i.test(s.name));
  for (const s of deep.slice(0, 4)) {
    try {
      const full = cs("snippets/" + s.id);
      out.matches.push({ id: s.id, name: s.name, active: !!full.active, code_len: (full.code||"").length, code_head: (full.code||"").slice(0, 600) });
    } catch (e) { out.matches.push({ id: s.id, name: s.name, error: String(e).slice(0,100) }); }
  }
} catch (e) { out.error = String(e).slice(0, 200); }
fs.writeFileSync("screenshots/snips.txt", JSON.stringify(out, null, 2));
