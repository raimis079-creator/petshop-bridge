import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(n,s){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+n; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'ci',branch:'main',content:Buffer.from(s,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function api(path,method,obj){ let cmd='curl -sk -u "$WPU:$WPP" -H "Content-Type: application/json" '; if(method) cmd+='-X '+method+' '; if(obj){ fs.writeFileSync('/tmp/body.json', JSON.stringify(obj)); cmd+='-d @/tmp/body.json '; } cmd+='"'+DEV+path+'" -w "\\n---STATUS:%{http_code}---"'; try{ return execSync(cmd,{encoding:'utf8',maxBuffer:20000000,timeout:180000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC: '+(e.stdout || e.message).slice(0,300); }}
let out='';

// 1. INSTALL: POST /wp/v2/plugins su slug=complianz-gdpr
out += '=== INSTALL bandymas: complianz-gdpr ===\n';
const inst = api('/wp-json/wp/v2/plugins', 'POST', { slug: 'complianz-gdpr', status: 'inactive' });
out += inst+'\n\n';

// 2. Patikra ar dabar yra
const plug = api('/wp-json/wp/v2/plugins?per_page=100', 'GET');
try{
  const parts = plug.split('---STATUS:');
  const arr = JSON.parse(parts[0]);
  const c = arr.filter(p => (p.plugin||'').toLowerCase().includes('complianz'));
  out += '=== Complianz po install bandymo ===\n';
  if(c.length === 0) out += '  NErasta plugin sąraše\n';
  else c.forEach(p=>out += '  ['+p.status+'] '+p.plugin+' v'+p.version+'\n');
}catch(e){ out += 'GET ERR\n'; }

putFile('compl_inst.txt', out);
