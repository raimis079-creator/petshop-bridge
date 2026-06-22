import { execSync } from "child_process";
import fs from "fs";
fs.mkdirSync("screenshots", { recursive: true });
const base = "https://dev.avesa.lt";
const passClean = (process.env.WP_APP_PASS || "").replace(/\s+/g, "");
const env = { ...process.env, WP_PASS_CLEAN: passClean };
function wc(method,p,body){
  let cmd=`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -X ${method} "${base}/wp-json/wc/v3/${p}"`;
  if(body){ fs.writeFileSync("/tmp/b.json",JSON.stringify(body)); cmd=`curl -sk --max-time 50 -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -X ${method} -d @/tmp/b.json "${base}/wp-json/wc/v3/${p}"`; }
  try{ return JSON.parse(execSync(cmd,{encoding:"utf8",env,maxBuffer:20*1024*1024})); }catch(e){ return {error:String(e).slice(0,80)}; }
}
const out={};
// 1) sukurti katems grooming kategorija
let created = wc("POST","products/categories",{ name:"Šukos, šepečiai, žirklės katėms", slug:"sukos-sepeciai-zirkles-katems", parent:77 });
let newId = created && created.id ? created.id : null;
if(!newId && created && created.code==='term_exists'){ newId = created.data && created.data.resource_id ? created.data.resource_id : null; }
out.created = created && created.id ? {id:created.id,name:created.name,slug:created.slug,parent:created.parent} : created;
out.newId = newId;
if(!newId){ fs.writeFileSync("screenshots/catmove.txt", JSON.stringify(out,null,1)); process.exit(0); }

// 2) prekes is cat 75 su kategorijomis
let prods=[];
for(let p=1;p<=2;p++){
  const r=wc("GET",`products?category=75&per_page=100&page=${p}&status=any&_fields=id,name,categories`);
  if(Array.isArray(r)){ prods=prods.concat(r); if(r.length<100) break; } else break;
}
out.n=prods.length;
function deacc(s){ return s.toLowerCase().replace(/š/g,'s').replace(/ž/g,'z').replace(/ė/g,'e').replace(/č/g,'c').replace(/į/g,'i').replace(/ū/g,'u').replace(/ą/g,'a').replace(/ų/g,'u'); }
function klas(id,name){
  const t=' '+deacc(name)+' ';
  if(id===14177) return 'cat';
  if(/katem|kaciu|kaci |katei|kate /.test(t)) return 'cat';
  if(/sunim|suniuk/.test(t)) return 'dog';
  return 'univ';
}
const upd=[]; const rep={cat:[],univ:[],dog:[]};
for(const pr of prods){
  const k=klas(pr.id,pr.name);
  const curIds=(pr.categories||[]).map(c=>c.id);
  let newIds=null;
  if(k==='cat'){ newIds = curIds.filter(x=>x!==75); if(!newIds.includes(newId)) newIds.push(newId); rep.cat.push(pr.id+' '+pr.name.slice(0,38)); }
  else if(k==='univ'){ newIds = curIds.slice(); if(!newIds.includes(newId)) newIds.push(newId); rep.univ.push(pr.id); }
  else { rep.dog.push(pr.id); }
  if(newIds){ upd.push({ id:pr.id, categories:newIds.map(x=>({id:x})) }); }
}
out.counts={cat:rep.cat.length,univ:rep.univ.length,dog:rep.dog.length,to_update:upd.length};
out.cat_moved=rep.cat;
// 3) batch update
if(upd.length){
  const res=wc("POST","products/batch",{ update: upd });
  out.batch_ok = res && Array.isArray(res.update) ? res.update.length : res;
}
// 4) verifikacija - kategorijos count
const ver=wc("GET",`products/categories/${newId}`);
out.new_cat_count = ver && ver.count!==undefined ? ver.count : ver;
fs.writeFileSync("screenshots/catmove.txt", JSON.stringify(out,null,1));
