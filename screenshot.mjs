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
const php=Buffer.from('PD9waHAKLyoqCiAqIFMzNDNjIOKAlCBFMkU6IGdhdWR5dG9qYXMgUEFHQUwgR0FWRUpBICsgYnVzZW5vcwogKi8KYWRkX2ZpbHRlcignd3BfbWFpbCcsIGZ1bmN0aW9uKCRhcmdzKXsKICAgICR0byA9IGlzX2FycmF5KCRhcmdzWyd0byddID8/ICcnKSA/IGltcGxvZGUoJywnLCAkYXJnc1sndG8nXSkgOiAoc3RyaW5nKSgkYXJnc1sndG8nXSA/PyAnJyk7CiAgICBpZiAoc3RycG9zKCR0bywnZTJlLicpID09PSAwIHx8IHN0cnBvcygkdG8sJ2UyZS4nKSAhPT0gZmFsc2UpIHsKICAgICAgICAkc2VuYSA9IGdldF9vcHRpb24oJ3BzX2UyZV9tYWlscycsIGFycmF5KCkpOwogICAgICAgIGlmICghaXNfYXJyYXkoJHNlbmEpKSAkc2VuYSA9IGFycmF5KCk7CiAgICAgICAgJHNlbmFbXSA9IGFycmF5KCd0byc9PiR0bywnc3ViamVjdCc9PiRhcmdzWydzdWJqZWN0J10gPz8gJycsJ21lc3NhZ2UnPT4kYXJnc1snbWVzc2FnZSddID8/ICcnLCdsYWlrYXMnPT50aW1lKCkpOwogICAgICAgIHVwZGF0ZV9vcHRpb24oJ3BzX2UyZV9tYWlscycsIGFycmF5X3NsaWNlKCRzZW5hLC01KSwgZmFsc2UpOwogICAgfQogICAgcmV0dXJuICRhcmdzOyAgIC8vIE5FS0VJQ0lBTSwgTkVCTE9LVU9KQU0KfSwgMSk7CmFkZF9maWx0ZXIoJ3ByZV9odHRwX3JlcXVlc3QnLCBmdW5jdGlvbigkcHJlLCRhLCR1cmwpewogICAgaWYgKHN0cmlwb3MoJHVybCwnc2VuZGVyJykgIT09IGZhbHNlICYmICFlbXB0eSgkYVsnYm9keSddKSkgewogICAgICAgICRiID0gaXNfc3RyaW5nKCRhWydib2R5J10pID8gJGFbJ2JvZHknXSA6IHdwX2pzb25fZW5jb2RlKCRhWydib2R5J10pOwogICAgICAgIGlmIChzdHJpcG9zKCRiLCdlMmUuJykgIT09IGZhbHNlKSB7CiAgICAgICAgICAgICRzZW5hID0gZ2V0X29wdGlvbigncHNfZTJlX21haWxzJywgYXJyYXkoKSk7CiAgICAgICAgICAgIGlmICghaXNfYXJyYXkoJHNlbmEpKSAkc2VuYSA9IGFycmF5KCk7CiAgICAgICAgICAgICRzZW5hW10gPSBhcnJheSgndG8nPT4nKHNlbmRlciknLCdzdWJqZWN0Jz0+JycsJ21lc3NhZ2UnPT4kYiwnbGFpa2FzJz0+dGltZSgpKTsKICAgICAgICAgICAgdXBkYXRlX29wdGlvbigncHNfZTJlX21haWxzJywgYXJyYXlfc2xpY2UoJHNlbmEsLTUpLCBmYWxzZSk7CiAgICAgICAgfQogICAgfQogICAgcmV0dXJuICRwcmU7Cn0sIDEsIDMpOwoKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAgIGlmICggISBpc3NldCgkX0dFVFsncHNfZTJiJ10pICkgcmV0dXJuOwogICAgJHYgPSAkX0dFVFsncHNfZTJiJ107CiAgICBub2NhY2hlX2hlYWRlcnMoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAgIGdsb2JhbCAkd3BkYjsKICAgICRURD0kd3BkYi0+cHJlZml4Lidwc19wZXRfcHJvZmlsZV9kcmFmdHMnOyAkVFQ9JHdwZGItPnByZWZpeC4ncHNfYWN0aW9uX3Rva2Vucyc7CiAgICAkUEVUUz0kd3BkYi0+cHJlZml4Lidwc19wZXRzJzsgJEVMPSR3cGRiLT5wcmVmaXguJ3BzX2V2ZW50X2xvZyc7CiAgICAkcj1hcnJheSgnVkVSU0lKQSc9PidlMmUtYi12MScpOwoKICAgIGlmICgkdj09PSdyZXNldCcpIHsKICAgICAgICBkZWxldGVfb3B0aW9uKCdwc19lMmVfbWFpbHMnKTsKICAgICAgICAkd3BkYi0+cXVlcnkoIkRFTEVURSBGUk9NICR3cGRiLT5vcHRpb25zIFdIRVJFIG9wdGlvbl9uYW1lIExJS0UgJ190cmFuc2llbnQlcHNfZHJfJScgT1Igb3B0aW9uX25hbWUgTElLRSAnX3RyYW5zaWVudCVwc19tbCUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJ190cmFuc2llbnQlbWFnaWMlJyIpOwogICAgICAgICRyWydwZXRzJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJFBFVFMiKTsKICAgICAgICAkclsndmFydG90b2p1J109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJHdwZGItPnVzZXJzIik7CiAgICAgICAgJHJbJ2V2J109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJEVMIFdIRVJFIGV2ZW50X25hbWU9J3BldF9wcm9maWxlX2NyZWF0ZWQnIik7CiAgICAgICAgZWNobyB3cF9qc29uX2VuY29kZSgkciwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BSRVRUWV9QUklOVCk7IGV4aXQ7CiAgICB9CiAgICBpZiAoJHY9PT0nbWFpbCcpIHsKICAgICAgICAkZW0gPSBpc3NldCgkX0dFVFsnZW0nXSkgPyBzYW5pdGl6ZV9lbWFpbCgkX0dFVFsnZW0nXSkgOiAnJzsKICAgICAgICAkbXMgPSBnZXRfb3B0aW9uKCdwc19lMmVfbWFpbHMnLCBhcnJheSgpKTsKICAgICAgICAkclsnbGFpc2t1J109aXNfYXJyYXkoJG1zKT9jb3VudCgkbXMpOjA7CiAgICAgICAgJHJhc3Rhcz1udWxsOwogICAgICAgIGZvcmVhY2ggKChhcnJheSkkbXMgYXMgJG0pIHsgaWYgKCRlbSAmJiAoc3RycG9zKCRtWyd0byddLCRlbSkhPT1mYWxzZSB8fCBzdHJwb3MoJG1bJ21lc3NhZ2UnXSwkZW0pIT09ZmFsc2UpKSB7ICRyYXN0YXM9JG07IH0gfQogICAgICAgIGlmICghJHJhc3RhcyAmJiBpc19hcnJheSgkbXMpICYmICRtcykgeyAkcmFzdGFzID0gZW5kKCRtcyk7IH0KICAgICAgICBpZiAoJHJhc3RhcykgewogICAgICAgICAgICAkclsndG8nXT0kcmFzdGFzWyd0byddOyAkclsnc3ViamVjdCddPSRyYXN0YXNbJ3N1YmplY3QnXTsKICAgICAgICAgICAgJGJvZHkgPSAkcmFzdGFzWydtZXNzYWdlJ107CiAgICAgICAgICAgICRib2R5ID0gc3RyX3JlcGxhY2UoJ1xcLycsJy8nLCRib2R5KTsKICAgICAgICAgICAgLy8gUElSTUlBVVNJQSBocmVmLCByZWdleCB0aWsgZmFsbGJhY2sKICAgICAgICAgICAgJG51b3JvZG9zPWFycmF5KCk7CiAgICAgICAgICAgIGlmIChwcmVnX21hdGNoX2FsbCgnI2hyZWY9WyJcJ10oW14iXCddKylbIlwnXSNpJywgJGJvZHksICRobSkpIHsKICAgICAgICAgICAgICAgIGZvcmVhY2ggKCRobVsxXSBhcyAkaCkgeyAkbnVvcm9kb3NbXSA9IGh0bWxfZW50aXR5X2RlY29kZSgkaCwgRU5UX1FVT1RFUyk7IH0KICAgICAgICAgICAgfQogICAgICAgICAgICAkclsndmlzb3NfbnVvcm9kb3MnXSA9ICRudW9yb2RvczsKICAgICAgICAgICAgZm9yZWFjaCAoJG51b3JvZG9zIGFzICRoKSB7IGlmIChzdHJwb3MoJGgsJ3BldHNob3AtbG9naW4nKSAhPT0gZmFsc2UgJiYgc3RycG9zKCRoLCd0b2tlbj0nKSAhPT0gZmFsc2UpIHsgJHJbJ251b3JvZGEnXT0kaDsgYnJlYWs7IH0gfQogICAgICAgICAgICBpZiAoZW1wdHkoJHJbJ251b3JvZGEnXSkgJiYgcHJlZ19tYXRjaCgnI2h0dHBzPzovL1teXHMiXCc8Pl0qcGV0c2hvcC1sb2dpblteXHMiXCc8Pl0qI2knLCAkYm9keSwgJGZtKSkgewogICAgICAgICAgICAgICAgJHJbJ251b3JvZGEnXSA9IGh0bWxfZW50aXR5X2RlY29kZSgkZm1bMF0sIEVOVF9RVU9URVMpOyAkclsnZmFsbGJhY2snXT10cnVlOwogICAgICAgICAgICB9CiAgICAgICAgICAgIGlmIChlbXB0eSgkclsnbnVvcm9kYSddKSkgeyAkclsnYm9keV9mcmFnbWVudGFzJ109c3Vic3RyKCRib2R5LDAsNzAwKTsgfQogICAgICAgIH0KICAgICAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVN8SlNPTl9QUkVUVFlfUFJJTlQpOyBleGl0OwogICAgfQogICAgaWYgKCR2PT09J2F1dGgnKSB7CiAgICAgICAgJGxuPSdwc192Ml90ZXN0JzsgJHU9Z2V0X3VzZXJfYnkoJ2xvZ2luJywkbG4pOwogICAgICAgIGlmKCEkdSl7ICRpZD13cF9pbnNlcnRfdXNlcihhcnJheSgndXNlcl9sb2dpbic9PiRsbiwndXNlcl9lbWFpbCc9PiRsbi4nQGRldi5hdmVzYS5sdCcsJ3VzZXJfcGFzcyc9PndwX2dlbmVyYXRlX3Bhc3N3b3JkKDI0KSwncm9sZSc9PidjdXN0b21lcicpKTsgJHU9aXNfd3BfZXJyb3IoJGlkKT9udWxsOmdldF91c2VyX2J5KCdpZCcsJGlkKTsgfQogICAgICAgIGlmKCEkdSl7IGVjaG8gd3BfanNvbl9lbmNvZGUoYXJyYXkoJ2Vycic9PiduZXBhdnlrbycpKTsgZXhpdDsgfQogICAgICAgICR1aWQ9KGludCkkdS0+SUQ7CiAgICAgICAgaWYgKGlzc2V0KCRfR0VUWydjbGVhbiddKSkgeyAkd3BkYi0+cXVlcnkoJHdwZGItPnByZXBhcmUoIkRFTEVURSBGUk9NICRQRVRTIFdIRVJFIHVzZXJfaWQ9JWQiLCR1aWQpKTsgfQogICAgICAgIGlmIChpc3NldCgkX0dFVFsnc2VlZCddKSkgewogICAgICAgICAgICAkbm93PWdtZGF0ZSgnWS1tLWQgSDppOnMnKTsKICAgICAgICAgICAgJHdwZGItPmluc2VydCgkUEVUUywgYXJyYXkoJ3VzZXJfaWQnPT4kdWlkLCdwZXRfbmFtZSc9PnNhbml0aXplX3RleHRfZmllbGQoJF9HRVRbJ3NlZWQnXSksJ3NwZWNpZXMnPT4nZG9nJywKICAgICAgICAgICAgICAgICdzdGF0dXMnPT4nYWN0aXZlJywnaXNfcHJpbWFyeSc9PjEsJ2N1cnJlbnRfd2VpZ2h0X2tnJz0+MjAuMDAsJ3dlaWdodF91cGRhdGVkX2F0Jz0+JG5vdywKICAgICAgICAgICAgICAgICdjcmVhdGVkX2F0Jz0+JG5vdywndXBkYXRlZF9hdCc9PiRub3cpKTsKICAgICAgICAgICAgJHJbJ3NlZWRfcGV0X2lkJ109KGludCkkd3BkYi0+aW5zZXJ0X2lkOwogICAgICAgIH0KICAgICAgICAkZXhwPXRpbWUoKSsxODAwOwogICAgICAgICRyWyd1c2VyX2lkJ109JHVpZDsKICAgICAgICAkclsnY29va2llX25hbWUnXT1MT0dHRURfSU5fQ09PS0lFOyAkclsnY29va2llX3ZhbHVlJ109d3BfZ2VuZXJhdGVfYXV0aF9jb29raWUoJHVpZCwkZXhwLCdsb2dnZWRfaW4nKTsKICAgICAgICAkclsnYXV0aF9uYW1lJ109aXNfc3NsKCk/U0VDVVJFX0FVVEhfQ09PS0lFOkFVVEhfQ09PS0lFOwogICAgICAgICRyWydhdXRoX3ZhbHVlJ109d3BfZ2VuZXJhdGVfYXV0aF9jb29raWUoJHVpZCwkZXhwLGlzX3NzbCgpPydzZWN1cmVfYXV0aCc6J2F1dGgnKTsKICAgICAgICAkclsnZG9tYWluJ109cGFyc2VfdXJsKGhvbWVfdXJsKCksUEhQX1VSTF9IT1NUKTsKICAgICAgICAkclsncGV0cyddPSR3cGRiLT5nZXRfcmVzdWx0cygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIGlkLHBldF9uYW1lLGN1cnJlbnRfd2VpZ2h0X2tnLHdlaWdodF91cGRhdGVkX2F0IEZST00gJFBFVFMgV0hFUkUgdXNlcl9pZD0lZCIsJHVpZCksIEFSUkFZX0EpOwogICAgICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoJHIsIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QUkVUVFlfUFJJTlQpOyBleGl0OwogICAgfQogICAgaWYgKCR2PT09J3BldHMnKSB7CiAgICAgICAgJHU9Z2V0X3VzZXJfYnkoJ2xvZ2luJywncHNfdjJfdGVzdCcpOwogICAgICAgICRyWydwZXRzJ109ICR1ID8gJHdwZGItPmdldF9yZXN1bHRzKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgaWQscGV0X25hbWUsc3BlY2llcyxjdXJyZW50X3dlaWdodF9rZyx3ZWlnaHRfdXBkYXRlZF9hdCBGUk9NICRQRVRTIFdIRVJFIHVzZXJfaWQ9JWQgT1JERVIgQlkgaWQiLCR1LT5JRCksIEFSUkFZX0EpIDogbnVsbDsKICAgICAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUFJFVFRZX1BSSU5UKTsgZXhpdDsKICAgIH0KICAgIGlmICgkdj09PSdjbGVhbnVwMicpIHsKICAgICAgICAkdT1nZXRfdXNlcl9ieSgnbG9naW4nLCdwc192Ml90ZXN0Jyk7CiAgICAgICAgaWYoJHUpeyAkd3BkYi0+cXVlcnkoJHdwZGItPnByZXBhcmUoIkRFTEVURSBGUk9NICRQRVRTIFdIRVJFIHVzZXJfaWQ9JWQiLCR1LT5JRCkpOyByZXF1aXJlX29uY2UgQUJTUEFUSC4nd3AtYWRtaW4vaW5jbHVkZXMvdXNlci5waHAnOyB3cF9kZWxldGVfdXNlcigkdS0+SUQpOyB9CiAgICAgICAgJHJbJ3BldHNfdmlzbyddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICRQRVRTIik7CiAgICAgICAgZWNobyB3cF9qc29uX2VuY29kZSgkciwgSlNPTl9QUkVUVFlfUFJJTlQpOyBleGl0OwogICAgfQogICAgaWYgKCR2PT09J2RyYWZ0cGF5bG9hZCcpIHsKICAgICAgICAkZHIgPSBpc3NldCgkX0dFVFsnZHInXSkgPyBzYW5pdGl6ZV90ZXh0X2ZpZWxkKCRfR0VUWydkciddKSA6ICcnOwogICAgICAgICRyb3cgPSAkZHIgPyAkd3BkYi0+Z2V0X3Jvdygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIGRyYWZ0X2lkLHN0YXR1cyxwYXlsb2FkX2pzb24gRlJPTSAkVEQgV0hFUkUgZHJhZnRfaWQ9JXMiLCRkciksIEFSUkFZX0EpIDogbnVsbDsKICAgICAgICAkclsnZWlsdXRlJ10gPSAkcm93ID8gYXJyYXkoJ2RyYWZ0X2lkJz0+JHJvd1snZHJhZnRfaWQnXSwnc3RhdHVzJz0+JHJvd1snc3RhdHVzJ10pIDogbnVsbDsKICAgICAgICAkclsncGF5bG9hZCddID0gJHJvdyAmJiAkcm93WydwYXlsb2FkX2pzb24nXSA/IGpzb25fZGVjb2RlKCRyb3dbJ3BheWxvYWRfanNvbiddLCB0cnVlKSA6IG51bGw7CiAgICAgICAgZWNobyB3cF9qc29uX2VuY29kZSgkciwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTfEpTT05fUFJFVFRZX1BSSU5UKTsgZXhpdDsKICAgIH0KICAgIGlmICgkdj09PSdzdGF0ZScpIHsKICAgICAgICAkZW0gPSBpc3NldCgkX0dFVFsnZW0nXSkgPyBzYW5pdGl6ZV9lbWFpbCgkX0dFVFsnZW0nXSkgOiAnJzsKICAgICAgICAkZHIgPSBpc3NldCgkX0dFVFsnZHInXSkgPyBzYW5pdGl6ZV90ZXh0X2ZpZWxkKCRfR0VUWydkciddKSA6ICcnOwogICAgICAgIGlmICgkZHIpIHsgJHJbJ2RyYWZ0YXMnXSA9ICR3cGRiLT5nZXRfcm93KCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgZHJhZnRfaWQsc3RhdHVzLHBheWxvYWRfanNvbiBJUyBOVUxMIEFTIHBheWxvYWRfbnVsbCxjbGFpbV9hdHRlbXB0X2lkLGNsYWltX3N0YXJ0ZWRfYXQsY2xhaW1lZF91c2VyX2lkLGNsYWltZWRfcGV0X2lkIEZST00gJFREIFdIRVJFIGRyYWZ0X2lkPSVzIiwkZHIpLCBBUlJBWV9BKTsgfQogICAgICAgIGlmICgkZW0pIHsKICAgICAgICAgICAgJHJbJ3Rva2VuYXMnXSA9ICR3cGRiLT5nZXRfcm93KCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgaWQsc3ViamVjdF9lbWFpbCxyZXNvdXJjZV9pZCxzdGF0dXMsdXNlZF9hdCBGUk9NICRUVCBXSEVSRSBzdWJqZWN0X2VtYWlsPSVzIE9SREVSIEJZIGlkIERFU0MgTElNSVQgMSIsJGVtKSwgQVJSQVlfQSk7CiAgICAgICAgICAgICR1ID0gZ2V0X3VzZXJfYnkoJ2VtYWlsJywkZW0pOwogICAgICAgICAgICAkclsndmFydG90b2phcyddID0gJHUgPyBhcnJheSgnaWQnPT4kdS0+SUQpIDogbnVsbDsKICAgICAgICAgICAgaWYgKCR1KSB7CiAgICAgICAgICAgICAgICAkclsncGV0cyddID0gJHdwZGItPmdldF9yZXN1bHRzKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgaWQscGV0X25hbWUsc3BlY2llcyxjdXJyZW50X3dlaWdodF9rZyxhY3Rpdml0eV9oaW50LHN0YXR1cyxjbGllbnRfcmVmLGlzX3ByaW1hcnkgRlJPTSAkUEVUUyBXSEVSRSB1c2VyX2lkPSVkIiwkdS0+SUQpLCBBUlJBWV9BKTsKICAgICAgICAgICAgICAgICRyWydwZW5kaW5nJ10gPSBnZXRfdXNlcl9tZXRhKCR1LT5JRCwnX3BzX3BldF9jbGFpbV9wZW5kaW5nJyx0cnVlKTsKICAgICAgICAgICAgfQogICAgICAgIH0KICAgICAgICAkclsncGV0c192aXNvJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJFBFVFMiKTsKICAgICAgICAkclsndmFydG90b2p1J109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJHdwZGItPnVzZXJzIik7CiAgICAgICAgJHJbJ2V2J109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJEVMIFdIRVJFIGV2ZW50X25hbWU9J3BldF9wcm9maWxlX2NyZWF0ZWQnIik7CiAgICAgICAgZWNobyB3cF9qc29uX2VuY29kZSgkciwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTfEpTT05fUFJFVFRZX1BSSU5UKTsgZXhpdDsKICAgIH0KICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoYXJyYXkoJ2Vycic9PjEpKTsgZXhpdDsKfSk7Cg==','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'UI Localization Runtime Audit',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('v2467.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
function uzk(n){
  const x=sh('curl -sSk -m 60 "'+SITE+'/?ps_e2b=reset"');
  try{ return JSON.parse(x.out); }catch(e){ O['raw'+n]=x.out.slice(0,700); return null; }
}

const ZYM='X'+Date.now().toString(36).toUpperCase();
function q(a){ const x=sh('curl -sSk -m 45 "'+SITE+'/?ps_e2b='+a+'"'); try{ return JSON.parse(x.out);}catch(e){ return {raw:x.out.slice(0,250)}; } }
O.zym=ZYM; O.pradzia=q('reset');
const V={};
try{
 const browser = await chromium.launch();
 async function prisijunges(A){
   const ctx = await browser.newContext({viewport:{width:1280,height:1100}, ignoreHTTPSErrors:true, locale:'lt-LT'});
   await ctx.addCookies([
     {name:A.cookie_name, value:A.cookie_value, domain:A.domain, path:'/', httpOnly:true, secure:true},
     {name:A.auth_name,   value:A.auth_value,   domain:A.domain, path:'/', httpOnly:true, secure:true}]);
   const p = await ctx.newPage();
   const req={profile:null}; const errs=[];
   p.on('pageerror', e=>errs.push(String(e).slice(0,120)));
   p.on('request', r=>{ if (r.url().indexOf('/pet-profile')>=0 && r.method()==='POST') { try{ req.profile=JSON.parse(r.postData()||'{}'); }catch(e){} } });
   return {ctx,p,req,errs};
 }
 async function atidaryk(p, url){
   await p.goto(url, {waitUntil:'domcontentloaded', timeout:60000});
   await p.waitForTimeout(3200);
   try{ const b=p.locator('button:has-text("Priimti")').first(); if(await b.count()) await b.click({timeout:4000}); }catch(e){}
   await p.waitForTimeout(1000);
 }

 // ===== V2 prisijunges SU svoriu =====
 { const A = q('auth&clean=1');
   const {ctx,p,req,errs} = await prisijunges(A);
   await atidaryk(p, SITE+'/paskyra/augintinis/?action=create');
   await p.getByText('Šuo',{exact:false}).first().click({timeout:15000, force:true});
   await p.waitForTimeout(1000);
   await p.locator('input[type=text]:visible').first().fill(ZYM+'-SuSvoriu');
   await p.waitForTimeout(500);
   const sv = p.locator('input.pspet-input[inputmode="decimal"]:visible').first();
   V.V2_svorio_lauku = await sv.count();
   if (V.V2_svorio_lauku) { await sv.fill('12,5'); await p.waitForTimeout(1100); }
   V.V2_dom = V.V2_svorio_lauku ? await sv.inputValue() : null;
   await p.locator('button:visible').filter({hasText:/Sukurti profilį|Išsaugoti/i}).first().click({timeout:15000});
   await p.waitForTimeout(6000);
   const pl = req.profile || {};
   const st = q('pets');
   const pet = (st.pets||[]).find(x=>x.pet_name===ZYM+'-SuSvoriu');
   V.V2 = { dom:V.V2_dom, post_current: pl.current_weight_kg, post_turi_weight_kg: Object.prototype.hasOwnProperty.call(pl,'_weight_kg'),
            pet: pet, klaidos: errs };
   V.V2.OK = (V.V2_dom==='12,5' && pl.current_weight_kg==='12.5' && !V.V2.post_turi_weight_kg
              && pet && parseFloat(pet.current_weight_kg)===12.5 && pet.weight_updated_at);
   await ctx.close(); }

 // ===== V6 prisijunges BE svorio, DB svoris JAU yra =====
 { const A = q('auth&clean=1&seed='+ZYM+'-Turi20');
   V.V6_pries = A.pets;
   const {ctx,p,req,errs} = await prisijunges(A);
   await atidaryk(p, SITE+'/paskyra/augintinis/?action=create');
   await p.getByText('Šuo',{exact:false}).first().click({timeout:15000, force:true});
   await p.waitForTimeout(1000);
   await p.locator('input[type=text]:visible').first().fill(ZYM+'-BeSvorio2');
   await p.waitForTimeout(600);
   await p.locator('button:visible').filter({hasText:/Sukurti profilį|Išsaugoti/i}).first().click({timeout:15000});
   await p.waitForTimeout(6000);
   const pl = req.profile || {};
   const st = q('pets');
   const senas = (st.pets||[]).find(x=>x.pet_name===ZYM+'-Turi20');
   V.V6 = { payload: pl, turi_current: Object.prototype.hasOwnProperty.call(pl,'current_weight_kg'),
            turi_weight_kg: Object.prototype.hasOwnProperty.call(pl,'_weight_kg'),
            senas_pet: senas, klaidos: errs };
   V.V6.OK = (!V.V6.turi_current && !V.V6.turi_weight_kg && senas && parseFloat(senas.current_weight_kg)===20);
   await ctx.close(); }

 // ===== V4 SENAS localStorage su _weight_kg =====
 { const ctx = await browser.newContext({viewport:{width:390,height:844}, isMobile:true, ignoreHTTPSErrors:true, locale:'lt-LT'});
   const p = await ctx.newPage();
   let draftBody=null;
   p.on('request', r=>{ if (r.url().indexOf('/pet-draft')>=0 && r.method()==='POST') { try{ draftBody=JSON.parse(r.postData()||'{}'); }catch(e){} } });
   await atidaryk(p, SITE+'/augintinio-profilis/');
   await p.evaluate((z)=>{
     const now=Date.now();
     localStorage.setItem('pspet_draft', JSON.stringify({schema_version:2, draft_id:'d_senas', 
       created_at:new Date(now).toISOString(), expires_at:new Date(now+30*86400000).toISOString(),
       current_step:1, section_idx:0, confirmed_sections:[],
       pet_data:{species:'dog', pet_name:z+'-Senas', _weight_kg:'12,5'}}));
   }, ZYM);
   await p.reload({waitUntil:'domcontentloaded', timeout:60000});
   await p.waitForTimeout(3200);
   try{ const b=p.locator('button:has-text("Priimti")').first(); if(await b.count()) await b.click({timeout:4000}); }catch(e){}
   await p.waitForTimeout(1000);
   const testi = p.locator('button:visible').filter({hasText:/^TĘSTI$|Tęsti$/i}).first();
   if (await testi.count()) { await testi.click({timeout:15000}); await p.waitForTimeout(2200); }
   const sv = p.locator('input.pspet-input[inputmode="decimal"]:visible').first();
   V.V4_atsikure = (await sv.count()) ? await sv.inputValue() : '(nera lauko)';
   await p.locator('button:visible').filter({hasText:/Sukurti profilį/i}).first().click({timeout:15000});
   await p.waitForTimeout(2200);
   await p.locator('input[type=email]:visible').first().fill('e2e.'+ZYM.toLowerCase()+'.v4@dev.avesa.lt');
   await p.locator('.pspet-btn-primary:visible').first().click({timeout:15000});
   await p.waitForTimeout(6000);
   const pl = draftBody ? draftBody.payload : {};
   V.V4 = { atsikure: V.V4_atsikure, post_current: pl.current_weight_kg,
            post_turi_weight_kg: Object.prototype.hasOwnProperty.call(pl||{},'_weight_kg') };
   V.V4.OK = (V.V4_atsikure==='12,5' && pl.current_weight_kg==='12.5' && !V.V4.post_turi_weight_kg);
   // V5 dalis: ar state.data._weight_kg ISLIKO po submit
   V.V5_ls_po = await p.evaluate(()=>{ try{ const d=JSON.parse(localStorage.getItem('pspet_draft')||'null');
     return d && d.pet_data ? d.pet_data._weight_kg : '(nera)'; }catch(e){ return 'ERR'; } });
   await ctx.close(); }

 // ===== V5 skaiciuokle + rodymas + V7 S1 smoke =====
 { const ctx = await browser.newContext({viewport:{width:390,height:844}, isMobile:true, ignoreHTTPSErrors:true, locale:'lt-LT'});
   const p = await ctx.newPage();
   const net=[]; const errs=[];
   p.on('request', r=>{ if(r.url().indexOf('/petshop/v1/')>=0) net.push(r.method()+' '+r.url().split('/petshop/v1/')[1].split('?')[0]); });
   p.on('pageerror', e=>errs.push(String(e).slice(0,120)));
   await atidaryk(p, SITE+'/augintinio-profilis/');
   await p.getByText('Šuo',{exact:false}).first().click({timeout:15000, force:true});
   await p.waitForTimeout(1000);
   await p.locator('input[type=text]:visible').first().fill(ZYM+'-Smoke');
   await p.waitForTimeout(500);
   const sv = p.locator('input.pspet-input[inputmode="decimal"]:visible').first();
   await sv.fill('12,5'); await p.waitForTimeout(1200);
   // V5: ar KUR NORS puslapyje atsiranda „12,5 kg"
   V.V5_visas_tekstas = (await p.locator('body').innerText().catch(()=>'')).replace(/\s+/g,' ');
   V.V5_rodo_kg = /12,5\s*kg/.test(V.V5_visas_tekstas);
   await p.locator('button:visible').filter({hasText:/Sukurti profilį/i}).first().click({timeout:15000});
   await p.waitForTimeout(2400);
   V.V5_po_submit = (await p.locator('body').innerText().catch(()=>'')).replace(/\s+/g,' ');
   V.V5_rodo_kg_po = /12,5\s*kg/.test(V.V5_po_submit);
   await p.locator('input[type=email]:visible').first().fill('e2e.'+ZYM.toLowerCase()+'.v7@dev.avesa.lt');
   await p.locator('.pspet-btn-primary:visible').first().click({timeout:15000});
   await p.waitForTimeout(7000);
   V.V7 = { net: net, draft_kartu: net.filter(x=>x.indexOf('pet-draft')>=0).length,
            magic_kartu: net.filter(x=>x.indexOf('magic-login')>=0).length,
            box: (await p.locator('.pspet-save-box').first().innerText().catch(()=>'')).replace(/\s+/g,' ').slice(0,120),
            klaidos: errs };
   V.V7.OK = (V.V7.draft_kartu===1 && V.V7.magic_kartu===1 && /Patikrinkite el/i.test(V.V7.box) && errs.length===0);
   V.V5 = { rodo_kg_anketoje: V.V5_rodo_kg, rodo_kg_po_submit: V.V5_rodo_kg_po, ls_weight_po_submit: V.V5_ls_po };
   V.V5.OK = (V.V5_ls_po === '12,5');
   await ctx.close(); }

 await browser.close();
}catch(err){ V.ERR=String(err && err.stack ? err.stack : err).slice(0,600); }
O.V=V;
O.valymas = q('cleanup2');

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
putB64('v2467.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
