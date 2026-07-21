import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const U=process.env.WP_USER||'', P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='-u "'+U+':'+P+'"';
function wj(m,path,body){fs.writeFileSync('/tmp/wbody.json', JSON.stringify(body));
  return execSync('curl -sk '+AUTH+' -X '+m+' -H "Content-Type: application/json" --data-binary @/tmp/wbody.json "https://dev.avesa.lt/wp-json/'+path+'"',{maxBuffer:50*1024*1024}).toString();}
function pr(n,o){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<5;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?nocache='+Math.random()+'"').toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:Buffer.from(JSON.stringify(o)).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"').toString().trim();
  if(c==='200'||c==='201')return c;}return 'fail';}
const o={};
// stored content via wp/v2 context=edit
let stored='';
try{ stored=execSync('curl -sk '+AUTH+' "https://dev.avesa.lt/wp-json/wp/v2/product/20943?context=edit&_fields=content"',{maxBuffer:20*1024*1024}).toString(); }catch(e){ o.storederr=String(e).slice(0,150); }
let raw='';
try{ const j=JSON.parse(stored); raw=(j.content&&j.content.raw)?j.content.raw:''; }catch(e){ raw='PARSE_FAIL:'+stored.slice(0,120); }
o.stored_kiekis = (raw.match(/Kiekis \/ 24 val\./g)||[]).length;
o.stored_b2b = (raw.match(/class="b2b-black"/g)||[]).length;
// rendered
let h=''; try{ h=execSync('curl -Lsk "https://dev.avesa.lt/?p=20943"',{maxBuffer:30*1024*1024}).toString(); }catch(e){}
const idxs=[]; let ix=h.indexOf('Kiekis / 24 val.');
while(ix!==-1){ idxs.push(ix); ix=h.indexOf('Kiekis / 24 val.', ix+1); }
o.rendered_kiekis=idxs.length;
o.contexts=idxs.map(i=>h.slice(Math.max(0,i-140), i+40).replace(/\s+/g,' '));
console.log('PUT:',pr('dbg20943.json',o));
