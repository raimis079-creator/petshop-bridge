const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfejEnXSl8fCRfR0VUWydwc196MSddIT09J1oxS3c4TngnKXtyZXR1cm47fQoJQHNldF90aW1lX2xpbWl0KDYwKTsKCWdsb2JhbCAkd3BkYjsgJHBmPSR3cGRiLT5wcmVmaXg7ICRhPSRfR0VUWydhJ10/PycnOyAkbz1hcnJheSgpOwoJJHByaXY9ZGlybmFtZShkaXJuYW1lKHJ0cmltKEFCU1BBVEgsJy9cXCcpKSkuJy9wc19wcml2YXRlJzsKCSRmbGFnPSRwcml2LicvcHNfcGV0c19mcmVlemVfT04nOyAkdG9rZj0kcHJpdi4nL3BzX3BldHNfZnJlZXplX3Rva2VuJzsKCSRoYXNoPWZ1bmN0aW9uKCkgdXNlICgkd3BkYiwkcGYpewoJCSRjb2xzPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgQ09MVU1OX05BTUUgRlJPTSBpbmZvcm1hdGlvbl9zY2hlbWEuQ09MVU1OUyBXSEVSRSBUQUJMRV9TQ0hFTUE9REFUQUJBU0UoKSBBTkQgVEFCTEVfTkFNRT0neyRwZn1wc19wZXRzJyBPUkRFUiBCWSBPUkRJTkFMX1BPU0lUSU9OIik7CgkJJGNsPWltcGxvZGUoJywnLGFycmF5X21hcChmdW5jdGlvbigkYyl7cmV0dXJuICdgJy4kYy4nYCc7fSwkY29scykpOwoJCSRyb3dzPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHskY2x9IEZST00geyRwZn1wc19wZXRzIE9SREVSIEJZIGlkIixBUlJBWV9BKTsKCQkkY2Fub249YXJyYXkoKTtmb3JlYWNoKCRyb3dzIGFzICRyKXskcD1hcnJheSgpO2ZvcmVhY2goJGNvbHMgYXMgJGMpeyRwW109JGMuJz0nLigkclskY109PT1udWxsPydOVUxMJzokclskY10pO30kY2Fub25bXT1pbXBsb2RlKCd8JywkcCk7fQoJCXJldHVybiBhcnJheSgnY291bnQnPT5jb3VudCgkcm93cyksJ2hhc2gnPT5oYXNoKCdzaGEyNTYnLGltcGxvZGUoIlxuIiwkY2Fub24pKSk7Cgl9OwoJaWYoJGE9PT0nc2V0dXAnKXsKCQlpZighaXNfZGlyKCRwcml2KSkgQG1rZGlyKCRwcml2LDA3MDAsdHJ1ZSk7CgkJJHRva2VuPWJpbjJoZXgocmFuZG9tX2J5dGVzKDMyKSk7CgkJZmlsZV9wdXRfY29udGVudHMoJHRva2YsJHRva2VuKTsgQGNobW9kKCR0b2tmLDA2MDApOwoJCWZpbGVfcHV0X2NvbnRlbnRzKCRmbGFnLCcxJyk7IEBjaG1vZCgkZmxhZywwNjAwKTsKCQkkb1sndG9rZW5fbGVuJ109c3RybGVuKChzdHJpbmcpQGZpbGVfZ2V0X2NvbnRlbnRzKCR0b2tmKSk7CgkJJG9bJ3Rva2VuX29rJ109KGJvb2wpcHJlZ19tYXRjaCgnL1xBWzAtOWEtZl17NjR9XHovRCcsKHN0cmluZylAZmlsZV9nZXRfY29udGVudHMoJHRva2YpKTsKCQkkb1snZmxhZyddPWZpbGVfZXhpc3RzKCRmbGFnKTsKCQkkb1snZnJlZXplX2FjdGl2ZSddPWZ1bmN0aW9uX2V4aXN0cygncGV0c2hvcF9wc3BmX2FjdGl2ZScpP3BldHNob3BfcHNwZl9hY3RpdmUoKTonbi9hJzsKCX0KCWVsc2VpZigkYT09PSdwcm9vZicpewoJCSRiPSRoYXNoKCk7CgkJJHNxbD0nVVBEJy4nQVRFICcuJHBmLidwc19wZXRzIFNFVCBpZD1pZCBXSEVSRSAxPTAnOwoJCSR3cGRiLT5sYXN0X2Vycm9yPScnOwoJCSRyZXM9JHdwZGItPnF1ZXJ5KCRzcWwpOwoJCSRvWyd3cml0ZV9mYWxzZSddPSgkcmVzPT09ZmFsc2UpOwoJCSRvWydsYXN0X2Vycm9yX3NldCddPSgkd3BkYi0+bGFzdF9lcnJvciE9PScnKTsKCQlzbGVlcCgzKTsKCQkkYTI9JGhhc2goKTsKCQkkb1snY291bnQnXT0kYTJbJ2NvdW50J107CgkJJG9bJ2hhc2hfZXRhbG9udWknXT0oJGEyWydoYXNoJ109PT0nYzgzNGE3ZDFmOTUxZTg3Y2I2MWNjMjVmZjg1YzIxNDY1MzUwYTNkZmRkMDhlODUzZTI4Y2Q1MjgxMjBlZWIwNCcpOwoJCSRvWydkb3VibGVfb2snXT0oJGJbJ2hhc2gnXT09PSRhMlsnaGFzaCddICYmICRiWydjb3VudCddPT09JGEyWydjb3VudCddKTsKCX0KCWhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8pOyBleGl0Owp9KTsK';
import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const U=process.env.WP_USER||'', P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='-u "'+U+':'+P+'"';
function wj(m,path,body){const b=Buffer.from(JSON.stringify(body)).toString('base64');
  return execSync('echo '+b+'|base64 -d|curl -sk '+AUTH+' -X '+m+' -H "Content-Type: application/json" -d @- "https://dev.avesa.lt/wp-json/'+path+'"',{maxBuffer:50*1024*1024}).toString();}
