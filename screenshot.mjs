import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'h1',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function html(u){ try{ return execSync('curl -sk -L -u "$WPU:$WPP" "'+DEV+u+'"',{encoding:'utf8',maxBuffer:20000000,timeout:40000,env:{...process.env,WPU,WPP}}); }catch(e){ return ''; } }
const out={};
for(const slug of ['jorksyro-terjeras','taksas']){
  const h=html('/'+slug+'/');
  // visi h1 tagai
  const h1s=[...h.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map(m=>m[1].replace(/<[^>]+>/g,'').trim().slice(0,50));
  const h2s=[...h.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map(m=>m[1].replace(/<[^>]+>/g,'').trim().slice(0,40)).slice(0,3);
  const h1count=(h.match(/<h1/gi)||[]).length;
  out[slug]={h1count,h1s,h2s_first3:h2s};
}
putFile('h1check.json',JSON.stringify(out));
