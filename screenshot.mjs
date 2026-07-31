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
// pirma deaktyvuoti visus senus TEMP S319 Chrono snippetus
try{
  const l=sh('curl -sSk '+AUTH+' "'+API+'?per_page=100"').out;
  const arr=JSON.parse(l);
  O.deactivated=[];
  for(const x of arr){
    if(/TEMP S319 Chrono/i.test(x.name||'') && x.active){
      fs.writeFileSync('/tmp/d0.json',JSON.stringify({active:false}));
      sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/d0.json "'+API+'/'+x.id+'"');
      O.deactivated.push(x.id);
    }
  }
}catch(e){ O.deact_err=String(e).slice(0,150); }
const php=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgUzMxOSBDaHJvbm9sb2d5IFRlc3QgdjEKICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgICBpZiAoICEgaXNzZXQoJF9HRVRbJ3BzX2NoJ10pIHx8ICRfR0VUWydwc19jaCddICE9PSAnQ2g0eicgKSByZXR1cm47CiAgICBnbG9iYWwgJHdwZGIsICRQU19DQVA7ICRQU19DQVA9YXJyYXkoKTsgJHI9YXJyYXkoKTsKICAgIFBldHNob3BfU2hpcG1lbnRzOjppbnN0YWxsKCk7CiAgICAkVD1QZXRzaG9wX1NoaXBtZW50czo6dGFibGUoKTsKICAgICRyWydjb2xzJ109JHdwZGItPmdldF9jb2woIlNIT1cgQ09MVU1OUyBGUk9NICRUIik7CgogICAgYWRkX2ZpbHRlcigncHJlX3dwX21haWwnLCBmdW5jdGlvbigkbiwkYSl7IGdsb2JhbCAkUFNfQ0FQOyAkUFNfQ0FQW109YXJyYXkoJ3MnPT4kYVsnc3ViamVjdCddLCdiJz0+KHN0cmluZykkYVsnbWVzc2FnZSddKTsgcmV0dXJuIHRydWU7IH0sMSwyKTsKCiAgICAkaWRzPXdjX2dldF9wcm9kdWN0cyhhcnJheSgnbGltaXQnPT4yMCwnc3RhdHVzJz0+J3B1Ymxpc2gnLCdyZXR1cm4nPT4naWRzJykpOwogICAgJHBpZD0wOyBmb3JlYWNoKChhcnJheSkkaWRzIGFzICR4KXsgJHE9d2NfZ2V0X3Byb2R1Y3QoJHgpOyBpZigkcSYmJHEtPmlzX3B1cmNoYXNhYmxlKCkmJiRxLT5pc19pbl9zdG9jaygpKXskcGlkPShpbnQpJHg7YnJlYWs7fSB9CiAgICAkbz13Y19jcmVhdGVfb3JkZXIoKTsgaWYoJHBpZCkgJG8tPmFkZF9wcm9kdWN0KHdjX2dldF9wcm9kdWN0KCRwaWQpLDIpOwogICAgJG8tPnNldF9iaWxsaW5nX2VtYWlsKCdyYWltdW5kYXNAZ3l2dW5haS5sdCcpOyAkby0+c2V0X2JpbGxpbmdfZmlyc3RfbmFtZSgnUmFpbWlzJyk7CiAgICAkby0+c2V0X3BheW1lbnRfbWV0aG9kKCdiYWNzJyk7ICRvLT5jYWxjdWxhdGVfdG90YWxzKCk7ICRvLT5zYXZlKCk7CiAgICAkb2lkPSRvLT5nZXRfaWQoKTsgJG8tPnBheW1lbnRfY29tcGxldGUoJ0NILScuJG9pZCk7CiAgICAkclsnb3JkZXInXT0kb2lkOwoKICAgICRzaG93PWZ1bmN0aW9uKCRvaWQpIHVzZSAoJHdwZGIsJFQpeyByZXR1cm4gJHdwZGItPmdldF9yZXN1bHRzKCR3cGRiLT5wcmVwYXJlKAogICAgICAgICJTRUxFQ1QgY2Fycmllcix0cmFja2luZ19udW1iZXIsc291cmNlIEZST00gJFQgV0hFUkUgb3JkZXJfaWQ9JWQgT1JERVIgQlkgaWQiLCRvaWQpLCBBUlJBWV9BKTsgfTsKCiAgICAvLyA9PT0gMSkgUElSTUFTIGlzc2l1bnRpbWFzOiBudW1lcmlzIEEgPT09CiAgICAkbz13Y19nZXRfb3JkZXIoJG9pZCk7CiAgICAkby0+dXBkYXRlX21ldGFfZGF0YSgndmVuaXBha19zaGlwcGluZ19vcmRlcl9kYXRhJywganNvbl9lbmNvZGUoYXJyYXkoJ3N0YXR1cyc9PidzZW50JywncGFja19udW1iZXJzJz0+YXJyYXkoJzEwNjIwMDQ2MCcpKSkpOwogICAgJG8tPnNhdmUoKTsKICAgICRyWydzdGVwMV9wb19BJ109JHNob3coJG9pZCk7CgogICAgLy8gPT09IDIpIEFOVFJBUyBpc3NpdW50aW1hczogcGx1Z2luIFBFUlJBU08gbWV0YSBudW1lcml1IEIgPT09CiAgICAkbz13Y19nZXRfb3JkZXIoJG9pZCk7CiAgICAkby0+dXBkYXRlX21ldGFfZGF0YSgndmVuaXBha19zaGlwcGluZ19vcmRlcl9kYXRhJywganNvbl9lbmNvZGUoYXJyYXkoJ3N0YXR1cyc9PidzZW50JywncGFja19udW1iZXJzJz0+YXJyYXkoJzEwNjIwMDk5OScpKSkpOwogICAgJG8tPnNhdmUoKTsKICAgICRyWydzdGVwMl9wb19CJ109JHNob3coJG9pZCk7CiAgICAkclsnbWV0YV9kYWJhciddPWpzb25fZGVjb2RlKHdjX2dldF9vcmRlcigkb2lkKS0+Z2V0X21ldGEoJ3ZlbmlwYWtfc2hpcHBpbmdfb3JkZXJfZGF0YScsdHJ1ZSksdHJ1ZSk7CgogICAgLy8gPT09IDMpIHJlc29sdmVfdHJhY2tpbmcgPT09CiAgICAkclsncmVzb2x2ZSddPVBldHNob3BfRXZlbnRfRW1pdHRlcnM6OnJlc29sdmVfdHJhY2tpbmcod2NfZ2V0X29yZGVyKCRvaWQpKTsKCiAgICAvLyA9PT0gNCkgQ09NUExFVEVEIC0+IGxhaXNrYXMgPT09CiAgICAkUFNfQ0FQPWFycmF5KCk7CiAgICB3Y19nZXRfb3JkZXIoJG9pZCktPnVwZGF0ZV9zdGF0dXMoJ2NvbXBsZXRlZCcsJ2Nocm9ubycpOwogICAgJHJbJ2xhaXNrdV9za2FpY2l1cyddPWNvdW50KCRQU19DQVApOwogICAgZm9yZWFjaCgkUFNfQ0FQIGFzICRtKXsKICAgICAgICAkdD10cmltKHByZWdfcmVwbGFjZSgnL1xzKy8nLCcgJyx3cF9zdHJpcF9hbGxfdGFncygkbVsnYiddKSkpOwogICAgICAgIHByZWdfbWF0Y2hfYWxsKCcjaHR0cHM/Oi8vW15ccyJcJzw+XSsjJywkbVsnYiddLCRsbSk7CiAgICAgICAgJHJbJ21haWwnXT1hcnJheSgKICAgICAgICAgICdzdWJqZWN0Jz0+JG1bJ3MnXSwKICAgICAgICAgICd0dXJpX0EnPT4oc3RycG9zKCR0LCcxMDYyMDA0NjAnKSE9PWZhbHNlKT8xOjAsCiAgICAgICAgICAndHVyaV9CJz0+KHN0cnBvcygkdCwnMTA2MjAwOTk5JykhPT1mYWxzZSk/MTowLAogICAgICAgICAgJ3R1cmlfMl9zaXVudG9zJz0+KHN0cmlwb3MoJHQsJzIgYXRza2lyb21pcyBzaXVudG9taXMnKSE9PWZhbHNlKT8xOjAsCiAgICAgICAgICAnc2l1bnRhXzFfaXNfMic9PihzdHJpcG9zKCR0LCdTaXVudGEgMSBpxaEgMicpIT09ZmFsc2UpPzE6MCwKICAgICAgICAgICdleGNlcnB0Jz0+bWJfc3Vic3RyKCR0LDAsNDIwKSwKICAgICAgICAgICdsaW5rcyc9PmFycmF5X3ZhbHVlcyhhcnJheV9maWx0ZXIoYXJyYXlfdW5pcXVlKCRsbVswXSksZnVuY3Rpb24oJHgpe3JldHVybiBzdHJwb3MoJHgsJ3ZlbmlwYWsnKSE9PWZhbHNlO30pKSk7CiAgICB9CiAgICAkclsnc3RhdHMnXT1QZXRzaG9wX1NoaXBtZW50czo6c3RhdHMoKTsKICAgIC8vIHZhbG9tCiAgICB3Y19nZXRfb3JkZXIoJG9pZCktPmRlbGV0ZSh0cnVlKTsKICAgICR3cGRiLT5xdWVyeSgkd3BkYi0+cHJlcGFyZSgiREVMRVRFIEZST00gJFQgV0hFUkUgb3JkZXJfaWQ9JWQiLCRvaWQpKTsKICAgIG5vY2FjaGVfaGVhZGVycygpOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICAgZWNobyB3cF9qc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9TTEFTSEVTfEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LCAxKTsK','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP S319 Chrono Dump v1',code:php,scope:'global',active:true}));
for(let i=0;i<4&&!sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(sid){
  sh('sleep 4');
  const d=sh('curl -sSk "'+SITE+'/?ps_ch=Ch4z"');
  try{O.dry=JSON.parse(d.out);}catch(e){O.dry_raw=d.out.slice(0,500);}
  const a=sh('curl -sSk "'+SITE+'/?ps_ch=Ch4z"');
  try{O.apply=JSON.parse(a.out);}catch(e){O.apply_raw=a.out.slice(0,500);}
  fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
  sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
  // sanity: ar svetaine gyva po deploy
  sh('sleep 3');
  O.site_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
  O.account_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/my-account/"').out.trim();
}
putB64('chrono.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