function hit(a){const r=execSync('curl -sk '+AUTH+' "https://dev.avesa.lt/?ps_z1=Z1Kw8Nx&a='+a+'"',{maxBuffer:20*1024*1024}).toString();const i=r.indexOf('{');try{return JSON.parse(r.slice(i));}catch(e){return {raw:r.slice(0,100)};}}
function code(m,url){const c=execSync('curl -sk -o /dev/null -w "%{http_code}" '+AUTH+' -X '+m+' -H "Content-Type: application/json" -d "{}" "'+url+'"').toString().trim();return c;}
function pr(n,o){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<5;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?nocache='+Math.random()+'"').toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'z1',content:Buffer.from(JSON.stringify(o)).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"').toString().trim();
  if(c==='200'||c==='201')return c;}return 'fail';}
const o={};
const mk=wj('POST','code-snippets/v1/snippets',{name:'Z1 (temp)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:5});
try{o.snip_id=JSON.parse(mk).id;}catch(e){o.mk=mk.slice(0,150);}
o.setup=hit('setup');
const B='https://dev.avesa.lt/wp-json/petshop/v1';
o.post_503=code('POST',B+'/pet-profile');
o.patch_503=code('PATCH',B+'/pet-profile/999999999');
o.delete_503=code('DELETE',B+'/pet-profile/999999999');
o.get_200=code('GET','https://dev.avesa.lt/wp-json/petshop/v1/');
o.proof=hit('proof');
if(o.snip_id) wj('POST','code-snippets/v1/snippets/'+o.snip_id,{active:false});
o.Z1_PASS=(o.setup&&o.setup.freeze_active===true&&o.setup.token_ok===true
 &&o.post_503==='503'&&o.patch_503==='503'&&o.delete_503==='503'&&o.get_200==='200'
 &&o.proof&&o.proof.write_false===true&&o.proof.last_error_set===true
 &&o.proof.count===23&&o.proof.hash_etalonui===true&&o.proof.double_ok===true);
console.log('PUT:',pr('z1.json',o));
