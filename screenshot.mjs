import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const TK=process.env.SENDER_TRANSACTIONAL_TOKEN;
function putB64(n,b){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b,...(s?{sha:s}:{})}));
  const c=execSync('curl -sk -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
function sh(c){try{return execSync(c+' 2>&1',{maxBuffer:20e6,shell:'/bin/bash'}).toString().trim();}catch(e){return 'ERR';}}
const O={};
const H='-H "Authorization: Bearer '+TK+'" -H "Content-Type: application/json" -H "Accept: application/json"';
function send(body,label){
  fs.writeFileSync('/tmp/m.json',JSON.stringify(body));
  const r=sh('curl -sSk -X POST '+H+' --data-binary @/tmp/m.json "https://api.sender.net/v2/message/send"');
  O[label]=r.slice(0,300);
}
const base={ from:{email:'terra@petshop.lt',name:'Petshop.lt'},
  to:{email:'raimundas@gyvunai.lt',name:'Raimis'},
  html:'<p>Patikra: i koki adresa siulo atsakyti jusu pastas?</p>' };
send({...base, subject:'REPLY TEST 1 (reply_to objektas)',
  reply_to:{email:'uzsakymai@petshop.lt',name:'Petshop.lt'}}, 'v1_objektas');
sh('sleep 3');
send({...base, subject:'REPLY TEST 2 (reply_to eilute)',
  reply_to:'uzsakymai@petshop.lt'}, 'v2_eilute');
sh('sleep 3');
send({...base, subject:'REPLY TEST 3 (be reply_to - kontrolinis)'}, 'v3_kontrolinis');
putB64('rt.json', Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
