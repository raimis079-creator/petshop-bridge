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
const php=Buffer.from('PD9waHAKLyoqCiAqIFMzMjggUGV0UHJvZmlsZSBSZWNvbgogKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAgIGlmICggISBpc3NldCgkX0dFVFsncHNfcHA3J10pIHx8ICRfR0VUWydwc19wcDcnXSAhPT0gJ1BwN3YzJyApIHJldHVybjsKICAgIG5vY2FjaGVfaGVhZGVycygpOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICAgZ2xvYmFsICR3cGRiOwogICAgJHIgPSBhcnJheSgnVkVSU0lKQSc9PidwZXRwcm9maWxlLXJlY29uLXYxJyk7CiAgICAkZiA9IFdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWNvcmUvaW5jbHVkZXMvY2xhc3MtcGV0LXByb2ZpbGUucGhwJzsKICAgICRjID0gZmlsZV9nZXRfY29udGVudHMoJGYpOwogICAgJHJbJ2R5ZGlzJ10gPSBzdHJsZW4oJGMpOwoKICAgIC8vIG1hcnNydXR1IHJlZ2lzdHJhY2lqYQogICAgJGkgPSBzdHJwb3MoJGMsICJyZWdpc3Rlcl9yZXN0X3JvdXRlIik7CiAgICAkclsncm91dGVzJ10gPSAkaSE9PWZhbHNlID8gc3Vic3RyKCRjLCAkaS0yMDAsIDIyMDApIDogJ25lcmFzdGEnOwoKICAgIC8vIG1ldG9kdSBzYXJhc2FzCiAgICBwcmVnX21hdGNoX2FsbCgnLyg/OnB1YmxpY3xwcml2YXRlfHByb3RlY3RlZClccytzdGF0aWNccytmdW5jdGlvblxzKyhcdyspXHMqXCgoW14pXSopXCkvJywgJGMsICRtKTsKICAgICRyWydtZXRvZGFpJ10gPSBhcnJheSgpOwogICAgZm9yZWFjaCAoJG1bMV0gYXMgJGs9PiRuKSB7ICRyWydtZXRvZGFpJ11bXSA9ICRuLicoJy50cmltKHN1YnN0cigkbVsyXVska10sMCw2MCkpLicpJzsgfQoKICAgIC8vIFBPU1QgaGFuZGxlcmlzIChrdXJpbWFzKQogICAgZm9yZWFjaCAoYXJyYXkoJ2Z1bmN0aW9uIGNyZWF0ZScsJ2Z1bmN0aW9uIGhhbmRsZV9jcmVhdGUnLCdmdW5jdGlvbiBzYXZlX3Byb2ZpbGUnLCdmdW5jdGlvbiBwb3N0X3Byb2ZpbGUnKSBhcyAkZm4pIHsKICAgICAgICAkaiA9IHN0cnBvcygkYywgJGZuKTsKICAgICAgICBpZiAoJGogIT09IGZhbHNlKSB7ICRyWydoYW5kbGVyaXNfdmFyZGFzJ10gPSAkZm47ICRyWydoYW5kbGVyaXMnXSA9IHN1YnN0cigkYywgJGosIDMwMDApOyBicmVhazsgfQogICAgfQogICAgLy8gc2FuaXRpemUgLyB2YWxpZGFjaWphCiAgICAkcyA9IHN0cnBvcygkYywgJ2Z1bmN0aW9uIHNhbml0aXplJyk7CiAgICAkclsnc2FuaXRpemUnXSA9ICRzIT09ZmFsc2UgPyBzdWJzdHIoJGMsICRzLCAyNjAwKSA6ICduZXJhc3RhJzsKCiAgICAvLyBldmVudGFpCiAgICBwcmVnX21hdGNoX2FsbCgiL2RvX2FjdGlvblwoXHMqJyhbXiddKyknLyIsICRjLCAkZXYpOwogICAgJHJbJ2RvX2FjdGlvbiddID0gYXJyYXlfdmFsdWVzKGFycmF5X3VuaXF1ZSgkZXZbMV0pKTsKICAgIHByZWdfbWF0Y2hfYWxsKCIvcHNfZW1pdFx3KlwoXHMqJyhbXiddKyknLyIsICRjLCAkZXYyKTsKICAgICRyWydwc19lbWl0J10gPSBhcnJheV92YWx1ZXMoYXJyYXlfdW5pcXVlKCRldjJbMV0pKTsKICAgIHByZWdfbWF0Y2hfYWxsKCIvJyhwZXRfcHJvZmlsZV9cdyspJy8iLCAkYywgJGV2Myk7CiAgICAkclsncGV0X2V2ZW50X3ZhcmRhaSddID0gYXJyYXlfdmFsdWVzKGFycmF5X3VuaXF1ZSgkZXYzWzFdKSk7CgogICAgLy8gZXZlbnQgbG9nIGxlbnRlbGUKICAgICRlbCA9ICR3cGRiLT5wcmVmaXguJ3BzX2V2ZW50X2xvZyc7CiAgICAkclsnZXZlbnRfbG9nX3N0dWxwZWxpYWknXSA9ICR3cGRiLT5nZXRfY29sKCJTSE9XIENPTFVNTlMgRlJPTSAkZWwiKTsKICAgICRyWydldmVudF9sb2dfdmFyZGFpJ10gPSAkd3BkYi0+Z2V0X3Jlc3VsdHMoCiAgICAgICAgIlNFTEVDVCBldmVudF9uYW1lLCBDT1VOVCgqKSBjIEZST00gJGVsIEdST1VQIEJZIGV2ZW50X25hbWUgT1JERVIgQlkgYyBERVNDIExJTUlUIDE1IiwgQVJSQVlfQSk7CiAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVMpOwogICAgZXhpdDsKfSk7Cg==','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'S328 PetProfile Recon',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('pprecon.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
function uzk(n){
  const x=sh('curl -sSk -m 60 "'+SITE+'/?ps_pp7=Pp7v3"');
  try{ return JSON.parse(x.out); }catch(e){ O['raw'+n]=x.out.slice(0,700); return null; }
}
O.rez=uzk(1);

fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
O.site=sh('curl -sSk -m 25 -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
putB64('pprecon.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
