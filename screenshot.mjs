import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const OLD="https://petshop.lt";
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'fc',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
// tik turinio puslapiai (ne 2 landing/kategorija - tuos atskirai)
const urls=['/apie-mus','/contact','/slapuku-naudojimas','/privatumo-politika','/pirkimo-salygos-ir-taisykles','/apmokejimas','/pristatymas','/grazinimas'];
const out={};
for(const u of urls){
  let h='';
  try{ h=execSync('curl -s -L "'+OLD+u+'" 2>/dev/null',{encoding:'utf8',maxBuffer:20000000,timeout:30000}); }catch(e){ out[u]='ERR'; continue; }
  // OpenCart turinys: dazniausiai <div id="content"> ... iki footerio. Bandome keleta selektoriu.
  let c='';
  let m=h.match(/<div[^>]*id=["']content["'][^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<footer/i);
  if(!m) m=h.match(/<div[^>]*id=["']content["'][^>]*>([\s\S]*?)<footer/i);
  if(!m) m=h.match(/<div[^>]*id=["']content["'][^>]*>([\s\S]*)/i);
  c=m?m[1]:'';
  // isvalom: nuimam breadcrumb, h1 lieka, nuimam scripts
  c=c.replace(/<script[^]*?<\/script>/gi,'').replace(/<ul class="breadcrumb[^]*?<\/ul>/gi,'');
  // apkarpom jei per ilgas (kategorijos gridas)
  out[u]=c.slice(0,60000);
}
putFile('fetchcontent.json',JSON.stringify(out));
console.log('done');
