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
const php=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgQW5vbiBSZWNvbiB2MgogKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAgIGlmICggISBpc3NldCgkX0dFVFsncHNfYW41J10pIHx8ICRfR0VUWydwc19hbjUnXSAhPT0gJ0FuNXg3JyApIHJldHVybjsKICAgIG5vY2FjaGVfaGVhZGVycygpOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICAgZ2xvYmFsICR3cGRiOwogICAgJHIgPSBhcnJheSgnVkVSU0lKQSc9Pidhbm9uLXJlY29uLXYyJyk7CgogICAgLy8gMSkgVEVJU0lOR0FTIHNob3J0Y29kZSB2YXJkYXMKICAgICRyWydwdXNsYXBpYWknXSA9ICR3cGRiLT5nZXRfcmVzdWx0cygKICAgICAgICAiU0VMRUNUIElELCBwb3N0X3RpdGxlLCBwb3N0X25hbWUsIHBvc3RfdHlwZSwgcG9zdF9zdGF0dXMKICAgICAgICAgICBGUk9NIHskd3BkYi0+cG9zdHN9CiAgICAgICAgICBXSEVSRSBwb3N0X3N0YXR1cyBJTiAoJ3B1Ymxpc2gnLCdkcmFmdCcsJ3ByaXZhdGUnLCdwZW5kaW5nJykKICAgICAgICAgICAgQU5EIHBvc3RfY29udGVudCBMSUtFICclcGV0c2hvcF9wZXRfZm9ybSUnCiAgICAgICAgICBPUkRFUiBCWSBJRCIsIEFSUkFZX0EpOwogICAgZm9yZWFjaCAoJHJbJ3B1c2xhcGlhaSddIGFzICYkcCkgeyAkcFsndXJsJ10gPSBnZXRfcGVybWFsaW5rKCRwWydJRCddKTsgfQogICAgdW5zZXQoJHApOwoKICAgIC8vIDIpIHNob3J0Y29kZSByZWdpc3RyYWNpamEgaXIgam9zIGVsZ3NlbmEKICAgICRjID0gZmlsZV9nZXRfY29udGVudHMoV1BfUExVR0lOX0RJUi4nL3BldHNob3AtY29yZS9pbmNsdWRlcy9jbGFzcy1wZXQtdWkucGhwJyk7CiAgICAkaSA9IHN0cnBvcygkYywgImFkZF9zaG9ydGNvZGUoICdwZXRzaG9wX3BldF9mb3JtJyIpOwogICAgaWYgKCRpPT09ZmFsc2UpICRpID0gc3RycG9zKCRjLCAiYWRkX3Nob3J0Y29kZSgncGV0c2hvcF9wZXRfZm9ybSciKTsKICAgICRyWydzaG9ydGNvZGVfcmVnJ10gPSAkaSE9PWZhbHNlID8gc3Vic3RyKCRjLCBtYXgoMCwkaS0zMDApLCA5MDApIDogJ25lcmFzdGEnOwogICAgJGogPSBzdHJwb3MoJGMsICdmdW5jdGlvbiBzaG9ydGNvZGUnKTsKICAgICRyWydzaG9ydGNvZGVfZm4nXSA9ICRqIT09ZmFsc2UgPyBzdWJzdHIoJGMsICRqLCAxODAwKSA6ICduZXJhc3RhJzsKCiAgICAvLyAzKSBtYWdpYyBsb2dpbiBwaWxuYWkKICAgICRtbCA9IFdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWNvcmUvaW5jbHVkZXMvY2xhc3MtbWFnaWMtbG9naW4ucGhwJzsKICAgICRyWydtYWdpY19keWRpcyddID0gaXNfcmVhZGFibGUoJG1sKSA/IGZpbGVzaXplKCRtbCkgOiAnTkVSQSc7CiAgICAkclsnbWFnaWMnXSA9IGlzX3JlYWRhYmxlKCRtbCkgPyBmaWxlX2dldF9jb250ZW50cygkbWwpIDogJyc7CgogICAgLy8gNCkgdG9rZW51IGxlbnRlbGUKICAgICR0ID0gJHdwZGItPnByZWZpeC4ncHNfYWN0aW9uX3Rva2Vucyc7CiAgICAkclsndG9rZW5zX3NjaGVtYSddID0gJHdwZGItPmdldF9yZXN1bHRzKCJERVNDUklCRSAkdCIsIEFSUkFZX0EpOwogICAgJHJbJ3Rva2Vuc19raWVraXMnXSA9IChpbnQpICR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSAkdCIpOwogICAgJHJbJ3Rva2Vuc19wdnonXSA9ICR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUICogRlJPTSAkdCBPUkRFUiBCWSBpZCBERVNDIExJTUlUIDMiLCBBUlJBWV9BKTsKICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoJHIsIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7CiAgICBleGl0Owp9KTsK','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP Anon Recon v2',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('anon_recon2.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
const a=sh('curl -sSk -m 60 "'+SITE+'/?ps_an5=An5x7"');
let A=null; try{A=JSON.parse(a.out);}catch(e){O.auth_raw=a.out.slice(0,800);}
O.clean = A;

fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
O.site=sh('curl -sSk -m 25 -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
putB64('anon_recon2.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
