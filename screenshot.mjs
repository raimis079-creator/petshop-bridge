import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const OLD="https://petshop.lt";
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'fo2',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
const urls=['/apie-mus','/contact','/slapuku-naudojimas','/privatumo-politika','/pirkimo-salygos-ir-taisykles','/apmokejimas','/pristatymas','/grazinimas','/sunu-veisles','/sunims/prieziuros-priemones'];
const out={};
for(const u of urls){
  let h='';
  try{ h=execSync('curl -s -L "'+OLD+u+'" 2>/dev/null',{encoding:'utf8',maxBuffer:20000000,timeout:30000}); }catch(e){ h='ERR:'+String(e).slice(0,40); }
  let title='',words=0,preview='';
  try{
    const tm=h.match(/<title>([^<]*)<\/title>/i); title=tm?tm[1].slice(0,80):'';
    const txt=h.replace(/<script[^]*?<\/script>/gi,' ').replace(/<style[^]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim();
    words=txt.split(' ').length;
    // OpenCart turinys dazniausiai po h1; imam nuo pirmo prasmingo teksto
    preview=txt.slice(0,500);
  }catch(e){ title='PARSE_ERR'; }
  out[u]={len:h.length,title,words,preview};
}
putFile('fetchold2.json',JSON.stringify(out));
console.log('done',Object.keys(out).length);
