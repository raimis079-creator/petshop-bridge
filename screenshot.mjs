const G='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfZ20nXSl8fCRfR0VUWydwc19nbSddIT09J0dtNFh6OFByJyl7cmV0dXJuO30KCUBzZXRfdGltZV9saW1pdCgzMDApOyBnbG9iYWwgJHdwZGI7ICRwZj0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgpOwoJJGlkcz1nZXRfcG9zdHMoYXJyYXkoJ3Bvc3RfdHlwZSc9Pidwcm9kdWN0JywncG9zdF9zdGF0dXMnPT4ncHVibGlzaCcsJ3Bvc3RzX3Blcl9wYWdlJz0+LTEsJ2ZpZWxkcyc9PidpZHMnKSk7CgkkZz1hcnJheSgpOwoJZm9yZWFjaCgkaWRzIGFzICRpZCl7CgkJJG1hbj0oc3RyaW5nKWdldF9wb3N0X21ldGEoJGlkLCdfbGVnYWN5X21hbnVmYWN0dXJlcicsdHJ1ZSk7CgkJJHRpdGxlPWdldF90aGVfdGl0bGUoJGlkKTsKCQlpZihzdHJpcG9zKCRtYW4sJ2dlbW9uJyk9PT1mYWxzZSAmJiBzdHJpcG9zKCR0aXRsZSwnZ2Vtb24nKT09PWZhbHNlKSBjb250aW51ZTsKCQkkcD13Y19nZXRfcHJvZHVjdCgkaWQpOyBpZighJHApIGNvbnRpbnVlOwoJCSRtYXBwZWQ9KGludCkkd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIGZlZWRpbmdfdGFibGVfaWQgRlJPTSB7JHBmfXBzX2ZlZWRpbmdfbWFwIFdIRVJFIHByb2R1Y3RfaWQ9JWQiLCRpZCkpOwoJCSRjPWdldF9wb3N0X2ZpZWxkKCdwb3N0X2NvbnRlbnQnLCRpZCk7CgkJJGxvdz1tYl9zdHJ0b2xvd2VyKCRjLCdVVEYtOCcpOwoJCS8vIGFyIHBvc3RfY29udGVudCB0dXJpIHNlcmltbyBsZW50ZWxlCgkJJHBjPTA7ICRudD0wOwoJCWlmKG1iX3N0cnBvcygkbG93LCc8dGFibGUnKSE9PWZhbHNlKXsKCQkJcHJlZ19tYXRjaF9hbGwoJy88dGFibGVbXHNcU10qPzxcL3RhYmxlPi9pJywkYywkdG0pOwoJCQkkbnQ9Y291bnQoJHRtWzBdKTsKCQkJZm9yZWFjaCgkdG1bMF0gYXMgJHRibCl7CgkJCQkkZj1tYl9zdHJ0b2xvd2VyKHN0cmlwX3RhZ3MoJHRibCksJ1VURi04Jyk7CgkJCQlpZihtYl9zdHJwb3MoJGYsJ3N2b3InKSE9PWZhbHNlICYmIHByZWdfbWF0Y2goJy8obm9ybWF8a2lla2lzfHBhcm9zfGRpZW5vc3xkb3opL3UnLCRmKSl7ICRwYz0xOyBicmVhazsgfQoJCQl9CgkJfQoJCS8vIHNhdXNhcyBhciBrb25zZXJ2YWkKCQkkd2V0PXByZWdfbWF0Y2goJy8oa29uc2VydnxwYXRlfHBhxaF0ZXR8a2Fwc3VsfG1hacWhZWx8c2F1Y2V8amVsbHl8xaFsYXBpYXN8ZHLEl2duKS91aScsJHRpdGxlKT8xOjA7CgkJJGdbXT1hcnJheSgnc2t1Jz0+KHN0cmluZylnZXRfcG9zdF9tZXRhKCRpZCwnX3NrdScsdHJ1ZSksJ3QnPT5tYl9zdWJzdHIoJHRpdGxlLDAsNTgpLAoJCQknc3RvY2snPT4kcC0+Z2V0X3N0b2NrX3N0YXR1cygpLCdtYXAnPT4kbWFwcGVkPzowLCdwYyc9PiRwYywnbnQnPT4kbnQsJ3dldCc9PiR3ZXQpOwoJfQoJJGluPWFycmF5X2ZpbHRlcigkZyxmdW5jdGlvbigkcil7cmV0dXJuICRyWydzdG9jayddPT09J2luc3RvY2snO30pOwoJJG9bJ3Zpc28nXT1jb3VudCgkZyk7ICRvWydpbnN0b2NrJ109Y291bnQoJGluKTsKCSRvWydzdV9sZW50ZWxlJ109Y291bnQoYXJyYXlfZmlsdGVyKCRpbixmdW5jdGlvbigkcil7cmV0dXJuICRyWydtYXAnXTt9KSk7CgkkdW49YXJyYXlfdmFsdWVzKGFycmF5X2ZpbHRlcigkaW4sZnVuY3Rpb24oJHIpe3JldHVybiAhJHJbJ21hcCddO30pKTsKCSRvWydiZSddPWNvdW50KCR1bik7Cgkkb1snYmVfc2F1c2FzJ109Y291bnQoYXJyYXlfZmlsdGVyKCR1bixmdW5jdGlvbigkcil7cmV0dXJuICEkclsnd2V0J107fSkpOwoJJG9bJ2JlX2tvbnNlcnZhaSddPWNvdW50KGFycmF5X2ZpbHRlcigkdW4sZnVuY3Rpb24oJHIpe3JldHVybiAkclsnd2V0J107fSkpOwoJJG9bJ2JlX2JldF9wY190dXJpJ109Y291bnQoYXJyYXlfZmlsdGVyKCR1bixmdW5jdGlvbigkcil7cmV0dXJuICRyWydwYyddO30pKTsKCSRvWyd1bm1hcHBlZCddPSR1bjsKCWhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9KTsK';
import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'gm',content:Buffer.from(JSON.stringify(o,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
const U=process.env.WP_USER||'',P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
fs.writeFileSync('/tmp/wpu',U);fs.writeFileSync('/tmp/wpp',P);
function hit(u){try{return execSync(`curl -sk -m 150 -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" "${u}"`,{maxBuffer:60*1024*1024}).toString();}catch(e){return 'ERR';}}
function wj(m,p,b){fs.writeFileSync('/tmp/b.json',JSON.stringify(b));try{return execSync(`curl -sk -m 90 -X ${m} -H "Content-Type: application/json" -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" -d @/tmp/b.json "https://dev.avesa.lt/wp-json/${p}"`,{maxBuffer:20*1024*1024}).toString();}catch(e){return 'ERR';}}
function get(u){try{return execSync(`curl -sLk --max-time 22 -A "Mozilla/5.0 Chrome/120" "${u}"`,{maxBuffer:25*1024*1024}).toString();}catch(e){return '';}}
const o={};
const mk=wj('POST','code-snippets/v1/snippets',{name:'Gemon Recon v1 (read-only)',code:Buffer.from(G,'base64').toString('utf8'),scope:'front-end',active:true,priority:10});
let id=null; try{id=JSON.parse(mk).id;}catch(e){o.mk=mk.slice(0,200);}
if(id){ const r=hit('https://dev.avesa.lt/?ps_gm=Gm4Xz8Pr'); try{o.d=JSON.parse(r);}catch(e){o.raw=r.slice(0,600);}
        wj('POST',`code-snippets/v1/snippets/${id}`,{active:false}); }
// Gemon = Monge grupe -> gemon.it / monge.it
o.dom={};
for(const c of ['https://www.gemon.it','https://gemon.it','https://www.monge.it','https://www.gemonpet.com']){
  try{ const st=execSync(`curl -sk -m 15 -o /dev/null -w "%{http_code}" -A "Mozilla/5.0 Chrome/120" -L "${c}"`).toString().trim();
       o.dom[c]={http:st};
       if(st==='200'){ const h=get(c); o.dom[c].title=(h.match(/<title[^>]*>([\s\S]*?)<\/title>/i)||[,''])[1].replace(/\s+/g,' ').trim().slice(0,55); }
  }catch(e){ o.dom[c]={http:'000'}; }
}
pr('gm.json',o); console.log('DONE');
