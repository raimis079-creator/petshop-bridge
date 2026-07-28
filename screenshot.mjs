import { execSync } from 'child_process';
import fs from 'fs';
const PHPB64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3NuJ10pIHx8ICRfR0VUWydwc19zbiddIT09J1NueCcpIHJldHVybjsKICBnbG9iYWwgJHdwZGI7ICRvPWFycmF5KCk7CiAgJHQ9JHdwZGItPnByZWZpeC4nc25pcHBldHMnOwogIGlmKCR3cGRiLT5nZXRfdmFyKCJTSE9XIFRBQkxFUyBMSUtFICckdCciKSl7CiAgICAkcm93cz0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCxuYW1lLGFjdGl2ZSxzY29wZSBGUk9NICR0IFdIRVJFIGNvZGUgTElLRSAnJXBldHNob3BfYWRkX2NvbXBhbnlfZmllbGRzJScgT1IgbmFtZSBMSUtFICclbW9uJScgT1IgbmFtZSBMSUtFICclb21wYW4lJyIsQVJSQVlfQSk7CiAgICAkb1snc25pcHBldGFpJ109JHJvd3M7CiAgICBmb3JlYWNoKCRyb3dzIGFzICRyKXsKICAgICAgJGNvZGU9JHdwZGItPmdldF92YXIoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBjb2RlIEZST00gJHQgV0hFUkUgaWQ9JWQiLCRyWydpZCddKSk7CiAgICAgIGlmKHN0cnBvcygkY29kZSwncGV0c2hvcF9hZGRfY29tcGFueV9maWVsZHMnKSE9PWZhbHNlKXsgJG9bJ2tvZGFzJ109JGNvZGU7ICRvWydzbmlwcGV0X2lkJ109JHJbJ2lkJ107IGJyZWFrOyB9CiAgICB9CiAgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8pOyBleGl0Owp9KTsK';
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
  for(let a=0;a<2;a++){ try{ mk=wj('POST','code-snippets/v1/snippets',{name:'SN (temp)',code:php,scope:'front-end',active:true,priority:5}); break; }catch(e){ execSync('sleep 5'); } }
  try{sid=JSON.parse(mk).id;}catch(e){o.mk=String(mk).slice(0,150);}
  execSync('sleep 5');
  try{ const r=execSync('curl -sk --max-time 70 "https://dev.avesa.lt/?ps_sn=Snx"',{maxBuffer:8e6,timeout:85000}).toString();
    const i=r.indexOf('{'),k=r.lastIndexOf('}'); if(i>=0&&k>i) o.result=JSON.parse(r.slice(i,k+1)); else o.raw=r.slice(0,250); }catch(e){ o.e=String(e).slice(0,100); }
}catch(e){o.err=String(e).slice(0,200);}
try{ if(sid!=null) execSync('curl -sk --max-time 60 '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"'); }catch(e){}
putB64('sn.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
