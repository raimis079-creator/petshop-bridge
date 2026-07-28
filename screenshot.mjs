import { execSync } from 'child_process';
import fs from 'fs';
const PHPB64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX2F2J10pIHx8ICRfR0VUWydwc19hdiddIT09J0F2eCcpIHJldHVybjsKICAkbz1hcnJheSgpOwogICR0cGw9d29vY29tbWVyY2VfbG9jYXRlX3RlbXBsYXRlKCdteWFjY291bnQvbmF2aWdhdGlvbi5waHAnLCcnLCcnKTsKICAkb1snc2FibG9uYXMnXT0kdHBsOwogIGlmKGZpbGVfZXhpc3RzKCR0cGwpKXsKICAgICRjPWZpbGVfZ2V0X2NvbnRlbnRzKCR0cGwpOwogICAgJG9bJ2lsZ2lzJ109c3RybGVuKCRjKTsKICAgIC8vIGlzdHJhdWtpYW0gZGFsaSBzdSBhdmF0YXJ1IC8gdmFyZHUKICAgICRpPXN0cmlwb3MoJGMsJ2F2YXRhcicpOwogICAgJG9bJ2F2YXRhcm9fZGFsaXMnXT0gJGkhPT1mYWxzZSA/IHN1YnN0cigkYyxtYXgoMCwkaS03MDApLDE0MDApIDogJyhuZXJhc3RhIGF2YXRhciknOwogIH0KICAvLyBhciBGbGF0c29tZSB0dXJpIHNhdm8gZnVua2NpamFzCiAgZm9yZWFjaChhcnJheSgnZmxhdHNvbWVfbXlfYWNjb3VudF9hdmF0YXInLCdmbGF0c29tZV9hY2NvdW50X2F2YXRhcicpIGFzICRmKXsKICAgIGlmKGZ1bmN0aW9uX2V4aXN0cygkZikpeyAkcj1uZXcgUmVmbGVjdGlvbkZ1bmN0aW9uKCRmKTsgJG9bJ2Z1bmtjaWpvcyddWyRmXT0kci0+Z2V0RmlsZU5hbWUoKS4nOicuJHItPmdldFN0YXJ0TGluZSgpOyB9CiAgfQogIC8vIHZhcnRvdG9qbyB2YXJkYWkKICAkdT1nZXRfdXNlcl9ieSgnaWQnLDEpOwogICRvWyd2YXJkYWknXT1hcnJheSgnbG9naW4nPT4kdS0+dXNlcl9sb2dpbiwnZGlzcGxheV9uYW1lJz0+JHUtPmRpc3BsYXlfbmFtZSwKICAgICdmaXJzdCc9PiR1LT5maXJzdF9uYW1lLCdsYXN0Jz0+JHUtPmxhc3RfbmFtZSwnbmlja25hbWUnPT5nZXRfdXNlcl9tZXRhKDEsJ25pY2tuYW1lJyx0cnVlKSk7CiAgJG9bJ2F2YXRhcl9odG1sJ109Z2V0X2F2YXRhcigxLDgwKTsKICAkb1snYXZhdGFyX2ZpbHRyYWknXT1hcnJheSgpOwogIGdsb2JhbCAkd3BfZmlsdGVyOwogIGZvcmVhY2goYXJyYXkoJ2dldF9hdmF0YXInLCdwcmVfZ2V0X2F2YXRhcicsJ2dldF9hdmF0YXJfdXJsJykgYXMgJGgpewogICAgaWYoIWVtcHR5KCR3cF9maWx0ZXJbJGhdKSkgZm9yZWFjaCgkd3BfZmlsdGVyWyRoXS0+Y2FsbGJhY2tzIGFzICRwcmlvPT4kY2JzKSBmb3JlYWNoKCRjYnMgYXMgJGNiKXsKICAgICAgJGY9JGNiWydmdW5jdGlvbiddOwogICAgICAkbj1pc19hcnJheSgkZik/KChpc19vYmplY3QoJGZbMF0pP2dldF9jbGFzcygkZlswXSk6JGZbMF0pLic6OicuJGZbMV0pOigkZiBpbnN0YW5jZW9mIENsb3N1cmU/J0Nsb3N1cmUnOihzdHJpbmcpJGYpOwogICAgICAkb1snYXZhdGFyX2ZpbHRyYWknXVtdPSRoLicgJy4kcHJpby4nOicuJG47CiAgICB9CiAgfQogIC8vIGF1Z2ludGluaXUgbnVvdHJhdWtvcwogIGdsb2JhbCAkd3BkYjsgJHQ9JHdwZGItPnByZWZpeC4ncHNfcGV0cyc7CiAgJG9bJ2F1Z2ludGluaWFpJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQscGV0X25hbWUsc3BlY2llcyxwaG90b19maWxlX2lkLGlzX3ByaW1hcnkgRlJPTSAkdCBXSEVSRSB1c2VyX2lkPTEgQU5EIGRlbGV0ZWRfYXQgSVMgTlVMTCBPUkRFUiBCWSBpc19wcmltYXJ5IERFU0MsIGlkIEFTQyIsQVJSQVlfQSk7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0pOwo=';
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
  for(let a=0;a<2;a++){ try{ mk=wj('POST','code-snippets/v1/snippets',{name:'AV (t)',code:php,scope:'front-end',active:true,priority:5}); break; }catch(e){ execSync('sleep 5'); } }
  try{sid=JSON.parse(mk).id;}catch(e){o.mk=String(mk).slice(0,150);}
  execSync('sleep 5');
  try{ const r=execSync('curl -sk --max-time 70 "https://dev.avesa.lt/?ps_av=Avx"',{maxBuffer:8e6,timeout:85000}).toString();
    const i=r.indexOf('{'),k=r.lastIndexOf('}'); if(i>=0&&k>i) o.result=JSON.parse(r.slice(i,k+1)); else o.raw=r.slice(0,300); }catch(e){ o.e=String(e).slice(0,150); }
}catch(e){o.err=String(e).slice(0,200);}
try{ if(sid!=null) execSync('curl -sk --max-time 60 '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"'); }catch(e){}
putB64('av.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
