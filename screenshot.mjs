import { execSync } from "child_process";
import fs from "fs";
fs.mkdirSync("screenshots", { recursive: true });
const base = "https://dev.avesa.lt";
const passClean = (process.env.WP_APP_PASS || "").replace(/\s+/g, "");
const env = { ...process.env, WP_PASS_CLEAN: passClean };
function delF(id){ try { const c = execSync(`curl -sk -o /dev/null -w "%{http_code}" --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" -X DELETE "${base}/wp-json/code-snippets/v1/snippets/${id}?force=true"`,{encoding:"utf8",env}).trim(); return {id, del:c}; } catch(e){ return {id, err:String(e).slice(0,60)}; } }
const out = { forced: [] };
for (const id of [470,471,466,467]) out.forced.push(delF(id));
try {
  const all = JSON.parse(execSync(`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "${base}/wp-json/code-snippets/v1/snippets?ts=${Date.now()}"`,{encoding:"utf8",env,maxBuffer:10*1024*1024}));
  out.total = all.length;
  out.zaislai_left = all.filter(s=>/zaislai|preset maker|preset dump/i.test(s.name||"")).map(s=>({id:s.id,name:s.name,active:!!s.active}));
  // patvirtinam kad aktyvus pagrindiniai filtrai sveiki
  out.active_filters = all.filter(s=>s.active && /kontekstas|pilnas|attr modulis|rele|rikiavimas|auditas/i.test(s.name||"")).map(s=>({id:s.id,name:s.name}));
} catch(e){ out.list_err = String(e).slice(0,80); }
fs.writeFileSync("screenshots/cleanup2.txt", JSON.stringify(out, null, 2));
