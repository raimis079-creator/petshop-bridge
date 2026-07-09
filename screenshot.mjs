import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'e3',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function get(u){ try{ return execSync('curl -sk -u "$WPU:$WPP" -L --max-time 20 "'+DEV+u+'"',{encoding:'utf8',maxBuffer:20000000,timeout:22000,env:{...process.env,WPU,WPP}}); }catch(e){ return ''; } }
let out='';
let bad=0, found=0;
const urls = ['/bokseris/','/josera-sunu-maistas/','/josera-kaciu-maistas/','/geriausias-sausas-sunu-maistas/','/dalmantinas/','/ciau-ciau/','/dzeko-raselo-terjeras/','/suns-serimo-lentele-gramais/','/pasiulymai/','/daugiau-pigiau/','/kontaktai/','/pristatymas/'];
for(const u of urls){
  const html = get(u+'?nc='+Date.now());
  if(!html){ out += u+'  FETCH FAIL\n'; continue; }
  const m = html.match(/<h1[\s\S]{0,400}?<\/h1>/i);
  if(!m){ out += u+'  h1 NERASTA\n'; continue; }
  found++;
  const tag = m[0];
  const inner = tag.replace(/^<h1[^>]*>/i,'').replace(/<\/h1>$/i,'');
  const dbl = /&amp;#\d/.test(inner) || /&amp;amp;/.test(inner);
  if(dbl) bad++;
  out += (dbl?'BLOGAI ':'OK     ')+u+'\n';
  out += '        source: '+JSON.stringify(inner)+'\n';
}
out += '\nrasta h1: '+found+' | dvigubo encode atveju: '+bad+'\n';
putFile('ent3.txt', out);
