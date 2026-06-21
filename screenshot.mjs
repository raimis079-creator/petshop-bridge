import { execSync } from "child_process";
import fs from "fs";
fs.mkdirSync("screenshots", { recursive: true });
const base = "https://dev.avesa.lt";
const passClean = (process.env.WP_APP_PASS || "").replace(/\s+/g, "");
const env = { ...process.env, WP_PASS_CLEAN: passClean };
function wc(p){ return JSON.parse(execSync(`curl -sk --max-time 35 -u "$WP_USER:$WP_PASS_CLEAN" "${base}/wp-json/wc/v3/${p}"`,{encoding:"utf8",env,maxBuffer:20*1024*1024})); }
const out={};
// APPLY
try {
  const ap = execSync(`curl -sk --max-time 60 "${base}/?petshop_attr_sampunai=apply&confirm=APPLY&k=ps2026"`,{encoding:"utf8",env,maxBuffer:10*1024*1024});
  const m=ap.match(/Viso:.*?REVIEW: <b>\d+<\/b>/s); out.apply=m?m[0].replace(/<[^>]+>/g,''):ap.slice(0,100);
} catch(e){ out.apply_err=(e.stderr||String(e)).slice(0,100); }
// rasti sukos kategorija
let sukos=null;
try {
  for(const q of ["sukos","sepeci","zirkl"]){
    const c=wc(`products/categories?per_page=50&search=${q}`);
    const hit=c.find(x=>/sukos|sepeci|zirkl/i.test(x.slug) && /sunim/i.test(x.slug));
    if(hit){ sukos=hit; break; }
  }
  out.sukos = sukos ? {id:sukos.id,name:sukos.name,slug:sukos.slug} : null;
} catch(e){ out.sukos_err=String(e).slice(0,80); }
// perkelti ranksluosti 14009
if(sukos){
  try {
    const p=wc(`products/14009?_fields=id,categories`);
    let cats=(p.categories||[]).filter(c=>c.id!==76); // pasalinti sampunai (76)
    cats.push({id:sukos.id});
    const body=JSON.stringify({categories:cats.map(c=>({id:c.id}))});
    fs.writeFileSync("/tmp/mv.json", body);
    const r=execSync(`curl -sk -o /tmp/mvr.txt -w "%{http_code}" --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -X PUT -d @/tmp/mv.json "${base}/wp-json/wc/v3/products/14009"`,{encoding:"utf8",env}).trim();
    out.move_http=r;
    const after=wc(`products/14009?_fields=id,categories`);
    out.towel_cats=(after.categories||[]).map(c=>c.slug);
  } catch(e){ out.move_err=(e.stderr||String(e)).slice(0,100); }
}
// patikra: keletas prekiu su atributais
try {
  out.check=[27236,21510,21508,21514,15700,15689,17320].map(id=>{
    const p=wc(`products/${id}?_fields=id,attributes`);
    const a={};(p.attributes||[]).forEach(at=>{if(/paskirtis|veisle/i.test(at.name))a[at.name]=(at.options||[]).join(",");});
    return {id,a};
  });
} catch(e){ out.check_err=String(e).slice(0,80); }
fs.writeFileSync("screenshots/samp_apply.txt", JSON.stringify(out,null,1));
