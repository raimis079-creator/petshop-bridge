import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
function putResult(name, obj){
  const isBuf=Buffer.isBuffer(obj);
  const b64=isBuf?obj.toString('base64'):Buffer.from((typeof obj==='string')?obj:JSON.stringify(obj,null,1),'utf8').toString('base64');
  const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  function getSha(){try{return JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){return '';}}
  function doPut(sha){const body={message:'res '+name,content:b64,branch:'main'};if(sha)body.sha=sha;fs.writeFileSync('/tmp/put_'+name+'.json',JSON.stringify(body));return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/put_'+name+'.json "'+url+'"',{encoding:'utf8'}).trim();}
  let code='';for(let i=0;i<5;i++){const sha=getSha();code=doPut(sha);if(code==='200'||code==='201')return code;execSync('sleep 2');}return 'FAIL:'+code;
}
const TS="1782120582";
const out={};
try{ const sn=JSON.parse(execSync(`curl -sk --max-time 25 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/502"`,{encoding:'utf8',env})); out.snippet502={found:!!sn.id,name:sn.name,active:sn.active}; }catch(e){ out.snippet502={found:false}; }
try{
  let tagged=0,untag=0,samp=[];
  const ids=JSON.parse(execSync(`curl -sk --max-time 35 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wc/v3/products?category=82&per_page=100&status=any&_fields=id,name,attributes"`,{encoding:'utf8',env,maxBuffer:30000000}));
  for(const p of ids){ const t=(p.attributes||[]).find(a=>a.name==='Tipas'||a.slug==='pa_tipas'); const has=t&&t.options&&t.options.length; if(has){tagged++; if(samp.length<8)samp.push(p.id+': '+t.options.join(','));} else {untag++; if(samp.length<8)samp.push(p.id+': <none> '+(p.name||'').slice(0,32));} }
  out.cat82={total:ids.length,tagged,untag,sample:samp};
}catch(e){ out.cat82={error:String(e).slice(0,80)}; }
out.put=putResult('hcheck_'+TS+'.txt', out);
fs.writeFileSync('/tmp/lastname.txt','hcheck_'+TS+'.txt');
