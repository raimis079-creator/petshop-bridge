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
const TS="1782137390";
const out={};
// 1) sukurti atributa pa_grauziko_rusis (idempotent)
function wc(method,p,body){ let cmd; if(body){ fs.writeFileSync('/tmp/b.json',JSON.stringify(body)); cmd=`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -X ${method} -d @/tmp/b.json "https://dev.avesa.lt/wp-json/wc/v3/${p}"`; } else { cmd=`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" -X ${method} "https://dev.avesa.lt/wp-json/wc/v3/${p}"`; } return JSON.parse(execSync(cmd,{encoding:'utf8',env,maxBuffer:20000000})); }
let attr=null; try{ const al=wc('GET','products/attributes?per_page=100&_fields=id,name,slug'); attr=al.find(a=>a.slug==='pa_grauziko_rusis'||a.slug==='grauziko_rusis'); }catch(e){}
if(!attr){ attr=wc('POST','products/attributes',{ name:"Grau\u017eiko r\u016b\u0161is", slug:"grauziko_rusis", type:"select", order_by:"name", has_archives:false }); }
out.attribute={id:attr.id,name:attr.name,slug:attr.slug};
// 2) deploy snippet is repo modules/grauzrusis.php
let php=fs.readFileSync('modules/grauzrusis.php','utf8').replace(/^\uFEFF?<\?php\s*/,'');
function cs(method,p,body){ let cmd; if(body){ fs.writeFileSync('/tmp/c.json',JSON.stringify(body)); cmd=`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -X ${method} -d @/tmp/c.json "https://dev.avesa.lt/wp-json/code-snippets/v1/${p}"`; } else { cmd=`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" -X ${method} "https://dev.avesa.lt/wp-json/code-snippets/v1/${p}"`; } return JSON.parse(execSync(cmd,{encoding:'utf8',env,maxBuffer:20000000})); }
// ar jau yra toks snippet
let snip=null; try{ const list=cs('GET','snippets?per_page=100'); if(Array.isArray(list)) snip=list.find(s=>s.name==='Grauziko Rusis Modulis v1.0'); }catch(e){}
let r;
if(snip){ r=cs('PUT','snippets/'+snip.id,{ name:'Grauziko Rusis Modulis v1.0', scope:'global', priority:11, active:true, code:php }); }
else { r=cs('POST','snippets',{ name:'Grauziko Rusis Modulis v1.0', scope:'global', priority:11, active:true, code:php }); }
out.snippet={id:r.id,active:r.active,name:r.name};
out.fin=putResult('grdeploy_'+TS+'.txt', out);
