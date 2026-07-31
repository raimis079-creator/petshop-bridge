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
// pirma deaktyvuoti visus senus TEMP Support Audit snippetus
try{
  const l=sh('curl -sSk '+AUTH+' "'+API+'?per_page=100"').out;
  const arr=JSON.parse(l);
  O.deactivated=[];
  for(const x of arr){
    if(/TEMP Support Audit/i.test(x.name||'') && x.active){
      fs.writeFileSync('/tmp/d0.json',JSON.stringify({active:false}));
      sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/d0.json "'+API+'/'+x.id+'"');
      O.deactivated.push(x.id);
    }
  }
}catch(e){ O.deact_err=String(e).slice(0,150); }
const php=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgU3VwcG9ydCBEZXN0aW5hdGlvbiBBdWRpdCB2MQogKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAgIGlmICggISBpc3NldCgkX0dFVFsncHNfc3VwJ10pIHx8ICRfR0VUWydwc19zdXAnXSAhPT0gJ1NwM2snICkgcmV0dXJuOwogICAgZ2xvYmFsICR3cGRiOyAkcj1hcnJheSgpOwoKICAgIC8vIDEpIGtvbnRha3R1IC8gcGFnYWxib3MgcHVzbGFwaWFpCiAgICBmb3JlYWNoKGFycmF5KCdrb250YWt0YWknLCdjb250YWN0JywncGFnYWxiYScsJ3N1cHBvcnQnLCdkdWsnLCdrbGF1c2ltYWknLCdwYWdhbGJhLWRlbC11enNha3ltbycpIGFzICRzKQogICAgICAgICRyWydwYWdlcyddWyRzXT1nZXRfcGFnZV9ieV9wYXRoKCRzKT9nZXRfcGFnZV9ieV9wYXRoKCRzKS0+SUQ6J25lcmEnOwoKICAgIC8vIDIpIGZvcm11IHBsdWdpbidhaQogICAgaWYgKCAhIGZ1bmN0aW9uX2V4aXN0cygnZ2V0X3BsdWdpbnMnKSApIHJlcXVpcmVfb25jZSBBQlNQQVRILid3cC1hZG1pbi9pbmNsdWRlcy9wbHVnaW4ucGhwJzsKICAgICRhbGw9Z2V0X3BsdWdpbnMoKTsgJGFjdD0oYXJyYXkpZ2V0X29wdGlvbignYWN0aXZlX3BsdWdpbnMnKTsgJGY9YXJyYXkoKTsKICAgIGZvcmVhY2goJGFjdCBhcyAkcCl7ICRuPWlzc2V0KCRhbGxbJHBdWydOYW1lJ10pPyRhbGxbJHBdWydOYW1lJ106JHA7CiAgICAgIGlmIChwcmVnX21hdGNoKCcjY29udGFjdC4/Zm9ybXx3cGZvcm1zfGdyYXZpdHl8bmluamEuP2Zvcm1zfGZvcm1pZGFibGV8Zmx1ZW50Lj9mb3JtI2knLCRwLicgJy4kbikpICRmW109JG47IH0KICAgICRyWydmb3JtX3BsdWdpbnMnXT0kZjsKICAgICRyWydjZjdfYWN0aXZlJ109Y2xhc3NfZXhpc3RzKCdXUENGNycpPydZUkEnOiduZXJhJzsKICAgIC8vIENGNyBmb3Jtb3MKICAgIGlmIChjbGFzc19leGlzdHMoJ1dQQ0Y3JykpIHsKICAgICAgICAkcT1nZXRfcG9zdHMoYXJyYXkoJ3Bvc3RfdHlwZSc9Pid3cGNmN19jb250YWN0X2Zvcm0nLCdudW1iZXJwb3N0cyc9PjEwKSk7CiAgICAgICAgJHJbJ2NmN19mb3JtcyddPWFycmF5X21hcChmdW5jdGlvbigkeCl7cmV0dXJuIGFycmF5KCdpZCc9PiR4LT5JRCwndGl0bGUnPT4keC0+cG9zdF90aXRsZSk7fSwkcSk7CiAgICB9CiAgICAvLyBGbGF0c29tZS90ZW1vcyBmb3Jtb3Mgc2hvcnRjb2RlJ2FpIHB1c2xhcGl1b3NlCiAgICAkclsncGFnZXNfd2l0aF9mb3JtcyddPWFycmF5KCk7CiAgICBmb3JlYWNoICgkclsncGFnZXMnXSBhcyAkc2x1Zz0+JGlkKSB7CiAgICAgICAgaWYgKCRpZD09PSduZXJhJykgY29udGludWU7CiAgICAgICAgJGM9Z2V0X3Bvc3RfZmllbGQoJ3Bvc3RfY29udGVudCcsJGlkKTsKICAgICAgICAkclsncGFnZXNfd2l0aF9mb3JtcyddWyRzbHVnXT1hcnJheSgKICAgICAgICAgICdjb250YWN0LWZvcm0tNyc9PihzdHJwb3MoJGMsJ2NvbnRhY3QtZm9ybS03JykhPT1mYWxzZXx8c3RycG9zKCRjLCdbY29udGFjdC1mb3JtLTcnKSE9PWZhbHNlKT8xOjAsCiAgICAgICAgICAndXhfaHRtbCc9PihzdHJwb3MoJGMsJ3V4XycpIT09ZmFsc2UpPzE6MCwKICAgICAgICAgICdmb3JtX3RhZyc9PihzdHJpcG9zKCRjLCc8Zm9ybScpIT09ZmFsc2UpPzE6MCwKICAgICAgICAgICdpbGdpcyc9PnN0cmxlbigkYyksCiAgICAgICAgICAnacWhdHJhdWthJz0+dHJpbShwcmVnX3JlcGxhY2UoJy9ccysvJywnICcsd3Bfc3RyaXBfYWxsX3RhZ3MobWJfc3Vic3RyKCRjLDAsMzAwKSkpKSk7CiAgICB9CgogICAgLy8gMykgV0MgbGFpc2t1IGZyb20gLyByZXBseS10bwogICAgJHJbJ3djX21haWwnXT1hcnJheSgKICAgICAgJ2Zyb21fbmFtZSc9PmdldF9vcHRpb24oJ3dvb2NvbW1lcmNlX2VtYWlsX2Zyb21fbmFtZScpLAogICAgICAnZnJvbV9hZGRyZXNzJz0+Z2V0X29wdGlvbignd29vY29tbWVyY2VfZW1haWxfZnJvbV9hZGRyZXNzJyksCiAgICApOwogICAgLy8gcmVhbHVzIHJlcGx5LXRvIGlzIGlzc2l1c3RvIGxhaXNrbwogICAgZ2xvYmFsICRQU19IRFI7ICRQU19IRFI9YXJyYXkoKTsKICAgIGFkZF9maWx0ZXIoJ3ByZV93cF9tYWlsJywgZnVuY3Rpb24oJG4sJGEpeyBnbG9iYWwgJFBTX0hEUjsKICAgICAgJFBTX0hEUltdPWFycmF5KCd0byc9PmlzX2FycmF5KCRhWyd0byddKT9pbXBsb2RlKCcsJywkYVsndG8nXSk6JGFbJ3RvJ10sCiAgICAgICAgJ3MnPT4kYVsnc3ViamVjdCddLCdoZWFkZXJzJz0+aXNfYXJyYXkoJGFbJ2hlYWRlcnMnXSk/aW1wbG9kZSgnIHwgJywkYVsnaGVhZGVycyddKTooc3RyaW5nKSRhWydoZWFkZXJzJ10pOwogICAgICByZXR1cm4gdHJ1ZTsgfSwxLDIpOwogICAgJHByb2Q9d2NfZ2V0X3Byb2R1Y3RzKGFycmF5KCdsaW1pdCc9PjEsJ3N0YXR1cyc9PidwdWJsaXNoJywncmV0dXJuJz0+J2lkcycpKTsKICAgICRvPXdjX2NyZWF0ZV9vcmRlcigpOyBpZigkcHJvZCkgJG8tPmFkZF9wcm9kdWN0KHdjX2dldF9wcm9kdWN0KCRwcm9kWzBdKSwxKTsKICAgICRvLT5zZXRfYmlsbGluZ19lbWFpbCgnc3VwQGV4YW1wbGUuY29tJyk7ICRvLT5zZXRfcGF5bWVudF9tZXRob2QoJ2JhY3MnKTsKICAgICRvLT5jYWxjdWxhdGVfdG90YWxzKCk7ICRvLT5zYXZlKCk7ICRvaWQ9JG8tPmdldF9pZCgpOwogICAgJFBTX0hEUj1hcnJheSgpOyAkby0+cGF5bWVudF9jb21wbGV0ZSgnU1VQLScuJG9pZCk7CiAgICAkclsnbGFpc2tvX2hlYWRlcnMnXT0kUFNfSERSOwogICAgd2NfZ2V0X29yZGVyKCRvaWQpLT5kZWxldGUodHJ1ZSk7CgogICAgLy8gNCkgU01UUCBudXN0YXR5bWFpIChhciByZXBseSBlaW5hIGkgYXB0YXJuYXVqYW1hIGRlenV0ZSkKICAgICRzbXRwPWdldF9vcHRpb24oJ3dwX21haWxfc210cCcpOwogICAgaWYgKGlzX2FycmF5KCRzbXRwKSkgewogICAgICAgICRyWydzbXRwJ109YXJyYXkoJ21haWxlcic9PiRzbXRwWydtYWlsJ11bJ21haWxlciddPz9udWxsLAogICAgICAgICAgJ2Zyb21fZW1haWwnPT4kc210cFsnbWFpbCddWydmcm9tX2VtYWlsJ10/P251bGwsCiAgICAgICAgICAnZnJvbV9uYW1lJz0+JHNtdHBbJ21haWwnXVsnZnJvbV9uYW1lJ10/P251bGwsCiAgICAgICAgICAncmV0dXJuX3BhdGgnPT4kc210cFsnbWFpbCddWydyZXR1cm5fcGF0aCddPz9udWxsKTsKICAgIH0KICAgIC8vIDUpIFJFU1Qgc3VwcG9ydCBlbmRwb2ludGFpCiAgICAkcnQ9YXJyYXkoKTsKICAgIGZvcmVhY2ggKCByZXN0X2dldF9zZXJ2ZXIoKS0+Z2V0X3JvdXRlcygpIGFzICRrPT4kdiApIGlmIChwcmVnX21hdGNoKCcjc3VwcG9ydHxjb250YWN0fHBhZ2FsYnx0aWNrZXQjaScsJGspKSAkcnRbXT0kazsKICAgICRyWydyZXN0J109JHJ0OwoKICAgIG5vY2FjaGVfaGVhZGVycygpOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICAgZWNobyB3cF9qc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9TTEFTSEVTfEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LCAxKTsK','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP Support Audit Dump v1',code:php,scope:'global',active:true}));
for(let i=0;i<4&&!sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(sid){
  sh('sleep 4');
  const d=sh('curl -sSk "'+SITE+'/?ps_sup=Sp3k"');
  try{O.dry=JSON.parse(d.out);}catch(e){O.dry_raw=d.out.slice(0,500);}
  const a=sh('curl -sSk "'+SITE+'/?ps_sup=Sp3k"');
  try{O.apply=JSON.parse(a.out);}catch(e){O.apply_raw=a.out.slice(0,500);}
  fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
  sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
  // sanity: ar svetaine gyva po deploy
  sh('sleep 3');
  O.site_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
  O.account_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/my-account/"').out.trim();
}
putB64('sup.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
