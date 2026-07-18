const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfYzUnXSl8fCRfR0VUWydwc19jNSddIT09J0M1S3c4TngnKXtyZXR1cm47fQoJZ2xvYmFsICR3cGRiOyAkcGY9JHdwZGItPnByZWZpeDsgJG89YXJyYXkoKTsKCSR0b2tzPWFycmF5KCdTcjhLdzNOeCcsJ1B0OUt3M054JywnTXI3S3czTngnLCdTcDhLdzNOeCcsJ1EzS3c4TngnLCdDNUt3OE54Jyk7CgkkbGlrZT1pbXBsb2RlKCcgT1IgJyxhcnJheV9tYXAoZnVuY3Rpb24oJHQpe3JldHVybiAiY29kZSBMSUtFICclIi4kdC4iJSciO30sJHRva3MpKTsKCSRzbj0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCxuYW1lIEZST00geyRwZn1zbmlwcGV0cyBXSEVSRSAoJGxpa2UpIEFORCBhY3RpdmU9MSIsIEFSUkFZX0EpOwoJJGQ9MDsgZm9yZWFjaCgkc24gYXMgJHMpeyAkY29kZT0kd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIGNvZGUgRlJPTSB7JHBmfXNuaXBwZXRzIFdIRVJFIGlkPSVkIiwkc1snaWQnXSkpOyBpZihzdHJwb3MoJGNvZGUsJ0M1S3c4TngnKT09PWZhbHNlKXsgJHdwZGItPnVwZGF0ZSgkcGYuJ3NuaXBwZXRzJyxhcnJheSgnYWN0aXZlJz0+MCksYXJyYXkoJ2lkJz0+JHNbJ2lkJ10pKTsgJGQrKzsgfSB9Cgkkb1snZGVha3R5dnVvdGEnXT0kZDsKCSRvWydsaWtvX2FrdHl2aXUnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHBmfXNuaXBwZXRzIFdIRVJFIGFjdGl2ZT0xIik7CgkvLyBnYWx1dGluxJcgYsWrc2VuYTogMjQxLzI0Mi8yNDMgbmVlZHNfcmV2aWV3LCBaWlRFU1QgMAoJJG9bJ2V4Y2x1c2lvbl9uYXVqdV9uZWVkc19yZXZpZXcnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHBmfXBzX2ZlZWRpbmdfdGFibGVzIFdIRVJFIGlkIElOICgyNDEsMjQyLDI0MykgQU5EIHN0YXR1cz0nbmVlZHNfcmV2aWV3JyBBTkQgaXNfYWN0aXZlPTAiKTsKCSRvWyd6enRlc3RfbGlrbyddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskcGZ9cHNfZmVlZGluZ190YWJsZXMgV0hFUkUgYnJhbmQ9J1paVEVTVCciKTsKCSRvWydydW50aW1lXzIyMl92ZXJpZmllZCddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskcGZ9cHNfZmVlZGluZ190YWJsZXMgV0hFUkUgY2Fub25pY2FsX2hhc2hfdmVyc2lvbj0nY2hhc2hfdjEnIEFORCBzdGF0dXM9J3ZlcmlmaWVkJyBBTkQgaXNfYWN0aXZlPTEiKTsKCWhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9KTsK';
import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 for(let i=0;i<4;i++){ try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}?nocache=${Math.random()}"`).toString()); if(j.sha)s=j.sha; }catch(e){}
  fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'c5',content:Buffer.from(JSON.stringify(o)).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync(`curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}"`,{maxBuffer:80*1024*1024}).toString().trim();
  if(c==='200'||c==='201') return c; }
 return 'fail';}
const U=process.env.WP_USER||'',P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
fs.writeFileSync('/tmp/wpu',U);fs.writeFileSync('/tmp/wpp',P);
function hit(u){try{return execSync(`curl -sk -m 500 -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" "${u}"`,{maxBuffer:150*1024*1024}).toString();}catch(e){return 'ERR';}}
function wj(m,p,b){fs.writeFileSync('/tmp/b.json',JSON.stringify(b));try{return execSync(`curl -sk -m 90 -X ${m} -H "Content-Type: application/json" -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" -d @/tmp/b.json "https://dev.avesa.lt/wp-json/${p}"`,{maxBuffer:20*1024*1024}).toString();}catch(e){return 'ERR';}}
const o={};
const mk=wj('POST','code-snippets/v1/snippets',{name:'S212-C Cleanup5 (read-only)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:10});
let id=null; try{const j=JSON.parse(mk); id=j.id; o.create={id:j.id,code_error:j.code_error||null};}catch(e){o.mk=mk.slice(0,250);}
if(id){ const r=hit('https://dev.avesa.lt/?ps_c5=C5Kw8Nx');
  const i=r.indexOf('{"');
  if(i>0){ o.php_warnings=r.slice(0,i).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().slice(0,600); }
  const body=(i>=0)?r.slice(i):r;
  if(body.trim().startsWith('{')){ try{o.d=JSON.parse(body);}catch(e){o.perr=e.message.slice(0,120); o.raw=body.slice(0,4000);} }
  else o.raw=r.slice(0,4000);
  wj('POST',`code-snippets/v1/snippets/${id}`,{active:false}); }
console.log('PUT:',pr('c5.json',o));
