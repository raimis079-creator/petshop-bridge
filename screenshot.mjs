import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const MK=process.env.SENDER_MARKETING_TOKEN;
function putB64(n,b){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b,...(s?{sha:s}:{})}));
  const c=execSync('curl -sk -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
function sh(c){try{return execSync(c+' 2>&1',{maxBuffer:20e6,shell:'/bin/bash'}).toString().trim();}catch(e){return 'ERR';}}
const H='-H "Authorization: Bearer '+MK+'" -H "Content-Type: application/json" -H "Accept: application/json"';
function call(m,p,body){ let c='curl -sSk -X '+m+' '+H+' "https://api.sender.net/v2'+p+'"';
 if(body){ fs.writeFileSync('/tmp/b.json',JSON.stringify(body)); c='curl -sSk -X '+m+' '+H+' --data-binary @/tmp/b.json "https://api.sender.net/v2'+p+'"'; }
 const r=sh(c); try{return JSON.parse(r);}catch(e){return {__raw:String(r).slice(0,200)};} }
const O={};
O.before=(((call('GET','/account/webhooks'))||{}).data||[]).map(w=>w.topic);
if(!O.before.includes('subscribers/unsubscribed')){
  O.restore=JSON.stringify(call('POST','/account/webhooks',
    {url:'https://dev.avesa.lt/wp-json/petshop/v1/sender-webhook',topic:'subscribers/unsubscribed'})).slice(0,200);
} else O.restore='jau yra';
O.after=(((call('GET','/account/webhooks'))||{}).data||[]).map(w=>({t:w.topic,s:w.status,id:w.id}));
putB64('wrestore.json', Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
