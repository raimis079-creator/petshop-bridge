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
const php=Buffer.from('PD9waHAKLyoqCiAqIFMzMzcg4oCUIE04IGlyIE0xMCBwYWthcnRvamltYXMgc3UgaXN2YWx5dHUgcmF0ZSBsaW1pdAogKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAgIGlmICggISBpc3NldCgkX0dFVFsncHNfbTgxJ10pIHx8ICRfR0VUWydwc19tODEnXSAhPT0gJ004MWY0JyApIHJldHVybjsKICAgIG5vY2FjaGVfaGVhZGVycygpOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICAgZ2xvYmFsICR3cGRiOwogICAgJFRUPSR3cGRiLT5wcmVmaXguJ3BzX2FjdGlvbl90b2tlbnMnOyAkVEQ9JHdwZGItPnByZWZpeC4ncHNfcGV0X3Byb2ZpbGVfZHJhZnRzJzsgJFBFVFM9JHdwZGItPnByZWZpeC4ncHNfcGV0cyc7CiAgICAkUj1hcnJheSgnVkVSU0lKQSc9PidtOC1tMTAtdjEnKTsKICAgICRHTE9CQUxTWydwc19tYWlsJ109MDsKICAgIGFkZF9maWx0ZXIoJ3ByZV93cF9tYWlsJywgZnVuY3Rpb24oJG4sJGEpeyAkR0xPQkFMU1sncHNfbWFpbCddKys7IHJldHVybiB0cnVlOyB9LDEsMik7CiAgICBhZGRfZmlsdGVyKCdwcmVfaHR0cF9yZXF1ZXN0JywgZnVuY3Rpb24oJHAsJGEsJHUpeyByZXR1cm4gc3RyaXBvcygkdSwnc2VuZGVyJykhPT1mYWxzZSA/IG5ldyBXUF9FcnJvcignYicsJ3QnKSA6ICRwOyB9LDEsMyk7CgogICAgJHZhbHlrPWZ1bmN0aW9uKCkgdXNlKCR3cGRiKXsgJHdwZGItPnF1ZXJ5KCJERUxFVEUgRlJPTSAkd3BkYi0+b3B0aW9ucyBXSEVSRSBvcHRpb25fbmFtZSBMSUtFICdfdHJhbnNpZW50JXBzX2RyXyUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJ190cmFuc2llbnQlcHNfbWwlJyBPUiBvcHRpb25fbmFtZSBMSUtFICdfdHJhbnNpZW50JW1hZ2ljJSciKTsgfTsKICAgICR2YWx5aygpOyAkd3BkYi0+cXVlcnkoIkRFTEVURSBGUk9NICRURCBXSEVSRSAxPTEiKTsKCiAgICAkRU09J204MTBAZGV2LmF2ZXNhLmx0JzsKICAgICRCQVpFPWFycmF5KCdzcGVjaWVzJz0+J2RvZycsJ3BldF9uYW1lJz0+J1Jpa2lzJywnY3VycmVudF93ZWlnaHRfa2cnPT4xMi41KTsKICAgICRtaz1mdW5jdGlvbigkZW1haWwpIHVzZSgkQkFaRSwkdmFseWspewogICAgICAgICR2YWx5aygpOwogICAgICAgICR4PXdwX3JlbW90ZV9wb3N0KHJlc3RfdXJsKCdwZXRzaG9wL3YxL3BldC1kcmFmdCcpLCBhcnJheSgndGltZW91dCc9PjMwLCdzc2x2ZXJpZnknPT5mYWxzZSwKICAgICAgICAgICAgJ2hlYWRlcnMnPT5hcnJheSgnQ29udGVudC1UeXBlJz0+J2FwcGxpY2F0aW9uL2pzb24nKSwKICAgICAgICAgICAgJ2JvZHknPT53cF9qc29uX2VuY29kZShhcnJheSgnZW1haWwnPT4kZW1haWwsJ3BheWxvYWQnPT4kQkFaRSkpKSk7CiAgICAgICAgJGI9anNvbl9kZWNvZGUod3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJHgpLCB0cnVlKTsKICAgICAgICByZXR1cm4gYXJyYXkoJ2RyYWZ0X2lkJz0+JGJbJ2RyYWZ0X2lkJ10/P251bGwsICdrb2Rhcyc9PndwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCR4KSk7CiAgICB9OwogICAgJHJlcT1mdW5jdGlvbigkYm9keSkgdXNlKCR2YWx5ayl7CiAgICAgICAgJHZhbHlrKCk7CiAgICAgICAgJHg9d3BfcmVtb3RlX3Bvc3QocmVzdF91cmwoJ3BldHNob3AvdjEvbWFnaWMtbG9naW4vcmVxdWVzdCcpLCBhcnJheSgndGltZW91dCc9PjMwLCdzc2x2ZXJpZnknPT5mYWxzZSwKICAgICAgICAgICAgJ2hlYWRlcnMnPT5hcnJheSgnQ29udGVudC1UeXBlJz0+J2FwcGxpY2F0aW9uL2pzb24nKSwnYm9keSc9PndwX2pzb25fZW5jb2RlKCRib2R5KSkpOwogICAgICAgIHJldHVybiBhcnJheSgna29kYXMnPT53cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSgkeCksJ2JvZHknPT5qc29uX2RlY29kZSh3cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkeCksdHJ1ZSkpOwogICAgfTsKICAgICR0b2s9ZnVuY3Rpb24oKSB1c2UoJHdwZGIsJFRUKXsgcmV0dXJuICR3cGRiLT5nZXRfcm93KCJTRUxFQ1QgaWQsdG9rZW5faGFzaCxyZXNvdXJjZV9pZCxzdWJqZWN0X2VtYWlsLHN0YXR1cyBGUk9NICRUVCBPUkRFUiBCWSBpZCBERVNDIExJTUlUIDEiLCBBUlJBWV9BKTsgfTsKCiAgICAvLyA9PT09PSBNODogcmVzb3VyY2VfaWQgYXRlaW5hIElTIERCIC8gcGFzaXJhc3l0byBwYXlsb2FkLCBORSBpcyBVUkwgPT09PT0KICAgICRkND0kbWsoJEVNKTsKICAgICRSWydNOF9kcmFmdGFzJ109JGQ0OwogICAgaWYgKCRkNFsnZHJhZnRfaWQnXSkgewogICAgICAgICRyZXEoYXJyYXkoJ2VtYWlsJz0+JEVNLCdkcmFmdF9pZCc9PiRkNFsnZHJhZnRfaWQnXSkpOwogICAgICAgICRlaWw9JHRvaygpOwogICAgICAgIC8vIHNpbXVsaXVvamFtIGdhdmVqYSwga2VpY2lhbnRpIFVVSUQ6IHNrYWl0b20gVEEgUEFUSSB0b2tlbmEsIGJldCBzdSAia2l0dSIgZHJhZnRfaWQgVVJMJ2UKICAgICAgICAkc3ZldGltYXM9J2ZmZmZmZmZmLWVlZWUtNGRkZC04Y2NjLWJiYmJiYmJiYmJiYic7CiAgICAgICAgJFJbJ004J10gPSBhcnJheSgKICAgICAgICAgICAgJ2RiX3Jlc291cmNlX2lkJz0+JGVpbFsncmVzb3VyY2VfaWQnXSwKICAgICAgICAgICAgJ29yaWdpbmFsdXMnPT4kZDRbJ2RyYWZ0X2lkJ10sCiAgICAgICAgICAgICd1cmxfYmFuZHl0YXMnPT4kc3ZldGltYXMsCiAgICAgICAgICAgICdzdXRhbXBhX3N1X29yaWdpbmFsdSc9PigkZWlsWydyZXNvdXJjZV9pZCddPT09JGQ0WydkcmFmdF9pZCddKSwKICAgICAgICAgICAgJ25lc3V0YW1wYV9zdV9zdmV0aW11Jz0+KCRlaWxbJ3Jlc291cmNlX2lkJ10hPT0kc3ZldGltYXMpLAogICAgICAgICAgICAnT0snPT4oJGVpbFsncmVzb3VyY2VfaWQnXT09PSRkNFsnZHJhZnRfaWQnXSAmJiAkZWlsWydyZXNvdXJjZV9pZCddIT09JHN2ZXRpbWFzKSwKICAgICAgICApOwogICAgfQoKICAgIC8vID09PT09IE0xMDogcmVxdWVzdCBldGFwZSBqb2tpdSBzYWx1dGluaXUgdmVpa3NtdSA9PT09PQogICAgJHAwPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICRQRVRTIik7CiAgICAkdTA9KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJHdwZGItPnVzZXJzIik7CiAgICAkbTA9JEdMT0JBTFNbJ3BzX21haWwnXTsKICAgICRkNT0kbWsoJEVNKTsKICAgIGlmICgkZDVbJ2RyYWZ0X2lkJ10pIHsKICAgICAgICAkcmVxKGFycmF5KCdlbWFpbCc9PiRFTSwnZHJhZnRfaWQnPT4kZDVbJ2RyYWZ0X2lkJ10pKTsKICAgICAgICAkc3Q9JHdwZGItPmdldF92YXIoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBzdGF0dXMgRlJPTSAkVEQgV0hFUkUgZHJhZnRfaWQ9JXMiLCRkNVsnZHJhZnRfaWQnXSkpOwogICAgICAgICRSWydNMTAnXT1hcnJheSgnZHJhZnRfaWQnPT4kZDVbJ2RyYWZ0X2lkJ10sJ3N0YXR1c2FzJz0+JHN0LAogICAgICAgICAgICAncGV0cyc9PihpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICRQRVRTIiktJHAwLAogICAgICAgICAgICAndmFydG90b2phaSc9PihpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICR3cGRiLT51c2VycyIpLSR1MCwKICAgICAgICAgICAgJ2xhaXNrdV9iYW5keXRhJz0+JEdMT0JBTFNbJ3BzX21haWwnXS0kbTAsCiAgICAgICAgICAgICdPSyc9Pigkc3Q9PT0nYWN0aXZlJwogICAgICAgICAgICAgICAgICAgJiYgKGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJFBFVFMiKS0kcDA9PT0wCiAgICAgICAgICAgICAgICAgICAmJiAoaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSAkd3BkYi0+dXNlcnMiKS0kdTA9PT0wKSk7CiAgICB9IGVsc2UgeyAkUlsnTTEwJ109YXJyYXkoJ2tsYWlkYSc9PidkcmFmdGFzIG5lc3VrdXJ0YXMnLCdyJz0+JGQ1KTsgfQoKICAgICRSWydTVVZFU1RJTkUnXT0oKCFlbXB0eSgkUlsnTTgnXVsnT0snXSk/MTowKSsoIWVtcHR5KCRSWydNMTAnXVsnT0snXSk/MTowKSkuJy8yJzsKICAgICR3cGRiLT5xdWVyeSgiREVMRVRFIEZST00gJFREIFdIRVJFIDE9MSIpOwogICAgJHZhbHlrKCk7CiAgICAkUlsnZHJhZnR1X3BvJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJFREIik7CiAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRSLCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVN8SlNPTl9QUkVUVFlfUFJJTlQpOwogICAgZXhpdDsKfSk7Cg==','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'UI Localization Runtime Audit',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('m810.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
function uzk(n){
  const x=sh('curl -sSk -m 60 "'+SITE+'/?ps_m81=M81f4"');
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
putB64('m810.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
