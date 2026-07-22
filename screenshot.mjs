const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfcHJvZjInXSl8fCRfR0VUWydwc19wcm9mMiddIT09J1MyS3c4TngnKXtyZXR1cm47fQoJQHNldF90aW1lX2xpbWl0KDYwKTsgJG89YXJyYXkoKTsKCSRhcz1XUF9QTFVHSU5fRElSLicvcGV0c2hvcC1jb3JlL2Fzc2V0cyc7ICRpbmM9V1BfUExVR0lOX0RJUi4nL3BldHNob3AtY29yZS9pbmNsdWRlcyc7CgkkcHA9QGZpbGVfZ2V0X2NvbnRlbnRzKCRhcy4nL3BldC1wcm9maWxlLmpzJyk7CgkkZGI9QGZpbGVfZ2V0X2NvbnRlbnRzKCRpbmMuJy9jbGFzcy1wZXQtZGFzaGJvYXJkLnBocCcpOwoJJG9bJ3NpemVzJ109YXJyYXkoJ3BwJz0+c3RybGVuKCRwcCksJ2RiJz0+c3RybGVuKCRkYikpOwoJJGN0eD1mdW5jdGlvbigkaCwkbmVlZGxlLCRiPTIwMCwkYT02NTApeyAkb3V0PWFycmF5KCk7ICRvZmY9MDsgZm9yKCRpPTA7JGk8MzskaSsrKXsgJHA9c3RycG9zKCRoLCRuZWVkbGUsJG9mZik7IGlmKCRwPT09ZmFsc2UpYnJlYWs7ICRvdXRbXT1iYXNlNjRfZW5jb2RlKHN1YnN0cigkaCxtYXgoMCwkcC0kYiksJGIrJGEpKTsgJG9mZj0kcCtzdHJsZW4oJG5lZWRsZSk7IH0gcmV0dXJuICRvdXQ7IH07Cgkkb1sncHBfbG9hZCddPSRjdHgoJHBwLCdyZW5kZXJQcm9maWxlJykgPzogJGN0eCgkcHAsJ2Z1bmN0aW9uIHJlbmRlcicpOwoJJG9bJ3BwX2Zvb2QnXT0kY3R4KCRwcCwnY3VycmVudF9mb29kJyk7Cgkkb1sncHBfcHJvZCddPSRjdHgoJHBwLCdwcmltYXJ5X3Byb2R1Y3QnKTsKCSRvWydwcF93ZWlnaHQnXT0kY3R4KCRwcCwnd2VpZ2h0X2tnJykgPzogJGN0eCgkcHAsJ3N2b3InKTsKCSRvWydwcF9yZWZpbGwnXT0kY3R4KCRwcCwncmVmaWxsJyk7Cgkkb1snZGJfcm91dGUnXT0kY3R4KCRkYiwnL3Byb2ZpbGUnKSA/OiAkY3R4KCRkYiwncmVnaXN0ZXJfcmVzdF9yb3V0ZScpOwoJJG9bJ2RiX3BheWxvYWQnXT0kY3R4KCRkYiwncHJpbWFyeV9wcm9kdWN0JykgPzogJGN0eCgkZGIsJ3BldF9uYW1lJyk7Cgkkb1snZGJfd2VpZ2h0J109JGN0eCgkZGIsJ2N1cnJlbnRfd2VpZ2h0Jyk7CgllY2hvIGpzb25fZW5jb2RlKCRvLCBKU09OX0lOVkFMSURfVVRGOF9TVUJTVElUVVRFKTsgZXhpdDsKfSk7Cg==';
import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const U=process.env.WP_USER||'', P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='-u "'+U+':'+P+'"';
function wj(m,path,body){fs.writeFileSync('/tmp/wbody.json', JSON.stringify(body));
  return execSync('curl -sk '+AUTH+' -X '+m+' -H "Content-Type: application/json" --data-binary @/tmp/wbody.json "https://dev.avesa.lt/wp-json/'+path+'"',{maxBuffer:50*1024*1024,timeout:70000}).toString();}
function pr(n,ob){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?nocache='+Math.random()+'"').toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:Buffer.from(JSON.stringify(ob)).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"').toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 2'); }return 'fail';}
const o={};
const mk=wj('POST','code-snippets/v1/snippets',{name:'PROF2 (temp)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:5});
let sid; try{sid=JSON.parse(mk).id;}catch(e){o.mkerr=String(mk).slice(0,200);}
o.d=(function(){try{const r=execSync('curl -sk --max-time 55 '+AUTH+' "https://dev.avesa.lt/?ps_prof2=S2Kw8Nx"',{maxBuffer:10*1024*1024,timeout:60000}).toString();const i=r.indexOf('{');return i>=0?JSON.parse(r.slice(i)):{raw:r.slice(0,300)};}catch(e){return{err:String(e).slice(0,200)};}})();
if(sid){ try{wj('POST','code-snippets/v1/snippets/'+sid,{active:false});}catch(e){} try{execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"');}catch(e){} }
console.log('PUT:',pr('prof2.json',o));
