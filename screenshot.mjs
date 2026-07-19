const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfZjF4J10pfHwkX0dFVFsncHNfZjF4J10hPT0nRjF4S3c4TngnKXtyZXR1cm47fQoJQHNldF90aW1lX2xpbWl0KDMwMCk7ICRvPWFycmF5KCdyZWFkb25seSc9PnRydWUpOwoJJGNvcmU9V1BfUExVR0lOX0RJUi4nL3BldHNob3AtY29yZSc7CgkvLyBwYWdyLiBmYWlsYXMgcGlsbmFzIChkeWRpcyBsZWlkxb5pYSkKCSRvWydtYWluX3NpemUnXT1AZmlsZXNpemUoJGNvcmUuJy9wZXRzaG9wLWNvcmUucGhwJyk7CgkvLyBrYWlwIHBldC11aSByb3V0aW5hIHN1Yi1wdXNsYXBpdXM6IGllc2tvbSAnYXVnaW50aW5pcycsICdtYWl0aW4nLCB2aWV3LCB0YWIsIHJlbmRlcgoJZm9yZWFjaChhcnJheSgnY2xhc3MtcGV0LXVpLnBocCcsJ2NsYXNzLXBldC1kYXNoYm9hcmQucGhwJywnY2xhc3MtcGV0LXByb2ZpbGUucGhwJykgYXMgJGYpewoJCSRzcmM9QGZpbGVfZ2V0X2NvbnRlbnRzKCRjb3JlLicvaW5jbHVkZXMvJy4kZik7CgkJaWYoISRzcmMpeyAkb1skZl09J07EllJBJzsgY29udGludWU7IH0KCQkkaW5mbz1hcnJheSgnc2l6ZSc9PnN0cmxlbigkc3JjKSk7CgkJLy8ga2xhc8SXcyB2YXJkYXMKCQlpZihwcmVnX21hdGNoKCcvY2xhc3NccysoXHcrKS8nLCRzcmMsJG0pKSAkaW5mb1snY2xhc3MnXT0kbVsxXTsKCQkvLyBwdWJsaWMgbWV0b2RhaQoJCXByZWdfbWF0Y2hfYWxsKCcvcHVibGljXHMrKD86c3RhdGljXHMrKT9mdW5jdGlvblxzKyhcdyspLycsJHNyYywkbW0pOwoJCSRpbmZvWydtZXRob2RzJ109YXJyYXlfc2xpY2UoJG1tWzFdLDAsMjUpOwoJCS8vIHJld3JpdGUgLyBxdWVyeV92YXIgLyBhdWdpbnRpbmlzIGhhbmRsaW5nCgkJcHJlZ19tYXRjaF9hbGwoJy8oYXVnaW50aW5pc3xtYWl0aW58cXVlcnlfdmFyfGFkZF9yZXdyaXRlfGdldF9xdWVyeV92YXJ8dGVtcGxhdGVfcmVkaXJlY3R8dGhlX2NvbnRlbnQpW15cbl17MCw4MH0vJywkc3JjLCRycik7CgkJJGluZm9bJ3JvdXRpbmdfaGludHMnXT1hcnJheV9zbGljZShhcnJheV91bmlxdWUoJHJyWzBdKSwwLDE1KTsKCQkvLyBrYWlwIGdhdW5hbWFzIHBldF9pZCBpciB0aWtyaW5hbWEgbnVvc2F2eWJlCgkJcHJlZ19tYXRjaF9hbGwoJy8odXNlcl9pZHxjdXJyZW50X3VzZXJ8cGV0X2lkfGdldF9jdXJyZW50X3VzZXJfaWR8b3duZXJzaGlwfGJlbG9uZ3MpW15cbl17MCw3MH0vJywkc3JjLCRvbyk7CgkJJGluZm9bJ293bmVyc2hpcF9oaW50cyddPWFycmF5X3NsaWNlKGFycmF5X3VuaXF1ZSgkb29bMF0pLDAsMTIpOwoJCSRvWyRmXT0kaW5mbzsKCX0KCWhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9KTsK';
import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 for(let i=0;i<4;i++){ try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}?nocache=${Math.random()}"`).toString()); if(j.sha)s=j.sha; }catch(e){}
  fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'f1x',content:Buffer.from(JSON.stringify(o)).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync(`curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}"`,{maxBuffer:80*1024*1024}).toString().trim();
  if(c==='200'||c==='201') return c; }
 return 'fail';}
const U=process.env.WP_USER||'',P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
fs.writeFileSync('/tmp/wpu',U);fs.writeFileSync('/tmp/wpp',P);
function hit(u){try{return execSync(`curl -sk -m 500 -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" "${u}"`,{maxBuffer:150*1024*1024}).toString();}catch(e){return 'ERR';}}
function wj(m,p,b){fs.writeFileSync('/tmp/b.json',JSON.stringify(b));try{return execSync(`curl -sk -m 90 -X ${m} -H "Content-Type: application/json" -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" -d @/tmp/b.json "https://dev.avesa.lt/wp-json/${p}"`,{maxBuffer:20*1024*1024}).toString();}catch(e){return 'ERR';}}
const o={};
const mk=wj('POST','code-snippets/v1/snippets',{name:'F1 Read (read-only)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:10});
let id=null; try{const j=JSON.parse(mk); id=j.id; o.create={id:j.id,code_error:j.code_error||null};}catch(e){o.mk=mk.slice(0,250);}
if(id){ const r=hit('https://dev.avesa.lt/?ps_f1x=F1xKw8Nx');
  const i=r.indexOf('{"');
  if(i>0){ o.php_warnings=r.slice(0,i).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().slice(0,600); }
  const body=(i>=0)?r.slice(i):r;
  if(body.trim().startsWith('{')){ try{o.d=JSON.parse(body);}catch(e){o.perr=e.message.slice(0,120); o.raw=body.slice(0,4000);} }
  else o.raw=r.slice(0,4000);
  wj('POST',`code-snippets/v1/snippets/${id}`,{active:false}); }
console.log('PUT:',pr('f1x.json',o));
