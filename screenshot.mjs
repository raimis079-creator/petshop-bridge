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
const before=req('GET','/subscribers?limit=100');
const targets=((before&&before.data)||[]).filter(s=>/example\.com/i.test(s.email)).map(s=>s.email);
O.before_total=((before&&before.data)||[]).length;
O.targets=targets;
if(targets.length){
  O.delete_resp=JSON.stringify(req('DELETE','/subscribers',{subscribers:targets})).slice(0,200);
  // asinchronine operacija — laukiam ir tikrinam kelis kartus
  O.checks=[];
  for(let i=0;i<6;i++){
    sh('sleep 10');
    const a=req('GET','/subscribers?limit=100');
    const rem=((a&&a.data)||[]).filter(s=>/example\.com/i.test(s.email)).length;
    O.checks.push({after_s:(i+1)*10, liko_test:rem, viso:((a&&a.data)||[]).length});
    if(rem===0) break;
  }
}
const fin=req('GET','/subscribers?limit=100');
O.final=((fin&&fin.data)||[]).map(s=>({e:s.email, st:(s.status&&s.status.email)||s.status}));
O.groups=((req('GET','/groups?limit=100')||{}).data||[]).map(g=>({t:g.title,id:g.id,act:g.active_subscribers}));
O.domains=((req('GET','/domains')||{}).data||[]).map(x=>({d:x.domain_name,v:x.domain_verified,spf:x.spf_verified,dkim:x.dkim_verified,dmarc:x.dmarc}));
const fl=req('GET','/fields?limit=100');
O.ps_field_count=((fl&&fl.data)||[]).filter(f=>String(f.title).startsWith('PS_')).length;
O.workflows=((req('GET','/workflows')||{}).data||[]).map(w=>({t:w.title,s:w.status,id:w.id}));
putB64('fin.json', Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
