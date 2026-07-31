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
const php=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgTTggUmVjb24gdjEKICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgICBpZiAoICEgaXNzZXQoJF9HRVRbJ3BzX204J10pIHx8ICRfR0VUWydwc19tOCddICE9PSAnTW44aycgKSByZXR1cm47CiAgICBub2NhY2hlX2hlYWRlcnMoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAgICRyID0gYXJyYXkoKTsKICAgICRiYXNlID0gV1BfUExVR0lOX0RJUiAuICcvcGV0c2hvcC1jb3JlLyc7CgogICAgLy8gMSkgS29raWUgZmFpbGFpIHZhbGRvIGF1Z2ludGluaW8gVUkKICAgIGZvcmVhY2ggKGFycmF5KCdpbmNsdWRlcy9jbGFzcy1wZXQtdWkucGhwJywnaW5jbHVkZXMvY2xhc3MtcGV0LXByb2ZpbGUucGhwJywKICAgICAgICAgICAgICAgICAgICdpbmNsdWRlcy9jbGFzcy1wZXQtZGFzaGJvYXJkLnBocCcsJ2Fzc2V0cy9wZXQtZm9ybS5qcycpIGFzICRyZWwpIHsKICAgICAgICAkcCA9ICRiYXNlLiRyZWw7CiAgICAgICAgJHJbJ2ZhaWxhaSddWyRyZWxdID0gaXNfcmVhZGFibGUoJHApID8gZmlsZXNpemUoJHApIDogJ05FUkEnOwogICAgfQoKICAgIC8vIDIpIEFyIHlyYSBtb3VudCAvIGFjdGlvbj1jcmVhdGUgLyB0dXNjaW9zIGJ1c2Vub3MgbXlndHVrYXMKICAgICRuZWVkbGVzID0gYXJyYXkoJ1N1a3VydGkgcHJvZmlsxK8nLCdQZXRzaG9wUGV0Rm9ybScsJ21vdW50KCcsJ2FjdGlvbj1jcmVhdGUnLAogICAgICAgICAgICAgICAgICAgICAiJ2NyZWF0ZSciLCAnUFNQZXRGb3JtSW5pdCcsICdocmVmPScsICdwZXQtZm9ybS5qcycpOwogICAgZm9yZWFjaCAoYXJyYXkoJ2luY2x1ZGVzL2NsYXNzLXBldC11aS5waHAnLCdpbmNsdWRlcy9jbGFzcy1wZXQtZGFzaGJvYXJkLnBocCcsCiAgICAgICAgICAgICAgICAgICAnaW5jbHVkZXMvY2xhc3MtcGV0LXByb2ZpbGUucGhwJywnYXNzZXRzL3BldC1mb3JtLmpzJykgYXMgJHJlbCkgewogICAgICAgICRwID0gJGJhc2UuJHJlbDsKICAgICAgICBpZiAoIWlzX3JlYWRhYmxlKCRwKSkgY29udGludWU7CiAgICAgICAgJGMgPSBmaWxlX2dldF9jb250ZW50cygkcCk7CiAgICAgICAgZm9yZWFjaCAoJG5lZWRsZXMgYXMgJG4pIHsKICAgICAgICAgICAgaWYgKHN0cnBvcygkYywgJG4pICE9PSBmYWxzZSkgeyAkclsnZ3JlcCddWyRyZWxdW10gPSAkbjsgfQogICAgICAgIH0KICAgIH0KCiAgICAvLyAzKSDigJ5TdWt1cnRpIHByb2ZpbMSvIiBrb250ZWtzdGFzIOKAlCBrYSB0YXMgbXlndHVrYXMgaXMgdGlrcnVqdSBkYXJvCiAgICBmb3JlYWNoIChhcnJheSgnaW5jbHVkZXMvY2xhc3MtcGV0LXVpLnBocCcsJ2luY2x1ZGVzL2NsYXNzLXBldC1kYXNoYm9hcmQucGhwJykgYXMgJHJlbCkgewogICAgICAgICRwID0gJGJhc2UuJHJlbDsKICAgICAgICBpZiAoIWlzX3JlYWRhYmxlKCRwKSkgY29udGludWU7CiAgICAgICAgJGMgPSBmaWxlX2dldF9jb250ZW50cygkcCk7CiAgICAgICAgJGkgPSBzdHJwb3MoJGMsICdTdWt1cnRpIHByb2ZpbMSvJyk7CiAgICAgICAgaWYgKCRpICE9PSBmYWxzZSkgeyAkclsnbXlndHVrYXMnXVskcmVsXSA9IHN1YnN0cigkYywgbWF4KDAsJGktNzAwKSwgMTEwMCk7IH0KICAgIH0KCiAgICAvLyA0KSBBciBwZXQtZm9ybS5qcyBpc2tlbGlhbWFzIE15QWNjb3VudCBwdXNsYXBpdW9zZQogICAgZm9yZWFjaCAoYXJyYXkoJ2luY2x1ZGVzL2NsYXNzLXBldC11aS5waHAnLCdpbmNsdWRlcy9jbGFzcy1wZXQtcHJvZmlsZS5waHAnKSBhcyAkcmVsKSB7CiAgICAgICAgJHAgPSAkYmFzZS4kcmVsOwogICAgICAgIGlmICghaXNfcmVhZGFibGUoJHApKSBjb250aW51ZTsKICAgICAgICAkYyA9IGZpbGVfZ2V0X2NvbnRlbnRzKCRwKTsKICAgICAgICAkaSA9IHN0cnBvcygkYywgJ3BldC1mb3JtLmpzJyk7CiAgICAgICAgaWYgKCRpICE9PSBmYWxzZSkgeyAkclsnZW5xdWV1ZSddWyRyZWxdID0gc3Vic3RyKCRjLCBtYXgoMCwkaS05MDApLCAxMjAwKTsgfQogICAgfQogICAgZWNobyB3cF9qc29uX2VuY29kZSgkciwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsKICAgIGV4aXQ7Cn0pOwo=','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP M8 Recon v1',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(sid){
  sh('sleep 5');
  O.site=sh('curl -sSk -m 25 -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
  const d=sh('curl -sSk -m 60 "'+SITE+'/?ps_m8=Mn8k"');
  try{O.m8=JSON.parse(d.out);}catch(e){O.raw=d.out.slice(0,1200);}
  fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
  sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
  sh('sleep 2');
  O.site_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
}
putB64('m8_recon.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
