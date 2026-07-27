import { execSync } from 'child_process';
import fs from 'fs';
const PHPB64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3djMiddKSB8fCAkX0dFVFsncHNfd2MyJ10hPT0nV2MyeCcpIHJldHVybjsKICBnbG9iYWwgJHdwZGI7ICR0PSR3cGRiLT5wcmVmaXguJ3BzX3BldHMnOyAkYj0kd3BkYi0+cHJlZml4Lidwc19wZXRzX2Jha18yMDI2MDcyN193ZXQnOwogICRvPWFycmF5KCk7CiAgJG9bJ2JhY2t1cF95cmEnXT0oYm9vbCkkd3BkYi0+Z2V0X3ZhcigiU0hPVyBUQUJMRVMgTElLRSAnJGInIik7CiAgJG9bJ2JhY2t1cF9laWwnXT0kb1snYmFja3VwX3lyYSddPyhpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICRiIik6MDsKICAkb1snb3JpZ19laWwnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSAkdCIpOwogICRjb2xzPSR3cGRiLT5nZXRfY29sKCJTSE9XIENPTFVNTlMgRlJPTSAkdCIpOwogICRvWyd3ZXRfcHJvZHVjdF9pZF95cmEnXT1pbl9hcnJheSgnd2V0X3Byb2R1Y3RfaWQnLCRjb2xzKTsKICBpZigkb1snd2V0X3Byb2R1Y3RfaWRfeXJhJ10pewogICAgJG9bJ3NjaGVtYSddPSR3cGRiLT5nZXRfcm93KCJTRUxFQ1QgQ09MVU1OX1RZUEUsSVNfTlVMTEFCTEUsQ09MVU1OX0RFRkFVTFQsT1JESU5BTF9QT1NJVElPTiBGUk9NIGluZm9ybWF0aW9uX3NjaGVtYS5DT0xVTU5TCiAgICAgIFdIRVJFIFRBQkxFX1NDSEVNQT1EQVRBQkFTRSgpIEFORCBUQUJMRV9OQU1FPSd7JHdwZGItPnByZWZpeH1wc19wZXRzJyBBTkQgQ09MVU1OX05BTUU9J3dldF9wcm9kdWN0X2lkJyIsQVJSQVlfQSk7CiAgICAkb1snbmVfbnVsbCddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICR0IFdIRVJFIHdldF9wcm9kdWN0X2lkIElTIE5PVCBOVUxMIik7CiAgfQogICRvWydtb3N0bHlfd2V0J109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJHQgV0hFUkUgZmVlZGluZ190eXBlPSdtb3N0bHlfd2V0JyIpOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8pOyBleGl0Owp9KTsK';
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
  const mk=wj('POST','code-snippets/v1/snippets',{name:'WC2 (temp)',code:php,scope:'front-end',active:true,priority:5});
  try{sid=JSON.parse(mk).id;}catch(e){o.mk=String(mk).slice(0,150);}
  execSync('sleep 5');
  for(let a=0;a<3;a++){
    try{ const r=execSync('curl -sk --max-time 45 "https://dev.avesa.lt/?ps_wc2=Wc2x"',{maxBuffer:5e6,timeout:60000}).toString();
      const i=r.indexOf('{'),k=r.lastIndexOf('}');
      if(i>=0&&k>i){ o.result=JSON.parse(r.slice(i,k+1)); break; } }catch(e){ o.try=(o.try||0)+1; }
    execSync('sleep 5');
  }
}catch(e){o.err=String(e).slice(0,200);}
try{ if(sid!=null) execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"'); }catch(e){}
putB64('wetchk.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
