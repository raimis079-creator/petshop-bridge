const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfY29sJ10pfHwkX0dFVFsncHNfY29sJ10hPT0nUzJLdzhOeCcpe3JldHVybjt9CglAc2V0X3RpbWVfbGltaXQoNTApOyAkbz1hcnJheSgpOwoJLy8gMSkgRmxhdHNvbWUgdGhlbWVfbW9kcyDigJQgc3BhbHZ1IHJha3RhaQoJJG1vZHM9Z2V0X3RoZW1lX21vZHMoKTsgJGM9YXJyYXkoKTsKCWlmKGlzX2FycmF5KCRtb2RzKSl7IGZvcmVhY2goJG1vZHMgYXMgJGs9PiR2KXsgaWYoaXNfc3RyaW5nKCR2KSAmJiBwcmVnX21hdGNoKCcvY29sb3J8Y29sb3VyfGJnfGJhY2tncm91bmR8YWNjZW50fHByaW1hcnl8c2Vjb25kYXJ5fHN1Y2Nlc3N8YWxlcnQvaScsJGspKSAkY1ska109JHY7IH0gfQoJJG9bJ3RoZW1lX21vZHNfY29sb3InXT0kYzsKCSRvWydzdHlsZXNoZWV0J109Z2V0X3N0eWxlc2hlZXQoKTsgJG9bJ3RlbXBsYXRlJ109Z2V0X3RlbXBsYXRlKCk7CgkvLyAyKSBDaGlsZCB0aGVtZSBzdHlsZS5jc3MgYW50cmFzdGUgKyA6cm9vdAoJJGNzcz1AZmlsZV9nZXRfY29udGVudHMoZ2V0X3N0eWxlc2hlZXRfZGlyZWN0b3J5KCkuJy9zdHlsZS5jc3MnKTsKCSRvWydjaGlsZF9jc3NfbGVuJ109c3RybGVuKChzdHJpbmcpJGNzcyk7CglpZigkY3NzKXsgJHA9c3RycG9zKCRjc3MsJzpyb290Jyk7ICRvWydjaGlsZF9yb290J109JHAhPT1mYWxzZT9iYXNlNjRfZW5jb2RlKHN1YnN0cigkY3NzLCRwLDkwMCkpOm51bGw7CgkJcHJlZ19tYXRjaF9hbGwoJy8jWzAtOWEtZkEtRl17Nn1cYi8nLCRjc3MsJG0pOyAkb1snY2hpbGRfaGV4X3RvcCddPWFycmF5X3NsaWNlKGFycmF5X2NvdW50X3ZhbHVlcygkbVswXSksMCwyMCx0cnVlKTsgfQoJLy8gMykgTTggZXNhbWFzIENTUyAoamF1IHN0aWxpenVvdGFzIFMxOTYvUzIxMCkKCWZvcmVhY2goYXJyYXkoJ3BldC1mb3JtLmNzcycsJ2FjY291bnQuY3NzJykgYXMgJGYpewoJCSR4PUBmaWxlX2dldF9jb250ZW50cyhXUF9QTFVHSU5fRElSLicvcGV0c2hvcC1jb3JlL2Fzc2V0cy8nLiRmKTsKCQlpZigkeCl7IHByZWdfbWF0Y2hfYWxsKCcvI1swLTlhLWZBLUZdezMsOH1cYi8nLCR4LCRtKTsgYXJzb3J0KCRjbnQ9YXJyYXlfY291bnRfdmFsdWVzKCRtWzBdKSk7CgkJCSRvWydtOF8nLiRmXT1hcnJheSgnbGVuJz0+c3RybGVuKCR4KSwnaGV4Jz0+YXJyYXlfc2xpY2UoJGNudCwwLDE4LHRydWUpKTsKCQkJJHA9c3RycG9zKCR4LCc6cm9vdCcpOyBpZigkcCE9PWZhbHNlKSAkb1snbThfcm9vdF8nLiRmXT1iYXNlNjRfZW5jb2RlKHN1YnN0cigkeCwkcCw3MDApKTsgfQoJfQoJZWNobyBqc29uX2VuY29kZSgkbywgSlNPTl9JTlZBTElEX1VURjhfU1VCU1RJVFVURSk7IGV4aXQ7Cn0pOwo=';
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
const mk=wj('POST','code-snippets/v1/snippets',{name:'COL (temp)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:5});
let sid; try{sid=JSON.parse(mk).id;}catch(e){o.mkerr=String(mk).slice(0,200);}
o.d=(function(){try{const r=execSync('curl -sk --max-time 45 '+AUTH+' "https://dev.avesa.lt/?ps_col=S2Kw8Nx"',{maxBuffer:10*1024*1024,timeout:50000}).toString();const i=r.indexOf('{');return i>=0?JSON.parse(r.slice(i)):{raw:r.slice(0,300)};}catch(e){return{err:String(e).slice(0,200)};}})();
// gyvas puslapis: inline CSS kintamieji
o.live=(function(){try{const h=execSync('curl -sk --max-time 40 "https://dev.avesa.lt/"',{maxBuffer:10*1024*1024,timeout:45000}).toString();
  const out={}; const m=h.match(/--primary-color:\s*([^;]+)/); if(m) out.primary=m[1].trim();
  const m2=h.match(/--fs-color-primary:\s*([^;]+)/); if(m2) out.fs_primary=m2[1].trim();
  const m3=h.match(/--fs-color-secondary:\s*([^;]+)/); if(m3) out.fs_secondary=m3[1].trim();
  const m4=h.match(/--fs-color-success:\s*([^;]+)/); if(m4) out.fs_success=m4[1].trim();
  const m5=h.match(/--fs-color-alert:\s*([^;]+)/); if(m5) out.fs_alert=m5[1].trim();
  const roots=h.match(/:root\{[^}]{0,600}\}/); if(roots) out.root=roots[0].slice(0,600);
  return out;}catch(e){return{err:String(e).slice(0,150)};}})();
if(sid){ try{wj('POST','code-snippets/v1/snippets/'+sid,{active:false});}catch(e){} try{execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"');}catch(e){} }
console.log('PUT:',pr('col.json',o));
