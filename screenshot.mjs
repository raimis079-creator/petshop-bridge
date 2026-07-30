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
 const m=o.match(/__RC:(\d+)\s*$/);return{rc:m?+m[1]:-1,out:o.replace(/__RC:\d+\s*$/,'')};}catch(e){return{rc:-99,out:String(e).slice(0,300)};}}

const API='https://api.sender.net/v2';
function get(path, tok){
  const t = tok || MK;
  const r = sh('curl -sSk -H "Authorization: Bearer '+t+'" -H "Content-Type: application/json" -H "Accept: application/json" "'+API+path+'"');
  try{ return JSON.parse(r.out); }catch(e){ return {__raw:r.out.slice(0,400), __rc:r.rc}; }
}

const O={tokens:{mk:!!MK, tk:!!TK}};

// 1) Paskyra
O.account = get('/account');
// 2) Grupes (listai)
O.groups = get('/groups');
// 3) Custom fields (PS_ atributai)
O.fields = get('/fields');
// 4) Kampanijos
O.campaigns = get('/campaigns');
// 5) Workflow / automations
O.workflows = get('/workflows');
O.automations = get('/automations');
// 6) Webhookai
O.webhooks = get('/account/webhooks');
// 7) Prenumeratoriu suvestine
O.subscribers_page1 = get('/subscribers?limit=5');
// 8) Domenai
O.domains = get('/domains');
// 9) Transactional token patikra
O.tx_check = get('/groups', TK);

putB64('snd.json', Buffer.from(JSON.stringify(O)).toString('base64'));
console.log('done');
