import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function sh(c){try{return execSync(c+' 2>&1',{maxBuffer:20e6,shell:'/bin/bash'}).toString();}catch(e){return String(e).slice(0,300);}}
function putResult(name,txt){const u='https://api.github.com/repos/'+REPO+'/contents/analize/'+name;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk --max-time 30 -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:20e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'s501',content:Buffer.from(txt).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -sk --max-time 60 -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:20e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={VERSIJA_RUN:'run501-v1'}; let sid=null;
const PHP=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgUzUwMSBWZW5pcGFrIGxpcGR1a3UgbWVjaGFuaXptYXMg4oCUIGFyIGdhbGltYSBwYWltdGkgUE8gVklFTkEKICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgICBpZiAoICEgaXNzZXQoJF9HRVRbJ3BzX3M1MDEnXSkgfHwgJF9HRVRbJ3BzX3M1MDEnXSAhPT0gJ0s1MDFsYicgKSByZXR1cm47CiAgICBub2NhY2hlX2hlYWRlcnMoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAgIEBzZXRfdGltZV9saW1pdCgxNTApOwogICAgZ2xvYmFsICR3cGRiOyAkcGY9JHdwZGItPnByZWZpeDsKICAgICRyPWFycmF5KCdWRVJTSUpBJz0+J3M1MDEtdjEnKTsKICAgICRWUD1XUF9QTFVHSU5fRElSLicvd2MtdmVuaXBhay1zaGlwcGluZy8nOwoKICAgIC8vIDEpIExhYmVsIGtsYXNlIOKAlCBrYWlwIGdlbmVydW9qYW1pIGxpcGR1a2FpCiAgICAkZj0kVlAuJ2FkbWluL2NsYXNzLXdvb2NvbW1lcmNlLXNob3B1cC12ZW5pcGFrLXNoaXBwaW5nLWFkbWluLWxhYmVsLnBocCc7CiAgICBpZihpc19maWxlKCRmKSl7CiAgICAgICAgJGM9ZmlsZV9nZXRfY29udGVudHMoJGYpOwogICAgICAgICRlaWw9YXJyYXkoKTsKICAgICAgICBmb3JlYWNoKGV4cGxvZGUoIlxuIiwkYykgYXMgJGk9PiRsbikKICAgICAgICAgICAgaWYocHJlZ19tYXRjaCgnLyhmdW5jdGlvbiB8Y3VybHx1cmx8YXBpfGxhYmVsfHBkZnxwYWNrX251bWJlcnxvcmRlcl9pZHxmb3JlYWNofFBPU1R8R0VUfGhlYWRlcikvaScsJGxuKSkKICAgICAgICAgICAgICAgICRlaWxbXT0oJGkrMSkuJzogJy50cmltKHN1YnN0cigkbG4sMCwxMzUpKTsKICAgICAgICAkclsnbGFiZWxfa2xhc2UnXT1hcnJheSgnQic9PnN0cmxlbigkYyksJ2VpbCc9PmFycmF5X3NsaWNlKCRlaWwsMCw0MCkpOwogICAgfSBlbHNlIHsKICAgICAgICAkZGlyPSRWUC4nYWRtaW4vJzsKICAgICAgICAkclsnbGFiZWxfa2xhc2UnXT1hcnJheSgnTkVSQSc9PiRmLCdrYXRhbG9nZSc9PmFycmF5X3ZhbHVlcyhhcnJheV9maWx0ZXIoc2NhbmRpcigkZGlyKSxmdW5jdGlvbigkeCl7cmV0dXJuIHN1YnN0cigkeCwtNCk9PT0nLnBocCc7fSkpKTsKICAgIH0KICAgIC8vIDIpIGFyIHlyYSBBSkFYIGVuZHBvaW50IHZpZW5hbSB1enNha3ltdWkKICAgIGdsb2JhbCAkd3BfZmlsdGVyOwogICAgJGFqPWFycmF5KCk7CiAgICBmb3JlYWNoKCR3cF9maWx0ZXIgYXMgJGg9PiRvKXsKICAgICAgICBpZihzdHJwb3MoJGgsJ3dwX2FqYXhfJykhPT0wKSBjb250aW51ZTsKICAgICAgICBmb3JlYWNoKCRvLT5jYWxsYmFja3MgYXMgJHA9PiRjYnMpIGZvcmVhY2goJGNicyBhcyAkY2IpewogICAgICAgICAgICAkZm49JGNiWydmdW5jdGlvbiddOwogICAgICAgICAgICAkbj1pc19zdHJpbmcoJGZuKT8kZm46KGlzX2FycmF5KCRmbik/KGlzX29iamVjdCgkZm5bMF0pP2dldF9jbGFzcygkZm5bMF0pOiRmblswXSkuJzo6Jy4kZm5bMV06J2Nsb3N1cmUnKTsKICAgICAgICAgICAgaWYocHJlZ19tYXRjaCgnL3ZlbmlwYWt8c2hvcHVwfGxpdGh1YW5pYXxscF8vaScsJG4pKSAkYWpbJGhdPSRuOwogICAgICAgIH0KICAgIH0KICAgICRyWydhamF4X2VuZHBvaW50YWknXT0kYWo7CiAgICAvLyAzKSBtZXRhLCBrdXIgc2F1Z29taSBzaXVudG9zIG51bWVyaWFpCiAgICAkclsnbWV0YSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG1ldGFfa2V5LCBDT1VOVCgqKSBjIEZST00geyRwZn13Y19vcmRlcnNfbWV0YQogICAgICAgIFdIRVJFIG1ldGFfa2V5IExJS0UgJyV2ZW5pcGFrJScgT1IgbWV0YV9rZXkgTElLRSAnJXBhY2slJyBPUiBtZXRhX2tleSBMSUtFICclbGFiZWwlJwogICAgICAgICAgIE9SIG1ldGFfa2V5IExJS0UgJyV0cmFjayUnIEdST1VQIEJZIG1ldGFfa2V5IiwgQVJSQVlfQSk7CiAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUFJFVFRZX1BSSU5UKTsgZXhpdDsKfSwgMSk7Cg==','base64').toString('utf8').replace(/^<\?php\s*/,'');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP S501 Lipdukai',code:PHP,scope:'global',active:true}));
for(let i=0;i<3&&!sid;i++){const t=sh('curl -sSk --max-time 60 '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
 try{const j=JSON.parse(t); if(j&&j.id)sid=j.id;}catch(e){} if(!sid)sh('sleep 4');}
O.sid=sid; sh('sleep 4');
function q(a){const x=sh('curl -sSk --max-time 100 "'+SITE+'/?ps_s501=K501lb&act='+a+'&z='+Math.random()+'"');
 try{return JSON.parse(x);}catch(e){return {raw:String(x).slice(0,500)};}}
O.rez=q('x');
O.svetaine=sh('curl -sSk -o /dev/null -w "%{http_code}" --max-time 30 "'+SITE+'/"').trim();
O.svetaine=sh('curl -sSk -o /dev/null -w "%{http_code}" --max-time 30 "'+SITE+'/"').trim();
if(sid){fs.writeFileSync('/tmp/off.json',JSON.stringify({active:false}));
 sh('curl -sSk --max-time 30 -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/off.json "'+API+'/'+sid+'"');}
putResult('s501.json', JSON.stringify(O,null,1));
console.log('OK');
