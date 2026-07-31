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
// pirma deaktyvuoti visus senus TEMP Stock Reserve snippetus
try{
  const l=sh('curl -sSk '+AUTH+' "'+API+'?per_page=100"').out;
  const arr=JSON.parse(l);
  O.deactivated=[];
  for(const x of arr){
    if(/TEMP Stock Reserve/i.test(x.name||'') && x.active){
      fs.writeFileSync('/tmp/d0.json',JSON.stringify({active:false}));
      sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/d0.json "'+API+'/'+x.id+'"');
      O.deactivated.push(x.id);
    }
  }
}catch(e){ O.deact_err=String(e).slice(0,150); }
const php=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgU3RvY2sgUmVzZXJ2YXRpb24gQ2hlY2sgdjEKICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgICBpZiAoICEgaXNzZXQoJF9HRVRbJ3BzX3N0J10pIHx8ICRfR0VUWydwc19zdCddICE9PSAnU3Q1cicgKSByZXR1cm47CiAgICBnbG9iYWwgJHdwZGI7ICRyPWFycmF5KCk7CiAgICAkclsnbWFuYWdlX3N0b2NrJ10gICAgICAgPSBnZXRfb3B0aW9uKCd3b29jb21tZXJjZV9tYW5hZ2Vfc3RvY2snKTsKICAgICRyWydob2xkX3N0b2NrX21pbnV0ZXMnXSA9IGdldF9vcHRpb24oJ3dvb2NvbW1lcmNlX2hvbGRfc3RvY2tfbWludXRlcycpOwogICAgJHJbJ25vdGlmeV9sb3dfc3RvY2snXSAgID0gZ2V0X29wdGlvbignd29vY29tbWVyY2Vfbm90aWZ5X2xvd19zdG9ja19hbW91bnQnKTsKICAgICRyWydzdG9ja19mb3JtYXQnXSAgICAgICA9IGdldF9vcHRpb24oJ3dvb2NvbW1lcmNlX3N0b2NrX2Zvcm1hdCcpOwogICAgLy8gV0MgcmV6ZXJ2YWNpanUgbGVudGVsZSAobnVvIFdDIDQuMykKICAgICRydD0kd3BkYi0+cHJlZml4Lid3Y19yZXNlcnZlZF9zdG9jayc7CiAgICAkclsncmVzZXJ2ZWRfdGFibGVfZXhpc3RzJ109KCR3cGRiLT5nZXRfdmFyKCJTSE9XIFRBQkxFUyBMSUtFICckcnQnIik9PT0kcnQpOwogICAgaWYgKCRyWydyZXNlcnZlZF90YWJsZV9leGlzdHMnXSkgewogICAgICAgICRyWydyZXNlcnZlZF9jb2xzJ109JHdwZGItPmdldF9jb2woIlNIT1cgQ09MVU1OUyBGUk9NICRydCIpOwogICAgICAgICRyWydyZXNlcnZlZF9yb3dzJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJHJ0Iik7CiAgICAgICAgJHJbJ3Jlc2VydmVkX3NhbXBsZSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUICogRlJPTSAkcnQgTElNSVQgMyIsIEFSUkFZX0EpOwogICAgfQogICAgJHJbJ3Jlc2VydmVfZm5fZXhpc3RzJ109ZnVuY3Rpb25fZXhpc3RzKCd3Y19yZXNlcnZlX3N0b2NrX2Zvcl9vcmRlcicpPzE6MDsKICAgICRyWyd3Y192ZXJzaW9uJ109ZGVmaW5lZCgnV0NfVkVSU0lPTicpP1dDX1ZFUlNJT046bnVsbDsKICAgIC8vIGFyIGthcyBub3JzIGZpbHRydW9qYSBpc19pbl9zdG9jawogICAgJHJbJ2ZpbHRlcl9pc19pbl9zdG9jayddPWhhc19maWx0ZXIoJ3dvb2NvbW1lcmNlX3Byb2R1Y3RfaXNfaW5fc3RvY2snKT8xOjA7CiAgICAvLyAzNDUxMiBnaWxlc25pcyB2YWl6ZGFzCiAgICAkcD13Y19nZXRfcHJvZHVjdCgzNDUxMik7CiAgICBpZiAoJHApIHsKICAgICAgICAkclsncDM0NTEyJ109YXJyYXkoCiAgICAgICAgICAnbWFuYWdlX3N0b2NrJz0+JHAtPmdldF9tYW5hZ2Vfc3RvY2soKT8xOjAsCiAgICAgICAgICAnc3RvY2tfcXR5Jz0+JHAtPmdldF9zdG9ja19xdWFudGl0eSgpLAogICAgICAgICAgJ3N0b2NrX3N0YXR1cyc9PiRwLT5nZXRfc3RvY2tfc3RhdHVzKCksCiAgICAgICAgICAnYmFja29yZGVycyc9PiRwLT5nZXRfYmFja29yZGVycygpLAogICAgICAgICAgJ2lzX2luX3N0b2NrJz0+JHAtPmlzX2luX3N0b2NrKCk/MTowLAogICAgICAgICAgJ21ldGFfc3RvY2tfc3RhdHVzJz0+Z2V0X3Bvc3RfbWV0YSgzNDUxMiwnX3N0b2NrX3N0YXR1cycsdHJ1ZSksCiAgICAgICAgICAnbWV0YV9zdG9jayc9PmdldF9wb3N0X21ldGEoMzQ1MTIsJ19zdG9jaycsdHJ1ZSksCiAgICAgICAgICAnbWV0YV9tYW5hZ2UnPT5nZXRfcG9zdF9tZXRhKDM0NTEyLCdfbWFuYWdlX3N0b2NrJyx0cnVlKSwKICAgICAgICAgICd2Zl9xdHknPT5nZXRfcG9zdF9tZXRhKDM0NTEyLCdfdmZfcXR5Jyx0cnVlKSwKICAgICAgICAgICd6Yl9xdHknPT5nZXRfcG9zdF9tZXRhKDM0NTEyLCdfemJfcXR5Jyx0cnVlKSwKICAgICAgICApOwogICAgfQogICAgbm9jYWNoZV9oZWFkZXJzKCk7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1NMQVNIRVN8SlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0sIDEpOwo=','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP Stock Reserve Dump v1',code:php,scope:'global',active:true}));
for(let i=0;i<4&&!sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(sid){
  sh('sleep 4');
  const d=sh('curl -sSk "'+SITE+'/?ps_st=St5r"');
  try{O.dry=JSON.parse(d.out);}catch(e){O.dry_raw=d.out.slice(0,500);}
  const a=sh('curl -sSk "'+SITE+'/?ps_st=St5r"');
  try{O.apply=JSON.parse(a.out);}catch(e){O.apply_raw=a.out.slice(0,500);}
  fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
  sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
  // sanity: ar svetaine gyva po deploy
  sh('sleep 3');
  O.site_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
  O.account_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/my-account/"').out.trim();
}
putB64('st.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
