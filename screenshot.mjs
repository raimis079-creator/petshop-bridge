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
// pirma deaktyvuoti visus senus TEMP Refill Positive snippetus
try{
  const l=sh('curl -sSk '+AUTH+' "'+API+'?per_page=100"').out;
  const arr=JSON.parse(l);
  O.deactivated=[];
  for(const x of arr){
    if(/TEMP Refill Positive/i.test(x.name||'') && x.active){
      fs.writeFileSync('/tmp/d0.json',JSON.stringify({active:false}));
      sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/d0.json "'+API+'/'+x.id+'"');
      O.deactivated.push(x.id);
    }
  }
}catch(e){ O.deact_err=String(e).slice(0,150); }
const php=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgUmVmaWxsIFBvc2l0aXZlIFBhdGggdjEKICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgICBpZiAoICEgaXNzZXQoJF9HRVRbJ3BzX3BzJ10pIHx8ICRfR0VUWydwc19wcyddICE9PSAnUHM2eScgKSByZXR1cm47CiAgICBnbG9iYWwgJHdwZGI7ICRyPWFycmF5KCk7CiAgICAkcnQ9JHdwZGItPnByZWZpeC4ncHNfcmVmaWxsX3RyYWNraW5nJzsKICAgICR0ID0kd3BkYi0+cHJlZml4Lidwc19lbWFpbF9qb2JzJzsKICAgICRyb3c9JHdwZGItPmdldF9yb3coIlNFTEVDVCAqIEZST00gJHJ0IE9SREVSIEJZIGlkIERFU0MgTElNSVQgMSIpOwogICAgJG9yaWc9YXJyYXkoJ3N0YXR1cyc9PiRyb3ctPnN0YXR1cywncGVkJz0+JHJvdy0+cHJlZGljdGVkX2VtcHR5X2RhdGUsJ2xwZCc9PiRyb3ctPmxhc3RfcHVyY2hhc2VfZGF0ZSk7CiAgICAkclsnb3JpZyddPSRvcmlnOwoKICAgIC8vIFNpbXVsaXVvamFtOiBwaXJrbyBTSUFORElFTiwgcG8gdG8gdXpzYWt5bXUgTkVCVVZPLCBtYWlzdGFzIGJhaWdpYXNpLgogICAgJHdwZGItPnVwZGF0ZSgkcnQsIGFycmF5KAogICAgICAgICdzdGF0dXMnICAgICAgICAgICAgICAgPT4gJ2FjdGl2ZScsCiAgICAgICAgJ2xhc3RfcHVyY2hhc2VfZGF0ZScgICA9PiBnbWRhdGUoJ1ktbS1kIEg6aTpzJyksCiAgICAgICAgJ3ByZWRpY3RlZF9lbXB0eV9kYXRlJyA9PiBnbWRhdGUoJ1ktbS1kJyksCiAgICApLCBhcnJheSgnaWQnPT4kcm93LT5pZCkpOwoKICAgICR3cGRiLT5xdWVyeSgiREVMRVRFIEZST00gJHQgV0hFUkUgZmxvdz0ncmVmaWxsX2R1ZSciKTsKICAgIFBldHNob3BfUmVmaWxsX0VuZ2luZTo6Y2hlY2tfZHVlKCk7CgogICAgJHJbJ2pvYnMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCxqb2Jfa2V5LGZsb3csZmxvd19jbGFzcyxyZWNpcGllbnRfZW1haWwsc3RhdHVzLHN1YmplY3QgRlJPTSAkdCBXSEVSRSBmbG93PSdyZWZpbGxfZHVlJyIsIEFSUkFZX0EpOwogICAgJHJbJ2RyeSddPVBldHNob3BfRW1haWxfRGlzcGF0Y2g6OnByb2Nlc3NfcGVuZGluZyg1LHRydWUpOwogICAgaWYgKGlzc2V0KCRfR0VUWydzZW5kJ10pICYmICRfR0VUWydzZW5kJ109PT0nWUVTJykgewogICAgICAgICRyWydzZW5kJ109UGV0c2hvcF9FbWFpbF9EaXNwYXRjaDo6cHJvY2Vzc19wZW5kaW5nKDUsZmFsc2UpOwogICAgICAgICRyWydqb2JzX2FmdGVyJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsc3RhdHVzLHByb3ZpZGVyX21lc3NhZ2VfaWQsc3ViamVjdCxsYXN0X2Vycm9yIEZST00gJHQgV0hFUkUgZmxvdz0ncmVmaWxsX2R1ZSciLCBBUlJBWV9BKTsKICAgIH0KICAgIC8vIGdyYXppbmFtIGthaXAgYnV2bwogICAgJHdwZGItPnVwZGF0ZSgkcnQsIGFycmF5KCdzdGF0dXMnPT4kb3JpZ1snc3RhdHVzJ10sJ3ByZWRpY3RlZF9lbXB0eV9kYXRlJz0+JG9yaWdbJ3BlZCddLCdsYXN0X3B1cmNoYXNlX2RhdGUnPT4kb3JpZ1snbHBkJ10pLCBhcnJheSgnaWQnPT4kcm93LT5pZCkpOwogICAgJHJbJ3Jlc3RvcmVkJ109JHdwZGItPmdldF9yb3coJHdwZGItPnByZXBhcmUoIlNFTEVDVCBzdGF0dXMscHJlZGljdGVkX2VtcHR5X2RhdGUsbGFzdF9wdXJjaGFzZV9kYXRlIEZST00gJHJ0IFdIRVJFIGlkPSVkIiwkcm93LT5pZCksIEFSUkFZX0EpOwoKICAgIG5vY2FjaGVfaGVhZGVycygpOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICAgZWNobyB3cF9qc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9TTEFTSEVTfEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LCAxKTsK','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP Refill Positive Dump v1',code:php,scope:'global',active:true}));
for(let i=0;i<4&&!sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(sid){
  sh('sleep 4');
  const d=sh('curl -sSk "'+SITE+'/?ps_ps=Ps6y"');
  try{O.dry=JSON.parse(d.out);}catch(e){O.dry_raw=d.out.slice(0,500);}
  const a=sh('curl -sSk "'+SITE+'/?ps_ps=Ps6y&send=YES"');
  try{O.apply=JSON.parse(a.out);}catch(e){O.apply_raw=a.out.slice(0,500);}
  fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
  sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
  // sanity: ar svetaine gyva po deploy
  sh('sleep 3');
  O.site_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
  O.account_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/my-account/"').out.trim();
}
putB64('pos.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
