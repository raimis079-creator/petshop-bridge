const V2='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfcXYyJ10pfHwkX0dFVFsncHNfcXYyJ10hPT0nTmIzV3E4WXQnKXtyZXR1cm47fQoJZ2xvYmFsICR3cGRiOyAkcGY9JHdwZGItPnByZWZpeDsgJG89YXJyYXkoKTsKCSRvWydudWxsX2Jhc2lzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsYnJhbmQsbGluZSxzaGFwZSxyb3dfZGltZW5zaW9uLHdlaWdodF9iYXNpcyxzdGF0dXMscm93X2NvdW50LHNvdXJjZV92ZXJzaW9uLHZlcmlmaWVkX2J5CgkJRlJPTSB7JHBmfXBzX2ZlZWRpbmdfdGFibGVzIFdIRVJFIHN0YXR1cz0ndmVyaWZpZWQnIEFORCB3ZWlnaHRfYmFzaXMgSVMgTlVMTCBPUkRFUiBCWSBpZCIsIEFSUkFZX0EpOwoJJG9bJ2J5X3NoYXBlJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qgc2hhcGUsc3RhdHVzLENPVU5UKCopIG4sIFNVTSh3ZWlnaHRfYmFzaXMgSVMgTlVMTCkgbnVsbGJhc2lzCgkJRlJPTSB7JHBmfXBzX2ZlZWRpbmdfdGFibGVzIEdST1VQIEJZIHNoYXBlLHN0YXR1cyBPUkRFUiBCWSBzaGFwZSxzdGF0dXMiLCBBUlJBWV9BKTsKCSRvWydxdWF0dHJvX3Jvd3Nfc2FtcGxlJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgZmVlZGluZ190YWJsZV9pZCxyb3dfb3JkZXIsd2VpZ2h0X2Zyb21fa2csd2VpZ2h0X3RvX2tnLGFtb3VudF9mcm9tX2csYW1vdW50X3RvX2csY29uZGl0aW9uX2RpbWVuc2lvbnMKCQlGUk9NIHskcGZ9cHNfZmVlZGluZ19yb3dzIFdIRVJFIGZlZWRpbmdfdGFibGVfaWQgSU4gKDE4MCwxODEpIE9SREVSIEJZIGZlZWRpbmdfdGFibGVfaWQscm93X29yZGVyIExJTUlUIDYiLCBBUlJBWV9BKTsKCWhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9KTsK';
import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function putResult(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'v2',content:Buffer.from(JSON.stringify(o,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
const U=process.env.WP_USER||'',P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
fs.writeFileSync('/tmp/wpu',U);fs.writeFileSync('/tmp/wpp',P);
function hit(u){try{return execSync(`curl -sk -m 90 -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" "${u}"`,{maxBuffer:40*1024*1024}).toString();}catch(e){return 'ERR';}}
function wj(m,p,b){fs.writeFileSync('/tmp/b.json',JSON.stringify(b));try{return execSync(`curl -sk -m 60 -X ${m} -H "Content-Type: application/json" -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" -d @/tmp/b.json "https://dev.avesa.lt/wp-json/${p}"`,{maxBuffer:20*1024*1024}).toString();}catch(e){return 'ERR';}}
const o={};
const mk=wj('POST','code-snippets/v1/snippets',{name:'Quattro Verify v2 (read-only, null basis)',code:Buffer.from(V2,'base64').toString('utf8'),scope:'front-end',active:true,priority:10});
let id=null; try{id=JSON.parse(mk).id;}catch(e){o.mk=mk.slice(0,200);}
if(id){ const r=hit('https://dev.avesa.lt/?ps_qv2=Nb3Wq8Yt'); try{o.d=JSON.parse(r);}catch(e){o.raw=r.slice(0,900);} 
        wj('POST',`code-snippets/v1/snippets/${id}`,{active:false}); o.vid=id; }
putResult('v2.json',o); console.log('DONE');
