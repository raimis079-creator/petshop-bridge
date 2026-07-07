import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const OLD="https://petshop.lt";
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'fa',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function extract(h){
  const start=h.indexOf('<div class="page__content"');
  if(start<0) return '';
  let i=h.indexOf('>',start)+1, depth=1, j=i;
  while(j<h.length && depth>0){
    const nd=h.indexOf('<div',j), nc=h.indexOf('</div>',j);
    if(nc<0) break;
    if(nd>=0 && nd<nc){ depth++; j=nd+4; } else { depth--; j=nc+6; }
  }
  return h.slice(i,j-6);
}
const urls=['/apie-mus','/contact','/slapuku-naudojimas','/privatumo-politika','/pirkimo-salygos-ir-taisykles','/apmokejimas','/pristatymas','/grazinimas'];
const out={};
for(const u of urls){
  try{ const h=execSync('curl -s -L "'+OLD+u+'" 2>/dev/null',{encoding:'utf8',maxBuffer:20000000,timeout:30000}); out[u]=extract(h); }catch(e){ out[u]='ERR'; }
}
putFile('fetchall.json',JSON.stringify(out));
console.log('done', Object.keys(out).map(k=>k+':'+out[k].length).join(' '));
