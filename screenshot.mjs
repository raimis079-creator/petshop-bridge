import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'ur',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function api(p){ try{ return execSync('curl -sk -u "$WPU:$WPP" --max-time 20 "'+DEV+p+'"',{encoding:'utf8',maxBuffer:10000000,timeout:22000,env:{...process.env,WPU,WPP}}); }catch(e){ return ''; } }
let out='';
// 1. Hero media ID? Iskeliu is HTML CSS background-image
const html = (()=>{ try{ return execSync('curl -sk -u "$WPU:$WPP" -L --max-time 25 "'+DEV+'/pagrindinis-test/"',{encoding:'utf8',maxBuffer:20000000,timeout:27000,env:{...process.env,WPU,WPP}}); }catch(e){ return ''; }})();
out += '=== URL is realaus puslapio HTML ===\n';
const bg = [...html.matchAll(/background-image:\s*url\(([^)]+)\)/g)].map(m=>m[1].replace(/["']/g,''));
bg.forEach(u=>{ if(u.includes('/2026/')) out += 'CSS bg : '+u+'\n'; });
const imgs = [...html.matchAll(/<img[^>]+src="([^"]+2026\/07[^"]*)"/g)].map(m=>m[1]);
imgs.forEach(u=>{ out += '<img>  : '+u+'\n'; });
out += '\n';

// 2. Media API source_url
out += '=== WP media API source_url ===\n';
for(const id of [34545,34561,34562,34563,34564,34565,34566,34577,34578]){
  const r = api('/wp-json/wp/v2/media/'+id+'?_fields=id,source_url,title');
  try{ const j=JSON.parse(r); out += id+' : '+(j.source_url||'NERA')+'\n'; }
  catch(e){ out += id+' : ERR\n'; }
}
out += '\n=== HTTP kodai (be jokio auth) ===\n';
const all = [...new Set([...bg.filter(u=>u.includes('/2026/')), ...imgs])];
for(const u of all){
  let c='?';
  try{ c = execSync('curl -sk -o /dev/null -w "%{http_code}" --max-time 12 "'+u+'"',{encoding:'utf8',timeout:14000}).trim(); }catch(e){ c='ERR'; }
  out += c+'  '+u+'\n';
}
putFile('urls.txt', out);
