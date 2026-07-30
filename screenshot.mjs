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
// pirma deaktyvuoti visus senus TEMP Ship Owner snippetus
try{
  const l=sh('curl -sSk '+AUTH+' "'+API+'?per_page=100"').out;
  const arr=JSON.parse(l);
  O.deactivated=[];
  for(const x of arr){
    if(/TEMP Ship Owner/i.test(x.name||'') && x.active){
      fs.writeFileSync('/tmp/d0.json',JSON.stringify({active:false}));
      sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/d0.json "'+API+'/'+x.id+'"');
      O.deactivated.push(x.id);
    }
  }
}catch(e){ O.deact_err=String(e).slice(0,150); }
const php=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgT3JkZXIgU2hpcHBlZCBPd25lcnNoaXAgVGVzdCB2MQogKiBQZXJpbWEgd3BfbWFpbCAoTklFS08gbmVzaXVuY2lhbWEpLCBmaWtzdW9qYSBrYXMgaXIga2EgYmFuZHl0dSBzaXVzdGkuCiAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogICAgaWYgKCAhIGlzc2V0KCRfR0VUWydwc19zaCddKSB8fCAkX0dFVFsncHNfc2gnXSAhPT0gJ1NoOG0nICkgcmV0dXJuOwogICAgZ2xvYmFsICR3cGRiLCAkUFNfTUFJTFMsICRQU19IT09LUzsKICAgICRQU19NQUlMUyA9IGFycmF5KCk7ICRQU19IT09LUyA9IGFycmF5KCk7CiAgICAkciA9IGFycmF5KCk7CgogICAgLy8gLS0tIHBlcmltYW0gVklTVVMgbGFpc2t1cyAtLS0KICAgIGFkZF9maWx0ZXIoJ3ByZV93cF9tYWlsJywgZnVuY3Rpb24oJG51bGwsICRhdHRzKSB7CiAgICAgICAgZ2xvYmFsICRQU19NQUlMUzsKICAgICAgICAkYm9keSA9IGlzc2V0KCRhdHRzWydtZXNzYWdlJ10pID8gKHN0cmluZykkYXR0c1snbWVzc2FnZSddIDogJyc7CiAgICAgICAgJFBTX01BSUxTW10gPSBhcnJheSgKICAgICAgICAgICAgJ3RvJyAgICAgID0+IGlzX2FycmF5KCRhdHRzWyd0byddKSA/IGltcGxvZGUoJywnLCAkYXR0c1sndG8nXSkgOiAkYXR0c1sndG8nXSwKICAgICAgICAgICAgJ3N1YmplY3QnID0+IGlzc2V0KCRhdHRzWydzdWJqZWN0J10pID8gJGF0dHNbJ3N1YmplY3QnXSA6ICcnLAogICAgICAgICAgICAnbGVuJyAgICAgPT4gc3RybGVuKCRib2R5KSwKICAgICAgICAgICAgJ2hhc190cmFja2luZycgICA9PiAoc3RyaXBvcygkYm9keSwnUFMtVFJBQ0stVEVTVCcpICE9PSBmYWxzZSkgPyAxIDogMCwKICAgICAgICAgICAgJ2hhc192ZW5pcGFrJyAgICA9PiAoc3RyaXBvcygkYm9keSwndmVuaXBhaycpICE9PSBmYWxzZSkgPyAxIDogMCwKICAgICAgICAgICAgJ2hhc190cmFja193b3JkJyA9PiAocHJlZ19tYXRjaCgnI3Nla2ltfHRyYWNrfHNpdW50KGF8b3MpIG51bWVyI2knLCRib2R5KSA/IDEgOiAwKSwKICAgICAgICApOwogICAgICAgIHJldHVybiB0cnVlOyAvLyBORVNJVU5DSUFNCiAgICB9LCAxLCAyKTsKCiAgICAvLyAtLS0gZmlrc3VvamFtIFdDIGxhaXNrdSB0cmlnZXJpdXMgLS0tCiAgICBmb3JlYWNoIChhcnJheSgnd29vY29tbWVyY2Vfb3JkZXJfc3RhdHVzX2NvbXBsZXRlZF9ub3RpZmljYXRpb24nLAogICAgICAgICAgICAgICAgICAgJ3dvb2NvbW1lcmNlX29yZGVyX3N0YXR1c19wcm9jZXNzaW5nX25vdGlmaWNhdGlvbicsCiAgICAgICAgICAgICAgICAgICAnd29vY29tbWVyY2Vfb3JkZXJfc3RhdHVzX2NoYW5nZWQnLAogICAgICAgICAgICAgICAgICAgJ3dvb2NvbW1lcmNlX3VwZGF0ZV9vcmRlcicpIGFzICRoKSB7CiAgICAgICAgYWRkX2FjdGlvbigkaCwgZnVuY3Rpb24oKSB1c2UgKCRoKSB7IGdsb2JhbCAkUFNfSE9PS1M7ICRQU19IT09LU1tdID0gJGg7IH0sIDEpOwogICAgfQoKICAgIC8vIC0tLSBrb2tpZSBzaGlwcGluZyBwbHVnaW4nYWkgYWt0eXZ1cyAtLS0KICAgIGlmICggISBmdW5jdGlvbl9leGlzdHMoJ2dldF9wbHVnaW5zJykgKSByZXF1aXJlX29uY2UgQUJTUEFUSC4nd3AtYWRtaW4vaW5jbHVkZXMvcGx1Z2luLnBocCc7CiAgICAkYWxsPWdldF9wbHVnaW5zKCk7ICRhY3Q9KGFycmF5KWdldF9vcHRpb24oJ2FjdGl2ZV9wbHVnaW5zJyk7ICRzaD1hcnJheSgpOwogICAgZm9yZWFjaCAoJGFjdCBhcyAkcCkgeyAkbj1pc3NldCgkYWxsWyRwXVsnTmFtZSddKT8kYWxsWyRwXVsnTmFtZSddOiRwOwogICAgICAgIGlmIChwcmVnX21hdGNoKCcjdmVuaXBha3xsaXRodWFuaWF8cG9zdHxzaGlwfG9tbml2YXxkcGR8dHJhY2sjaScsJHAuJyAnLiRuKSkgJHNoW109JG4uJyAnLihpc3NldCgkYWxsWyRwXVsnVmVyc2lvbiddKT8kYWxsWyRwXVsnVmVyc2lvbiddOicnKTsgfQogICAgJHJbJ3NoaXBwaW5nX3BsdWdpbnMnXT0kc2g7CgogICAgLy8gLS0tIFRFU1RBUyAtLS0KICAgICRwcm9kID0gd2NfZ2V0X3Byb2R1Y3RzKGFycmF5KCdsaW1pdCc9PjEsJ3N0YXR1cyc9PidwdWJsaXNoJywncmV0dXJuJz0+J2lkcycpKTsKICAgICRvcmRlciA9IHdjX2NyZWF0ZV9vcmRlcigpOwogICAgaWYgKCRwcm9kKSAkb3JkZXItPmFkZF9wcm9kdWN0KHdjX2dldF9wcm9kdWN0KCRwcm9kWzBdKSwxKTsKICAgICRvcmRlci0+c2V0X2JpbGxpbmdfZW1haWwoJ3JhaW11bmRhc0BneXZ1bmFpLmx0Jyk7CiAgICAkb3JkZXItPnNldF9iaWxsaW5nX2ZpcnN0X25hbWUoJ1JhaW1pcycpOwogICAgJG9yZGVyLT5zZXRfcGF5bWVudF9tZXRob2QoJ2JhY3MnKTsKICAgICRvcmRlci0+Y2FsY3VsYXRlX3RvdGFscygpOwogICAgJG9yZGVyLT5zYXZlKCk7CiAgICAkb2lkPSRvcmRlci0+Z2V0X2lkKCk7CiAgICAkclsnb3JkZXJfaWQnXT0kb2lkOwoKICAgIC8vIDEpIGkgcHJvY2Vzc2luZyAoYXBtb2tldGEpCiAgICAkb3JkZXItPnBheW1lbnRfY29tcGxldGUoJ1NISVBURVNULScuJG9pZCk7CiAgICAkclsnc3RhZ2UxX21haWxzJ109JFBTX01BSUxTOyAkUFNfTUFJTFM9YXJyYXkoKTsKICAgICRyWydzdGFnZTFfaG9va3MnXT1hcnJheV92YWx1ZXMoYXJyYXlfdW5pcXVlKCRQU19IT09LUykpOyAkUFNfSE9PS1M9YXJyYXkoKTsKCiAgICAvLyAyKSBQUklERURBTSB0cmFja2luZyAoVmVuaXBhayBmb3JtYXRhcykKICAgICRvcmRlciA9IHdjX2dldF9vcmRlcigkb2lkKTsKICAgICRvcmRlci0+dXBkYXRlX21ldGFfZGF0YSgndmVuaXBha19zaGlwcGluZ19vcmRlcl9kYXRhJywgd3BfanNvbl9lbmNvZGUoYXJyYXkoJ3BhY2tfbnVtYmVycyc9PmFycmF5KCdQUy1UUkFDSy1URVNULTAwMScpKSkpOwogICAgJG9yZGVyLT5zYXZlKCk7CiAgICAkclsnc3RhZ2UyX21haWxzJ109JFBTX01BSUxTOyAkUFNfTUFJTFM9YXJyYXkoKTsKICAgICRyWydzdGFnZTJfaG9va3MnXT1hcnJheV92YWx1ZXMoYXJyYXlfdW5pcXVlKCRQU19IT09LUykpOyAkUFNfSE9PS1M9YXJyYXkoKTsKCiAgICAvLyAzKSBpIGNvbXBsZXRlZAogICAgJG9yZGVyID0gd2NfZ2V0X29yZGVyKCRvaWQpOwogICAgJG9yZGVyLT51cGRhdGVfc3RhdHVzKCdjb21wbGV0ZWQnLCdzaGlwIHRlc3QnKTsKICAgICRyWydzdGFnZTNfbWFpbHMnXT0kUFNfTUFJTFM7ICRQU19NQUlMUz1hcnJheSgpOwogICAgJHJbJ3N0YWdlM19ob29rcyddPWFycmF5X3ZhbHVlcyhhcnJheV91bmlxdWUoJFBTX0hPT0tTKSk7ICRQU19IT09LUz1hcnJheSgpOwoKICAgIC8vIDQpIGFyIG11c3Ugb3JkZXJfc2hpcHBlZCBldmVudGFzIHN1dmVpa2UKICAgICRlbD0kd3BkYi0+cHJlZml4Lidwc19ldmVudF9sb2cnOwogICAgJHJbJ291cl9ldmVudCddPSR3cGRiLT5nZXRfcmVzdWx0cygkd3BkYi0+cHJlcGFyZSgKICAgICAgICAiU0VMRUNUIGV2ZW50X25hbWUsc3RhdHVzLGV2ZW50X2lkIEZST00gJGVsIFdIRVJFIGV2ZW50X2lkPSVzIiwnb3JkZXJfc2hpcHBlZF8nLiRvaWQpLCBBUlJBWV9BKTsKICAgICRyWydzaGlwcGVkX2ZsYWcnXT13Y19nZXRfb3JkZXIoJG9pZCktPmdldF9tZXRhKCdfcHNfb3JkZXJfc2hpcHBlZF9lbWl0dGVkJyk7CgogICAgLy8gdmFsb20KICAgIHdjX2dldF9vcmRlcigkb2lkKS0+ZGVsZXRlKHRydWUpOwogICAgJHJbJ2NsZWFuZWQnXT10cnVlOwogICAgbm9jYWNoZV9oZWFkZXJzKCk7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1NMQVNIRVN8SlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0sIDEpOwo=','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP Ship Owner Dump v1',code:php,scope:'global',active:true}));
for(let i=0;i<4&&!sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(sid){
  sh('sleep 4');
  const d=sh('curl -sSk "'+SITE+'/?ps_sh=Sh8m"');
  try{O.dry=JSON.parse(d.out);}catch(e){O.dry_raw=d.out.slice(0,500);}
  const a=sh('curl -sSk "'+SITE+'/?ps_sh=Sh8m"');
  try{O.apply=JSON.parse(a.out);}catch(e){O.apply_raw=a.out.slice(0,500);}
  fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
  sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
  // sanity: ar svetaine gyva po deploy
  sh('sleep 3');
  O.site_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
  O.account_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/my-account/"').out.trim();
}
putB64('ship.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
