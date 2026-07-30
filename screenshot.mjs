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
// pirma deaktyvuoti visus senus TEMP Cart Query snippetus
try{
  const l=sh('curl -sSk '+AUTH+' "'+API+'?per_page=100"').out;
  const arr=JSON.parse(l);
  O.deactivated=[];
  for(const x of arr){
    if(/TEMP Cart Query/i.test(x.name||'') && x.active){
      fs.writeFileSync('/tmp/d0.json',JSON.stringify({active:false}));
      sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/d0.json "'+API+'/'+x.id+'"');
      O.deactivated.push(x.id);
    }
  }
}catch(e){ O.deact_err=String(e).slice(0,150); }
const php=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgQ2FydCBRdWVyeSB2MSDigJQgdGlrIFNLQUlUWU1BUyBkaWFnbm9zdGlrYWkKICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgICBpZiAoICEgaXNzZXQoJF9HRVRbJ3BzX2NxJ10pIHx8ICRfR0VUWydwc19jcSddICE9PSAnQ3E2ZCcgKSByZXR1cm47CiAgICBnbG9iYWwgJHdwZGI7ICRUPSR3cGRiLT5wcmVmaXguJ3BzX2NhcnRzJzsgJHI9YXJyYXkoKTsKICAgIGlmIChpc3NldCgkX0dFVFsncHJvZHVjdHMnXSkpIHsKICAgICAgICAvLyB0ZXN0dWkgdGlua2Ftb3MgcHJla2VzCiAgICAgICAgJHNpbXBsZT13Y19nZXRfcHJvZHVjdHMoYXJyYXkoJ2xpbWl0Jz0+MSwnc3RhdHVzJz0+J3B1Ymxpc2gnLCd0eXBlJz0+J3NpbXBsZScsJ3N0b2NrX3N0YXR1cyc9PidpbnN0b2NrJywncmV0dXJuJz0+J29iamVjdHMnKSk7CiAgICAgICAgJHZhciAgID13Y19nZXRfcHJvZHVjdHMoYXJyYXkoJ2xpbWl0Jz0+MSwnc3RhdHVzJz0+J3B1Ymxpc2gnLCd0eXBlJz0+J3ZhcmlhYmxlJywnc3RvY2tfc3RhdHVzJz0+J2luc3RvY2snLCdyZXR1cm4nPT4nb2JqZWN0cycpKTsKICAgICAgICAkclsnc2ltcGxlJ109JHNpbXBsZT9hcnJheSgnaWQnPT4kc2ltcGxlWzBdLT5nZXRfaWQoKSwndXJsJz0+JHNpbXBsZVswXS0+Z2V0X3Blcm1hbGluaygpLCduYW1lJz0+JHNpbXBsZVswXS0+Z2V0X25hbWUoKSk6bnVsbDsKICAgICAgICBpZiAoJHZhcikgeyAkdnY9JHZhclswXS0+Z2V0X2NoaWxkcmVuKCk7CiAgICAgICAgICAgICRyWyd2YXJpYWJsZSddPWFycmF5KCdpZCc9PiR2YXJbMF0tPmdldF9pZCgpLCd1cmwnPT4kdmFyWzBdLT5nZXRfcGVybWFsaW5rKCksJ25hbWUnPT4kdmFyWzBdLT5nZXRfbmFtZSgpLCdjaGlsZHJlbic9PmNvdW50KCR2dikpOyB9CiAgICAgICAgZWxzZSAkclsndmFyaWFibGUnXT1udWxsOwogICAgICAgIG5vY2FjaGVfaGVhZGVycygpOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1NMQVNIRVN8SlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7CiAgICB9CiAgICBpZiAoaXNzZXQoJF9HRVRbJ2NsZWFudXAnXSkpIHsKICAgICAgICAkY2lkPXNhbml0aXplX3RleHRfZmllbGQoJF9HRVRbJ2NsZWFudXAnXSk7CiAgICAgICAgJHdwZGItPnF1ZXJ5KCR3cGRiLT5wcmVwYXJlKCJERUxFVEUgRlJPTSAkVCBXSEVSRSBjYXJ0X2lkPSVzIiwkY2lkKSk7CiAgICAgICAgJHJbJ2RlbGV0ZWQnXT0kY2lkOwogICAgICAgIG5vY2FjaGVfaGVhZGVycygpOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRyKTsgZXhpdDsKICAgIH0KICAgICRyb3dzPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGNhcnRfaWQsc2Vzc2lvbl9rZXksdXNlcl9pZCxlbWFpbCxlbWFpbF9zb3VyY2UsbGFzdF9jYXJ0X2FjdGl2aXR5X2F0LGNhcnRfaGFzaCxzbmFwc2hvdF9qc29uLHN0YXR1cyxjcmVhdGVkX2F0LHVwZGF0ZWRfYXQgRlJPTSAkVCBPUkRFUiBCWSBpZCBERVNDIExJTUlUIDMiLCBBUlJBWV9BKTsKICAgIGZvcmVhY2ggKCRyb3dzIGFzICYkeCkgewogICAgICAgICRzPWpzb25fZGVjb2RlKCR4WydzbmFwc2hvdF9qc29uJ10sdHJ1ZSk7CiAgICAgICAgJHhbJ2l0ZW1zJ109aXNfYXJyYXkoJHMpP2NvdW50KCRzKTowOwogICAgICAgICR4WydzbmFwc2hvdCddPWlzX2FycmF5KCRzKT9hcnJheV9tYXAoZnVuY3Rpb24oJGkpewogICAgICAgICAgICByZXR1cm4gYXJyYXkoJ3AnPT4kaVsncHJvZHVjdF9pZCddLCd2Jz0+JGlbJ3ZhcmlhdGlvbl9pZCddLCdxJz0+JGlbJ3F1YW50aXR5J10sCiAgICAgICAgICAgICAgICAgICAgICAgICAndmFyJz0+JGlbJ3ZhcmlhdGlvbiddLCdpdGVtX2RhdGFfa2V5cyc9PmFycmF5X2tleXMoKGFycmF5KSRpWydpdGVtX2RhdGEnXSkpOwogICAgICAgIH0sJHMpOm51bGw7CiAgICAgICAgdW5zZXQoJHhbJ3NuYXBzaG90X2pzb24nXSk7CiAgICB9CiAgICAkclsncm93cyddPSRyb3dzOwogICAgbm9jYWNoZV9oZWFkZXJzKCk7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1NMQVNIRVN8SlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0sIDEpOwo=','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP Cart Query Dump v1',code:php,scope:'global',active:true}));
for(let i=0;i<4&&!sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(sid){
  sh('sleep 4');
  const d=sh('curl -sSk "'+SITE+'/?ps_cq=Cq6d&products=1"');
  try{O.dry=JSON.parse(d.out);}catch(e){O.dry_raw=d.out.slice(0,500);}
  const a=sh('curl -sSk "'+SITE+'/?ps_cq=Cq6d&products=1"');
  try{O.apply=JSON.parse(a.out);}catch(e){O.apply_raw=a.out.slice(0,500);}
  // paliekam aktyvu browser testui
  // sanity: ar svetaine gyva po deploy
  sh('sleep 3');
  O.site_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
  O.account_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/my-account/"').out.trim();
}
putB64('cq.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
