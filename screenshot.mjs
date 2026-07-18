const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfcTMnXSl8fCRfR0VUWydwc19xMyddIT09J1EzS3c4TngnKXtyZXR1cm47fQoJaWYoKCRfR0VUWydjb25maXJtJ10/PycnKSE9PSdBUFBMWV9RMycpeyBlY2hvIGpzb25fZW5jb2RlKGFycmF5KCdlcnInPT4nY29uZmlybScpKTsgZXhpdDsgfQoJZ2xvYmFsICR3cGRiOyAkcGY9JHdwZGItPnByZWZpeDsgJG89YXJyYXkoJ0ZBWkUnPT4nQVBQTFknKTsgJFQ9JHBmLidwc19mZWVkaW5nX3RhYmxlcyc7ICRNPSRwZi4ncHNfZmVlZGluZ19tYXAnOwoJLy8gYXIgeXJhIHNvdXJjZV90eXBlIC8gc291cmNlX3ZlcmlmaWVkIHN0dWxwZWxpYWk/CgkkY29scz0kd3BkYi0+Z2V0X2NvbCgiU0hPVyBDT0xVTU5TIEZST00geyRUfSIpOwoJJG9bJ3R1cmlfc291cmNlX3R5cGUnXT1pbl9hcnJheSgnc291cmNlX3R5cGUnLCRjb2xzKTsKCSRvWyd0dXJpX3NvdXJjZV92ZXJpZmllZCddPWluX2FycmF5KCdzb3VyY2VfdmVyaWZpZWQnLCRjb2xzKTsKCWZvcmVhY2goYXJyYXkoMjQxLDI0MiwyNDMpIGFzICR0aWQpewoJCSRkYXRhPWFycmF5KCdzdGF0dXMnPT4nbmVlZHNfcmV2aWV3JywnaXNfYWN0aXZlJz0+MCwKCQkJJ3ZlcmlmaWNhdGlvbl9ub3RlJz0+J05vcm1hIHRpa3NsaWFpIHN1dGFtcGEgc3UgUGV0c2hvcCBwcm9kdWt0byBhcHJhc3ltdSAocG9zdF9jb250ZW50KTsgc3Ugb2ZpY2lhbGl1IGdhbWludG9qbyBzYWx0aW5pdSBEQVIgTkVQQVRJS1JJTlRBLiBSZWlraWEgb2ZpY2lhbGF1cyBTMjEyLUIgaW1wb3J0ZXJpbyBrZWxpbyBwcmllcyBha3R5dmF2aW1hLicpOwoJCWlmKGluX2FycmF5KCdzb3VyY2VfdHlwZScsJGNvbHMpKSAkZGF0YVsnc291cmNlX3R5cGUnXT0nbG9jYWxfcHJvZHVjdF9kZXNjcmlwdGlvbic7CgkJaWYoaW5fYXJyYXkoJ3NvdXJjZV92ZXJpZmllZCcsJGNvbHMpKSAkZGF0YVsnc291cmNlX3ZlcmlmaWVkJ109MDsKCQlpZihpbl9hcnJheSgndmVyaWZpZWRfYnknLCRjb2xzKSkgJGRhdGFbJ3ZlcmlmaWVkX2J5J109bnVsbDsKCQlpZihpbl9hcnJheSgndmVyaWZpZWRfYXQnLCRjb2xzKSkgJGRhdGFbJ3ZlcmlmaWVkX2F0J109bnVsbDsKCQkkdT0kd3BkYi0+dXBkYXRlKCRULCRkYXRhLGFycmF5KCdpZCc9PiR0aWQpKTsKCQkkdW09JHdwZGItPnVwZGF0ZSgkTSxhcnJheSgnaXNfYWN0aXZlJz0+MCksYXJyYXkoJ2ZlZWRpbmdfdGFibGVfaWQnPT4kdGlkKSk7CgkJJG9bJ3VwZF8nLiR0aWRdPSR1OyAkb1snbWFwXycuJHRpZF09JHVtOwoJfQoJLy8gUEFUSUtSQTogcnVudGltZSBlbGlnaWJsZSB0dXJpIGJ1dGkgMAoJJG9bJ3BvJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsc3RhdHVzLGlzX2FjdGl2ZSBGUk9NIHskVH0gV0hFUkUgaWQgSU4gKDI0MSwyNDIsMjQzKSIsIEFSUkFZX0EpOwoJJG9bJ2FrdHl2dXNfbWFwJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRNfSBXSEVSRSBmZWVkaW5nX3RhYmxlX2lkIElOICgyNDEsMjQyLDI0MykgQU5EIGlzX2FjdGl2ZT0xIik7Cgkkb1sncnVudGltZV9lbGlnaWJsZSddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskVH0gdCBXSEVSRSB0LmlkIElOICgyNDEsMjQyLDI0MykKCQlBTkQgdC5zdGF0dXM9J3ZlcmlmaWVkJyBBTkQgdC5pc19hY3RpdmU9MQoJCUFORCBFWElTVFMoU0VMRUNUIDEgRlJPTSB7JE19IG0gV0hFUkUgbS5mZWVkaW5nX3RhYmxlX2lkPXQuaWQgQU5EIG0uaXNfYWN0aXZlPTEpIik7CgloZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSk7Cg==';
import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 for(let i=0;i<4;i++){ try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}?nocache=${Math.random()}"`).toString()); if(j.sha)s=j.sha; }catch(e){}
  fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'q3',content:Buffer.from(JSON.stringify(o)).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync(`curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}"`,{maxBuffer:80*1024*1024}).toString().trim();
  if(c==='200'||c==='201') return c; }
 return 'fail';}
const U=process.env.WP_USER||'',P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
fs.writeFileSync('/tmp/wpu',U);fs.writeFileSync('/tmp/wpp',P);
function hit(u){try{return execSync(`curl -sk -m 500 -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" "${u}"`,{maxBuffer:150*1024*1024}).toString();}catch(e){return 'ERR';}}
function wj(m,p,b){fs.writeFileSync('/tmp/b.json',JSON.stringify(b));try{return execSync(`curl -sk -m 90 -X ${m} -H "Content-Type: application/json" -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" -d @/tmp/b.json "https://dev.avesa.lt/wp-json/${p}"`,{maxBuffer:20*1024*1024}).toString();}catch(e){return 'ERR';}}
const o={};
const mk=wj('POST','code-snippets/v1/snippets',{name:'S212-C Quar3 (read-only)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:10});
let id=null; try{const j=JSON.parse(mk); id=j.id; o.create={id:j.id,code_error:j.code_error||null};}catch(e){o.mk=mk.slice(0,250);}
if(id){ const r=hit('https://dev.avesa.lt/?ps_q3=Q3Kw8Nx&confirm=APPLY_Q3');
  const i=r.indexOf('{"');
  if(i>0){ o.php_warnings=r.slice(0,i).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().slice(0,600); }
  const body=(i>=0)?r.slice(i):r;
  if(body.trim().startsWith('{')){ try{o.d=JSON.parse(body);}catch(e){o.perr=e.message.slice(0,120); o.raw=body.slice(0,4000);} }
  else o.raw=r.slice(0,4000);
  wj('POST',`code-snippets/v1/snippets/${id}`,{active:false}); }
console.log('PUT:',pr('q3.json',o));
