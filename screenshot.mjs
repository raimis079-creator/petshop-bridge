import { execSync } from 'child_process';
import { chromium } from 'playwright';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function putB64(n,b){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk --max-time 30 -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:80e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'s349',content:b,...(s?{sha:s}:{})}));
  const c=execSync('curl -sk --max-time 60 -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:80e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
function sh(c){try{const o=execSync(c+' 2>&1; echo "__RC:$?"',{maxBuffer:50e6,shell:'/bin/bash'}).toString();
 const m=o.match(/__RC:(\d+)\s*$/);return{rc:m?+m[1]:-1,out:o.replace(/__RC:\d+\s*$/,'')};}catch(e){return{rc:-99,out:String(e).slice(0,300)};}}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={VERSIJA_RUN:'run349-v1'}; let sid=null;
try{
  const ls=sh('curl -sSk --max-time 40 '+AUTH+' "'+API+'?per_page=100"');
  const arr=JSON.parse(ls.out); const off=[];
  for(const s0 of arr){ if(s0.name && s0.name.indexOf('TEMP')===0 && s0.active){
    fs.writeFileSync('/tmp/off.json',JSON.stringify({active:false}));
    sh('curl -sSk --max-time 30 -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/off.json "'+API+'/'+s0.id+'"');
    off.push(s0.id); } }
  O.deaktyvuota_TEMP=off;
}catch(e){ O.valymo_klaida=String(e).slice(0,200); }
const php=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgUzM0OCDigJQgcGF0Y2ggKyB0ZXN0dSBlbmRwb2ludGFpICh2aWVuYSBzZXNpamEsIHBvIHRvIGRlYWt0eXZ1b3RpKQogKi8KYWRkX2ZpbHRlcignd3BfbWFpbCcsIGZ1bmN0aW9uKCRhcmdzKXsKICAgICR0byA9IGlzX2FycmF5KCRhcmdzWyd0byddID8/ICcnKSA/IGltcGxvZGUoJywnLCAkYXJnc1sndG8nXSkgOiAoc3RyaW5nKSgkYXJnc1sndG8nXSA/PyAnJyk7CiAgICBpZiAoc3RycG9zKCR0bywnZTJlLicpICE9PSBmYWxzZSkgewogICAgICAgICRzID0gZ2V0X29wdGlvbigncHNfczM0OF9tYWlscycsIGFycmF5KCkpOyBpZighaXNfYXJyYXkoJHMpKSAkcz1hcnJheSgpOwogICAgICAgICRzW10gPSBhcnJheSgndG8nPT4kdG8sJ3N1YmplY3QnPT4kYXJnc1snc3ViamVjdCddPz8nJywnbWVzc2FnZSc9PiRhcmdzWydtZXNzYWdlJ10/PycnLCd0Jz0+dGltZSgpKTsKICAgICAgICB1cGRhdGVfb3B0aW9uKCdwc19zMzQ4X21haWxzJywgYXJyYXlfc2xpY2UoJHMsLTUpLCBmYWxzZSk7CiAgICB9CiAgICByZXR1cm4gJGFyZ3M7Cn0sIDEpOwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogICAgaWYgKCAhIGlzc2V0KCRfR0VUWydwc19zMzQ4J10pIHx8ICRfR0VUWydwc19zMzQ4J10gIT09ICdLMzQ4cDQnICkgcmV0dXJuOwogICAgbm9jYWNoZV9oZWFkZXJzKCk7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgICBnbG9iYWwgJHdwZGI7ICRwZiA9ICR3cGRiLT5wcmVmaXg7CiAgICAkUEVUUz0kcGYuJ3BzX3BldHMnOyAkVEQ9JHBmLidwc19wZXRfcHJvZmlsZV9kcmFmdHMnOwogICAgJGFjdCA9IGlzc2V0KCRfR0VUWydhY3QnXSkgPyAkX0dFVFsnYWN0J10gOiAnJzsKICAgICRyID0gYXJyYXkoJ1ZFUlNJSkEnPT4nczM0OC12MScsJ2FjdCc9PiRhY3QpOwoKICAgIGlmICgkYWN0PT09J3BhdGNoJykgewogICAgICAgICRkYXJiYWkgPSBhcnJheSgKICAgICAgICAgICAgJ3BldF9mb3JtJyA9PiBhcnJheSgKICAgICAgICAgICAgICAgICdmJyA9PiBXUF9QTFVHSU5fRElSLicvcGV0c2hvcC1jb3JlL2Fzc2V0cy9wZXQtZm9ybS5qcycsCiAgICAgICAgICAgICAgICAnYScgPT4gYmFzZTY0X2RlY29kZSgnQ1FrSkNTOHZJRWxCSUhZeExqRTZJSE4yYjNKcGN5QnpZWFZuYjIxaGN5QmhkSE5yYVhKMUlHVnVaSEJ2YVc1MGRTQW9jR1YwTFhCeWIyWnBiR1VnYW04Z2JtVndjbWxwYldFcExnb0pDUWtKZG1GeUlIY2dQU0J3WVhKelpVWnNiMkYwS0ZOMGNtbHVaeWh6ZEdGMFpTNWtZWFJoTGw5M1pXbG5hSFJmYTJjZ2ZId2dKeWNwTG5KbGNHeGhZMlVvSnl3bkxDQW5MaWNwS1RzS0NRa0pDV2xtSUNoM0lENGdNQ0FtSmlCa1lYUmhMbkJsZEY5cFpDa2dld29KQ1FrSkNXWmxkR05vS0ZKRlUxUWdLeUFuTDJabFpXUnBibWN0Y0dWMExYZGxhV2RvZENjc0lIc0tDUWtKQ1FrSmJXVjBhRzlrT2lBblVFOVRWQ2NzQ2drSkNRa0pDV2hsWVdSbGNuTTZJSHNnSjBOdmJuUmxiblF0Vkhsd1pTYzZJQ2RoY0hCc2FXTmhkR2x2Ymk5cWMyOXVKeXdnSjFndFYxQXRUbTl1WTJVbk9pQk9UMDVEUlNCOUxBb0pDUWtKQ1FsamNtVmtaVzUwYVdGc2N6b2dKM05oYldVdGIzSnBaMmx1Snl3S0NRa0pDUWtKWW05a2VUb2dTbE5QVGk1emRISnBibWRwWm5rb2V5QndaWFJmYVdRNklHUmhkR0V1Y0dWMFgybGtMQ0IzWldsbmFIUmZhMmM2SUhjZ2ZTa0tDUWtKQ1FsOUtTNWpZWFJqYUNobWRXNWpkR2x2YmlncGUzMHBPd29KQ1FrSmZRPT0nKSwgJ24nID0+IGJhc2U2NF9kZWNvZGUoJ0NRa0pDUzh2SUZNek5EZzZJSE4yYjNKcGN5QnJaV3hwWVhWcVlTQkxRVTVQVGtsT1NWVWdjR0Y1Ykc5aFpDQW9Vek16TlNBcklGTXpORFFnWVdSa1EyRnViMjVwWTJGc1YyVnBaMmgwS1M0S0NRa0pDUzh2SUVKMWRtVnpJR0YwYzJ0cGNtRnpJQzltWldWa2FXNW5MWEJsZEMxM1pXbG5hSFFnYTNacFpYUnBiV0Z6SUdOcFlTQkVWVUpNU1VGV1R5QnlZWE41YldFZ2FYSUtDUWtKQ1M4dklHdGhjMnRoY25RZ2NHVnljbUZ6ZVdSaGRtOGdkMlZwWjJoMFgzVndaR0YwWldSZllYUWdLRlkySUdSbFptVnJkR0Z6S1NEaWdKUWdVRUZUUVV4SlRsUkJVeTQ9JyksCiAgICAgICAgICAgICksCiAgICAgICAgICAgICdtdScgPT4gYXJyYXkoCiAgICAgICAgICAgICAgICAnZicgPT4gV1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1mZWVkaW5nLWNhbGMtcmVzdC5waHAnLAogICAgICAgICAgICAgICAgJ2EnID0+IGJhc2U2NF9kZWNvZGUoJ0NRa0pKSGR3WkdJdFBuVndaR0YwWlNna2NHWXVKM0J6WDNCbGRITW5MQ0JoY25KaGVTZ25ZM1Z5Y21WdWRGOTNaV2xuYUhSZmEyY25QVDRrZHl3bmQyVnBaMmgwWDNWd1pHRjBaV1JmWVhRblBUNWpkWEp5Wlc1MFgzUnBiV1VvSjIxNWMzRnNKeWtzSjNWd1pHRjBaV1JmWVhRblBUNWpkWEp5Wlc1MFgzUnBiV1VvSjIxNWMzRnNKeWtwTENCaGNuSmhlU2duYVdRblBUNGtjR1YwWDJsa0tTazcnKSwgJ24nID0+IGJhc2U2NF9kZWNvZGUoJ0NRa0pMeThnVXpNME9Eb2dkMlZwWjJoMFgzVndaR0YwWldSZllYUWdQU0JMUVVSQklGTldUMUpKVXlCUVFWTkpTMFZKVkVVZ0tIUmhJSEJoZEdrZ2MyVnRZVzUwYVd0aElHdGhhWEFLQ1FrSkx5OGdZMnhoYzNNdGNHVjBMWEJ5YjJacGJHVWdVek0wTlNrdUlGTnJZV2wwYVc1cGN5QndZV3g1WjJsdWFXMWhjeURpZ0pRZ1JFSWdiR0ZwYTI4Z0lqRXlMalV3SWk0S0NRa0pMeThnWjIxa1lYUmxMQ0J1WlNCamRYSnlaVzUwWDNScGJXVTZJR3RoYm05dWFXNXBjeUJyWld4cFlYTWdjbUZ6YnlCVlZFTTdJR1IxSUd4aGFXdHliMlI2YVdGcENna0pDUzh2SUhacFpXNWhiV1VnYzNSMWJIQmxiSGxxWlNCa1lYWmxJRE1nZG1Gc0xpQnpkVzlzYVNBb1ZqWWdjbUZrYVc1NWN5a3VDZ2tKQ1NSa1lXSWdQU0FrZDNCa1lpMCtaMlYwWDNaaGNpZ2tkM0JrWWkwK2NISmxjR0Z5WlNnaVUwVk1SVU5VSUdOMWNuSmxiblJmZDJWcFoyaDBYMnRuSUVaU1QwMGdleVJ3Wm4xd2MxOXdaWFJ6SUZkSVJWSkZJR2xrUFNWa0lpd2tjR1YwWDJsa0tTazdDZ2tKQ1NSMWNHUWdQU0JoY25KaGVTZ25ZM1Z5Y21WdWRGOTNaV2xuYUhSZmEyY25QVDRrZHl3bmRYQmtZWFJsWkY5aGRDYzlQbWR0WkdGMFpTZ25XUzF0TFdRZ1NEcHBPbk1uS1NrN0Nna0pDV2xtSUNnZ0pHUmhZaUE5UFQwZ2JuVnNiQ0I4ZkNCaFluTW9LR1pzYjJGMEtTUmtZV0lnTFNBa2R5a2dQaUF3TGpBd01TQXBJSHNnSkhWd1pGc25kMlZwWjJoMFgzVndaR0YwWldSZllYUW5YU0E5SUdkdFpHRjBaU2duV1MxdExXUWdTRHBwT25NbktUc2dmUW9KQ1Fra2QzQmtZaTArZFhCa1lYUmxLQ1J3Wmk0bmNITmZjR1YwY3ljc0lDUjFjR1FzSUdGeWNtRjVLQ2RwWkNjOVBpUndaWFJmYVdRcEtUcz0nKSwKICAgICAgICAgICAgKSwKICAgICAgICApOwogICAgICAgIGZvcmVhY2ggKCRkYXJiYWkgYXMgJGs9PiRkKSB7CiAgICAgICAgICAgICRjID0gZmlsZV9nZXRfY29udGVudHMoJGRbJ2YnXSk7CiAgICAgICAgICAgICRjbnQgPSBzdWJzdHJfY291bnQoJGMsICRkWydhJ10pOwogICAgICAgICAgICBpZiAoJGNudCAhPT0gMSkgeyAkclska10gPSBhcnJheSgnS0xBSURBJz0+J2lua2FyYXNfY250PScuJGNudCk7IGNvbnRpbnVlOyB9CiAgICAgICAgICAgICRiYWsgPSAkZFsnZiddLicuYmFrX1MzNDgnOwogICAgICAgICAgICBpZiAoIWZpbGVfZXhpc3RzKCRiYWspKSBjb3B5KCRkWydmJ10sICRiYWspOwogICAgICAgICAgICAkbmF1amFzID0gc3RyX3JlcGxhY2UoJGRbJ2EnXSwgJGRbJ24nXSwgJGMpOwogICAgICAgICAgICBmaWxlX3B1dF9jb250ZW50cygkZFsnZiddLCAkbmF1amFzKTsKICAgICAgICAgICAgJHBvID0gZmlsZV9nZXRfY29udGVudHMoJGRbJ2YnXSk7CiAgICAgICAgICAgICRyWyRrXSA9IGFycmF5KCdidXZvX0InPT5zdHJsZW4oJGMpLCdwb19CJz0+c3RybGVuKCRwbyksCiAgICAgICAgICAgICAgICAnc2hhJz0+c3Vic3RyKGhhc2goJ3NoYTI1NicsJHBvKSwwLDE2KSwKICAgICAgICAgICAgICAgICdiYWNrdXAnPT5iYXNlbmFtZSgkYmFrKSwKICAgICAgICAgICAgICAgICdmcHdfbGlrbyc9PnN1YnN0cl9jb3VudCgkcG8sJ2ZlZWRpbmctcGV0LXdlaWdodCcpLAogICAgICAgICAgICAgICAgJ3NpbnRha3NlX3BocCc9PiAkaz09PSdtdScgPyAoZnVuY3Rpb24oJHMpeyB0cnl7IHRva2VuX2dldF9hbGwoJHMsVE9LRU5fUEFSU0UpOyByZXR1cm4gJ09LJzsgfWNhdGNoKFRocm93YWJsZSAkZSl7IHJldHVybiAnRkFJTDogJy4kZS0+Z2V0TWVzc2FnZSgpOyB9IH0pKCRwbykgOiAnbi9hJyk7CiAgICAgICAgfQogICAgICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoJHIsIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QUkVUVFlfUFJJTlQpOyBleGl0OwogICAgfQoKICAgIGlmICgkYWN0PT09J2F1dGgnKSB7CiAgICAgICAgJGxuPSdwc192Ml90ZXN0JzsgJHU9Z2V0X3VzZXJfYnkoJ2xvZ2luJywkbG4pOwogICAgICAgIGlmKCEkdSl7ICRpZD13cF9pbnNlcnRfdXNlcihhcnJheSgndXNlcl9sb2dpbic9PiRsbiwndXNlcl9lbWFpbCc9PiRsbi4nQGRldi5hdmVzYS5sdCcsJ3VzZXJfcGFzcyc9PndwX2dlbmVyYXRlX3Bhc3N3b3JkKDI0KSwncm9sZSc9PidjdXN0b21lcicpKTsgJHU9aXNfd3BfZXJyb3IoJGlkKT9udWxsOmdldF91c2VyX2J5KCdpZCcsJGlkKTsgfQogICAgICAgIGlmKCEkdSl7IGVjaG8gd3BfanNvbl9lbmNvZGUoYXJyYXkoJ2Vycic9Pid1c2VyJykpOyBleGl0OyB9CiAgICAgICAgJHVpZD0oaW50KSR1LT5JRDsKICAgICAgICBpZiAoaXNzZXQoJF9HRVRbJ2NsZWFuJ10pKSAkd3BkYi0+cXVlcnkoJHdwZGItPnByZXBhcmUoIkRFTEVURSBGUk9NICRQRVRTIFdIRVJFIHVzZXJfaWQ9JWQiLCR1aWQpKTsKICAgICAgICBpZiAoaXNzZXQoJF9HRVRbJ3NlZWQnXSkpIHsKICAgICAgICAgICAgJHN2ID0gaXNzZXQoJF9HRVRbJ253J10pID8gbnVsbCA6IDEyLjUwOwogICAgICAgICAgICAkcm93ID0gYXJyYXkoJ3VzZXJfaWQnPT4kdWlkLCdwZXRfbmFtZSc9PnNhbml0aXplX3RleHRfZmllbGQoJF9HRVRbJ3NlZWQnXSksJ3NwZWNpZXMnPT4nZG9nJywnc3RhdHVzJz0+J2FjdGl2ZScsJ2lzX3ByaW1hcnknPT4xLAogICAgICAgICAgICAgICAgJ2NyZWF0ZWRfYXQnPT5nbWRhdGUoJ1ktbS1kIEg6aTpzJyksJ3VwZGF0ZWRfYXQnPT5nbWRhdGUoJ1ktbS1kIEg6aTpzJykpOwogICAgICAgICAgICBpZiAoJHN2ICE9PSBudWxsKSB7ICRyb3dbJ2N1cnJlbnRfd2VpZ2h0X2tnJ109JHN2OyAkcm93Wyd3ZWlnaHRfdXBkYXRlZF9hdCddPScyMDI2LTA4LTAxIDA4OjAwOjAwJzsgfQogICAgICAgICAgICAkd3BkYi0+aW5zZXJ0KCRQRVRTLCAkcm93KTsKICAgICAgICAgICAgJHJbJ3NlZWRfcGV0X2lkJ109KGludCkkd3BkYi0+aW5zZXJ0X2lkOwogICAgICAgIH0KICAgICAgICAkZXhwPXRpbWUoKSsxODAwOwogICAgICAgICRyWyd1c2VyX2lkJ109JHVpZDsKICAgICAgICAkclsnY29va2llX25hbWUnXT1MT0dHRURfSU5fQ09PS0lFOyAkclsnY29va2llX3ZhbHVlJ109d3BfZ2VuZXJhdGVfYXV0aF9jb29raWUoJHVpZCwkZXhwLCdsb2dnZWRfaW4nKTsKICAgICAgICAkclsnYXV0aF9uYW1lJ109aXNfc3NsKCk/U0VDVVJFX0FVVEhfQ09PS0lFOkFVVEhfQ09PS0lFOwogICAgICAgICRyWydhdXRoX3ZhbHVlJ109d3BfZ2VuZXJhdGVfYXV0aF9jb29raWUoJHVpZCwkZXhwLGlzX3NzbCgpPydzZWN1cmVfYXV0aCc6J2F1dGgnKTsKICAgICAgICAkclsnZG9tYWluJ109cGFyc2VfdXJsKGhvbWVfdXJsKCksUEhQX1VSTF9IT1NUKTsKICAgICAgICAkclsncGV0cyddPSR3cGRiLT5nZXRfcmVzdWx0cygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIGlkLHBldF9uYW1lLGN1cnJlbnRfd2VpZ2h0X2tnLHdlaWdodF91cGRhdGVkX2F0IEZST00gJFBFVFMgV0hFUkUgdXNlcl9pZD0lZCIsJHVpZCksIEFSUkFZX0EpOwogICAgICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoJHIsIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QUkVUVFlfUFJJTlQpOyBleGl0OwogICAgfQoKICAgIGlmICgkYWN0PT09J3BldHMnKSB7CiAgICAgICAgJHU9Z2V0X3VzZXJfYnkoJ2xvZ2luJywncHNfdjJfdGVzdCcpOwogICAgICAgICRyWydwZXRzJ109ICR1ID8gJHdwZGItPmdldF9yZXN1bHRzKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgaWQscGV0X25hbWUsc3BlY2llcyxjdXJyZW50X3dlaWdodF9rZyx3ZWlnaHRfdXBkYXRlZF9hdCBGUk9NICRQRVRTIFdIRVJFIHVzZXJfaWQ9JWQgT1JERVIgQlkgaWQiLCR1LT5JRCksIEFSUkFZX0EpIDogbnVsbDsKICAgICAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUFJFVFRZX1BSSU5UKTsgZXhpdDsKICAgIH0KCiAgICBpZiAoJGFjdD09PSdlcHcnKSB7CiAgICAgICAgJHU9Z2V0X3VzZXJfYnkoJ2xvZ2luJywncHNfdjJfdGVzdCcpOwogICAgICAgIGlmKCEkdSl7IGVjaG8gd3BfanNvbl9lbmNvZGUoYXJyYXkoJ2Vycic9PiduZXJhX3VzZXInKSk7IGV4aXQ7IH0KICAgICAgICAkdWlkPShpbnQpJHUtPklEOyB3cF9zZXRfY3VycmVudF91c2VyKCR1aWQpOwogICAgICAgICR3cGRiLT5pbnNlcnQoJFBFVFMsIGFycmF5KCd1c2VyX2lkJz0+JHVpZCwncGV0X25hbWUnPT4nRVBXLXRlc3RhcycsJ3NwZWNpZXMnPT4nZG9nJywnc3RhdHVzJz0+J2FjdGl2ZScsCiAgICAgICAgICAgICdjcmVhdGVkX2F0Jz0+Z21kYXRlKCdZLW0tZCBIOmk6cycpLCd1cGRhdGVkX2F0Jz0+Z21kYXRlKCdZLW0tZCBIOmk6cycpKSk7CiAgICAgICAgJHBpZD0oaW50KSR3cGRiLT5pbnNlcnRfaWQ7ICRyWydlcHdfcGV0X2lkJ109JHBpZDsKICAgICAgICAka3ZpZXNrID0gZnVuY3Rpb24oJHcpIHVzZSAoJHBpZCkgewogICAgICAgICAgICAkcmVxID0gbmV3IFdQX1JFU1RfUmVxdWVzdCgnUE9TVCcsJy9wZXRzaG9wL3YxL2ZlZWRpbmctcGV0LXdlaWdodCcpOwogICAgICAgICAgICAkcmVxLT5zZXRfaGVhZGVyKCdDb250ZW50LVR5cGUnLCdhcHBsaWNhdGlvbi9qc29uJyk7CiAgICAgICAgICAgICRyZXEtPnNldF9ib2R5KHdwX2pzb25fZW5jb2RlKGFycmF5KCdwZXRfaWQnPT4kcGlkLCd3ZWlnaHRfa2cnPT4kdykpKTsKICAgICAgICAgICAgJHJlcyA9IHJlc3RfZG9fcmVxdWVzdCgkcmVxKTsKICAgICAgICAgICAgcmV0dXJuIGFycmF5KCdzdGF0dXMnPT4kcmVzLT5nZXRfc3RhdHVzKCksJ2RhdGEnPT4kcmVzLT5nZXRfZGF0YSgpKTsKICAgICAgICB9OwogICAgICAgICRza2FpdHlrID0gZnVuY3Rpb24oKSB1c2UgKCR3cGRiLCRQRVRTLCRwaWQpeyByZXR1cm4gJHdwZGItPmdldF9yb3coJHdwZGItPnByZXBhcmUoIlNFTEVDVCBjdXJyZW50X3dlaWdodF9rZyx3ZWlnaHRfdXBkYXRlZF9hdCx1cGRhdGVkX2F0IEZST00gJFBFVFMgV0hFUkUgaWQ9JWQiLCRwaWQpLCBBUlJBWV9BKTsgfTsKICAgICAgICAkclsnYzEnXT0ka3ZpZXNrKDEyLjUpOyAkclsnczEnXT0kc2thaXR5aygpOwogICAgICAgIHNsZWVwKDIpOwogICAgICAgICRyWydjMiddPSRrdmllc2soMTIuNSk7ICRyWydzMiddPSRza2FpdHlrKCk7CiAgICAgICAgc2xlZXAoMik7CiAgICAgICAgJHJbJ2MzJ109JGt2aWVzaygxMyk7ICAgJHJbJ3MzJ109JHNrYWl0eWsoKTsKICAgICAgICAkclsnT0snXSA9ICggJHJbJ2MxJ11bJ3N0YXR1cyddPT09MjAwICYmICRyWydjMiddWydzdGF0dXMnXT09PTIwMCAmJiAkclsnYzMnXVsnc3RhdHVzJ109PT0yMDAKICAgICAgICAgICAgJiYgJHJbJ3MxJ11bJ3dlaWdodF91cGRhdGVkX2F0J10gIT09IG51bGwKICAgICAgICAgICAgJiYgJHJbJ3MyJ11bJ3dlaWdodF91cGRhdGVkX2F0J10gPT09ICRyWydzMSddWyd3ZWlnaHRfdXBkYXRlZF9hdCddCiAgICAgICAgICAgICYmICRyWydzMyddWyd3ZWlnaHRfdXBkYXRlZF9hdCddICE9PSAkclsnczEnXVsnd2VpZ2h0X3VwZGF0ZWRfYXQnXQogICAgICAgICAgICAmJiAkclsnczMnXVsnY3VycmVudF93ZWlnaHRfa2cnXSA9PT0gJzEzLjAwJyApOwogICAgICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoJHIsIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QUkVUVFlfUFJJTlQpOyBleGl0OwogICAgfQoKICAgIGlmICgkYWN0PT09J3Jlc2V0JykgewogICAgICAgIGRlbGV0ZV9vcHRpb24oJ3BzX3MzNDhfbWFpbHMnKTsKICAgICAgICAkd3BkYi0+cXVlcnkoIkRFTEVURSBGUk9NICR3cGRiLT5vcHRpb25zIFdIRVJFIG9wdGlvbl9uYW1lIExJS0UgJ190cmFuc2llbnQlcHNfZHJfJScgT1Igb3B0aW9uX25hbWUgTElLRSAnX3RyYW5zaWVudCVwc19tbCUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJ190cmFuc2llbnQlbWFnaWMlJyIpOwogICAgICAgICRyWydwZXRzX3Zpc28nXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSAkUEVUUyIpOwogICAgICAgICRyWydkcmFmdGFpJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJFREIik7CiAgICAgICAgZWNobyB3cF9qc29uX2VuY29kZSgkciwgSlNPTl9QUkVUVFlfUFJJTlQpOyBleGl0OwogICAgfQoKICAgIGlmICgkYWN0PT09J21haWwnKSB7CiAgICAgICAgJG1zID0gZ2V0X29wdGlvbigncHNfczM0OF9tYWlscycsIGFycmF5KCkpOwogICAgICAgICRyWydsYWlza3UnXT1pc19hcnJheSgkbXMpP2NvdW50KCRtcyk6MDsKICAgICAgICBpZiAoJG1zKSB7ICRtPWVuZCgkbXMpOyAkclsndG8nXT0kbVsndG8nXTsgJHJbJ3N1YmplY3QnXT0kbVsnc3ViamVjdCddOwogICAgICAgICAgICAkYj1zdHJfcmVwbGFjZSgnXFwvJywnLycsJG1bJ21lc3NhZ2UnXSk7CiAgICAgICAgICAgIGlmIChwcmVnX21hdGNoKCcjaHJlZj1bIlwnXShbXiJcJ10qcGV0c2hvcC1sb2dpblteIlwnXSp0b2tlbj1bXiJcJ10qKVsiXCddI2knLCAkYiwgJGhtKSkgJHJbJ251b3JvZGEnXT1odG1sX2VudGl0eV9kZWNvZGUoJGhtWzFdLEVOVF9RVU9URVMpOwogICAgICAgICAgICBlbHNlaWYgKHByZWdfbWF0Y2goJyNodHRwcz86Ly9bXlxzIlwnPD5dKnBldHNob3AtbG9naW5bXlxzIlwnPD5dKiNpJywgJGIsICRmbSkpICRyWydudW9yb2RhJ109aHRtbF9lbnRpdHlfZGVjb2RlKCRmbVswXSxFTlRfUVVPVEVTKTsKICAgICAgICB9CiAgICAgICAgZWNobyB3cF9qc29uX2VuY29kZSgkciwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTfEpTT05fUFJFVFRZX1BSSU5UKTsgZXhpdDsKICAgIH0KCiAgICBpZiAoJGFjdD09PSdkcmFmdGxhc3QnKSB7CiAgICAgICAgJHJvdz0kd3BkYi0+Z2V0X3JvdygiU0VMRUNUIGRyYWZ0X2lkLHN0YXR1cyxwYXlsb2FkX2pzb24sY3JlYXRlZF9hdCBGUk9NICRURCBPUkRFUiBCWSBjcmVhdGVkX2F0IERFU0MsIGRyYWZ0X2lkIERFU0MgTElNSVQgMSIsIEFSUkFZX0EpOwogICAgICAgICRyWydlaWx1dGUnXT0gJHJvdyA/IGFycmF5KCdkcmFmdF9pZCc9PiRyb3dbJ2RyYWZ0X2lkJ10sJ3N0YXR1cyc9PiRyb3dbJ3N0YXR1cyddLCdjcmVhdGVkX2F0Jz0+JHJvd1snY3JlYXRlZF9hdCddKSA6IG51bGw7CiAgICAgICAgJHJbJ3BheWxvYWQnXT0gJHJvdyAmJiAkcm93WydwYXlsb2FkX2pzb24nXSA/IGpzb25fZGVjb2RlKCRyb3dbJ3BheWxvYWRfanNvbiddLHRydWUpIDogbnVsbDsKICAgICAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVN8SlNPTl9QUkVUVFlfUFJJTlQpOyBleGl0OwogICAgfQoKICAgIGlmICgkYWN0PT09J2NsZWFudXAnKSB7CiAgICAgICAgJGlkcyA9IGlzc2V0KCRfR0VUWydwZXRzJ10pID8gYXJyYXlfZmlsdGVyKGFycmF5X21hcCgnaW50dmFsJywgZXhwbG9kZSgnLCcsICRfR0VUWydwZXRzJ10pKSkgOiBhcnJheSgpOwogICAgICAgIGZvcmVhY2ggKCRpZHMgYXMgJGkpICR3cGRiLT5kZWxldGUoJFBFVFMsIGFycmF5KCdpZCc9PiRpKSk7CiAgICAgICAgaWYgKCFlbXB0eSgkX0dFVFsnZHInXSkpICR3cGRiLT5kZWxldGUoJFRELCBhcnJheSgnZHJhZnRfaWQnPT5zYW5pdGl6ZV90ZXh0X2ZpZWxkKCRfR0VUWydkciddKSkpOwogICAgICAgICR1PWdldF91c2VyX2J5KCdsb2dpbicsJ3BzX3YyX3Rlc3QnKTsKICAgICAgICBpZigkdSAmJiBpc3NldCgkX0dFVFsndXNlciddKSl7ICR3cGRiLT5xdWVyeSgkd3BkYi0+cHJlcGFyZSgiREVMRVRFIEZST00gJFBFVFMgV0hFUkUgdXNlcl9pZD0lZCIsJHUtPklEKSk7IHJlcXVpcmVfb25jZSBBQlNQQVRILid3cC1hZG1pbi9pbmNsdWRlcy91c2VyLnBocCc7IHdwX2RlbGV0ZV91c2VyKCR1LT5JRCk7ICRyWyd1c2VyX2lzdHJpbnRhcyddPTE7IH0KICAgICAgICBkZWxldGVfb3B0aW9uKCdwc19zMzQ4X21haWxzJyk7CiAgICAgICAgJHJbJ3BldHNfdmlzbyddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICRQRVRTIik7CiAgICAgICAgJHJbJ2RyYWZ0YWknXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSAkVEQiKTsKICAgICAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLCBKU09OX1BSRVRUWV9QUklOVCk7IGV4aXQ7CiAgICB9CiAgICBlY2hvIHdwX2pzb25fZW5jb2RlKGFycmF5KCdlcnInPT4nYWN0JyksIEpTT05fUFJFVFRZX1BSSU5UKTsgZXhpdDsKfSk7Cg==','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP S348 patch+test',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk --max-time 40 '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.snip_err=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
function q(a){ const x=sh('curl -sSk --max-time 90 "'+SITE+'/?ps_s348=K348p4&act='+a+'"'); try{ return JSON.parse(x.out);}catch(e){ return {raw:x.out.slice(0,600)}; } }
if(!sid){ putB64('s349.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); process.exit(0); }
sh('sleep 5');

// ---- 1. PATCH (atskiras requestas) ----
O.patch = q('patch');
const patchOK = O.patch && O.patch.pet_form && !O.patch.pet_form.KLAIDA && O.patch.mu && !O.patch.mu.KLAIDA
  && O.patch.pet_form.fpw_liko===0 && String(O.patch.mu.sintakse_php)==='OK';
O.patchOK = patchOK;
if(patchOK){
sh('sleep 2');
// ---- 2. EPW endpoint testas (naujas requestas -> naujas mu-plugin) ----
O.reset0 = q('reset');
O.auth_epw = q('auth&clean=1');           // user be petu
O.epw = q('epw');

// ---- 3. Narsykle: V6 / V6b / V2' / S1 ----
const V={};
try{
 const browser = await chromium.launch();
 async function seansas(seedName, extra){
   const A = q('auth&clean=1&seed='+seedName+(extra||''));
   const ctx = await browser.newContext({viewport:{width:1280,height:1300}, ignoreHTTPSErrors:true, locale:'lt-LT'});
   await ctx.addCookies([
     {name:A.cookie_name,value:A.cookie_value,domain:A.domain,path:'/',httpOnly:true,secure:true},
     {name:A.auth_name,value:A.auth_value,domain:A.domain,path:'/',httpOnly:true,secure:true}]);
   const p = await ctx.newPage();
   const reqs=[], resps=[], fpw=[], errs=[];
   p.on('pageerror', e=>errs.push(String(e).slice(0,120)));
   p.on('request', r=>{
     if(r.method()!=='POST') return;
     if(r.url().indexOf('/pet-profile')>=0){ try{ reqs.push(JSON.parse(r.postData()||'{}')); }catch(e){ reqs.push({parse_err:1}); } }
     if(r.url().indexOf('/feeding-pet-weight')>=0){ fpw.push(1); }
   });
   p.on('response', r=>{ if(r.url().indexOf('/pet-profile')>=0 && r.request().method()==='POST'){ resps.push({status:r.status(), ok:r.ok()}); } });
   await p.goto(SITE+'/paskyra/augintinis/', {waitUntil:'domcontentloaded', timeout:60000});
   await p.waitForTimeout(3400);
   try{ const b=p.locator('button:has-text("Priimti")').first(); if(await b.count()) await b.click({timeout:4000}); }catch(e){}
   await p.waitForTimeout(1200);
   await p.locator('button:visible, a:visible').filter({hasText:/Papildyti profilį/i}).first().click({timeout:15000});
   await p.waitForTimeout(3000);
   return {A,ctx,p,reqs,resps,fpw,errs, PET_ID:(A.pets&&A.pets[0])?A.pets[0].id:null};
 }
 async function issaugok(p){
   const testi = p.locator('button:visible').filter({hasText:/^Tęsti$/i}).first();
   if (await testi.count()) { await testi.click({timeout:15000}); await p.waitForTimeout(3000); }
   const b = p.locator('button:visible').filter({hasText:/Išsaugoti ir baigti vėliau|Išsaugoti|Baigti/i}).first();
   const t = (await b.count()) ? (await b.textContent()||'').trim() : null;
   if (await b.count()) { await b.click({timeout:15000}); await p.waitForTimeout(7000); }
   return t;
 }

 // V6: vardas keiciamas, svoris ne
 { const S = await seansas('S348-A');
   const pr = S.A.pets[0];
   const naujas='S348-PAKEISTAS';
   await S.p.locator('input[type=text].pspet-input:visible').first().fill(naujas);
   await S.p.waitForTimeout(900);
   await issaugok(S.p);
   const st=q('pets'); const po=(st.pets||[]).find(x=>String(x.id)===String(S.PET_ID));
   const pl = S.reqs.length ? S.reqs[S.reqs.length-1] : {};
   V.V6={request_count:S.reqs.length, fpw_kvietimu:S.fpw.length, response:S.resps[S.resps.length-1]||null,
     payload_svoris:pl.current_weight_kg, pries:pr, po:po, klaidos:S.errs};
   V.V6.OK=( S.reqs.length===1 && V.V6.response && V.V6.response.ok===true
     && S.fpw.length===0
     && po && po.pet_name===naujas && parseFloat(po.current_weight_kg)===12.5
     && po.weight_updated_at===pr.weight_updated_at && S.errs.length===0 );
   await S.ctx.close(); }

 // V6b: svoris 12,5 -> 13
 { const S = await seansas('S348-B');
   const pr = S.A.pets[0];
   const sv=S.p.locator('input.pspet-input[inputmode="decimal"]:visible').first();
   await sv.fill('13'); await S.p.waitForTimeout(1200);
   await issaugok(S.p);
   const st=q('pets'); const po=(st.pets||[]).find(x=>String(x.id)===String(S.PET_ID));
   const pl = S.reqs.length ? S.reqs[S.reqs.length-1] : {};
   V.V6b={request_count:S.reqs.length, fpw_kvietimu:S.fpw.length, response:S.resps[S.resps.length-1]||null,
     payload_svoris:pl.current_weight_kg, pries:pr, po:po, klaidos:S.errs};
   V.V6b.OK=( S.reqs.length===1 && V.V6b.response && V.V6b.response.ok===true
     && S.fpw.length===0 && pl.current_weight_kg==='13'
     && po && parseFloat(po.current_weight_kg)===13
     && po.weight_updated_at!==pr.weight_updated_at && S.errs.length===0 );
   await S.ctx.close(); }

 // V2': pet BE svorio, ivedam 12,5 -> kanoninis kelias VIENAS issaugo
 { const S = await seansas('S348-C','&nw=1');
   const pr = S.A.pets[0];
   const sv=S.p.locator('input.pspet-input[inputmode="decimal"]:visible').first();
   await sv.fill('12,5'); await S.p.waitForTimeout(1200);
   await issaugok(S.p);
   const st=q('pets'); const po=(st.pets||[]).find(x=>String(x.id)===String(S.PET_ID));
   const pl = S.reqs.length ? S.reqs[S.reqs.length-1] : {};
   V.V2={request_count:S.reqs.length, fpw_kvietimu:S.fpw.length, response:S.resps[S.resps.length-1]||null,
     payload_svoris:pl.current_weight_kg, pries:pr, po:po, klaidos:S.errs};
   V.V2.OK=( S.reqs.length===1 && V.V2.response && V.V2.response.ok===true
     && S.fpw.length===0 && pl.current_weight_kg==='12.5'
     && po && po.current_weight_kg==='12.50' && po.weight_updated_at!==null
     && S.errs.length===0 );
   await S.ctx.close(); }

 // S1 REALUS anoniminis: /augintinio-profilis/ -> pet-draft -> magic
 { const ctx=await browser.newContext({viewport:{width:390,height:844}, ignoreHTTPSErrors:true, locale:'lt-LT'});
   const p=await ctx.newPage();
   const dr=[], drR=[], mg=[], mgR=[], errs=[];
   p.on('pageerror', e=>errs.push(String(e).slice(0,120)));
   p.on('request', r=>{ if(r.method()!=='POST')return;
     if(r.url().indexOf('/pet-draft')>=0){ try{dr.push(JSON.parse(r.postData()||'{}'));}catch(e){dr.push({parse_err:1});} }
     if(r.url().indexOf('/magic-login')>=0){ mg.push(1); } });
   p.on('response', r=>{ if(r.request().method()!=='POST')return;
     if(r.url().indexOf('/pet-draft')>=0) drR.push(r.status());
     if(r.url().indexOf('/magic-login')>=0) mgR.push(r.status()); });
   await p.goto(SITE+'/augintinio-profilis/',{waitUntil:'domcontentloaded',timeout:60000});
   await p.waitForTimeout(3000);
   try{ const b=p.locator('button:has-text("Priimti")').first(); if(await b.count()) await b.click({timeout:4000}); }catch(e){}
   await p.evaluate(()=>{ try{localStorage.removeItem('pspet_draft');}catch(e){} });
   await p.reload({waitUntil:'domcontentloaded'}); await p.waitForTimeout(2500);
   const ekranai=[];
   async function ekr(z){ try{ ekranai.push(z+': '+(await p.locator('body').innerText()).replace(/\s+/g,' ').slice(0,180)); }catch(e){} }
   await ekr('start');
   try{ await p.locator('.pspet-pill').filter({hasText:/Šuo/i}).first().click({timeout:8000}); }catch(e){ errs.push('pill:'+String(e).slice(0,80)); }
   await p.waitForTimeout(400);
   const VARDAS='S348-Anonimas';
   try{ await p.locator('input[type=text].pspet-input:visible').first().fill(VARDAS);}catch(e){errs.push('vardas:'+String(e).slice(0,80));}
   try{ const sv=p.locator('input.pspet-input[inputmode="decimal"]:visible').first(); if(await sv.count()) await sv.fill('12,5'); }catch(e){}
   await p.waitForTimeout(500);
   // spaudziam pirminius mygtukus kol pamatysim email lauka (max 4)
   for(let i=0;i<4;i++){
     const em=p.locator('input[type=email]:visible').first();
     if(await em.count()) break;
     const b=p.locator('button.pspet-btn-primary:visible, .pspet-btn-primary:visible').first();
     if(!(await b.count())) break;
     await ekr('pries_myg'+i+' ['+((await b.textContent())||'').trim()+']');
     await b.click({timeout:10000}); await p.waitForTimeout(2200);
   }
   await ekr('email_ekranas');
   const EM='e2e.s348.'+Date.now().toString(36)+'@pastas-test.lt';
   let emOK=false;
   try{ await p.locator('input[type=email]:visible').first().fill(EM); emOK=true; }catch(e){ errs.push('email:'+String(e).slice(0,80)); }
   if(emOK){
     try{ await p.locator('button:visible').filter({hasText:/Siųsti nuorodą|Siųsti/i}).first().click({timeout:10000}); }catch(e){ errs.push('siusti:'+String(e).slice(0,80)); }
     await p.waitForTimeout(3500);
   }
   await ekr('po_siuntimo');
   const lsD = await p.evaluate(()=>{ try{return localStorage.getItem('pspet_draft');}catch(e){return null;} });
   const mail=q('mail'); const dl=q('draftlast');
   V.S1={EM, draft_posts:dr.length, draft_status:drR, magic_posts:mg.length, magic_status:mgR,
     payload:dr[dr.length-1]||null, localStorage_yra:!!lsD, mail:{laisku:mail.laisku,to:mail.to,nuoroda_yra:!!mail.nuoroda},
     draft_db:{eilute:dl.eilute, svoris:dl.payload?dl.payload.current_weight_kg:null, vardas:dl.payload?dl.payload.pet_name:null},
     ekranai, klaidos:errs};
   V.S1.OK=( dr.length===1 && drR[0]===201 && mg.length===1 && mgR[0]===200
     && V.S1.payload && V.S1.payload.current_weight_kg===12.5 && V.S1.payload.pet_name===VARDAS
     && lsD!==null && !!mail.nuoroda
     && dl.eilute && dl.eilute.status==='active' && dl.payload && dl.payload.current_weight_kg===12.5
     && errs.length===0 );
   V.S1.draft_id = dl.eilute ? dl.eilute.draft_id : null;
   await ctx.close(); }

 await browser.close();
}catch(err){ V.ERR=String(err&&err.stack?err.stack:err).slice(0,600); }
O.V=V;

// ---- 4. Valymas pagal TIKSLIUS ID ----
const petIds=[];
if(O.epw && O.epw.epw_pet_id) petIds.push(O.epw.epw_pet_id);
O.cleanup = q('cleanup&user=1&pets='+petIds.join(',')+(V.S1&&V.S1.draft_id?('&dr='+encodeURIComponent(V.S1.draft_id)):''));
}
// snippet deaktyvavimas
fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
sh('curl -sSk --max-time 30 -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
putB64('s349.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
