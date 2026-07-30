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
function get(p){const r=sh('curl -sSk -H "Authorization: Bearer '+MK+'" -H "Accept: application/json" "'+API+p+'"');
 try{return JSON.parse(r.out);}catch(e){return {__raw:r.out.slice(0,300)};}}

const O={};
// visi prenumeratoriai per puslapius
let all=[], page=1;
while(page<=12){
  const r=get('/subscribers?limit=100&page='+page);
  const d=(r&&r.data)||[];
  if(!d.length) break;
  all=all.concat(d.map(s=>({e:s.email, st:(s.status&&s.status.email)||s.status, tm:(s.status&&s.status.temail)||null,
                            sub:s.subscribed_at||s.created, unsub:s.unsubscribed_at||null})));
  if(d.length<100) break;
  page++;
}
O.total=all.length;
const byStatus={};
for(const s of all) byStatus[s.st]=(byStatus[s.st]||0)+1;
O.by_status=byStatus;
O.test_like=all.filter(s=>/example\.com|webhooktest|whsite|whunsub|whlong|\+test/i.test(s.e)).map(s=>({e:s.e,st:s.st}));
O.real=all.filter(s=>!/example\.com|webhooktest|whsite|whunsub|whlong/i.test(s.e)).map(s=>({e:s.e,st:s.st,unsub:s.unsub}));
O.sample=all.slice(0,8);
putB64('sb.json', Buffer.from(JSON.stringify(O)).toString('base64'));
console.log('done');
