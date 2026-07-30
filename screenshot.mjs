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
const O={}; const KEY='Sx7k';
const php=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgU2l0ZVVSTCBIVFRQUyBGaXggdjEKICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgICBpZiAoICEgaXNzZXQoJF9HRVRbJ3BzX3NzbCddKSApIHJldHVybjsKICAgIGlmICggJF9HRVRbJ3BzX3NzbCddICE9PSAnU3g3aycgKSByZXR1cm47CgogICAgJHIgPSBhcnJheSgpOwogICAgJHJbJ2JlZm9yZSddID0gYXJyYXkoJ3NpdGV1cmwnPT5nZXRfb3B0aW9uKCdzaXRldXJsJyksICdob21lJz0+Z2V0X29wdGlvbignaG9tZScpKTsKICAgICRyWydpc19zc2wnXSA9IGlzX3NzbCgpID8gMSA6IDA7CgogICAgJGFwcGx5ID0gKCBpc3NldCgkX0dFVFsnY29uZmlybSddKSAmJiAkX0dFVFsnY29uZmlybSddID09PSAnQVBQTFlfU1NMJyApOwogICAgJHJbJ21vZGUnXSA9ICRhcHBseSA/ICdBUFBMWScgOiAnRFJZLVJVTic7CgogICAgJHRhcmdldHMgPSBhcnJheSgKICAgICAgICAnc2l0ZXVybCcgPT4gJ2h0dHBzOi8vZGV2LmF2ZXNhLmx0JywKICAgICAgICAnaG9tZScgICAgPT4gJ2h0dHBzOi8vZGV2LmF2ZXNhLmx0JywKICAgICk7CiAgICAkclsncGxhbm5lZCddID0gJHRhcmdldHM7CgogICAgaWYgKCAkYXBwbHkgKSB7CiAgICAgICAgZm9yZWFjaCAoICR0YXJnZXRzIGFzICRrID0+ICR2ICkgewogICAgICAgICAgICAkb2xkID0gZ2V0X29wdGlvbigkayk7CiAgICAgICAgICAgIGlmICggJG9sZCA9PT0gJHYgKSB7ICRyWydjaGFuZ2VzJ11bJGtdID0gJ05PX0NIQU5HRSc7IGNvbnRpbnVlOyB9CiAgICAgICAgICAgIHVwZGF0ZV9vcHRpb24oJGssICR2KTsKICAgICAgICAgICAgJHJbJ2NoYW5nZXMnXVska10gPSAkb2xkIC4gJyAtPiAnIC4gZ2V0X29wdGlvbigkayk7CiAgICAgICAgfQogICAgICAgIC8vIENvbXBsaWFueiBjYWNoZSBpc3ZhbHltYXMsIGthZCBDU1MgVVJMIHBlcnNpZ2VuZXJ1b3R1CiAgICAgICAgZGVsZXRlX29wdGlvbignY21wbHpfdHJhbnNpZW50cycpOwogICAgICAgICRyWydjbXBsel90cmFuc2llbnRzJ10gPSAnZGVsZXRlZCc7CiAgICAgICAgd3BfY2FjaGVfZmx1c2goKTsKICAgICAgICAkclsnY2FjaGUnXSA9ICdmbHVzaGVkJzsKICAgIH0KCiAgICAkclsnYWZ0ZXInXSA9IGFycmF5KCdzaXRldXJsJz0+Z2V0X29wdGlvbignc2l0ZXVybCcpLCAnaG9tZSc9PmdldF9vcHRpb24oJ2hvbWUnKSk7CiAgICAkdWQgPSB3cF91cGxvYWRfZGlyKCk7CiAgICAkclsndXBsb2FkX2Jhc2V1cmxfYWZ0ZXInXSA9ICR1ZFsnYmFzZXVybCddOwoKICAgIG5vY2FjaGVfaGVhZGVycygpOwogICAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoJHIsIEpTT05fVU5FU0NBUEVEX1NMQVNIRVN8SlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7CiAgICBleGl0Owp9LCAxKTsK','base64').toString('utf8');
let sid=null;
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP SiteURL HTTPS Fix v1',code:php,scope:'global',active:true}));
for(let i=0;i<4&&!sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else { O.create_err=r.out.slice(0,200); sh('sleep 4'); }
}
O.sid=sid;
if(sid){
  sh('sleep 3');
  // 1) DRY-RUN
  const d=sh('curl -sSk "'+SITE+'/?ps_ssl='+KEY+'"');
  try{O.dry=JSON.parse(d.out);}catch(e){O.dry_raw=d.out.slice(0,800);}
  // 2) APPLY
  const a=sh('curl -sSk "'+SITE+'/?ps_ssl='+KEY+'&confirm=APPLY_SSL"');
  try{O.apply=JSON.parse(a.out);}catch(e){O.apply_raw=a.out.slice(0,800);}
  // 3) NEPRIKLAUSOMA VERIFIKACIJA - naujas HTTP requestas i pagrindini puslapi
  sh('sleep 4');
  const h=sh('curl -sSk -L "'+SITE+'/" | grep -o "http://dev.avesa.lt[^\\"\\x27]*" | sort -u | head -20');
  O.http_urls_after = h.out.trim() ? h.out.trim().split('\n') : [];
  const code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/"');
  O.home_http_code=code.out.trim();
  // deaktyvuoti
  fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
  sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
  const v=sh('curl -sSk '+AUTH+' "'+API+'/'+sid+'"').out;
  try{O.deactivated = JSON.parse(v).active===false;}catch(e){}
}
putB64('sf.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
