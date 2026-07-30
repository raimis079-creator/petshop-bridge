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
// pirma deaktyvuoti visus senus TEMP Child fx snippetus
try{
  const l=sh('curl -sSk '+AUTH+' "'+API+'?per_page=100"').out;
  const arr=JSON.parse(l);
  O.deactivated=[];
  for(const x of arr){
    if(/TEMP Child fx/i.test(x.name||'') && x.active){
      fs.writeFileSync('/tmp/d0.json',JSON.stringify({active:false}));
      sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/d0.json "'+API+'/'+x.id+'"');
      O.deactivated.push(x.id);
    }
  }
}catch(e){ O.deact_err=String(e).slice(0,150); }
const php=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgQ2hpbGQgZnVuY3Rpb25zLnBocCBSZWFkIHYxCiAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogICAgaWYgKCAhIGlzc2V0KCRfR0VUWydwc19meCddKSB8fCAkX0dFVFsncHNfZngnXSAhPT0gJ0Z4N2MnICkgcmV0dXJuOwogICAgJHAgPSBnZXRfc3R5bGVzaGVldF9kaXJlY3RvcnkoKS4nL2Z1bmN0aW9ucy5waHAnOwogICAgJGMgPSBmaWxlX2dldF9jb250ZW50cygkcCk7CiAgICAkciA9IGFycmF5KCdzaXplJz0+c3RybGVuKCRjKSwnc2hhJz0+c3Vic3RyKGhhc2goJ3NoYTI1NicsJGMpLDAsMTYpKTsKICAgICRsaW5lcyA9IGV4cGxvZGUoIlxuIiwkYyk7CiAgICAvLyByYW5kYW0gYmxva3VzIHN1IHRyYWNraW5nCiAgICAkbWFya3M9YXJyYXkoKTsKICAgIGZvcmVhY2ggKCRsaW5lcyBhcyAkaT0+JGxuKSB7CiAgICAgICAgaWYgKHByZWdfbWF0Y2goJyNzaXVudG9zLXNla2ltYXN8c2l1bnR1LXNla2ltYXN8U2l1bnRvcyBzZWtpbWFzfGVtYWlsX2JlZm9yZV9vcmRlcl90YWJsZXxlbWFpbF9hZnRlcl9vcmRlcl90YWJsZXxjdXN0b21lcl9jb21wbGV0ZWQjaScsJGxuKSkgewogICAgICAgICAgICAkbWFya3NbXT0kaTsKICAgICAgICB9CiAgICB9CiAgICAkcmFuZ2VzPWFycmF5KCk7CiAgICBmb3JlYWNoICgkbWFya3MgYXMgJG0pIHsKICAgICAgICAkZnJvbT1tYXgoMCwkbS0yNSk7ICR0bz1taW4oY291bnQoJGxpbmVzKS0xLCRtKzE1KTsKICAgICAgICAkcmFuZ2VzW109YXJyYXkoJGZyb20sJHRvKTsKICAgIH0KICAgIC8vIHN1anVuZ2lhbSBwZXJzaWRlbmdpYW5jaXVzCiAgICAkbWVyZ2VkPWFycmF5KCk7CiAgICBmb3JlYWNoICgkcmFuZ2VzIGFzICRyZykgewogICAgICAgIGlmICgkbWVyZ2VkICYmICRyZ1swXSA8PSBlbmQoJG1lcmdlZClbMV0rMykgeyAkbWVyZ2VkW2NvdW50KCRtZXJnZWQpLTFdWzFdPW1heChlbmQoJG1lcmdlZClbMV0sJHJnWzFdKTsgfQogICAgICAgIGVsc2UgJG1lcmdlZFtdPSRyZzsKICAgIH0KICAgICRvdXQ9YXJyYXkoKTsKICAgIGZvcmVhY2ggKCRtZXJnZWQgYXMgJHJnKSB7CiAgICAgICAgJHNuaXA9YXJyYXkoKTsKICAgICAgICBmb3IgKCRpPSRyZ1swXTskaTw9JHJnWzFdOyRpKyspICRzbmlwW109KCRpKzEpLic6ICcuJGxpbmVzWyRpXTsKICAgICAgICAkb3V0W109aW1wbG9kZSgiXG4iLCRzbmlwKTsKICAgIH0KICAgICRyWydibG9ja3MnXT0kb3V0OwogICAgJHJbJ2I2NCddPWJhc2U2NF9lbmNvZGUoJGMpOwogICAgbm9jYWNoZV9oZWFkZXJzKCk7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1NMQVNIRVN8SlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0sIDEpOwo=','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP Child fx Dump v1',code:php,scope:'global',active:true}));
for(let i=0;i<4&&!sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(sid){
  sh('sleep 4');
  const d=sh('curl -sSk "'+SITE+'/?ps_fx=Fx7c"');
  try{O.dry=JSON.parse(d.out);}catch(e){O.dry_raw=d.out.slice(0,500);}
  const a=sh('curl -sSk "'+SITE+'/?ps_fx=Fx7c"');
  try{O.apply=JSON.parse(a.out);}catch(e){O.apply_raw=a.out.slice(0,500);}
  fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
  sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
  // sanity: ar svetaine gyva po deploy
  sh('sleep 3');
  O.site_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
  O.account_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/my-account/"').out.trim();
}
putB64('fx.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
