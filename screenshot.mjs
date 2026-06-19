import { execSync } from "child_process";
import fs from "fs";
fs.mkdirSync("screenshots", { recursive: true });
const base = "https://dev.avesa.lt";
const passClean = (process.env.WP_APP_PASS || "").replace(/\s+/g, "");
const env = { ...process.env, WP_PASS_CLEAN: passClean };
function name(id){ try { const j = JSON.parse(execSync(`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "${base}/wp-json/code-snippets/v1/snippets/${id}"`,{encoding:"utf8",env})); return {id, name:j.name, active:j.active}; } catch(e){ return {id, err:String(e).slice(0,60)}; } }
function del(id){ try { const c = execSync(`curl -sk -o /dev/null -w "%{http_code}" --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" -X DELETE "${base}/wp-json/code-snippets/v1/snippets/${id}"`,{encoding:"utf8",env}).trim(); return {id, del:c}; } catch(e){ return {id, err:String(e).slice(0,60)}; } }
const out = { before: [], deleted: [], remaining_zaislai: [] };
// patvirtinam vardus pries trinant
for (const id of [466,467,468,470,471]) out.before.push(name(id));
// trinam: 470 dump TEMP, 471 maker TEMP, 466 v1.0, 467 dup v1.1 (paliekam 468)
for (const id of [470,471,466,467]) out.deleted.push(del(id));
// patvirtinam kas liko is zaislai moduliu
try {
  const all = JSON.parse(execSync(`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "${base}/wp-json/code-snippets/v1/snippets"`,{encoding:"utf8",env,maxBuffer:10*1024*1024}));
  out.remaining_zaislai = all.filter(s=>/zaislai|preset maker|preset dump/i.test(s.name||"")).map(s=>({id:s.id,name:s.name,active:!!s.active}));
} catch(e){ out.list_err = String(e).slice(0,80); }
fs.writeFileSync("screenshots/cleanup.txt", JSON.stringify(out, null, 2));
