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
const TS="1782122994";
function wc(method,p,body){ let cmd; if(body){ fs.writeFileSync('/tmp/b.json',JSON.stringify(body)); cmd=`curl -sk --max-time 60 -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -X ${method} -d @/tmp/b.json "https://dev.avesa.lt/wp-json/wc/v3/${p}"`; } else { cmd=`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" -X ${method} "https://dev.avesa.lt/wp-json/wc/v3/${p}"`; } return JSON.parse(execSync(cmd,{encoding:'utf8',env,maxBuffer:20000000})); }
const out={};
// patikrinti ar kategorijos jau yra (idempotent)
function findCat(slug){ try{ const r=wc('GET','products/categories?slug='+slug+'&_fields=id,name,slug,parent'); return Array.isArray(r)&&r[0]?r[0]:null; }catch(e){ return null; } }
// 1) Vesinantys kilimeliai sunims
let vk=findCat('vesinantys-kilimeliai-sunims');
if(!vk){ vk=wc('POST','products/categories',{ name:"V\u0117sinantys kilim\u0117liai \u0161unims", slug:"vesinantys-kilimeliai-sunims", parent:70 }); }
out.vk={id:vk.id,name:vk.name,slug:vk.slug,parent:vk.parent};
// 2) Baseinai sunims
let bs=findCat('baseinai-sunims');
if(!bs){ bs=wc('POST','products/categories',{ name:"Baseinai \u0161unims", slug:"baseinai-sunims", parent:70 }); }
out.bs={id:bs.id,name:bs.name,slug:bs.slug,parent:bs.parent};
// 3) perkelti
const mats=[27837,27832,27804,27799,27059,27053,25962,24245,15754];
const pool=[27448];
const upd=[];
function plan(ids,tgt){ for(const id of ids){ const pr=wc('GET','products/'+id+'?_fields=id,name,categories'); let cats=pr.categories.map(c=>c.id).filter(x=>x!==82); if(!cats.includes(tgt)) cats.push(tgt); upd.push({id,categories:cats.map(x=>({id:x}))}); } }
plan(mats, vk.id);
plan(pool, bs.id);
const r=wc('POST','products/batch',{update:upd});
out.moved=(r&&Array.isArray(r.update))?r.update.length:r;
// verify
out.vk_count=wc('GET','products/categories/'+vk.id+'?_fields=count').count;
out.bs_count=wc('GET','products/categories/'+bs.id+'?_fields=count').count;
out.higiena_count=wc('GET','products/categories/82?_fields=count').count;
out.fin=putResult('mkcat_'+TS+'.txt', out);
