import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
function putbin(name, filepath){
  const b64=fs.readFileSync(filepath).toString('base64');
  const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+name;
  let sha='';
  try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?nocache='+Math.random()+'"').toString());if(j.sha)sha=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/bp.json',JSON.stringify({message:'img',content:b64,...(sha?{sha}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/bp.json "'+u+'"').toString().trim();
  return c;
}
function pr(n,o){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<5;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?nocache='+Math.random()+'"').toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:Buffer.from(JSON.stringify(o)).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"').toString().trim();
  if(c==='200'||c==='201')return c;}return 'fail';}
const imgs={
 T83:'https://exclusion.lt/wp-content/uploads/2024/10/P33_HYPOALLERGENIC_katems_kiauliena-bulves_SAUSAS_SERIMAS.png',
 T84:'https://exclusion.lt/wp-content/uploads/2024/10/P58_MONOPROTEIN_suaugusioms-katems-su-vistiena_SAUSAS_SERIMAS.png',
 T85:'https://exclusion.lt/wp-content/uploads/2024/10/P58_MONOPROTEIN_jauniems-kaciukams-su-vistiena_SAUSAS_SERIMAS.png',
 T200:'https://exclusion.lt/wp-content/uploads/2024/10/P59_MONOPROTEIN_sterilizuotoms-katems-su-vistiena_SAUSAS_SERIMAS.png',
 T86:'https://exclusion.lt/wp-content/uploads/2024/10/P60_MONOPROTEIN_didelio-dydzio-sterilizuotoms-katems-su-vistiena_SAUSAS_SERIMAS.png'
};
const o={};
for(const [k,url] of Object.entries(imgs)){
  const fp='/tmp/'+k+'.png';
  try{ execSync('curl -Lsk --max-time 40 -o '+fp+' "'+url+'"'); }catch(e){}
  let sz=0; try{ sz=fs.statSync(fp).size; }catch(e){}
  const code = sz>0 ? putbin('cat_'+k+'.png', fp) : 'no-download';
  o[k]={size:sz, put:code};
}
console.log('PUT:',pr('catimg_status.json',o));
