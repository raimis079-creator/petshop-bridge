import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
function putResult(name, obj){
  const content=(typeof obj==='string')?obj:JSON.stringify(obj,null,1);
  const b64=Buffer.from(content,'utf8').toString('base64');
  const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  function getSha(){ try{ return JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){ return ''; } }
  function doPut(sha){ const body={message:'res '+name,content:b64,branch:'main'}; if(sha)body.sha=sha; fs.writeFileSync('/tmp/put.json',JSON.stringify(body)); return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/put.json "'+url+'"',{encoding:'utf8'}).trim(); }
  let sha=getSha(); let code=doPut(sha); if(code==='422'||code==='409'){ sha=getSha(); code=doPut(sha); } return code;
}
function cs(p){ try{ return JSON.parse(execSync(`curl -sk --max-time 35 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/${p}"`,{encoding:'utf8',env,maxBuffer:20000000})); }catch(e){ return {error:String(e).slice(0,60)}; } }
const out={};
const list=cs('code-snippets/v1/snippets?_fields=id,name,active');
out.snippets = Array.isArray(list)? list.filter(s=>/Kontekst|maker|Maker|preset|Preset|filtras|Filtras/i.test(s.name||'')).map(s=>s.id+' | '+s.name+' | '+(s.active?'ON':'off')) : list;
const k=cs('code-snippets/v1/snippets/332?_fields=id,name,code');
out.kontekstas_code = k && k.code ? k.code : (k.error||'no');
out.put=putResult('hpreset_recon_1782119529.txt', out);
