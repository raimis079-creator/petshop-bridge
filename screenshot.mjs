import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function sh(c){try{return execSync(c+' 2>&1',{maxBuffer:20e6,shell:'/bin/bash'}).toString();}catch(e){return String(e).slice(0,300);}}
function putFile(name,buf){const u='https://api.github.com/repos/'+REPO+'/contents/'+name;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk --max-time 30 -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:80e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'s628',content:buf.toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -sk --max-time 90 -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:80e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={VERSIJA_RUN:'run628'};

// ---------- 1. PILNAS SNIPPETU SARASAS ----------
let lst=[];
try{lst=JSON.parse(sh('curl -sSk --max-time 60 '+AUTH+' "'+API+'"'));}catch(e){O.klaida='saraso nera';}
O.visi_snippetai=(Array.isArray(lst)?lst:[]).map(s=>({id:s.id,name:s.name,active:!!s.active,scope:s.scope}));

// ---------- 2. VISU TEMP DEAKTYVAVIMAS ----------
O.temp_deaktyvuoti=[]; O.temp_bandyta_trinti=[];
for(const s of (Array.isArray(lst)?lst:[])){
  const n=String(s.name||'');
  if(n.startsWith('TEMP')){
    if(s.active){
      fs.writeFileSync('/tmp/off.json',JSON.stringify({active:false}));
      sh('curl -sSk --max-time 30 -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/off.json "'+API+'/'+s.id+'"');
    }
    O.temp_deaktyvuoti.push({id:s.id,name:n});
    const d=sh('curl -sSk --max-time 30 -w "|%{http_code}" -X DELETE '+AUTH+' "'+API+'/'+s.id+'"');
    O.temp_bandyta_trinti.push({id:s.id,atsakymas:d.slice(-30)});
  }
}

// ---------- 3. STOCK SERVICE v1.2 ----------
const PHP=Buffer.from('PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZiAoICEgaXNzZXQoJF9HRVRbJ3BzX25lZyddKSB8fCAkX0dFVFsncHNfbmVnJ10gIT09ICdLNjI4bicgKSByZXR1cm47CiAgaWYgKCAhIGhlYWRlcnNfc2VudCgpICkgeyBub2NhY2hlX2hlYWRlcnMoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgfQogIEBzZXRfdGltZV9saW1pdCgyODApOwogIGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsKICAkcj1hcnJheSgnVkVSU0lKQSc9PidzNjI4JywnUkVaSU1BUyc9PidUSUsgU0tBSVRZTUFTJyk7CgogIC8vIFZJU09TIHByZWtlcyBzdSBuZWlnaWFtdSBfc3RvY2sgKG5lIHRpayBwdWJsaXNoKQogICRuZWc9JHdwZGItPmdldF9yZXN1bHRzKAogICAgIlNFTEVDVCBwby5JRCwgcG8ucG9zdF90aXRsZSwgcG8ucG9zdF9zdGF0dXMsIHBvLnBvc3RfbW9kaWZpZWQsIG0ubWV0YV92YWx1ZSBzdG9jawogICAgIEZST00geyRwfXBvc3RzIHBvIEpPSU4geyRwfXBvc3RtZXRhIG0gT04gbS5wb3N0X2lkPXBvLklEIEFORCBtLm1ldGFfa2V5PSdfc3RvY2snCiAgICAgV0hFUkUgcG8ucG9zdF90eXBlIElOICgncHJvZHVjdCcsJ3Byb2R1Y3RfdmFyaWF0aW9uJykgQU5EIG0ubWV0YV92YWx1ZSswIDwgMAogICAgIE9SREVSIEJZIG0ubWV0YV92YWx1ZSswIEFTQyIsIEFSUkFZX0EpOwogICRvdXQ9YXJyYXkoKTsKICBmb3JlYWNoKCRuZWcgYXMgJG4pewogICAgJHBpZD0oaW50KSRuWydJRCddOwogICAgJGU9YXJyYXkoCiAgICAgICdpZCc9PiRwaWQsCiAgICAgICdwYXZhZGluaW1hcyc9Pmh0bWxfZW50aXR5X2RlY29kZShtYl9zdWJzdHIoJG5bJ3Bvc3RfdGl0bGUnXSwwLDYwKSksCiAgICAgICd0aXBhcyc9PmdldF9wb3N0X3R5cGUoJHBpZCksCiAgICAgICdzdGF0dXNhcyc9PiRuWydwb3N0X3N0YXR1cyddLAogICAgICAnc3RvY2snPT4kblsnc3RvY2snXSwKICAgICAgJ3Bhc2t1dGluaXNfa2VpdGltYXMnPT4kblsncG9zdF9tb2RpZmllZCddLAogICAgKTsKICAgIGZvcmVhY2goYXJyYXkoJ19wc19zYW5kZWxpcycsJ19tYW5hZ2Vfc3RvY2snLCdfYmFja29yZGVycycsJ19zdG9ja19zdGF0dXMnLCdfb3duX3N0b2NrX3F0eScsCiAgICAgICAgICAgICAgICAgICdfdmZfcXR5JywnX3ZmX3N1cHBsaWVyX3NrdScsJ192Zl9sYXN0X3N5bmMnLCdfc2t1JywnX3ByaWNlJywnX2Nvc3RfcHJpY2UnKSBhcyAkayl7CiAgICAgICR2PWdldF9wb3N0X21ldGEoJHBpZCwkayx0cnVlKTsgaWYoJHYhPT0nJykgJGVbbHRyaW0oJGssJ18nKV09JHY7CiAgICB9CiAgICAvLyBraWVrIGthcnR1IHBpcmt0YSBpciBrYWRhIHBhc2t1dGluaSBrYXJ0YQogICAgJGVbJ3BhcmR1b3RhX3ZudCddPShpbnQpJHdwZGItPmdldF92YXIoJHdwZGItPnByZXBhcmUoCiAgICAgICJTRUxFQ1QgQ09BTEVTQ0UoU1VNKGltMi5tZXRhX3ZhbHVlKSwwKSBGUk9NIHskcH13b29jb21tZXJjZV9vcmRlcl9pdGVtcyBpCiAgICAgICBKT0lOIHskcH13b29jb21tZXJjZV9vcmRlcl9pdGVtbWV0YSBpbSBPTiBpbS5vcmRlcl9pdGVtX2lkPWkub3JkZXJfaXRlbV9pZCBBTkQgaW0ubWV0YV9rZXk9J19wcm9kdWN0X2lkJwogICAgICAgSk9JTiB7JHB9d29vY29tbWVyY2Vfb3JkZXJfaXRlbW1ldGEgaW0yIE9OIGltMi5vcmRlcl9pdGVtX2lkPWkub3JkZXJfaXRlbV9pZCBBTkQgaW0yLm1ldGFfa2V5PSdfcXR5JwogICAgICAgV0hFUkUgaW0ubWV0YV92YWx1ZT0lZCIsICRwaWQpKTsKICAgICRlWyd1enNha3ltdV9laWx1Y2l1J109KGludCkkd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgKICAgICAgIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskcH13b29jb21tZXJjZV9vcmRlcl9pdGVtbWV0YSBpbQogICAgICAgV0hFUkUgaW0ubWV0YV9rZXk9J19wcm9kdWN0X2lkJyBBTkQgaW0ubWV0YV92YWx1ZT0lZCIsICRwaWQpKTsKICAgIC8vIGFyIHlyYSB0aWVraW1vIGVpbHV0ZXNlCiAgICAkZVsndGlla2ltb19laWx1Y2l1J109KGludCkkd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgKICAgICAgIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskcH1wc190aWVraW1hc19laWwgV0hFUkUgcHJvZHVjdF9pZD0lZCIsICRwaWQpKTsKICAgIC8vIHNvdXJjZXMgaXJhc2FzCiAgICAkZVsnc291cmNlcyddPSR3cGRiLT5nZXRfcmVzdWx0cygkd3BkYi0+cHJlcGFyZSgKICAgICAgIlNFTEVDVCBzb3VyY2Usc3RvY2tfcXR5LGNvc3RfbmV0LHByaW9yaXR5IEZST00geyRwfXBzX3NvdXJjZXMgV0hFUkUgcHJvZHVjdF9pZD0lZCIsJHBpZCksIEFSUkFZX0EpOwogICAgJG91dFtdPSRlOwogIH0KICAkclsnbmVpZ2lhbWknXT0kb3V0OwogICRyWyduZWlnaWFtdV9za2FpY2l1cyddPWNvdW50KCRvdXQpOwoKICAvLyBKb3NlcmEgZGV0YWxpYWkKICAkaj0xNzk3ODsKICAkclsnam9zZXJhJ109YXJyYXkoJ2lkJz0+JGosJ3Bhdic9Pmh0bWxfZW50aXR5X2RlY29kZShnZXRfdGhlX3RpdGxlKCRqKSkpOwogIGZvcmVhY2goYXJyYXkoJ19zdG9jaycsJ19tYW5hZ2Vfc3RvY2snLCdfc3RvY2tfc3RhdHVzJywnX3BzX3NhbmRlbGlzJywnX293bl9zdG9ja19xdHknLAogICAgICAgICAgICAgICAgJ192Zl9xdHknLCdfdmZfc3VwcGxpZXJfc2t1JywnX3ZmX2xhc3Rfc3luYycsJ19wcmljZScpIGFzICRrKXsKICAgICRyWydqb3NlcmEnXVtsdHJpbSgkaywnXycpXT1nZXRfcG9zdF9tZXRhKCRqLCRrLHRydWUpOwogIH0KICAkclsnam9zZXJhJ11bJ3NvdXJjZXMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoCiAgICAiU0VMRUNUIHNvdXJjZSxzdG9ja19xdHkscHJpb3JpdHksc3luY2VkX2F0IEZST00geyRwfXBzX3NvdXJjZXMgV0hFUkUgcHJvZHVjdF9pZD0lZCBPUkRFUiBCWSBwcmlvcml0eSIsJGopLCBBUlJBWV9BKTsKICAkclsnam9zZXJhJ11bJ3BhYWlza2luaW1hcyddPSdfc3RvY2sgcm9kbyB0aWsgQVY7IFZGIGxpa3V0aXMgX3ZmX3F0eSBsYXVrZSwgaSBfc3RvY2sgbmVwYXRlbmthJzsKCiAgLy8ga2llayBpcyB2aXNvIHByZWtpdSBzdSBfc3RvY2s9MCBpciBzdG9ja19zdGF0dXMKICAkclsnc3RhdGlzdGlrYSddPWFycmF5KAogICAgJ3N0b2NrX25laWdpYW1hcyc9PihpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskcH1wb3N0bWV0YSBtIEpPSU4geyRwfXBvc3RzIHBvIE9OIHBvLklEPW0ucG9zdF9pZCBBTkQgcG8ucG9zdF90eXBlPSdwcm9kdWN0JyBXSEVSRSBtLm1ldGFfa2V5PSdfc3RvY2snIEFORCBtLm1ldGFfdmFsdWUrMDwwIiksCiAgICAnc3RvY2tfbnVsaXMnPT4oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHB9cG9zdG1ldGEgbSBKT0lOIHskcH1wb3N0cyBwbyBPTiBwby5JRD1tLnBvc3RfaWQgQU5EIHBvLnBvc3RfdHlwZT0ncHJvZHVjdCcgV0hFUkUgbS5tZXRhX2tleT0nX3N0b2NrJyBBTkQgbS5tZXRhX3ZhbHVlKzA9MCIpLAogICAgJ2JhY2tvcmRlcnNfbGVpZHppYW1pJz0+KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRwfXBvc3RtZXRhIG0gV0hFUkUgbS5tZXRhX2tleT0nX2JhY2tvcmRlcnMnIEFORCBtLm1ldGFfdmFsdWU8PidubyciKSwKICApOwogIGVjaG8gd3BfanNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BSRVRUWV9QUklOVCk7IGV4aXQ7Cn0sMSk7Cg==','base64').toString('utf8').replace(/^<\?php\s*/,'');
let sid=null;
for(const s of (Array.isArray(lst)?lst:[])) if(String(s.name||'').indexOf('TEMP S628')>=0) sid=s.id;
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP S628 Neigiami likuciai',code:PHP,scope:'global',active:true}));
if(sid){O.upd=sh('curl -sSk --max-time 60 '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'/'+sid+'"').slice(0,80);}
else{for(let i=0;i<3&&!sid;i++){const t=sh('curl -sSk --max-time 60 '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  try{const j=JSON.parse(t);if(j&&j.id)sid=j.id;}catch(e){}}}
O.stock_sid=sid; sh('sleep 6');

// ---------- 4. PATIKRA BE REZERVO ----------
const dr=sh('curl -sSk --max-time 260 "'+SITE+'/?ps_neg=K628n"');
try{O.neg=JSON.parse(dr);}catch(e){O.neg={raw:String(dr).slice(0,2500)};}
// isjungiam po darbo
if(sid){fs.writeFileSync('/tmp/o2.json',JSON.stringify({active:false}));
 sh('curl -sSk --max-time 30 -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/o2.json "'+API+'/'+sid+'"');}

// ---------- 5. GALUTINIS SARASAS PO VALYMO ----------
let lst2=[];
try{lst2=JSON.parse(sh('curl -sSk --max-time 60 '+AUTH+' "'+API+'"'));}catch(e){}
O.po_valymo=(Array.isArray(lst2)?lst2:[]).map(s=>({id:s.id,name:s.name,active:!!s.active}));
O.liko_TEMP=O.po_valymo.filter(s=>String(s.name).startsWith('TEMP'));

putFile('analize/s628.json', Buffer.from(JSON.stringify(O,null,1)));
console.log('OK');
