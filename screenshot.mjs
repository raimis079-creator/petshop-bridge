import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function sh(c){try{return execSync(c+' 2>&1',{maxBuffer:20e6,shell:'/bin/bash'}).toString();}catch(e){return String(e).slice(0,300);}}
function putResult(name,txt){const u='https://api.github.com/repos/'+REPO+'/contents/analize/'+name;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk --max-time 30 -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:20e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'s456',content:Buffer.from(txt).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -sk --max-time 60 -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:20e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={VERSIJA_RUN:'run456-v1'}; let sid=null;
const PHP=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgUzQ1NiBXQyBDdXN0b21lciBGYWlsZWQgT3JkZXIgbGFpc2tvIGlzanVuZ2ltYXMKICogUmFpbWlvIHNwcmVuZGltYXMgMjAyNi0wOC0wNDoga2xpZW50dWkgc2l1bmNpYSBNVVNVIGR1bm5pbmctMSwgbmUgV0Mgc3RhbmRhcnRpbmlzLgogKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAgIGlmICggISBpc3NldCgkX0dFVFsncHNfczQ1NiddKSB8fCAkX0dFVFsncHNfczQ1NiddICE9PSAnSzQ1NmVtJyApIHJldHVybjsKICAgIG5vY2FjaGVfaGVhZGVycygpOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICAgQHNldF90aW1lX2xpbWl0KDIwMCk7CiAgICAkYWN0PWlzc2V0KCRfR0VUWydhY3QnXSk/JF9HRVRbJ2FjdCddOicnOwogICAgJHI9YXJyYXkoJ1ZFUlNJSkEnPT4nczQ1Ni12MScsJ2FjdCc9PiRhY3QpOwogICAgJE9QVD0nd29vY29tbWVyY2VfY3VzdG9tZXJfZmFpbGVkX29yZGVyX3NldHRpbmdzJzsKCiAgICAkclsncHJpZXMnXT1nZXRfb3B0aW9uKCRPUFQpOwoKICAgIGlmKCRhY3Q9PT0naXNqdW5ndGknKXsKICAgICAgICAkdj1nZXRfb3B0aW9uKCRPUFQpOwogICAgICAgIGlmKCFpc19hcnJheSgkdikpICR2PWFycmF5KCk7CiAgICAgICAgdXBkYXRlX29wdGlvbigncGV0c2hvcF93Y19mYWlsZWRfZW1haWxfYmFrX1M0NTYnLCB3cF9qc29uX2VuY29kZSgkdiksIGZhbHNlKTsKICAgICAgICAkdlsnZW5hYmxlZCddPSdubyc7CiAgICAgICAgdXBkYXRlX29wdGlvbigkT1BULCR2KTsKICAgICAgICAkclsncG9faXJhc3ltbyddPWdldF9vcHRpb24oJE9QVCk7CiAgICAgICAgJHJbJ2JhY2t1cCddPSdwZXRzaG9wX3djX2ZhaWxlZF9lbWFpbF9iYWtfUzQ1Nic7CiAgICB9CgogICAgLy8gUEFUSUtSQSBwZXIgV0Mgb2JqZWt0YQogICAgaWYoZnVuY3Rpb25fZXhpc3RzKCdXQycpKXsKICAgICAgICBXQygpLT5tYWlsZXIoKTsKICAgICAgICBmb3JlYWNoKFdDKCktPm1haWxlcigpLT5nZXRfZW1haWxzKCkgYXMgJGlkPT4kZSl7CiAgICAgICAgICAgIGlmKHN0cmlwb3MoJGlkLCdmYWlsZWQnKSE9PWZhbHNlKQogICAgICAgICAgICAgICAgJHJbJ2xhaXNrYWknXVskaWRdPWFycmF5KCdlbmFibGVkJz0+JGUtPmlzX2VuYWJsZWQoKT8nVEFJUCc6J25lJywKICAgICAgICAgICAgICAgICAgICAnZ2F2ZWphcyc9PiRlLT5nZXRfcmVjaXBpZW50KCk/OidrbGllbnRhcycsJ3Bhdic9PiRlLT5nZXRfdGl0bGUoKSk7CiAgICAgICAgfQogICAgfQogICAgLy8gYXIgbXVzdSBlbWl0dGVyaXMgdmlldG9qZQogICAgZ2xvYmFsICR3cF9maWx0ZXI7CiAgICAkbHN0PWFycmF5KCk7CiAgICBpZihpc3NldCgkd3BfZmlsdGVyWyd3b29jb21tZXJjZV9vcmRlcl9zdGF0dXNfZmFpbGVkJ10pKQogICAgICBmb3JlYWNoKCR3cF9maWx0ZXJbJ3dvb2NvbW1lcmNlX29yZGVyX3N0YXR1c19mYWlsZWQnXS0+Y2FsbGJhY2tzIGFzICRwPT4kY2JzKSBmb3JlYWNoKCRjYnMgYXMgJGNiKXsKICAgICAgICAkZj0kY2JbJ2Z1bmN0aW9uJ107ICRsc3RbXT0kcC4nICcuKGlzX3N0cmluZygkZik/JGY6KGlzX2FycmF5KCRmKT8oaXNfb2JqZWN0KCRmWzBdKT9nZXRfY2xhc3MoJGZbMF0pOiRmWzBdKS4nOjonLiRmWzFdOidjbG9zdXJlJykpOyB9CiAgICAkclsna2FibGl1a2FzX2ZhaWxlZCddPSRsc3Q7CiAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUFJFVFRZX1BSSU5UKTsgZXhpdDsKfSwgMSk7Cg==','base64').toString('utf8').replace(/^<\?php\s*/,'');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP S456 Email v1',code:PHP,scope:'global',active:true}));
for(let i=0;i<3&&!sid;i++){const t=sh('curl -sSk --max-time 60 '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
 try{const j=JSON.parse(t); if(j&&j.id)sid=j.id;}catch(e){} if(!sid)sh('sleep 4');}
O.sid=sid; sh('sleep 4');
function q(a){const x=sh('curl -sSk --max-time 270 "'+SITE+'/?ps_s456=K456em&act='+a+'&z='+Math.random()+'"');
 try{return JSON.parse(x);}catch(e){return {raw:String(x).slice(0,500)};}}
O.pries=q('x');
O.isjungimas=q('isjungti');
sh('sleep 2');
O.patikra=q('x');
O.svetaine=sh('curl -sSk -o /dev/null -w "%{http_code}" --max-time 30 "'+SITE+'/"').trim();
if(sid){fs.writeFileSync('/tmp/off.json',JSON.stringify({active:false}));
 sh('curl -sSk --max-time 30 -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/off.json "'+API+'/'+sid+'"');}
putResult('s456.json', JSON.stringify(O,null,1));
console.log('OK');
