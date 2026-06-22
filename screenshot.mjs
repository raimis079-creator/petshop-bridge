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
function wc(p){ try{ return JSON.parse(execSync(`curl -sk --max-time 35 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wc/v3/${p}"`,{encoding:'utf8',env,maxBuffer:20000000})); }catch(e){ return {error:String(e).slice(0,60)}; } }
const out={};
// rasti pa_tipas atributo ID + terminai su count (scope per visa, bet ziurim ar nauji terminai turi count)
const attrs=wc('products/attributes?_fields=id,name,slug');
let tid=null; if(Array.isArray(attrs)){ const a=attrs.find(x=>x.slug==='pa_tipas'||x.slug==='tipas'); if(a)tid=a.id; }
out.tipas_attr_id=tid;
if(tid){ const terms=wc('products/attributes/'+tid+'/terms?per_page=100&_fields=id,name,count'); if(Array.isArray(terms)){ out.terms=terms.filter(t=>/palut|valikliai|Dant|Aus|Pedu|Maiseli|Atgrasin|Tualet/i.test(t.name)).map(t=>t.name+': '+t.count); } }
// sample produktai cat 82 su pa_tipas
let tagged=0, untag=0; const sample=[];
const prods=wc('products?category=82&per_page=100&status=any&_fields=id,name,attributes');
if(Array.isArray(prods)){ for(const p of prods){ const at=(p.attributes||[]).find(a=>a.slug==='pa_tipas'); const v=at&&at.options?at.options.join(','):''; if(v){tagged++; if(sample.length<6)sample.push(p.id+' '+p.name.slice(0,28)+' => '+v);} else untag++; } }
out.tagged=tagged; out.untagged=untag; out.sample=sample;
out.put=putResult('hver_1782119322.txt', out);
