const S='LyoqCiAqIEZlZWRpbmcgQ2FsYyBSRVNUIHYxIOKAlCBQT1NUIC93cC1qc29uL3BldHNob3AvdjEvZmVlZGluZy1jYWxjCiAqIFXFviBmZWF0dXJlIGZsYWc6IHB1YmxpYyB0aWsga2FpIHBldHNob3BfZmVlZGluZ19jYWxjX2VuYWJsZWQ9MTsgYWRtaW4gdmlzYWRhIChFMkUpLgogKiBLdmllxI1pYSBQZXRzaG9wX0ZlZWRpbmdfU2VydmljZTo6Y2FsYygpLiBGcm9udGVuZGFzIG5pZWtvIG5lc2thacSNaXVvamEuCiAqLwphZGRfYWN0aW9uKCdyZXN0X2FwaV9pbml0JywgZnVuY3Rpb24oKXsKCXJlZ2lzdGVyX3Jlc3Rfcm91dGUoJ3BldHNob3AvdjEnLCAnL2ZlZWRpbmctY2FsYycsIGFycmF5KAoJCSdtZXRob2RzJyAgPT4gJ1BPU1QnLAoJCSdwZXJtaXNzaW9uX2NhbGxiYWNrJyA9PiBmdW5jdGlvbigpewoJCQkkZW5hYmxlZCA9ICggY2xhc3NfZXhpc3RzKCdQZXRzaG9wX0ZlZWRpbmdfU2VydmljZScpICYmIG1ldGhvZF9leGlzdHMoJ1BldHNob3BfRmVlZGluZ19TZXJ2aWNlJywnY2FsY19lbmFibGVkJykgKQoJCQkJPyBQZXRzaG9wX0ZlZWRpbmdfU2VydmljZTo6Y2FsY19lbmFibGVkKCkgOiBmYWxzZTsKCQkJcmV0dXJuICRlbmFibGVkIHx8IGN1cnJlbnRfdXNlcl9jYW4oJ21hbmFnZV9vcHRpb25zJyk7CgkJfSwKCQknY2FsbGJhY2snID0+IGZ1bmN0aW9uKCBXUF9SRVNUX1JlcXVlc3QgJHJlcSApewoJCQlpZiAoICEgY2xhc3NfZXhpc3RzKCdQZXRzaG9wX0ZlZWRpbmdfU2VydmljZScpIHx8ICEgbWV0aG9kX2V4aXN0cygnUGV0c2hvcF9GZWVkaW5nX1NlcnZpY2UnLCdjYWxjJykgKSB7CgkJCQlyZXR1cm4gbmV3IFdQX1JFU1RfUmVzcG9uc2UoYXJyYXkoJ3N0YXR1cyc9PidzeXN0ZW1fZXJyb3InLCdyZWFzb25fY29kZXMnPT5hcnJheSgnU1lTVEVNX0VSUk9SJyksJ21lc3NhZ2VfbHQnPT4nU2lzdGVtb3Mga2xhaWRhLicpLCAyMDApOwoJCQl9CgkJCSRwID0gJHJlcS0+Z2V0X2pzb25fcGFyYW1zKCk7IGlmICggISBpc19hcnJheSgkcCkgKSAkcCA9IGFycmF5KCk7CgkJCSRpbiA9IGFycmF5KAoJCQkJJ3Byb2R1Y3RfaWQnICAgICAgICAgICA9PiBpc3NldCgkcFsncHJvZHVjdF9pZCddKSA/IChpbnQpICRwWydwcm9kdWN0X2lkJ10gOiAwLAoJCQkJJ3dlaWdodF9rZycgICAgICAgICAgICA9PiAoIGlzc2V0KCRwWyd3ZWlnaHRfa2cnXSkgJiYgJHBbJ3dlaWdodF9rZyddICE9PSBudWxsICYmICRwWyd3ZWlnaHRfa2cnXSAhPT0gJycgKSA/IChmbG9hdCkgJHBbJ3dlaWdodF9rZyddIDogbnVsbCwKCQkJCSd3ZWlnaHRfaW50ZXJ2YWxfY29kZScgPT4gaXNzZXQoJHBbJ3dlaWdodF9pbnRlcnZhbF9jb2RlJ10pID8gc2FuaXRpemVfdGV4dF9maWVsZCgoc3RyaW5nKSRwWyd3ZWlnaHRfaW50ZXJ2YWxfY29kZSddKSA6IG51bGwsCgkJCQknYWN0aXZpdHlfY29kZScgICAgICAgID0+IGlzc2V0KCRwWydhY3Rpdml0eV9jb2RlJ10pID8gc2FuaXRpemVfdGV4dF9maWVsZCgoc3RyaW5nKSRwWydhY3Rpdml0eV9jb2RlJ10pIDogbnVsbCwKCQkJCSdzcGVjaWVzX2NvZGUnICAgICAgICAgPT4gaXNzZXQoJHBbJ3NwZWNpZXNfY29kZSddKSA/IHNhbml0aXplX3RleHRfZmllbGQoKHN0cmluZykkcFsnc3BlY2llc19jb2RlJ10pIDogbnVsbCwKCQkJKTsKCQkJcmV0dXJuIG5ldyBXUF9SRVNUX1Jlc3BvbnNlKCBQZXRzaG9wX0ZlZWRpbmdfU2VydmljZTo6Y2FsYygkaW4pLCAyMDAgKTsKCQl9LAoJKSk7Cn0pOwo=';
import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const U=process.env.WP_USER||'', P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='-u "'+U+':'+P+'"';
function post(path,body){fs.writeFileSync('/tmp/wbody.json', JSON.stringify(body));
  return execSync('curl -sk '+AUTH+' -X POST -H "Content-Type: application/json" --data-binary @/tmp/wbody.json "https://dev.avesa.lt/wp-json/'+path+'"',{maxBuffer:50*1024*1024,timeout:70000}).toString();}
function pr(n,ob){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?nocache='+Math.random()+'"').toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:Buffer.from(JSON.stringify(ob)).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"').toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 2'); }return 'fail';}
const o={};
const code=Buffer.from(S,'base64').toString('utf8');
// try create, capture raw
const mk=post('code-snippets/v1/snippets',{name:'Feeding Calc REST v1',code:code,scope:'global',active:true,priority:10});
o.mk_raw=String(mk).slice(0,600);
let id=null; try{id=JSON.parse(mk).id;}catch(e){}
o.id=id;
if(id){ execSync('sleep 3');
  // activate explicitly (kartais reikia)
  try{o.act=post('code-snippets/v1/snippets/'+id,{active:true}).slice(0,120);}catch(e){o.act=String(e).slice(0,120);}
}
execSync('sleep 2');
// probe route (admin)
o.probe=(function(){try{fs.writeFileSync('/tmp/b.json',JSON.stringify({product_id:18014,weight_kg:10,activity_code:'moderate',species_code:'dog'}));
  const r=execSync('curl -sk -w "\n__H%{http_code}" '+AUTH+' -X POST -H "Content-Type: application/json" --data-binary @/tmp/b.json "https://dev.avesa.lt/wp-json/petshop/v1/feeding-calc"',{maxBuffer:5*1024*1024,timeout:40000}).toString();
  const hi=r.lastIndexOf('__H'); return {code:r.slice(hi+3).trim(), body:r.slice(0,hi).slice(0,400)};}catch(e){return{err:String(e).slice(0,200)};}})();
console.log('PUT:',pr('route.json',o));
