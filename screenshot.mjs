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
// pirma deaktyvuoti visus senus TEMP Venipak Read snippetus
try{
  const l=sh('curl -sSk '+AUTH+' "'+API+'?per_page=100"').out;
  const arr=JSON.parse(l);
  O.deactivated=[];
  for(const x of arr){
    if(/TEMP Venipak Read/i.test(x.name||'') && x.active){
      fs.writeFileSync('/tmp/d0.json',JSON.stringify({active:false}));
      sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/d0.json "'+API+'/'+x.id+'"');
      O.deactivated.push(x.id);
    }
  }
}catch(e){ O.deact_err=String(e).slice(0,150); }
const php=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgVmVuaXBhayBQbHVnaW4gUmVhZCB2MQogKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAgIGlmICggISBpc3NldCgkX0dFVFsncHNfdmsnXSkgfHwgJF9HRVRbJ3BzX3ZrJ10gIT09ICdWazRwJyApIHJldHVybjsKICAgICRyPWFycmF5KCk7CiAgICBpZiAoICEgZnVuY3Rpb25fZXhpc3RzKCdnZXRfcGx1Z2lucycpICkgcmVxdWlyZV9vbmNlIEFCU1BBVEguJ3dwLWFkbWluL2luY2x1ZGVzL3BsdWdpbi5waHAnOwogICAgJGFsbD1nZXRfcGx1Z2lucygpOyAkYWN0PShhcnJheSlnZXRfb3B0aW9uKCdhY3RpdmVfcGx1Z2lucycpOwogICAgZm9yZWFjaCAoJGFjdCBhcyAkcCkgeyAkbj1pc3NldCgkYWxsWyRwXVsnTmFtZSddKT8kYWxsWyRwXVsnTmFtZSddOiRwOwogICAgICAgIGlmIChwcmVnX21hdGNoKCcjdmVuaXBha3xsaXRodWFuaWF8bHAuP2V4cHJlc3MjaScsJHAuJyAnLiRuKSkKICAgICAgICAgICAgJHJbJ3BsdWdpbnMnXVtdPWFycmF5KCdmaWxlJz0+JHAsJ25hbWUnPT4kbiwndmVyJz0+aXNzZXQoJGFsbFskcF1bJ1ZlcnNpb24nXSk/JGFsbFskcF1bJ1ZlcnNpb24nXTonJyk7IH0KCiAgICAvLyBpZXNrb20sIGt1ciByYXNvbWEgdmVuaXBhayBtZXRhCiAgICAkaGl0cz1hcnJheSgpOwogICAgZm9yZWFjaCAoZ2xvYihXUF9QTFVHSU5fRElSLicvKicsR0xPQl9PTkxZRElSKSBhcyAkZGlyKSB7CiAgICAgICAgaWYgKCFwcmVnX21hdGNoKCcjdmVuaXBha3xsaXRodWFuaWEjaScsYmFzZW5hbWUoJGRpcikpKSBjb250aW51ZTsKICAgICAgICAkcmlpPW5ldyBSZWN1cnNpdmVJdGVyYXRvckl0ZXJhdG9yKG5ldyBSZWN1cnNpdmVEaXJlY3RvcnlJdGVyYXRvcigkZGlyLCBGaWxlc3lzdGVtSXRlcmF0b3I6OlNLSVBfRE9UUykpOwogICAgICAgIGZvcmVhY2ggKCRyaWkgYXMgJGYpIHsKICAgICAgICAgICAgaWYgKCEkZi0+aXNGaWxlKCkgfHwgc3Vic3RyKCRmLT5nZXRGaWxlbmFtZSgpLC00KSE9PScucGhwJykgY29udGludWU7CiAgICAgICAgICAgICRjPUBmaWxlX2dldF9jb250ZW50cygkZi0+Z2V0UGF0aG5hbWUoKSk7IGlmKCEkYykgY29udGludWU7CiAgICAgICAgICAgIGZvcmVhY2ggKGV4cGxvZGUoIlxuIiwkYykgYXMgJGk9PiRsbikgewogICAgICAgICAgICAgICAgaWYgKHByZWdfbWF0Y2goJyN1cGRhdGVfbWV0YV9kYXRhfHVwZGF0ZV9wb3N0X21ldGF8YWRkX21ldGFfZGF0YSMnLCRsbikKICAgICAgICAgICAgICAgICAgICAmJiBwcmVnX21hdGNoKCcjcGFja19udW1iZXJ8YmFyY29kZXx0cmFja2luZ3xzaGlwcGluZ19vcmRlcl9kYXRhfF92ZW5pcGFrfGxpdGh1YW5pYXBvc3QjaScsJGxuKSkgewogICAgICAgICAgICAgICAgICAgICRoaXRzW109YXJyYXkoJ2ZpbGUnPT5zdHJfcmVwbGFjZShXUF9QTFVHSU5fRElSLicvJywnJywkZi0+Z2V0UGF0aG5hbWUoKSksJ2xpbmUnPT4kaSsxLCdjb2RlJz0+dHJpbShtYl9zdWJzdHIoJGxuLDAsMTkwKSkpOwogICAgICAgICAgICAgICAgfQogICAgICAgICAgICB9CiAgICAgICAgfQogICAgfQogICAgJHJbJ21ldGFfd3JpdGVzJ109YXJyYXlfc2xpY2UoJGhpdHMsMCwyNSk7CgogICAgLy8gdmlzaSBtZXRhIHJha3RhaSBzdSB2ZW5pcGFrL3RyYWNraW5nIHBhdmFkaW5pbWUgKGlzIERCIHNjaGVtb3MgcGVyc3Bla3R5dm9zKQogICAgZ2xvYmFsICR3cGRiOwogICAgJHJbJ2V4aXN0aW5nX21ldGFfa2V5cyddPSR3cGRiLT5nZXRfY29sKAogICAgICAiU0VMRUNUIERJU1RJTkNUIG1ldGFfa2V5IEZST00geyR3cGRiLT5wb3N0bWV0YX0KICAgICAgIFdIRVJFIG1ldGFfa2V5IExJS0UgJyV2ZW5pcGFrJScgT1IgbWV0YV9rZXkgTElLRSAnJWJhcmNvZGUlJyBPUiBtZXRhX2tleSBMSUtFICcldHJhY2tpbmclJwogICAgICAgICAgT1IgbWV0YV9rZXkgTElLRSAnJWxpdGh1YW5pYSUnIExJTUlUIDQwIik7CiAgICAvLyBIUE9TIGxlbnRlbGUKICAgICRvdD0kd3BkYi0+cHJlZml4Lid3Y19vcmRlcnNfbWV0YSc7CiAgICBpZiAoJHdwZGItPmdldF92YXIoIlNIT1cgVEFCTEVTIExJS0UgJyRvdCciKT09PSRvdCkgewogICAgICAgICRyWydocG9zX21ldGFfa2V5cyddPSR3cGRiLT5nZXRfY29sKAogICAgICAgICAgIlNFTEVDVCBESVNUSU5DVCBtZXRhX2tleSBGUk9NICRvdCBXSEVSRSBtZXRhX2tleSBMSUtFICcldmVuaXBhayUnIE9SIG1ldGFfa2V5IExJS0UgJyViYXJjb2RlJScgT1IgbWV0YV9rZXkgTElLRSAnJXRyYWNraW5nJScgTElNSVQgNDAiKTsKICAgIH0KICAgIG5vY2FjaGVfaGVhZGVycygpOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICAgZWNobyB3cF9qc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9TTEFTSEVTfEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LCAxKTsK','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP Venipak Read Dump v1',code:php,scope:'global',active:true}));
for(let i=0;i<4&&!sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(sid){
  sh('sleep 4');
  const d=sh('curl -sSk "'+SITE+'/?ps_vk=Vk4p"');
  try{O.dry=JSON.parse(d.out);}catch(e){O.dry_raw=d.out.slice(0,500);}
  const a=sh('curl -sSk "'+SITE+'/?ps_vk=Vk4p"');
  try{O.apply=JSON.parse(a.out);}catch(e){O.apply_raw=a.out.slice(0,500);}
  fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
  sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
  // sanity: ar svetaine gyva po deploy
  sh('sleep 3');
  O.site_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
  O.account_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/my-account/"').out.trim();
}
putB64('vpk.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
