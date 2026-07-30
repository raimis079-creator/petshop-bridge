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
// pirma deaktyvuoti visus senus TEMP ESP Inventory snippetus
try{
  const l=sh('curl -sSk '+AUTH+' "'+API+'?per_page=100"').out;
  const arr=JSON.parse(l);
  O.deactivated=[];
  for(const x of arr){
    if(/TEMP ESP Inventory/i.test(x.name||'') && x.active){
      fs.writeFileSync('/tmp/d0.json',JSON.stringify({active:false}));
      sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/d0.json "'+API+'/'+x.id+'"');
      O.deactivated.push(x.id);
    }
  }
}catch(e){ O.deact_err=String(e).slice(0,150); }
const php=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgRVNQIEludmVudG9yeSB2MQogKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAgIGlmICggISBpc3NldCgkX0dFVFsncHNfaW52J10pIHx8ICRfR0VUWydwc19pbnYnXSAhPT0gJ0l2NmgnICkgcmV0dXJuOwogICAgZ2xvYmFsICR3cGRiOwogICAgJHIgPSBhcnJheSgndHMnPT5jdXJyZW50X3RpbWUoJ215c3FsJykpOwoKICAgIC8vIDEpIFBMVUdJTidBSQogICAgaWYgKCAhIGZ1bmN0aW9uX2V4aXN0cygnZ2V0X3BsdWdpbnMnKSApIHJlcXVpcmVfb25jZSBBQlNQQVRILid3cC1hZG1pbi9pbmNsdWRlcy9wbHVnaW4ucGhwJzsKICAgICRhbGw9Z2V0X3BsdWdpbnMoKTsgJGFjdD0oYXJyYXkpZ2V0X29wdGlvbignYWN0aXZlX3BsdWdpbnMnKTsKICAgICRwcz1hcnJheSgpOwogICAgZm9yZWFjaCAoJGFsbCBhcyAkcD0+JGQpIHsKICAgICAgICBpZiAoIHN0cnBvcygkcCwncGV0c2hvcCcpIT09ZmFsc2UgKSB7CiAgICAgICAgICAgICRwc1tdPWFycmF5KCdmaWxlJz0+JHAsJ25hbWUnPT4kZFsnTmFtZSddLCd2ZXInPT4kZFsnVmVyc2lvbiddLCdhY3RpdmUnPT5pbl9hcnJheSgkcCwkYWN0LHRydWUpPzE6MCk7CiAgICAgICAgfQogICAgfQogICAgJHJbJ3BldHNob3BfcGx1Z2lucyddPSRwczsKCiAgICAvLyAyKSBGQUlMQUkga2lla3ZpZW5hbWUgcGV0c2hvcCBwbHVnaW4nZQogICAgJGZpbGVzPWFycmF5KCk7CiAgICBmb3JlYWNoIChnbG9iKFdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLSonLEdMT0JfT05MWURJUikgYXMgJGRpcikgewogICAgICAgICRuPWJhc2VuYW1lKCRkaXIpOyAkbHN0PWFycmF5KCk7CiAgICAgICAgZm9yZWFjaCAoZ2xvYigkZGlyLicvKi5waHAnKSBhcyAkZikgJGxzdFtdPWJhc2VuYW1lKCRmKS4nICgnLmZpbGVzaXplKCRmKS4nKSc7CiAgICAgICAgZm9yZWFjaCAoZ2xvYigkZGlyLicvaW5jbHVkZXMvKi5waHAnKSBhcyAkZikgJGxzdFtdPSdpbmNsdWRlcy8nLmJhc2VuYW1lKCRmKS4nICgnLmZpbGVzaXplKCRmKS4nKSc7CiAgICAgICAgZm9yZWFjaCAoZ2xvYigkZGlyLicvYXNzZXRzLyonKSBhcyAkZikgaWYoaXNfZmlsZSgkZikpICRsc3RbXT0nYXNzZXRzLycuYmFzZW5hbWUoJGYpLicgKCcuZmlsZXNpemUoJGYpLicpJzsKICAgICAgICBmb3JlYWNoIChnbG9iKCRkaXIuJy9zY2hlbWFzL2V2ZW50cy8qJykgYXMgJGYpICRsc3RbXT0nc2NoZW1hcy9ldmVudHMvJy5iYXNlbmFtZSgkZik7CiAgICAgICAgJGZpbGVzWyRuXT0kbHN0OwogICAgfQogICAgJHJbJ3BsdWdpbl9maWxlcyddPSRmaWxlczsKCiAgICAvLyAzKSBNVSBwbHVnaW4nYWkKICAgICRtdT1hcnJheSgpOwogICAgaWYgKGRlZmluZWQoJ1dQTVVfUExVR0lOX0RJUicpICYmIGlzX2RpcihXUE1VX1BMVUdJTl9ESVIpKQogICAgICBmb3JlYWNoIChnbG9iKFdQTVVfUExVR0lOX0RJUi4nLyoucGhwJykgYXMgJGYpICRtdVtdPWJhc2VuYW1lKCRmKS4nICgnLmZpbGVzaXplKCRmKS4nKSc7CiAgICAkclsnbXVfcGx1Z2lucyddPSRtdTsKCiAgICAvLyA0KSBEQiBMRU5URUxFUyBwc18qCiAgICAkdD0kd3BkYi0+Z2V0X2NvbCgiU0hPVyBUQUJMRVMgTElLRSAneyR3cGRiLT5wcmVmaXh9cHNcXyUnIik7CiAgICAkdGFicz1hcnJheSgpOwogICAgZm9yZWFjaCAoKGFycmF5KSR0IGFzICR0bikgewogICAgICAgICRjPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIGAkdG5gIik7CiAgICAgICAgJGNvbHM9JHdwZGItPmdldF9jb2woIlNIT1cgQ09MVU1OUyBGUk9NIGAkdG5gIik7CiAgICAgICAgJHRhYnNbc3RyX3JlcGxhY2UoJHdwZGItPnByZWZpeCwnJywkdG4pXT1hcnJheSgncm93cyc9PiRjLCdjb2xzJz0+Y291bnQoJGNvbHMpKTsKICAgIH0KICAgICRyWydwc190YWJsZXMnXT0kdGFiczsKCiAgICAvLyA1KSBSRVNUIG1hcnNydXRhaSBwZXRzaG9wL3YxCiAgICAkcnQ9YXJyYXkoKTsKICAgIGZvcmVhY2ggKCByZXN0X2dldF9zZXJ2ZXIoKS0+Z2V0X3JvdXRlcygpIGFzICRrPT4kdiApIGlmIChzdHJwb3MoJGssJy9wZXRzaG9wL3YxJyk9PT0wKSAkcnRbXT0kazsKICAgICRyWydyZXN0X3JvdXRlcyddPSRydDsKCiAgICAvLyA2KSBDUk9OCiAgICAkY3I9YXJyYXkoKTsKICAgIGZvcmVhY2ggKChhcnJheSlfZ2V0X2Nyb25fYXJyYXkoKSBhcyAkdHM9PiRob29rcykKICAgICAgICBmb3JlYWNoICgkaG9va3MgYXMgJGhvb2s9PiRkKQogICAgICAgICAgICBpZiAocHJlZ19tYXRjaCgnI3BzX3xwZXRzaG9wfGVzcHxzZW5kZXIjaScsJGhvb2spKSAkY3JbJGhvb2tdPWRhdGUoJ1ktbS1kIEg6aScsJHRzKTsKICAgICRyWydjcm9uJ109JGNyOwoKICAgIC8vIDcpIEZVTktDSUpPUyBpciBLTEFTRVMKICAgICRmbj1hcnJheSgpOwogICAgZm9yZWFjaCAoYXJyYXkoJ3BzX2VtaXRfZXZlbnQnLCdwc19nZW5lcmF0ZV90b2tlbicsJ3BzX3ZlcmlmeV90b2tlbicsJ3BzX2NvbnN1bWVfdG9rZW4nLAogICAgICAgICAgICAgICAgICAgJ3BzX3NldF9tYXJrZXRpbmdfY29uc2VudCcsJ3BzX2dldF9tYXJrZXRpbmdfY29uc2VudCcpIGFzICRmKQogICAgICAgICRmblskZl09ZnVuY3Rpb25fZXhpc3RzKCRmKT8xOjA7CiAgICAkclsncHVibGljX2FwaSddPSRmbjsKICAgICRjbD1hcnJheSgpOwogICAgZm9yZWFjaCAoYXJyYXkoJ1BldHNob3BfRXZlbnRfTG9nJywnUGV0c2hvcF9FU1BfRXZlbnRfTG9nJywnUGV0c2hvcF9FdmVudF9SZWdpc3RyeScsJ1BldHNob3BfQWN0aW9uX1Rva2VucycsCiAgICAgICAgICAgICAgICAgICAnUGV0c2hvcF9Db25zZW50X0xvZycsJ1BldHNob3BfQ29uc2VudF9TeW5jJywnUGV0c2hvcF9SZXRyeV9RdWV1ZScsJ1BldHNob3BfTWFnaWNfTG9naW4nLAogICAgICAgICAgICAgICAgICAgJ1BldHNob3BfU2VuZGVyX0FkYXB0ZXInLCdQZXRzaG9wX1JlZmlsbF9FbmdpbmUnLCdQZXRzaG9wX1JlbWluZGVycycsJ1BldHNob3BfUGV0X1Byb2ZpbGUnKSBhcyAkYykKICAgICAgICAkY2xbJGNdPWNsYXNzX2V4aXN0cygkYyk/MTowOwogICAgJHJbJ2NsYXNzZXMnXT0kY2w7CgogICAgLy8gOCkgRVZFTlQgTE9HIHR1cmlueXMgcGFnYWwgZXZlbnRfbmFtZQogICAgJGVsPSR3cGRiLT5wcmVmaXguJ3BzX2V2ZW50X2xvZyc7CiAgICBpZiAoJHdwZGItPmdldF92YXIoIlNIT1cgVEFCTEVTIExJS0UgJyRlbCciKSkgewogICAgICAgICRyWydldmVudF9sb2dfYnlfbmFtZSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGV2ZW50X25hbWUsIHN0YXR1cywgQ09VTlQoKikgYyBGUk9NIGAkZWxgIEdST1VQIEJZIGV2ZW50X25hbWUsc3RhdHVzIiwgQVJSQVlfQSk7CiAgICAgICAgJHJbJ2V2ZW50X2xvZ19jb2xzJ109JHdwZGItPmdldF9jb2woIlNIT1cgQ09MVU1OUyBGUk9NIGAkZWxgIik7CiAgICB9CgogICAgLy8gOSkgU0VOREVSIC8gRVNQIG9wY2lqb3MgKGJlIHRva2VudSkKICAgICRvPWFycmF5KCk7CiAgICBmb3JlYWNoICgoYXJyYXkpJHdwZGItPmdldF9jb2woIlNFTEVDVCBvcHRpb25fbmFtZSBGUk9NIHskd3BkYi0+b3B0aW9uc30gV0hFUkUgb3B0aW9uX25hbWUgTElLRSAnJXNlbmRlciUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJyVwZXRzaG9wJWVzcCUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJ3BldHNob3BfJSciKSBhcyAkb24pIHsKICAgICAgICBpZiAocHJlZ19tYXRjaCgnI3Rva2VufHNlY3JldHxrZXl8cGFzcyNpJywkb24pKSB7ICRvWyRvbl09JyoqKic7IGNvbnRpbnVlOyB9CiAgICAgICAgJHY9Z2V0X29wdGlvbigkb24pOyAkb1skb25dPWlzX3NjYWxhcigkdik/bWJfc3Vic3RyKChzdHJpbmcpJHYsMCw2MCk6KCdbJy5nZXR0eXBlKCR2KS4nXScpOwogICAgfQogICAgJHJbJ29wdGlvbnMnXT0kbzsKCiAgICAvLyAxMCkgU0NIRU1PUwogICAgJHNkPVdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWNvcmUvc2NoZW1hcy9ldmVudHMvJzsKICAgICRyWydldmVudF9zY2hlbWFzJ109aXNfZGlyKCRzZCk/YXJyYXlfbWFwKCdiYXNlbmFtZScsKGFycmF5KWdsb2IoJHNkLicqJykpOiduZXJhJzsKCiAgICBub2NhY2hlX2hlYWRlcnMoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoJHIsIEpTT05fVU5FU0NBUEVEX1NMQVNIRVN8SlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0sIDEpOwo=','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP ESP Inventory v1',code:php,scope:'global',active:true}));
for(let i=0;i<4&&!sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(sid){
  sh('sleep 4');
  const d=sh('curl -sSk "'+SITE+'/?ps_inv=Iv6h"');
  try{O.dry=JSON.parse(d.out);}catch(e){O.dry_raw=d.out.slice(0,500);}
  const a=sh('curl -sSk "'+SITE+'/?ps_inv=Iv6h"');
  try{O.apply=JSON.parse(a.out);}catch(e){O.apply_raw=a.out.slice(0,500);}
  fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
  sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
  // sanity: ar svetaine gyva po deploy
  sh('sleep 3');
  O.site_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
  O.account_code=sh('curl -sSk -o /dev/null -w "%{http_code}" "'+SITE+'/my-account/"').out.trim();
}
putB64('inv.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
