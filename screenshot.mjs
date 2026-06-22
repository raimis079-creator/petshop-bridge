import { execSync } from "child_process";
import fs from "fs";
fs.mkdirSync("screenshots", { recursive: true });
const base = "https://dev.avesa.lt";
const passClean = (process.env.WP_APP_PASS || "").replace(/\s+/g, "");
const env = { ...process.env, WP_PASS_CLEAN: passClean };
function wc(p){ try{ return JSON.parse(execSync(`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "${base}/wp-json/wc/v3/${p}"`,{encoding:"utf8",env,maxBuffer:20*1024*1024})); }catch(e){ return null; } }
const out={};
// visos kategorijos
let all=[];
for(let p=1;p<=6;p++){
  const r=wc(`products/categories?per_page=100&page=${p}&_fields=id,name,slug,parent,count,display`);
  if(Array.isArray(r)){ all=all.concat(r); if(r.length<100) break; } else break;
}
out.total=all.length;
const byId={}; all.forEach(c=>byId[c.id]=c);
function chain(id){ const ch=[]; let c=byId[id]; let g=0; while(c&&g<6){ ch.push(`${c.id}:${c.name}`); c=byId[c.parent]; g++; } return ch.join(' < '); }
// cat 75 grandine
out.cat75_chain = chain(75);
out.cat75 = byId[75] ? {id:75,name:byId[75].name,slug:byId[75].slug,parent:byId[75].parent} : null;
// KATEMS top
const katems = all.find(c=>c.parent===0 && /kat/i.test(c.slug) && !/kar/i.test(c.slug));
out.katems_top = katems?{id:katems.id,name:katems.name,slug:katems.slug}:null;
// katems subtree (vaikai + anukai)
if(katems){
  const kids = all.filter(c=>c.parent===katems.id).map(c=>({id:c.id,name:c.name,slug:c.slug,count:c.count}));
  out.katems_children = kids;
  // ieskoti prieziura/aksesuar po katems (bet kuriame lygyje)
  out.katems_prieziura = all.filter(c=>/prieziur|aksesuar/i.test(c.slug) && (c.parent===katems.id || (byId[c.parent]&&byId[c.parent].parent===katems.id))).map(c=>({id:c.id,name:c.name,slug:c.slug,parent:c.parent,count:c.count,display:c.display}));
}
// sunims top + jo prieziura subtree (palyginimui)
const sunims = all.find(c=>c.parent===0 && /sunim/i.test(c.slug));
out.sunims_top = sunims?{id:sunims.id,name:sunims.name}:null;
fs.writeFileSync("screenshots/cattree.txt", JSON.stringify(out,null,1));
