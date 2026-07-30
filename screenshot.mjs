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
// pirma deaktyvuoti visus senus TEMP Refill Diag snippetus
try{
  const l=sh('curl -sSk '+AUTH+' "'+API+'?per_page=100"').out;
  const arr=JSON.parse(l);
  O.deactivated=[];
  for(const x of arr){
    if(/TEMP Refill Diag/i.test(x.name||'') && x.active){
      fs.writeFileSync('/tmp/d0.json',JSON.stringify({active:false}));
      sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/d0.json "'+API+'/'+x.id+'"');
      O.deactivated.push(x.id);
    }
  }
}catch(e){ O.deact_err=String(e).slice(0,150); }
const php=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgUmVmaWxsIFNraXAgRGlhZ25vc3RpY3MgdjEKICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgICBpZiAoICEgaXNzZXQoJF9HRVRbJ3BzX2RnJ10pIHx8ICRfR0VUWydwc19kZyddICE9PSAnRGczcCcgKSByZXR1cm47CiAgICBnbG9iYWwgJHdwZGI7ICRyPWFycmF5KCk7CiAgICAkcnQ9JHdwZGItPnByZWZpeC4ncHNfcmVmaWxsX3RyYWNraW5nJzsKICAgICRyb3c9JHdwZGItPmdldF9yb3coIlNFTEVDVCAqIEZST00gJHJ0IE9SREVSIEJZIGlkIERFU0MgTElNSVQgMSIpOwogICAgJHJbJ3JvdyddPWFycmF5KCdpZCc9PiRyb3ctPmlkLCd1c2VyJz0+JHJvdy0+dXNlcl9pZCwncHJvZHVjdCc9PiRyb3ctPnByb2R1Y3RfaWQsCiAgICAgICAgICAgICAgICAgICAgJ3BldCc9PiRyb3ctPnBldF9pZCwnc3RhdHVzJz0+JHJvdy0+c3RhdHVzLCdsYXN0X3B1cmNoYXNlJz0+JHJvdy0+bGFzdF9wdXJjaGFzZV9kYXRlKTsKCiAgICAvLyAoYSkgcHJla2VzIGJ1c2VuYQogICAgJHA9d2NfZ2V0X3Byb2R1Y3QoJHJvdy0+cHJvZHVjdF9pZCk7CiAgICAkclsncHJvZHVjdCddPWFycmF5KAogICAgICAgICdleGlzdHMnPT4kcD8xOjAsCiAgICAgICAgJ3Bvc3Rfc3RhdHVzJz0+Z2V0X3Bvc3Rfc3RhdHVzKCRyb3ctPnByb2R1Y3RfaWQpLAogICAgICAgICdwdXJjaGFzYWJsZSc9PiRwPygkcC0+aXNfcHVyY2hhc2FibGUoKT8xOjApOjAsCiAgICAgICAgJ2luX3N0b2NrJz0+JHA/KCRwLT5pc19pbl9zdG9jaygpPzE6MCk6MCwKICAgICAgICAncHJpY2UnPT4kcD8kcC0+Z2V0X3ByaWNlKCk6bnVsbCwKICAgICAgICAnbmFtZSc9PiRwPyRwLT5nZXRfbmFtZSgpOm51bGwsCiAgICApOwoKICAgIC8vIChiKSBoYXNfcmVwdXJjaGFzZWQKICAgIGlmIChjbGFzc19leGlzdHMoJ1BldHNob3BfUmVmaWxsX0VuZ2luZScpKSB7CiAgICAgICAgJG09bmV3IFJlZmxlY3Rpb25NZXRob2QoJ1BldHNob3BfUmVmaWxsX0VuZ2luZScsJ2hhc19yZXB1cmNoYXNlZCcpOwogICAgICAgICRtLT5zZXRBY2Nlc3NpYmxlKHRydWUpOwogICAgICAgICRyWydoYXNfcmVwdXJjaGFzZWQnXT0kbS0+aW52b2tlKG51bGwsJHJvdy0+dXNlcl9pZCwkcm93LT5wcm9kdWN0X2lkLCRyb3ctPmxhc3RfcHVyY2hhc2VfZGF0ZSk/MTowOwogICAgfQogICAgLy8ga29raWUgdXpzYWt5bWFpIHBvIHRvcyBkYXRvcwogICAgJG9yZGVycz13Y19nZXRfb3JkZXJzKGFycmF5KCdjdXN0b21lcl9pZCc9PihpbnQpJHJvdy0+dXNlcl9pZCwKICAgICAgICAnc3RhdHVzJz0+YXJyYXkoJ3djLXByb2Nlc3NpbmcnLCd3Yy1jb21wbGV0ZWQnLCd3Yy1vbi1ob2xkJyksCiAgICAgICAgJ2RhdGVfY3JlYXRlZCc9Pic+Jy5zdHJ0b3RpbWUoJHJvdy0+bGFzdF9wdXJjaGFzZV9kYXRlKSwnbGltaXQnPT4xMCwncmV0dXJuJz0+J2lkcycpKTsKICAgICRyWydvcmRlcnNfYWZ0ZXInXT0kb3JkZXJzOwoKICAgIC8vIChjKSBhciBkaXNwYXRjaCBrbGFzZSBwYXNpZWtpYW1hCiAgICAkclsnZGlzcGF0Y2hfY2xhc3MnXT1jbGFzc19leGlzdHMoJ1BldHNob3BfRW1haWxfRGlzcGF0Y2gnKT8xOjA7CgogICAgLy8gKGQpIFBBS0FSVE9USU5JUyBiYW5keW1hcyBzdSBsb2d1CiAgICBpZiAoaXNzZXQoJF9HRVRbJ3JldHJ5J10pICYmICRfR0VUWydyZXRyeSddPT09J1lFUycpIHsKICAgICAgICAkd3BkYi0+dXBkYXRlKCRydCxhcnJheSgnc3RhdHVzJz0+J2FjdGl2ZScsJ3ByZWRpY3RlZF9lbXB0eV9kYXRlJz0+Z21kYXRlKCdZLW0tZCcpKSxhcnJheSgnaWQnPT4kcm93LT5pZCkpOwogICAgICAgIC8vIGlzdHJpbmFtIHNlbmEgam9iIGplaSBidXZvCiAgICAgICAgJHQ9JHdwZGItPnByZWZpeC4ncHNfZW1haWxfam9icyc7CiAgICAgICAgJHdwZGItPnF1ZXJ5KCR3cGRiLT5wcmVwYXJlKCJERUxFVEUgRlJPTSAkdCBXSEVSRSBqb2Jfa2V5IExJS0UgJXMiLCAncmVmaWxsX2R1ZTolJykpOwogICAgICAgIFBldHNob3BfUmVmaWxsX0VuZ2luZTo6Y2hlY2tfZHVlKCk7CiAgICAgICAgJHJbJ3JldHJ5X2pvYnMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCxqb2Jfa2V5LGZsb3csc3RhdHVzLGJsb2NrX3JlYXNvbiBGUk9NICR0IFdIRVJFIGZsb3c9J3JlZmlsbF9kdWUnIiwgQVJSQVlfQSk7CiAgICAgICAgJHJbJ3JldHJ5X3N0YXR1cyddPSR3cGRiLT5nZXRfdmFyKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1Qgc3RhdHVzIEZST00gJHJ0IFdIRVJFIGlkPSVkIiwkcm93LT5pZCkpOwogICAgfQogICAgbm9jYWNoZV9oZWFkZXJzKCk7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1NMQVNIRVN8SlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0sIDEpOwo=','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP Refill Diag Dump v1',code:php,scope:'global',active:true}));
for(let i=0;i<4&&!sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(sid){
  sh('sleep 4');
  const d=sh('curl -sSk "'+SITE+'/?ps_dg=Dg3p"');
  try{O.dry=JSON.parse(d.out);}catch(e){O.dry_raw=d.out.slice(0,500);}
  const a=sh('curl -sSk "'+SITE+'/?ps_dg=Dg3p&retry=YES"');
  try{O.apply=JSON.parse(a.out);}catch(e){O.apply_raw=a.out.slice(0,500);}
  fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
  sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
  // sanity: ar svetaine gyva po deploy
  sh('sleep 3');
  O.site_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
  O.account_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/my-account/"').out.trim();
}
putB64('diag.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
