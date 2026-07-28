import { execSync } from 'child_process';
import fs from 'fs';
const PHPB64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3NjJ10pIHx8ICRfR0VUWydwc19zYyddIT09J1NjeCcpIHJldHVybjsKICBnbG9iYWwgJHdwZGI7ICRvPWFycmF5KCk7CiAgLy8ga3VyIG5hdWRvamFtYXMgc2hvcnRjb2RlCiAgJHJvd3M9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgSUQsIHBvc3RfdGl0bGUsIHBvc3RfbmFtZSwgcG9zdF9zdGF0dXMsIHBvc3RfdHlwZSBGUk9NIHskd3BkYi0+cG9zdHN9CiAgICBXSEVSRSBwb3N0X2NvbnRlbnQgTElLRSAnJXBldHNob3BfcGV0X2Zvcm0lJyBBTkQgcG9zdF9zdGF0dXM9J3B1Ymxpc2gnIixBUlJBWV9BKTsKICAkb1sncHVzbGFwaWFpJ109YXJyYXkoKTsKICBmb3JlYWNoKCRyb3dzIGFzICRyKXsgJG9bJ3B1c2xhcGlhaSddW109YXJyYXkoJ2lkJz0+JHJbJ0lEJ10sJ3QnPT4kclsncG9zdF90aXRsZSddLCd1cmwnPT5nZXRfcGVybWFsaW5rKCRyWydJRCddKSwndGlwYXMnPT4kclsncG9zdF90eXBlJ10pOyB9CiAgJG9bJ2tpZWsnXT1jb3VudCgkcm93cyk7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0pOwo=';
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
  for(let a=0;a<3;a++){ try{ mk=wj('POST','code-snippets/v1/snippets',{name:'SC '+Date.now(),code:php,scope:'front-end',active:true,priority:5});
    if(mk && mk.indexOf('"id"')>=0) break; }catch(e){} execSync('sleep 8'); }
  try{sid=JSON.parse(mk).id;}catch(e){o.mk=String(mk).slice(0,150);}
  execSync('sleep 5');
  try{ const r=execSync('curl -sk --max-time 60 "https://dev.avesa.lt/?ps_sc=Scx"',{maxBuffer:8e6,timeout:75000}).toString();
    const i=r.indexOf('{'),k=r.lastIndexOf('}'); if(i>=0&&k>i) o.result=JSON.parse(r.slice(i,k+1)); }catch(e){ o.e=String(e).slice(0,150); }
  if(o.result && o.result.puslapiai && o.result.puslapiai.length){
    const u=o.result.puslapiai[0].url;
    const h=execSync('curl -sk --max-time 45 "'+u+'"',{maxBuffer:20e6}).toString();
    o.anon_forma = h.indexOf('id="pspet-form"')>=0;
    o.anon_js = h.indexOf('pet-form.js')>=0;
  }
}catch(e){o.err=String(e).slice(0,200);}
try{ if(sid!=null) execSync('curl -sk --max-time 60 '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"'); }catch(e){}
putB64('sc.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
