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
// pirma deaktyvuoti visus senus TEMP S321 Verify snippetus
try{
  const l=sh('curl -sSk '+AUTH+' "'+API+'?per_page=100"').out;
  const arr=JSON.parse(l);
  O.deactivated=[];
  for(const x of arr){
    if(/TEMP S321 Verify/i.test(x.name||'') && x.active){
      fs.writeFileSync('/tmp/d0.json',JSON.stringify({active:false}));
      sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/d0.json "'+API+'/'+x.id+'"');
      O.deactivated.push(x.id);
    }
  }
}catch(e){ O.deact_err=String(e).slice(0,150); }
const php=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgUzMyMSBWZXJpZnkgdjEg4oCUIGNvbnNlbnQgQkUgc3VwcHJlc3Npb24KICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgICBpZiAoICEgaXNzZXQoJF9HRVRbJ3BzX3ZmMiddKSB8fCAkX0dFVFsncHNfdmYyJ10gIT09ICdWZjJzJyApIHJldHVybjsKICAgIGdsb2JhbCAkd3BkYjsgJHI9YXJyYXkoKTsKICAgICRTVD1QZXRzaG9wX0VtYWlsX1N1cHByZXNzaW9uOjp0YWJsZSgpOwogICAgJGN0PSR3cGRiLT5wcmVmaXguJ3BzX2NvbnNlbnRfbG9nJzsKCiAgICAvLyBub3JtYWxpemF0b3JpYXVzIHZpZW5ldGluaWFpIHRlc3RhaQogICAgJGNhc2VzPWFycmF5KCd0cnVlJz0+MSwnZmFsc2UnPT4wLCcnPT4wLCcxJz0+MSwnMCc9PjAsJ3llcyc9PjEsJ25vJz0+MCwnVFJVRSc9PjEsJ0ZhbHNlJz0+MCk7CiAgICAkbm9ybT1hcnJheSgpOwogICAgZm9yZWFjaCgkY2FzZXMgYXMgJGluPT4kZXhwKXsKICAgICAgICAkZ290PVBldHNob3BfQ29udGFjdF9Qb2xpY3k6Om5vcm1hbGl6ZSgkaW4pPzE6MDsKICAgICAgICAkbm9ybVskaW49PT0nJz8nKHR1c2NpYSknOiRpbl09YXJyYXkoJ2dhdXRhJz0+JGdvdCwnbGF1a3RhJz0+JGV4cCwnb2snPT4oJGdvdD09PSRleHApPydPSyc6J0JMT0dBSScpOwogICAgfQogICAgJG5vcm1bJ2Jvb2xfZmFsc2UnXT1hcnJheSgnZ2F1dGEnPT5QZXRzaG9wX0NvbnRhY3RfUG9saWN5Ojpub3JtYWxpemUoZmFsc2UpPzE6MCwnbGF1a3RhJz0+MCk7CiAgICAkbm9ybVsnbnVsbCddPWFycmF5KCdnYXV0YSc9PlBldHNob3BfQ29udGFjdF9Qb2xpY3k6Om5vcm1hbGl6ZShudWxsKT8xOjAsJ2xhdWt0YSc9PjApOwogICAgJHJbJ25vcm1hbGl6ZSddPSRub3JtOwoKICAgIC8vIEtSSVRJTklTOiBhdHNpc2FrZXMgQkUgc3VwcHJlc3Npb24KICAgICRFPSdjb25zZW50LW5vc3VwcEBleGFtcGxlLmNvbSc7CiAgICAkd3BkYi0+cXVlcnkoJHdwZGItPnByZXBhcmUoIkRFTEVURSBGUk9NICRTVCBXSEVSRSBlbWFpbD0lcyIsJEUpKTsKICAgICR3cGRiLT5xdWVyeSgkd3BkYi0+cHJlcGFyZSgiREVMRVRFIEZST00gJGN0IFdIRVJFIGVtYWlsPSVzIiwkRSkpOwoKICAgIHBzX3NldF9tYXJrZXRpbmdfY29uc2VudCgkRSx0cnVlLCd0ZXN0JywwKTsKICAgICRyWydBX3N1X2NvbnNlbnQnXT1hcnJheSgKICAgICAgJ3Jhdyc9PnBzX2dldF9tYXJrZXRpbmdfY29uc2VudCgkRSksCiAgICAgICdoYXNfY29uc2VudCc9PlBldHNob3BfQ29udGFjdF9Qb2xpY3k6Omhhc19jb25zZW50KCRFKT8xOjAsCiAgICAgICdwb2xpY3knPT5QZXRzaG9wX0NvbnRhY3RfUG9saWN5Ojpjb21wdXRlKCRFKT8ndHJ1ZSc6J2ZhbHNlJywKICAgICAgJ2VsaWdfbWFya2V0aW5nJz0+UGV0c2hvcF9FbWFpbF9EaXNwYXRjaDo6Y2hlY2tfZWxpZ2liaWxpdHkoJ21hcmtldGluZycsJEUsJ3dpbl9iYWNrXzYwJylbJ2FsbG93ZWQnXSk7CgogICAgcHNfc2V0X21hcmtldGluZ19jb25zZW50KCRFLGZhbHNlLCd0ZXN0X3Jldm9rZScsMCk7CiAgICAkclsnQl9hdHNpc2FrZV9CRV9zdXBwcmVzc2lvbiddPWFycmF5KAogICAgICAncmF3Jz0+cHNfZ2V0X21hcmtldGluZ19jb25zZW50KCRFKSwKICAgICAgJ3Jhd19ib29sX2Nhc3QnPT4oKGJvb2wpcHNfZ2V0X21hcmtldGluZ19jb25zZW50KCRFKSk/J1RSVUVfQlVWT19CVUdBUyc6J2ZhbHNlJywKICAgICAgJ2hhc19jb25zZW50Jz0+UGV0c2hvcF9Db250YWN0X1BvbGljeTo6aGFzX2NvbnNlbnQoJEUpPzE6MCwKICAgICAgJ3BvbGljeSc9PlBldHNob3BfQ29udGFjdF9Qb2xpY3k6OmNvbXB1dGUoJEUpPyd0cnVlJzonZmFsc2UnLAogICAgICAnbWFya2V0aW5nX3N1cHByZXNzZWQnPT5QZXRzaG9wX0VtYWlsX1N1cHByZXNzaW9uOjppc19zdXBwcmVzc2VkKCRFLCdtYXJrZXRpbmcnKT8xOjAsCiAgICAgICdlbGlnX21hcmtldGluZyc9PlBldHNob3BfRW1haWxfRGlzcGF0Y2g6OmNoZWNrX2VsaWdpYmlsaXR5KCdtYXJrZXRpbmcnLCRFLCd3aW5fYmFja182MCcpLAogICAgICAnZWxpZ19zZXJ2aWNlJz0+UGV0c2hvcF9FbWFpbF9EaXNwYXRjaDo6Y2hlY2tfZWxpZ2liaWxpdHkoJ3NlcnZpY2UnLCRFLCdwb3N0X3B1cmNoYXNlXzJkJylbJ2FsbG93ZWQnXSwKICAgICAgJ2VsaWdfdHJhbnNhY3Rpb25hbCc9PlBldHNob3BfRW1haWxfRGlzcGF0Y2g6OmNoZWNrX2VsaWdpYmlsaXR5KCd0cmFuc2FjdGlvbmFsJywkRSwnb3JkZXJfcGFpZCcpWydhbGxvd2VkJ10pOwoKICAgICR3cGRiLT5xdWVyeSgkd3BkYi0+cHJlcGFyZSgiREVMRVRFIEZST00gJGN0IFdIRVJFIGVtYWlsPSVzIiwkRSkpOwogICAgJHdwZGItPnF1ZXJ5KCR3cGRiLT5wcmVwYXJlKCJERUxFVEUgRlJPTSAkU1QgV0hFUkUgZW1haWw9JXMiLCRFKSk7CiAgICBub2NhY2hlX2hlYWRlcnMoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfU0xBU0hFU3xKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSwgMSk7Cg==','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP S321 Verify Dump v1',code:php,scope:'global',active:true}));
for(let i=0;i<4&&!sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(sid){
  sh('sleep 4');
  const d=sh('curl -sSk "'+SITE+'/?ps_vf2=Vf2s"');
  try{O.dry=JSON.parse(d.out);}catch(e){O.dry_raw=d.out.slice(0,500);}
  const a=sh('curl -sSk "'+SITE+'/?ps_vf2=Vf2s"');
  try{O.apply=JSON.parse(a.out);}catch(e){O.apply_raw=a.out.slice(0,500);}
  fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
  sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
  // sanity: ar svetaine gyva po deploy
  sh('sleep 3');
  O.site_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
  O.account_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/my-account/"').out.trim();
}
putB64('vfix.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
