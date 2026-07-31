import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function putB64(n,b){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:80e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b,...(s?{sha:s}:{})}));
  const c=execSync('curl -sk -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:80e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
function sh(c){try{const o=execSync(c+' 2>&1; echo "__RC:$?"',{maxBuffer:50e6,shell:'/bin/bash'}).toString();
 const m=o.match(/__RC:(\d+)\s*$/);return{rc:m?+m[1]:-1,out:o.replace(/__RC:\d+\s*$/,'')};}catch(e){return{rc:-99,out:String(e).slice(0,300)};}}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={}; let sid=null;
// ★ Senu TEMP snippet'u valymas — kitaip senas atsako i ta pati rakta.
try{
  const ls=sh('curl -sSk '+AUTH+' "'+API+'?per_page=100"');
  const arr=JSON.parse(ls.out); const off=[];
  for(const s0 of arr){ if(s0.name && s0.name.indexOf('TEMP')===0 && s0.active){
    fs.writeFileSync('/tmp/off.json',JSON.stringify({active:false}));
    sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/off.json "'+API+'/'+s0.id+'"');
    off.push(s0.id+':'+s0.name); } }
  O.deaktyvuota_TEMP=off;
}catch(e){ O.valymo_klaida=String(e).slice(0,200); }
const php=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgQW5vbiBSZWNvbiB2MQogKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAgIGlmICggISBpc3NldCgkX0dFVFsncHNfYW40J10pIHx8ICRfR0VUWydwc19hbjQnXSAhPT0gJ0FuNHcyJyApIHJldHVybjsKICAgIG5vY2FjaGVfaGVhZGVycygpOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICAgZ2xvYmFsICR3cGRiOwogICAgJHIgPSBhcnJheSgnVkVSU0lKQSc9Pidhbm9uLXJlY29uLXYxJyk7CgogICAgLy8gLS0tIDEpIERCOiBrdXIgc2hvcnRjb2RlIC0tLQogICAgJHJbJ3B1c2xhcGlhaSddID0gJHdwZGItPmdldF9yZXN1bHRzKAogICAgICAgICJTRUxFQ1QgSUQsIHBvc3RfdGl0bGUsIHBvc3RfbmFtZSwgcG9zdF90eXBlLCBwb3N0X3N0YXR1cwogICAgICAgICAgIEZST00geyR3cGRiLT5wb3N0c30KICAgICAgICAgIFdIRVJFIHBvc3Rfc3RhdHVzIElOICgncHVibGlzaCcsJ2RyYWZ0JywncHJpdmF0ZScpCiAgICAgICAgICAgIEFORCBwb3N0X2NvbnRlbnQgTElLRSAnJXBzcGV0X2Zvcm0lJwogICAgICAgICAgT1JERVIgQlkgcG9zdF90eXBlLCBJRCIsIEFSUkFZX0EpOwogICAgLy8gaXIgcGxhdGVzbmlzOiBiZXQga29rcyBwc3BldCBzaG9ydGNvZGUKICAgICRyWydwdXNsYXBpYWlfcGxhdHVzJ10gPSAkd3BkYi0+Z2V0X3Jlc3VsdHMoCiAgICAgICAgIlNFTEVDVCBJRCwgcG9zdF90aXRsZSwgcG9zdF9uYW1lLCBwb3N0X3R5cGUsIHBvc3Rfc3RhdHVzCiAgICAgICAgICAgRlJPTSB7JHdwZGItPnBvc3RzfQogICAgICAgICAgV0hFUkUgcG9zdF9zdGF0dXMgSU4gKCdwdWJsaXNoJywnZHJhZnQnLCdwcml2YXRlJykKICAgICAgICAgICAgQU5EIHBvc3RfY29udGVudCBMSUtFICclW3BzcGV0JScKICAgICAgICAgIE9SREVSIEJZIElEIiwgQVJSQVlfQSk7CgogICAgLy8gLS0tIDIpIEtvZGFzOiBrdXIgcmVnaXN0cnVvamFtaSBzaG9ydGNvZGUnYWkgaXIgbWFnaWMgbGluayAtLS0KICAgICRkaXJzID0gYXJyYXkoCiAgICAgICAgJ2NvcmUnICA9PiBXUF9QTFVHSU5fRElSLicvcGV0c2hvcC1jb3JlJywKICAgICAgICAnY2hpbGQnID0+IGdldF9zdHlsZXNoZWV0X2RpcmVjdG9yeSgpLAogICAgKTsKICAgICRuZWVkbGVzID0gYXJyYXkoJ2FkZF9zaG9ydGNvZGUnLCdwc3BldF9mb3JtJywnbWFnaWNfbGluaycsJ21hZ2ljLWxpbmsnLCdkcmFmdF9pZCcsCiAgICAgICAgICAgICAgICAgICAgICdkcmFmdCcsJ2Fub255bW91cycsJ2Fub25fJywndG9rZW4nLCdwc19wZXRfZHJhZnRzJyk7CiAgICBmb3JlYWNoICgkZGlycyBhcyAkaz0+JGQpIHsKICAgICAgICBpZiAoIWlzX2RpcigkZCkpIGNvbnRpbnVlOwogICAgICAgICRpdCA9IG5ldyBSZWN1cnNpdmVJdGVyYXRvckl0ZXJhdG9yKG5ldyBSZWN1cnNpdmVEaXJlY3RvcnlJdGVyYXRvcigkZCwgUmVjdXJzaXZlRGlyZWN0b3J5SXRlcmF0b3I6OlNLSVBfRE9UUykpOwogICAgICAgIGZvcmVhY2ggKCRpdCBhcyAkZikgewogICAgICAgICAgICBpZiAoISRmLT5pc0ZpbGUoKSkgY29udGludWU7CiAgICAgICAgICAgICRleHQgPSBzdHJ0b2xvd2VyKCRmLT5nZXRFeHRlbnNpb24oKSk7CiAgICAgICAgICAgIGlmICgkZXh0ICE9PSAncGhwJyAmJiAkZXh0ICE9PSAnanMnKSBjb250aW51ZTsKICAgICAgICAgICAgJGMgPSBAZmlsZV9nZXRfY29udGVudHMoJGYtPmdldFBhdGhuYW1lKCkpOwogICAgICAgICAgICBpZiAoJGMgPT09IGZhbHNlKSBjb250aW51ZTsKICAgICAgICAgICAgJHJlbCA9ICRrLicvJy5zdHJfcmVwbGFjZSgkZC4nLycsJycsJGYtPmdldFBhdGhuYW1lKCkpOwogICAgICAgICAgICBmb3JlYWNoICgkbmVlZGxlcyBhcyAkbikgewogICAgICAgICAgICAgICAgaWYgKHN0cnBvcygkYywkbikhPT1mYWxzZSkgeyAkclsnZ3JlcCddWyRuXVtdID0gJHJlbDsgfQogICAgICAgICAgICB9CiAgICAgICAgICAgIC8vIGtvbmtyZWNpYWk6IGFkZF9zaG9ydGNvZGUgcmVnaXN0cmFjaWpvcwogICAgICAgICAgICBpZiAocHJlZ19tYXRjaF9hbGwoIi9hZGRfc2hvcnRjb2RlXChccypbJ1wiXShbXidcIl0rKVsnXCJdLyIsICRjLCAkbSkpIHsKICAgICAgICAgICAgICAgIGZvcmVhY2ggKCRtWzFdIGFzICRzYykgeyAkclsnc2hvcnRjb2RlcyddWyRzY10gPSAkcmVsOyB9CiAgICAgICAgICAgIH0KICAgICAgICB9CiAgICB9CgogICAgLy8gLS0tIDMpIERCIGxlbnRlbGVzLCBzdXNpanVzaW9zIHN1IGRyYWZ0YWlzIC0tLQogICAgJHRhYnMgPSAkd3BkYi0+Z2V0X2NvbCgiU0hPVyBUQUJMRVMgTElLRSAneyR3cGRiLT5wcmVmaXh9cHNfJSciKTsKICAgICRyWydwc19sZW50ZWxlcyddID0gJHRhYnM7CiAgICBmb3JlYWNoICgkdGFicyBhcyAkdCkgewogICAgICAgIGlmIChzdHJwb3MoJHQsJ2RyYWZ0JykhPT1mYWxzZSB8fCBzdHJwb3MoJHQsJ3Rva2VuJykhPT1mYWxzZSB8fCBzdHJwb3MoJHQsJ2xvZ2luJykhPT1mYWxzZSkgewogICAgICAgICAgICAkclsnZHJhZnRfbGVudGVsZXMnXVskdF0gPSAkd3BkYi0+Z2V0X3Jlc3VsdHMoIkRFU0NSSUJFICR0IiwgQVJSQVlfQSk7CiAgICAgICAgfQogICAgfQogICAgZWNobyB3cF9qc29uX2VuY29kZSgkciwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsKICAgIGV4aXQ7Cn0pOwo=','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP Anon Recon v1',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('anon_recon.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
const a=sh('curl -sSk -m 60 "'+SITE+'/?ps_an4=An4w2"');
let A=null; try{A=JSON.parse(a.out);}catch(e){O.auth_raw=a.out.slice(0,800);}
O.clean = A;

fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
O.site=sh('curl -sSk -m 25 -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
putB64('anon_recon.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
