import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'slugwrite',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function wpGet(path){ try{ return execSync('curl -sk -u "$WPU:$WPP" "'+DEV+path+'"',{encoding:'utf8',maxBuffer:8000000,timeout:40000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }
const out={ts:new Date().toISOString(),steps:{}};

// PRE-CHECK: patvirtinam busena pries WRITE
out.steps.pre = wpGet('/wp-json/wp/v2/pages/3238?_fields=id,slug,status');
out.steps.base_free_pre = wpGet('/wp-json/wp/v2/pages?slug=suns-serimo-lentele-gramais&status=any&_fields=id,slug');
putFile('slugwrite.json',JSON.stringify(out));

// WRITE: keiciam slug 3238 -> svarus bazinis
try{
  const body=JSON.stringify({slug:'suns-serimo-lentele-gramais'});
  fs.writeFileSync('/tmp/slugbody.json',body);
  const w=execSync('curl -sk -X POST -u "$WPU:$WPP" -H "Content-Type: application/json" -d @/tmp/slugbody.json "'+DEV+'/wp-json/wp/v2/pages/3238?_fields=id,slug,status,link"',{encoding:'utf8',maxBuffer:8000000,timeout:40000,env:{...process.env,WPU,WPP}});
  out.steps.write = w.slice(0,400);
}catch(e){ out.steps.write='WRITEERR:'+String(e.message||e).slice(0,200); }
putFile('slugwrite.json',JSON.stringify(out));
