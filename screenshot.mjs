import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
const PHP=Buffer.from("YWRkX2FjdGlvbigid3BfbG9hZGVkIiwgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWyJjbXAyIl0pIHx8ICRfR0VUWyJjbXAyIl0gIT09ICJwczIwMjYiKSByZXR1cm47CiAgLy8gQkFDS1VQIE1haXN0byBfZmlsdGVycwogICRtYWlzdG8gPSBnZXRfcG9zdF9tZXRhKDM0MDYzLCAiX2ZpbHRlcnMiLCB0cnVlKTsKICB1cGRhdGVfb3B0aW9uKCJwZXRzaG9wX21haXN0b19maWx0ZXJzX2JhY2t1cCIsICRtYWlzdG8sIGZhbHNlKTsKICAvLyBQaWxuYXMgdmVpa2lhbmNpbyBTYW1wdW51IGZpbHRyb1swXSArIE1haXN0byBmaWx0cm9bMV0gcGFseWdpbmltYXMKICAkc2FtcHVudSA9IGdldF9wb3N0X21ldGEoMzQxMDcsICJfZmlsdGVycyIsIHRydWUpOwogICRyID0gYXJyYXkoKTsKICAkclsiYmFja3VwX3NhdmVkIl0gPSBpc19hcnJheSgkbWFpc3RvKSA/IGNvdW50KCRtYWlzdG8pIDogMDsKICAkclsic2FtcHVudV93b3JraW5nX2ZpbHRlcjAiXSA9IGlzX2FycmF5KCRzYW1wdW51KSAmJiBjb3VudCgkc2FtcHVudSk+MCA/ICRzYW1wdW51WzBdIDogbnVsbDsKICAkclsibWFpc3RvX2Jyb2tlbl9maWx0ZXIxIl0gPSBpc19hcnJheSgkbWFpc3RvKSAmJiBjb3VudCgkbWFpc3RvKT4xID8gJG1haXN0b1sxXSA6IG51bGw7CiAgLy8gYXIgZmlsdHJhaSB5cmEgb2JqZWt0YWkgYXIgbWFzeXZhaT8KICAkclsibWFpc3RvX2ZpbHRlcl90eXBlIl0gPSBpc19hcnJheSgkbWFpc3RvKSAmJiBjb3VudCgkbWFpc3RvKT4wID8gZ2V0dHlwZSgkbWFpc3RvWzBdKSA6ICI/IjsKICAkclsic2FtcHVudV9maWx0ZXJfdHlwZSJdID0gaXNfYXJyYXkoJHNhbXB1bnUpICYmIGNvdW50KCRzYW1wdW51KT4wID8gZ2V0dHlwZSgkc2FtcHVudVswXSkgOiAiPyI7CiAgJHVwID0gd3BfdXBsb2FkX2RpcigpOwogIGZpbGVfcHV0X2NvbnRlbnRzKCR1cFsiYmFzZWRpciJdLiIvY21wMl9yZXN1bHQuanNvbiIsIHdwX2pzb25fZW5jb2RlKCRyKSk7CiAgd3BfZGllKCJDTVAyX0RPTkUiKTsKfSk7","base64").toString("utf8");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'c2',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function api(path,method,obj){ let cmd='curl -sk -u "$WPU:$WPP" -H "Content-Type: application/json" '; if(method) cmd+='-X '+method+' '; if(obj){ fs.writeFileSync('/tmp/body.json', JSON.stringify(obj)); cmd+='-d @/tmp/body.json '; } cmd+='"'+DEV+path+'"'; try{ return execSync(cmd,{encoding:'utf8',maxBuffer:20000000,timeout:60000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; }}
function get(path){ try{ return execSync('curl -sk -u "$WPU:$WPP" --max-time 40 "'+DEV+path+'"',{encoding:'utf8',maxBuffer:20000000,timeout:45000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }
const out={};
const c=api('/wp-json/code-snippets/v1/snippets','POST',{name:'TEMP cmp2',code:PHP,scope:'global',active:false});
let sid=0,err=''; try{ const j=JSON.parse(c); sid=j.id; err=j.code_error||''; }catch(e){ err='parse'; }
out.sid=sid; out.err=err;
if(sid && !err){
  api('/wp-json/code-snippets/v1/snippets/'+sid,'PUT',{active:true});
  get('/?cmp2=ps2026');
  out.result=get('/wp-content/uploads/cmp2_result.json').slice(0,6000);
  api('/wp-json/code-snippets/v1/snippets/'+sid,'DELETE');
}
putFile('runcmp2.json',JSON.stringify(out));
