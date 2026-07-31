import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function putB64(n,b){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b,...(s?{sha:s}:{})}));
  const c=execSync('curl -sk -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
function sh(c){try{const o=execSync(c+' 2>&1; echo "__RC:$?"',{maxBuffer:50e6,shell:'/bin/bash'}).toString();
 const m=o.match(/__RC:(\d+)\s*$/);return{rc:m?+m[1]:-1,out:o.replace(/__RC:\d+\s*$/,'')};}catch(e){return{rc:-99,out:String(e).slice(0,300)};}}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={}; let sid=null;
const php=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgTTggUmVjb24gdjIKICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgICBpZiAoICEgaXNzZXQoJF9HRVRbJ3BzX204J10pIHx8ICRfR0VUWydwc19tOCddICE9PSAnTW44azInICkgcmV0dXJuOwogICAgbm9jYWNoZV9oZWFkZXJzKCk7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgICAkciA9IGFycmF5KCk7CiAgICAkYmFzZSA9IFdQX1BMVUdJTl9ESVIgLiAnL3BldHNob3AtY29yZS8nOwoKICAgIC8vIDEpIHNob3VsZF9sb2FkKCkgaXIgYWN0aW9uPWNyZWF0ZSBsb2dpa2EgcGV0LXVpLnBocAogICAgJGMgPSBmaWxlX2dldF9jb250ZW50cygkYmFzZS4naW5jbHVkZXMvY2xhc3MtcGV0LXVpLnBocCcpOwogICAgJGkgPSBzdHJwb3MoJGMsICdzaG91bGRfbG9hZCcpOwogICAgJHJbJ3Nob3VsZF9sb2FkJ10gPSAkaSE9PWZhbHNlID8gc3Vic3RyKCRjLCBtYXgoMCwkaS0yMDApLCAxNjAwKSA6ICduZXJhc3RhJzsKICAgICRqID0gc3RycG9zKCRjLCAnYWN0aW9uPWNyZWF0ZScpOwogICAgJHJbJ3BldF91aV9jcmVhdGUnXSA9ICRqIT09ZmFsc2UgPyBzdWJzdHIoJGMsIG1heCgwLCRqLTgwMCksIDEyMDApIDogJ25lcmFzdGEnOwoKICAgIC8vIDIpIHBldC1mb3JtLmpzIOKAlCDigJ5TdWt1cnRpIHByb2ZpbMSvIiBpciBtb3VudAogICAgJGpzID0gZmlsZV9nZXRfY29udGVudHMoJGJhc2UuJ2Fzc2V0cy9wZXQtZm9ybS5qcycpOwogICAgJGsgPSBzdHJwb3MoJGpzLCAnU3VrdXJ0aSBwcm9maWzErycpOwogICAgJHJbJ2pzX215Z3R1a2FzJ10gPSAkayE9PWZhbHNlID8gc3Vic3RyKCRqcywgbWF4KDAsJGstOTAwKSwgMTQwMCkgOiAnbmVyYXN0YSc7CiAgICAkbSA9IHN0cnBvcygkanMsICdQZXRzaG9wUGV0Rm9ybScpOwogICAgJHJbJ2pzX21vdW50J10gPSAkbSE9PWZhbHNlID8gc3Vic3RyKCRqcywgbWF4KDAsJG0tMzAwKSwgMTEwMCkgOiAnbmVyYXN0YSc7CiAgICAkbiA9IHN0cnBvcygkanMsICdhY3Rpb249Y3JlYXRlJyk7CiAgICAkclsnanNfY3JlYXRlJ10gPSAkbiE9PWZhbHNlID8gc3Vic3RyKCRqcywgbWF4KDAsJG4tNjAwKSwgOTAwKSA6ICduZXJhc3RhJzsKICAgICRyWydqc19QU1BldEZvcm1Jbml0X2thcnRhaSddID0gc3Vic3RyX2NvdW50KCRqcywgJ1BTUGV0Rm9ybUluaXQnKTsKICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoJHIsIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7CiAgICBleGl0Owp9KTsK','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP M8 Recon v2',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(sid){
  sh('sleep 5');
  O.site=sh('curl -sSk -m 25 -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
  const d=sh('curl -sSk -m 60 "'+SITE+'/?ps_m8=Mn8k2"');
  try{O.m8=JSON.parse(d.out);}catch(e){O.raw=d.out.slice(0,1200);}
  fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
  sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
  sh('sleep 2');
  O.site_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
}
putB64('m8_recon2.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
