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
const php=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgUmVmaWxsIENhdGVnb3J5IEF1ZGl0IHYxCiAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogICAgaWYgKCAhIGlzc2V0KCRfR0VUWydwc19jYSddKSB8fCAkX0dFVFsncHNfY2EnXSAhPT0gJ0NhOHQnICkgcmV0dXJuOwogICAgJEFMTE9XID0gYXJyYXkoJ3NhdXNhcy1tYWlzdGFzLXN1bmltcycsJ3NhdXNhcy1tYWlzdGFzLWthdGVtcycsJ21haXN0YXMtc3VuaW1zJywnbWFpc3Rhcy1rYXRlbXMnLCdoaXBvYWxlcmdpbmlzLW1haXN0YXMtc3VuaW1zJyk7CiAgICAkb3V0ID0gYXJyYXkoJ2FsbG93Jz0+JEFMTE9XKTsKCiAgICAkdGVybXMgPSBnZXRfdGVybXMoYXJyYXkoJ3RheG9ub215Jz0+J3Byb2R1Y3RfY2F0JywnaGlkZV9lbXB0eSc9PmZhbHNlKSk7CiAgICAkcm93cyA9IGFycmF5KCk7CiAgICBmb3JlYWNoICgoYXJyYXkpJHRlcm1zIGFzICR0KSB7CiAgICAgICAgaWYgKCAhIHByZWdfbWF0Y2goJyNtYWlzdGFzfGtvbnNlcnZ8c2xhcGl8c2thbmVzdHxwYXBpbGQjaScsICR0LT5zbHVnLicgJy4kdC0+bmFtZSkgKSBjb250aW51ZTsKICAgICAgICAkcGFyID0gJHQtPnBhcmVudCA/IGdldF90ZXJtKCR0LT5wYXJlbnQsJ3Byb2R1Y3RfY2F0JykgOiBudWxsOwogICAgICAgICRyb3dzW10gPSBhcnJheSgKICAgICAgICAgICAgJ3NsdWcnPT4kdC0+c2x1ZywgJ25hbWUnPT4kdC0+bmFtZSwgJ2lkJz0+JHQtPnRlcm1faWQsCiAgICAgICAgICAgICdjb3VudCc9PiR0LT5jb3VudCwKICAgICAgICAgICAgJ3BhcmVudCc9PiRwYXIgJiYgIWlzX3dwX2Vycm9yKCRwYXIpID8gJHBhci0+c2x1ZyA6IG51bGwsCiAgICAgICAgICAgICdpbl9hbGxvdyc9PiBpbl9hcnJheSgkdC0+c2x1ZywkQUxMT1csdHJ1ZSkgPyAxIDogMCwKICAgICAgICApOwogICAgfQogICAgdXNvcnQoJHJvd3MsZnVuY3Rpb24oJGEsJGIpe3JldHVybiAkYlsnY291bnQnXS0kYVsnY291bnQnXTt9KTsKICAgICRvdXRbJ2Zvb2RfbGlrZV90ZXJtcyddPSRyb3dzOwoKICAgIC8vIEtpZWsgUFVCTElTSCBwcmVraXUgUFJBRUlUVSBpc19mb29kX3Byb2R1Y3QoKSBpciBraWVrIE5FCiAgICAkcSA9IG5ldyBXUF9RdWVyeShhcnJheSgncG9zdF90eXBlJz0+J3Byb2R1Y3QnLCdwb3N0X3N0YXR1cyc9PidwdWJsaXNoJywncG9zdHNfcGVyX3BhZ2UnPT4tMSwnZmllbGRzJz0+J2lkcycsJ25vX2ZvdW5kX3Jvd3MnPT50cnVlKSk7CiAgICAkcGFzcz0wOyAkZmFpbF9mb29kPTA7ICRmYWlsX2V4PWFycmF5KCk7CiAgICBmb3JlYWNoICgkcS0+cG9zdHMgYXMgJHBpZCkgewogICAgICAgICRzbHVncyA9IHdwX2dldF9wb3N0X3Rlcm1zKCRwaWQsJ3Byb2R1Y3RfY2F0JyxhcnJheSgnZmllbGRzJz0+J3NsdWdzJykpOwogICAgICAgIGlmIChpc193cF9lcnJvcigkc2x1Z3MpKSBjb250aW51ZTsKICAgICAgICAkb2sgPSAoYm9vbClhcnJheV9pbnRlcnNlY3QoJHNsdWdzLCRBTExPVyk7CiAgICAgICAgLy8gYXIgcHJla8SXIEFUUk9ETyBrYWlwIG1haXN0YXMgKGJldCBrdXJpIG1haXN0byBrYXRlZ29yaWphKQogICAgICAgICRsb29rcyA9IGZhbHNlOwogICAgICAgIGZvcmVhY2goJHNsdWdzIGFzICRzKXsgaWYocHJlZ19tYXRjaCgnI21haXN0YXN8a29uc2VydnxzbGFwaSNpJywkcykpIHskbG9va3M9dHJ1ZTticmVhazt9IH0KICAgICAgICBpZiAoJG9rKSB7ICRwYXNzKys7IH0KICAgICAgICBlbHNlaWYgKCRsb29rcykgeyAkZmFpbF9mb29kKys7IGlmKGNvdW50KCRmYWlsX2V4KTw4KSAkZmFpbF9leFtdPWFycmF5KCdpZCc9PiRwaWQsJ3RpdGxlJz0+Z2V0X3RoZV90aXRsZSgkcGlkKSwnY2F0cyc9PiRzbHVncyk7IH0KICAgIH0KICAgICRvdXRbJ3Bhc3NfaXNfZm9vZCddPSRwYXNzOwogICAgJG91dFsnRkFJTF9idXRfbG9va3NfbGlrZV9mb29kJ109JGZhaWxfZm9vZDsKICAgICRvdXRbJ2ZhaWxfZXhhbXBsZXMnXT0kZmFpbF9leDsKCiAgICAvLyB3ZXRfb25seSBhdWdpbnRpbmlvIHByb2R1a3RhcwogICAgZ2xvYmFsICR3cGRiOwogICAgJHA9JHdwZGItPnByZWZpeC4ncHNfcGV0cyc7CiAgICAkb3V0Wyd3ZXRfcGV0cyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLGZlZWRpbmdfdHlwZSxwcmltYXJ5X3Byb2R1Y3RfaWQsd2V0X3Byb2R1Y3RfaWQgRlJPTSAkcCBXSEVSRSBmZWVkaW5nX3R5cGUgSU4gKCd3ZXRfb25seScsJ2RyeV93ZXQnKSIsQVJSQVlfQSk7CgogICAgbm9jYWNoZV9oZWFkZXJzKCk7CiAgICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICAgZWNobyB3cF9qc29uX2VuY29kZSgkb3V0LCBKU09OX1VORVNDQVBFRF9TTEFTSEVTfEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOwogICAgZXhpdDsKfSwgMSk7Cg==','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP Refill Category Audit v1',code:php,scope:'global',active:true}));
for(let i=0;i<4&&!sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,200); sh('sleep 4');}
}
O.sid=sid;
if(sid){ sh('sleep 3');
  const g=sh('curl -sSk "'+SITE+'/?ps_ca=Ca8t" -o /tmp/rd.json -w "%{http_code}"');
  O.code=g.out.trim();
  try{ O.data=JSON.parse(fs.readFileSync('/tmp/rd.json','utf8')); }catch(e){ O.raw=String(fs.readFileSync('/tmp/rd.json','utf8')).slice(0,600); }
  fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
  sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
}
putB64('ca.json',Buffer.from(JSON.stringify(O)).toString('base64'));
console.log('done');
