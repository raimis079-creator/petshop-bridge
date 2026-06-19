import { execSync } from "child_process";
import fs from "fs";
fs.mkdirSync("screenshots", { recursive: true });
const base = "https://dev.avesa.lt";
const passClean = (process.env.WP_APP_PASS || "").replace(/\s+/g, "");
const env = { ...process.env, WP_PASS_CLEAN: passClean };
function wcGet(path){ return JSON.parse(execSync(`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "${base}/wp-json/wc/v3/${path}"`,{encoding:"utf8",env,maxBuffer:10*1024*1024})); }
function moveProduct(id, fromCat, toCat){
  const p = wcGet(`products/${id}?_fields=id,categories`);
  let cats = (p.categories||[]).map(c=>c.id).filter(c=>c!==fromCat);
  if (!cats.includes(toCat)) cats.push(toCat);
  const body = JSON.stringify({ categories: cats.map(id=>({id})) });
  fs.writeFileSync("/tmp/mv.json", body);
  const code = execSync(`curl -sk -o /tmp/mvr.txt -w "%{http_code}" --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -X PUT -d @/tmp/mv.json "${base}/wp-json/wc/v3/products/${id}"`,{encoding:"utf8",env}).trim();
  return code;
}
const out = { moves: [] };
const toilets = [14175,14169,13752,13751,13750,13749,13748,13747,13430,13429];
const chipsi  = [25993,25991];
for (const id of toilets) { try { out.moves.push({id, to:106, code: moveProduct(id,107,106)}); } catch(e){ out.moves.push({id,err:String(e).slice(0,60)}); } }
for (const id of chipsi)  { try { out.moves.push({id, to:304, code: moveProduct(id,107,304)}); } catch(e){ out.moves.push({id,err:String(e).slice(0,60)}); } }
out.moved_ok = out.moves.filter(m=>m.code==="200").length;
// APPLY atributus
try {
  execSync("sleep 2");
  const ap = execSync(`curl -sk --max-time 60 "${base}/?petshop_attr_kraikai=apply&confirm=APPLY&k=ps2026"`,{encoding:"utf8",env,maxBuffer:10*1024*1024});
  const m = ap.match(/Viso:.*?SKIP: <b>\d+<\/b>/s);
  out.apply_summary = m ? m[0].replace(/<[^>]+>/g,'') : ap.slice(0,150);
  out.applied = /APPLY \(irasyta\)/.test(ap);
} catch(e){ out.apply_err = String(e).slice(0,150); }
fs.writeFileSync("screenshots/kraikai_apply.txt", JSON.stringify(out, null, 2));
