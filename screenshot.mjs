import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function putB64(n,b){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:80e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b,...(s?{sha:s}:{})}));
  const c=execSync('curl -sk -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:80e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
function sh(c){try{const o=execSync(c+' 2>&1; echo "__RC:$?"',{maxBuffer:50e6,shell:'/bin/bash'}).toString();
 const m=o.match(/__RC:(\d+)\s*$/);return{rc:m?+m[1]:-1,out:o.replace(/__RC:\d+\s*$/,'')};}catch(e){return{rc:-99,out:String(e).slice(0,300)};}}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={}; let sid=null;
// ★ Senu TEMP snippet'u valymas — kitaip senas atsako i ta pati rakta.
try{
  const ls=sh('curl -sSk '+AUTH+' "'+API+'?per_page=100"');
  const arr=JSON.parse(ls.out); const off=[];
  for(const s0 of arr){ if(s0.name && s0.name.indexOf('TEMP')===0 && s0.active){
    fs.writeFileSync('/tmp/off.json',JSON.stringify({active:false}));
    sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/off.json "'+API+'/'+s0.id+'"');
    off.push(s0.id+':'+s0.name); } }
  O.deaktyvuota_TEMP=off;
}catch(e){ O.valymo_klaida=String(e).slice(0,200); }
const php=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgRHJhZnQgUmVjb24gdjEKICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgICBpZiAoICEgaXNzZXQoJF9HRVRbJ3BzX2RyNiddKSB8fCAkX0dFVFsncHNfZHI2J10gIT09ICdEcjZ0NCcgKSByZXR1cm47CiAgICBub2NhY2hlX2hlYWRlcnMoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAgIGdsb2JhbCAkd3BkYjsKICAgICRyID0gYXJyYXkoJ1ZFUlNJSkEnPT4nZHJhZnQtcmVjb24tdjEnKTsKCiAgICAvLyAxKSBwc19wZXRzIHNjaGVtYSArIGFyIHlyYSBkcmFmdC9hbm9uaW1pbml1IGVpbHVjaXUKICAgICR0ID0gJHdwZGItPnByZWZpeC4ncHNfcGV0cyc7CiAgICAkclsncGV0c19zY2hlbWEnXSA9ICR3cGRiLT5nZXRfY29sKCJTSE9XIENPTFVNTlMgRlJPTSAkdCIpOwogICAgJHJbJ3BldHNfc3RhdHVzYWknXSA9ICR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHN0YXR1cywgQ09VTlQoKikgYyBGUk9NICR0IEdST1VQIEJZIHN0YXR1cyIsIEFSUkFZX0EpOwogICAgJHJbJ3BldHNfdXNlcjAnXSA9IChpbnQpICR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSAkdCBXSEVSRSB1c2VyX2lkPTAgT1IgdXNlcl9pZCBJUyBOVUxMIik7CgogICAgLy8gMikgSlM6IGthcyB2eWtzdGEgcGF0ZWlrdXMgZWwuIHBhc3RhCiAgICAkanMgPSBmaWxlX2dldF9jb250ZW50cyhXUF9QTFVHSU5fRElSLicvcGV0c2hvcC1jb3JlL2Fzc2V0cy9wZXQtZm9ybS5qcycpOwogICAgJHJbJ2pzX2R5ZGlzJ10gPSBzdHJsZW4oJGpzKTsKICAgIGZvcmVhY2ggKGFycmF5KCdzdWJtaXRQcm9maWxlJywnc2F2ZURyYWZ0JywnZHJhZnRfaWQnLCdtYWdpYycsJ2VtYWlsJywnc2VuZE1hZ2ljJywnZmV0Y2goJykgYXMgJG4pIHsKICAgICAgICAkclsnanNfa2FydGFpJ11bJG5dID0gc3Vic3RyX2NvdW50KCRqcywgJG4pOwogICAgfQogICAgJGkgPSBzdHJwb3MoJGpzLCAnZnVuY3Rpb24gc3VibWl0UHJvZmlsZScpOwogICAgJHJbJ2pzX3N1Ym1pdCddID0gJGkhPT1mYWxzZSA/IHN1YnN0cigkanMsICRpLCAyNjAwKSA6ICduZXJhc3RhJzsKCiAgICAvLyAzKSBSRVNUIG1hcnNydXRhaSwgc3VzaWplIHN1IGF1Z2ludGluaWFpcy9kcmFmdGFpcwogICAgJHJvdXRlcyA9IHJlc3RfZ2V0X3NlcnZlcigpLT5nZXRfcm91dGVzKCk7CiAgICAkclsncmVzdCddID0gYXJyYXkoKTsKICAgIGZvcmVhY2ggKCRyb3V0ZXMgYXMgJHJvdXRlPT4kaCkgewogICAgICAgIGlmIChzdHJwb3MoJHJvdXRlLCdwZXRzaG9wJykhPT1mYWxzZSB8fCBzdHJwb3MoJHJvdXRlLCdwZXQnKSE9PWZhbHNlKSB7ICRyWydyZXN0J11bXSA9ICRyb3V0ZTsgfQogICAgfQogICAgZWNobyB3cF9qc29uX2VuY29kZSgkciwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsKICAgIGV4aXQ7Cn0pOwo=','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP Draft Recon v1',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('draft_recon.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
const a=sh('curl -sSk -m 60 "'+SITE+'/?ps_dr6=Dr6t4"');
let A=null; try{A=JSON.parse(a.out);}catch(e){O.auth_raw=a.out.slice(0,800);}
O.clean = A;

fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
O.site=sh('curl -sSk -m 25 -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
putB64('draft_recon.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
