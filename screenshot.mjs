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
// pirma deaktyvuoti visus senus TEMP S318 Verify snippetus
try{
  const l=sh('curl -sSk '+AUTH+' "'+API+'?per_page=100"').out;
  const arr=JSON.parse(l);
  O.deactivated=[];
  for(const x of arr){
    if(/TEMP S318 Verify/i.test(x.name||'') && x.active){
      fs.writeFileSync('/tmp/d0.json',JSON.stringify({active:false}));
      sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/d0.json "'+API+'/'+x.id+'"');
      O.deactivated.push(x.id);
    }
  }
}catch(e){ O.deact_err=String(e).slice(0,150); }
const php=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgUzMxOCBWZXJpZnkgdjEKICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgICBpZiAoICEgaXNzZXQoJF9HRVRbJ3BzX3ZyOCddKSB8fCAkX0dFVFsncHNfdnI4J10gIT09ICdWcjh6JyApIHJldHVybjsKICAgIGdsb2JhbCAkUFNfQ0FQOyAkUFNfQ0FQPWFycmF5KCk7ICRyPWFycmF5KCk7CiAgICAkcD1XUF9QTFVHSU5fRElSLicvcGV0c2hvcC1jb3JlL2luY2x1ZGVzL2NsYXNzLWV2ZW50LWVtaXR0ZXJzLnBocCc7CiAgICAkYz1maWxlX2dldF9jb250ZW50cygkcCk7CiAgICBwcmVnX21hdGNoX2FsbCgiIycoaHR0cHM6Ly9bXiddKig/OnZlbmlwYWt8cG9zdFwubHQpW14nXSopJyMiLCRjLCRtKTsKICAgICRyWyd1cmxzX2ZhaWxlJ109YXJyYXlfdmFsdWVzKGFycmF5X3VuaXF1ZSgkbVsxXSkpOwoKICAgIGFkZF9maWx0ZXIoJ3ByZV93cF9tYWlsJywgZnVuY3Rpb24oJG4sJGEpeyBnbG9iYWwgJFBTX0NBUDsgJFBTX0NBUFtdPWFycmF5KCdzJz0+JGFbJ3N1YmplY3QnXSwnYic9PihzdHJpbmcpJGFbJ21lc3NhZ2UnXSk7IHJldHVybiB0cnVlOyB9LDEsMik7CiAgICAkaWRzPXdjX2dldF9wcm9kdWN0cyhhcnJheSgnbGltaXQnPT4yMCwnc3RhdHVzJz0+J3B1Ymxpc2gnLCdyZXR1cm4nPT4naWRzJykpOwogICAgJHBpZD0wOyBmb3JlYWNoKChhcnJheSkkaWRzIGFzICR4KXsgJHE9d2NfZ2V0X3Byb2R1Y3QoJHgpOyBpZigkcSYmJHEtPmlzX3B1cmNoYXNhYmxlKCkmJiRxLT5pc19pbl9zdG9jaygpKXskcGlkPShpbnQpJHg7YnJlYWs7fSB9CiAgICAkbz13Y19jcmVhdGVfb3JkZXIoKTsgaWYoJHBpZCkgJG8tPmFkZF9wcm9kdWN0KHdjX2dldF9wcm9kdWN0KCRwaWQpLDEpOwogICAgJG8tPnNldF9iaWxsaW5nX2VtYWlsKCdyYWltdW5kYXNAZ3l2dW5haS5sdCcpOyAkby0+c2V0X2JpbGxpbmdfZmlyc3RfbmFtZSgnUmFpbWlzJyk7CiAgICAkby0+c2V0X3BheW1lbnRfbWV0aG9kKCdiYWNzJyk7ICRvLT5jYWxjdWxhdGVfdG90YWxzKCk7ICRvLT5zYXZlKCk7CiAgICAkb2lkPSRvLT5nZXRfaWQoKTsgJG8tPnBheW1lbnRfY29tcGxldGUoJ1ZSLScuJG9pZCk7CiAgICAkbz13Y19nZXRfb3JkZXIoJG9pZCk7CiAgICAkby0+dXBkYXRlX21ldGFfZGF0YSgndmVuaXBha19zaGlwcGluZ19vcmRlcl9kYXRhJywganNvbl9lbmNvZGUoYXJyYXkoJ3N0YXR1cyc9PidzZW50JywncGFja19udW1iZXJzJz0+YXJyYXkoJzEwNjIwMDQ2MCcpKSkpOwogICAgJG8tPnNhdmUoKTsKICAgICRyWydyZXNvbHZlJ109UGV0c2hvcF9FdmVudF9FbWl0dGVyczo6cmVzb2x2ZV90cmFja2luZyh3Y19nZXRfb3JkZXIoJG9pZCkpOwogICAgJFBTX0NBUD1hcnJheSgpOwogICAgd2NfZ2V0X29yZGVyKCRvaWQpLT51cGRhdGVfc3RhdHVzKCdjb21wbGV0ZWQnLCd2cicpOwogICAgZm9yZWFjaCgkUFNfQ0FQIGFzICRtKXsKICAgICAgICAkdD10cmltKHByZWdfcmVwbGFjZSgnL1xzKy8nLCcgJyx3cF9zdHJpcF9hbGxfdGFncygkbVsnYiddKSkpOwogICAgICAgIHByZWdfbWF0Y2hfYWxsKCcjaHR0cHM/Oi8vW15ccyJcJzw+XSsjJywkbVsnYiddLCRsbSk7CiAgICAgICAgJHJbJ21haWwnXT1hcnJheSgnc3ViamVjdCc9PiRtWydzJ10sJ2hhc19ucic9PihzdHJwb3MoJHQsJzEwNjIwMDQ2MCcpIT09ZmFsc2UpPzE6MCwKICAgICAgICAgICdsaW5rcyc9PmFycmF5X3ZhbHVlcyhhcnJheV9maWx0ZXIoYXJyYXlfdW5pcXVlKCRsbVswXSksZnVuY3Rpb24oJHgpe3JldHVybiBzdHJwb3MoJHgsJ3ZlbmlwYWsnKSE9PWZhbHNlfHxzdHJwb3MoJHgsJ3Bvc3QubHQnKSE9PWZhbHNlO30pKSk7CiAgICB9CiAgICAvLyBMUCB2YXJpYW50YXMKICAgICRvMj13Y19jcmVhdGVfb3JkZXIoKTsgaWYoJHBpZCkgJG8yLT5hZGRfcHJvZHVjdCh3Y19nZXRfcHJvZHVjdCgkcGlkKSwxKTsKICAgICRvMi0+c2V0X2JpbGxpbmdfZW1haWwoJ3JhaW11bmRhc0BneXZ1bmFpLmx0Jyk7ICRvMi0+c2V0X3BheW1lbnRfbWV0aG9kKCdiYWNzJyk7CiAgICAkbzItPmNhbGN1bGF0ZV90b3RhbHMoKTsgJG8yLT5zYXZlKCk7ICRvaWQyPSRvMi0+Z2V0X2lkKCk7ICRvMi0+cGF5bWVudF9jb21wbGV0ZSgnVlIyLScuJG9pZDIpOwogICAgJG8yPXdjX2dldF9vcmRlcigkb2lkMik7ICRvMi0+dXBkYXRlX21ldGFfZGF0YSgnX3dvb19saXRodWFuaWFwb3N0X2JhcmNvZGUnLCdDRTEyMzQ1Njc4OUxUJyk7ICRvMi0+c2F2ZSgpOwogICAgJHJbJ3Jlc29sdmVfbHAnXT1QZXRzaG9wX0V2ZW50X0VtaXR0ZXJzOjpyZXNvbHZlX3RyYWNraW5nKHdjX2dldF9vcmRlcigkb2lkMikpOwogICAgd2NfZ2V0X29yZGVyKCRvaWQpLT5kZWxldGUodHJ1ZSk7IHdjX2dldF9vcmRlcigkb2lkMiktPmRlbGV0ZSh0cnVlKTsKICAgIG5vY2FjaGVfaGVhZGVycygpOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICAgZWNobyB3cF9qc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9TTEFTSEVTfEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LCAxKTsK','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP S318 Verify Dump v1',code:php,scope:'global',active:true}));
for(let i=0;i<4&&!sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(sid){
  sh('sleep 4');
  const d=sh('curl -sSk "'+SITE+'/?ps_vr8=Vr8z"');
  try{O.dry=JSON.parse(d.out);}catch(e){O.dry_raw=d.out.slice(0,500);}
  const a=sh('curl -sSk "'+SITE+'/?ps_vr8=Vr8z"');
  try{O.apply=JSON.parse(a.out);}catch(e){O.apply_raw=a.out.slice(0,500);}
  fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
  sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
  // sanity: ar svetaine gyva po deploy
  sh('sleep 3');
  O.site_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
  O.account_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/my-account/"').out.trim();
}
putB64('ver.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
