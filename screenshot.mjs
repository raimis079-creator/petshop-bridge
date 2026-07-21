import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
function pr(n,o){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<5;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?nocache='+Math.random()+'"').toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:Buffer.from(JSON.stringify(o)).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"').toString().trim();
  if(c==='200'||c==='201')return c;}return 'fail';}
const prods={
 T83:'https://exclusion.lt/product/noble-grain-sausas-maistas-suaugusioms-katems-su-kiauliena-ir-bulvemis/',
 T84:'https://exclusion.lt/product/noble-grain-sausas-maistas-suaugusioms-katems-su-vistiena/',
 T85:'https://exclusion.lt/product/noble-grain-sausas-maistas-jauniems-kaciukams-su-vistiena/',
 T200:'https://exclusion.lt/product/noble-grain-sausas-maistas-sterilizuotoms-katems-su-vistiena/',
 T86:'https://exclusion.lt/product/noble-grain-sausas-maistas-didelio-dydzio-sterilizuotoms-katems-su-vistiena/'
};
// common non-feeding images to exclude
const skip=/logo|cruelty_free|carne_disidratata|conservanti|beta_glucani|mos_fos|condroitina|punto\d|cropped|250x100|Diet-250/i;
const o={};
for(const [k,url] of Object.entries(prods)){
  let h=''; try{ h=execSync('curl -Lsk --max-time 35 "'+url+'"',{maxBuffer:30*1024*1024}).toString(); }catch(e){ h='ERR'; }
  const tm=h.match(/<title>(.*?)<\/title>/); 
  const imgs=[...new Set((h.match(/https:\/\/exclusion\.lt\/wp-content\/uploads\/[^"'\s)]+\.(?:png|jpg|jpeg|webp)/gi)||[]))].filter(x=>!skip.test(x));
  // feeding-ish keyword presence
  const feedKw = /razion|tabella|feeding|dosi|dose|kg|grammi|gramas|per parą|kiekis/i.test(h);
  o[k]={url, title: tm?tm[1]:'', len:h.length, imgs, feedKw};
}
console.log('PUT:',pr('catprod.json',o));
