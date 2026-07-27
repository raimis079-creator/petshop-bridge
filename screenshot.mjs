import { execSync } from 'child_process';
import fs from 'fs';
const PHPB64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3JrJ10pIHx8ICRfR0VUWydwc19yayddIT09J1JreCcpIHJldHVybjsKICBnbG9iYWwgJHdwZGI7ICRvPWFycmF5KCk7CiAgJHBpZD0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgSUQgRlJPTSB7JHdwZGItPnBvc3RzfSBXSEVSRSBwb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwb3N0X3N0YXR1cz0ncHVibGlzaCcgQU5EIHBvc3RfdGl0bGUgTElLRSAnJUdyYW5DYXJubyByaW5raW55cyUnIExJTUlUIDEiKTsKICBpZighJHBpZCkgJHBpZD0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgSUQgRlJPTSB7JHdwZGItPnBvc3RzfSBXSEVSRSBwb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwb3N0X3N0YXR1cz0ncHVibGlzaCcgQU5EIHBvc3RfdGl0bGUgTElLRSAnJXJpbmtpbnlzJScgQU5EIHBvc3RfdGl0bGUgTElLRSAnJW5pbW9uZGElJyBMSU1JVCAxIik7CiAgJG9bJ3BpZCddPSRwaWQ7CiAgaWYoJHBpZCl7CiAgICAkcD13Y19nZXRfcHJvZHVjdCgkcGlkKTsKICAgICRvWyduYW1lJ109JHA/JHAtPmdldF9uYW1lKCk6bnVsbDsKICAgICRvWyd0eXBlJ109JHA/JHAtPmdldF90eXBlKCk6bnVsbDsKICAgIC8vIFZJU09TIHRha3Nvbm9taWpvcwogICAgJHJvd3M9JHdwZGItPmdldF9yZXN1bHRzKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgdHQudGF4b25vbXksdC5uYW1lIEZST00geyR3cGRiLT50ZXJtX3JlbGF0aW9uc2hpcHN9IHRyCiAgICAgIEpPSU4geyR3cGRiLT50ZXJtX3RheG9ub215fSB0dCBPTiB0dC50ZXJtX3RheG9ub215X2lkPXRyLnRlcm1fdGF4b25vbXlfaWQKICAgICAgSk9JTiB7JHdwZGItPnRlcm1zfSB0IE9OIHQudGVybV9pZD10dC50ZXJtX2lkIFdIRVJFIHRyLm9iamVjdF9pZD0lZCBPUkRFUiBCWSB0dC50YXhvbm9teSIsJHBpZCkpOwogICAgJHRheD1hcnJheSgpOyBmb3JlYWNoKCRyb3dzIGFzICRyKXsgJHRheFskci0+dGF4b25vbXldW109JHItPm5hbWU7IH0KICAgICRvWyd0YWtzb25vbWlqb3MnXT0kdGF4OwogICAgJG9bJ2dldF9hdHRyaWJ1dGVfcGFrdW90ZSddPSRwPyRwLT5nZXRfYXR0cmlidXRlKCdwYV9wYWt1b3Rlc19keWRpcycpOm51bGw7CiAgICAkb1snd3BfZ2V0X29iamVjdF90ZXJtcyddPXdwX2dldF9vYmplY3RfdGVybXMoJHBpZCwncGFfcGFrdW90ZXNfZHlkaXMnLGFycmF5KCdmaWVsZHMnPT4nbmFtZXMnKSk7CiAgICAkb1sna2xhc2VfbThfeXJhJ109Y2xhc3NfZXhpc3RzKCdQZXRzaG9wX004X0Zvb2QnKTsKICAgICRvWydwYXJzZV90aWVzaW9naWFpJ109Y2xhc3NfZXhpc3RzKCdQZXRzaG9wX004X0Zvb2QnKSA/IFBldHNob3BfTThfRm9vZDo6cGFyc2VfcGFjaygkcD8kcC0+Z2V0X2F0dHJpYnV0ZSgncGFfcGFrdW90ZXNfZHlkaXMnKTonJykgOiAnTkVSQSBLTEFTRVMnOwogICAgLy8ga2EgZ3JhemluYSBkYXNoYm9hcmQgcGF5bG9hZAogICAgJHJjPW5ldyBSZWZsZWN0aW9uQ2xhc3MoJ1BldHNob3BfUGV0X0Rhc2hib2FyZCcpOwogICAgaWYoJHJjLT5oYXNNZXRob2QoJ3dldF9wcm9kdWN0X2luZm8nKSl7CiAgICAgICRtPSRyYy0+Z2V0TWV0aG9kKCd3ZXRfcHJvZHVjdF9pbmZvJyk7ICRtLT5zZXRBY2Nlc3NpYmxlKHRydWUpOwogICAgICAkb1snd2V0X3Byb2R1Y3RfaW5mbyddPSRtLT5pbnZva2UobnVsbCwkcGlkKTsKICAgIH0gZWxzZSB7ICRvWyd3ZXRfcHJvZHVjdF9pbmZvJ109J01FVE9ETyBORVJBJzsgfQogIH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSk7Cg==';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const U=process.env.WP_USER||'', P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='-u "'+U+':'+P+'"';
function wj(m,path,body){fs.writeFileSync('/tmp/wb.json', JSON.stringify(body));
  return execSync('curl -sk --max-time 120 '+AUTH+' -X '+m+' -H "Content-Type: application/json" --data-binary @/tmp/wb.json "https://dev.avesa.lt/wp-json/'+path+'"',{maxBuffer:50e6,timeout:140000}).toString();}
function putB64(name,b64){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+name;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b64,...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
const o={}; let sid=null;
try{
  const php = Buffer.from(PHPB64,'base64').toString('utf8');
  const mk=wj('POST','code-snippets/v1/snippets',{name:'RK (temp)',code:php,scope:'front-end',active:true,priority:5});
  try{sid=JSON.parse(mk).id;}catch(e){o.mk=String(mk).slice(0,150);}
  execSync('sleep 5');
  try{ const r=execSync('curl -sk --max-time 60 "https://dev.avesa.lt/?ps_rk=Rkx"',{maxBuffer:8e6,timeout:75000}).toString();
    const i=r.indexOf('{'),k=r.lastIndexOf('}'); if(i>=0&&k>i) o.result=JSON.parse(r.slice(i,k+1)); else o.raw=r.slice(0,250); }catch(e){ o.e=String(e).slice(0,100); }
}catch(e){o.err=String(e).slice(0,200);}
try{ if(sid!=null) execSync('curl -sk --max-time 60 '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"'); }catch(e){}
putB64('rink.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
