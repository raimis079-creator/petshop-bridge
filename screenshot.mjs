const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfZmluJ10pfHwkX0dFVFsncHNfZmluJ10hPT0nRmluS3c4TngnKXtyZXR1cm47fQoJZ2xvYmFsICR3cGRiOyAkcGY9JHdwZGItPnByZWZpeDsgJG89YXJyYXkoKTsKCSR0b2tzPWFycmF5KCdTYWZlS3c4TngnLCdGaW5LdzhOeCcsJ1A2eEt3OE54Jyk7CgkkbGlrZT1pbXBsb2RlKCcgT1IgJyxhcnJheV9tYXAoZnVuY3Rpb24oJHQpe3JldHVybiAiY29kZSBMSUtFICclIi4kdC4iJSciO30sJHRva3MpKTsKCSRzbj0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCBGUk9NIHskcGZ9c25pcHBldHMgV0hFUkUgKCRsaWtlKSBBTkQgYWN0aXZlPTEiLCBBUlJBWV9BKTsKCSRkPTA7IGZvcmVhY2goJHNuIGFzICRzKXsgJHdwZGItPnVwZGF0ZSgkcGYuJ3NuaXBwZXRzJyxhcnJheSgnYWN0aXZlJz0+MCksYXJyYXkoJ2lkJz0+JHNbJ2lkJ10pKTsgJGQrKzsgfQoJJG9bJ2RlYWt0eXZ1b3RhJ109JGQ7CgkvLyBnYWx1dGluaXMgYnVzZW5vcyBzbmFwc2hvdAoJJG9bJ3BldDI2X3N2b3JpcyddPSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgY3VycmVudF93ZWlnaHRfa2cgRlJPTSB7JHBmfXBzX3BldHMgV0hFUkUgaWQ9MjYiKTsKCSRvWycxMTg2X2FjdGl2ZSddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBhY3RpdmUgRlJPTSB7JHBmfXNuaXBwZXRzIFdIRVJFIGlkPTExODYiKTsKCSRvWydzZXNpam9zX3RlbXBfYWt0eXZ1cyddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskcGZ9c25pcHBldHMgV0hFUkUgKGNvZGUgTElLRSAnJUt3OE54JScpIEFORCBhY3RpdmU9MSBBTkQgaWQ8PjExODYiKTsKCSRvWydmZWVkaW5nX2tsYXNlcyddPShjbGFzc19leGlzdHMoJ1BldHNob3BfRmVlZGluZ19TZXJ2aWNlJykmJmNsYXNzX2V4aXN0cygnUGV0c2hvcF9GZWVkaW5nX1VJJykpOwoJaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0pOwo=';
import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 for(let i=0;i<4;i++){ try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}?nocache=${Math.random()}"`).toString()); if(j.sha)s=j.sha; }catch(e){}
  fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'fin',content:Buffer.from(JSON.stringify(o)).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync(`curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}"`,{maxBuffer:80*1024*1024}).toString().trim();
  if(c==='200'||c==='201') return c; }
 return 'fail';}
const U=process.env.WP_USER||'',P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
fs.writeFileSync('/tmp/wpu',U);fs.writeFileSync('/tmp/wpp',P);
function hit(u){try{return execSync(`curl -sk -m 500 -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" "${u}"`,{maxBuffer:150*1024*1024}).toString();}catch(e){return 'ERR';}}
function wj(m,p,b){fs.writeFileSync('/tmp/b.json',JSON.stringify(b));try{return execSync(`curl -sk -m 90 -X ${m} -H "Content-Type: application/json" -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" -d @/tmp/b.json "https://dev.avesa.lt/wp-json/${p}"`,{maxBuffer:20*1024*1024}).toString();}catch(e){return 'ERR';}}
const o={};
const mk=wj('POST','code-snippets/v1/snippets',{name:'F1 Final Clean (read-only)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:10});
let id=null; try{const j=JSON.parse(mk); id=j.id; o.create={id:j.id,code_error:j.code_error||null};}catch(e){o.mk=mk.slice(0,250);}
if(id){ const r=hit('https://dev.avesa.lt/?ps_fin=FinKw8Nx');
  const i=r.indexOf('{"');
  if(i>0){ o.php_warnings=r.slice(0,i).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().slice(0,600); }
  const body=(i>=0)?r.slice(i):r;
  if(body.trim().startsWith('{')){ try{o.d=JSON.parse(body);}catch(e){o.perr=e.message.slice(0,120); o.raw=body.slice(0,4000);} }
  else o.raw=r.slice(0,4000);
  wj('POST',`code-snippets/v1/snippets/${id}`,{active:false}); }
console.log('PUT:',pr('fin.json',o));
