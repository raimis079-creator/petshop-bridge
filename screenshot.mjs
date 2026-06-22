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
const TS="1782136087";
function gj(u){ return JSON.parse(execSync(`curl -sk --max-time 35 -u "$WP_USER:$WP_PASS_CLEAN" "${u}"`,{encoding:'utf8',env,maxBuffer:25000000})); }
const out={};
function dump(cid,label){ const p=gj('https://dev.avesa.lt/wp-json/wc/v3/products?category='+cid+'&per_page=100&status=any&_fields=id,name,status,categories'); return p.map(x=>({id:x.id,n:x.name,s:x.status[0],c:(x.categories||[]).map(c=>c.id+':'+c.name).join(' | ')})); }
out['88_Pasaras']=dump(88);
out['97_Skanestai']=dump(97);
out['304_Narvai_aksesuarai']=dump(304);
out['87_TIESIOG']=dump(87); // tiesiai ant tevo
out.fin=putResult('grauz_audit_'+TS+'.txt', out);
