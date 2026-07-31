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
const php=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgQm9vdCBSZWNvbiB2MQogKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAgIGlmICggISBpc3NldCgkX0dFVFsncHNfYnQyJ10pIHx8ICRfR0VUWydwc19idDInXSAhPT0gJ0J0Mm42JyApIHJldHVybjsKICAgIG5vY2FjaGVfaGVhZGVycygpOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICAgZ2xvYmFsICR3cGRiOwogICAgJHIgPSBhcnJheSgnVkVSU0lKQSc9Pidib290LXJlY29uLXYxJyk7CiAgICAkbWFpbiA9IFdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWNvcmUvcGV0c2hvcC1jb3JlLnBocCc7CiAgICAkYyA9IGZpbGVfZ2V0X2NvbnRlbnRzKCRtYWluKTsKICAgICRyWydtYWluX2R5ZGlzJ10gPSBzdHJsZW4oJGMpOwogICAgJHJbJ21haW4nXSA9ICRjOwoKICAgIC8vIHBzX3BldHMgaW5kZWtzYWkgaXIgYXIgamF1IHlyYSBzb3VyY2VfZHJhZnRfaWQKICAgICR0ID0gJHdwZGItPnByZWZpeC4ncHNfcGV0cyc7CiAgICAkclsncGV0c19zdHVscGVsaWFpJ10gPSAkd3BkYi0+Z2V0X2NvbCgiU0hPVyBDT0xVTU5TIEZST00gJHQiKTsKICAgICRpZHggPSAkd3BkYi0+Z2V0X3Jlc3VsdHMoIlNIT1cgSU5ERVggRlJPTSAkdCIsIEFSUkFZX0EpOwogICAgJHJbJ3BldHNfaW5kZWtzYWknXSA9IGFycmF5KCk7CiAgICBmb3JlYWNoICgkaWR4IGFzICRpKSB7ICRyWydwZXRzX2luZGVrc2FpJ11bJGlbJ0tleV9uYW1lJ11dW10gPSAkaVsnQ29sdW1uX25hbWUnXTsgfQogICAgJHJbJ3BldHNfZWlsdWNpdSddID0gKGludCkgJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICR0Iik7CiAgICAkclsncGV0c19lbmdpbmUnXSA9ICR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgRU5HSU5FIEZST00gaW5mb3JtYXRpb25fc2NoZW1hLlRBQkxFUyBXSEVSRSBUQUJMRV9TQ0hFTUE9REFUQUJBU0UoKSBBTkQgVEFCTEVfTkFNRT0nJHQnIik7CiAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVMpOwogICAgZXhpdDsKfSk7Cg==','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP Boot Recon v1',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('boot.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
const a=sh('curl -sSk -m 60 "'+SITE+'/?ps_bt2=Bt2n6"');
let A=null; try{A=JSON.parse(a.out);}catch(e){O.auth_raw=a.out.slice(0,800);}
O.clean = A;

fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
O.site=sh('curl -sSk -m 25 -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
putB64('boot.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
