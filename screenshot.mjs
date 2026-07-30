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
const php=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgRW1haWwgUmVjb24gdjEKICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgICBpZiAoICEgaXNzZXQoJF9HRVRbJ3BzX2VtJ10pIHx8ICRfR0VUWydwc19lbSddICE9PSAnRW00aycgKSByZXR1cm47CiAgICAkciA9IGFycmF5KCk7CgogICAgLy8gMSkgV29vQ29tbWVyY2UgbGFpc2t1IG51c3RhdHltYWkKICAgICRyWyd3YyddID0gYXJyYXkoCiAgICAgICAgJ2Zyb21fbmFtZScgICAgICA9PiBnZXRfb3B0aW9uKCd3b29jb21tZXJjZV9lbWFpbF9mcm9tX25hbWUnKSwKICAgICAgICAnZnJvbV9hZGRyZXNzJyAgID0+IGdldF9vcHRpb24oJ3dvb2NvbW1lcmNlX2VtYWlsX2Zyb21fYWRkcmVzcycpLAogICAgICAgICdoZWFkZXJfaW1hZ2UnICAgPT4gZ2V0X29wdGlvbignd29vY29tbWVyY2VfZW1haWxfaGVhZGVyX2ltYWdlJyksCiAgICAgICAgJ2Zvb3Rlcl90ZXh0JyAgICA9PiBtYl9zdWJzdHIoKHN0cmluZylnZXRfb3B0aW9uKCd3b29jb21tZXJjZV9lbWFpbF9mb290ZXJfdGV4dCcpLDAsMjAwKSwKICAgICAgICAnYmFzZV9jb2xvcicgICAgID0+IGdldF9vcHRpb24oJ3dvb2NvbW1lcmNlX2VtYWlsX2Jhc2VfY29sb3InKSwKICAgICAgICAnYmdfY29sb3InICAgICAgID0+IGdldF9vcHRpb24oJ3dvb2NvbW1lcmNlX2VtYWlsX2JhY2tncm91bmRfY29sb3InKSwKICAgICAgICAnYm9keV9iZycgICAgICAgID0+IGdldF9vcHRpb24oJ3dvb2NvbW1lcmNlX2VtYWlsX2JvZHlfYmFja2dyb3VuZF9jb2xvcicpLAogICAgICAgICd0ZXh0X2NvbG9yJyAgICAgPT4gZ2V0X29wdGlvbignd29vY29tbWVyY2VfZW1haWxfdGV4dF9jb2xvcicpLAogICAgKTsKCiAgICAvLyAyKSBWaXNpIFdDIGxhaXNrdSB0aXBhaSArIGFyIGlqdW5ndGkgKyBhbnRyYXN0ZXMKICAgIGlmICggY2xhc3NfZXhpc3RzKCdXb29Db21tZXJjZScpICkgewogICAgICAgICRtYWlsZXIgPSBXQygpLT5tYWlsZXIoKTsKICAgICAgICAkZW1haWxzID0gJG1haWxlci0+Z2V0X2VtYWlscygpOwogICAgICAgICRsaXN0ID0gYXJyYXkoKTsKICAgICAgICBmb3JlYWNoICggJGVtYWlscyBhcyAka2V5ID0+ICRlICkgewogICAgICAgICAgICAkbGlzdFtdID0gYXJyYXkoCiAgICAgICAgICAgICAgICAnaWQnICAgICAgPT4gJGUtPmlkLAogICAgICAgICAgICAgICAgJ2VuYWJsZWQnID0+ICRlLT5pc19lbmFibGVkKCkgPyAxIDogMCwKICAgICAgICAgICAgICAgICdzdWJqZWN0JyA9PiBtYl9zdWJzdHIoKHN0cmluZykkZS0+Z2V0X3N1YmplY3QoKSwwLDkwKSwKICAgICAgICAgICAgICAgICdoZWFkaW5nJyA9PiBtYl9zdWJzdHIoKHN0cmluZykkZS0+Z2V0X2hlYWRpbmcoKSwwLDkwKSwKICAgICAgICAgICAgICAgICdyZWNpcGllbnQnPT4gbWJfc3Vic3RyKChzdHJpbmcpKGlzX2NhbGxhYmxlKGFycmF5KCRlLCdnZXRfcmVjaXBpZW50JykpPyRlLT5nZXRfcmVjaXBpZW50KCk6JycpLDAsNjApLAogICAgICAgICAgICApOwogICAgICAgIH0KICAgICAgICAkclsnd2NfZW1haWxzJ10gPSAkbGlzdDsKICAgIH0KCiAgICAvLyAzKSBTYWJsb251IG92ZXJyaWRlJ2FpIHRlbW9qZQogICAgJHRoID0gZ2V0X3N0eWxlc2hlZXRfZGlyZWN0b3J5KCkuJy93b29jb21tZXJjZS9lbWFpbHMvJzsKICAgICRyWyd0aGVtZV9lbWFpbF9vdmVycmlkZXMnXSA9IGlzX2RpcigkdGgpID8gYXJyYXlfbWFwKCdiYXNlbmFtZScsKGFycmF5KWdsb2IoJHRoLicqLnBocCcpKSA6ICduZXJhIGthdGFsb2dvJzsKICAgICR0aDIgPSBnZXRfdGVtcGxhdGVfZGlyZWN0b3J5KCkuJy93b29jb21tZXJjZS9lbWFpbHMvJzsKICAgICRyWydwYXJlbnRfZW1haWxfb3ZlcnJpZGVzJ10gPSBpc19kaXIoJHRoMikgPyBhcnJheV9tYXAoJ2Jhc2VuYW1lJywoYXJyYXkpZ2xvYigkdGgyLicqLnBocCcpKSA6ICduZXJhIGthdGFsb2dvJzsKCiAgICAvLyA0KSBTTVRQIC8gbWFpbCBwbHVnaW4nYWkgKyBmb3JtdSBwbHVnaW4nYWkKICAgIGlmICggISBmdW5jdGlvbl9leGlzdHMoJ2dldF9wbHVnaW5zJykgKSByZXF1aXJlX29uY2UgQUJTUEFUSC4nd3AtYWRtaW4vaW5jbHVkZXMvcGx1Z2luLnBocCc7CiAgICAkYWN0ID0gKGFycmF5KSBnZXRfb3B0aW9uKCdhY3RpdmVfcGx1Z2lucycpOwogICAgJGFsbCA9IGdldF9wbHVnaW5zKCk7CiAgICAkbWFpbD1hcnJheSgpOyAkZm9ybXM9YXJyYXkoKTsKICAgIGZvcmVhY2ggKCRhY3QgYXMgJHApIHsKICAgICAgICAkbiA9IGlzc2V0KCRhbGxbJHBdWydOYW1lJ10pID8gJGFsbFskcF1bJ05hbWUnXSA6ICRwOwogICAgICAgICR2ID0gaXNzZXQoJGFsbFskcF1bJ1ZlcnNpb24nXSkgPyAkYWxsWyRwXVsnVmVyc2lvbiddIDogJyc7CiAgICAgICAgaWYgKHByZWdfbWF0Y2goJyNtYWlsfHNtdHB8YnJldm98c2VuZGluYmx1ZXxtYWlsY2hpbXB8a2xhdml5b3xuZXdzbGV0dGVyI2knLCRwLicgJy4kbikpICRtYWlsW109IiRuICR2IjsKICAgICAgICBpZiAocHJlZ19tYXRjaCgnI2Zvcm18Y29udGFjdHx3cGZvcm1zfGNmN3xmbHVlbnQjaScsJHAuJyAnLiRuKSkgJGZvcm1zW109IiRuICR2IjsKICAgIH0KICAgICRyWydtYWlsX3BsdWdpbnMnXT0kbWFpbDsgJHJbJ2Zvcm1fcGx1Z2lucyddPSRmb3JtczsKICAgICRyWydhY3RpdmVfcGx1Z2luX2NvdW50J109Y291bnQoJGFjdCk7CgogICAgLy8gNSkgV1AgTWFpbCBTTVRQIG51c3RhdHltYWkgKGJlIHNsYXB0YXpvZHppdSkKICAgICRzbSA9IGdldF9vcHRpb24oJ3dwX21haWxfc210cCcpOwogICAgaWYgKGlzX2FycmF5KCRzbSkpIHsKICAgICAgICAkc2FmZT1hcnJheSgpOwogICAgICAgIGZvcmVhY2ggKCRzbSBhcyAkaz0+JHYpIHsKICAgICAgICAgICAgaWYgKGlzX2FycmF5KCR2KSkgeyAkdnY9YXJyYXkoKTsgZm9yZWFjaCgkdiBhcyAkazI9PiR2Mil7ICR2dlskazJdPSAocHJlZ19tYXRjaCgnI3Bhc3N8a2V5fHNlY3JldHx0b2tlbiNpJywkazIpPycqKionOiR2Mik7fSAkc2FmZVska109JHZ2OyB9CiAgICAgICAgICAgIGVsc2UgJHNhZmVbJGtdPSR2OwogICAgICAgIH0KICAgICAgICAkclsnd3BfbWFpbF9zbXRwJ109JHNhZmU7CiAgICB9IGVsc2UgJHJbJ3dwX21haWxfc210cCddPSduZXJhc3RhJzsKCiAgICBub2NhY2hlX2hlYWRlcnMoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoJHIsIEpTT05fVU5FU0NBUEVEX1NMQVNIRVN8SlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0sIDEpOwo=','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP Email Recon v1',code:php,scope:'global',active:true}));
for(let i=0;i<4&&!sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(sid){
  sh('sleep 4');
  const d=sh('curl -sSk "'+SITE+'/?ps_em=Em4k"');
  try{O.dry=JSON.parse(d.out);}catch(e){O.dry_raw=d.out.slice(0,500);}
  const a=sh('curl -sSk "'+SITE+'/?ps_em=Em4k"');
  try{O.apply=JSON.parse(a.out);}catch(e){O.apply_raw=a.out.slice(0,500);}
  fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
  sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
  // sanity: ar svetaine gyva po deploy
  sh('sleep 3');
  O.site_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
  O.account_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/my-account/"').out.trim();
}
putB64('em.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
