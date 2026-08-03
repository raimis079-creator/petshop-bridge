import { execSync } from 'child_process';
import { chromium } from 'playwright';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function putB64(n,b){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk --max-time 30 -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:80e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'s351',content:b,...(s?{sha:s}:{})}));
  const c=execSync('curl -sk --max-time 60 -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:80e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
function sh(c){try{const o=execSync(c+' 2>&1; echo "__RC:$?"',{maxBuffer:50e6,shell:'/bin/bash'}).toString();
 const m=o.match(/__RC:(\d+)\s*$/);return{rc:m?+m[1]:-1,out:o.replace(/__RC:\d+\s*$/,'')};}catch(e){return{rc:-99,out:String(e).slice(0,300)};}}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={VERSIJA_RUN:'run351-v1'}; let sid=null;
try{
  const ls=sh('curl -sSk --max-time 40 '+AUTH+' "'+API+'?per_page=100"');
  const arr=JSON.parse(ls.out);
  for(const s0 of arr){ if(s0.name && s0.name.indexOf('TEMP')===0 && s0.active){
    fs.writeFileSync('/tmp/off.json',JSON.stringify({active:false}));
    sh('curl -sSk --max-time 30 -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/off.json "'+API+'/'+s0.id+'"'); } }
}catch(e){}
const php=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgUzM0OCDigJQgcGF0Y2ggKyB0ZXN0dSBlbmRwb2ludGFpICh2aWVuYSBzZXNpamEsIHBvIHRvIGRlYWt0eXZ1b3RpKQogKi8KYWRkX2ZpbHRlcignd3BfbWFpbCcsIGZ1bmN0aW9uKCRhcmdzKXsKICAgICR0byA9IGlzX2FycmF5KCRhcmdzWyd0byddID8/ICcnKSA/IGltcGxvZGUoJywnLCAkYXJnc1sndG8nXSkgOiAoc3RyaW5nKSgkYXJnc1sndG8nXSA/PyAnJyk7CiAgICBpZiAoc3RycG9zKCR0bywnZTJlLicpICE9PSBmYWxzZSkgewogICAgICAgICRzID0gZ2V0X29wdGlvbigncHNfbjM0X21haWxzJywgYXJyYXkoKSk7IGlmKCFpc19hcnJheSgkcykpICRzPWFycmF5KCk7CiAgICAgICAgJHNbXSA9IGFycmF5KCd0byc9PiR0bywnc3ViamVjdCc9PiRhcmdzWydzdWJqZWN0J10/PycnLCdtZXNzYWdlJz0+JGFyZ3NbJ21lc3NhZ2UnXT8/JycsJ3QnPT50aW1lKCkpOwogICAgICAgIHVwZGF0ZV9vcHRpb24oJ3BzX24zNF9tYWlscycsIGFycmF5X3NsaWNlKCRzLC01KSwgZmFsc2UpOwogICAgfQogICAgcmV0dXJuICRhcmdzOwp9LCAxKTsKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAgIGlmICggISBpc3NldCgkX0dFVFsncHNfbjM0J10pIHx8ICRfR0VUWydwc19uMzQnXSAhPT0gJ0szNTN4OScgKSByZXR1cm47CiAgICBub2NhY2hlX2hlYWRlcnMoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAgIGdsb2JhbCAkd3BkYjsgJHBmID0gJHdwZGItPnByZWZpeDsKICAgICRQRVRTPSRwZi4ncHNfcGV0cyc7ICRURD0kcGYuJ3BzX3BldF9wcm9maWxlX2RyYWZ0cyc7CiAgICAkYWN0ID0gaXNzZXQoJF9HRVRbJ2FjdCddKSA/ICRfR0VUWydhY3QnXSA6ICcnOwogICAgJHIgPSBhcnJheSgnVkVSU0lKQSc9PidzMzUzLXYxJywnYWN0Jz0+JGFjdCk7CgogICAgaWYgKCRhY3Q9PT0nYXV0aCcpIHsKICAgICAgICAkbG49J3BzX3YyX3Rlc3QnOyAkdT1nZXRfdXNlcl9ieSgnbG9naW4nLCRsbik7CiAgICAgICAgaWYoISR1KXsgJGlkPXdwX2luc2VydF91c2VyKGFycmF5KCd1c2VyX2xvZ2luJz0+JGxuLCd1c2VyX2VtYWlsJz0+JGxuLidAZGV2LmF2ZXNhLmx0JywndXNlcl9wYXNzJz0+d3BfZ2VuZXJhdGVfcGFzc3dvcmQoMjQpLCdyb2xlJz0+J2N1c3RvbWVyJykpOyAkdT1pc193cF9lcnJvcigkaWQpP251bGw6Z2V0X3VzZXJfYnkoJ2lkJywkaWQpOyB9CiAgICAgICAgaWYoISR1KXsgZWNobyB3cF9qc29uX2VuY29kZShhcnJheSgnZXJyJz0+J3VzZXInKSk7IGV4aXQ7IH0KICAgICAgICAkdWlkPShpbnQpJHUtPklEOwogICAgICAgIGlmIChpc3NldCgkX0dFVFsnY2xlYW4nXSkpICR3cGRiLT5xdWVyeSgkd3BkYi0+cHJlcGFyZSgiREVMRVRFIEZST00gJFBFVFMgV0hFUkUgdXNlcl9pZD0lZCIsJHVpZCkpOwogICAgICAgIGlmIChpc3NldCgkX0dFVFsnc2VlZCddKSkgewogICAgICAgICAgICAkc3YgPSBpc3NldCgkX0dFVFsnbncnXSkgPyBudWxsIDogMTIuNTA7CiAgICAgICAgICAgICRyb3cgPSBhcnJheSgndXNlcl9pZCc9PiR1aWQsJ3BldF9uYW1lJz0+c2FuaXRpemVfdGV4dF9maWVsZCgkX0dFVFsnc2VlZCddKSwnc3BlY2llcyc9Pidkb2cnLCdzdGF0dXMnPT4nYWN0aXZlJywnaXNfcHJpbWFyeSc9PjEsCiAgICAgICAgICAgICAgICAnY3JlYXRlZF9hdCc9PmdtZGF0ZSgnWS1tLWQgSDppOnMnKSwndXBkYXRlZF9hdCc9PmdtZGF0ZSgnWS1tLWQgSDppOnMnKSk7CiAgICAgICAgICAgIGlmICgkc3YgIT09IG51bGwpIHsgJHJvd1snY3VycmVudF93ZWlnaHRfa2cnXT0kc3Y7ICRyb3dbJ3dlaWdodF91cGRhdGVkX2F0J109JzIwMjYtMDgtMDEgMDg6MDA6MDAnOyB9CiAgICAgICAgICAgICR3cGRiLT5pbnNlcnQoJFBFVFMsICRyb3cpOwogICAgICAgICAgICAkclsnc2VlZF9wZXRfaWQnXT0oaW50KSR3cGRiLT5pbnNlcnRfaWQ7CiAgICAgICAgfQogICAgICAgICRleHA9dGltZSgpKzE4MDA7CiAgICAgICAgJHJbJ3VzZXJfaWQnXT0kdWlkOwogICAgICAgICRyWydjb29raWVfbmFtZSddPUxPR0dFRF9JTl9DT09LSUU7ICRyWydjb29raWVfdmFsdWUnXT13cF9nZW5lcmF0ZV9hdXRoX2Nvb2tpZSgkdWlkLCRleHAsJ2xvZ2dlZF9pbicpOwogICAgICAgICRyWydhdXRoX25hbWUnXT1pc19zc2woKT9TRUNVUkVfQVVUSF9DT09LSUU6QVVUSF9DT09LSUU7CiAgICAgICAgJHJbJ2F1dGhfdmFsdWUnXT13cF9nZW5lcmF0ZV9hdXRoX2Nvb2tpZSgkdWlkLCRleHAsaXNfc3NsKCk/J3NlY3VyZV9hdXRoJzonYXV0aCcpOwogICAgICAgICRyWydkb21haW4nXT1wYXJzZV91cmwoaG9tZV91cmwoKSxQSFBfVVJMX0hPU1QpOwogICAgICAgICRyWydwZXRzJ109JHdwZGItPmdldF9yZXN1bHRzKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgaWQscGV0X25hbWUsY3VycmVudF93ZWlnaHRfa2csd2VpZ2h0X3VwZGF0ZWRfYXQgRlJPTSAkUEVUUyBXSEVSRSB1c2VyX2lkPSVkIiwkdWlkKSwgQVJSQVlfQSk7CiAgICAgICAgZWNobyB3cF9qc29uX2VuY29kZSgkciwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BSRVRUWV9QUklOVCk7IGV4aXQ7CiAgICB9CgogICAgaWYgKCRhY3Q9PT0ncGV0cycpIHsKICAgICAgICAkdT1nZXRfdXNlcl9ieSgnbG9naW4nLCdwc192Ml90ZXN0Jyk7CiAgICAgICAgJHJbJ3BldHMnXT0gJHUgPyAkd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBpZCxwZXRfbmFtZSxzcGVjaWVzLGN1cnJlbnRfd2VpZ2h0X2tnLHdlaWdodF91cGRhdGVkX2F0IEZST00gJFBFVFMgV0hFUkUgdXNlcl9pZD0lZCBPUkRFUiBCWSBpZCIsJHUtPklEKSwgQVJSQVlfQSkgOiBudWxsOwogICAgICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoJHIsIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QUkVUVFlfUFJJTlQpOyBleGl0OwogICAgfQoKICAgIGlmICgkYWN0PT09J21rdXNlcicpIHsKICAgICAgICAkZW0gPSBzYW5pdGl6ZV9lbWFpbCgkX0dFVFsnZW0nXSA/PyAnJyk7ICR2YXJkYXMgPSBzYW5pdGl6ZV90ZXh0X2ZpZWxkKCRfR0VUWyd2YXJkYXMnXSA/PyAnTjMtRHVibGlzJyk7CiAgICAgICAgaWYoISRlbSl7IGVjaG8gd3BfanNvbl9lbmNvZGUoYXJyYXkoJ2Vycic9PidlbScpKTsgZXhpdDsgfQogICAgICAgICR1PWdldF91c2VyX2J5KCdlbWFpbCcsJGVtKTsKICAgICAgICBpZighJHUpeyAkaWQ9d3BfaW5zZXJ0X3VzZXIoYXJyYXkoJ3VzZXJfbG9naW4nPT5zYW5pdGl6ZV91c2VyKCdlMmVfJy5zdWJzdHIobWQ1KCRlbSksMCwxMiksdHJ1ZSksJ3VzZXJfZW1haWwnPT4kZW0sJ3VzZXJfcGFzcyc9PndwX2dlbmVyYXRlX3Bhc3N3b3JkKDI0KSwncm9sZSc9PidjdXN0b21lcicpKTsgJHU9aXNfd3BfZXJyb3IoJGlkKT9udWxsOmdldF91c2VyX2J5KCdpZCcsJGlkKTsgfQogICAgICAgIGlmKCEkdSl7IGVjaG8gd3BfanNvbl9lbmNvZGUoYXJyYXkoJ2Vycic9Pid1c2VyJykpOyBleGl0OyB9CiAgICAgICAgJHVpZD0oaW50KSR1LT5JRDsKICAgICAgICBpZihpc3NldCgkX0dFVFsnc2VlZCddKSl7CiAgICAgICAgICAgICR3cGRiLT5pbnNlcnQoJFBFVFMsIGFycmF5KCd1c2VyX2lkJz0+JHVpZCwncGV0X25hbWUnPT4kdmFyZGFzLCdzcGVjaWVzJz0+J2RvZycsJ3N0YXR1cyc9PidhY3RpdmUnLCdpc19wcmltYXJ5Jz0+MSwnY3VycmVudF93ZWlnaHRfa2cnPT4xMC4wMCwnY3JlYXRlZF9hdCc9PmdtZGF0ZSgnWS1tLWQgSDppOnMnKSwndXBkYXRlZF9hdCc9PmdtZGF0ZSgnWS1tLWQgSDppOnMnKSkpOwogICAgICAgICAgICAkclsnc2VlZF9wZXRfaWQnXT0oaW50KSR3cGRiLT5pbnNlcnRfaWQ7CiAgICAgICAgfQogICAgICAgICRyWyd1c2VyX2lkJ109JHVpZDsKICAgICAgICAkclsncGV0cyddPSR3cGRiLT5nZXRfcmVzdWx0cygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIGlkLHBldF9uYW1lLHNwZWNpZXMsc3RhdHVzIEZST00gJFBFVFMgV0hFUkUgdXNlcl9pZD0lZCIsJHVpZCksIEFSUkFZX0EpOwogICAgICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoJHIsIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QUkVUVFlfUFJJTlQpOyBleGl0OwogICAgfQoKICAgIGlmICgkYWN0PT09J3Jlc2V0JykgewogICAgICAgIGRlbGV0ZV9vcHRpb24oJ3BzX24zNF9tYWlscycpOwogICAgICAgICR3cGRiLT5xdWVyeSgiREVMRVRFIEZST00gJHdwZGItPm9wdGlvbnMgV0hFUkUgb3B0aW9uX25hbWUgTElLRSAnX3RyYW5zaWVudCVwc19kcl8lJyBPUiBvcHRpb25fbmFtZSBMSUtFICdfdHJhbnNpZW50JXBzX21sJScgT1Igb3B0aW9uX25hbWUgTElLRSAnX3RyYW5zaWVudCVtYWdpYyUnIik7CiAgICAgICAgJHJbJ3BldHNfdmlzbyddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICRQRVRTIik7CiAgICAgICAgJHJbJ2RyYWZ0YWknXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSAkVEQiKTsKICAgICAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLCBKU09OX1BSRVRUWV9QUklOVCk7IGV4aXQ7CiAgICB9CgogICAgaWYgKCRhY3Q9PT0nbWFpbCcpIHsKICAgICAgICAkbXMgPSBnZXRfb3B0aW9uKCdwc19uMzRfbWFpbHMnLCBhcnJheSgpKTsKICAgICAgICAkclsnbGFpc2t1J109aXNfYXJyYXkoJG1zKT9jb3VudCgkbXMpOjA7CiAgICAgICAgaWYgKCRtcykgeyAkbT1lbmQoJG1zKTsgJHJbJ3RvJ109JG1bJ3RvJ107ICRyWydzdWJqZWN0J109JG1bJ3N1YmplY3QnXTsKICAgICAgICAgICAgJGI9c3RyX3JlcGxhY2UoJ1xcLycsJy8nLCRtWydtZXNzYWdlJ10pOwogICAgICAgICAgICBpZiAocHJlZ19tYXRjaCgnI2hyZWY9WyJcJ10oW14iXCddKnBldHNob3AtbG9naW5bXiJcJ10qdG9rZW49W14iXCddKilbIlwnXSNpJywgJGIsICRobSkpICRyWydudW9yb2RhJ109aHRtbF9lbnRpdHlfZGVjb2RlKCRobVsxXSxFTlRfUVVPVEVTKTsKICAgICAgICAgICAgZWxzZWlmIChwcmVnX21hdGNoKCcjaHR0cHM/Oi8vW15ccyJcJzw+XSpwZXRzaG9wLWxvZ2luW15ccyJcJzw+XSojaScsICRiLCAkZm0pKSAkclsnbnVvcm9kYSddPWh0bWxfZW50aXR5X2RlY29kZSgkZm1bMF0sRU5UX1FVT1RFUyk7CiAgICAgICAgfQogICAgICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoJHIsIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFU3xKU09OX1BSRVRUWV9QUklOVCk7IGV4aXQ7CiAgICB9CgogICAgaWYgKCRhY3Q9PT0nZHJhZnRsYXN0JykgewogICAgICAgICRyb3c9JHdwZGItPmdldF9yb3coIlNFTEVDVCBkcmFmdF9pZCxzdGF0dXMscGF5bG9hZF9qc29uLGNyZWF0ZWRfYXQgRlJPTSAkVEQgT1JERVIgQlkgY3JlYXRlZF9hdCBERVNDLCBkcmFmdF9pZCBERVNDIExJTUlUIDEiLCBBUlJBWV9BKTsKICAgICAgICAkclsnZWlsdXRlJ109ICRyb3cgPyBhcnJheSgnZHJhZnRfaWQnPT4kcm93WydkcmFmdF9pZCddLCdzdGF0dXMnPT4kcm93WydzdGF0dXMnXSwnY3JlYXRlZF9hdCc9PiRyb3dbJ2NyZWF0ZWRfYXQnXSkgOiBudWxsOwogICAgICAgICRyWydwYXlsb2FkJ109ICRyb3cgJiYgJHJvd1sncGF5bG9hZF9qc29uJ10gPyBqc29uX2RlY29kZSgkcm93WydwYXlsb2FkX2pzb24nXSx0cnVlKSA6IG51bGw7CiAgICAgICAgZWNobyB3cF9qc29uX2VuY29kZSgkciwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTfEpTT05fUFJFVFRZX1BSSU5UKTsgZXhpdDsKICAgIH0KCiAgICBpZiAoJGFjdD09PSdzdDInKSB7CiAgICAgICAgJGVtID0gaXNzZXQoJF9HRVRbJ2VtJ10pID8gc2FuaXRpemVfZW1haWwoJF9HRVRbJ2VtJ10pIDogJyc7CiAgICAgICAgJGRyID0gaXNzZXQoJF9HRVRbJ2RyJ10pID8gc2FuaXRpemVfdGV4dF9maWVsZCgkX0dFVFsnZHInXSkgOiAnJzsKICAgICAgICAkVFQ9JHBmLidwc19hY3Rpb25fdG9rZW5zJzsgJEVMPSRwZi4ncHNfZXZlbnRfbG9nJzsKICAgICAgICBpZiAoJGRyKSAkclsnZHJhZnRhcyddPSR3cGRiLT5nZXRfcm93KCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgZHJhZnRfaWQsc3RhdHVzLHBheWxvYWRfanNvbiBJUyBOVUxMIEFTIHBheWxvYWRfbnVsbCxjbGFpbV9hdHRlbXB0X2lkLGNsYWltX3N0YXJ0ZWRfYXQsY2xhaW1lZF91c2VyX2lkLGNsYWltZWRfcGV0X2lkIEZST00gJFREIFdIRVJFIGRyYWZ0X2lkPSVzIiwkZHIpLCBBUlJBWV9BKTsKICAgICAgICBpZiAoJGVtKSB7CiAgICAgICAgICAgICRyWyd0b2tlbmFzJ109JHdwZGItPmdldF9yb3coJHdwZGItPnByZXBhcmUoIlNFTEVDVCBpZCxyZXNvdXJjZV9pZCxzdGF0dXMsdXNlZF9hdCBGUk9NICRUVCBXSEVSRSBzdWJqZWN0X2VtYWlsPSVzIE9SREVSIEJZIGlkIERFU0MgTElNSVQgMSIsJGVtKSwgQVJSQVlfQSk7CiAgICAgICAgICAgICR1PWdldF91c2VyX2J5KCdlbWFpbCcsJGVtKTsKICAgICAgICAgICAgJHJbJ3ZhcnRvdG9qYXMnXT0kdT9hcnJheSgnaWQnPT4kdS0+SUQpOm51bGw7CiAgICAgICAgICAgIGlmKCR1KXsgJHJbJ3BldHMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBpZCxwZXRfbmFtZSxjdXJyZW50X3dlaWdodF9rZyxjbGllbnRfcmVmLHN0YXR1cyBGUk9NICRQRVRTIFdIRVJFIHVzZXJfaWQ9JWQiLCR1LT5JRCksIEFSUkFZX0EpOwogICAgICAgICAgICAgICAgJHJbJ3BlbmRpbmcnXT1nZXRfdXNlcl9tZXRhKCR1LT5JRCwnX3BzX3BldF9jbGFpbV9wZW5kaW5nJyx0cnVlKTsgfQogICAgICAgIH0KICAgICAgICAkclsncGV0c192aXNvJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJFBFVFMiKTsKICAgICAgICAkclsndmFydG90b2p1J109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJHdwZGItPnVzZXJzIik7CiAgICAgICAgJHJbJ2V2J109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJEVMIFdIRVJFIGV2ZW50X25hbWU9J3BldF9wcm9maWxlX2NyZWF0ZWQnIik7CiAgICAgICAgZWNobyB3cF9qc29uX2VuY29kZSgkciwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTfEpTT05fUFJFVFRZX1BSSU5UKTsgZXhpdDsKICAgIH0KCiAgICBpZiAoJGFjdD09PSdjbGVhbnVwJykgewogICAgICAgICRpZHMgPSBpc3NldCgkX0dFVFsncGV0cyddKSA/IGFycmF5X2ZpbHRlcihhcnJheV9tYXAoJ2ludHZhbCcsIGV4cGxvZGUoJywnLCAkX0dFVFsncGV0cyddKSkpIDogYXJyYXkoKTsKICAgICAgICBmb3JlYWNoICgkaWRzIGFzICRpKSAkd3BkYi0+ZGVsZXRlKCRQRVRTLCBhcnJheSgnaWQnPT4kaSkpOwogICAgICAgIGlmICghZW1wdHkoJF9HRVRbJ2RyJ10pKSAkd3BkYi0+ZGVsZXRlKCRURCwgYXJyYXkoJ2RyYWZ0X2lkJz0+c2FuaXRpemVfdGV4dF9maWVsZCgkX0dFVFsnZHInXSkpKTsKICAgICAgICBpZiAoIWVtcHR5KCRfR0VUWyd1ZW0nXSkpIHsgJHVlPWdldF91c2VyX2J5KCdlbWFpbCcsc2FuaXRpemVfZW1haWwoJF9HRVRbJ3VlbSddKSk7CiAgICAgICAgICAgIGlmKCR1ZSl7ICR3cGRiLT5xdWVyeSgkd3BkYi0+cHJlcGFyZSgiREVMRVRFIEZST00gJFBFVFMgV0hFUkUgdXNlcl9pZD0lZCIsJHVlLT5JRCkpOyByZXF1aXJlX29uY2UgQUJTUEFUSC4nd3AtYWRtaW4vaW5jbHVkZXMvdXNlci5waHAnOyB3cF9kZWxldGVfdXNlcigkdWUtPklEKTsgJHJbJ3VlbV9pc3RyaW50YXMnXT0xOyB9IH0KICAgICAgICAkdT1nZXRfdXNlcl9ieSgnbG9naW4nLCdwc192Ml90ZXN0Jyk7CiAgICAgICAgaWYoJHUgJiYgaXNzZXQoJF9HRVRbJ3VzZXInXSkpeyAkd3BkYi0+cXVlcnkoJHdwZGItPnByZXBhcmUoIkRFTEVURSBGUk9NICRQRVRTIFdIRVJFIHVzZXJfaWQ9JWQiLCR1LT5JRCkpOyByZXF1aXJlX29uY2UgQUJTUEFUSC4nd3AtYWRtaW4vaW5jbHVkZXMvdXNlci5waHAnOyB3cF9kZWxldGVfdXNlcigkdS0+SUQpOyAkclsndXNlcl9pc3RyaW50YXMnXT0xOyB9CiAgICAgICAgZGVsZXRlX29wdGlvbigncHNfbjM0X21haWxzJyk7CiAgICAgICAgJHJbJ3BldHNfdmlzbyddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICRQRVRTIik7CiAgICAgICAgJHJbJ2RyYWZ0YWknXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSAkVEQiKTsKICAgICAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLCBKU09OX1BSRVRUWV9QUklOVCk7IGV4aXQ7CiAgICB9CiAgICBlY2hvIHdwX2pzb25fZW5jb2RlKGFycmF5KCdlcnInPT4nYWN0JyksIEpTT05fUFJFVFRZX1BSSU5UKTsgZXhpdDsKfSk7Cg==','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP S353 N3N4 v1',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk --max-time 40 '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else sh('sleep 4');
}
O.sid=sid;
function q(a){ const x=sh('curl -sSk --max-time 90 "'+SITE+'/?ps_n34=K353x9&act='+a+'"'); try{ return JSON.parse(x.out);}catch(e){ return {raw:x.out.slice(0,600)}; } }
if(!sid){ putB64('s358.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); process.exit(0); }
sh('sleep 5');
O.reset0=q('reset');
const V={};
try{
 const browser=await chromium.launch();

 async function anonForm(EM,VARDAS){
   const ctx=await browser.newContext({viewport:{width:390,height:844}, ignoreHTTPSErrors:true, locale:'lt-LT'});
   const p=await ctx.newPage(); const errs=[];
   p.on('pageerror', e=>errs.push(String(e).slice(0,120)));
   await p.goto(SITE+'/augintinio-profilis/',{waitUntil:'domcontentloaded',timeout:60000});
   await p.waitForTimeout(3000);
   try{ const b=p.locator('button:has-text("Priimti")').first(); if(await b.count()) await b.click({timeout:4000}); }catch(e){}
   await p.evaluate(()=>{ try{localStorage.removeItem('pspet_draft');}catch(e){} });
   await p.reload({waitUntil:'domcontentloaded'}); await p.waitForTimeout(2500);
   await p.locator('.pspet-pill').filter({hasText:/Šuo/i}).first().click({timeout:8000}).catch(e=>errs.push('pill'));
   await p.waitForTimeout(400);
   await p.locator('input[type=text].pspet-input:visible').first().fill(VARDAS).catch(e=>errs.push('vardas'));
   const sv=p.locator('input.pspet-input[inputmode="decimal"]:visible').first();
   if(await sv.count()) await sv.fill('12,5');
   await p.waitForTimeout(400);
   for(let i=0;i<4;i++){
     if(await p.locator('input[type=email]:visible').first().count()) break;
     const b=p.locator('.pspet-btn-primary:visible').first();
     if(!(await b.count())) break;
     await b.click({timeout:10000}); await p.waitForTimeout(2200);
   }
   await p.locator('input[type=email]:visible').first().fill(EM).catch(e=>errs.push('email'));
   await p.locator('.pspet-btn-primary:visible').filter({hasText:/nuorod/i}).first().click({timeout:10000}).catch(e=>errs.push('siusti'));
   await p.waitForTimeout(3500);
   await ctx.close();
   const mail=q('mail'); const dl=q('draftlast');
   return {errs, nuoroda:mail.nuoroda||null, draft_id: dl.eilute?dl.eilute.draft_id:null};
 }

 // Vienas scenarijus: seed dublis -> anon draft -> magic claim -> sprendimo ekranas -> mygtukas
 async function scen(zym, mygtukoRe){
   const EM='e2e.'+zym+'.'+Date.now().toString(36)+'@pastas-test.lt';
   const VARDAS='S357-Dublis';
   const mk=q('mkuser&seed=1&vardas='+encodeURIComponent(VARDAS)+'&em='+encodeURIComponent(EM));
   const f=await anonForm(EM,VARDAS);
   const pries=q('st2&em='+encodeURIComponent(EM)+'&dr='+encodeURIComponent(f.draft_id||''));
   const out={EM, seed:mk, forma:{errs:f.errs, draft_id:f.draft_id, nuoroda_yra:!!f.nuoroda}, pries};
   if(!f.nuoroda){ out.KLAIDA='nuorodos_nera'; return out; }
   const ctx=await browser.newContext({viewport:{width:1280,height:900}, ignoreHTTPSErrors:true, locale:'lt-LT'});
   const p=await ctx.newPage(); const errs=[]; const st5=[];
   p.on('pageerror', e=>errs.push(String(e).slice(0,120)));
   p.on('response', r=>{ if(r.status()>=500) st5.push(r.status()+' '+r.url().slice(0,80)); });
   await p.goto(f.nuoroda,{waitUntil:'domcontentloaded',timeout:60000});
   await p.waitForTimeout(2500);
   await p.locator('button[type=submit]:visible').first().click({timeout:10000}).catch(e=>errs.push('prisijungti'));
   await p.waitForTimeout(6000);
   out.url_po_claim=p.url();
   out.po_claim=q('st2&em='+encodeURIComponent(EM)+'&dr='+encodeURIComponent(f.draft_id||''));
   // SPRENDIMO EKRANAS turi pasirodyti automatiskai (claimPendingThenLoad)
   out.ekranas=(await p.locator('#pspet-profile').innerText().catch(()=>''))
     .replace(/\s+/g,' ').slice(0,220);
   const btn=p.locator('#pspet-profile button:visible').filter({hasText:mygtukoRe}).first();
   out.mygtukas_yra = (await btn.count())>0;
   if(out.mygtukas_yra){
     await btn.click({timeout:10000}).catch(e=>errs.push('sprendimas'));
     await p.waitForTimeout(7000);
     out.ekranas_po=(await p.locator('#pspet-profile').innerText().catch(()=>''))
       .replace(/\s+/g,' ').slice(0,180);
   }
   out.errs=errs; out.st5=st5;
   await ctx.close();
   out.po=q('st2&em='+encodeURIComponent(EM)+'&dr='+encodeURIComponent(f.draft_id||''));
   return out;
 }

 // ===== D1: „Ne, tai kitas augintinis" -> naujas pet =====
 {
   const d=await scen('d1', /Ne, tai kitas augintinis/i);
   V.D1=d;
   const po=d.po||{}, pc=d.po_claim||{}, pr=d.pries||{};
   const seedId=String(d.seed&&d.seed.seed_pet_id||'');
   const naujas=(po.pets||[]).find(x=>String(x.id)!==seedId);
   V.D1_santrauka={
     duplicate_redirect:/pet_claim=duplicate_candidate/.test(d.url_po_claim||''),
     ekrane_klausimas:/jau turite/i.test(d.ekranas||''),
     pets_po:(po.pets||[]).length, naujas_pet:naujas?naujas.id:null,
     draft_status:po.draftas&&po.draftas.status,
     claimed_pet:po.draftas&&po.draftas.claimed_pet_id,
     pending_po: po.pending||'', ev_pokytis:(po.ev|0)-(pr.ev|0)
   };
   V.D1_OK = !!( V.D1_santrauka.duplicate_redirect && V.D1_santrauka.ekrane_klausimas
     && d.mygtukas_yra
     && (po.pets||[]).length===2 && naujas && naujas.client_ref===d.forma.draft_id
     && parseFloat(naujas.current_weight_kg)===12.5
     && po.draftas.status==='claimed' && String(po.draftas.claimed_pet_id)===String(naujas.id)
     && String(po.draftas.payload_null)==='1'
     && !po.pending
     && (po.ev|0)===(pr.ev|0)+1
     && d.errs.length===0 && d.st5.length===0 );
   // valymas
   q('cleanup&pets='+[seedId,naujas?naujas.id:''].join(',')+'&dr='+encodeURIComponent(d.forma.draft_id||'')+'&uem='+encodeURIComponent(d.EM));
 }

 // ===== D2: „Atnaujinti ši profili" -> esamas pet atnaujintas, naujo nera =====
 {
   const d=await scen('d2', /Atnaujinti šį profilį/i);
   V.D2=d;
   const po=d.po||{}, pr=d.pries||{};
   const seedId=String(d.seed&&d.seed.seed_pet_id||'');
   const esamas=(po.pets||[]).find(x=>String(x.id)===seedId);
   V.D2_santrauka={
     pets_po:(po.pets||[]).length, esamas_svoris:esamas&&esamas.current_weight_kg,
     draft_status:po.draftas&&po.draftas.status,
     claimed_pet:po.draftas&&po.draftas.claimed_pet_id,
     pending_po: po.pending||'', ev_pokytis:(po.ev|0)-(pr.ev|0)
   };
   V.D2_OK = !!( /pet_claim=duplicate_candidate/.test(d.url_po_claim||'')
     && d.mygtukas_yra
     && (po.pets||[]).length===1 && esamas
     && parseFloat(esamas.current_weight_kg)===12.5
     && po.draftas.status==='claimed' && String(po.draftas.claimed_pet_id)===seedId
     && String(po.draftas.payload_null)==='1'
     && !po.pending
     && (po.ev|0)===(pr.ev|0)
     && d.errs.length===0 && d.st5.length===0 );
   q('cleanup&pets='+seedId+'&dr='+encodeURIComponent(d.forma.draft_id||'')+'&uem='+encodeURIComponent(d.EM));
 }

 await browser.close();
}catch(err){ V.ERR=String(err&&err.stack?err.stack:err).slice(0,700); }
O.V=V;
O.pabaiga=q('reset');
fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
sh('curl -sSk --max-time 30 -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
putB64('s358.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
