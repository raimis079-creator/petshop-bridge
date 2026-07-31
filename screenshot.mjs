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
// pirma deaktyvuoti visus senus TEMP Refill FB snippetus
try{
  const l=sh('curl -sSk '+AUTH+' "'+API+'?per_page=100"').out;
  const arr=JSON.parse(l);
  O.deactivated=[];
  for(const x of arr){
    if(/TEMP Refill FB/i.test(x.name||'') && x.active){
      fs.writeFileSync('/tmp/d0.json',JSON.stringify({active:false}));
      sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/d0.json "'+API+'/'+x.id+'"');
      O.deactivated.push(x.id);
    }
  }
}catch(e){ O.deact_err=String(e).slice(0,150); }
const php=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgUmVmaWxsIEZlZWRiYWNrIENoZWNrIHYxCiAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogICAgaWYgKCAhIGlzc2V0KCRfR0VUWydwc19yZiddKSB8fCAkX0dFVFsncHNfcmYnXSAhPT0gJ1JmNWMnICkgcmV0dXJuOwogICAgZ2xvYmFsICR3cGRiOyAkcj1hcnJheSgpOwogICAgLy8gYXIgeXJhIHB1c2xhcGlzL3JvdXRlCiAgICAkclsncGFnZV9ieV9wYXRoJ109Z2V0X3BhZ2VfYnlfcGF0aCgncmVmaWxsLWZlZWRiYWNrJyk/MTowOwogICAgJHJ1bGVzPWdldF9vcHRpb24oJ3Jld3JpdGVfcnVsZXMnKTsKICAgICRyWydyZXdyaXRlX21hdGNoJ109YXJyYXkoKTsKICAgIGZvcmVhY2goKGFycmF5KSRydWxlcyBhcyAkaz0+JHYpeyBpZihzdHJpcG9zKCRrLCdyZWZpbGwnKSE9PWZhbHNlKSAkclsncmV3cml0ZV9tYXRjaCddWyRrXT0kdjsgfQogICAgJHJbJ3Jlc3Rfcm91dGVzJ109YXJyYXkoKTsKICAgIGZvcmVhY2ggKCByZXN0X2dldF9zZXJ2ZXIoKS0+Z2V0X3JvdXRlcygpIGFzICRrPT4kdiApIGlmIChzdHJpcG9zKCRrLCdyZWZpbGwnKSE9PWZhbHNlKSAkclsncmVzdF9yb3V0ZXMnXVtdPSRrOwogICAgLy8gYXIga2FzIG5vcnMgYXBkb3JvamEgcHNfcmVmaWxsX2ZiCiAgICAkaGl0cz1hcnJheSgpOwogICAgZm9yZWFjaCAoYXJyYXkoV1BfUExVR0lOX0RJUixnZXRfc3R5bGVzaGVldF9kaXJlY3RvcnkoKSkgYXMgJGRpcil7CiAgICAgIGlmKCFpc19kaXIoJGRpcikpY29udGludWU7CiAgICAgICRyaWk9bmV3IFJlY3Vyc2l2ZUl0ZXJhdG9ySXRlcmF0b3IobmV3IFJlY3Vyc2l2ZURpcmVjdG9yeUl0ZXJhdG9yKCRkaXIsIEZpbGVzeXN0ZW1JdGVyYXRvcjo6U0tJUF9ET1RTKSk7CiAgICAgIGZvcmVhY2goJHJpaSBhcyAkZil7IGlmKCEkZi0+aXNGaWxlKCl8fHN1YnN0cigkZi0+Z2V0RmlsZW5hbWUoKSwtNCkhPT0nLnBocCcpY29udGludWU7CiAgICAgICAgJGM9QGZpbGVfZ2V0X2NvbnRlbnRzKCRmLT5nZXRQYXRobmFtZSgpKTsgaWYoISRjKWNvbnRpbnVlOwogICAgICAgIGlmKHN0cnBvcygkYywncHNfcmVmaWxsX2ZiJykhPT1mYWxzZSkgJGhpdHNbXT1zdHJfcmVwbGFjZShBQlNQQVRILCcnLCRmLT5nZXRQYXRobmFtZSgpKTsgfSB9CiAgICAkclsnaGFuZGxlcl9maWxlcyddPWFycmF5X3ZhbHVlcyhhcnJheV91bmlxdWUoJGhpdHMpKTsKICAgIC8vIGd5dmFzIHBhdGlrcmluaW1hcwogICAgJHJlc3A9d3BfcmVtb3RlX2dldChob21lX3VybCgnL3JlZmlsbC1mZWVkYmFjay8/cHNfcmVmaWxsX2ZiPW9udGltZSZwaWQ9MScpLGFycmF5KCd0aW1lb3V0Jz0+MTUsJ3NzbHZlcmlmeSc9PmZhbHNlKSk7CiAgICAkclsnbGl2ZSddPWlzX3dwX2Vycm9yKCRyZXNwKT8nRVJSJzp3cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSgkcmVzcCk7CiAgICAvLyByZWZpbGxfZmVlZGJhY2tfc3VibWl0dGVkIHNjaGVtYSAvIGV2ZW50YWkKICAgICRlbD0kd3BkYi0+cHJlZml4Lidwc19ldmVudF9sb2cnOwogICAgJHJbJ2ZiX2V2ZW50cyddPShpbnQpJHdwZGItPmdldF92YXIoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICRlbCBXSEVSRSBldmVudF9uYW1lPSVzIiwncmVmaWxsX2ZlZWRiYWNrX3N1Ym1pdHRlZCcpKTsKICAgIG5vY2FjaGVfaGVhZGVycygpOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICAgZWNobyB3cF9qc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9TTEFTSEVTfEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LCAxKTsK','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP Refill FB Dump v1',code:php,scope:'global',active:true}));
for(let i=0;i<4&&!sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(sid){
  sh('sleep 4');
  const d=sh('curl -sSk "'+SITE+'/?ps_rf=Rf5c"');
  try{O.dry=JSON.parse(d.out);}catch(e){O.dry_raw=d.out.slice(0,500);}
  const a=sh('curl -sSk "'+SITE+'/?ps_rf=Rf5c"');
  try{O.apply=JSON.parse(a.out);}catch(e){O.apply_raw=a.out.slice(0,500);}
  fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
  sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
  // sanity: ar svetaine gyva po deploy
  sh('sleep 3');
  O.site_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
  O.account_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/my-account/"').out.trim();
}
putB64('rfb.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
