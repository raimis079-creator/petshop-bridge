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
  let sha=getSha(); let code=doPut(sha);
  if(code==='422'||code==='409'){ sha=getSha(); code=doPut(sha); }
  return code;
}
const out={};
let html=''; try{ html=execSync('curl -sk --max-time 60 "https://dev.avesa.lt/?petshop_attr_higiena=dry&k=ps2026"',{encoding:'utf8',env,maxBuffer:20000000}); }catch(e){ html='ERR '+String(e).slice(0,80); }
const mp=html.match(/PARSED:\s*<b>(\d+)<\/b>/); const mr=html.match(/REVIEW:\s*<b>(\d+)<\/b>/); const mt=html.match(/Viso:\s*<b>(\d+)<\/b>/);
out.dry={ total:mt?+mt[1]:null, parsed:mp?+mp[1]:null, review:mr?+mr[1]:null };
const rows=[...html.matchAll(/<tr><td>(\d+)<\/td><td>([^<]*)<\/td><td class="(\w)">(PARSED|REVIEW)<\/td><td>([^<]*)<\/td><\/tr>/g)];
const byTipas={}; const review=[];
for(const r of rows){ const id=r[1],nm=r[2],st=r[4],tp=r[5]; if(st==='REVIEW'){ review.push(id+' '+nm.slice(0,46)); } else { (byTipas[tp]=byTipas[tp]||[]).push(id); } }
out.byTipas={}; for(const k of Object.keys(byTipas)) out.byTipas[k]=byTipas[k].length;
out.review=review;
if(!rows.length) out.head=html.slice(0,400);
out.put=putResult('higiena_dry2.txt', out);
