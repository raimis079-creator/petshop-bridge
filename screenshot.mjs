import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function putB64(n,b){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:80e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b,...(s?{sha:s}:{})}));
  const c=execSync('curl -sk -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:80e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
function sh(c){try{const o=execSync(c+' 2>&1; echo "__RC:$?"',{maxBuffer:50e6,shell:'/bin/bash'}).toString();
 const m=o.match(/__RC:(\d+)\s*$/);return{rc:m?+m[1]:-1,out:o.replace(/__RC:\d+\s*$/,'')};}catch(e){return{rc:-99,out:String(e).slice(0,300)};}}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={}; let sid=null;
// ★ Senu TEMP snippet'u valymas — kitaip senas atsako i ta pati rakta.
try{
  const ls=sh('curl -sSk '+AUTH+' "'+API+'?per_page=100"');
  const arr=JSON.parse(ls.out); const off=[];
  for(const s0 of arr){ if(s0.name && s0.name.indexOf('TEMP')===0 && s0.active){
    fs.writeFileSync('/tmp/off.json',JSON.stringify({active:false}));
    sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/off.json "'+API+'/'+s0.id+'"');
    off.push(s0.id+':'+s0.name); } }
  O.deaktyvuota_TEMP=off;
}catch(e){ O.valymo_klaida=String(e).slice(0,200); }
const php=Buffer.from('PD9waHAKLyoqCiAqIFMzMjkgTXlBY2NvdW50IFNsdWcgUmVjb24KICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgICBpZiAoICEgaXNzZXQoJF9HRVRbJ3BzX2FjMyddKSB8fCAkX0dFVFsncHNfYWMzJ10gIT09ICdBYzNuNScgKSByZXR1cm47CiAgICBub2NhY2hlX2hlYWRlcnMoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAgIGdsb2JhbCAkd3BkYjsgJHIgPSBhcnJheSgnVkVSU0lKQSc9PidhY2Mtc2x1Zy1yZWNvbi12MScpOwoKICAgIC8vIDEpIHB1c2xhcGlzCiAgICAkcGlkID0gKGludCkgZ2V0X29wdGlvbignd29vY29tbWVyY2VfbXlhY2NvdW50X3BhZ2VfaWQnKTsKICAgICRwID0gJHBpZCA/IGdldF9wb3N0KCRwaWQpIDogbnVsbDsKICAgICRyWydwdXNsYXBpcyddID0gJHAgPyBhcnJheSgnaWQnPT4kcGlkLCd0aXRsZSc9PiRwLT5wb3N0X3RpdGxlLCdzbHVnJz0+JHAtPnBvc3RfbmFtZSwndXJsJz0+Z2V0X3Blcm1hbGluaygkcGlkKSkgOiAnbmVyYXN0YSc7CgogICAgLy8gMikgVklTSSBXb29Db21tZXJjZSBhY2NvdW50IGVuZHBvaW50J3Ugc2x1ZydhaQogICAgJGVwcyA9IGFycmF5KCdvcmRlcnMnLCd2aWV3LW9yZGVyJywnZG93bmxvYWRzJywnZWRpdC1hY2NvdW50JywnZWRpdC1hZGRyZXNzJywKICAgICAgICAgICAgICAgICAncGF5bWVudC1tZXRob2RzJywnYWRkLXBheW1lbnQtbWV0aG9kJywnZGVsZXRlLXBheW1lbnQtbWV0aG9kJywKICAgICAgICAgICAgICAgICAnc2V0LWRlZmF1bHQtcGF5bWVudC1tZXRob2QnLCdsb3N0LXBhc3N3b3JkJywnY3VzdG9tZXItbG9nb3V0Jyk7CiAgICBmb3JlYWNoICgkZXBzIGFzICRlKSB7CiAgICAgICAgJHJbJ2VuZHBvaW50YWknXVskZV0gPSBnZXRfb3B0aW9uKCd3b29jb21tZXJjZV9teWFjY291bnRfJy5zdHJfcmVwbGFjZSgnLScsJ18nLCRlKS4nX2VuZHBvaW50Jyk7CiAgICB9CiAgICAkclsnZW5kcG9pbnRhaSddWydhdWdpbnRpbmlzIChtdXN1KSddID0gZGVmaW5lZCgnUGV0c2hvcF9QZXRfVUk6OkVORFBPSU5UJykgPyBjb25zdGFudCgnUGV0c2hvcF9QZXRfVUk6OkVORFBPSU5UJykgOiAnPyc7CgogICAgLy8gMykgSEFSRENPREUgcGFpZXNrYQogICAgJGRpcnMgPSBhcnJheSgnY29yZSc9PldQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWNvcmUnLCAnY2hpbGQnPT5nZXRfc3R5bGVzaGVldF9kaXJlY3RvcnkoKSwKICAgICAgICAgICAgICAgICAgJ2VzcCc9PldQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWVzcCcpOwogICAgZm9yZWFjaCAoJGRpcnMgYXMgJGs9PiRkKSB7CiAgICAgICAgaWYgKCFpc19kaXIoJGQpKSBjb250aW51ZTsKICAgICAgICAkaXQgPSBuZXcgUmVjdXJzaXZlSXRlcmF0b3JJdGVyYXRvcihuZXcgUmVjdXJzaXZlRGlyZWN0b3J5SXRlcmF0b3IoJGQsIFJlY3Vyc2l2ZURpcmVjdG9yeUl0ZXJhdG9yOjpTS0lQX0RPVFMpKTsKICAgICAgICBmb3JlYWNoICgkaXQgYXMgJGYpIHsKICAgICAgICAgICAgaWYgKCEkZi0+aXNGaWxlKCkpIGNvbnRpbnVlOwogICAgICAgICAgICAkZXh0ID0gc3RydG9sb3dlcigkZi0+Z2V0RXh0ZW5zaW9uKCkpOwogICAgICAgICAgICBpZiAoIWluX2FycmF5KCRleHQsIGFycmF5KCdwaHAnLCdqcycsJ2NzcycpLCB0cnVlKSkgY29udGludWU7CiAgICAgICAgICAgICRjID0gQGZpbGVfZ2V0X2NvbnRlbnRzKCRmLT5nZXRQYXRobmFtZSgpKTsKICAgICAgICAgICAgaWYgKCRjID09PSBmYWxzZSB8fCBzdHJwb3MoJGMsJ215LWFjY291bnQnKSA9PT0gZmFsc2UpIGNvbnRpbnVlOwogICAgICAgICAgICAkclsnaGFyZGNvZGUnXVskay4nLycuc3RyX3JlcGxhY2UoJGQuJy8nLCcnLCRmLT5nZXRQYXRobmFtZSgpKV0gPSBzdWJzdHJfY291bnQoJGMsJ215LWFjY291bnQnKTsKICAgICAgICB9CiAgICB9CiAgICAvLyBzbmlwcGV0dW9zZQogICAgJHNuID0gJHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsbmFtZSxhY3RpdmUgRlJPTSB7JHdwZGItPnByZWZpeH1zbmlwcGV0cyBXSEVSRSBjb2RlIExJS0UgJyVteS1hY2NvdW50JScgQU5EIGFjdGl2ZT0xIiwgQVJSQVlfQSk7CiAgICAkclsnc25pcHBldHVvc2UnXSA9ICRzbjsKCiAgICAvLyA0KSBEQjoga3VyIGRhciBtaW5pbWEKICAgICRyWydvcGNpam9zZSddID0gJHdwZGItPmdldF9jb2woCiAgICAgICAgIlNFTEVDVCBvcHRpb25fbmFtZSBGUk9NICR3cGRiLT5vcHRpb25zIFdIRVJFIG9wdGlvbl92YWx1ZSBMSUtFICclbXktYWNjb3VudCUnIExJTUlUIDIwIik7CiAgICAkclsnaXJhc3Vvc2UnXSA9IChpbnQpICR3cGRiLT5nZXRfdmFyKAogICAgICAgICJTRUxFQ1QgQ09VTlQoKikgRlJPTSAkd3BkYi0+cG9zdHMgV0hFUkUgcG9zdF9jb250ZW50IExJS0UgJyVteS1hY2NvdW50JScgQU5EIHBvc3Rfc3RhdHVzPSdwdWJsaXNoJyIpOwoKICAgIC8vIDUpIHBlcm1hbGluayBzdHJ1a3R1cm9zIHBhdGlrcmEKICAgICRyWydwZXJtYWxpbmtfc3RydWt0dXJhJ10gPSBnZXRfb3B0aW9uKCdwZXJtYWxpbmtfc3RydWN0dXJlJyk7CiAgICAkclsnYXJfbGFpc3Zhc19zbHVnJ10gPSBhcnJheSgpOwogICAgZm9yZWFjaCAoYXJyYXkoJ21hbm8tcGFza3lyYScsJ3Bhc2t5cmEnKSBhcyAkY2FuZCkgewogICAgICAgICRleCA9IGdldF9wYWdlX2J5X3BhdGgoJGNhbmQpOwogICAgICAgICRyWydhcl9sYWlzdmFzX3NsdWcnXVskY2FuZF0gPSAkZXggPyAoJ1VaSU1UQSBpZD0nLiRleC0+SUQpIDogJ2xhaXN2YXMnOwogICAgfQogICAgZWNobyB3cF9qc29uX2VuY29kZSgkciwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTfEpTT05fUFJFVFRZX1BSSU5UKTsKICAgIGV4aXQ7Cn0pOwo=','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'S329 MyAccount Slug Recon',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('accslug.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
function uzk(n){
  const x=sh('curl -sSk -m 60 "'+SITE+'/?ps_ac3=Ac3n5"');
  try{ return JSON.parse(x.out); }catch(e){ O['raw'+n]=x.out.slice(0,700); return null; }
}
O.rez=uzk(1);

fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
O.site=sh('curl -sSk -m 25 -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
putB64('accslug.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
