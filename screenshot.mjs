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
// pirma deaktyvuoti visus senus TEMP Multi Pack snippetus
try{
  const l=sh('curl -sSk '+AUTH+' "'+API+'?per_page=100"').out;
  const arr=JSON.parse(l);
  O.deactivated=[];
  for(const x of arr){
    if(/TEMP Multi Pack/i.test(x.name||'') && x.active){
      fs.writeFileSync('/tmp/d0.json',JSON.stringify({active:false}));
      sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/d0.json "'+API+'/'+x.id+'"');
      O.deactivated.push(x.id);
    }
  }
}catch(e){ O.deact_err=String(e).slice(0,150); }
const php=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgTXVsdGkgUGFjayBMb2dpYyB2MQogKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAgIGlmICggISBpc3NldCgkX0dFVFsncHNfbXAnXSkgfHwgJF9HRVRbJ3BzX21wJ10gIT09ICdNcDV3JyApIHJldHVybjsKICAgICRyPWFycmF5KCk7CiAgICAkZj1XUF9QTFVHSU5fRElSLicvd2MtdmVuaXBhay1zaGlwcGluZy9hZG1pbi9jbGFzcy13b29jb21tZXJjZS1zaG9wdXAtdmVuaXBhay1zaGlwcGluZy1hZG1pbi1kaXNwYXRjaC5waHAnOwogICAgJGxpbmVzPWZpbGUoJGYpOwogICAgLy8gYmxva2FpIGFwaWUgcGFja19udW1iZXJzIHByaXNreXJpbWEKICAgICRtYXJrcz1hcnJheSgpOwogICAgZm9yZWFjaCAoJGxpbmVzIGFzICRpPT4kbG4pIGlmIChwcmVnX21hdGNoKCcjcGFja19udW1iZXJzIycsJGxuKSkgJG1hcmtzW109JGk7CiAgICAkclsncGFja19saW5lcyddPWFycmF5KCk7CiAgICBmb3JlYWNoICgkbWFya3MgYXMgJG0pICRyWydwYWNrX2xpbmVzJ11bXT0oJG0rMSkuJzogJy50cmltKHJ0cmltKCRsaW5lc1skbV0pKTsKICAgIC8vIHBsYXRlc25pcyBrb250ZWtzdGFzIGFwaWUgMjQwLTMzMAogICAgJHNuPWFycmF5KCk7CiAgICBmb3IoJGk9MjM1OyRpPD0zMzUgJiYgJGk8Y291bnQoJGxpbmVzKTskaSsrKSAkc25bXT0oJGkrMSkuJzogJy5ydHJpbSgkbGluZXNbJGldKTsKICAgICRyWydibG9ja18yNDBfMzM1J109aW1wbG9kZSgiXG4iLCRzbik7CiAgICAvLyBhciB5cmEgYXJyYXlfbWVyZ2UgLyBbXSAuPSBwcmlza3lyaW11CiAgICAkYz1pbXBsb2RlKCcnLCRsaW5lcyk7CiAgICAkclsnaGFzX21lcmdlJ109cHJlZ19tYXRjaF9hbGwoJyNwYWNrX251bWJlcnNcJz9cXVxzKj1ccyphcnJheV9tZXJnZXxwYWNrX251bWJlcnNcJz9cXVxbXF1ccyo9IycsJGMpOwogICAgbm9jYWNoZV9oZWFkZXJzKCk7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1NMQVNIRVN8SlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0sIDEpOwo=','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP Multi Pack Dump v1',code:php,scope:'global',active:true}));
for(let i=0;i<4&&!sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(sid){
  sh('sleep 4');
  const d=sh('curl -sSk "'+SITE+'/?ps_mp=Mp5w"');
  try{O.dry=JSON.parse(d.out);}catch(e){O.dry_raw=d.out.slice(0,500);}
  const a=sh('curl -sSk "'+SITE+'/?ps_mp=Mp5w"');
  try{O.apply=JSON.parse(a.out);}catch(e){O.apply_raw=a.out.slice(0,500);}
  fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
  sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
  // sanity: ar svetaine gyva po deploy
  sh('sleep 3');
  O.site_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
  O.account_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/my-account/"').out.trim();
}
putB64('mp.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
