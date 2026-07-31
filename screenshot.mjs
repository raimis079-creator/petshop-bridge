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
const php=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgUFAyRCBSZWNvbiB2MgogKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAgIGlmICggISBpc3NldCgkX0dFVFsncHNfcHAnXSkgfHwgJF9HRVRbJ3BzX3BwJ10gIT09ICdSYzlrMicgKSByZXR1cm47CiAgICAkYmFzZSA9IFdQX1BMVUdJTl9ESVIgLiAnL3BldHNob3AtY29yZS8nOwogICAgJHIgPSBhcnJheSgpOwogICAgJHdhbnQgPSBhcnJheSgKICAgICAgJ2Rpc3BhdGNoJyA9PiAnaW5jbHVkZXMvY2xhc3MtZW1haWwtZGlzcGF0Y2gucGhwJywKICAgICAgJ3BwJyAgICAgICA9PiAnaW5jbHVkZXMvY2xhc3MtcG9zdC1wdXJjaGFzZS5waHAnLAogICAgICAndHBsX3JlZmlsbCcgPT4gJ3RlbXBsYXRlcy9lbWFpbHMvcmVmaWxsLnBocCcsCiAgICAgICd0cGxfY2FydDInICA9PiAndGVtcGxhdGVzL2VtYWlscy9jYXJ0LWFiYW5kb25lZC0yLnBocCcsCiAgICApOwogICAgZm9yZWFjaCAoJHdhbnQgYXMgJGs9PiRyZWwpIHsKICAgICAgICAkcCA9ICRiYXNlLiRyZWw7CiAgICAgICAgJHJbJGtdID0gaXNfcmVhZGFibGUoJHApID8gZmlsZV9nZXRfY29udGVudHMoJHApIDogJ05FUkEnOwogICAgfQogICAgJGVzcCA9IFdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWVzcC9pbmNsdWRlcy9jbGFzcy1zZW5kZXItYWRhcHRlci5waHAnOwogICAgaWYgKGlzX3JlYWRhYmxlKCRlc3ApKSB7CiAgICAgICAgJGMgPSBmaWxlX2dldF9jb250ZW50cygkZXNwKTsKICAgICAgICAkaSA9IHN0cnBvcygkYywgJ3NlbmRfdHJhbnNhY3Rpb25hbF9lbWFpbCcpOwogICAgICAgICRyWydhZGFwdGVyX3NlbmQnXSA9ICRpIT09ZmFsc2UgPyBzdWJzdHIoJGMsIG1heCgwLCRpLTIwMCksIDMwMDApIDogJ25lcmFzdGFzIG1ldG9kYXMnOwogICAgfQogICAgbm9jYWNoZV9oZWFkZXJzKCk7CiAgICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICAgZWNobyB3cF9qc29uX2VuY29kZSgkciwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsKICAgIGV4aXQ7Cn0pOwo=','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP PP2D Recon v2',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(sid){
  sh('sleep 5');
  const d=sh('curl -sSk "'+SITE+'/?ps_pp=Rc9k2"');
  try{O.recon=JSON.parse(d.out);}catch(e){O.raw=d.out.slice(0,1500);}
  fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
  sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
  sh('sleep 2');
  O.site_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
}
putB64('pp2d_recon2.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
