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
const php=Buffer.from('PD9waHAKLyoqCiAqIFMzMzMgY2FsbC1zaXRlIGF1ZGl0YXMgKyByZWFsdXMgaWRpZWd0byBrb2RvIHR1cmlueXMKICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgICBpZiAoICEgaXNzZXQoJF9HRVRbJ3BzX2NzMiddKSB8fCAkX0dFVFsncHNfY3MyJ10gIT09ICdDczJtOScgKSByZXR1cm47CiAgICBub2NhY2hlX2hlYWRlcnMoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAgICRyID0gYXJyYXkoJ1ZFUlNJSkEnPT4nY2FsbHNpdGUtdjEnKTsKCiAgICAvLyAxKSBWSVNJIGNyZWF0ZV9wZXQgLyBjcmVhdGVfcGV0X3Jlc3VsdCBrdmlldGltYWkgdmlzYW1lIGtvZGUKICAgICRkaXJzID0gYXJyYXkoJ2NvcmUnPT5XUF9QTFVHSU5fRElSLicvcGV0c2hvcC1jb3JlJywgJ2VzcCc9PldQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWVzcCcsCiAgICAgICAgICAgICAgICAgICdjaGlsZCc9PmdldF9zdHlsZXNoZWV0X2RpcmVjdG9yeSgpLCAneG1sJz0+V1BfUExVR0lOX0RJUi4nL3BldHNob3AteG1sJyk7CiAgICBmb3JlYWNoICgkZGlycyBhcyAkaz0+JGQpIHsKICAgICAgICBpZiAoIWlzX2RpcigkZCkpIGNvbnRpbnVlOwogICAgICAgICRpdCA9IG5ldyBSZWN1cnNpdmVJdGVyYXRvckl0ZXJhdG9yKG5ldyBSZWN1cnNpdmVEaXJlY3RvcnlJdGVyYXRvcigkZCwgUmVjdXJzaXZlRGlyZWN0b3J5SXRlcmF0b3I6OlNLSVBfRE9UUykpOwogICAgICAgIGZvcmVhY2ggKCRpdCBhcyAkZikgewogICAgICAgICAgICBpZiAoISRmLT5pc0ZpbGUoKSkgY29udGludWU7CiAgICAgICAgICAgICRlID0gc3RydG9sb3dlcigkZi0+Z2V0RXh0ZW5zaW9uKCkpOwogICAgICAgICAgICBpZiAoIWluX2FycmF5KCRlLCBhcnJheSgncGhwJywnanMnKSwgdHJ1ZSkpIGNvbnRpbnVlOwogICAgICAgICAgICAkYyA9IEBmaWxlX2dldF9jb250ZW50cygkZi0+Z2V0UGF0aG5hbWUoKSk7CiAgICAgICAgICAgIGlmICgkYyA9PT0gZmFsc2UgfHwgc3RycG9zKCRjLCdjcmVhdGVfcGV0JykgPT09IGZhbHNlKSBjb250aW51ZTsKICAgICAgICAgICAgZm9yZWFjaCAoZXhwbG9kZSgiXG4iLCAkYykgYXMgJG49PiRsKSB7CiAgICAgICAgICAgICAgICBpZiAoc3RycG9zKCRsLCdjcmVhdGVfcGV0JykgIT09IGZhbHNlKSB7CiAgICAgICAgICAgICAgICAgICAgJHJbJ2t2aWV0aW1haSddWyRrLicvJy5zdHJfcmVwbGFjZSgkZC4nLycsJycsJGYtPmdldFBhdGhuYW1lKCkpXVtdID0gKCRuKzEpLic6ICcudHJpbShzdWJzdHIoJGwsMCwxNDApKTsKICAgICAgICAgICAgICAgIH0KICAgICAgICAgICAgfQogICAgICAgIH0KICAgIH0KICAgIC8vIHNuaXBwZXR1b3NlCiAgICBnbG9iYWwgJHdwZGI7CiAgICAkclsnc25pcHBldHVvc2UnXSA9ICR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLG5hbWUsYWN0aXZlIEZST00geyR3cGRiLT5wcmVmaXh9c25pcHBldHMgV0hFUkUgY29kZSBMSUtFICclY3JlYXRlX3BldCUnIiwgQVJSQVlfQSk7CgogICAgLy8gMikgUkVBTFVTIGlkaWVndGFzIGtvZGFzCiAgICAkcCA9IFBFVFNIT1BfQ09SRV9ESVIuJ2luY2x1ZGVzL2NsYXNzLXBldC1wcm9maWxlLnBocCc7CiAgICAkYyA9IGZpbGVfZ2V0X2NvbnRlbnRzKCRwKTsKICAgICRyWydmYWlsb19zaGEyNTYnXSA9IGhhc2goJ3NoYTI1NicsICRjKTsKICAgICRyWydmYWlsb19keWRpcyddID0gc3RybGVuKCRjKTsKICAgICRpID0gc3RycG9zKCRjLCAncHVibGljIHN0YXRpYyBmdW5jdGlvbiBjcmVhdGVfcGV0X3Jlc3VsdCcpOwogICAgJGogPSBzdHJwb3MoJGMsICdwcml2YXRlIHN0YXRpYyBmdW5jdGlvbiBjcmVhdGVfcGV0KCcpOwogICAgaWYgKCRpIT09ZmFsc2UgJiYgJGohPT1mYWxzZSkgewogICAgICAgICRyWydjcmVhdGVfcGV0X3Jlc3VsdCddID0gc3Vic3RyKCRjLCAkaSAtIDEyMDAsICgkaiAtICgkaS0xMjAwKSkpOwogICAgICAgICRlbmQgPSBzdHJwb3MoJGMsICJcblx0cHVibGljIHN0YXRpYyBmdW5jdGlvbiIsICRqKTsKICAgICAgICBpZiAoJGVuZCA9PT0gZmFsc2UpICRlbmQgPSBzdHJwb3MoJGMsICJcblx0cHJpdmF0ZSBzdGF0aWMgZnVuY3Rpb24iLCAkaisxMCk7CiAgICAgICAgJHJbJ3dyYXBwZXInXSA9IHN1YnN0cigkYywgJGosICgkZW5kID8gJGVuZC0kaiA6IDIwMDApKTsKICAgIH0KICAgIC8vIDMpIHNhdWd1bW8gcGF0aWtyb3MKICAgICRyWydwYXRpa3JvcyddID0gYXJyYXkoCiAgICAgICAgJ3Jlc3VsdF9ncmF6aW5hX1JFU1QnID0+IChzdHJwb3MoJHJbJ2NyZWF0ZV9wZXRfcmVzdWx0J10gPz8gJycsICdXUF9SRVNUX1Jlc3BvbnNlJykgIT09IGZhbHNlCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB8fCBzdHJwb3MoJHJbJ2NyZWF0ZV9wZXRfcmVzdWx0J10gPz8gJycsICdyZXN0X2Vuc3VyZV9yZXNwb25zZScpICE9PSBmYWxzZSksCiAgICAgICAgJ3Jlc3VsdF9XUF9FcnJvcicgICAgID0+IChzdHJwb3MoJHJbJ2NyZWF0ZV9wZXRfcmVzdWx0J10gPz8gJycsICdXUF9FcnJvcicpICE9PSBmYWxzZSksCiAgICAgICAgJ3dyYXBwZXJfc2FrdScgICAgICAgID0+IHN1YnN0cl9jb3VudCgkclsnd3JhcHBlciddID8/ICcnLCAncmV0dXJuICcpLAogICAgICAgICdtaXJyb3Jfa2FydGFpJyAgICAgICA9PiBzdWJzdHJfY291bnQoJGMsICdzZWxmOjptaXJyb3JfdG9fc2VuZGVyKCcpLAogICAgICAgICdlbWl0X2NyZWF0ZWRfa2FydGFpJyA9PiBzdWJzdHJfY291bnQoJGMsICdzZWxmOjplbWl0X2NyZWF0ZWQoJyksCiAgICAgICAgJ2luc2VydF9rYXJ0YWknICAgICAgID0+IHN1YnN0cl9jb3VudCgkYywgIlwkd3BkYi0+aW5zZXJ0KCBzZWxmOjp0YWJsZV9uYW1lKCkiKSwKICAgICk7CiAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVMpOwogICAgZXhpdDsKfSk7Cg==','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'UI Localization Runtime Audit',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('callsite.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
function uzk(n){
  const x=sh('curl -sSk -m 60 "'+SITE+'/?ps_cs2=Cs2m9"');
  try{ return JSON.parse(x.out); }catch(e){ O['raw'+n]=x.out.slice(0,700); return null; }
}
O.rez=uzk(1);
sh('sleep 4');
function code(u){ return sh('curl -sSkI -m 30 -o /dev/null -w "%{http_code}|%{redirect_url}" "'+u+'"').out.trim(); }
O.t_naujas       = code(SITE+'/paskyra/');
O.t_atsijungti   = code(SITE+'/paskyra/atsijungti/');
O.t_senas_logout = code(SITE+'/my-account/customer-logout/');
O.t_adresai      = code(SITE+'/paskyra/adresai/');
O.t_slaptazodis  = code(SITE+'/paskyra/pamirstas-slaptazodis/');
O.t_augintinis   = code(SITE+'/paskyra/augintinis/');
O.t_uzsakymai    = code(SITE+'/paskyra/uzsakymai/');
O.t_senas        = code(SITE+'/my-account/');
O.t_senas_uzsak  = code(SITE+'/my-account/orders/');
O.t_senas_augint = code(SITE+'/my-account/augintinis/');
O.t_landing      = code(SITE+'/augintinio-profilis/');
O.t_home         = code(SITE+'/');
O.t_shop         = code(SITE+'/parduotuve/');

fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
O.site=sh('curl -sSk -m 25 -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
putB64('callsite.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
