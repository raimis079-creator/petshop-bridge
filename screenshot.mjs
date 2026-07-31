import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function putB64(n,b){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b,...(s?{sha:s}:{})}));
  const c=execSync('curl -sk -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
function sh(c){try{const o=execSync(c+' 2>&1; echo "__RC:$?"',{maxBuffer:50e6,shell:'/bin/bash'}).toString();
 const m=o.match(/__RC:(\d+)\s*$/);return{rc:m?+m[1]:-1,out:o.replace(/__RC:\d+\s*$/,'')};}catch(e){return{rc:-99,out:String(e).slice(0,300)};}}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={}; let sid=null;
// pirma deaktyvuoti visus senus TEMP Terra Spam snippetus
try{
  const l=sh('curl -sSk '+AUTH+' "'+API+'?per_page=100"').out;
  const arr=JSON.parse(l);
  O.deactivated=[];
  for(const x of arr){
    if(/TEMP Terra Spam/i.test(x.name||'') && x.active){
      fs.writeFileSync('/tmp/d0.json',JSON.stringify({active:false}));
      sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/d0.json "'+API+'/'+x.id+'"');
      O.deactivated.push(x.id);
    }
  }
}catch(e){ O.deact_err=String(e).slice(0,150); }
const php=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgVGVycmEgU3BhbSBDaGVjayB2MQogKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAgIGlmICggISBpc3NldCgkX0dFVFsncHNfdHInXSkgfHwgJF9HRVRbJ3BzX3RyJ10gIT09ICdUcjR4JyApIHJldHVybjsKICAgICRFPSd0ZXJyYUBneXZ1bmFpLmx0JzsgJHI9YXJyYXkoKTsKICAgICRhZCA9IGZ1bmN0aW9uX2V4aXN0cygncHNfZXNwX2FkYXB0ZXInKSA/IHBzX2VzcF9hZGFwdGVyKCkgOiBudWxsOwogICAgaWYgKCEkYWQpIHsgbm9jYWNoZV9oZWFkZXJzKCk7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoYXJyYXkoJ2Vycic9PiduZXJhIGFkYXB0ZXJpbycpKTsgZXhpdDsgfQoKICAgIC8vIDEpIFRSQU5TQUtDSU5JUyDigJQgdXpzYWt5bW8gcGF0dmlydGluaW1hcwogICAgJGIxICA9IFBldHNob3BfRW1haWxfTGF5b3V0OjpwKCdTdmVpa2ksIGTEl2tvamFtZSB1xb4gdcW+c2FreW3EhS4gR2F2b21lIGrFq3PFsyBhcG1va8SXamltxIUgKDM0LDkwIOKCrCkgaXIgamF1IHJ1b8WhaWFtZSBzaXVudMSFLiBLYWkgamkgacWha2VsaWF1cywgYXRzacWzc2ltZSBzZWtpbW8gbnVtZXLEry4nKTsKICAgICRiMSAuPSBQZXRzaG9wX0VtYWlsX0xheW91dDo6YnV0dG9uKGhvbWVfdXJsKCcvbXktYWNjb3VudC9vcmRlcnMvJyksJ1BlcsW+acWrcsSXdGkgdcW+c2FreW3EhScpOwogICAgJGgxID0gUGV0c2hvcF9FbWFpbF9MYXlvdXQ6OndyYXAoYXJyYXkoJ3N1YmplY3QnPT4nVcW+c2FreW1hcyAzNDgwMSBwcmlpbXRhcycsCiAgICAgICdwcmVoZWFkZXInPT4nQXBtb2vEl2ppbWFzIGdhdXRhcywgcnVvxaFpYW1lIHNpdW50xIUuJywnYm9keSc9PiRiMSwKICAgICAgJ2Zsb3dfY2xhc3MnPT4ndHJhbnNhY3Rpb25hbCcsJ2VtYWlsJz0+JEUsCiAgICAgICdyZWFzb24nPT4nR2F2b3RlIMWhxK8gbGFpxaFrxIUsIG5lcyBwYXRlaWvEl3RlIHXFvnNha3ltxIUgcGV0c2hvcC5sdC4nKSk7CiAgICAkclsnMV90cmFuc2FrY2luaXMnXT0kYWQtPnNlbmRfdHJhbnNhY3Rpb25hbF9lbWFpbCgkRSwnVcW+c2FreW1hcyAzNDgwMSBwcmlpbXRhcycsJGgxLGFycmF5KCd0b19uYW1lJz0+J1JhaW1pcycpKTsKICAgIHNsZWVwKDIpOwoKICAgIC8vIDIpIFNFUlZJQ0Ug4oCUIHJlZmlsbAogICAgJGIyICA9IFBldHNob3BfRW1haWxfTGF5b3V0OjpwKCdQYWdhbCBhbmtzdGVzbsSvIHBpcmtpbcSFIGFwc2thacSNaWF2b21lLCBrYWQgasWrc8WzIGF1Z2ludGluaW8gbWFpc3RvIGdhbGkgbmV0cnVrdXMgcHJpdHLFq2t0aS4nKTsKICAgICRiMiAuPSBQZXRzaG9wX0VtYWlsX0xheW91dDo6YnV0dG9uKGhvbWVfdXJsKCcvY2FydC8nKSwnUGFrYXJ0b3RpIGRhYmFyJyk7CiAgICAkYjIgLj0gUGV0c2hvcF9FbWFpbF9MYXlvdXQ6OnNlY29uZGFyeShhcnJheSgnUGF0aWtzbGludGkgcHJpbWluaW3EhSc9PmhvbWVfdXJsKCcvcmVmaWxsLWZlZWRiYWNrLycpKSk7CiAgICAkaDIgPSBQZXRzaG9wX0VtYWlsX0xheW91dDo6d3JhcChhcnJheSgnc3ViamVjdCc9PidKxatzxbMgYXVnaW50aW5pbyBtYWlzdG8gZ2FsaSBuZXRydWt1cyBwcml0csWra3RpJywKICAgICAgJ3ByZWhlYWRlcic9PidNYWlzdG8gZ2FsaSBuZXRydWt1cyBwcml0csWra3RpIOKAlCBwYWthcnRva2l0ZSB1xb5zYWt5bcSFLCBrYWkgYnVzIHBhdG9ndS4nLCdib2R5Jz0+JGIyLAogICAgICAnZmxvd19jbGFzcyc9PidzZXJ2aWNlJywnZW1haWwnPT4kRSwKICAgICAgJ3JlYXNvbic9PidHYXZvdGUgxaHEryBsYWnFoWvEhSwgbmVzIHBpcmtvdGUgxaHEryBtYWlzdMSFIHBldHNob3AubHQuJykpOwogICAgJHJbJzJfc2VydmljZSddPSRhZC0+c2VuZF90cmFuc2FjdGlvbmFsX2VtYWlsKCRFLCdKxatzxbMgYXVnaW50aW5pbyBtYWlzdG8gZ2FsaSBuZXRydWt1cyBwcml0csWra3RpJywkaDIsYXJyYXkoJ3RvX25hbWUnPT4nUmFpbWlzJykpOwogICAgc2xlZXAoMik7CgogICAgLy8gMykgTUFSS0VUSU5HQVMg4oCUIGFwbGVpc3RhcyBrcmVwc2VsaXMgKHN1IGF0c2lzYWt5bW8gbnVvcm9kYSkKICAgICRiMyAgPSBQZXRzaG9wX0VtYWlsX0xheW91dDo6cCgnU3ZlaWtpLCBwYXN0ZWLEl2pvbWUsIGthZCBrcmVwxaFlbHlqZSBsaWtvIHByZWtpxbMuIEppcyBpxaFzYXVnb3RhcyDigJQgZ2FsaXRlIHTEmXN0aSwga2FpIGLFq3NpdGUgcGFzaXJ1b8WhxJkuJyk7CiAgICAkYjMgLj0gUGV0c2hvcF9FbWFpbF9MYXlvdXQ6OmJ1dHRvbihob21lX3VybCgnL2NhcnQvJyksJ0dyxK/FvnRpIMSvIGtyZXDFoWVsxK8nKTsKICAgICRoMyA9IFBldHNob3BfRW1haWxfTGF5b3V0Ojp3cmFwKGFycmF5KCdzdWJqZWN0Jz0+J0rFq3PFsyBrcmVwxaFlbGlzIHZpcyBkYXIgbGF1a2lhJywKICAgICAgJ3ByZWhlYWRlcic9PidLcmVwxaFlbGlzIGnFoXNhdWdvdGFzIOKAlCBnYWxpdGUgdMSZc3RpIGJldCBrYWRhLicsJ2JvZHknPT4kYjMsCiAgICAgICdmbG93X2NsYXNzJz0+J21hcmtldGluZycsJ2VtYWlsJz0+JEUsCiAgICAgICdyZWFzb24nPT4nR2F2b3RlIMWhxK8gbGFpxaFrxIUsIG5lcyBzdXRpa290ZSBnYXV0aSBQZXRzaG9wLmx0IHBhc2nFq2x5bXVzLicpKTsKICAgICRyWyczX21hcmtldGluZ2FzJ109JGFkLT5zZW5kX3RyYW5zYWN0aW9uYWxfZW1haWwoJEUsJ0rFq3PFsyBrcmVwxaFlbGlzIHZpcyBkYXIgbGF1a2lhJywkaDMsYXJyYXkoJ3RvX25hbWUnPT4nUmFpbWlzJykpOwoKICAgICRyWydodG1sX2R5ZHppYWknXT1hcnJheShzdHJsZW4oJGgxKSxzdHJsZW4oJGgyKSxzdHJsZW4oJGgzKSk7CiAgICAkclsnbWFya2V0aW5nb19mb290ZXJ5amVfYXRzaXNha3ltYXMnXT0oc3RycG9zKCRoMywnYXRzaXNha3l0aScpIT09ZmFsc2UpPydZUkEnOidORVJBJzsKICAgICRyWyd0cmFuc2FrY2luaW9fZm9vdGVyeWplX2F0c2lzYWt5bWFzJ109KHN0cnBvcygkaDEsJ2F0c2lzYWt5dGknKSE9PWZhbHNlKT8nWVJBX0JMT0dBSSc6J05FUkEnOwogICAgbm9jYWNoZV9oZWFkZXJzKCk7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1NMQVNIRVN8SlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0sIDEpOwo=','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP Terra Spam Dump v1',code:php,scope:'global',active:true}));
for(let i=0;i<4&&!sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(sid){
  sh('sleep 4');
  const d=sh('curl -sSk "'+SITE+'/?ps_tr=Tr4x"');
  try{O.dry=JSON.parse(d.out);}catch(e){O.dry_raw=d.out.slice(0,500);}
  const a=sh('curl -sSk "'+SITE+'/?ps_tr=Tr4x"');
  try{O.apply=JSON.parse(a.out);}catch(e){O.apply_raw=a.out.slice(0,500);}
  fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
  sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
  // sanity: ar svetaine gyva po deploy
  sh('sleep 3');
  O.site_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
  O.account_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/my-account/"').out.trim();
}
putB64('terra.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
