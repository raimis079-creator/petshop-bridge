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
// pirma deaktyvuoti visus senus TEMP Consent Sig snippetus
try{
  const l=sh('curl -sSk '+AUTH+' "'+API+'?per_page=100"').out;
  const arr=JSON.parse(l);
  O.deactivated=[];
  for(const x of arr){
    if(/TEMP Consent Sig/i.test(x.name||'') && x.active){
      fs.writeFileSync('/tmp/d0.json',JSON.stringify({active:false}));
      sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/d0.json "'+API+'/'+x.id+'"');
      O.deactivated.push(x.id);
    }
  }
}catch(e){ O.deact_err=String(e).slice(0,150); }
const php=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgQ29uc2VudCBTaWduYXR1cmUgdjEKICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgICBpZiAoICEgaXNzZXQoJF9HRVRbJ3BzX2NnJ10pIHx8ICRfR0VUWydwc19jZyddICE9PSAnQ2c4bScgKSByZXR1cm47CiAgICBnbG9iYWwgJHdwZGI7ICRyPWFycmF5KCk7CiAgICAkZj1uZXcgUmVmbGVjdGlvbkZ1bmN0aW9uKCdwc19zZXRfbWFya2V0aW5nX2NvbnNlbnQnKTsKICAgICRwcz1hcnJheSgpOyBmb3JlYWNoKCRmLT5nZXRQYXJhbWV0ZXJzKCkgYXMgJHApICRwc1tdPSckJy4kcC0+Z2V0TmFtZSgpLigkcC0+aXNPcHRpb25hbCgpPyc9b3B0JzonJyk7CiAgICAkclsnc2lnJ109aW1wbG9kZSgnLCAnLCRwcyk7CiAgICAkbGluZXM9ZmlsZSgkZi0+Z2V0RmlsZU5hbWUoKSk7CiAgICAkclsnYm9keSddPWltcGxvZGUoJycsYXJyYXlfc2xpY2UoJGxpbmVzLCRmLT5nZXRTdGFydExpbmUoKS0xLG1pbigyMCwkZi0+Z2V0RW5kTGluZSgpLSRmLT5nZXRTdGFydExpbmUoKSsxKSkpOwogICAgLy8gQ29uc2VudF9Mb2c6OnJlY29yZCAvIGN1cnJlbnRfdmFsdWUKICAgIGZvcmVhY2ggKGFycmF5KCdyZWNvcmQnLCdjdXJyZW50X3ZhbHVlJywnc2V0JykgYXMgJG0pIHsKICAgICAgICBpZiAobWV0aG9kX2V4aXN0cygnUGV0c2hvcF9Db25zZW50X0xvZycsJG0pKSB7CiAgICAgICAgICAgICRybT1uZXcgUmVmbGVjdGlvbk1ldGhvZCgnUGV0c2hvcF9Db25zZW50X0xvZycsJG0pOwogICAgICAgICAgICAkcHA9YXJyYXkoKTsgZm9yZWFjaCgkcm0tPmdldFBhcmFtZXRlcnMoKSBhcyAkcCkgJHBwW109JyQnLiRwLT5nZXROYW1lKCkuKCRwLT5pc09wdGlvbmFsKCk/Jz1vcHQnOicnKTsKICAgICAgICAgICAgJGwyPWZpbGUoJHJtLT5nZXRGaWxlTmFtZSgpKTsKICAgICAgICAgICAgJHJbJ2xvZ18nLiRtXT1hcnJheSgnc2lnJz0+aW1wbG9kZSgnLCAnLCRwcCksCiAgICAgICAgICAgICAgJ2JvZHknPT5pbXBsb2RlKCcnLGFycmF5X3NsaWNlKCRsMiwkcm0tPmdldFN0YXJ0TGluZSgpLTEsbWluKDIyLCRybS0+Z2V0RW5kTGluZSgpLSRybS0+Z2V0U3RhcnRMaW5lKCkrMSkpKSk7CiAgICAgICAgfQogICAgfQogICAgLy8gZ3l2YXMgdGVzdGFzCiAgICAkRT0nY29uc2VudC1zaWdAZXhhbXBsZS5jb20nOwogICAgJGN0PSR3cGRiLT5wcmVmaXguJ3BzX2NvbnNlbnRfbG9nJzsKICAgICR3cGRiLT5xdWVyeSgkd3BkYi0+cHJlcGFyZSgiREVMRVRFIEZST00gJGN0IFdIRVJFIGVtYWlsPSVzIiwkRSkpOwogICAgcHNfc2V0X21hcmtldGluZ19jb25zZW50KCRFLHRydWUsJ3QxJywwKTsKICAgICRyWydwb190cnVlJ109YXJyYXkoJ2dldCc9PnBzX2dldF9tYXJrZXRpbmdfY29uc2VudCgkRSksJ3RpcGFzJz0+Z2V0dHlwZShwc19nZXRfbWFya2V0aW5nX2NvbnNlbnQoJEUpKSk7CiAgICBwc19zZXRfbWFya2V0aW5nX2NvbnNlbnQoJEUsZmFsc2UsJ3QyJywwKTsKICAgICRyWydwb19mYWxzZSddPWFycmF5KCdnZXQnPT5wc19nZXRfbWFya2V0aW5nX2NvbnNlbnQoJEUpLCd0aXBhcyc9PmdldHR5cGUocHNfZ2V0X21hcmtldGluZ19jb25zZW50KCRFKSkpOwogICAgJHJbJ3Jvd3MnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoIlNFTEVDVCAqIEZST00gJGN0IFdIRVJFIGVtYWlsPSVzIE9SREVSIEJZIGlkIERFU0MgTElNSVQgNCIsJEUpLCBBUlJBWV9BKTsKICAgICR3cGRiLT5xdWVyeSgkd3BkYi0+cHJlcGFyZSgiREVMRVRFIEZST00gJGN0IFdIRVJFIGVtYWlsPSVzIiwkRSkpOwogICAgbm9jYWNoZV9oZWFkZXJzKCk7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1NMQVNIRVN8SlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0sIDEpOwo=','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP Consent Sig Dump v1',code:php,scope:'global',active:true}));
for(let i=0;i<4&&!sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(sid){
  sh('sleep 4');
  const d=sh('curl -sSk "'+SITE+'/?ps_cg=Cg8m"');
  try{O.dry=JSON.parse(d.out);}catch(e){O.dry_raw=d.out.slice(0,500);}
  const a=sh('curl -sSk "'+SITE+'/?ps_cg=Cg8m"');
  try{O.apply=JSON.parse(a.out);}catch(e){O.apply_raw=a.out.slice(0,500);}
  fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
  sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
  // sanity: ar svetaine gyva po deploy
  sh('sleep 3');
  O.site_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
  O.account_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/my-account/"').out.trim();
}
putB64('csig.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
