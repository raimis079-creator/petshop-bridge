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
function wc(p){ try{ return JSON.parse(execSync(`curl -sk --max-time 35 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wc/v3/${p}"`,{encoding:'utf8',env,maxBuffer:20000000})); }catch(e){ return {error:String(e).slice(0,60)}; } }
const out={};
let html=''; let err='';
try{ html=execSync('curl -sk --max-time 180 "https://dev.avesa.lt/?petshop_attr_higiena=apply&confirm=APPLY&k=ps2026"',{encoding:'utf8',env,maxBuffer:20000000}); }catch(e){ err='APPLY CURL ERR: '+String(e).slice(0,120); }
const mp=html.match(/PARSED:\s*<b>(\d+)<\/b>/); const mr=html.match(/REVIEW:\s*<b>(\d+)<\/b>/);
out.apply={ parsed:mp?+mp[1]:null, review:mr?+mr[1]:null, has_apply_hdr:html.includes('APPLY'), err:err, head: (mp?'':html.slice(0,250)) };
// verify
let tagged=0, untag=0; const sample=[];
const prods=wc('products?category=82&per_page=100&status=any&_fields=id,name,attributes');
if(Array.isArray(prods)){ for(const p of prods){ const at=(p.attributes||[]).find(a=>a.slug==='pa_tipas'); const v=at&&at.options?at.options.join(','):''; if(v){tagged++; if(sample.length<8)sample.push(p.id+' '+p.name.slice(0,26)+' => '+v);} else untag++; } }
out.tagged=tagged; out.untagged=untag; out.sample=sample;
out.put=putResult('hver2_1782119416.txt', out);
