import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
function putResult(name, obj){
  const b64=Buffer.from((typeof obj==='string')?obj:JSON.stringify(obj,null,1),'utf8').toString('base64');
  const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  function getSha(){try{return JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){return '';}}
  function doPut(sha){const body={message:'r',content:b64,branch:'main'};if(sha)body.sha=sha;fs.writeFileSync('/tmp/p.json',JSON.stringify(body));return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/p.json "'+url+'"',{encoding:'utf8'}).trim();}
  let code='';for(let i=0;i<5;i++){const sha=getSha();code=doPut(sha);if(code==='200'||code==='201')return code;execSync('sleep 2');}return 'FAIL:'+code;
}
const TS="1782143545";
function wc(method,p,body){ let cmd; if(body){ fs.writeFileSync('/tmp/b.json',JSON.stringify(body)); cmd=`curl -sk --max-time 50 -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -X ${method} -d @/tmp/b.json "https://dev.avesa.lt/wp-json/wc/v3/${p}"`; } else { cmd=`curl -sk --max-time 35 -u "$WP_USER:$WP_PASS_CLEAN" -X ${method} "https://dev.avesa.lt/wp-json/wc/v3/${p}"`; } return JSON.parse(execSync(cmd,{encoding:'utf8',env,maxBuffer:20000000})); }
const out={};
// 1) kategorija Aksesuarai pauksciams
let ak=null; try{ const r=wc('GET','products/categories?slug=aksesuarai-pauksciams&_fields=id,name,slug,parent'); if(Array.isArray(r)&&r[0]) ak=r[0]; }catch(e){}
if(!ak){ ak=wc('POST','products/categories',{ name:"Aksesuarai pauk\u0161\u010diams", slug:"aksesuarai-pauksciams", parent:89 }); }
out.cat={id:ak.id,name:ak.name,slug:ak.slug};
const AK=ak.id;
// 2) moves
const upd=[];
function setCats(id, removeIds, addIds){ const pr=wc('GET','products/'+id+'?_fields=id,categories'); let cats=pr.categories.map(c=>c.id).filter(x=>!removeIds.includes(x)); for(const a of addIds){ if(!cats.includes(a)) cats.push(a); } upd.push({id,categories:cats.map(x=>({id:x}))}); }
// orphans -> Lesalas
for(const id of [14448,12796,13525]) setCats(id,[89],[90]);
// transportavimo krepsys -> Aksesuarai
setCats(13903,[89],[AK]);
// kokoso namelis (pauksciams ir grauzikams) -> prideti Aksesuarai (palikti 304)
setCats(24104,[],[AK]);
// skanestai/mineralai is Lesalo -> tik Skanestai (98)
for(const id of [17372,16165,16162]) setCats(id,[90],[98]);
// dvigubos narystes lesalai (90+89) -> tik 90
for(const id of [18943,18935,18931,18887,18883,18879,18875,18870,18866,18862]) setCats(id,[89],[90]);
const r=wc('POST','products/batch',{update:upd});
out.updated=(r&&Array.isArray(r.update))?r.update.length:r;
// verify
out.akses_count=wc('GET','products/categories/'+AK+'?_fields=count').count;
out.c90=wc('GET','products/categories/90?_fields=count').count;
out.c98=wc('GET','products/categories/98?_fields=count').count;
out.c89=wc('GET','products/categories/89?_fields=count').count;
const bare=wc('GET','products?category=89&per_page=60&status=any&_fields=id,name,categories');
out.bare89=Array.isArray(bare)?bare.filter(p=>{const ids=(p.categories||[]).map(c=>c.id);return !ids.some(x=>[90,98,AK,105].includes(x));}).map(p=>p.id+' '+p.name.slice(0,38)):'err';
out.fin=putResult('pauks_fix_'+TS+'.txt', out);
