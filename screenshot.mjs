import { execSync } from 'child_process';
import fs from 'fs';
const PHPB64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3dhMiddKSB8fCAkX0dFVFsncHNfd2EyJ10hPT0nQVBQTFlfV0VUMjdCJykgcmV0dXJuOwogIGdsb2JhbCAkd3BkYjsgJHQ9JHdwZGItPnByZWZpeC4ncHNfcGV0cyc7ICRiPSR3cGRiLT5wcmVmaXguJ3BzX3BldHNfYmFrXzIwMjYwNzI3X3dldCc7CiAgJG89YXJyYXkoJ3ppbmdzbmlhaSc9PmFycmF5KCkpOwogICRvcmlnPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICR0Iik7CiAgaWYoISR3cGRiLT5nZXRfdmFyKCJTSE9XIFRBQkxFUyBMSUtFICckYiciKSl7CiAgICAkd3BkYi0+cXVlcnkoIkNSRUFURSBUQUJMRSAkYiBMSUtFICR0Iik7CiAgICAkd3BkYi0+cXVlcnkoIklOU0VSVCBJTlRPICRiIFNFTEVDVCAqIEZST00gJHQiKTsKICAgICRvWyd6aW5nc25pYWknXVtdPSdiYWNrdXAgc3VrdXJ0YXMnOwogIH0gZWxzZSB7ICRvWyd6aW5nc25pYWknXVtdPSdiYWNrdXAgamF1IGJ1dm8nOyB9CiAgJGJhaz0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSAkYiIpOwogIGlmKCRiYWshPT0kb3JpZyl7ICRvWydOVVRSQVVLVEEnXT0iYmFja3VwICRiYWsgIT0gb3JpZyAkb3JpZyI7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8pOyBleGl0OyB9CiAgJG9bJ3ppbmdzbmlhaSddW109InBhdGlrcmludGE6ICRvcmlnID0gJGJhayI7CiAgJGNvbHM9JHdwZGItPmdldF9jb2woIlNIT1cgQ09MVU1OUyBGUk9NICR0Iik7CiAgaWYoIWluX2FycmF5KCd3ZXRfcHJvZHVjdF9pZCcsJGNvbHMpKXsKICAgICR3cGRiLT5xdWVyeSgiQUxURVIgVEFCTEUgJHQgQUREIHdldF9wcm9kdWN0X2lkIEJJR0lOVCgyMCkgVU5TSUdORUQgTlVMTCBERUZBVUxUIE5VTEwgQUZURVIgcHJpbWFyeV9wcm9kdWN0X2lkIik7CiAgICAkb1snemluZ3NuaWFpJ11bXT0ncHJpZGV0YXMgd2V0X3Byb2R1Y3RfaWQnOwogIH0gZWxzZSB7ICRvWyd6aW5nc25pYWknXVtdPSd3ZXRfcHJvZHVjdF9pZCBqYXUgYnV2byc7IH0KICAkb1sndXBkX21vc3RseV93ZXQnXT0kd3BkYi0+cXVlcnkoIlVQREFURSAkdCBTRVQgZmVlZGluZ190eXBlPU5VTEwgV0hFUkUgZmVlZGluZ190eXBlPSdtb3N0bHlfd2V0JyIpOwogICRvWydvcmlnJ109JG9yaWc7ICRvWydiYWsnXT0kYmFrOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8pOyBleGl0Owp9KTsK';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const U=process.env.WP_USER||'', P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='-u "'+U+':'+P+'"';
function wj(m,path,body){fs.writeFileSync('/tmp/wb.json', JSON.stringify(body));
  return execSync('curl -sk '+AUTH+' -X '+m+' -H "Content-Type: application/json" --data-binary @/tmp/wb.json "https://dev.avesa.lt/wp-json/'+path+'"',{maxBuffer:50e6,timeout:70000}).toString();}
function putB64(name,b64){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+name;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b64,...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
const o={}; let sid=null;
try{
  const php = Buffer.from(PHPB64,'base64').toString('utf8');
  const mk=wj('POST','code-snippets/v1/snippets',{name:'WA2 (temp)',code:php,scope:'front-end',active:true,priority:5});
  try{sid=JSON.parse(mk).id;}catch(e){o.mk=String(mk).slice(0,150);}
  execSync('sleep 5');
  try{ const r=execSync('curl -sk --max-time 50 "https://dev.avesa.lt/?ps_wa2=APPLY_WET27B"',{maxBuffer:5e6,timeout:60000}).toString();
    const i=r.indexOf('{'),k=r.lastIndexOf('}');
    if(i>=0&&k>i) o.result=JSON.parse(r.slice(i,k+1)); else o.raw=r.slice(0,200);
  }catch(e){ o.curl_err=String(e).slice(0,120); }
}catch(e){o.err=String(e).slice(0,200);}
try{ if(sid!=null) execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"'); }catch(e){}
putB64('wa2.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
