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
const O={pages:[]};
// laukai su puslapiavimu
let all=[],page=1;
while(page<=8){
  const r=get('/fields?limit=100&page='+page);
  const d=(r&&r.data)||[];
  O.pages.push({page,count:d.length, meta:(r&&r.meta)?JSON.stringify(r.meta).slice(0,150):null});
  if(!d.length) break;
  all=all.concat(d.map(f=>({t:f.title,ty:f.type,id:f.id})));
  if(d.length<100) break;
  page++;
}
O.fields_total=all.length;
O.fields=all;
O.ps_fields=all.filter(f=>String(f.t).startsWith('PS_')).map(f=>f.t).sort();
// grupes / subs / workflow po valymo
O.groups=((get('/groups?limit=100')||{}).data||[]).map(g=>({t:g.title,id:g.id,act:g.active_subscribers}));
O.subs=((get('/subscribers?limit=100')||{}).data||[]).map(s=>({e:s.email,st:(s.status&&s.status.email)||s.status}));
O.workflows=((get('/workflows')||{}).data||[]).map(w=>({t:w.title,s:w.status,id:w.id}));
O.domains=((get('/domains')||{}).data||[]).map(x=>({d:x.domain_name,v:x.domain_verified,spf:x.spf_verified,dkim:x.dkim_verified,dmarc:x.dmarc}));
putB64('vf2.json', Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
