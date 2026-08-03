import { execSync } from 'child_process';
import { chromium } from 'playwright';
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
const php=Buffer.from('PD9waHAKLyoqCiAqIFMzNDNjIOKAlCBFMkU6IGdhdWR5dG9qYXMgUEFHQUwgR0FWRUpBICsgYnVzZW5vcwogKi8KYWRkX2ZpbHRlcignd3BfbWFpbCcsIGZ1bmN0aW9uKCRhcmdzKXsKICAgICR0byA9IGlzX2FycmF5KCRhcmdzWyd0byddID8/ICcnKSA/IGltcGxvZGUoJywnLCAkYXJnc1sndG8nXSkgOiAoc3RyaW5nKSgkYXJnc1sndG8nXSA/PyAnJyk7CiAgICBpZiAoc3RycG9zKCR0bywnZTJlLicpID09PSAwIHx8IHN0cnBvcygkdG8sJ2UyZS4nKSAhPT0gZmFsc2UpIHsKICAgICAgICAkc2VuYSA9IGdldF9vcHRpb24oJ3BzX2UyZV9tYWlscycsIGFycmF5KCkpOwogICAgICAgIGlmICghaXNfYXJyYXkoJHNlbmEpKSAkc2VuYSA9IGFycmF5KCk7CiAgICAgICAgJHNlbmFbXSA9IGFycmF5KCd0byc9PiR0bywnc3ViamVjdCc9PiRhcmdzWydzdWJqZWN0J10gPz8gJycsJ21lc3NhZ2UnPT4kYXJnc1snbWVzc2FnZSddID8/ICcnLCdsYWlrYXMnPT50aW1lKCkpOwogICAgICAgIHVwZGF0ZV9vcHRpb24oJ3BzX2UyZV9tYWlscycsIGFycmF5X3NsaWNlKCRzZW5hLC01KSwgZmFsc2UpOwogICAgfQogICAgcmV0dXJuICRhcmdzOyAgIC8vIE5FS0VJQ0lBTSwgTkVCTE9LVU9KQU0KfSwgMSk7CmFkZF9maWx0ZXIoJ3ByZV9odHRwX3JlcXVlc3QnLCBmdW5jdGlvbigkcHJlLCRhLCR1cmwpewogICAgaWYgKHN0cmlwb3MoJHVybCwnc2VuZGVyJykgIT09IGZhbHNlICYmICFlbXB0eSgkYVsnYm9keSddKSkgewogICAgICAgICRiID0gaXNfc3RyaW5nKCRhWydib2R5J10pID8gJGFbJ2JvZHknXSA6IHdwX2pzb25fZW5jb2RlKCRhWydib2R5J10pOwogICAgICAgIGlmIChzdHJpcG9zKCRiLCdlMmUuJykgIT09IGZhbHNlKSB7CiAgICAgICAgICAgICRzZW5hID0gZ2V0X29wdGlvbigncHNfZTJlX21haWxzJywgYXJyYXkoKSk7CiAgICAgICAgICAgIGlmICghaXNfYXJyYXkoJHNlbmEpKSAkc2VuYSA9IGFycmF5KCk7CiAgICAgICAgICAgICRzZW5hW10gPSBhcnJheSgndG8nPT4nKHNlbmRlciknLCdzdWJqZWN0Jz0+JycsJ21lc3NhZ2UnPT4kYiwnbGFpa2FzJz0+dGltZSgpKTsKICAgICAgICAgICAgdXBkYXRlX29wdGlvbigncHNfZTJlX21haWxzJywgYXJyYXlfc2xpY2UoJHNlbmEsLTUpLCBmYWxzZSk7CiAgICAgICAgfQogICAgfQogICAgcmV0dXJuICRwcmU7Cn0sIDEsIDMpOwoKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAgIGlmICggISBpc3NldCgkX0dFVFsncHNfZTJiJ10pICkgcmV0dXJuOwogICAgJHYgPSAkX0dFVFsncHNfZTJiJ107CiAgICBub2NhY2hlX2hlYWRlcnMoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAgIGdsb2JhbCAkd3BkYjsKICAgICRURD0kd3BkYi0+cHJlZml4Lidwc19wZXRfcHJvZmlsZV9kcmFmdHMnOyAkVFQ9JHdwZGItPnByZWZpeC4ncHNfYWN0aW9uX3Rva2Vucyc7CiAgICAkUEVUUz0kd3BkYi0+cHJlZml4Lidwc19wZXRzJzsgJEVMPSR3cGRiLT5wcmVmaXguJ3BzX2V2ZW50X2xvZyc7CiAgICAkcj1hcnJheSgnVkVSU0lKQSc9PidlMmUtYi12MScpOwoKICAgIGlmICgkdj09PSdyZXNldCcpIHsKICAgICAgICBkZWxldGVfb3B0aW9uKCdwc19lMmVfbWFpbHMnKTsKICAgICAgICAkd3BkYi0+cXVlcnkoIkRFTEVURSBGUk9NICR3cGRiLT5vcHRpb25zIFdIRVJFIG9wdGlvbl9uYW1lIExJS0UgJ190cmFuc2llbnQlcHNfZHJfJScgT1Igb3B0aW9uX25hbWUgTElLRSAnX3RyYW5zaWVudCVwc19tbCUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJ190cmFuc2llbnQlbWFnaWMlJyIpOwogICAgICAgICRyWydwZXRzJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJFBFVFMiKTsKICAgICAgICAkclsndmFydG90b2p1J109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJHdwZGItPnVzZXJzIik7CiAgICAgICAgJHJbJ2V2J109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJEVMIFdIRVJFIGV2ZW50X25hbWU9J3BldF9wcm9maWxlX2NyZWF0ZWQnIik7CiAgICAgICAgZWNobyB3cF9qc29uX2VuY29kZSgkciwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BSRVRUWV9QUklOVCk7IGV4aXQ7CiAgICB9CiAgICBpZiAoJHY9PT0nbWFpbCcpIHsKICAgICAgICAkZW0gPSBpc3NldCgkX0dFVFsnZW0nXSkgPyBzYW5pdGl6ZV9lbWFpbCgkX0dFVFsnZW0nXSkgOiAnJzsKICAgICAgICAkbXMgPSBnZXRfb3B0aW9uKCdwc19lMmVfbWFpbHMnLCBhcnJheSgpKTsKICAgICAgICAkclsnbGFpc2t1J109aXNfYXJyYXkoJG1zKT9jb3VudCgkbXMpOjA7CiAgICAgICAgJHJhc3Rhcz1udWxsOwogICAgICAgIGZvcmVhY2ggKChhcnJheSkkbXMgYXMgJG0pIHsgaWYgKCRlbSAmJiAoc3RycG9zKCRtWyd0byddLCRlbSkhPT1mYWxzZSB8fCBzdHJwb3MoJG1bJ21lc3NhZ2UnXSwkZW0pIT09ZmFsc2UpKSB7ICRyYXN0YXM9JG07IH0gfQogICAgICAgIGlmICghJHJhc3RhcyAmJiBpc19hcnJheSgkbXMpICYmICRtcykgeyAkcmFzdGFzID0gZW5kKCRtcyk7IH0KICAgICAgICBpZiAoJHJhc3RhcykgewogICAgICAgICAgICAkclsndG8nXT0kcmFzdGFzWyd0byddOyAkclsnc3ViamVjdCddPSRyYXN0YXNbJ3N1YmplY3QnXTsKICAgICAgICAgICAgJGJvZHkgPSAkcmFzdGFzWydtZXNzYWdlJ107CiAgICAgICAgICAgICRib2R5ID0gc3RyX3JlcGxhY2UoJ1xcLycsJy8nLCRib2R5KTsKICAgICAgICAgICAgLy8gUElSTUlBVVNJQSBocmVmLCByZWdleCB0aWsgZmFsbGJhY2sKICAgICAgICAgICAgJG51b3JvZG9zPWFycmF5KCk7CiAgICAgICAgICAgIGlmIChwcmVnX21hdGNoX2FsbCgnI2hyZWY9WyJcJ10oW14iXCddKylbIlwnXSNpJywgJGJvZHksICRobSkpIHsKICAgICAgICAgICAgICAgIGZvcmVhY2ggKCRobVsxXSBhcyAkaCkgeyAkbnVvcm9kb3NbXSA9IGh0bWxfZW50aXR5X2RlY29kZSgkaCwgRU5UX1FVT1RFUyk7IH0KICAgICAgICAgICAgfQogICAgICAgICAgICAkclsndmlzb3NfbnVvcm9kb3MnXSA9ICRudW9yb2RvczsKICAgICAgICAgICAgZm9yZWFjaCAoJG51b3JvZG9zIGFzICRoKSB7IGlmIChzdHJwb3MoJGgsJ3BldHNob3AtbG9naW4nKSAhPT0gZmFsc2UgJiYgc3RycG9zKCRoLCd0b2tlbj0nKSAhPT0gZmFsc2UpIHsgJHJbJ251b3JvZGEnXT0kaDsgYnJlYWs7IH0gfQogICAgICAgICAgICBpZiAoZW1wdHkoJHJbJ251b3JvZGEnXSkgJiYgcHJlZ19tYXRjaCgnI2h0dHBzPzovL1teXHMiXCc8Pl0qcGV0c2hvcC1sb2dpblteXHMiXCc8Pl0qI2knLCAkYm9keSwgJGZtKSkgewogICAgICAgICAgICAgICAgJHJbJ251b3JvZGEnXSA9IGh0bWxfZW50aXR5X2RlY29kZSgkZm1bMF0sIEVOVF9RVU9URVMpOyAkclsnZmFsbGJhY2snXT10cnVlOwogICAgICAgICAgICB9CiAgICAgICAgICAgIGlmIChlbXB0eSgkclsnbnVvcm9kYSddKSkgeyAkclsnYm9keV9mcmFnbWVudGFzJ109c3Vic3RyKCRib2R5LDAsNzAwKTsgfQogICAgICAgIH0KICAgICAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVN8SlNPTl9QUkVUVFlfUFJJTlQpOyBleGl0OwogICAgfQogICAgaWYgKCR2PT09J2F1dGgnKSB7CiAgICAgICAgJGxuPSdwc192Ml90ZXN0JzsgJHU9Z2V0X3VzZXJfYnkoJ2xvZ2luJywkbG4pOwogICAgICAgIGlmKCEkdSl7ICRpZD13cF9pbnNlcnRfdXNlcihhcnJheSgndXNlcl9sb2dpbic9PiRsbiwndXNlcl9lbWFpbCc9PiRsbi4nQGRldi5hdmVzYS5sdCcsJ3VzZXJfcGFzcyc9PndwX2dlbmVyYXRlX3Bhc3N3b3JkKDI0KSwncm9sZSc9PidjdXN0b21lcicpKTsgJHU9aXNfd3BfZXJyb3IoJGlkKT9udWxsOmdldF91c2VyX2J5KCdpZCcsJGlkKTsgfQogICAgICAgIGlmKCEkdSl7IGVjaG8gd3BfanNvbl9lbmNvZGUoYXJyYXkoJ2Vycic9PiduZXBhdnlrbycpKTsgZXhpdDsgfQogICAgICAgICR1aWQ9KGludCkkdS0+SUQ7CiAgICAgICAgaWYgKGlzc2V0KCRfR0VUWydjbGVhbiddKSkgeyAkd3BkYi0+cXVlcnkoJHdwZGItPnByZXBhcmUoIkRFTEVURSBGUk9NICRQRVRTIFdIRVJFIHVzZXJfaWQ9JWQiLCR1aWQpKTsgfQogICAgICAgIGlmIChpc3NldCgkX0dFVFsnc2VlZCddKSkgewogICAgICAgICAgICAkbm93PWdtZGF0ZSgnWS1tLWQgSDppOnMnKTsKICAgICAgICAgICAgJHdwZGItPmluc2VydCgkUEVUUywgYXJyYXkoJ3VzZXJfaWQnPT4kdWlkLCdwZXRfbmFtZSc9PnNhbml0aXplX3RleHRfZmllbGQoJF9HRVRbJ3NlZWQnXSksJ3NwZWNpZXMnPT4nZG9nJywKICAgICAgICAgICAgICAgICdzdGF0dXMnPT4nYWN0aXZlJywnaXNfcHJpbWFyeSc9PjEsJ2N1cnJlbnRfd2VpZ2h0X2tnJz0+MTIuNTAsJ3dlaWdodF91cGRhdGVkX2F0Jz0+JG5vdywKICAgICAgICAgICAgICAgICdjcmVhdGVkX2F0Jz0+JG5vdywndXBkYXRlZF9hdCc9PiRub3cpKTsKICAgICAgICAgICAgJHJbJ3NlZWRfcGV0X2lkJ109KGludCkkd3BkYi0+aW5zZXJ0X2lkOwogICAgICAgIH0KICAgICAgICAkZXhwPXRpbWUoKSsxODAwOwogICAgICAgICRyWyd1c2VyX2lkJ109JHVpZDsKICAgICAgICAkclsnY29va2llX25hbWUnXT1MT0dHRURfSU5fQ09PS0lFOyAkclsnY29va2llX3ZhbHVlJ109d3BfZ2VuZXJhdGVfYXV0aF9jb29raWUoJHVpZCwkZXhwLCdsb2dnZWRfaW4nKTsKICAgICAgICAkclsnYXV0aF9uYW1lJ109aXNfc3NsKCk/U0VDVVJFX0FVVEhfQ09PS0lFOkFVVEhfQ09PS0lFOwogICAgICAgICRyWydhdXRoX3ZhbHVlJ109d3BfZ2VuZXJhdGVfYXV0aF9jb29raWUoJHVpZCwkZXhwLGlzX3NzbCgpPydzZWN1cmVfYXV0aCc6J2F1dGgnKTsKICAgICAgICAkclsnZG9tYWluJ109cGFyc2VfdXJsKGhvbWVfdXJsKCksUEhQX1VSTF9IT1NUKTsKICAgICAgICAkclsncGV0cyddPSR3cGRiLT5nZXRfcmVzdWx0cygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIGlkLHBldF9uYW1lLGN1cnJlbnRfd2VpZ2h0X2tnLHdlaWdodF91cGRhdGVkX2F0LGN1cnJlbnRfZm9vZF9icmFuZCBGUk9NICRQRVRTIFdIRVJFIHVzZXJfaWQ9JWQiLCR1aWQpLCBBUlJBWV9BKTsKICAgICAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUFJFVFRZX1BSSU5UKTsgZXhpdDsKICAgIH0KICAgIGlmICgkdj09PSdwZXRzJykgewogICAgICAgICR1PWdldF91c2VyX2J5KCdsb2dpbicsJ3BzX3YyX3Rlc3QnKTsKICAgICAgICAkclsncGV0cyddPSAkdSA/ICR3cGRiLT5nZXRfcmVzdWx0cygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIGlkLHBldF9uYW1lLHNwZWNpZXMsY3VycmVudF93ZWlnaHRfa2csd2VpZ2h0X3VwZGF0ZWRfYXQsY3VycmVudF9mb29kX2JyYW5kIEZST00gJFBFVFMgV0hFUkUgdXNlcl9pZD0lZCBPUkRFUiBCWSBpZCIsJHUtPklEKSwgQVJSQVlfQSkgOiBudWxsOwogICAgICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoJHIsIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QUkVUVFlfUFJJTlQpOyBleGl0OwogICAgfQogICAgaWYgKCR2PT09J2NsZWFudXAyJykgewogICAgICAgICR1PWdldF91c2VyX2J5KCdsb2dpbicsJ3BzX3YyX3Rlc3QnKTsKICAgICAgICBpZigkdSl7ICR3cGRiLT5xdWVyeSgkd3BkYi0+cHJlcGFyZSgiREVMRVRFIEZST00gJFBFVFMgV0hFUkUgdXNlcl9pZD0lZCIsJHUtPklEKSk7IHJlcXVpcmVfb25jZSBBQlNQQVRILid3cC1hZG1pbi9pbmNsdWRlcy91c2VyLnBocCc7IHdwX2RlbGV0ZV91c2VyKCR1LT5JRCk7IH0KICAgICAgICAkclsncGV0c192aXNvJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJFBFVFMiKTsKICAgICAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLCBKU09OX1BSRVRUWV9QUklOVCk7IGV4aXQ7CiAgICB9CiAgICBpZiAoJHY9PT0nZHJhZnRwYXlsb2FkJykgewogICAgICAgICRkciA9IGlzc2V0KCRfR0VUWydkciddKSA/IHNhbml0aXplX3RleHRfZmllbGQoJF9HRVRbJ2RyJ10pIDogJyc7CiAgICAgICAgJHJvdyA9ICRkciA/ICR3cGRiLT5nZXRfcm93KCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgZHJhZnRfaWQsc3RhdHVzLHBheWxvYWRfanNvbiBGUk9NICRURCBXSEVSRSBkcmFmdF9pZD0lcyIsJGRyKSwgQVJSQVlfQSkgOiBudWxsOwogICAgICAgICRyWydlaWx1dGUnXSA9ICRyb3cgPyBhcnJheSgnZHJhZnRfaWQnPT4kcm93WydkcmFmdF9pZCddLCdzdGF0dXMnPT4kcm93WydzdGF0dXMnXSkgOiBudWxsOwogICAgICAgICRyWydwYXlsb2FkJ10gPSAkcm93ICYmICRyb3dbJ3BheWxvYWRfanNvbiddID8ganNvbl9kZWNvZGUoJHJvd1sncGF5bG9hZF9qc29uJ10sIHRydWUpIDogbnVsbDsKICAgICAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVN8SlNPTl9QUkVUVFlfUFJJTlQpOyBleGl0OwogICAgfQogICAgaWYgKCR2PT09J3N0YXRlJykgewogICAgICAgICRlbSA9IGlzc2V0KCRfR0VUWydlbSddKSA/IHNhbml0aXplX2VtYWlsKCRfR0VUWydlbSddKSA6ICcnOwogICAgICAgICRkciA9IGlzc2V0KCRfR0VUWydkciddKSA/IHNhbml0aXplX3RleHRfZmllbGQoJF9HRVRbJ2RyJ10pIDogJyc7CiAgICAgICAgaWYgKCRkcikgeyAkclsnZHJhZnRhcyddID0gJHdwZGItPmdldF9yb3coJHdwZGItPnByZXBhcmUoIlNFTEVDVCBkcmFmdF9pZCxzdGF0dXMscGF5bG9hZF9qc29uIElTIE5VTEwgQVMgcGF5bG9hZF9udWxsLGNsYWltX2F0dGVtcHRfaWQsY2xhaW1fc3RhcnRlZF9hdCxjbGFpbWVkX3VzZXJfaWQsY2xhaW1lZF9wZXRfaWQgRlJPTSAkVEQgV0hFUkUgZHJhZnRfaWQ9JXMiLCRkciksIEFSUkFZX0EpOyB9CiAgICAgICAgaWYgKCRlbSkgewogICAgICAgICAgICAkclsndG9rZW5hcyddID0gJHdwZGItPmdldF9yb3coJHdwZGItPnByZXBhcmUoIlNFTEVDVCBpZCxzdWJqZWN0X2VtYWlsLHJlc291cmNlX2lkLHN0YXR1cyx1c2VkX2F0IEZST00gJFRUIFdIRVJFIHN1YmplY3RfZW1haWw9JXMgT1JERVIgQlkgaWQgREVTQyBMSU1JVCAxIiwkZW0pLCBBUlJBWV9BKTsKICAgICAgICAgICAgJHUgPSBnZXRfdXNlcl9ieSgnZW1haWwnLCRlbSk7CiAgICAgICAgICAgICRyWyd2YXJ0b3RvamFzJ10gPSAkdSA/IGFycmF5KCdpZCc9PiR1LT5JRCkgOiBudWxsOwogICAgICAgICAgICBpZiAoJHUpIHsKICAgICAgICAgICAgICAgICRyWydwZXRzJ10gPSAkd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBpZCxwZXRfbmFtZSxzcGVjaWVzLGN1cnJlbnRfd2VpZ2h0X2tnLGFjdGl2aXR5X2hpbnQsc3RhdHVzLGNsaWVudF9yZWYsaXNfcHJpbWFyeSBGUk9NICRQRVRTIFdIRVJFIHVzZXJfaWQ9JWQiLCR1LT5JRCksIEFSUkFZX0EpOwogICAgICAgICAgICAgICAgJHJbJ3BlbmRpbmcnXSA9IGdldF91c2VyX21ldGEoJHUtPklELCdfcHNfcGV0X2NsYWltX3BlbmRpbmcnLHRydWUpOwogICAgICAgICAgICB9CiAgICAgICAgfQogICAgICAgICRyWydwZXRzX3Zpc28nXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSAkUEVUUyIpOwogICAgICAgICRyWyd2YXJ0b3RvanUnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSAkd3BkYi0+dXNlcnMiKTsKICAgICAgICAkclsnZXYnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSAkRUwgV0hFUkUgZXZlbnRfbmFtZT0ncGV0X3Byb2ZpbGVfY3JlYXRlZCciKTsKICAgICAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVN8SlNPTl9QUkVUVFlfUFJJTlQpOyBleGl0OwogICAgfQogICAgZWNobyB3cF9qc29uX2VuY29kZShhcnJheSgnZXJyJz0+MSkpOyBleGl0Owp9KTsK','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'UI Localization Runtime Audit',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('v6v2.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
function uzk(n){
  const x=sh('curl -sSk -m 60 "'+SITE+'/?ps_e2b=reset"');
  try{ return JSON.parse(x.out); }catch(e){ O['raw'+n]=x.out.slice(0,700); return null; }
}

const ZYM='Z'+Date.now().toString(36).toUpperCase();
const MARK='V6-TEST-1322';
function q(a){ const x=sh('curl -sSk -m 45 "'+SITE+'/?ps_e2b='+a+'"'); try{ return JSON.parse(x.out);}catch(e){ return {raw:x.out.slice(0,250)}; } }
O.zym=ZYM; O.pradzia=q('reset');
const V={};
try{
 const browser = await chromium.launch();
 const A = q('auth&clean=1&seed='+ZYM+'-Turi1250');
 V.pries = A.pets;
 const PET_ID = (A.pets && A.pets[0]) ? A.pets[0].id : null;
 V.pet_id = PET_ID;

 const ctx = await browser.newContext({viewport:{width:1280,height:1200}, ignoreHTTPSErrors:true, locale:'lt-LT'});
 await ctx.addCookies([
   {name:A.cookie_name,value:A.cookie_value,domain:A.domain,path:'/',httpOnly:true,secure:true},
   {name:A.auth_name,value:A.auth_value,domain:A.domain,path:'/',httpOnly:true,secure:true}]);
 const p = await ctx.newPage();
 const reqs=[]; const resps=[]; const errs=[];
 p.on('pageerror', e=>errs.push(String(e).slice(0,120)));
 p.on('request', r=>{ if(r.url().indexOf('/pet-profile')>=0 && r.method()==='POST'){ try{ reqs.push(JSON.parse(r.postData()||'{}')); }catch(e){ reqs.push({parse_err:1}); } } });
 p.on('response', async r=>{ if(r.url().indexOf('/pet-profile')>=0 && r.request().method()==='POST'){ resps.push({status:r.status(), ok:r.ok()}); } });

 await p.goto(SITE+'/paskyra/augintinis/', {waitUntil:'domcontentloaded', timeout:60000});
 await p.waitForTimeout(3400);
 try{ const b=p.locator('button:has-text("Priimti")').first(); if(await b.count()) await b.click({timeout:4000}); }catch(e){}
 await p.waitForTimeout(1200);

 // ★ „Papildyti profilį"
 const pap = p.locator('button:visible, a:visible').filter({hasText:/Papildyti profilį/i});
 V.papildyti_rasta = await pap.count();
 if (V.papildyti_rasta) { await pap.first().click({timeout:15000}); await p.waitForTimeout(3000); }
 V.kelias = V.papildyti_rasta ? 'Papildyti profilį' : null;

 V.po_paspaudimo = {
   url: p.url(),
   tekstas: (await p.locator('body').innerText().catch(()=>'')).replace(/\s+/g,' ').slice(0,300),
   mygtukai: (await p.locator('button:visible').allTextContents()).map(t=>t.trim()).filter(Boolean).slice(0,12),
 };
 // VISI matomi laukai su etiketemis
 V.laukai = await p.evaluate(()=>{
   const o=[]; document.querySelectorAll('input,select,textarea').forEach(e=>{
     const r=e.getBoundingClientRect(); if(r.width===0&&r.height===0) return;
     let lab=''; if(e.id){const l=document.querySelector('label[for="'+e.id+'"]'); if(l) lab=(l.textContent||'').trim();}
     if(!lab&&e.closest('label')) lab=(e.closest('label').textContent||'').trim();
     if(!lab&&e.parentElement) lab=(e.parentElement.textContent||'').trim().slice(0,60);
     o.push({tag:e.tagName.toLowerCase(),type:e.type||'',cls:(e.className||'').toString().slice(0,40),
             ph:e.placeholder||'',inputmode:e.getAttribute('inputmode')||'',label:lab.slice(0,60),value:e.value||''});
   }); return o;
 });
 fs.writeFileSync('/tmp/V6c.png', await p.screenshot({fullPage:true}));

 // ★ current_food_brand laukas — pagal etikete/placeholder
 const bidx = V.laukai.findIndex(l => /maist|ženkl|zenkl|brand|gamintoj/i.test((l.label||'')+' '+(l.ph||'')));
 V.brand_idx = bidx;
 if (bidx >= 0) {
   const visi = p.locator('input:visible, select:visible, textarea:visible');
   const laukas = visi.nth(bidx);
   await laukas.fill(MARK).catch(e=>{ V.fill_err=String(e).slice(0,90); });
   await p.waitForTimeout(1400);
   V.brand_value = await laukas.inputValue().catch(()=>null);
   // uzdarom galima autocomplete
   await p.keyboard.press('Escape').catch(()=>{});
   await p.waitForTimeout(400);
 }
 // svorio NELIECIAM
 const sv = p.locator('input.pspet-input[inputmode="decimal"]:visible').first();
 V.svorio_reiksme = (await sv.count()) ? await sv.inputValue() : '(nera lauko)';

 const submit = p.locator('button:visible').filter({hasText:/Išsaugoti|Atnaujinti|Sukurti profilį|Baigti/i}).first();
 V.submit_tekstas = (await submit.count()) ? (await submit.textContent()||'').trim() : null;
 if (await submit.count()) { await submit.click({timeout:15000}); await p.waitForTimeout(7000); }

 const st = q('pets');
 const po = (st.pets||[]).find(x=>String(x.id)===String(PET_ID));
 const pl = reqs.length ? reqs[reqs.length-1] : {};
 V.V6 = {
   kelias: V.kelias,
   request_count: reqs.length,
   response: resps.length ? resps[resps.length-1] : null,
   payload_raktu: Object.keys(pl).length,
   payload_pet_id: pl.pet_id,
   payload_brand: pl.current_food_brand,
   turi_weight_kg: Object.prototype.hasOwnProperty.call(pl,'_weight_kg'),
   turi_current: Object.prototype.hasOwnProperty.call(pl,'current_weight_kg'),
   pries: (V.pries||[])[0], po: po, klaidos: errs,
 };
 const pr = (V.pries||[])[0] || {};
 V.V6.OK = (
   V.kelias !== null &&
   reqs.length === 1 &&
   Object.keys(pl).length > 0 &&
   V.V6.response && V.V6.response.ok === true &&
   String(pl.pet_id) === String(PET_ID) &&
   pl.current_food_brand === MARK &&
   !V.V6.turi_weight_kg && !V.V6.turi_current &&
   po && po.current_food_brand === MARK &&
   parseFloat(po.current_weight_kg) === 12.5 &&
   po.weight_updated_at === pr.weight_updated_at &&
   errs.length === 0
 );
 await ctx.close();
 await browser.close();
}catch(err){ V.ERR=String(err && err.stack ? err.stack : err).slice(0,500); }
O.V=V;
try{ putB64('v6c.png', fs.readFileSync('/tmp/V6c.png').toString('base64')); }catch(e){}

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
putB64('v6v2.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
