import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
const PHP=Buffer.from("YWRkX2FjdGlvbigid3BfbG9hZGVkIiwgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWyJyYXdmIl0pIHx8ICRfR0VUWyJyYXdmIl0gIT09ICJwczIwMjYiKSByZXR1cm47CiAgJGZpbHRlcnMgPSBnZXRfcG9zdF9tZXRhKDM0MDYzLCAiX2ZpbHRlcnMiLCB0cnVlKTsKICAkciA9IGFycmF5KCJjb3VudCI9PmlzX2FycmF5KCRmaWx0ZXJzKT9jb3VudCgkZmlsdGVycyk6MCwgInJhd19maXJzdF90d28iPT5hcnJheSgpKTsKICBpZihpc19hcnJheSgkZmlsdGVycykpewogICAgJGk9MDsKICAgIGZvcmVhY2goJGZpbHRlcnMgYXMgJGYpewogICAgICBpZigkaTwzKXsgJHJbInJhd19maXJzdF90d28iXVtdPSRmOyB9CiAgICAgICRpKys7CiAgICB9CiAgfQogIC8vIHRhaXAgcGF0IHZlaWtpYW5jaW8gcHJlc2V0byBwdnogKMWgYW1wxatuxbMgMzQxMDcpIHBhbHlnaW5pbXVpCiAgJHNoYW1wb28gPSBnZXRfcG9zdF9tZXRhKDM0MTA3LCAiX2ZpbHRlcnMiLCB0cnVlKTsKICBpZihpc19hcnJheSgkc2hhbXBvbykgJiYgY291bnQoJHNoYW1wb28pPjApewogICAgJHJbIndvcmtpbmdfc2hhbXBvb19maXJzdCJdPSRzaGFtcG9vWzBdOwogIH0KICAkdXAgPSB3cF91cGxvYWRfZGlyKCk7CiAgZmlsZV9wdXRfY29udGVudHMoJHVwWyJiYXNlZGlyIl0uIi9yYXdmX3Jlc3VsdC5qc29uIiwgd3BfanNvbl9lbmNvZGUoJHIpKTsKICB3cF9kaWUoIlJBV0ZfRE9ORSIpOwp9KTs=","base64").toString("utf8");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'rf',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function api(path,method,obj){ let cmd='curl -sk -u "$WPU:$WPP" -H "Content-Type: application/json" '; if(method) cmd+='-X '+method+' '; if(obj){ fs.writeFileSync('/tmp/body.json', JSON.stringify(obj)); cmd+='-d @/tmp/body.json '; } cmd+='"'+DEV+path+'"'; try{ return execSync(cmd,{encoding:'utf8',maxBuffer:20000000,timeout:60000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; }}
function get(path){ try{ return execSync('curl -sk -u "$WPU:$WPP" --max-time 40 "'+DEV+path+'"',{encoding:'utf8',maxBuffer:20000000,timeout:45000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }
const out={};
const c=api('/wp-json/code-snippets/v1/snippets','POST',{name:'TEMP rawf',code:PHP,scope:'global',active:false});
let sid=0,err=''; try{ const j=JSON.parse(c); sid=j.id; err=j.code_error||''; }catch(e){ err='parse'; }
out.sid=sid; out.err=err;
if(sid && !err){
  api('/wp-json/code-snippets/v1/snippets/'+sid,'PUT',{active:true});
  get('/?rawf=ps2026');
  out.result=get('/wp-content/uploads/rawf_result.json').slice(0,6000);
  api('/wp-json/code-snippets/v1/snippets/'+sid,'DELETE');
}
putFile('runrawf.json',JSON.stringify(out));
