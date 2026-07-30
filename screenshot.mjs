import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const MK=process.env.SENDER_MARKETING_TOKEN;
function putB64(n,b){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b,...(s?{sha:s}:{})}));
  const c=execSync('curl -sk -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
function sh(c){try{const o=execSync(c+' 2>&1; echo "__RC:$?"',{maxBuffer:50e6,shell:'/bin/bash'}).toString();
 const m=o.match(/__RC:(\d+)\s*$/);return{rc:m?+m[1]:-1,out:o.replace(/__RC:\d+\s*$/,'')};}catch(e){return{rc:-99,out:String(e).slice(0,300)};}}
const API='https://api.sender.net/v2';
const H='-H "Authorization: Bearer '+MK+'" -H "Content-Type: application/json" -H "Accept: application/json"';
function req(m,p,body){
  let c='curl -sSk -X '+m+' '+H+' "'+API+p+'"';
  if(body){ fs.writeFileSync('/tmp/b.json',JSON.stringify(body)); c='curl -sSk -X '+m+' '+H+' --data-binary @/tmp/b.json "'+API+p+'"'; }
  const r=sh(c); try{ return JSON.parse(r.out); }catch(e){ return {__raw:r.out.slice(0,220)}; }
}
const O={};
// 1) vieno kontakto struktura (ar yra ID)
const one=req('GET','/subscribers?limit=1');
O.shape = one && one.data && one.data[0] ? Object.keys(one.data[0]) : one;
O.sample = one && one.data && one.data[0] ? {id:one.data[0].id, email:one.data[0].email} : null;

const TEST=/example\.com/i;
const list=req('GET','/subscribers?limit=100');
const targets=((list&&list.data)||[]).filter(s=>TEST.test(s.email));
O.targets=targets.map(s=>({id:s.id,e:s.email}));

// 2) bandom variantus ant PIRMO taikinio
if(targets.length){
  const t=targets[0];
  O.tries=[];
  O.tries.push({v:'DELETE /subscribers {subscribers:[email]}', r:JSON.stringify(req('DELETE','/subscribers',{subscribers:[t.email]})).slice(0,180)});
  O.tries.push({v:'DELETE /subscribers {subscribers:[id]}',    r:JSON.stringify(req('DELETE','/subscribers',{subscribers:[t.id]})).slice(0,180)});
  O.tries.push({v:'DELETE /subscribers/{id}',                  r:JSON.stringify(req('DELETE','/subscribers/'+t.id)).slice(0,180)});
  // patikra ar dingo
  const after=req('GET','/subscribers?limit=100');
  O.still_there = ((after&&after.data)||[]).some(s=>s.email===t.email);
  O.after_status = ((after&&after.data)||[]).filter(s=>s.email===t.email).map(s=>(s.status&&s.status.email)||s.status);
}
putB64('del.json', Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
