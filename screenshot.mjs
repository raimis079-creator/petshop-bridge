import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
const LINKS=JSON.parse(Buffer.from("WyIva2F0ZWdvcmlqYS9zdW5pbXMvIiwgIi9rYXRlZ29yaWphL2thdGVtcy8iLCAiL3Bhc2l1bHltYWkvIiwgIi9zdW5zLXNlcmltby1sZW50ZWxlLWdyYW1haXMvIiwgIi9rb250YWt0YWkvIiwgIi9wcml2YXR1bW8tcG9saXRpa2EvIiwgIi9hcG1va2VqaW1hcy8iXQ==","base64").toString("utf8"));
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'cal',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function code(u){ try{ return execSync('curl -sk -o /dev/null -w "%{http_code}" -u "$WPU:$WPP" -L "'+DEV+u+'"',{encoding:'utf8',timeout:30000,env:{...process.env,WPU,WPP}}).trim(); }catch(e){ return 'EXC'; } }
const out={};
for(const l of LINKS){ out[l]=code(l); }
putFile('checkalllinks.json',JSON.stringify(out));
console.log('done');
