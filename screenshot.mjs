import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function sh(c){try{return execSync(c+' 2>&1',{maxBuffer:20e6,shell:'/bin/bash'}).toString();}catch(e){return String(e).slice(0,300);}}
function putResult(name,txt){const u='https://api.github.com/repos/'+REPO+'/contents/analize/'+name;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk --max-time 30 -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:20e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'s424',content:Buffer.from(txt).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -sk --max-time 60 -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:20e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={VERSIJA_RUN:'run424-v1'}; let sid=null;
const PHP=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgUzQyNCBDYXRlZ29yeSBVUkwgUmVjb24gdjEKICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgICBpZiAoICEgaXNzZXQoJF9HRVRbJ3BzX3M0MjQnXSkgfHwgJF9HRVRbJ3BzX3M0MjQnXSAhPT0gJ0s0MjRjdScgKSByZXR1cm47CiAgICBub2NhY2hlX2hlYWRlcnMoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAgIEBzZXRfdGltZV9saW1pdCgxODApOwogICAgZ2xvYmFsICR3cGRiOyAkcGY9JHdwZGItPnByZWZpeDsKICAgICRyPWFycmF5KCdWRVJTSUpBJz0+J3M0MjQtdjEnKTsKCiAgICAvLyAxKSBwZXJtYWxpbmsgc3RydWt0dXJhCiAgICAkclsncGVybWFsaW5rX3N0cnVjdHVyZSddPWdldF9vcHRpb24oJ3Blcm1hbGlua19zdHJ1Y3R1cmUnKTsKICAgICRwYj1nZXRfb3B0aW9uKCd3b29jb21tZXJjZV9wZXJtYWxpbmtzJyk7CiAgICAkclsnd29vX3Blcm1hbGlua3MnXT0kcGI7CiAgICAkclsnY2F0ZWdvcnlfYmFzZSddPWlzc2V0KCRwYlsnY2F0ZWdvcnlfYmFzZSddKT8kcGJbJ2NhdGVnb3J5X2Jhc2UnXTonPyc7CiAgICAkclsncHJvZHVjdF9iYXNlJ109aXNzZXQoJHBiWydwcm9kdWN0X2Jhc2UnXSk/JHBiWydwcm9kdWN0X2Jhc2UnXTonPyc7CgogICAgLy8gMikgVElLUkkga2F0ZWdvcmlqdSBVUkwKICAgIGZvcmVhY2goYXJyYXkoJ3N1bmltcycsJ2thdGVtcycsJ2dyYXV6aWthbXMnLCdwYXVrc2NpYW1zJywnenV2aW1zJykgYXMgJHNsdWcpewogICAgICAgICR0PWdldF90ZXJtX2J5KCdzbHVnJywkc2x1ZywncHJvZHVjdF9jYXQnKTsKICAgICAgICBpZighJHQpeyAkclsna2F0ZWdvcmlqb3MnXVskc2x1Z109J1RFUk1JTk8gTkVSQSc7IGNvbnRpbnVlOyB9CiAgICAgICAgJHJbJ2thdGVnb3Jpam9zJ11bJHNsdWddPWFycmF5KAogICAgICAgICAgJ3Rlcm1faWQnPT4kdC0+dGVybV9pZCwncGF2YWRpbmltYXMnPT4kdC0+bmFtZSwnY291bnQnPT4kdC0+Y291bnQsCiAgICAgICAgICAncGFyZW50Jz0+JHQtPnBhcmVudCwnVVJMJz0+Z2V0X3Rlcm1fbGluaygkdCkpOwogICAgfQogICAgLy8gdmFpa2luZXMKICAgICR0PWdldF90ZXJtX2J5KCdzbHVnJywnc3VuaW1zJywncHJvZHVjdF9jYXQnKTsKICAgIGlmKCR0KXsKICAgICAgICAkdmFpa2FpPWdldF90ZXJtcyhhcnJheSgndGF4b25vbXknPT4ncHJvZHVjdF9jYXQnLCdwYXJlbnQnPT4kdC0+dGVybV9pZCwnaGlkZV9lbXB0eSc9PmZhbHNlKSk7CiAgICAgICAgZm9yZWFjaCgkdmFpa2FpIGFzICR2KSAkclsnc3VuaW1zX3ZhaWthaSddWyR2LT5zbHVnXT1hcnJheSgnaWQnPT4kdi0+dGVybV9pZCwnY291bnQnPT4kdi0+Y291bnQsJ1VSTCc9PmdldF90ZXJtX2xpbmsoJHYpKTsKICAgIH0KICAgIC8vIDMpIGxhbmRpbmcgc25pcHBldGFpCiAgICAkclsnbGFuZGluZ19zbmlwcGV0YWknXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCxuYW1lLGFjdGl2ZSBGUk9NIHskcGZ9c25pcHBldHMKICAgICAgICBXSEVSRSBuYW1lIExJS0UgJyVhbmRpbiUnIE9SIG5hbWUgTElLRSAnJUF0cmlua3RvcyUnIE9SIG5hbWUgTElLRSAnJU1haXN0byB0aXBvJScgT1IgbmFtZSBMSUtFICclZmlsdHIlJwogICAgICAgIE9SREVSIEJZIGlkIiwgQVJSQVlfQSk7CiAgICAkclsncGV0c2hvcF9sYW5kaW5nX21hcCddPSBmdW5jdGlvbl9leGlzdHMoJ3BldHNob3BfbGFuZGluZ19tYXAnKSA/ICdmdW5rY2lqYSBZUkEnIDogJ2Z1bmtjaWpvcyBORVJBJzsKICAgIGlmKGZ1bmN0aW9uX2V4aXN0cygncGV0c2hvcF9sYW5kaW5nX21hcCcpKXsKICAgICAgICAkbT1wZXRzaG9wX2xhbmRpbmdfbWFwKCk7CiAgICAgICAgJHJbJ2xhbmRpbmdfbWFwJ109aXNfYXJyYXkoJG0pP2FycmF5X2tleXMoJG0pOiRtOwogICAgfQogICAgLy8gNCkga2llayBpcyB2aXNvIGthdGVnb3JpanUKICAgICRyWydrYXRlZ29yaWp1X3Zpc28nXT0oaW50KXdwX2NvdW50X3Rlcm1zKGFycmF5KCd0YXhvbm9teSc9Pidwcm9kdWN0X2NhdCcsJ2hpZGVfZW1wdHknPT5mYWxzZSkpOwogICAgJHJbJ3RvcF9rYXRlZ29yaWpvcyddPSR3cGRiLT5nZXRfcmVzdWx0cygiCiAgICAgIFNFTEVDVCB0LnNsdWcsIHQubmFtZSwgdHQuY291bnQsIHR0LnBhcmVudCBGUk9NIHskcGZ9dGVybXMgdAogICAgICBKT0lOIHskcGZ9dGVybV90YXhvbm9teSB0dCBPTiB0dC50ZXJtX2lkPXQudGVybV9pZCBBTkQgdHQudGF4b25vbXk9J3Byb2R1Y3RfY2F0JwogICAgICBXSEVSRSB0dC5wYXJlbnQ9MCBPUkRFUiBCWSB0dC5jb3VudCBERVNDIExJTUlUIDE1IiwgQVJSQVlfQSk7CiAgICAvLyA1KSBTRU8gNDA0IHNhcmFzZSBtaW5pbWkga2VsaWFpCiAgICBmb3JlYWNoKGFycmF5KCcvc3VuaW1zLycsJy9rYXRlbXMvJywnL3N1bmltcy9hbnRpcGFyYXppdGluZXMtcHJpZW1vbmVzLXN1bmltcy8nLCcvaGlwb2FsZXJnaW5pcy1tYWlzdGFzLXN1bmltcy8nKSBhcyAkayl7CiAgICAgICAgJHJbJzQwNF9rYW5kaWRhdGFpJ11bJGtdPXVybF90b19wb3N0aWQoaG9tZV91cmwoJGspKTsKICAgIH0KICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoJHIsIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QUkVUVFlfUFJJTlQpOyBleGl0Owp9LCAxKTsK','base64').toString('utf8').replace(/^<\?php\s*/,'');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP S424 Cat URL v1',code:PHP,scope:'global',active:true}));
for(let i=0;i<3&&!sid;i++){const t=sh('curl -sSk --max-time 60 '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
 try{const j=JSON.parse(t); if(j&&j.id)sid=j.id;}catch(e){} if(!sid)sh('sleep 4');}
O.sid=sid; sh('sleep 4');
const x=sh('curl -sSk --max-time 180 "'+SITE+'/?ps_s424=K424cu&z='+Math.random()+'"');
try{O.rez=JSON.parse(x);}catch(e){O.rez={raw:String(x).slice(0,500)};}
// HTTP patikra tikriems URL
if(O.rez&&O.rez.kategorijos){
  O.http={};
  for(const [k,v] of Object.entries(O.rez.kategorijos)){
    if(v&&v.URL){ O.http[k]=sh('curl -sSk -o /dev/null -w "%{http_code}" --max-time 30 "'+v.URL+'"').trim()+' → '+v.URL; }
  }
}
if(sid){fs.writeFileSync('/tmp/off.json',JSON.stringify({active:false}));
 sh('curl -sSk --max-time 30 -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/off.json "'+API+'/'+sid+'"');}
putResult('s424.json', JSON.stringify(O,null,1));
console.log('OK');
