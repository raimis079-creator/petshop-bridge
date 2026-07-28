import { execSync } from 'child_process';
import fs from 'fs';
const PHPB64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3NuMiddKSB8fCAkX0dFVFsncHNfc24yJ10hPT0nU24yeCcpIHJldHVybjsKICAkbz1hcnJheSgpOyAkbmVlZGxlPSdmdW5jdGlvbiBwZXRzaG9wX2FkZF9jb21wYW55X2ZpZWxkcyc7CiAgLy8gMS4gUmVmbGVrc2lqYSDigJQga3VyIGZ1bmtjaWphIGFwaWJyZXp0YQogIGlmKGZ1bmN0aW9uX2V4aXN0cygncGV0c2hvcF9hZGRfY29tcGFueV9maWVsZHMnKSl7CiAgICAkcj1uZXcgUmVmbGVjdGlvbkZ1bmN0aW9uKCdwZXRzaG9wX2FkZF9jb21wYW55X2ZpZWxkcycpOwogICAgJG9bJ2ZhaWxhcyddPSRyLT5nZXRGaWxlTmFtZSgpOyAkb1snZWlsdXRlJ109JHItPmdldFN0YXJ0TGluZSgpOyAkb1sncGFiYWlnYSddPSRyLT5nZXRFbmRMaW5lKCk7CiAgICAkZj0kci0+Z2V0RmlsZU5hbWUoKTsKICAgIGlmKCRmICYmIGZpbGVfZXhpc3RzKCRmKSAmJiBzdHJwb3MoJGYsJ2V2YWwnKT09PWZhbHNlKXsKICAgICAgJGxpbmVzPWZpbGUoJGYpOwogICAgICAkb1sna29kYXMnXT1pbXBsb2RlKCcnLGFycmF5X3NsaWNlKCRsaW5lcyxtYXgoMCwkci0+Z2V0U3RhcnRMaW5lKCktMyksJHItPmdldEVuZExpbmUoKS0kci0+Z2V0U3RhcnRMaW5lKCkrNikpOwogICAgfQogIH0gZWxzZSB7ICRvWydmdW5rY2lqYSddPSdORVJBU1RBJzsgfQogIC8vIDIuIFN1c2lqdXNpb3MgZnVua2Npam9zCiAgZm9yZWFjaChhcnJheSgncGV0c2hvcF9zYXZlX2NvbXBhbnlfZmllbGRzJywncGV0c2hvcF9jb21wYW55X2ZpZWxkcycsJ3BldHNob3BfdmFsaWRhdGVfY29tcGFueScpIGFzICRmbil7CiAgICBpZihmdW5jdGlvbl9leGlzdHMoJGZuKSl7ICRyMj1uZXcgUmVmbGVjdGlvbkZ1bmN0aW9uKCRmbik7ICRvWydraXRvcyddWyRmbl09JHIyLT5nZXRGaWxlTmFtZSgpLic6Jy4kcjItPmdldFN0YXJ0TGluZSgpOyB9CiAgfQogIC8vIDMuIFNuaXBwZXR1b3NlIChiZSBtYW5vIHRlbXApCiAgZ2xvYmFsICR3cGRiOyAkdD0kd3BkYi0+cHJlZml4LidzbmlwcGV0cyc7CiAgaWYoJHdwZGItPmdldF92YXIoIlNIT1cgVEFCTEVTIExJS0UgJyR0JyIpKXsKICAgICRyb3dzPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLG5hbWUsYWN0aXZlIEZST00gJHQgV0hFUkUgY29kZSBMSUtFICclYmlsbGluZ19jb21wYW55X2NvZGUlJyBBTkQgbmFtZSBOT1QgTElLRSAnJXRlbXAlJyIsQVJSQVlfQSk7CiAgICAkb1snc25pcHBldGFpX3N1X2NvbXBhbnlfY29kZSddPSRyb3dzOwogICAgaWYoJHJvd3MpeyAkb1snc25pcHBldF9rb2RhcyddPSR3cGRiLT5nZXRfdmFyKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgY29kZSBGUk9NICR0IFdIRVJFIGlkPSVkIiwkcm93c1swXVsnaWQnXSkpOyB9CiAgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8pOyBleGl0Owp9KTsK';
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
  for(let a=0;a<2;a++){ try{ mk=wj('POST','code-snippets/v1/snippets',{name:'SN2 (t)',code:php,scope:'front-end',active:true,priority:5}); break; }catch(e){ execSync('sleep 5'); } }
  try{sid=JSON.parse(mk).id;}catch(e){o.mk=String(mk).slice(0,150);}
  execSync('sleep 5');
  try{ const r=execSync('curl -sk --max-time 70 "https://dev.avesa.lt/?ps_sn2=Sn2x"',{maxBuffer:8e6,timeout:85000}).toString();
    const i=r.indexOf('{'),k=r.lastIndexOf('}'); if(i>=0&&k>i) o.result=JSON.parse(r.slice(i,k+1)); else o.raw=r.slice(0,250); }catch(e){ o.e=String(e).slice(0,100); }
}catch(e){o.err=String(e).slice(0,200);}
try{ if(sid!=null) execSync('curl -sk --max-time 60 '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"'); }catch(e){}
putB64('sn2.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
