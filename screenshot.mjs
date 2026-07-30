import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const MK=process.env.SENDER_MARKETING_TOKEN, TK=process.env.SENDER_TRANSACTIONAL_TOKEN;
function putB64(n,b){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b,...(s?{sha:s}:{})}));
  const c=execSync('curl -sk -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
function sh(c){try{return execSync(c+' 2>&1',{maxBuffer:20e6,shell:'/bin/bash'}).toString().trim();}catch(e){return 'ERR';}}
const API='https://api.sender.net/v2';
function call(m,p,body,tok){
  const t=tok||MK;
  const H='-H "Authorization: Bearer '+t+'" -H "Content-Type: application/json" -H "Accept: application/json"';
  let c='curl -sSk -X '+m+' '+H+' "'+API+p+'"';
  if(body){ fs.writeFileSync('/tmp/b.json',JSON.stringify(body)); c='curl -sSk -X '+m+' '+H+' --data-binary @/tmp/b.json "'+API+p+'"'; }
  const r=sh(c); try{ return JSON.parse(r); }catch(e){ return {__raw:String(r).slice(0,300)}; }
}
const O={};
// 1) esami webhookai
O.current = call('GET','/account/webhooks');
// 2) bandom uzregistruoti su ivairiais topic'ais — atsakymas parodys, kurie leidziami
const topics = ['subscribers/created','subscribers/updated','subscribers/deleted',
                'subscribers/subscribed','subscribers/unsubscribed','subscribers/added',
                'subscribers/bounce','subscribers/complaint','subscribers/hard_bounce',
                'campaigns/sent','campaigns/opened','campaigns/clicked','campaigns/bounced',
                'forms/submitted','automation/completed'];
O.probe={};
for (const t of topics){
  const r=call('POST','/account/webhooks',{url:'https://dev.avesa.lt/wp-json/petshop/v1/sender-webhook',topic:t});
  const s=JSON.stringify(r);
  O.probe[t]= s.length>220 ? s.slice(0,220) : s;
  // jei sukure — iskart trinam
  if (r && r.data && r.data.id) { O.probe[t]='SUKURTA id='+r.data.id; call('DELETE','/account/webhooks/'+r.data.id); }
  sh('sleep 1');
}
// 3) ar transakciniai laiskai turi statuso uzklausa
O.statuses = JSON.stringify(((call('GET','/subscribers?limit=100')||{}).data||[]).map(x=>({e:x.email,st:x.status}))); O.tx_msg = JSON.stringify(call('GET','/message/azv2GY-.eE9p2l-j09zEZv-qZE702PVAgR3-1yLdYe', null, TK)).slice(0,250);
O.tx_stats = JSON.stringify(call('GET','/message/stats', null, TK)).slice(0,250);
putB64('topics2.json', Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
