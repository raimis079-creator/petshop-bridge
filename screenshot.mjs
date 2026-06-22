import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
function putResult(name, obj){ const content=(typeof obj==='string')?obj:JSON.stringify(obj,null,1); const b64=Buffer.from(content,'utf8').toString('base64'); const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN; const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'res '+name,content:b64,branch:'main'}; if(sha)body.sha=sha; fs.writeFileSync('/tmp/put.json',JSON.stringify(body)); return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/put.json "'+url+'"',{encoding:'utf8'}).trim(); }
const out={};
// snippet 502?
try{ const sn=JSON.parse(execSync(`curl -sk --max-time 25 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/502"`,{encoding:'utf8',env})); out.snippet502={found:!!sn.id,name:sn.name,active:sn.active}; }catch(e){ out.snippet502={found:false}; }
// cat 82 prekiu pa_tipas coverage
try{
  let tagged=0,untag=0,samp=[];
  const ids=JSON.parse(execSync(`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wc/v3/products?category=82&per_page=100&status=any&_fields=id,name,attributes"`,{encoding:'utf8',env,maxBuffer:20000000}));
  for(const p of ids){ const t=(p.attributes||[]).find(a=>a.name==='Tipas'||(a.slug&&a.slug==='pa_tipas')); const has=t&&t.options&&t.options.length; if(has){tagged++; if(samp.length<6)samp.push(p.id+': '+t.options.join(','));} else {untag++; if(samp.length<6)samp.push(p.id+': <none> '+p.name.slice(0,30));} }
  out.cat82={total:ids.length,tagged,untag,sample:samp};
}catch(e){ out.cat82={error:String(e).slice(0,80)}; }
out.put=putResult('hcheck.txt', out);
