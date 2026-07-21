import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
function pr(n,o){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<5;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?nc='+Math.random()+'"').toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:Buffer.from(JSON.stringify(o)).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"').toString().trim();
  if(c==='200'||c==='201')return c;}return 'fail';}
function prbin(n,path){const b=fs.readFileSync(path).toString('base64');const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
  try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?nc='+Math.random()+'"').toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/img.json',JSON.stringify({message:'img',content:b,...(s?{sha:s}:{})}));
  return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/img.json "'+u+'"',{maxBuffer:20*1024*1024}).toString().trim();}
function get(url){ try{ return execSync('curl -skL --max-time 15 "'+url+'"',{maxBuffer:15*1024*1024}).toString(); }catch(e){ return ''; } }
const out={downloaded:{},hydro_imgs:{}};
// 1) parsisiunciam 242 mazu veisliu serimas
const img242='https://exclusion.lt/wp-content/uploads/2024/10/P18_Intestinal-sunims_kiauliena-ryziai_SAUSAS-mazoms-veislems_SERIMAS.png';
try{ execSync('curl -sk --max-time 25 -o /tmp/excl_242.png "'+img242+'"'); out.downloaded['242']={size:fs.statSync('/tmp/excl_242.png').size,up:prbin('excl_242.png','/tmp/excl_242.png')}; }catch(e){ out.downloaded['242']={err:String(e).slice(0,80)}; }
// 2) hydrolyzed puslapiu visi uploads PNG
const hydro=['https://exclusion.lt/product/hydrolyzed-hypoallergenic-su-hidrolizuota-zuvimi-ir-kukuruzu-krakmolu-mazoms-veislems/','https://exclusion.lt/product/hydrolyzed-hypoallergenic-su-hidrolizuota-zuvimi-ir-kukuruzu-krakmolu-vidutinems-ir-didelems-veislems/'];
for(const h of hydro){
  const html=get(h);
  const imgs=[];
  const ire=/https:\/\/exclusion\.lt\/wp-content\/uploads\/[0-9\/]+[^"'\s]+\.png/g;
  let im; while((im=ire.exec(html))!==null){ if(!/-\d+x\d+\./.test(im[0]))imgs.push(im[0]); }
  out.hydro_imgs[h]=[...new Set(imgs)];
}
console.log('PUT:',pr('getimg2.json',out));
