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
 const m=o.match(/__RC:(\d+)\s*$/);return{rc:m?+m[1]:-1,out:o.replace(/__RC:\d+\s*$/,'')};}catch(e){return{rc:-99,out:String(e).slice(0,400)};}}
const API='https://api.sender.net/v2';
const H='-H "Authorization: Bearer '+MK+'" -H "Content-Type: application/json" -H "Accept: application/json"';
function req(m,p,body){
  let c='curl -sSk -X '+m+' '+H+' "'+API+p+'"';
  if(body){ fs.writeFileSync('/tmp/b.json',JSON.stringify(body)); c='curl -sSk -X '+m+' '+H+' --data-binary @/tmp/b.json "'+API+p+'"'; }
  const r=sh(c); try{ return JSON.parse(r.out); }catch(e){ return {__raw:r.out.slice(0,250)}; }
}
const O={deleted_subs:[], created_fields:[], skipped_fields:[], created_groups:[], deleted_wf:null, errors:[]};

// ---- 1) TRINTI testinius kontaktus
const TESTPAT=/example\.com|webhooktest|whsite|whunsub|whlong|wh_e2e|m4_consent_test|esp_v020_test|reactivate_test|random_notlisted/i;
const subs=req('GET','/subscribers?limit=100');
for(const s of ((subs&&subs.data)||[])){
  if(TESTPAT.test(s.email)){
    const r=req('DELETE','/subscribers/'+encodeURIComponent(s.email));
    O.deleted_subs.push({email:s.email, resp:JSON.stringify(r).slice(0,90)});
    sh('sleep 1');
  }
}

// ---- 2) TRINTI DRAFT workflow
const wfs=req('GET','/workflows');
for(const w of ((wfs&&wfs.data)||[])){
  if(String(w.status).toUpperCase()==='DRAFT' && /PS E2E|test/i.test(String(w.title))){
    const r=req('DELETE','/workflows/'+w.id);
    O.deleted_wf={id:w.id,title:w.title,resp:JSON.stringify(r).slice(0,120)};
  }
}

// ---- 3) PS_ laukai (pagal TZ v1.45 sarasa)
const WANT=[
 ['PS_CUSTOMER_ID','text'],['PS_LAST_ORDER_DATE','date'],['PS_ORDER_COUNT','number'],
 ['PS_LIFETIME_VALUE','number'],['PS_CUSTOMER_WAVE','text'],['PS_FOUNDING_SCORE','number'],
 ['PS_PET_SPECIES','text'],['PS_PET_NAME','text'],['PS_PET_LIFE_STAGE','text'],
 ['PS_DOG_SIZE','text'],['PS_FEEDING_TYPE','text'],['PS_PRIMARY_NEED','text'],
 ['PS_CURRENT_FOOD_BRAND','text'],['PS_REFILL_CANDIDATE','text'],['PS_NEXT_REFILL_DATE','date'],
 ['PS_SUBSCRIPTION_STATUS','text'],['PS_PREFERRED_SHIPPING','text'],
 ['PS_MARKETING_CONSENT','text'],['PS_TRANSACTIONAL_ONLY','text'],['PS_UNSUBSCRIBED_AT','date'],
 ['PS_LAST_EVENT_AT','date'],['PS_LOGIN_METHOD','text'],
 ['PS_LEGACY_EMAIL_LINKED','text'],['PS_LEGACY_LINK_PROMPT_SHOWN','text'],['PS_EMAIL_VERIFIED','text']
];
const cur=req('GET','/fields');
const have=new Set(((cur&&cur.data)||[]).map(f=>String(f.title)));
for(const [title,type] of WANT){
  if(have.has(title)){ O.skipped_fields.push(title); continue; }
  const r=req('POST','/fields',{title:title, type:type});
  const id=(r&&r.data&&r.data.id)||null;
  O.created_fields.push({title,type,id,resp:id?'OK':JSON.stringify(r).slice(0,110)});
  sh('sleep 1');
}

// ---- 4) Grupes
const gcur=req('GET','/groups');
const ghave=new Set(((gcur&&gcur.data)||[]).map(g=>String(g.title)));
for(const g of ['PS_ALL_ACTIVE','PS_LEGACY_IMPORT','PS_SUPPRESSED_OR_ARCHIVE']){
  if(ghave.has(g)) { O.created_groups.push({title:g,id:'JAU_YRA'}); continue; }
  const r=req('POST','/groups',{title:g});
  O.created_groups.push({title:g, id:(r&&r.data&&r.data.id)||JSON.stringify(r).slice(0,110)});
  sh('sleep 1');
}

// ---- 5) VERIFIKACIJA po darbu
O.after={
  subscribers: (()=>{const r=req('GET','/subscribers?limit=100');
      return ((r&&r.data)||[]).map(s=>({e:s.email, st:(s.status&&s.status.email)||s.status}));})(),
  fields: (()=>{const r=req('GET','/fields'); return ((r&&r.data)||[]).map(f=>f.title);})(),
  groups: (()=>{const r=req('GET','/groups'); return ((r&&r.data)||[]).map(g=>({t:g.title,id:g.id}));})(),
  workflows: (()=>{const r=req('GET','/workflows'); return ((r&&r.data)||[]).map(w=>({t:w.title,s:w.status}));})(),
  domains: (()=>{const r=req('GET','/domains'); return ((r&&r.data)||[]).map(x=>({d:x.domain_name,v:x.domain_verified,spf:x.spf_verified,dkim:x.dkim_verified,dmarc:x.dmarc}));})()
};
putB64('cln.json', Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
