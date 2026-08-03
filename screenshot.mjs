import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function sh(c){try{const o=execSync(c+' 2>&1; echo "__RC:$?"',{maxBuffer:50e6,shell:'/bin/bash'}).toString();
 const m=o.match(/__RC:(\d+)\s*$/);return{rc:m?+m[1]:-1,out:o.replace(/__RC:\d+\s*$/,'')};}catch(e){return{rc:-99,out:String(e).slice(0,300)};}}
function putResult(name,txt){const u='https://api.github.com/repos/'+REPO+'/contents/analize/'+name;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk --max-time 30 -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:80e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'s366',content:Buffer.from(txt).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -sk --max-time 60 -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:80e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={VERSIJA_RUN:'run368-v1'}; let sid=null;
try{const ls=sh('curl -sSk --max-time 40 '+AUTH+' "'+API+'?per_page=100"');const arr=JSON.parse(ls.out);const off=[];
 for(const s0 of arr){ if(s0.name&&s0.name.indexOf('TEMP')===0&&s0.active){
   fs.writeFileSync('/tmp/o.json',JSON.stringify({active:false}));
   sh('curl -sSk --max-time 30 -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/o.json "'+API+'/'+s0.id+'"'); off.push(s0.id);} }
 O.deakt=off;}catch(e){}
const PHP=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgUzM2OCBVbWJyZWxsYSBQdXJnZSB2MQogKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAgIGlmICggISBpc3NldCgkX0dFVFsncHNfczM2OCddKSB8fCAkX0dFVFsncHNfczM2OCddICE9PSAnSzM2OHA5JyApIHJldHVybjsKICAgIG5vY2FjaGVfaGVhZGVycygpOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICAgZ2xvYmFsICR3cGRiOyAkcGY9JHdwZGItPnByZWZpeDsKICAgIHJlcXVpcmVfb25jZSBBQlNQQVRILid3cC1hZG1pbi9pbmNsdWRlcy9wbHVnaW4ucGhwJzsKICAgIHJlcXVpcmVfb25jZSBBQlNQQVRILid3cC1hZG1pbi9pbmNsdWRlcy9maWxlLnBocCc7CiAgICAkcj1hcnJheSgnVkVSU0lKQSc9PidzMzY4LXYxJyk7CiAgICAkc2x1Zz0nd3AtaGVhbHRoJzsgJG1haW49JHNsdWcuJy8nLiRzbHVnLicucGhwJzsKCiAgICAkclsncHJpZXMnXT1hcnJheSgnYWt0eXZ1cyc9PmlzX3BsdWdpbl9hY3RpdmUoJG1haW4pLCdmYWlsYXMnPT5maWxlX2V4aXN0cyhXUF9QTFVHSU5fRElSLicvJy4kbWFpbikpOwoKICAgIC8vIDEpIGRlYWt0eXZ1b3RpCiAgICBpZihpc19wbHVnaW5fYWN0aXZlKCRtYWluKSkgZGVhY3RpdmF0ZV9wbHVnaW5zKCRtYWluLCB0cnVlKTsKICAgICRyWydwb19kZWFrdHl2YXZpbW8nXT1pc19wbHVnaW5fYWN0aXZlKCRtYWluKTsKCiAgICAvLyAyKSBpc3RyaW50aSBmYWlsdXMKICAgIGlmKGZpbGVfZXhpc3RzKFdQX1BMVUdJTl9ESVIuJy8nLiRzbHVnKSl7CiAgICAgICAgJGQ9ZGVsZXRlX3BsdWdpbnMoYXJyYXkoJG1haW4pKTsKICAgICAgICAkclsndHJ5bmltYXMnXT1pc193cF9lcnJvcigkZCk/JGQtPmdldF9lcnJvcl9tZXNzYWdlKCk6KCRkPT09dHJ1ZT8nT0snOnZhcl9leHBvcnQoJGQsdHJ1ZSkpOwogICAgfQogICAgJHJbJ2thdGFsb2dhc19saWtvJ109ZmlsZV9leGlzdHMoV1BfUExVR0lOX0RJUi4nLycuJHNsdWcpOwoKICAgIC8vIDMpIGlzdmFseXRpIGpvIHBhbGlrdGFzIG9wY2lqYXMgLyBjcm9uIC8gbGVudGVsZXMKICAgICRvcHQ9JHdwZGItPmdldF9jb2woIlNFTEVDVCBvcHRpb25fbmFtZSBGUk9NIHskcGZ9b3B0aW9ucyBXSEVSRSBvcHRpb25fbmFtZSBMSUtFICcldW1icmVsbGElJyBPUiBvcHRpb25fbmFtZSBMSUtFICd3cF9oZWFsdGglJyBPUiBvcHRpb25fbmFtZSBMSUtFICd3cC1oZWFsdGglJyIpOwogICAgZm9yZWFjaCgkb3B0IGFzICRvKSBkZWxldGVfb3B0aW9uKCRvKTsKICAgICRyWydpc3RyaW50b3Nfb3BjaWpvcyddPSRvcHQ7CgogICAgJGNyPWFycmF5KCk7CiAgICBmb3JlYWNoKF9nZXRfY3Jvbl9hcnJheSgpID86IGFycmF5KCkgYXMgJHRzPT4kaG9va3MpewogICAgICAgIGZvcmVhY2goJGhvb2tzIGFzICRob29rPT4kdil7CiAgICAgICAgICAgIGlmKHN0cmlwb3MoJGhvb2ssJ3VtYnJlbGxhJykhPT1mYWxzZSB8fCBzdHJpcG9zKCRob29rLCd3cF9oZWFsdGgnKSE9PWZhbHNlKXsKICAgICAgICAgICAgICAgIHdwX2NsZWFyX3NjaGVkdWxlZF9ob29rKCRob29rKTsgJGNyW109JGhvb2s7CiAgICAgICAgICAgIH0KICAgICAgICB9CiAgICB9CiAgICAkclsnaXN0cmludGlfY3JvbiddPWFycmF5X3ZhbHVlcyhhcnJheV91bmlxdWUoJGNyKSk7CgogICAgJHRiPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgdGFibGVfbmFtZSBGUk9NIGluZm9ybWF0aW9uX3NjaGVtYS5UQUJMRVMgV0hFUkUgdGFibGVfc2NoZW1hPURBVEFCQVNFKCkgQU5EICh0YWJsZV9uYW1lIExJS0UgJyV1bWJyZWxsYSUnIE9SIHRhYmxlX25hbWUgTElLRSAnJXdwX2hlYWx0aCUnKSIpOwogICAgJHJbJ2xpa3VzaW9zX2xlbnRlbGVzJ109JHRiOyAgIC8vIE5FVFJJTkFNIGF1dG9tYXRpc2thaSDigJQgdGlrIHBhcm9kb20KCiAgICAvLyA0KSBnYWx1dGluZSBwYXRpa3JhCiAgICAkclsncG8nXT1hcnJheSgKICAgICAgJ2FrdHl2dXMnPT5pc19wbHVnaW5fYWN0aXZlKCRtYWluKSwKICAgICAgJ2ZhaWxhcyc9PmZpbGVfZXhpc3RzKFdQX1BMVUdJTl9ESVIuJy8nLiRtYWluKSwKICAgICAgJ2thdGFsb2dhcyc9PmZpbGVfZXhpc3RzKFdQX1BMVUdJTl9ESVIuJy8nLiRzbHVnKSwKICAgICAgJ2xpa3VzaW9zX29wY2lqb3MnPT4kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIG9wdGlvbl9uYW1lIEZST00geyRwZn1vcHRpb25zIFdIRVJFIG9wdGlvbl9uYW1lIExJS0UgJyV1bWJyZWxsYSUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJ3dwX2hlYWx0aCUnIiksCiAgICApOwogICAgJHJbJ2FrdHl2dXNfcGx1Z2ludV9zayddPWNvdW50KChhcnJheSlnZXRfb3B0aW9uKCdhY3RpdmVfcGx1Z2lucycpKTsKICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoJHIsIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QUkVUVFlfUFJJTlQpOyBleGl0Owp9LCAxKTsK','base64').toString('utf8').replace(/^<\?php\s*/,'');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP S368 Umbrella Purge v1',code:PHP,scope:'global',active:true}));
for(let i=0;i<3&&!sid;i++){const r=sh('curl -sSk --max-time 60 '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
 try{const j=JSON.parse(r.out); if(j&&j.id)sid=j.id;}catch(e){} if(!sid)sh('sleep 4');}
O.sid=sid; sh('sleep 4');
function q(a,extra){const x=sh('curl -sSk --max-time 90 '+(extra||'')+' "'+SITE+'/?ps_s368=K368p9&act='+a+'&z='+Math.random()+'"');
 try{return JSON.parse(x.out);}catch(e){return {raw:x.out.slice(0,700)};}}
O.purge=q('purge');
O.svetaine=sh('curl -sSk -o /dev/null -w "%{http_code}" --max-time 30 "'+SITE+'/"').out.trim();
O.parduotuve=sh('curl -sSk -o /dev/null -w "%{http_code}" --max-time 30 "'+SITE+'/parduotuve/"').out.trim();
if(sid){fs.writeFileSync('/tmp/off.json',JSON.stringify({active:false}));
 sh('curl -sSk --max-time 30 -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/off.json "'+API+'/'+sid+'"');}
putResult('s368.json', JSON.stringify(O,null,1));
console.log('OK');
