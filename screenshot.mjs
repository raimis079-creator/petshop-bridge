import { execSync } from 'child_process';
import fs from 'fs';
const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX21pZzIzJ10pIHx8ICRfR0VUWydwc19taWcyMyddIT09J01nMjNUbXAnKSByZXR1cm47CiAgZ2xvYmFsICR3cGRiOyAkbz1hcnJheSgpOyAkdD0kd3BkYi0+cHJlZml4Lidwc19wZXRzJzsKICAkZmxhZyA9IGRpcm5hbWUoZGlybmFtZShydHJpbShBQlNQQVRILCcvXFwnKSkpLicvcHNfcHJpdmF0ZS9wc19wZXRzX2ZyZWV6ZV9PTic7CiAgJG9bJ2ZyZWV6ZV9mbGFnJ109aXNfZmlsZSgkZmxhZyk7CiAgaWYoJG9bJ2ZyZWV6ZV9mbGFnJ10peyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvKTsgZXhpdDsgfQogICRjb2xzPSR3cGRiLT5nZXRfY29sKCJTSE9XIENPTFVNTlMgRlJPTSAkdCIsMCk7CiAgJG5lZWQ9YXJyYXkoJ2JpcnRoX2RhdGUnLCdzZW5zaXRpdml0aWVzJywnaG91c2luZycpOwogICRtaXNzaW5nPWFycmF5X3ZhbHVlcyhhcnJheV9kaWZmKCRuZWVkLCRjb2xzKSk7CiAgJG9bJ21pc3NpbmdfYmVmb3JlJ109JG1pc3Npbmc7CiAgaWYoJG1pc3NpbmcpewogICAgJGJhaz0kdC4nX2Jha18yMDI2MDcyM19wcm9mJzsKICAgIGlmKCEkd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0hPVyBUQUJMRVMgTElLRSAlcyIsJGJhaykpKXsKICAgICAgJHdwZGItPnF1ZXJ5KCJDUkVBVEUgVEFCTEUgJGJhayBMSUtFICR0Iik7CiAgICAgICR3cGRiLT5xdWVyeSgiSU5TRVJUIElOVE8gJGJhayBTRUxFQ1QgKiBGUk9NICR0Iik7CiAgICB9CiAgICAkb1snYmFrX3Jvd3MnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSAkYmFrIik7CiAgICBpZihpbl9hcnJheSgnYmlydGhfZGF0ZScsJG1pc3NpbmcpKSAkd3BkYi0+cXVlcnkoIkFMVEVSIFRBQkxFICR0IEFERCBDT0xVTU4gYmlydGhfZGF0ZSBEQVRFIE5VTEwgQUZURVIgc3BlY2llc19kZXRhaWwiKTsKICAgIGlmKGluX2FycmF5KCdzZW5zaXRpdml0aWVzJywkbWlzc2luZykpICR3cGRiLT5xdWVyeSgiQUxURVIgVEFCTEUgJHQgQUREIENPTFVNTiBzZW5zaXRpdml0aWVzIFZBUkNIQVIoMjU1KSBOVUxMIEFGVEVSIHByaW1hcnlfbmVlZCIpOwogICAgaWYoaW5fYXJyYXkoJ2hvdXNpbmcnLCRtaXNzaW5nKSkgJHdwZGItPnF1ZXJ5KCJBTFRFUiBUQUJMRSAkdCBBREQgQ09MVU1OIGhvdXNpbmcgVkFSQ0hBUigxNikgTlVMTCBBRlRFUiBzZW5zaXRpdml0aWVzIik7CiAgICAkb1snZGJfZXJyJ109JHdwZGItPmxhc3RfZXJyb3I7CiAgfQogICRvWydjb2xzX2FmdGVyJ109JHdwZGItPmdldF9jb2woIlNIT1cgQ09MVU1OUyBGUk9NICR0IiwwKTsKICAkb1sncm93cyddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICR0Iik7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0pOwo=';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const U=process.env.WP_USER||'', P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='-u "'+U+':'+P+'"';
function wj(m,path,body){fs.writeFileSync('/tmp/wb.json', JSON.stringify(body));
  return execSync('curl -sk '+AUTH+' -X '+m+' -H "Content-Type: application/json" --data-binary @/tmp/wb.json "https://dev.avesa.lt/wp-json/'+path+'"',{maxBuffer:50*1024*1024,timeout:70000}).toString();}
function putB64(name,b64){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+name;let s='';
 for(let i=0;i<5;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50*1024*1024}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b64,...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50*1024*1024}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 2');}return 'fail';}
const mk=wj('POST','code-snippets/v1/snippets',{name:'MIG23 (temp)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:5});
let sid; try{sid=JSON.parse(mk).id;}catch(e){}
execSync('sleep 3');
let r='';
try{ r=execSync('curl -sk "https://dev.avesa.lt/?ps_mig23=Mg23Tmp"',{maxBuffer:100*1024*1024,timeout:90000}).toString(); }catch(e){ r='ERR '+String(e).slice(0,200); }
if(sid){ try{wj('POST','code-snippets/v1/snippets/'+sid,{active:false});}catch(e){} try{execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"');}catch(e){} }
putB64('mig23.json', Buffer.from(r).toString('base64'));
console.log('done', r.length);
