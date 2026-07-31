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
const php=Buffer.from('PD9waHAKLyoqCiAqIFMzMjggUnVudGltZSBBdWRpdAogKiBQYXZhZGluaW1hcyBTQU1PTklOR0FJIGJlIFRFTVAgcHJlZmlrc28g4oCUIGtpdGFpcCB0ZXN0YXMgcGF0ZWt0dSBpIHNhdm8KICogcGF0aWVzIHRpa3JpbmFtYSBhaWJlIGlyIHZpc2FkYSByb2R5dHUgMSBha3R5dnUuCiAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogICAgaWYgKCAhIGlzc2V0KCRfR0VUWydwc19yYTEnXSkgfHwgJF9HRVRbJ3BzX3JhMSddICE9PSAnUmExdzQnICkgcmV0dXJuOwogICAgbm9jYWNoZV9oZWFkZXJzKCk7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgICBnbG9iYWwgJHdwZGI7CiAgICAkciA9IGFycmF5KCdWRVJTSUpBJz0+J3J1bnRpbWUtYXVkaXQtdjEnLCAnbGFpa2FzJz0+Y3VycmVudF90aW1lKCdteXNxbCcsIHRydWUpKTsKCiAgICAvLyAtLS0tLS0tLS0tIDEpIFRFTVAgc25pcHBldCd1IGF1ZGl0YXMgLS0tLS0tLS0tLQogICAgJHN0ID0gJHdwZGItPnByZWZpeC4nc25pcHBldHMnOwogICAgJHJbJ3RlbXBfdmlzbyddICAgID0gKGludCkgJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICRzdCBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyIpOwogICAgJHJbJ3RlbXBfYWt0eXZ1cyddID0gKGludCkgJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICRzdCBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyBBTkQgYWN0aXZlPTEiKTsKICAgICRyWyd0ZW1wX2FrdHl2dXNfc2FyYXNhcyddID0gJHdwZGItPmdldF9yZXN1bHRzKAogICAgICAgICJTRUxFQ1QgaWQsbmFtZSBGUk9NICRzdCBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyBBTkQgYWN0aXZlPTEiLCBBUlJBWV9BKTsKICAgICRyWyd0ZW1wX3NpdWtzbGluZSddID0gKGludCkgJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICRzdCBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyBBTkQgYWN0aXZlPS0xIik7CiAgICAkclsnU0lfU05JUFBFVEFTX1RFTVAnXSA9IChpbnQpICR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSAkc3QgV0hFUkUgbmFtZSA9ICdTMzI4IFJ1bnRpbWUgQXVkaXQnIik7CiAgICAkclsnVkVSRElLVEFTX1RFTVAnXSA9ICgkclsndGVtcF9ha3R5dnVzJ10gPT09IDApID8gJ1NWQVJVICgwIGFrdHl2aXUpJyA6ICdMSUtPIEFLVFlWSVUnOwoKICAgIC8vIC0tLS0tLS0tLS0gMikgSE1BQyBzdGFiaWx1bWFzOiBTSU9TIHV6a2xhdXNvcyByZWlrc21lIC0tLS0tLS0tLS0KICAgIC8vIFBhbHlnaW5pbWFzIHRhcnAgdXprbGF1c3UgZGFyb21hcyBza3JpcHRvIHB1c0VqZSDigJQga3ZpZXNpbSBEVSBrYXJ0dXMuCiAgICBpZiAoIGNsYXNzX2V4aXN0cygnUGV0c2hvcF9QZXRfRHJhZnRzJywgZmFsc2UpICkgewogICAgICAgICRyWydrbGFzZV9ib290c3RyYXAnXSA9IHRydWU7CiAgICAgICAgJHJbJ2htYWMnXSAgICAgICAgPSBQZXRzaG9wX1BldF9EcmFmdHM6OmVtYWlsX2hhc2goJ3N0YWJpbHVtYXNAZGV2LmF2ZXNhLmx0Jyk7CiAgICAgICAgJHJbJ2htYWNfbm9ybSddICAgPSBQZXRzaG9wX1BldF9EcmFmdHM6OmVtYWlsX2hhc2goJyAgU3RhYmlsdW1hc0BERVYuQXZlc2EuTFQgICcpOwogICAgICAgICRyWydub3JtX3N1dGFtcGEnXT0gKCRyWydobWFjJ10gPT09ICRyWydobWFjX25vcm0nXSk7CiAgICAgICAgJHJbJ25lX3BsYWluX3NoYSddPSAoJHJbJ2htYWMnXSAhPT0gaGFzaCgnc2hhMjU2Jywnc3RhYmlsdW1hc0BkZXYuYXZlc2EubHQnKSk7CiAgICAgICAgJHJbJ3Jha3RvX3lyYSddICAgPSAoYm9vbCkgZ2V0X29wdGlvbigncGV0c2hvcF9wZXRfZHJhZnRfaGFzaF9rZXknKTsKICAgICAgICAkclsncmFrdG9faWxnaXMnXSA9IHN0cmxlbigoc3RyaW5nKSBnZXRfb3B0aW9uKCdwZXRzaG9wX3BldF9kcmFmdF9oYXNoX2tleScpKTsKICAgICAgICAkclsnZGJfdmVyc2lqYSddICA9IGdldF9vcHRpb24oJ3BldHNob3BfcGV0X2RyYWZ0c19kYl92ZXJzaW9uJyk7CiAgICAgICAgJHJbJ2RyYWZ0dV9sZW50ZWxlamUnXSA9IChpbnQpICR3cGRiLT5nZXRfdmFyKAogICAgICAgICAgICAiU0VMRUNUIENPVU5UKCopIEZST00gIi4kd3BkYi0+cHJlZml4LiJwc19wZXRfcHJvZmlsZV9kcmFmdHMiKTsKICAgIH0gZWxzZSB7CiAgICAgICAgJHJbJ2tsYXNlX2Jvb3RzdHJhcCddID0gZmFsc2U7CiAgICB9CiAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVN8SlNPTl9QUkVUVFlfUFJJTlQpOwogICAgZXhpdDsKfSk7Cg==','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'S328 Runtime Audit',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('audit.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
function uzk(n){
  const x=sh('curl -sSk -m 60 "'+SITE+'/?ps_ra1=Ra1w4"');
  try{ return JSON.parse(x.out); }catch(e){ O['raw'+n]=x.out.slice(0,700); return null; }
}
O.u1=uzk(1); sh('sleep 5');
O.u2=uzk(2); sh('sleep 5');
O.u3=uzk(3);
O.hmac_stabilus = !!(O.u1&&O.u2&&O.u3&&O.u1.hmac&&O.u1.hmac===O.u2.hmac&&O.u2.hmac===O.u3.hmac);

fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
O.site=sh('curl -sSk -m 25 -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
putB64('audit.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
