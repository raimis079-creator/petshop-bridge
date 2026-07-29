import { execSync } from 'child_process';
import fs from 'fs';
const PHPB64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX29iaiddKSB8fCAkX0dFVFsncHNfb2JqJ10hPT0nT2JqeCcpIHJldHVybjsKICB3aGlsZShvYl9nZXRfbGV2ZWwoKSkgb2JfZW5kX2NsZWFuKCk7CiAgZ2xvYmFsICR3cGRiOyAkbz1hcnJheSgpOyAkcGY9JHdwZGItPnByZWZpeDsKICAkd2FudD1hcnJheSgKICAgICdQZXQnPT4ncHNfcGV0cycsJ1BldFByb2R1Y3RMaW5rJz0+J3BzX3BldF9wcm9kdWN0cycsJ0ZlZWRpbmdUYWJsZSc9Pidwc19mZWVkaW5nX3RhYmxlcycsCiAgICAnRmVlZGluZ1Jvd3MnPT4ncHNfZmVlZGluZ19yb3dzJywnRmVlZGluZ01hcCc9Pidwc19mZWVkaW5nX21hcCcsJ0ZlZWRpbmdQbGFuJz0+J3BzX2ZlZWRpbmdfcGxhbnMnLAogICAgJ1JlZmlsbFN0YXRlJz0+J3BzX3JlZmlsbF90cmFja2luZycsJ1BldE5vdGUnPT4ncHNfcGV0X25vdGVzJywnUmVtaW5kZXInPT4ncHNfcmVtaW5kZXJzJywKICAgICdCb251c0xlZGdlcic9Pidwc19ib251c19sZWRnZXInLCdSZXdhcmRDYXRhbG9nSXRlbSc9Pidwc19yZXdhcmRfY2F0YWxvZycsCiAgICAnUmV3YXJkUmVkZW1wdGlvbic9Pidwc19yZXdhcmRfcmVkZW1wdGlvbnMnLCdDb250ZW50SW1wcmVzc2lvbic9Pidwc19jb250ZW50X2ltcHJlc3Npb25zJywKICAgICdQbGFuRXZlbnRzJz0+J3BzX3BsYW5fZXZlbnRzJywKICApOwogIGZvcmVhY2goJHdhbnQgYXMgJGs9PiR0KXsKICAgICRmdWxsPSRwZi4kdDsKICAgICRleD0oYm9vbCkkd3BkYi0+Z2V0X3ZhcigiU0hPVyBUQUJMRVMgTElLRSAnJGZ1bGwnIik7CiAgICAkb1snb2JqZWt0YWknXVska109YXJyYXkoJ2xlbnRlbGUnPT4kdCwneXJhJz0+JGV4LCdlaWx1Y2l1Jz0+JGV4PyhpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICRmdWxsIik6bnVsbCk7CiAgfQogIC8vIHZpc29zIHBzXyBsZW50ZWxlcyAoZ2FsIHZhcmRhaSBraXRva2llKQogICRvWyd2aXNvc19wcyddPSR3cGRiLT5nZXRfY29sKCJTSE9XIFRBQkxFUyBMSUtFICd7JHBmfXBzXyUnIik7CiAgLy8gcHNfcGV0cyBzdHVscGVsaWFpIOKAlCBhciB5cmEgYWN0aXZpdHlfbGV2ZWwgLyB3ZWlnaHRfbWVhc3VyZWRfYXQKICAkY29scz0kd3BkYi0+Z2V0X2NvbCgiU0hPVyBDT0xVTU5TIEZST00geyRwZn1wc19wZXRzIik7CiAgJG9bJ3BldHNfc3R1bHBlbGlhaSddPSRjb2xzOwogIGZvcmVhY2goYXJyYXkoJ2N1cnJlbnRfd2VpZ2h0X2tnJywnd2VpZ2h0X3VwZGF0ZWRfYXQnLCd3ZWlnaHRfbWVhc3VyZWRfYXQnLCdhY3Rpdml0eV9sZXZlbCcsJ2FjdGl2aXR5X2hpbnQnLCdpc19zdGVyaWxpc2VkJywnbGlmZV9zdGFnZScpIGFzICRjKQogICAgJG9bJ3BldHNfdHVyaSddWyRjXT1pbl9hcnJheSgkYywkY29scyx0cnVlKTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSk7Cg==';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const U=process.env.WP_USER||'', P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='-u "'+U+':'+P+'"';
function wj(m,path,body){fs.writeFileSync('/tmp/wb.json', JSON.stringify(body));
  return execSync('curl -sk --max-time 150 '+AUTH+' -X '+m+' -H "Content-Type: application/json" --data-binary @/tmp/wb.json "https://dev.avesa.lt/wp-json/'+path+'"',{maxBuffer:50e6,timeout:170000}).toString();}
function putB64(name,b64){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+name;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b64,...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
const o={}; let sid=null;
try{
  const php = Buffer.from(PHPB64,'base64').toString('utf8');
  let mk=null;
  for(let a=0;a<3;a++){ try{ mk=wj('POST','code-snippets/v1/snippets',{name:'OBJ '+Date.now(),code:php,scope:'front-end',active:true,priority:5});
    if(mk && mk.indexOf('"id"')>=0) break; }catch(e){} execSync('sleep 8'); }
  try{sid=JSON.parse(mk).id;}catch(e){}
  execSync('sleep 5');
  const r=execSync('curl -sk --max-time 70 "https://dev.avesa.lt/?ps_obj=Objx"',{maxBuffer:20e6}).toString();
  const i=r.indexOf('{'),k=r.lastIndexOf('}');
  if(i>=0&&k>i){ try{ o.result=JSON.parse(r.slice(i,k+1)); }catch(e){ o.rawslice=r.slice(i,i+300); } }
}catch(e){o.err=String(e).slice(0,200);}
try{ if(sid!=null) execSync('curl -sk --max-time 60 '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"'); }catch(e){}
putB64('obj.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
