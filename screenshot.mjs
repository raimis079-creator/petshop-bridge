import { execSync } from 'child_process';
import fs from 'fs';
const PHPB64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX2JsayddKSB8fCAkX0dFVFsncHNfYmxrJ10hPT0nQmxreCcpIHJldHVybjsKICB3aGlsZShvYl9nZXRfbGV2ZWwoKSkgb2JfZW5kX2NsZWFuKCk7CiAgZ2xvYmFsICR3cGRiOyAkbz1hcnJheSgpOyAkdD0kd3BkYi0+cHJlZml4Lidwc19wZXRzJzsKICAkcGV0cz0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCx1c2VyX2lkLHBldF9uYW1lLHNwZWNpZXMgRlJPTSAkdCBXSEVSRSBkZWxldGVkX2F0IElTIE5VTEwgQU5EIHNwZWNpZXMgSU4gKCdkb2cnLCdjYXQnKSBPUkRFUiBCWSBpZCBERVNDIExJTUlUIDYiLEFSUkFZX0EpOwogIGZvcmVhY2goJHBldHMgYXMgJHApewogICAgd3Bfc2V0X2N1cnJlbnRfdXNlcigoaW50KSRwWyd1c2VyX2lkJ10pOwogICAgJHI9bmV3IFdQX1JFU1RfUmVxdWVzdCgnR0VUJyk7ICRyLT5zZXRfcGFyYW0oJ2lkJywkcFsnaWQnXSk7CiAgICAkcmVzPVBldHNob3BfUGV0X0Rhc2hib2FyZDo6aGFuZGxlX2Rhc2hib2FyZCgkcik7CiAgICAkZD1pc193cF9lcnJvcigkcmVzKT9hcnJheSgnZXJyJz0+JHJlcy0+Z2V0X2Vycm9yX21lc3NhZ2UoKSk6JHJlcy0+Z2V0X2RhdGEoKTsKICAgICRvWydwZXRzJ11bXT1hcnJheSgKICAgICAgJ3BldCc9PiRwWydwZXRfbmFtZSddLCd1aWQnPT4oaW50KSRwWyd1c2VyX2lkJ10sCiAgICAgICdyZWZpbGxfaGFzX2RhdGEnPT5pc3NldCgkZFsncmVmaWxsJ11bJ2hhc19kYXRhJ10pPyRkWydyZWZpbGwnXVsnaGFzX2RhdGEnXTpudWxsLAogICAgICAncmVmaWxsX2RheXMnPT5pc3NldCgkZFsncmVmaWxsJ11bJ2RheXNfbGVmdCddKT8kZFsncmVmaWxsJ11bJ2RheXNfbGVmdCddOm51bGwsCiAgICAgICdyZW1pbmRlcnMnPT5pc3NldCgkZFsncmVtaW5kZXJzJ10pP2NvdW50KCRkWydyZW1pbmRlcnMnXSk6bnVsbCwKICAgICAgJ3NoZWxmJz0+aXNzZXQoJGRbJ3NoZWxmJ10pP2NvdW50KCRkWydzaGVsZiddKTpudWxsLAogICAgICAncmh5dGhtJz0+aXNzZXQoJGRbJ3JoeXRobSddKT8oaXNfYXJyYXkoJGRbJ3JoeXRobSddKT9qc29uX2VuY29kZSgkZFsncmh5dGhtJ10pOiRkWydyaHl0aG0nXSk6bnVsbCwKICAgICAgJ3Jha3RhaSc9PmFycmF5X2tleXMoKGFycmF5KSRkKSwKICAgICk7CiAgfQogIC8vIGFyIHJlZmlsbF90cmFja2luZyBhcHNrcml0YWkgdHVyaSBkdW9tZW51CiAgJHJ0PSR3cGRiLT5wcmVmaXguJ3BzX3JlZmlsbF90cmFja2luZyc7CiAgJG9bJ3JlZmlsbF9sZW50ZWxlJ109KGJvb2wpJHdwZGItPmdldF92YXIoIlNIT1cgVEFCTEVTIExJS0UgJyRydCciKTsKICBpZigkb1sncmVmaWxsX2xlbnRlbGUnXSl7CiAgICAkb1sncmVmaWxsX2VpbHVjaXUnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSAkcnQiKTsKICAgICRvWydyZWZpbGxfc3R1bHBlbGlhaSddPSR3cGRiLT5nZXRfY29sKCJTSE9XIENPTFVNTlMgRlJPTSAkcnQiKTsKICAgICRvWydyZWZpbGxfcHZ6J109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgKiBGUk9NICRydCBMSU1JVCAzIixBUlJBWV9BKTsKICB9CiAgJG9bJ3V6c2FreW11J109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyR3cGRiLT5wcmVmaXh9d2Nfb3JkZXJzIFdIRVJFIHN0YXR1cz0nd2MtY29tcGxldGVkJyIpOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8pOyBleGl0Owp9KTsK';
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
  for(let a=0;a<3;a++){ try{ mk=wj('POST','code-snippets/v1/snippets',{name:'BLK '+Date.now(),code:php,scope:'front-end',active:true,priority:5});
    if(mk && mk.indexOf('"id"')>=0) break; }catch(e){} execSync('sleep 8'); }
  try{sid=JSON.parse(mk).id;}catch(e){o.mk=String(mk).slice(0,150);}
  execSync('sleep 5');
  const r=execSync('curl -sk --max-time 90 "https://dev.avesa.lt/?ps_blk=Blkx"',{maxBuffer:20e6,timeout:110000}).toString();
  const i=r.indexOf('{'),k=r.lastIndexOf('}');
  if(i>=0&&k>i){ try{ o.result=JSON.parse(r.slice(i,k+1)); }catch(e){ o.rawslice=r.slice(i,i+400); } }
}catch(e){o.err=String(e).slice(0,200);}
try{ if(sid!=null) execSync('curl -sk --max-time 60 '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"'); }catch(e){}
putB64('blk.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
