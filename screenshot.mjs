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
const php=Buffer.from('PD9waHAKLyoqCiAqIFMzMzMgUEFSSVRFVE8gVEVTVEFTIOKAlCB0aWUgcGF0eXMgNiBzY2VuYXJpamFpIGthaXAgYmFzZWxpbmUKICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgICBpZiAoICEgaXNzZXQoJF9HRVRbJ3BzX3BhciddKSB8fCAkX0dFVFsncHNfcGFyJ10gIT09ICdQYXI4dycgKSByZXR1cm47CiAgICBub2NhY2hlX2hlYWRlcnMoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAgIGdsb2JhbCAkd3BkYjsKICAgICRQRVRTID0gJHdwZGItPnByZWZpeC4ncHNfcGV0cyc7ICRFTCA9ICR3cGRiLT5wcmVmaXguJ3BzX2V2ZW50X2xvZyc7CiAgICAkUiA9IGFycmF5KCdWRVJTSUpBJz0+J3Bhcml0ZXRhcy12MScpOwoKICAgIC8vIG1ldG9kYWkgU1ZJRVpJT0pFIHV6a2xhdXNvamUKICAgICRSWydtZXRvZGFpJ10gPSBhcnJheSgKICAgICAgICAnY3JlYXRlX3BldF9yZXN1bHQnID0+IG1ldGhvZF9leGlzdHMoJ1BldHNob3BfUGV0X1Byb2ZpbGUnLCdjcmVhdGVfcGV0X3Jlc3VsdCcpID8gJ1lSQScgOiAnTkVSQScsCiAgICAgICAgJ2NyZWF0ZV9wZXQnICAgICAgICA9PiBtZXRob2RfZXhpc3RzKCdQZXRzaG9wX1BldF9Qcm9maWxlJywnY3JlYXRlX3BldCcpID8gJ1lSQScgOiAnTkVSQScsCiAgICApOwoKICAgIC8vIGpva2lvIGlzZWluYW5jaW8gSFRUUCBpIFNlbmRlcgogICAgYWRkX2ZpbHRlcigncHJlX2h0dHBfcmVxdWVzdCcsIGZ1bmN0aW9uKCRwcmUsJGFyZ3MsJHVybCl7CiAgICAgICAgaWYgKHN0cmlwb3MoJHVybCwnc2VuZGVyJykgIT09IGZhbHNlKSB7IHJldHVybiBuZXcgV1BfRXJyb3IoJ2Jsb2t1b3RhJywncGFyaXRldGFzJyk7IH0KICAgICAgICByZXR1cm4gJHByZTsKICAgIH0sIDEsIDMpOwoKICAgIC8vIGR1IHRlc3RpbmlhaSB2YXJ0b3RvamFpCiAgICAkdWlkcyA9IGFycmF5KCk7CiAgICBmb3JlYWNoIChhcnJheSgncHNfcGFyX3UxJywncHNfcGFyX3UyJykgYXMgJGxuKSB7CiAgICAgICAgJHUgPSBnZXRfdXNlcl9ieSgnbG9naW4nLCRsbik7CiAgICAgICAgaWYgKCEkdSkgewogICAgICAgICAgICAkaWQgPSB3cF9pbnNlcnRfdXNlcihhcnJheSgndXNlcl9sb2dpbic9PiRsbiwndXNlcl9lbWFpbCc9PiRsbi4nQGRldi5hdmVzYS5sdCcsCiAgICAgICAgICAgICAgICAndXNlcl9wYXNzJz0+d3BfZ2VuZXJhdGVfcGFzc3dvcmQoMjQpLCdyb2xlJz0+J2N1c3RvbWVyJykpOwogICAgICAgICAgICAkdSA9IGlzX3dwX2Vycm9yKCRpZCkgPyBudWxsIDogZ2V0X3VzZXJfYnkoJ2lkJywkaWQpOwogICAgICAgIH0KICAgICAgICBpZiAoJHUpIHsgJHVpZHNbJGxuXT0oaW50KSR1LT5JRDsgJHdwZGItPnF1ZXJ5KCR3cGRiLT5wcmVwYXJlKCJERUxFVEUgRlJPTSAkUEVUUyBXSEVSRSB1c2VyX2lkPSVkIiwoaW50KSR1LT5JRCkpOyB9CiAgICB9CiAgICAkUlsndmFydG90b2phaSddID0gJHVpZHM7CiAgICAkTUFSSyA9ICdQQVJURVNULScuc3Vic3RyKG1kNShtaWNyb3RpbWUodHJ1ZSkpLDAsOCk7CiAgICAkUkVGICA9ICdwYXJyZWYtJy53cF9nZW5lcmF0ZV91dWlkNCgpOwogICAgJFJbJ3p5bWVrbGlzJ10gPSAkTUFSSzsKCiAgICAkZXYgPSBmdW5jdGlvbigpIHVzZSAoJHdwZGIsJEVMKSB7IHJldHVybiAoaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSAkRUwgV0hFUkUgZXZlbnRfbmFtZT0ncGV0X3Byb2ZpbGVfY3JlYXRlZCciKTsgfTsKICAgICRwYyA9IGZ1bmN0aW9uKCkgdXNlICgkd3BkYiwkUEVUUykgeyByZXR1cm4gKGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJFBFVFMiKTsgfTsKCiAgICAkcnVuID0gZnVuY3Rpb24oJHZhcmRhcywkdWlkLCRwYXlsb2FkKSB1c2UgKCYkUiwkd3BkYiwkUEVUUywkZXYsJHBjKSB7CiAgICAgICAgd3Bfc2V0X2N1cnJlbnRfdXNlcigkdWlkKTsKICAgICAgICAkcDA9JHBjKCk7ICRlMD0kZXYoKTsKICAgICAgICAkcmVxID0gbmV3IFdQX1JFU1RfUmVxdWVzdCgnUE9TVCcsJy9wZXRzaG9wL3YxL3BldC1wcm9maWxlJyk7CiAgICAgICAgJHJlcS0+c2V0X2hlYWRlcignQ29udGVudC1UeXBlJywnYXBwbGljYXRpb24vanNvbicpOwogICAgICAgICRyZXEtPnNldF9ib2R5KHdwX2pzb25fZW5jb2RlKCRwYXlsb2FkKSk7CiAgICAgICAgJHJlcyA9IHJlc3RfZG9fcmVxdWVzdCgkcmVxKTsKICAgICAgICAkcDE9JHBjKCk7ICRlMT0kZXYoKTsKICAgICAgICAkZGF0YSA9ICRyZXMtPmdldF9kYXRhKCk7CiAgICAgICAgJG91dCA9IGFycmF5KAogICAgICAgICAgICAnaHR0cF9zdGF0dXMnPT4kcmVzLT5nZXRfc3RhdHVzKCksICdyZXNwb25zZSc9PiRkYXRhLAogICAgICAgICAgICAncGV0c19wb2t5dGlzJz0+JHAxLSRwMCwgJ2V2ZW50X3Bva3l0aXMnPT4kZTEtJGUwLAogICAgICAgICk7CiAgICAgICAgJHBpZCA9IGlzX2FycmF5KCRkYXRhKSAmJiBpc3NldCgkZGF0YVsncGV0X2lkJ10pID8gKGludCkkZGF0YVsncGV0X2lkJ10gOiAwOwogICAgICAgICRvdXRbJ3BldF9pZCddPSRwaWQ7CiAgICAgICAgaWYgKCRwaWQpIHsgJG91dFsncHNfcGV0c19laWx1dGUnXSA9ICR3cGRiLT5nZXRfcm93KCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgKiBGUk9NICRQRVRTIFdIRVJFIGlkPSVkIiwkcGlkKSwgQVJSQVlfQSk7IH0KICAgICAgICAkUlsnc2NlbmFyaWphaSddWyR2YXJkYXNdPSRvdXQ7CiAgICAgICAgcmV0dXJuICRwaWQ7CiAgICB9OwoKICAgICRiYXplID0gYXJyYXkoJ3BldF9uYW1lJz0+JE1BUksuJy1SaWtpcycsJ3NwZWNpZXMnPT4nZG9nJywnY3VycmVudF93ZWlnaHRfa2cnPT4xMi41LCdhY3Rpdml0eV9oaW50Jz0+J21vZGVyYXRlJyk7CiAgICAkcnVuKCcxX2JlX2NsaWVudF9yZWYnLCAkdWlkc1sncHNfcGFyX3UxJ10sICRiYXplKTsKICAgICRydW4oJzJfc3VfY2xpZW50X3JlZicsICR1aWRzWydwc19wYXJfdTEnXSwgYXJyYXlfbWVyZ2UoJGJhemUsIGFycmF5KCdwZXRfbmFtZSc9PiRNQVJLLictTXVyc2EnLCdzcGVjaWVzJz0+J2NhdCcsJ2NsaWVudF9yZWYnPT4kUkVGKSkpOwogICAgJHJ1bignM19wYWthcnRvdGluaXMnLCAkdWlkc1sncHNfcGFyX3UxJ10sIGFycmF5X21lcmdlKCRiYXplLCBhcnJheSgncGV0X25hbWUnPT4kTUFSSy4nLU11cnNhJywnc3BlY2llcyc9PidjYXQnLCdjbGllbnRfcmVmJz0+JFJFRikpKTsKICAgICRydW4oJzRfa2l0YXNfdmFydG90b2phcycsICR1aWRzWydwc19wYXJfdTInXSwgYXJyYXlfbWVyZ2UoJGJhemUsIGFycmF5KCdwZXRfbmFtZSc9PiRNQVJLLictTXVyc2EnLCdzcGVjaWVzJz0+J2NhdCcsJ2NsaWVudF9yZWYnPT4kUkVGKSkpOwogICAgJHJ1bignNV9mb3JjZV9uZXcnLCAkdWlkc1sncHNfcGFyX3UxJ10sIGFycmF5X21lcmdlKCRiYXplLCBhcnJheSgncGV0X25hbWUnPT4kTUFSSy4nLU11cnNhJywnc3BlY2llcyc9PidjYXQnLCdjbGllbnRfcmVmJz0+JFJFRiwnZm9yY2VfbmV3Jz0+dHJ1ZSkpKTsKICAgICRydW4oJzZfdmFsaWRhY2lqb3Nfa2xhaWRhJywgJHVpZHNbJ3BzX3Bhcl91MSddLCBhcnJheSgnc3BlY2llcyc9Pidkb2cnLCdjdXJyZW50X3dlaWdodF9rZyc9PjEwKSk7CgogICAgLy8gVElFU0lPR0lOSVMgY3JlYXRlX3BldF9yZXN1bHQoKSB0ZXN0YXMg4oCUIG5hdWphcyBrZWxpYXMKICAgIGlmIChtZXRob2RfZXhpc3RzKCdQZXRzaG9wX1BldF9Qcm9maWxlJywnY3JlYXRlX3BldF9yZXN1bHQnKSkgewogICAgICAgIHdwX3NldF9jdXJyZW50X3VzZXIoJHVpZHNbJ3BzX3Bhcl91MiddKTsKICAgICAgICAkcmVmMiA9IG5ldyBSZWZsZWN0aW9uTWV0aG9kKCdQZXRzaG9wX1BldF9Qcm9maWxlJywnY3JlYXRlX3BldF9yZXN1bHQnKTsKICAgICAgICAkcmVmMi0+c2V0QWNjZXNzaWJsZSh0cnVlKTsKICAgICAgICAkUlsndGllc2lvZ2lhaSddID0gJHJlZjItPmludm9rZShudWxsLCAkdWlkc1sncHNfcGFyX3UyJ10sIGFycmF5KCdwZXRfbmFtZSc9PiRNQVJLLictVGllc2lvZ2lhaScsJ3NwZWNpZXMnPT4nZG9nJyksIG51bGwsIHRydWUpOwogICAgfQoKICAgIC8vIFZBTFlNQVMg4oCUIFRJS1NMVVMgdXNlcl9pZAogICAgZm9yZWFjaCAoJHVpZHMgYXMgJGxuPT4kdWlkKSB7CiAgICAgICAgJHdwZGItPnF1ZXJ5KCR3cGRiLT5wcmVwYXJlKCJERUxFVEUgRlJPTSAkUEVUUyBXSEVSRSB1c2VyX2lkPSVkIiwkdWlkKSk7CiAgICAgICAgcmVxdWlyZV9vbmNlIEFCU1BBVEguJ3dwLWFkbWluL2luY2x1ZGVzL3VzZXIucGhwJzsKICAgICAgICB3cF9kZWxldGVfdXNlcigkdWlkKTsKICAgIH0KICAgICRSWydwZXRzX3BvX3ZhbHltbyddID0gJHBjKCk7CiAgICAkUlsnUEFSVEVTVF9saWtvJ10gPSAoaW50KSR3cGRiLT5nZXRfdmFyKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSAkUEVUUyBXSEVSRSBwZXRfbmFtZSBMSUtFICVzIiwgJyUnLiR3cGRiLT5lc2NfbGlrZSgkTUFSSykuJyUnKSk7CiAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRSLCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVMpOwogICAgZXhpdDsKfSk7Cg==','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'UI Localization Runtime Audit',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('paritetas.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
function uzk(n){
  const x=sh('curl -sSk -m 60 "'+SITE+'/?ps_par=Par8w"');
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
putB64('paritetas.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
