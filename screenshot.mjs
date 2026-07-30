import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const MK=process.env.SENDER_MARKETING_TOKEN, TK=process.env.SENDER_TRANSACTIONAL_TOKEN;
function putB64(n,b){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b,...(s?{sha:s}:{})}));
  const c=execSync('curl -sk -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
function sh(c){try{const o=execSync(c+' 2>&1; echo "__RC:$?"',{maxBuffer:50e6,shell:'/bin/bash'}).toString();
 const m=o.match(/__RC:(\d+)\s*$/);return{rc:m?+m[1]:-1,out:o.replace(/__RC:\d+\s*$/,'')};}catch(e){return{rc:-99,out:String(e).slice(0,250)};}}
const API='https://api.sender.net/v2';
function call(m,p,body,tok){
  const t=tok||MK;
  const H='-H "Authorization: Bearer '+t+'" -H "Content-Type: application/json" -H "Accept: application/json"';
  let c='curl -sSk -X '+m+' '+H+' "'+API+p+'"';
  if(body){ fs.writeFileSync('/tmp/b.json',JSON.stringify(body)); c='curl -sSk -X '+m+' '+H+' --data-binary @/tmp/b.json "'+API+p+'"'; }
  const r=sh(c); try{ return JSON.parse(r.out); }catch(e){ return {__raw:r.out.slice(0,200)}; }
}
const O={};
// 1) ar galima kurti workflow per API
O.post_workflows = JSON.stringify(call('POST','/workflows',{title:'PS PROBE (delete me)'})).slice(0,220);
// 2) kampanijos (galbut per jas siunciam)
O.post_campaigns = JSON.stringify(call('POST','/campaigns',{title:'PS PROBE campaign'})).slice(0,220);
// 3) esamo workflow detales — ar matosi struktura
const wf=call('GET','/workflows');
const first=((wf&&wf.data)||[])[0];
if(first){ O.workflow_detail = JSON.stringify(call('GET','/workflows/'+first.id)).slice(0,700); }
// 4) transakciniai laiskai — ar galim siusti su HTML (musu sablonai)
O.tx_send_shape = JSON.stringify(call('POST','/message/send',{
   to:[{email:'raimundas@gyvunai.lt'}], from:{email:'terra@petshop.lt',name:'Petshop.lt'},
   subject:'PS probe (netikras)', html:'<p>probe</p>', __probe:true
}, TK)).slice(0,300);
putB64('wp3.json', Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
