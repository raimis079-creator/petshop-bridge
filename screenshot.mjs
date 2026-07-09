import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'dg',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function api(p){ try{ return execSync('curl -sk -u "$WPU:$WPP" --max-time 25 "'+DEV+p+'"',{encoding:'utf8',maxBuffer:20000000,timeout:27000,env:{...process.env,WPU,WPP}}); }catch(e){ return ''; } }
function get(u){ try{ return execSync('curl -sk -u "$WPU:$WPP" -L --max-time 20 "'+DEV+u+'"',{encoding:'utf8',maxBuffer:20000000,timeout:22000,env:{...process.env,WPU,WPP}}); }catch(e){ return ''; } }
let out='';
// 1. Snippet 609 busena
const s = api('/wp-json/code-snippets/v1/snippets/609');
try{
  const j = JSON.parse(s);
  out += 'snippet 609: active='+j.active+' code_error='+(j.code_error===null?'null':JSON.stringify(j.code_error))+' scope='+j.scope+'\n';
}catch(e){ out += 'snippet 609 read ERR: '+s.slice(0,200)+'\n'; }
out += '\n';
// 2. Su cache busteriu
const html = get('/kolis/?nc='+Date.now());
out += '/kolis/ (cache-bust) len='+html.length+'\n';
out += '  turi "petshop-auto-h1": '+html.includes('petshop-auto-h1')+'\n';
// visi h1
const h1s = [...html.matchAll(/<h1[\s\S]{0,300}?<\/h1>/gi)];
out += '  h1 tagu: '+h1s.length+'\n';
h1s.forEach((m,i)=>{ out += '  h1['+i+'] = '+JSON.stringify(m[0].slice(0,200))+'\n'; });
out += '\n';
// 3. Be cache busterio
const html2 = get('/kolis/');
out += '/kolis/ (be busterio) len='+html2.length+' turi auto-h1: '+html2.includes('petshop-auto-h1')+'\n';
const h1b = [...html2.matchAll(/<h1[\s\S]{0,300}?<\/h1>/gi)];
out += '  h1 tagu: '+h1b.length+'\n';
h1b.forEach((m,i)=>{ out += '  h1['+i+'] = '+JSON.stringify(m[0].slice(0,200))+'\n'; });
putFile('diag.txt', out);
