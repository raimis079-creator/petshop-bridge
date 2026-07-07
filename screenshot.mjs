import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'hb',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); const r=execSync('curl -s -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); return r; }catch(e){ return 'PUTERR:'+String(e.message||e).slice(0,200); } }
const r1=putFile('heartbeat1.json', JSON.stringify({step:1,ts:Date.now()}));
fs.writeFileSync('/tmp/hb1.log', String(r1).slice(0,500));
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
let wpresult='';
try{
  wpresult=execSync('curl -sk -u "$WPU:$WPP" "'+DEV+'/wp-json/wp/v2/pages?slug=jorksyro-terjeras&status=any&_fields=status,slug"',{encoding:'utf8',maxBuffer:5000000,timeout:30000,env:{...process.env,WPU,WPP}});
}catch(e){ wpresult='WPERR:'+String(e.message||e).slice(0,200); }
const r2=putFile('heartbeat2.json', JSON.stringify({step:2,wpresult}));
