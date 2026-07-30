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
const php=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgUGV0cyBPd25lciBSZWNvbiB2MQogKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAgIGlmICggISBpc3NldCgkX0dFVFsncHNfcGwnXSkgfHwgJF9HRVRbJ3BzX3BsJ10gIT09ICdQbDJxJyApIHJldHVybjsKICAgIGdsb2JhbCAkd3BkYjsgJHQ9JHdwZGItPnByZWZpeC4ncHNfcGV0cyc7CiAgICAkcj1hcnJheSgpOwogICAgJHJbJ3RvdGFsJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJHQiKTsKICAgICRyWyd3aXRoX3VzZXInXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSAkdCBXSEVSRSB1c2VyX2lkIElTIE5PVCBOVUxMIEFORCB1c2VyX2lkPjAiKTsKICAgICRyWydpc190ZXN0X2NvbCddPWluX2FycmF5KCdpc190ZXN0JywoYXJyYXkpJHdwZGItPmdldF9jb2woIlNIT1cgQ09MVU1OUyBGUk9NICR0IikpOwogICAgJHJbJ293bmVkJ109JHdwZGItPmdldF9yZXN1bHRzKAogICAgICAiU0VMRUNUIGlkLHVzZXJfaWQsbmFtZSxzcGVjaWVzLGZlZWRpbmdfdHlwZSxwcmltYXJ5X3Byb2R1Y3RfaWQsd2V0X3Byb2R1Y3RfaWQsY3VycmVudF93ZWlnaHRfa2cKICAgICAgIEZST00gJHQgV0hFUkUgdXNlcl9pZCBJUyBOT1QgTlVMTCBBTkQgdXNlcl9pZD4wIE9SREVSIEJZIGlkIERFU0MgTElNSVQgMjAiLCBBUlJBWV9BKTsKICAgICRyWydieV9mdCddPSR3cGRiLT5nZXRfcmVzdWx0cygKICAgICAgIlNFTEVDVCBmZWVkaW5nX3R5cGUsIENPVU5UKCopIGMsIFNVTSh1c2VyX2lkPjApIG93bmVkIEZST00gJHQgR1JPVVAgQlkgZmVlZGluZ190eXBlIiwgQVJSQVlfQSk7CiAgICBub2NhY2hlX2hlYWRlcnMoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsKICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoJHIsIEpTT05fVU5FU0NBUEVEX1NMQVNIRVN8SlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0sIDEpOwo=','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP Pets Owner Recon v1',code:php,scope:'global',active:true}));
for(let i=0;i<4&&!sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(sid){
  sh('sleep 4');
  const d=sh('curl -sSk "'+SITE+'/?ps_pl=Pl2q"');
  try{O.dry=JSON.parse(d.out);}catch(e){O.dry_raw=d.out.slice(0,500);}
  const a=sh('curl -sSk "'+SITE+'/?ps_pl=Pl2q"');
  try{O.apply=JSON.parse(a.out);}catch(e){O.apply_raw=a.out.slice(0,500);}
  fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
  sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
  // sanity: ar svetaine gyva po deploy
  sh('sleep 3');
  O.site_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
  O.account_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/my-account/"').out.trim();
}
putB64('pl.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
