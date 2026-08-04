import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function sh(c){try{const o=execSync(c+' 2>&1; echo "__RC:$?"',{maxBuffer:50e6,shell:'/bin/bash'}).toString();
 const m=o.match(/__RC:(\d+)\s*$/);return{rc:m?+m[1]:-1,out:o.replace(/__RC:\d+\s*$/,'')};}catch(e){return{rc:-99,out:String(e).slice(0,300)};}}
function putResult(name,txt){const u='https://api.github.com/repos/'+REPO+'/contents/analize/'+name;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk --max-time 30 -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:80e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'s401',content:Buffer.from(txt).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -sk --max-time 60 -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:80e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={VERSIJA_RUN:'run403-v1'}; let sid=null;
const PHP=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgUzQwMyBEaXNwYXRjaCBSZWNvbiB2MQogKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAgIGlmICggISBpc3NldCgkX0dFVFsncHNfczQwMyddKSB8fCAkX0dFVFsncHNfczQwMyddICE9PSAnSzQwM2RzJyApIHJldHVybjsKICAgIG5vY2FjaGVfaGVhZGVycygpOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICAgQHNldF90aW1lX2xpbWl0KDEyMCk7CiAgICBnbG9iYWwgJHdwZGI7ICRwZj0kd3BkYi0+cHJlZml4OwogICAgJHI9YXJyYXkoJ1ZFUlNJSkEnPT4nczQwMy12MScpOwogICAgJHJvb3Q9V1BfUExVR0lOX0RJUi4nL3BldHNob3AtY29yZS9pbmNsdWRlcyc7CgogICAgLy8gZGlzcGF0Y2g6IHNyYXV0dSByZWdpc3RyYXMgKyBzYWJsb25vIHBhcmlua2ltYXMKICAgICRjPWZpbGVfZ2V0X2NvbnRlbnRzKCRyb290LicvY2xhc3MtZW1haWwtZGlzcGF0Y2gucGhwJyk7CiAgICAkbD1leHBsb2RlKCJcbiIsJGMpOwogICAgJHJbJ2Rpc3BhdGNoJ109YXJyYXkoJ0InPT5zdHJsZW4oJGMpLCdlaWwnPT5jb3VudCgkbCksJ3NoYSc9PnN1YnN0cihoYXNoKCdzaGEyNTYnLCRjKSwwLDE2KSk7CiAgICAkenltPWFycmF5KCdGTE9XUycsJ2Zsb3cnLCd0ZW1wbGF0ZScsJ3RlbXBsYXRlcy9lbWFpbHMnLCdzdWJqZWN0JywncmVuZGVyJywnY29uc3QgJywnZnVuY3Rpb24gJywnY2FzZSAnKTsKICAgICRoaXRzPWFycmF5KCk7CiAgICBmb3JlYWNoKCRsIGFzICRpPT4kbG4peyBmb3JlYWNoKCR6eW0gYXMgJHopeyBpZihzdHJwb3MoJGxuLCR6KSE9PWZhbHNlKXsgJGhpdHNbXT0kaTsgYnJlYWs7IH0gfSB9CiAgICAkcm93cz1hcnJheSgpOyAkc2Vlbj1hcnJheSgpOwogICAgZm9yZWFjaCgkaGl0cyBhcyAkaCl7IGZvcigkaT1tYXgoMCwkaC0yKTskaTw9bWluKGNvdW50KCRsKS0xLCRoKzQpOyRpKyspeyBpZihpc3NldCgkc2VlblskaV0pKWNvbnRpbnVlOyRzZWVuWyRpXT0xOyRyb3dzW109KCRpKzEpLic6ICcucnRyaW0oc3Vic3RyKCRsWyRpXSwwLDE2NSkpOyB9IH0KICAgICRyWydkaXNwYXRjaF9mcmFnJ109YXJyYXlfc2xpY2UoJHJvd3MsMCwzMDApOwoKICAgIC8vIGV2ZW50IHJlZ2lzdHJ5CiAgICAkYzI9ZmlsZV9nZXRfY29udGVudHMoJHJvb3QuJy9jbGFzcy1ldmVudC1yZWdpc3RyeS5waHAnKTsKICAgICRyWydldmVudF9yZWdpc3RyeSddPXN1YnN0cigkYzIsMCw0MDAwKTsKCiAgICAvLyBldmVudF9sb2cgVEVJU0lOR0FTIHN0dWxwZWxpcwogICAgJHJbJ2l2eWtpYWknXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBldmVudF9uYW1lLCBDT1VOVCgqKSBjLCBNQVgoZW1pdHRlZF9hdCkgcGFza3V0aW5pcwogICAgICAgIEZST00geyRwZn1wc19ldmVudF9sb2cgR1JPVVAgQlkgZXZlbnRfbmFtZSBPUkRFUiBCWSBjIERFU0MgTElNSVQgMjUiLCBBUlJBWV9BKTsKICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoJHIsIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QUkVUVFlfUFJJTlQpOyBleGl0Owp9LCAxKTsK','base64').toString('utf8').replace(/^<\?php\s*/,'');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP S403 Dispatch Recon v1',code:PHP,scope:'global',active:true}));
for(let i=0;i<3&&!sid;i++){const r=sh('curl -sSk --max-time 60 '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
 try{const j=JSON.parse(r.out); if(j&&j.id)sid=j.id;}catch(e){} if(!sid)sh('sleep 4');}
O.sid=sid; sh('sleep 4');
function q(a,extra){const x=sh('curl -sSk --max-time 250 '+(extra||'')+' "'+SITE+'/?ps_s403=K403ds&act='+a+'&z='+Math.random()+'"');
 try{return JSON.parse(x.out);}catch(e){return {raw:x.out.slice(0,700)};}}
O.rez=q('x');
if(sid){fs.writeFileSync('/tmp/off.json',JSON.stringify({active:false}));
 sh('curl -sSk --max-time 30 -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/off.json "'+API+'/'+sid+'"');}
O.svetaine=sh('curl -sSk -o /dev/null -w "%{http_code}" --max-time 25 "'+SITE+'/"').out.trim();
putResult('s403.json', JSON.stringify(O,null,1));
console.log('OK');
