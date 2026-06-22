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
const TS="1782151404";
function wc(method,p,body){ let cmd; if(body){ fs.writeFileSync('/tmp/b.json',JSON.stringify(body)); cmd=`curl -sk --max-time 60 -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -X ${method} -d @/tmp/b.json "https://dev.avesa.lt/wp-json/wc/v3/${p}"`; } else { cmd=`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" -X ${method} "https://dev.avesa.lt/wp-json/wc/v3/${p}"`; } return JSON.parse(execSync(cmd,{encoding:'utf8',env,maxBuffer:25000000})); }
const out={};
const DP=[91,92,99,103,110,113];
function dump(cid){ let page=1,acc=[]; while(true){ const p=wc('GET','products?category='+cid+'&per_page=100&page='+page+'&status=any&_fields=id,categories'); if(!Array.isArray(p)||p.length===0)break; acc=acc.concat(p); if(p.length<100)break; page++; } return acc; }
const seen={};
for(const cid of [92,99,103,110,113]){ for(const p of dump(cid)){ seen[p.id]=p; } }
const prods=Object.values(seen);
out.to_clean=prods.length;
// batch update: pasalinti DP kategorijas
const upd=prods.map(p=>{ const cats=(p.categories||[]).map(c=>c.id).filter(x=>!DP.includes(x)); return {id:p.id, categories:cats.map(x=>({id:x}))}; });
let done=0;
for(let i=0;i<upd.length;i+=40){ const chunk=upd.slice(i,i+40); const r=wc('POST','products/batch',{update:chunk}); done+=(r&&Array.isArray(r.update))?r.update.length:0; execSync('sleep 1'); }
out.updated=done;
// verify counts
for(const cid of DP){ out['c'+cid]=wc('GET','products/categories/'+cid+'?_fields=count').count; }
out.fin=putResult('dp_empty_'+TS+'.txt', out);
