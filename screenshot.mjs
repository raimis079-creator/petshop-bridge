const RPHP='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfcmQnXSl8fCRfR0VUWydwc19yZCddIT09J1JkN0drMlhtJyl7cmV0dXJuO30KCUBzZXRfdGltZV9saW1pdCgzMDApOyBnbG9iYWwgJHdwZGI7ICRwZj0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgpOwoJJGlkcz1nZXRfcG9zdHMoYXJyYXkoJ3Bvc3RfdHlwZSc9Pidwcm9kdWN0JywncG9zdF9zdGF0dXMnPT4ncHVibGlzaCcsJ3Bvc3RzX3Blcl9wYWdlJz0+LTEsJ2ZpZWxkcyc9PidpZHMnKSk7CgkkcmQ9YXJyYXkoKTsKCWZvcmVhY2goJGlkcyBhcyAkaWQpewoJCSRtYW49KHN0cmluZylnZXRfcG9zdF9tZXRhKCRpZCwnX2xlZ2FjeV9tYW51ZmFjdHVyZXInLHRydWUpOwoJCSR0aXRsZT1nZXRfdGhlX3RpdGxlKCRpZCk7CgkJaWYoc3RyaXBvcygkbWFuLCdyZWFsIGRvZycpPT09ZmFsc2UgJiYgc3RyaXBvcygkdGl0bGUsJ3JlYWwgZG9nJyk9PT1mYWxzZQoJCSAgICYmIHN0cmlwb3MoJG1hbiwncmVhbGRvZycpPT09ZmFsc2UgJiYgc3RyaXBvcygkdGl0bGUsJ3JlYWxkb2cnKT09PWZhbHNlKSBjb250aW51ZTsKCQkkcD13Y19nZXRfcHJvZHVjdCgkaWQpOyBpZighJHApIGNvbnRpbnVlOwoJCSRtYXBwZWQ9KGludCkkd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIGZlZWRpbmdfdGFibGVfaWQgRlJPTSB7JHBmfXBzX2ZlZWRpbmdfbWFwIFdIRVJFIHByb2R1Y3RfaWQ9JWQiLCRpZCkpOwoJCSRyZFtdPWFycmF5KCdpZCc9PiRpZCwnc2t1Jz0+KHN0cmluZylnZXRfcG9zdF9tZXRhKCRpZCwnX3NrdScsdHJ1ZSksJ3QnPT5tYl9zdWJzdHIoJHRpdGxlLDAsNzYpLAoJCQknbWFuJz0+JG1hbiwnc3RvY2snPT4kcC0+Z2V0X3N0b2NrX3N0YXR1cygpLCdtYXAnPT4kbWFwcGVkPzpudWxsKTsKCX0KCSRvWyd0b3RhbCddPWNvdW50KCRyZCk7CgkkaW49YXJyYXlfZmlsdGVyKCRyZCxmdW5jdGlvbigkcil7cmV0dXJuICRyWydzdG9jayddPT09J2luc3RvY2snO30pOwoJJG9bJ2luc3RvY2snXT1jb3VudCgkaW4pOwoJJG9bJ21hcHBlZCddPWNvdW50KGFycmF5X2ZpbHRlcigkaW4sZnVuY3Rpb24oJHIpe3JldHVybiAoYm9vbCkkclsnbWFwJ107fSkpOwoJJG9bJ3VubWFwcGVkJ109YXJyYXlfdmFsdWVzKGFycmF5X2ZpbHRlcigkaW4sZnVuY3Rpb24oJHIpe3JldHVybiAhJHJbJ21hcCddO30pKTsKCSRvWyd1bm1hcHBlZF9uJ109Y291bnQoJG9bJ3VubWFwcGVkJ10pOwoJaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0pOwo=';
import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'rd',content:Buffer.from(JSON.stringify(o,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
const U=process.env.WP_USER||'',P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
fs.writeFileSync('/tmp/wpu',U);fs.writeFileSync('/tmp/wpp',P);
function hit(u){try{return execSync(`curl -sk -m 150 -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" "${u}"`,{maxBuffer:60*1024*1024}).toString();}catch(e){return 'ERR';}}
function wj(m,p,b){fs.writeFileSync('/tmp/b.json',JSON.stringify(b));try{return execSync(`curl -sk -m 60 -X ${m} -H "Content-Type: application/json" -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" -d @/tmp/b.json "https://dev.avesa.lt/wp-json/${p}"`,{maxBuffer:20*1024*1024}).toString();}catch(e){return 'ERR';}}
const o={};
const mk=wj('POST','code-snippets/v1/snippets',{name:'RealDog Recon v1 (read-only)',code:Buffer.from(RPHP,'base64').toString('utf8'),scope:'front-end',active:true,priority:10});
let id=null; try{id=JSON.parse(mk).id;}catch(e){o.mk=mk.slice(0,200);}
if(id){ const r=hit('https://dev.avesa.lt/?ps_rd=Rd7Gk2Xm'); try{o.wp=JSON.parse(r);}catch(e){o.wp_raw=r.slice(0,600);}
        wj('POST',`code-snippets/v1/snippets/${id}`,{active:false}); }
pr('rd.json',o); console.log('DONE');
