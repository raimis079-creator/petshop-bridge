import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const OLD="https://petshop.lt";
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'fo',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function fetch(u){ try{ return execSync('curl -s -L "'+OLD+u+'"',{encoding:'utf8',maxBuffer:20000000,timeout:35000}); }catch(e){ return 'EXC'; } }
const urls=['/apie-mus','/contact','/slapuku-naudojimas','/privatumo-politika','/pirkimo-salygos-ir-taisykles','/apmokejimas','/pristatymas','/grazinimas','/sunu-veisles','/sunims/prieziuros-priemones'];
const out={};
for(const u of urls){
  const h=fetch(u);
  const code=h==='EXC'?'EXC':(h.length>500?'200ish':'short');
  // istraukiam pagrindini turini: #content, .page-content, arba article
  let body=h;
  // paprastas title + word count + ar yra content div
  const title=((h.match(/<title>([^<]*)<\/title>/i)||[])[1]||'').slice(0,80);
  // bandome rasti turinio bloka OpenCart: #content
  let content='';
  const cm=h.match(/<div[^>]*id=["']content["'][^>]*>([\s\S]*?)<\/div>\s*<footer/i) || h.match(/<div[^>]*id=["']content["'][^>]*>([\s\S]*?)$/i);
  if(cm) content=cm[1];
  // suskaiciuojam teksto zodzius (be tagu)
  const textonly=(content||h).replace(/<script[\s\S]*?<\/script>/gi,'').replace(/<style[\s\S]*?<\/style>/gi,'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
  out[u]={title,code,html_len:h.length,text_words:textonly.split(' ').length,content_len:content.length,text_preview:textonly.slice(0,400)};
}
putFile('fetchold_meta.json',JSON.stringify(out));
