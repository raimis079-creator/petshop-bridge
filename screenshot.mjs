import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
const PHP=Buffer.from("YWRkX2FjdGlvbigid3BfbG9hZGVkIiwgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWyJyZWdlbiJdKSB8fCAkX0dFVFsicmVnZW4iXSAhPT0gInBzMjAyNiIpIHJldHVybjsKICAkbG9nID0gYXJyYXkoKTsKICAvLyAxLiBwYXRpa3JpbmFtIGdldF90ZXJtcyBWRUlLSUEgY2lhICh3cF9sb2FkZWQsIG5lIGluaXQpCiAgZm9yZWFjaChhcnJheSgicGFfYmVfZ3J1ZHUiLCJwYV9zcGVjaWFsaV9taXR5YmEiLCJwYV9tb25vcHJvdGVpbiIpIGFzICR0YXgpewogICAgJHRlcm1zID0gZ2V0X3Rlcm1zKGFycmF5KCJ0YXhvbm9teSI9PiR0YXgsImhpZGVfZW1wdHkiPT5mYWxzZSkpOwogICAgaWYoaXNfd3BfZXJyb3IoJHRlcm1zKSl7ICRsb2dbImdldHRlcm1zXyIuJHRheF09IkVSUk9SOiIuJHRlcm1zLT5nZXRfZXJyb3JfbWVzc2FnZSgpOyB9CiAgICBlbHNlIHsgJGxvZ1siZ2V0dGVybXNfIi4kdGF4XT1jb3VudCgkdGVybXMpLiIgdGVybXM6ICIuaW1wbG9kZSgiLCIsYXJyYXlfbWFwKGZ1bmN0aW9uKCR0KXtyZXR1cm4gJHQtPm5hbWUuIigiLiR0LT5jb3VudC4iKSI7fSxhcnJheV9zbGljZSgkdGVybXMsMCw0KSkpOyB9CiAgfQogIC8vIDIuIGFyIHRha3Nvbm9taWphIHJlZ2lzdHJ1b3RhPwogIGZvcmVhY2goYXJyYXkoInBhX2JlX2dydWR1IiwicGFfc3BlY2lhbGlfbWl0eWJhIiwicGFfbW9ub3Byb3RlaW4iKSBhcyAkdGF4KXsKICAgICRsb2dbInJlZ2lzdGVyZWRfIi4kdGF4XSA9IHRheG9ub215X2V4aXN0cygkdGF4KSA/ICJZRVMiIDogIk5PIjsKICB9CiAgLy8gMy4gUkVHRU5FUlVPSkFNIGxvb2t1cCBsZW50ZWxlIHBlciBXQyBEYXRhUmVnZW5lcmF0b3IKICBpZihjbGFzc19leGlzdHMoIlxcQXV0b21hdHRpY1xcV29vQ29tbWVyY2VcXEludGVybmFsXFxQcm9kdWN0QXR0cmlidXRlc0xvb2t1cFxcRGF0YVJlZ2VuZXJhdG9yIikpewogICAgdHJ5IHsKICAgICAgJHJlZ2VuID0gd2NfZ2V0X2NvbnRhaW5lcigpLT5nZXQoXEF1dG9tYXR0aWNcV29vQ29tbWVyY2VcSW50ZXJuYWxcUHJvZHVjdEF0dHJpYnV0ZXNMb29rdXBcRGF0YVJlZ2VuZXJhdG9yOjpjbGFzcyk7CiAgICAgICRyZWdlbi0+aW5pdGlhdGVfcmVnZW5lcmF0aW9uKCk7CiAgICAgICRsb2dbInJlZ2VuX2luaXRpYXRlZCJdID0gdHJ1ZTsKICAgIH0gY2F0Y2goRXhjZXB0aW9uICRlKXsgJGxvZ1sicmVnZW5fZXJyIl09JGUtPmdldE1lc3NhZ2UoKTsgfQogIH0gZWxzZSB7ICRsb2dbInJlZ2VuZXJhdG9yX2NsYXNzIl09Im5vdF9mb3VuZCI7IH0KICAkdXAgPSB3cF91cGxvYWRfZGlyKCk7CiAgZmlsZV9wdXRfY29udGVudHMoJHVwWyJiYXNlZGlyIl0uIi9yZWdlbl9yZXN1bHQuanNvbiIsIHdwX2pzb25fZW5jb2RlKCRsb2cpKTsKICB3cF9kaWUoIlJFR0VOX0RPTkUiKTsKfSk7","base64").toString("utf8");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'rg',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function api(path,method,obj){ let cmd='curl -sk -u "$WPU:$WPP" -H "Content-Type: application/json" '; if(method) cmd+='-X '+method+' '; if(obj){ fs.writeFileSync('/tmp/body.json', JSON.stringify(obj)); cmd+='-d @/tmp/body.json '; } cmd+='"'+DEV+path+'"'; try{ return execSync(cmd,{encoding:'utf8',maxBuffer:20000000,timeout:90000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; }}
function get(path){ try{ return execSync('curl -sk -u "$WPU:$WPP" --max-time 60 "'+DEV+path+'"',{encoding:'utf8',maxBuffer:20000000,timeout:65000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }
const out={};
const c=api('/wp-json/code-snippets/v1/snippets','POST',{name:'TEMP regen',code:PHP,scope:'global',active:false});
let sid=0,err=''; try{ const j=JSON.parse(c); sid=j.id; err=j.code_error||''; }catch(e){ err='parse'; }
out.sid=sid; out.err=err;
if(sid && !err){
  api('/wp-json/code-snippets/v1/snippets/'+sid,'PUT',{active:true});
  get('/?regen=ps2026');
  out.result=get('/wp-content/uploads/regen_result.json').slice(0,2000);
  api('/wp-json/code-snippets/v1/snippets/'+sid,'DELETE');
}
putFile('runregen.json',JSON.stringify(out));
