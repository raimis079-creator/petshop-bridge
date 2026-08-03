import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function sh(c){try{const o=execSync(c+' 2>&1; echo "__RC:$?"',{maxBuffer:50e6,shell:'/bin/bash'}).toString();
 const m=o.match(/__RC:(\d+)\s*$/);return{rc:m?+m[1]:-1,out:o.replace(/__RC:\d+\s*$/,'')};}catch(e){return{rc:-99,out:String(e).slice(0,300)};}}
function putResult(name,txt){const u='https://api.github.com/repos/'+REPO+'/contents/analize/'+name;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk --max-time 30 -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:80e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'s346',content:Buffer.from(txt).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -sk --max-time 60 -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:80e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={VERSIJA_RUN:'run346-v1'};
// 1. deaktyvuoti visus aktyvius TEMP*
try{const ls=sh('curl -sSk --max-time 40 '+AUTH+' "'+API+'?per_page=100"');const arr=JSON.parse(ls.out);const off=[];
 for(const s0 of arr){ if(s0.name && s0.name.indexOf('TEMP')===0 && s0.active){
   fs.writeFileSync('/tmp/off.json',JSON.stringify({active:false}));
   sh('curl -sSk --max-time 30 -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/off.json "'+API+'/'+s0.id+'"');
   off.push(s0.id);} }
 O.deaktyvuota_TEMP=off;}catch(e){O.valymo_klaida=String(e).slice(0,200);}
// 2. sukurti nauja TEMP snippet
const PHP=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgUzM0NiBXZWlnaHQgUGF0aCBJbnZlbnRvcnkgdjEgKHdlaWdodF91cGRhdGVkX2F0IGtlbGl1IGludmVudG9yaXphY2lqYSkKICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgICBpZiAoICEgaXNzZXQoJF9HRVRbJ3BzX3MzNDYnXSkgfHwgJF9HRVRbJ3BzX3MzNDYnXSAhPT0gJ0szNDZyNycgKSByZXR1cm47CiAgICBub2NhY2hlX2hlYWRlcnMoKTsKICAgIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgICAkciA9IGFycmF5KCdWRVJTSUpBJz0+J3MzNDYtdjEnKTsKICAgICRyb290cyA9IGFycmF5KCdwbHVnaW5zJz0+V1BfUExVR0lOX0RJUiwnbXUnPT5XUE1VX1BMVUdJTl9ESVIsJ3RoZW1lJz0+Z2V0X3RoZW1lX3Jvb3QoKSk7CiAgICAkaGl0cyA9IGFycmF5KCk7CiAgICBmb3JlYWNoKCRyb290cyBhcyAkaz0+JHJvb3QpewogICAgICAgIGlmKCFpc19kaXIoJHJvb3QpKSBjb250aW51ZTsKICAgICAgICB0cnkgewogICAgICAgICAgJGl0ID0gbmV3IFJlY3Vyc2l2ZUl0ZXJhdG9ySXRlcmF0b3IobmV3IFJlY3Vyc2l2ZURpcmVjdG9yeUl0ZXJhdG9yKCRyb290LCBGaWxlc3lzdGVtSXRlcmF0b3I6OlNLSVBfRE9UUykpOwogICAgICAgIH0gY2F0Y2ggKEV4Y2VwdGlvbiAkZSkgeyBjb250aW51ZTsgfQogICAgICAgIGZvcmVhY2goJGl0IGFzICRmKXsKICAgICAgICAgICAgJHAgPSAkZi0+Z2V0UGF0aG5hbWUoKTsKICAgICAgICAgICAgaWYoIXByZWdfbWF0Y2goJy9cLihwaHB8anMpJC9pJywkcCkpIGNvbnRpbnVlOwogICAgICAgICAgICBpZihzdHJwb3MoJHAsJy9ub2RlX21vZHVsZXMvJykhPT1mYWxzZSkgY29udGludWU7CiAgICAgICAgICAgIGlmKHN0cnBvcygkcCwnLmJhaycpIT09ZmFsc2UgfHwgc3RycG9zKCRwLCdxdWFyYW50aW5lJykhPT1mYWxzZSkgY29udGludWU7CiAgICAgICAgICAgICRjID0gQGZpbGVfZ2V0X2NvbnRlbnRzKCRwKTsKICAgICAgICAgICAgaWYoJGM9PT1mYWxzZSkgY29udGludWU7CiAgICAgICAgICAgIGlmKHN0cnBvcygkYywnd2VpZ2h0X3VwZGF0ZWRfYXQnKT09PWZhbHNlKSBjb250aW51ZTsKICAgICAgICAgICAgJGxpbmVzID0gZXhwbG9kZSgiXG4iLCRjKTsKICAgICAgICAgICAgZm9yZWFjaCgkbGluZXMgYXMgJGk9PiRsbil7CiAgICAgICAgICAgICAgICBpZihzdHJwb3MoJGxuLCd3ZWlnaHRfdXBkYXRlZF9hdCcpIT09ZmFsc2UpewogICAgICAgICAgICAgICAgICAgICRoaXRzW10gPSBhcnJheSgnZic9PnN0cl9yZXBsYWNlKEFCU1BBVEgsJycsJHApLCdsJz0+JGkrMSwncyc9PnRyaW0oc3Vic3RyKCRsbiwwLDE3MCkpKTsKICAgICAgICAgICAgICAgIH0KICAgICAgICAgICAgfQogICAgICAgIH0KICAgIH0KICAgICRyWyd3dWEnXSA9ICRoaXRzOwogICAgZ2xvYmFsICR3cGRiOyAkcGY9JHdwZGItPnByZWZpeDsKICAgICR1dGMgPSBnbWRhdGUoJ1ktbS1kIEg6aTpzJyk7CiAgICAkclsnbm93X3V0YyddID0gJHV0YzsKICAgICRyWydub3dfbG9jYWwnXSA9IGN1cnJlbnRfdGltZSgnbXlzcWwnKTsKICAgICRyWydwZXRzX3RvdGFsJ10gPSAoaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHBmfXBzX3BldHMiKTsKICAgICRyWyd3dWFfbm90bnVsbCddID0gKGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRwZn1wc19wZXRzIFdIRVJFIHdlaWdodF91cGRhdGVkX2F0IElTIE5PVCBOVUxMIik7CiAgICAkclsnd3VhX2Z1dHVyZSddID0gKGludCkkd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIENPVU5UKCopIEZST00geyRwZn1wc19wZXRzIFdIRVJFIHdlaWdodF91cGRhdGVkX2F0ID4gJXMiLCAkdXRjKSk7CiAgICAkclsnd3VhX2xhc3Q1J10gPSAkd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCxjdXJyZW50X3dlaWdodF9rZyx3ZWlnaHRfdXBkYXRlZF9hdCx1cGRhdGVkX2F0IEZST00geyRwZn1wc19wZXRzIE9SREVSIEJZIGlkIERFU0MgTElNSVQgNSIsIEFSUkFZX0EpOwogICAgZWNobyB3cF9qc29uX2VuY29kZSgkcik7IGV4aXQ7Cn0sIDEpOwo=','base64').toString('utf8').replace(/^<\?php\s*/,'');
let sid=null;
try{fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP S346 Weight Path Inventory v1',code:PHP,scope:'global',active:true,priority:10}));
 const cr=sh('curl -sSk --max-time 60 '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
 const j=JSON.parse(cr.out); sid=j.id||null; O.snippet_id=sid; O.snippet_active=j.active;}catch(e){O.kurimo_klaida=String(e).slice(0,300);}
sh('sleep 3');
// 3. GET
const g=sh('curl -sSk --max-time 90 "'+SITE+'/?ps_s346=K346r7&nonce='+Math.random()+'"');
O.http_len=g.out.length;
try{O.rez=JSON.parse(g.out);}catch(e){O.raw=g.out.slice(0,1200);}
// 4. deaktyvuoti
if(sid){fs.writeFileSync('/tmp/off2.json',JSON.stringify({active:false}));
 const d=sh('curl -sSk --max-time 30 -o /dev/null -w "%{http_code}" '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/off2.json "'+API+'/'+sid+'"');
 O.deaktyvuotas=d.out.trim();}
putResult('s346.json', JSON.stringify(O,null,1));
console.log('OK');
