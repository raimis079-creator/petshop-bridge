import { execSync } from 'child_process';
import fs from 'fs';
const PHPB64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX2xnMyddKSB8fCAkX0dFVFsncHNfbGczJ10hPT0nTGczeCcpIHJldHVybjsKICB3aGlsZShvYl9nZXRfbGV2ZWwoKSkgb2JfZW5kX2NsZWFuKCk7CiAgJG89YXJyYXkoKTsKICBnbG9iYWwgJHdwZGI7ICR0PSR3cGRiLT5wcmVmaXguJ3NuaXBwZXRzJzsKICAvLyAxLiBJU1ZBTE9NIG1hbm8gbGFpa2ludXMgc25pcHBldCd1cwogICR0bXA9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsbmFtZSBGUk9NICR0IFdIRVJFIG5hbWUgUkVHRVhQICdeKExHfExHMnxTMlswLTldWzAtOV18VjJbMC05XVswLTldfFRPS3xBWHxBUHxER3xPT1J8S0FUfENEfENPVnxSR3xSRzJ8Rk58Rkx8U058U04yfEFEUnxIS3xSRUd8RFNIfEQyfEFWfENIS3xWSVN8REJHfEhUTUx8UkVBTHxTRVR8VFB8VzYpKCB8JCknIEFORCBuYW1lIE5PVCBMSUtFICcld3JpdGVyJSciLEFSUkFZX0EpOwogICRvWydsYWlraW5pJ109JHRtcDsKICAkZGVsPTA7CiAgZm9yZWFjaCgkdG1wIGFzICRyKXsgJHdwZGItPmRlbGV0ZSgkdCxhcnJheSgnaWQnPT4kclsnaWQnXSkpOyAkZGVsKys7IH0KICAkb1snaXN0cmludGEnXT0kZGVsOwogICRvWydsaWtvJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJHQiKTsKCiAgLy8gMi4gSWVza29tIHRpa3JvIGxhbmdvIOKAlCBUSUsga29ua3JlY2l1b3NlIGZhaWx1b3NlCiAgJGZpbGVzPWFycmF5KCk7CiAgZm9yZWFjaChhcnJheShnZXRfc3R5bGVzaGVldF9kaXJlY3RvcnkoKSwgZ2V0X3RlbXBsYXRlX2RpcmVjdG9yeSgpKSBhcyAkZCl7CiAgICBmb3JlYWNoKGFycmF5KCcvZnVuY3Rpb25zLnBocCcsJy9zdHlsZS5jc3MnLCcvd29vY29tbWVyY2UvbXlhY2NvdW50L2Zvcm0tbG9naW4ucGhwJykgYXMgJGYpewogICAgICBpZihmaWxlX2V4aXN0cygkZC4kZikpICRmaWxlc1tdPSRkLiRmOwogICAgfQogIH0KICAvLyArIHZpc2kgZmxhdHNvbWUtY2hpbGQgZmFpbGFpIChuZWdpbGlhaSkKICAkY2Q9Z2V0X3N0eWxlc2hlZXRfZGlyZWN0b3J5KCk7CiAgZm9yZWFjaChnbG9iKCRjZC4nLyoucGhwJykgYXMgJGYpICRmaWxlc1tdPSRmOwogIGZvcmVhY2goZ2xvYigkY2QuJy8qLyoucGhwJykgYXMgJGYpICRmaWxlc1tdPSRmOwogIGZvcmVhY2goZ2xvYigkY2QuJy8qLmNzcycpIGFzICRmKSAkZmlsZXNbXT0kZjsKICAkZmlsZXM9YXJyYXlfdmFsdWVzKGFycmF5X3VuaXF1ZSgkZmlsZXMpKTsKICAkaGl0cz1hcnJheSgpOwogIGZvcmVhY2goJGZpbGVzIGFzICRmKXsKICAgICRjPUBmaWxlX2dldF9jb250ZW50cygkZik7CiAgICBpZighJGMpIGNvbnRpbnVlOwogICAgaWYoc3RycG9zKCRjLCdnYWzEl3NpdGUnKSE9PWZhbHNlIHx8IHN0cnBvcygkYywnR2F1dGkgcHJpc2lqdW5naW1vJykhPT1mYWxzZSB8fCBzdHJwb3MoJGMsJ1ByaXNpanVuZ2ltYXMgcHJpZSBQZXRzaG9wJykhPT1mYWxzZSl7CiAgICAgICRsaW5lcz1hcnJheSgpOwogICAgICBmb3JlYWNoKGV4cGxvZGUoIlxuIiwkYykgYXMgJGk9PiRsbil7CiAgICAgICAgaWYoc3RyaXBvcygkbG4sJ2dhbMSXc2l0ZScpIT09ZmFsc2V8fHN0cmlwb3MoJGxuLCdHYXV0aSBwcmlzaWp1bmdpbW8nKSE9PWZhbHNlfHxzdHJpcG9zKCRsbiwnUHJpc2lqdW5naW1hcyBwcmllIFBldHNob3AnKSE9PWZhbHNlKSAkbGluZXNbXT0oJGkrMSk7CiAgICAgIH0KICAgICAgJGhpdHNbXT1hcnJheSgnZic9PnN0cl9yZXBsYWNlKEFCU1BBVEgsJycsJGYpLCdlaWx1dGVzJz0+YXJyYXlfc2xpY2UoJGxpbmVzLDAsNiksJ2R5ZGlzJz0+c3RybGVuKCRjKSk7CiAgICB9CiAgfQogICRvWydyYXN0YSddPSRoaXRzOwogICRvWyd0aWtyaW50YV9mYWlsdSddPWNvdW50KCRmaWxlcyk7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0pOwo=';
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
  for(let a=0;a<3;a++){ try{ mk=wj('POST','code-snippets/v1/snippets',{name:'ZZ '+Date.now(),code:php,scope:'front-end',active:true,priority:5});
    if(mk && mk.indexOf('"id"')>=0) break; }catch(e){} execSync('sleep 8'); }
  try{sid=JSON.parse(mk).id;}catch(e){o.mk=String(mk).slice(0,150);}
  execSync('sleep 5');
  const r=execSync('curl -sk --max-time 70 "https://dev.avesa.lt/?ps_lg3=Lg3x"',{maxBuffer:8e6,timeout:85000}).toString();
  const i=r.indexOf('{'),k=r.lastIndexOf('}');
  if(i>=0&&k>i){ try{ o.result=JSON.parse(r.slice(i,k+1)); }catch(e){ o.rawslice=r.slice(i,i+400); } }
  else o.raw=r.slice(0,400);
}catch(e){o.err=String(e).slice(0,200);}
try{ if(sid!=null) execSync('curl -sk --max-time 60 '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"'); }catch(e){}
putB64('lg3.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
