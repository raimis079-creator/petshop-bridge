import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
function pr(n,o){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<5;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?nocache='+Math.random()+'"').toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:Buffer.from(JSON.stringify(o)).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"').toString().trim();
  if(c==='200'||c==='201')return c;}return 'fail';}
const cats=['https://exclusion.lt/hypoallergenic-katems/','https://exclusion.lt/exclusion-mediterraneo/'];
const o={};
for(const url of cats){
  let h=''; try{ h=execSync('curl -Lsk --max-time 40 "'+url+'"',{maxBuffer:30*1024*1024}).toString(); }catch(e){ h='ERR:'+String(e).slice(0,100); }
  // product links
  const links=[...new Set((h.match(/https:\/\/exclusion\.lt\/product\/[a-z0-9\-]+\//g)||[]))];
  // any feeding/norm-ish image srcs
  const imgs=[...new Set((h.match(/https:\/\/exclusion\.lt\/wp-content\/uploads\/[^"'\s)]+\.(?:png|jpg|jpeg|webp)/gi)||[]))];
  o[url]={len:h.length, product_links:links, img_count:imgs.length, imgs_sample:imgs.slice(0,15)};
}
console.log('PUT:',pr('catcrawl.json',o));
