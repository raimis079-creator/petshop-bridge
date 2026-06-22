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
const TS="1782136478";
function wc(method,p,body){ let cmd; if(body){ fs.writeFileSync('/tmp/b.json',JSON.stringify(body)); cmd=`curl -sk --max-time 50 -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -X ${method} -d @/tmp/b.json "https://dev.avesa.lt/wp-json/wc/v3/${p}"`; } else { cmd=`curl -sk --max-time 35 -u "$WP_USER:$WP_PASS_CLEAN" -X ${method} "https://dev.avesa.lt/wp-json/wc/v3/${p}"`; } return JSON.parse(execSync(cmd,{encoding:'utf8',env,maxBuffer:20000000})); }
const out={};
// 1) kategorija (idempotent)
let kr=null; try{ const r=wc('GET','products/categories?slug=kraikas-ir-sienas-grauzikams&_fields=id,name,slug,parent'); if(Array.isArray(r)&&r[0]) kr=r[0]; }catch(e){}
if(!kr){ kr=wc('POST','products/categories',{ name:"Kraikas ir \u0161ienas grau\u017eikams", slug:"kraikas-ir-sienas-grauzikams", parent:87 }); }
out.cat={id:kr.id,name:kr.name,slug:kr.slug,parent:kr.parent};
const KR=kr.id;
// 2) moves: helper - nustatyti tikslias kategorijas
const upd=[];
function setCats(id, removeIds, addIds){ const pr=wc('GET','products/'+id+'?_fields=id,categories'); let cats=pr.categories.map(c=>c.id).filter(x=>!removeIds.includes(x)); for(const a of addIds){ if(!cats.includes(a)) cats.push(a); } upd.push({id,categories:cats.map(x=>({id:x}))}); }
// kraikas+sienas: is 304/88 -> KR
for(const id of [25993,25991,17555]) setCats(id,[304,87],[KR]);
setCats(15642,[88,87],[KR]); // sienas is pasaro
// orphans -> subkategorijos (pasalinti bare 87)
for(const id of [14447,12951,12936,19011,18919,18915,18903]) setCats(id,[87],[88]);
setCats(13863,[87],[304]); // namelis -> aksesuarai
// apply
const r=wc('POST','products/batch',{update:upd});
out.updated=(r&&Array.isArray(r.update))?r.update.length:r;
// verify counts
out.kraikas_count=wc('GET','products/categories/'+KR+'?_fields=count').count;
out.c304=wc('GET','products/categories/304?_fields=count').count;
out.c88=wc('GET','products/categories/88?_fields=count').count;
out.c87=wc('GET','products/categories/87?_fields=count').count;
// ar liko ka nors bare ant 87
const bare=wc('GET','products?category=87&per_page=50&status=any&_fields=id,name,categories');
out.bare87=Array.isArray(bare)?bare.filter(p=>{const ids=(p.categories||[]).map(c=>c.id);return !ids.some(x=>[88,97,304,KR,104].includes(x));}).map(p=>p.id+' '+p.name.slice(0,40)):'err';
out.fin=putResult('grauz_fix_'+TS+'.txt', out);
