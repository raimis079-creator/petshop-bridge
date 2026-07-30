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
// pirma deaktyvuoti visus senus TEMP Dispatch Recon snippetus
try{
  const l=sh('curl -sSk '+AUTH+' "'+API+'?per_page=100"').out;
  const arr=JSON.parse(l);
  O.deactivated=[];
  for(const x of arr){
    if(/TEMP Dispatch Recon/i.test(x.name||'') && x.active){
      fs.writeFileSync('/tmp/d0.json',JSON.stringify({active:false}));
      sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/d0.json "'+API+'/'+x.id+'"');
      O.deactivated.push(x.id);
    }
  }
}catch(e){ O.deact_err=String(e).slice(0,150); }
const php=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgRGlzcGF0Y2ggUmVjb24gdjEKICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgICBpZiAoICEgaXNzZXQoJF9HRVRbJ3BzX3JkMiddKSB8fCAkX0dFVFsncHNfcmQyJ10gIT09ICdSZDh4JyApIHJldHVybjsKICAgIGdsb2JhbCAkd3BkYjsgJHI9YXJyYXkoKTsKICAgICR3YW50ID0gYXJyYXkoCiAgICAgICdwZXRzaG9wLWVzcC9pbmNsdWRlcy9jbGFzcy1zZW5kZXItYWRhcHRlci5waHAnLAogICAgICAncGV0c2hvcC1lc3AvcGV0c2hvcC1lc3AucGhwJywKICAgICAgJ3BldHNob3AtY29yZS9pbmNsdWRlcy9jbGFzcy1ldmVudC1yZWdpc3RyeS5waHAnLAogICAgICAncGV0c2hvcC1jb3JlL2luY2x1ZGVzL2NsYXNzLXJldHJ5LXF1ZXVlLnBocCcsCiAgICAgICdwZXRzaG9wLWNvcmUvaW5jbHVkZXMvY2xhc3MtY29uc2VudC1zeW5jLnBocCcsCiAgICApOwogICAgZm9yZWFjaCAoJHdhbnQgYXMgJHcpIHsKICAgICAgICAkcCA9IFdQX1BMVUdJTl9ESVIuJy8nLiR3OwogICAgICAgICRyWydmaWxlcyddWyR3XSA9IGZpbGVfZXhpc3RzKCRwKQogICAgICAgICAgPyBhcnJheSgnc2l6ZSc9PmZpbGVzaXplKCRwKSwnYjY0Jz0+YmFzZTY0X2VuY29kZShmaWxlX2dldF9jb250ZW50cygkcCkpKQogICAgICAgICAgOiBhcnJheSgnbWlzc2luZyc9PnRydWUpOwogICAgfQogICAgLy8gZXZlbnRfbG9nIHNjaGVtYQogICAgJHQ9JHdwZGItPnByZWZpeC4ncHNfZXZlbnRfbG9nJzsKICAgICRyWydldmVudF9sb2dfc2NoZW1hJ109JHdwZGItPmdldF9yZXN1bHRzKCJTSE9XIENPTFVNTlMgRlJPTSBgJHRgIiwgQVJSQVlfQSk7CiAgICAvLyBhciB5cmEgYXNfIChBY3Rpb24gU2NoZWR1bGVyKQogICAgJHJbJ2FjdGlvbl9zY2hlZHVsZXInXT1mdW5jdGlvbl9leGlzdHMoJ2FzX2VucXVldWVfYXN5bmNfYWN0aW9uJyk/MTowOwogICAgLy8gcGV0c2hvcC1jb3JlLnBocCBib290c3RyYXAgKGthZCB6aW5vdHVtZSBrdXIgcmVnaXN0cnVvdGkgbmF1amEga2xhc2UpCiAgICAkYnA9V1BfUExVR0lOX0RJUi4nL3BldHNob3AtY29yZS9wZXRzaG9wLWNvcmUucGhwJzsKICAgICRyWydjb3JlX2Jvb3RzdHJhcF9iNjQnXT1iYXNlNjRfZW5jb2RlKGZpbGVfZ2V0X2NvbnRlbnRzKCRicCkpOwogICAgbm9jYWNoZV9oZWFkZXJzKCk7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLCBKU09OX1VORVNDQVBFRF9TTEFTSEVTfEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LCAxKTsK','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP Dispatch Recon Dump v1',code:php,scope:'global',active:true}));
for(let i=0;i<4&&!sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(sid){
  sh('sleep 4');
  const d=sh('curl -sSk "'+SITE+'/?ps_rd2=Rd8x"');
  try{O.dry=JSON.parse(d.out);}catch(e){O.dry_raw=d.out.slice(0,500);}
  const a=sh('curl -sSk "'+SITE+'/?ps_rd2=Rd8x"');
  try{O.apply=JSON.parse(a.out);}catch(e){O.apply_raw=a.out.slice(0,500);}
  fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
  sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
  // sanity: ar svetaine gyva po deploy
  sh('sleep 3');
  O.site_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
  O.account_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/my-account/"').out.trim();
}
putB64('rd2.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
