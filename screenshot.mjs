import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
function putResult(name, obj){
  const content=(typeof obj==='string')?obj:JSON.stringify(obj,null,1);
  const b64=Buffer.from(content,'utf8').toString('base64');
  const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main"',{encoding:'utf8'})).sha||''; }catch(e){}
  const body={message:'res '+name,content:b64,branch:'main'}; if(sha)body.sha=sha;
  fs.writeFileSync('/tmp/put.json',JSON.stringify(body));
  return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/put.json "'+url+'"',{encoding:'utf8'}).trim();
}
function api(method,p,bodyObj){ let cmd; if(bodyObj){ fs.writeFileSync('/tmp/b.json',JSON.stringify(bodyObj)); cmd=`curl -sk --max-time 50 -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -X ${method} -d @/tmp/b.json "https://dev.avesa.lt/wp-json/${p}"`; } else { cmd=`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" -X ${method} "https://dev.avesa.lt/wp-json/${p}"`; } try{ return JSON.parse(execSync(cmd,{encoding:'utf8',env,maxBuffer:20000000})); }catch(e){ return {error:String(e).slice(0,80)}; } }
const out={};
// 1) modulio kodas be <?php
let code=fs.readFileSync('modules/higiena_module.php','utf8').replace(/^\uFEFF?<\?php\s*/,'');
// 2) rasti esama snippeta
const list=api('GET','code-snippets/v1/snippets?_fields=id,name,active');
let sid=null; if(Array.isArray(list)){ const m=list.find(s=>/Higienos Modulis/i.test(s.name||'')); if(m) sid=m.id; }
const snipBody={ name:'Higienos Modulis v1.0', scope:'global', priority:11, active:true, code:code };
let resp;
if(sid){ resp=api('PUT','code-snippets/v1/snippets/'+sid, snipBody); } else { resp=api('POST','code-snippets/v1/snippets', snipBody); }
out.snippet_id = resp && resp.id ? resp.id : (sid||null);
out.snippet_active = resp && typeof resp.active!=='undefined' ? resp.active : '?';
out.snippet_err = resp && resp.code ? (resp.code+': '+(resp.message||'').slice(0,120)) : null;
// 3) dry (jei aktyvus)
if(out.snippet_id && !out.snippet_err){
  let html=''; try{ html=execSync('curl -sk --max-time 60 "https://dev.avesa.lt/?petshop_attr_higiena=dry&k=ps2026"',{encoding:'utf8',env,maxBuffer:20000000}); }catch(e){ html='ERR '+String(e).slice(0,80); }
  const mp=html.match(/PARSED:\s*<b>(\d+)<\/b>/); const mr=html.match(/REVIEW:\s*<b>(\d+)<\/b>/); const mt=html.match(/Viso:\s*<b>(\d+)<\/b>/);
  out.dry={ total:mt?+mt[1]:null, parsed:mp?+mp[1]:null, review:mr?+mr[1]:null };
  // istraukti eilutes
  const rows=[...html.matchAll(/<tr><td>(\d+)<\/td><td>([^<]*)<\/td><td class="(\w)">(PARSED|REVIEW)<\/td><td>([^<]*)<\/td><\/tr>/g)];
  const byTipas={}; const review=[];
  for(const r of rows){ const id=r[1],nm=r[2],st=r[4],tp=r[5]; if(st==='REVIEW'){ review.push(id+' '+nm.slice(0,42)); } else { (byTipas[tp]=byTipas[tp]||[]).push(id); } }
  out.byTipas={}; for(const k of Object.keys(byTipas)) out.byTipas[k]=byTipas[k].length;
  out.review=review;
  if(!rows.length) out.dry_html_head=html.slice(0,300);
}
out.put=putResult('higiena_dry.txt', out);
