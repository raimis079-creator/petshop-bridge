const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfY2snXSl8fCRfR0VUWydwc19jayddIT09J0NrOEt3M054Jyl7cmV0dXJuO30KCUBzZXRfdGltZV9saW1pdCgzMDApOyBnbG9iYWwgJHdwZGI7ICRwZj0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgncmVhZG9ubHknPT50cnVlKTsKCSRUPSRwZi4ncHNfZmVlZGluZ190YWJsZXMnOwoJLy8gdGlrcmluYW0gYXIgZXNhbXUgbGVudGVsaXUgY2hlY2tzdW0gPSBoYXNoKHRhYmxlX2tleXx2ZXJzaW9uX25vfGNhbm9uaWNhbCkKCSR0YWJzPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLHRhYmxlX2tleSx2ZXJzaW9uX25vLGNhbm9uaWNhbF90YWJsZV9oYXNoLGNoZWNrc3VtIEZST00geyRUfQoJCVdIRVJFIGNhbm9uaWNhbF9oYXNoX3ZlcnNpb249J2NoYXNoX3YxJyBBTkQgdGFibGVfa2V5IElTIE5PVCBOVUxMIExJTUlUIDI1MCIsIEFSUkFZX0EpOwoJJG1hdGNoPTA7JG1pc21hdGNoPTA7JG1pc209YXJyYXkoKTsKCWZvcmVhY2goJHRhYnMgYXMgJHQpewoJCSRleHBlY3RlZD1oYXNoKCdzaGEyNTYnLCR0Wyd0YWJsZV9rZXknXS4nfCcuJHRbJ3ZlcnNpb25fbm8nXS4nfCcuJHRbJ2Nhbm9uaWNhbF90YWJsZV9oYXNoJ10pOwoJCWlmKCRleHBlY3RlZD09PSR0WydjaGVja3N1bSddKSAkbWF0Y2grKzsKCQllbHNlIHsgJG1pc21hdGNoKys7IGlmKGNvdW50KCRtaXNtKTw4KSAkbWlzbVtdPWFycmF5KCdpZCc9PiR0WydpZCddLCdrZXknPT4kdFsndGFibGVfa2V5J10sJ3Zubyc9PiR0Wyd2ZXJzaW9uX25vJ10sJ2NoZWNrc3VtJz0+c3Vic3RyKCR0WydjaGVja3N1bSddLDAsMTIpLCdleHBlY3RlZCc9PnN1YnN0cigkZXhwZWN0ZWQsMCwxMikpOyB9Cgl9Cgkkb1sna29udmVuY2lqYV9oYXNoX2tleV92bm9fY2Fub25pY2FsJ109YXJyYXkoJ3Zpc28nPT5jb3VudCgkdGFicyksJ21hdGNoJz0+JG1hdGNoLCdtaXNtYXRjaCc9PiRtaXNtYXRjaCwnbWlzbV9wdnonPT4kbWlzbSk7CgkvLyAyNDEvMjQyLzI0MyBjaGVja3N1bSBkYWJhcgoJZm9yZWFjaChhcnJheSgyNDEsMjQyLDI0MykgYXMgJHRpZCl7CgkJJHQ9JHdwZGItPmdldF9yb3coJHdwZGItPnByZXBhcmUoIlNFTEVDVCBpZCx0YWJsZV9rZXksdmVyc2lvbl9ubyxjYW5vbmljYWxfdGFibGVfaGFzaCxjaGVja3N1bSBGUk9NIHskVH0gV0hFUkUgaWQ9JWQiLCR0aWQpLCBBUlJBWV9BKTsKCQkkZXhwPWhhc2goJ3NoYTI1NicsJHRbJ3RhYmxlX2tleSddLid8Jy4kdFsndmVyc2lvbl9ubyddLid8Jy4kdFsnY2Fub25pY2FsX3RhYmxlX2hhc2gnXSk7CgkJJG9bJ3QnLiR0aWRdPWFycmF5KCd0YWJsZV9rZXknPT4kdFsndGFibGVfa2V5J10sJ3Zubyc9PiR0Wyd2ZXJzaW9uX25vJ10sCgkJCSdjaGVja3N1bV9kYWJhcic9PnN1YnN0cigkdFsnY2hlY2tzdW0nXSwwLDE2KSwnY2Fub25pY2FsJz0+c3Vic3RyKCR0WydjYW5vbmljYWxfdGFibGVfaGFzaCddLDAsMTYpLAoJCQknY2hlY2tzdW09PWNhbm9uaWNhbD8nPT4oJHRbJ2NoZWNrc3VtJ109PT0kdFsnY2Fub25pY2FsX3RhYmxlX2hhc2gnXSksCgkJCSd0ZWlzaW5nYXNfY2hlY2tzdW0nPT5zdWJzdHIoJGV4cCwwLDE2KSwKCQkJJ2tvbGl6aWphX3N1X2VzYW11Jz0+KGludCkkd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIENPVU5UKCopIEZST00geyRUfSBXSEVSRSBjaGVja3N1bT0lcyBBTkQgaWQ8PiVkIiwkZXhwLCR0aWQpKSk7Cgl9CgloZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSk7Cg==';
import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 for(let i=0;i<4;i++){ try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}?nocache=${Math.random()}"`).toString()); if(j.sha)s=j.sha; }catch(e){}
  fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'ck',content:Buffer.from(JSON.stringify(o)).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync(`curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}"`,{maxBuffer:80*1024*1024}).toString().trim();
  if(c==='200'||c==='201') return c; }
 return 'fail';}
const U=process.env.WP_USER||'',P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
fs.writeFileSync('/tmp/wpu',U);fs.writeFileSync('/tmp/wpp',P);
function hit(u){try{return execSync(`curl -sk -m 500 -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" "${u}"`,{maxBuffer:150*1024*1024}).toString();}catch(e){return 'ERR';}}
function wj(m,p,b){fs.writeFileSync('/tmp/b.json',JSON.stringify(b));try{return execSync(`curl -sk -m 90 -X ${m} -H "Content-Type: application/json" -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" -d @/tmp/b.json "https://dev.avesa.lt/wp-json/${p}"`,{maxBuffer:20*1024*1024}).toString();}catch(e){return 'ERR';}}
const o={};
const mk=wj('POST','code-snippets/v1/snippets',{name:'S212-C Checksum Recon (read-only)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:10});
let id=null; try{const j=JSON.parse(mk); id=j.id; o.create={id:j.id,code_error:j.code_error||null};}catch(e){o.mk=mk.slice(0,250);}
if(id){ const r=hit('https://dev.avesa.lt/?ps_ck=Ck8Kw3Nx');
  const i=r.indexOf('{"');
  if(i>0){ o.php_warnings=r.slice(0,i).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().slice(0,600); }
  const body=(i>=0)?r.slice(i):r;
  if(body.trim().startsWith('{')){ try{o.d=JSON.parse(body);}catch(e){o.perr=e.message.slice(0,120); o.raw=body.slice(0,4000);} }
  else o.raw=r.slice(0,4000);
  wj('POST',`code-snippets/v1/snippets/${id}`,{active:false}); }
console.log('PUT:',pr('ck.json',o));
