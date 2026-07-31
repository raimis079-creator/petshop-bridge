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
// pirma deaktyvuoti visus senus TEMP M10 Inventory snippetus
try{
  const l=sh('curl -sSk '+AUTH+' "'+API+'?per_page=100"').out;
  const arr=JSON.parse(l);
  O.deactivated=[];
  for(const x of arr){
    if(/TEMP M10 Inventory/i.test(x.name||'') && x.active){
      fs.writeFileSync('/tmp/d0.json',JSON.stringify({active:false}));
      sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/d0.json "'+API+'/'+x.id+'"');
      O.deactivated.push(x.id);
    }
  }
}catch(e){ O.deact_err=String(e).slice(0,150); }
const php=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgTTEwIFN1YnNjcmlwdGlvbiBJbnZlbnRvcnkgdjEKICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgICBpZiAoICEgaXNzZXQoJF9HRVRbJ3BzX20xMCddKSB8fCAkX0dFVFsncHNfbTEwJ10gIT09ICdNMTBxJyApIHJldHVybjsKICAgIGdsb2JhbCAkd3BkYjsgJHI9YXJyYXkoKTsKICAgIC8vIDEpIGxlbnRlbGVzCiAgICBmb3JlYWNoIChhcnJheSgncHNfc3Vic2NyaXB0aW9ucycsJ3BzX3N1YnNjcmlwdGlvbl9ldmVudHMnLCdwc19zdWJzY3JpcHRpb25faXRlbXMnKSBhcyAkdCkgewogICAgICAgICRmdWxsPSR3cGRiLT5wcmVmaXguJHQ7CiAgICAgICAgJHJbJ3RhYmxlcyddWyR0XT0oJHdwZGItPmdldF92YXIoIlNIT1cgVEFCTEVTIExJS0UgJyRmdWxsJyIpPT09JGZ1bGwpPydZUkEnOiduZXJhJzsKICAgIH0KICAgIC8vIDIpIGtsYXNlcwogICAgZm9yZWFjaCAoYXJyYXkoJ1BldHNob3BfU3Vic2NyaXB0aW9ucycsJ1BldHNob3BfU3Vic2NyaXB0aW9uJywnUGV0c2hvcF9SZWZpbGxfUGxhbicsJ1dDX1N1YnNjcmlwdGlvbnMnKSBhcyAkYykKICAgICAgICAkclsnY2xhc3NlcyddWyRjXT1jbGFzc19leGlzdHMoJGMpPydZUkEnOiduZXJhJzsKICAgIC8vIDMpIHBsdWdpbidhaQogICAgaWYgKCAhIGZ1bmN0aW9uX2V4aXN0cygnZ2V0X3BsdWdpbnMnKSApIHJlcXVpcmVfb25jZSBBQlNQQVRILid3cC1hZG1pbi9pbmNsdWRlcy9wbHVnaW4ucGhwJzsKICAgICRhbGw9Z2V0X3BsdWdpbnMoKTsgJGFjdD0oYXJyYXkpZ2V0X29wdGlvbignYWN0aXZlX3BsdWdpbnMnKTsgJHN1YnM9YXJyYXkoKTsKICAgIGZvcmVhY2ggKCRhY3QgYXMgJHApeyAkbj1pc3NldCgkYWxsWyRwXVsnTmFtZSddKT8kYWxsWyRwXVsnTmFtZSddOiRwOwogICAgICAgIGlmIChwcmVnX21hdGNoKCcjc3Vic2NyaXxyZWN1cnJpbmd8cHJlbnVtZXJhdHxwYXBpbGR5bSNpJywkcC4nICcuJG4pKSAkc3Vic1tdPSRuOyB9CiAgICAkclsncGx1Z2lucyddPSRzdWJzOwogICAgLy8gNCkgcHVzbGFwaWFpCiAgICBmb3JlYWNoIChhcnJheSgncmVndWxpYXJ1cy1wYXBpbGR5bWFzJywncHJlbnVtZXJhdGEnLCdzdWJzY3JpcHRpb25zJywnbXktYWNjb3VudC9zdWJzY3JpcHRpb25zJykgYXMgJHNsdWcpCiAgICAgICAgJHJbJ3BhZ2VzJ11bJHNsdWddPWdldF9wYWdlX2J5X3BhdGgoJHNsdWcpPydZUkEnOiduZXJhJzsKICAgIC8vIDUpIFdDIHN1YnNjcmlwdGlvbiBwcm9kdWt0dSB0aXBhcwogICAgJHR5cGVzPXdjX2dldF9wcm9kdWN0X3R5cGVzKCk7CiAgICAkclsncHJvZHVjdF90eXBlcyddPWFycmF5X2tleXMoJHR5cGVzKTsKICAgICRyWydoYXNfc3Vic2NyaXB0aW9uX3R5cGUnXT1pc3NldCgkdHlwZXNbJ3N1YnNjcmlwdGlvbiddKXx8aXNzZXQoJHR5cGVzWyd2YXJpYWJsZS1zdWJzY3JpcHRpb24nXSk/J1lSQSc6J25lcmEnOwogICAgLy8gNikgUkVTVCBtYXJzcnV0YWkKICAgICRydD1hcnJheSgpOwogICAgZm9yZWFjaCAoIHJlc3RfZ2V0X3NlcnZlcigpLT5nZXRfcm91dGVzKCkgYXMgJGs9PiR2ICkgaWYgKHByZWdfbWF0Y2goJyNzdWJzY3JpfHJlZmlsbC1wbGFufHBhcGlsZHltI2knLCRrKSkgJHJ0W109JGs7CiAgICAkclsncmVzdCddPSRydDsKICAgIC8vIDcpIFBheXNlcmEgcGFzaWthcnRvamFudHlzIG1va2VqaW1haQogICAgJGd3PVdDKCktPnBheW1lbnRfZ2F0ZXdheXMgPyBXQygpLT5wYXltZW50X2dhdGV3YXlzLT5nZXRfYXZhaWxhYmxlX3BheW1lbnRfZ2F0ZXdheXMoKSA6IGFycmF5KCk7CiAgICAkclsnZ2F0ZXdheXMnXT1hcnJheV9rZXlzKChhcnJheSkkZ3cpOwogICAgJHJbJ3BheXNlcmFfcmVjdXJyaW5nJ109J25lemlub21hJzsKICAgIGZvcmVhY2ggKChhcnJheSkkZ3cgYXMgJGlkPT4kZykgewogICAgICAgIGlmIChzdHJpcG9zKCRpZCwncGF5c2VyYScpIT09ZmFsc2UpIHsKICAgICAgICAgICAgJHJbJ3BheXNlcmFfc3VwcG9ydHMnXT1pc19hcnJheSgkZy0+c3VwcG9ydHMpPyRnLT5zdXBwb3J0czphcnJheSgpOwogICAgICAgICAgICAkclsncGF5c2VyYV9yZWN1cnJpbmcnXT1pbl9hcnJheSgnc3Vic2NyaXB0aW9ucycsKGFycmF5KSRnLT5zdXBwb3J0cyx0cnVlKT8nVEFJUCc6J05FJzsKICAgICAgICB9CiAgICB9CiAgICAvLyA4KSBhciBiZXQga3VyIGtvZGUgeXJhICJyZWd1bGlhcnVzIHBhcGlsZHltYXMiIG51b3JvZGEKICAgICRoaXRzPWFycmF5KCk7CiAgICBmb3JlYWNoIChhcnJheShXUF9QTFVHSU5fRElSLicvcGV0c2hvcC1jb3JlJyxnZXRfc3R5bGVzaGVldF9kaXJlY3RvcnkoKSkgYXMgJGRpcil7CiAgICAgIGlmKCFpc19kaXIoJGRpcikpY29udGludWU7CiAgICAgICRyaWk9bmV3IFJlY3Vyc2l2ZUl0ZXJhdG9ySXRlcmF0b3IobmV3IFJlY3Vyc2l2ZURpcmVjdG9yeUl0ZXJhdG9yKCRkaXIsIEZpbGVzeXN0ZW1JdGVyYXRvcjo6U0tJUF9ET1RTKSk7CiAgICAgIGZvcmVhY2goJHJpaSBhcyAkZil7IGlmKCEkZi0+aXNGaWxlKCl8fCFwcmVnX21hdGNoKCcjXC4ocGhwfGpzKSQjJywkZi0+Z2V0RmlsZW5hbWUoKSkpY29udGludWU7CiAgICAgICAgJGM9QGZpbGVfZ2V0X2NvbnRlbnRzKCRmLT5nZXRQYXRobmFtZSgpKTsgaWYoISRjKWNvbnRpbnVlOwogICAgICAgIGlmIChwcmVnX21hdGNoKCcjcmVndWxpYXJbdcWzXVxzKnBhcGlsZHltI2l1JywkYykpICRoaXRzW109YmFzZW5hbWUoJGYtPmdldFBhdGhuYW1lKCkpOyB9IH0KICAgICRyWydjb2RlX21lbnRpb25zJ109YXJyYXlfdmFsdWVzKGFycmF5X3VuaXF1ZSgkaGl0cykpOwogICAgbm9jYWNoZV9oZWFkZXJzKCk7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1NMQVNIRVN8SlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0sIDEpOwo=','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP M10 Inventory Dump v1',code:php,scope:'global',active:true}));
for(let i=0;i<4&&!sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(sid){
  sh('sleep 4');
  const d=sh('curl -sSk "'+SITE+'/?ps_m10=M10q"');
  try{O.dry=JSON.parse(d.out);}catch(e){O.dry_raw=d.out.slice(0,500);}
  const a=sh('curl -sSk "'+SITE+'/?ps_m10=M10q"');
  try{O.apply=JSON.parse(a.out);}catch(e){O.apply_raw=a.out.slice(0,500);}
  fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
  sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
  // sanity: ar svetaine gyva po deploy
  sh('sleep 3');
  O.site_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
  O.account_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/my-account/"').out.trim();
}
putB64('m10.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
