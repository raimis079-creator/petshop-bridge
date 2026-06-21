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
  fs.writeFileSync("/tmp/mv.json", JSON.stringify({ categories: cats.map(id=>({id})) }));
  return execSync(`curl -sk -o /dev/null -w "%{http_code}" --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -X PUT -d @/tmp/mv.json "${base}/wp-json/wc/v3/products/${id}"`,{encoding:"utf8",env}).trim();
}
const out = { moves: [] };
const harness = [27555, 27553, 27545, 27543, 27539, 27538, 27536, 27534, 27531, 27529, 27527, 27524, 27522, 27520, 27518, 27515, 27512, 27510, 26607, 26254, 26248, 26242, 26236, 26230, 26224, 26218, 26212, 26206, 24218, 24216, 24214, 24210, 24208, 24206, 24204, 24202, 24200, 24088];
for (const id of harness) { try { out.moves.push({id, to:116, code: moveProduct(id,305,116)}); } catch(e){ out.moves.push({id,err:String(e).slice(0,50)}); } }
try { out.moves.push({id:22275, to:82, code: moveProduct(22275,305,82)}); } catch(e){ out.moves.push({id:22275,err:String(e).slice(0,50)}); }
out.moved_ok = out.moves.filter(m=>m.code==="200").length;
out.total = out.moves.length;
fs.writeFileSync("screenshots/apranga_moveout.txt", JSON.stringify(out, null, 2));
