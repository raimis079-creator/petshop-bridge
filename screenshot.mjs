import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function sh(c){try{return execSync(c+' 2>&1',{maxBuffer:20e6,shell:'/bin/bash'}).toString();}catch(e){return String(e).slice(0,300);}}
function putFile(name,buf){const u='https://api.github.com/repos/'+REPO+'/contents/'+name;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk --max-time 30 -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:80e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'s630',content:buf.toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -sk --max-time 90 -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:80e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={VERSIJA_RUN:'run630'};

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
const PHP=Buffer.from('PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAkdiA9IGlzc2V0KCRfR0VUWydwc19maXgyJ10pID8gc2FuaXRpemVfa2V5KCRfR0VUWydwc19maXgyJ10pIDogJyc7CiAgaWYgKCR2PT09JycpIHJldHVybjsKICBpZiAoIWhlYWRlcnNfc2VudCgpKSB7IG5vY2FjaGVfaGVhZGVycygpOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyB9CiAgQHNldF90aW1lX2xpbWl0KDI4MCk7CiAgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OwogICRyPWFycmF5KCdWRVJTSUpBJz0+J3M2MzAnLCd2ZWlrc21hcyc9PiR2KTsKCiAgJG5laWdpYW1pID0gYXJyYXkoMTYzMTcsMTc0NDMsMTg2MjMsMTc3MTApOyAgIC8vIGxpa3V0aXMgaSAwCiAgJGpvc2VyYSAgID0gMTc5Nzg7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBhdHN0YXR5dGkgaXMgVkYKCiAgJGJ1c2VuYSA9IGZ1bmN0aW9uKCRwaWQpIHVzZSAoJHAsJHdwZGIpIHsKICAgIHJldHVybiBhcnJheSgKICAgICAgJ2lkJz0+JHBpZCwKICAgICAgJ3Bhdic9Pm1iX3N1YnN0cihodG1sX2VudGl0eV9kZWNvZGUoZ2V0X3RoZV90aXRsZSgkcGlkKSksMCw0NiksCiAgICAgICdzdG9jayc9PmdldF9wb3N0X21ldGEoJHBpZCwnX3N0b2NrJyx0cnVlKSwKICAgICAgJ3N0b2NrX3N0YXR1cyc9PmdldF9wb3N0X21ldGEoJHBpZCwnX3N0b2NrX3N0YXR1cycsdHJ1ZSksCiAgICAgICdvd25fc3RvY2tfcXR5Jz0+Z2V0X3Bvc3RfbWV0YSgkcGlkLCdfb3duX3N0b2NrX3F0eScsdHJ1ZSksCiAgICAgICd2Zl9xdHknPT5nZXRfcG9zdF9tZXRhKCRwaWQsJ192Zl9xdHknLHRydWUpLAogICAgICAnc2FuZGVsaXMnPT5nZXRfcG9zdF9tZXRhKCRwaWQsJ19wc19zYW5kZWxpcycsdHJ1ZSksCiAgICAgICdzb3VyY2VzJz0+JHdwZGItPmdldF9yZXN1bHRzKCR3cGRiLT5wcmVwYXJlKAogICAgICAgICJTRUxFQ1Qgc291cmNlLHN0b2NrX3F0eSxwcmlvcml0eSBGUk9NIHskcH1wc19zb3VyY2VzIFdIRVJFIHByb2R1Y3RfaWQ9JWQgT1JERVIgQlkgcHJpb3JpdHkiLCRwaWQpLEFSUkFZX0EpLAogICAgKTsKICB9OwoKICAkdmlzaSA9IGFycmF5X21lcmdlKCRuZWlnaWFtaSwgYXJyYXkoJGpvc2VyYSkpOwogICRyWydQUklFUyddID0gYXJyYXlfbWFwKCRidXNlbmEsICR2aXNpKTsKCiAgaWYgKCR2ID09PSAnZHJ5JykgewogICAgJHJbJ1BMQU5BUyddID0gYXJyYXkoCiAgICAgICduZWlnaWFtaScgPT4gJ2tldHVyaW9tcyBwcmVrZW1zIF9zdG9jayAtPiAwIChzdG9ja19zdGF0dXMgbGlla2Egb3V0b2ZzdG9jayknLAogICAgICAnam9zZXJhJyAgID0+ICdpc3RyaW50aSBfb3duX3N0b2NrX3F0eSAoYXJ0ZWZha3RhcyksIF9zdG9jayAtPiBfdmZfcXR5ICgnLmdldF9wb3N0X21ldGEoJGpvc2VyYSwnX3ZmX3F0eScsdHJ1ZSkuJyksIHN0b2NrX3N0YXR1cyAtPiBpbnN0b2NrJywKICAgICAgJ3NvdXJjZXMnICA9PiAncHNfc291cmNlcyBlaWx1dGVzIHBlcnNrYWljaXVvamFtb3MgaXMgbmF1am8nLAogICAgKTsKICAgICRyWydQQVNUQUJBJ109J05pZWtvIG5la2Vpc3RhLic7CiAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QUkVUVFlfUFJJTlQpOyBleGl0OwogIH0KCiAgaWYgKCR2ID09PSAnYXBwbHknKSB7CiAgICBpZiAoIWlzc2V0KCRfR0VUWydwYXR2aXJ0aW51J10pIHx8ICRfR0VUWydwYXR2aXJ0aW51J10hPT0ndGFpcCcpIHsKICAgICAgJHJbJ0tMQUlEQSddPSd0cnVrc3RhICZwYXR2aXJ0aW51PXRhaXAnOwogICAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QUkVUVFlfUFJJTlQpOyBleGl0OwogICAgfQogICAgJGxvZz1hcnJheSgpOwoKICAgIC8vIDEpIE5laWdpYW1pIC0+IDAKICAgIGZvcmVhY2ggKCRuZWlnaWFtaSBhcyAkcGlkKSB7CiAgICAgICRidXZvID0gZ2V0X3Bvc3RfbWV0YSgkcGlkLCdfc3RvY2snLHRydWUpOwogICAgICB1cGRhdGVfcG9zdF9tZXRhKCRwaWQsJ19zdG9jaycsJzAnKTsKICAgICAgJHByID0gd2NfZ2V0X3Byb2R1Y3QoJHBpZCk7CiAgICAgIGlmICgkcHIpIHsgJHByLT5zZXRfc3RvY2tfcXVhbnRpdHkoMCk7ICRwci0+c2V0X3N0b2NrX3N0YXR1cygnb3V0b2ZzdG9jaycpOyAkcHItPnNhdmUoKTsgfQogICAgICAkbG9nW109YXJyYXkoJ2lkJz0+JHBpZCwndmVpa3NtYXMnPT4nbGlrdXRpcyAnLiRidXZvLicgLT4gMCcpOwogICAgfQoKICAgIC8vIDIpIEpvc2VyYTogcGFzYWxpbnRpIGFydGVmYWt0YSBpciBhdHN0YXR5dGkgaXMgVkYKICAgICR2ZnEgPSAoaW50KSBnZXRfcG9zdF9tZXRhKCRqb3NlcmEsJ192Zl9xdHknLHRydWUpOwogICAgJGJ1dm8gPSBnZXRfcG9zdF9tZXRhKCRqb3NlcmEsJ19zdG9jaycsdHJ1ZSk7CiAgICAkb3duYiA9IGdldF9wb3N0X21ldGEoJGpvc2VyYSwnX293bl9zdG9ja19xdHknLHRydWUpOwogICAgZGVsZXRlX3Bvc3RfbWV0YSgkam9zZXJhLCdfb3duX3N0b2NrX3F0eScpOwogICAgdXBkYXRlX3Bvc3RfbWV0YSgkam9zZXJhLCdfc3RvY2snLCAoc3RyaW5nKSR2ZnEpOwogICAgJHByID0gd2NfZ2V0X3Byb2R1Y3QoJGpvc2VyYSk7CiAgICBpZiAoJHByKSB7ICRwci0+c2V0X3N0b2NrX3F1YW50aXR5KCR2ZnEpOyAkcHItPnNldF9zdG9ja19zdGF0dXMoJHZmcT4wPydpbnN0b2NrJzonb3V0b2ZzdG9jaycpOyAkcHItPnNhdmUoKTsgfQogICAgJGxvZ1tdPWFycmF5KCdpZCc9PiRqb3NlcmEsJ3ZlaWtzbWFzJz0+J19vd25fc3RvY2tfcXR5ICgnLiRvd25iLicpIGlzdHJpbnRhcyDCtyBsaWt1dGlzICcuJGJ1dm8uJyAtPiAnLiR2ZnEuJyAoaXMgX3ZmX3F0eSknKTsKCiAgICAvLyAzKSBwc19zb3VyY2VzIHBlcnNrYWljaWF2aW1hcwogICAgaWYgKGNsYXNzX2V4aXN0cygnUGV0c2hvcF9Tb3VyY2VzJykpIHsKICAgICAgJHQgPSBQZXRzaG9wX1NvdXJjZXM6OmxlbnRlbGUoKTsgJG5vdyA9IGN1cnJlbnRfdGltZSgnbXlzcWwnKTsKICAgICAgZm9yZWFjaCAoJHZpc2kgYXMgJHBpZCkgewogICAgICAgICR3cGRiLT5kZWxldGUoJHQsIGFycmF5KCdwcm9kdWN0X2lkJz0+JHBpZCkpOwogICAgICAgIGZvcmVhY2ggKFBldHNob3BfU291cmNlczo6c3Vza2FpY2l1b3RpKCRwaWQpIGFzICR4KSB7CiAgICAgICAgICAkd3BkYi0+aW5zZXJ0KCR0LCBhcnJheSgKICAgICAgICAgICAgJ3Byb2R1Y3RfaWQnPT4kcGlkLCdzb3VyY2UnPT4keFsnc291cmNlJ10sJ3N1cHBsaWVyX3NrdSc9PiR4WydzdXBwbGllcl9za3UnXSwKICAgICAgICAgICAgJ2Vhbic9PiR4WydlYW4nXSwnc3RvY2tfcXR5Jz0+JHhbJ3N0b2NrX3F0eSddLCdjb3N0X25ldCc9PiR4Wydjb3N0X25ldCddLAogICAgICAgICAgICAnc3luY2VkX2F0Jz0+JHhbJ3N5bmNlZF9hdCddLCdpc19hY3RpdmUnPT4keFsnaXNfYWN0aXZlJ10sJ2lzX3NlbGxhYmxlJz0+JHhbJ2lzX3NlbGxhYmxlJ10sCiAgICAgICAgICAgICdwcmlvcml0eSc9PiR4Wydwcmlvcml0eSddLCdjcmVhdGVkX2F0Jz0+JG5vdywndXBkYXRlZF9hdCc9PiRub3cpKTsKICAgICAgICB9CiAgICAgIH0KICAgICAgJGxvZ1tdPWFycmF5KCdpZCc9Pidwc19zb3VyY2VzJywndmVpa3NtYXMnPT4ncGVyc2thaWNpdW90YSAnLmNvdW50KCR2aXNpKS4nIHByZWtlbXMnKTsKICAgIH0KICAgICRyWydBVExJS1RBJ109JGxvZzsKCiAgICAvLyA0KSBQQVRJS1JBCiAgICAkclsnUE8nXSA9IGFycmF5X21hcCgkYnVzZW5hLCAkdmlzaSk7CiAgICAkclsnbGlrdXNpdV9uZWlnaWFtdSddID0gKGludCkkd3BkYi0+Z2V0X3ZhcigKICAgICAgIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskcH1wb3N0bWV0YSBtIEpPSU4geyRwfXBvc3RzIHBvIE9OIHBvLklEPW0ucG9zdF9pZCBBTkQgcG8ucG9zdF90eXBlPSdwcm9kdWN0JwogICAgICAgV0hFUkUgbS5tZXRhX2tleT0nX3N0b2NrJyBBTkQgbS5tZXRhX3ZhbHVlKzA8MCIpOwogICAgJHJbJ293bl9zdG9ja19xdHlfbGlrbyddID0gKGludCkkd3BkYi0+Z2V0X3ZhcigKICAgICAgIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskcH1wb3N0bWV0YSBXSEVSRSBtZXRhX2tleT0nX293bl9zdG9ja19xdHknIik7CiAgICBpZiAoY2xhc3NfZXhpc3RzKCdQZXRzaG9wX1N0b2NrX1NlcnZpY2UnKSkgewogICAgICAkclsnc3RvY2tfc2VydmljZV9qb3NlcmEnXSA9IFBldHNob3BfU3RvY2tfU2VydmljZTo6cGFyZHVvZGFtYSgkam9zZXJhKTsKICAgIH0KICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BSRVRUWV9QUklOVCk7IGV4aXQ7CiAgfQogICRyWydLTEFJREEnXT0nbmV6aW5vbWFzIHZlaWtzbWFzJzsKICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QUkVUVFlfUFJJTlQpOyBleGl0Owp9LDEpOwo=','base64').toString('utf8').replace(/^<\?php\s*/,'');
let sid=null;
for(const s of (Array.isArray(lst)?lst:[])) if(String(s.name||'').indexOf('TEMP S630')>=0) sid=s.id;
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP S630 Likuciu taisymas',code:PHP,scope:'global',active:true}));
if(sid){O.upd=sh('curl -sSk --max-time 60 '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'/'+sid+'"').slice(0,80);}
else{for(let i=0;i<3&&!sid;i++){const t=sh('curl -sSk --max-time 60 '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  try{const j=JSON.parse(t);if(j&&j.id)sid=j.id;}catch(e){}}}
O.stock_sid=sid; sh('sleep 6');

// ---------- 4. PATIKRA BE REZERVO ----------
const d1=sh('curl -sSk --max-time 200 "'+SITE+'/?ps_fix2=dry"');
try{O.dry=JSON.parse(d1);}catch(e){O.dry={raw:String(d1).slice(0,1500)};}
sh('sleep 2');
const d2=sh('curl -sSk --max-time 240 "'+SITE+'/?ps_fix2=apply&patvirtinu=taip"');
try{O.apply=JSON.parse(d2);}catch(e){O.apply={raw:String(d2).slice(0,2500)};}
// isjungiam po darbo
if(sid){fs.writeFileSync('/tmp/o2.json',JSON.stringify({active:false}));
 sh('curl -sSk --max-time 30 -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/o2.json "'+API+'/'+sid+'"');}

// ---------- 5. GALUTINIS SARASAS PO VALYMO ----------
let lst2=[];
try{lst2=JSON.parse(sh('curl -sSk --max-time 60 '+AUTH+' "'+API+'"'));}catch(e){}
O.po_valymo=(Array.isArray(lst2)?lst2:[]).map(s=>({id:s.id,name:s.name,active:!!s.active}));
O.liko_TEMP=O.po_valymo.filter(s=>String(s.name).startsWith('TEMP'));

putFile('analize/s630.json', Buffer.from(JSON.stringify(O,null,1)));
console.log('OK');
