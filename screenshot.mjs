import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'fw',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function get(path){ try{ return execSync('curl -sk -u "$WPU:$WPP" "'+DEV+path+'"',{encoding:'utf8',maxBuffer:30000000,timeout:50000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }
const html=get('/taisykles/?nc='+Date.now());
// randam kur yra nuoroda /privatumo-politika/ ir istraukiam parent wrapper klases
const idx=html.indexOf('/privatumo-politika/');
const out={};
if(idx>=0){
  // kontekstas atgal - randam artimiausius parent div/section su class
  const before=html.slice(Math.max(0,idx-3000), idx);
  // visos class= reiksmes pries nuoroda (paskutines 6)
  const classes=[...before.matchAll(/class="([^"]*)"/g)].map(m=>m[1]);
  out.parent_classes=classes.slice(-8);
  // ir tikslus a tag
  const aStart=html.lastIndexOf('<a ',idx);
  out.a_tag=html.slice(aStart, idx+40);
}
// bendra struktura: page-content? entry-content?
out.has_entry_content=html.indexOf('entry-content')>=0;
out.has_page_content=html.indexOf('page-content')>=0;
out.has_page_wrapper=html.indexOf('page-wrapper')>=0;
// istraukiam pagrindini turinio konteineri
const m=html.match(/<div[^>]*class="[^"]*(?:entry-content|page-content|post-content)[^"]*"/i);
out.content_wrapper=m?m[0]:'nerastas';
putFile('findwrap.json',JSON.stringify(out));
