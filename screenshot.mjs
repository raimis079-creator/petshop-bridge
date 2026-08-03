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
const O={VERSIJA_RUN:'run377-v1'}; let sid=null;
try{const ls=sh('curl -sSk --max-time 40 '+AUTH+' "'+API+'?per_page=100"');const arr=JSON.parse(ls.out);const off=[];
 for(const s0 of arr){ if(s0.name&&s0.name.indexOf('TEMP')===0&&s0.active){
   fs.writeFileSync('/tmp/o.json',JSON.stringify({active:false}));
   sh('curl -sSk --max-time 30 -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/o.json "'+API+'/'+s0.id+'"'); off.push(s0.id);} }
 O.deakt=off;}catch(e){}
const PHP=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgUzM3NyBBcHBsaWNhdGlvbiBCYWNrdXBzIFJlY29uIHYxIChUSUsgU0tBSVRZTUFTKQogKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAgIGlmICggISBpc3NldCgkX0dFVFsncHNfczM3NyddKSB8fCAkX0dFVFsncHNfczM3NyddICE9PSAnSzM3N2FiJyApIHJldHVybjsKICAgIG5vY2FjaGVfaGVhZGVycygpOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICAgQHNldF90aW1lX2xpbWl0KDI0MCk7CiAgICAkcj1hcnJheSgnVkVSU0lKQSc9PidzMzc3LXYxJywnUEFTVEFCQSc9Pid0aWsgc2thaXR5bWFzLCBuaWVrbyBuZXRyaW5hbWEnKTsKCiAgICAkaG9tZT0nL2hvbWUvZ3l2dW5haTInOwogICAgJGFiPSRob21lLicvYXBwbGljYXRpb25fYmFja3Vwcyc7CiAgICAkclsna2F0YWxvZ2FzJ109JGFiOwogICAgJHJbJ3lyYSddPWlzX2RpcigkYWIpOwogICAgJHJbJ3Jhc29tYXMnXT1pc19kaXIoJGFiKT9pc193cml0YWJsZSgkYWIpOm51bGw7CgogICAgaWYoaXNfZGlyKCRhYikpewogICAgICAgICR2aXM9YXJyYXkoKTsKICAgICAgICAkaXQ9QHNjYW5kaXIoJGFiKTsKICAgICAgICBmb3JlYWNoKChhcnJheSkkaXQgYXMgJGYpewogICAgICAgICAgICBpZigkZj09PScuJ3x8JGY9PT0nLi4nKSBjb250aW51ZTsKICAgICAgICAgICAgJHA9JGFiLicvJy4kZjsKICAgICAgICAgICAgJGU9YXJyYXkoJ3ZhcmRhcyc9PiRmLCd0aXBhcyc9PmlzX2RpcigkcCk/J2thdGFsb2dhcyc6J2ZhaWxhcycsCiAgICAgICAgICAgICAgICAgICAgICdNQic9PmlzX2ZpbGUoJHApP3JvdW5kKGZpbGVzaXplKCRwKS8xMDQ4NTc2LDEpOm51bGwsCiAgICAgICAgICAgICAgICAgICAgICdkYXRhJz0+ZGF0ZSgnWS1tLWQgSDppJywgQGZpbGVtdGltZSgkcCkpKTsKICAgICAgICAgICAgaWYoaXNfZGlyKCRwKSl7CiAgICAgICAgICAgICAgICAvLyB2aWRpbmlzIHNhcmFzYXMgKDEgbHlnaXMpCiAgICAgICAgICAgICAgICAkdmlkPWFycmF5KCk7ICRzdW1hPTA7ICRuPTA7CiAgICAgICAgICAgICAgICBmb3JlYWNoKChhcnJheSlAc2NhbmRpcigkcCkgYXMgJGcpewogICAgICAgICAgICAgICAgICAgIGlmKCRnPT09Jy4nfHwkZz09PScuLicpIGNvbnRpbnVlOwogICAgICAgICAgICAgICAgICAgICRncD0kcC4nLycuJGc7ICRuKys7CiAgICAgICAgICAgICAgICAgICAgJHN6PWlzX2ZpbGUoJGdwKT9maWxlc2l6ZSgkZ3ApOjA7ICRzdW1hKz0kc3o7CiAgICAgICAgICAgICAgICAgICAgaWYoY291bnQoJHZpZCk8MjUpICR2aWRbXT1hcnJheSgndic9PiRnLCdNQic9PnJvdW5kKCRzei8xMDQ4NTc2LDEpLCdkYXRhJz0+ZGF0ZSgnWS1tLWQgSDppJyxAZmlsZW10aW1lKCRncCkpLCdkaXInPT5pc19kaXIoJGdwKSk7CiAgICAgICAgICAgICAgICB9CiAgICAgICAgICAgICAgICAkZVsndmlkdWplX2VsZW1lbnR1J109JG47CiAgICAgICAgICAgICAgICAkZVsndmlkdWplX01CJ109cm91bmQoJHN1bWEvMTA0ODU3NiwxKTsKICAgICAgICAgICAgICAgICRlWyd2aWR1amUnXT0kdmlkOwogICAgICAgICAgICB9CiAgICAgICAgICAgICR2aXNbXT0kZTsKICAgICAgICB9CiAgICAgICAgJHJbJ3R1cmlueXMnXT0kdmlzOwogICAgfQoKICAgIC8vIEluc3RhbGxhdHJvbiBwZWRzYWthaSDigJQga29raWFzIHN2ZXRhaW5lcyBqaXMgdmFsZG8KICAgICRpbnN0PSRob21lLicvLmFwcGRhdGEnOwogICAgaWYoaXNfZGlyKCRpbnN0KSl7CiAgICAgICAgJGw9YXJyYXkoKTsKICAgICAgICB0cnl7ICRpdDI9bmV3IFJlY3Vyc2l2ZUl0ZXJhdG9ySXRlcmF0b3IobmV3IFJlY3Vyc2l2ZURpcmVjdG9yeUl0ZXJhdG9yKCRpbnN0LCBGaWxlc3lzdGVtSXRlcmF0b3I6OlNLSVBfRE9UUykpOwogICAgICAgICAgICAgZm9yZWFjaCgkaXQyIGFzICRmKXsgaWYoY291bnQoJGwpPDQwKSAkbFtdPXN0cl9yZXBsYWNlKCRob21lLCd+JywkZi0+Z2V0UGF0aG5hbWUoKSkuJyAoJy4kZi0+Z2V0U2l6ZSgpLidCKSc7IH0gfWNhdGNoKFRocm93YWJsZSAkZSl7fQogICAgICAgICRyWydhcHBkYXRhJ109JGw7CiAgICB9CiAgICAvLyBhciBJbnN0YWxsYXRyb24gbXUtcGx1Z2luIG51cm9kbyBpbnN0YWxpYWNpamEKICAgICRtdT1XUE1VX1BMVUdJTl9ESVIuJy9hdXRvbWF0aW9uLWJ5LWluc3RhbGxhdHJvbi5waHAnOwogICAgaWYoaXNfZmlsZSgkbXUpKSAkclsnaW5zdGFsbGF0cm9uX211J109c3Vic3RyKGZpbGVfZ2V0X2NvbnRlbnRzKCRtdSksMCw3MDApOwogICAgZWNobyB3cF9qc29uX2VuY29kZSgkciwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BSRVRUWV9QUklOVCk7IGV4aXQ7Cn0sIDEpOwo=','base64').toString('utf8').replace(/^<\?php\s*/,'');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP S377 AppBackups Recon v1',code:PHP,scope:'global',active:true}));
for(let i=0;i<3&&!sid;i++){const r=sh('curl -sSk --max-time 60 '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
 try{const j=JSON.parse(r.out); if(j&&j.id)sid=j.id;}catch(e){} if(!sid)sh('sleep 4');}
O.sid=sid; sh('sleep 4');
function q(a,extra){const x=sh('curl -sSk --max-time 280 '+(extra||'')+' "'+SITE+'/?ps_s377=K377ab&act='+a+'&z='+Math.random()+'"');
 try{return JSON.parse(x.out);}catch(e){return {raw:x.out.slice(0,700)};}}
O.rez=q('x');
O.svetaine=sh('curl -sSk -o /dev/null -w "%{http_code}" --max-time 30 "'+SITE+'/"').out.trim();
O.svetaine=sh('curl -sSk -o /dev/null -w "%{http_code}" --max-time 30 "'+SITE+'/"').out.trim();
O.parduotuve=sh('curl -sSk -o /dev/null -w "%{http_code}" --max-time 30 "'+SITE+'/parduotuve/"').out.trim();
if(sid){fs.writeFileSync('/tmp/off.json',JSON.stringify({active:false}));
 sh('curl -sSk --max-time 30 -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/off.json "'+API+'/'+sid+'"');}
putResult('s377.json', JSON.stringify(O,null,1));
console.log('OK');
