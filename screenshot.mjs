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
// pirma deaktyvuoti visus senus TEMP Cart Inventory snippetus
try{
  const l=sh('curl -sSk '+AUTH+' "'+API+'?per_page=100"').out;
  const arr=JSON.parse(l);
  O.deactivated=[];
  for(const x of arr){
    if(/TEMP Cart Inventory/i.test(x.name||'') && x.active){
      fs.writeFileSync('/tmp/d0.json',JSON.stringify({active:false}));
      sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/d0.json "'+API+'/'+x.id+'"');
      O.deactivated.push(x.id);
    }
  }
}catch(e){ O.deact_err=String(e).slice(0,150); }
const php=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgQ2FydCBJbnZlbnRvcnkgdjEKICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgICBpZiAoICEgaXNzZXQoJF9HRVRbJ3BzX2NhcnQnXSkgfHwgJF9HRVRbJ3BzX2NhcnQnXSAhPT0gJ0NyN3YnICkgcmV0dXJuOwogICAgZ2xvYmFsICR3cGRiOyAkcj1hcnJheSgpOwoKICAgIC8vIDEpIFdDIHNlc2lqdSBsZW50ZWxlCiAgICAkc3Q9JHdwZGItPnByZWZpeC4nd29vY29tbWVyY2Vfc2Vzc2lvbnMnOwogICAgJHJbJ3Nlc3Npb25zX3RhYmxlJ109KCR3cGRiLT5nZXRfdmFyKCJTSE9XIFRBQkxFUyBMSUtFICckc3QnIik9PT0kc3QpOwogICAgaWYgKCRyWydzZXNzaW9uc190YWJsZSddKSB7CiAgICAgICAgJHJbJ3Nlc3Npb25zX2NvbHMnXT0kd3BkYi0+Z2V0X2NvbCgiU0hPVyBDT0xVTU5TIEZST00gJHN0Iik7CiAgICAgICAgJHJbJ3Nlc3Npb25zX2NvdW50J109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJHN0Iik7CiAgICAgICAgJHJbJ3Nlc3Npb25zX2FjdGl2ZSddPShpbnQpJHdwZGItPmdldF92YXIoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICRzdCBXSEVSRSBzZXNzaW9uX2V4cGlyeSA+ICVkIiwgdGltZSgpKSk7CiAgICAgICAgJHJvdz0kd3BkYi0+Z2V0X3JvdygiU0VMRUNUICogRlJPTSAkc3QgT1JERVIgQlkgc2Vzc2lvbl9pZCBERVNDIExJTUlUIDEiLCBBUlJBWV9BKTsKICAgICAgICBpZiAoJHJvdykgewogICAgICAgICAgICAkdmFsPW1heWJlX3Vuc2VyaWFsaXplKCRyb3dbJ3Nlc3Npb25fdmFsdWUnXSk7CiAgICAgICAgICAgICRrZXlzPWlzX2FycmF5KCR2YWwpP2FycmF5X2tleXMoJHZhbCk6YXJyYXkoKTsKICAgICAgICAgICAgJHJbJ3NhbXBsZV9rZXlzJ109JGtleXM7CiAgICAgICAgICAgICRyWydzYW1wbGVfa2V5J109JHJvd1snc2Vzc2lvbl9rZXknXTsKICAgICAgICAgICAgJHJbJ3NhbXBsZV9leHBpcnknXT1kYXRlKCdZLW0tZCBIOmknLChpbnQpJHJvd1snc2Vzc2lvbl9leHBpcnknXSk7CiAgICAgICAgICAgIC8vIGFyIHlyYSBjYXJ0IGlyIGN1c3RvbWVyIGVtYWlsCiAgICAgICAgICAgIGlmIChpc19hcnJheSgkdmFsKSkgewogICAgICAgICAgICAgICAgJGNhcnQgPSBpc3NldCgkdmFsWydjYXJ0J10pID8gbWF5YmVfdW5zZXJpYWxpemUoJHZhbFsnY2FydCddKSA6IG51bGw7CiAgICAgICAgICAgICAgICAkclsnc2FtcGxlX2NhcnRfaXRlbXMnXT1pc19hcnJheSgkY2FydCk/Y291bnQoJGNhcnQpOjA7CiAgICAgICAgICAgICAgICAkY3VzdCA9IGlzc2V0KCR2YWxbJ2N1c3RvbWVyJ10pID8gbWF5YmVfdW5zZXJpYWxpemUoJHZhbFsnY3VzdG9tZXInXSkgOiBudWxsOwogICAgICAgICAgICAgICAgaWYgKGlzX2FycmF5KCRjdXN0KSkgewogICAgICAgICAgICAgICAgICAgICRyWydzYW1wbGVfY3VzdG9tZXJfZmllbGRzJ109YXJyYXlfa2V5cygkY3VzdCk7CiAgICAgICAgICAgICAgICAgICAgJHJbJ3NhbXBsZV9oYXNfZW1haWwnXT0hZW1wdHkoJGN1c3RbJ2VtYWlsJ10pPzE6MDsKICAgICAgICAgICAgICAgIH0KICAgICAgICAgICAgfQogICAgICAgIH0KICAgIH0KICAgIC8vIDIpIHBlcnNpc3RlbnQgY2FydCAocHJpc2lqdW5ndXNpZW1zKQogICAgJHJbJ3BlcnNpc3RlbnRfY2FydHMnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCR3cGRiLT5wcmVwYXJlKAogICAgICAgICJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHdwZGItPnVzZXJtZXRhfSBXSEVSRSBtZXRhX2tleT0lcyIsICdfd29vY29tbWVyY2VfcGVyc2lzdGVudF9jYXJ0XzEnKSk7CgogICAgLy8gMykgYXIgeXJhIGFiYW5kb25lZCBjYXJ0IHBsdWdpbgogICAgaWYgKCAhIGZ1bmN0aW9uX2V4aXN0cygnZ2V0X3BsdWdpbnMnKSApIHJlcXVpcmVfb25jZSBBQlNQQVRILid3cC1hZG1pbi9pbmNsdWRlcy9wbHVnaW4ucGhwJzsKICAgICRhbGw9Z2V0X3BsdWdpbnMoKTsgJGFjdD0oYXJyYXkpZ2V0X29wdGlvbignYWN0aXZlX3BsdWdpbnMnKTsgJGFjPWFycmF5KCk7CiAgICBmb3JlYWNoICgkYWN0IGFzICRwKXsgJG49aXNzZXQoJGFsbFskcF1bJ05hbWUnXSk/JGFsbFskcF1bJ05hbWUnXTokcDsKICAgICAgICBpZiAocHJlZ19tYXRjaCgnI2FiYW5kb258Y2FydHxyZWNvdmVyI2knLCRwLicgJy4kbikpICRhY1tdPSRuOyB9CiAgICAkclsnY2FydF9wbHVnaW5zJ109JGFjOwoKICAgIC8vIDQpIGt1ciBnYXVuYW1hcyBlbC4gcGFzdGFzIOKAlCBjaGVja291dCBsYXVrYWkKICAgICRyWydjaGVja291dF9lbWFpbF9ob29rcyddPWFycmF5KAogICAgICAgICd3b29jb21tZXJjZV9jaGVja291dF91cGRhdGVfb3JkZXJfcmV2aWV3Jz0+aGFzX2FjdGlvbignd29vY29tbWVyY2VfY2hlY2tvdXRfdXBkYXRlX29yZGVyX3JldmlldycpPzE6MCwKICAgICAgICAnd29vY29tbWVyY2VfYWZ0ZXJfY2hlY2tvdXRfdmFsaWRhdGlvbic9Pmhhc19hY3Rpb24oJ3dvb2NvbW1lcmNlX2FmdGVyX2NoZWNrb3V0X3ZhbGlkYXRpb24nKT8xOjAsCiAgICApOwogICAgLy8gYXIgeXJhIG11c3UgZW1pdHRlcmlzCiAgICAkclsnY2FydF9hYmFuZG9uZWRfZW1pdHRlciddPSAoYm9vbCkgcHJlZ19tYXRjaCgnI2NhcnRfYWJhbmRvbmVkIycsCiAgICAgICAgQGZpbGVfZ2V0X2NvbnRlbnRzKFdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWNvcmUvaW5jbHVkZXMvY2xhc3MtZXZlbnQtZW1pdHRlcnMucGhwJykgPzogJycpOwogICAgLy8gc2NoZW1hCiAgICAkc2Q9V1BfUExVR0lOX0RJUi4nL3BldHNob3AtY29yZS9zY2hlbWFzL2V2ZW50cy9jYXJ0X2FiYW5kb25lZC5zY2hlbWEuanNvbic7CiAgICAkclsnc2NoZW1hX2V4aXN0cyddPWZpbGVfZXhpc3RzKCRzZCk7CiAgICBpZiAoJHJbJ3NjaGVtYV9leGlzdHMnXSkgJHJbJ3NjaGVtYSddPWpzb25fZGVjb2RlKGZpbGVfZ2V0X2NvbnRlbnRzKCRzZCksdHJ1ZSk7CgogICAgLy8gNSkgYXIgZGlzcGF0Y2ggdHVyaSBjYXJ0X2FiYW5kb25lZCBzcmF1dGUKICAgIGlmIChjbGFzc19leGlzdHMoJ1BldHNob3BfRW1haWxfRGlzcGF0Y2gnKSkgewogICAgICAgICRmPVBldHNob3BfRW1haWxfRGlzcGF0Y2g6OmZsb3dzKCk7CiAgICAgICAgJHJbJ2Zsb3dfY2ZnJ109aXNzZXQoJGZbJ2NhcnRfYWJhbmRvbmVkJ10pPyRmWydjYXJ0X2FiYW5kb25lZCddOiduZXJhJzsKICAgIH0KICAgIG5vY2FjaGVfaGVhZGVycygpOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICAgZWNobyB3cF9qc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9TTEFTSEVTfEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LCAxKTsK','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP Cart Inventory Dump v1',code:php,scope:'global',active:true}));
for(let i=0;i<4&&!sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(sid){
  sh('sleep 4');
  const d=sh('curl -sSk "'+SITE+'/?ps_cart=Cr7v"');
  try{O.dry=JSON.parse(d.out);}catch(e){O.dry_raw=d.out.slice(0,500);}
  const a=sh('curl -sSk "'+SITE+'/?ps_cart=Cr7v"');
  try{O.apply=JSON.parse(a.out);}catch(e){O.apply_raw=a.out.slice(0,500);}
  fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
  sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
  // sanity: ar svetaine gyva po deploy
  sh('sleep 3');
  O.site_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
  O.account_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/my-account/"').out.trim();
}
putB64('cart.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
