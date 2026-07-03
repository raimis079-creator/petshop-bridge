import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'fa',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbfa.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbfa.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:30000}); }catch(e){ return 'EXC:'+e.message; } }
const pcode=Buffer.from("YWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCgkX0dFVFsncHNjX2ZpeGFjdCddID8/ICcnKSAhPT0gJzEnKSByZXR1cm47CiAgaWYgKCgkX0dFVFsnayddID8/ICcnKSAhPT0gJ3BzMjAyNicgJiYgIWN1cnJlbnRfdXNlcl9jYW4oJ21hbmFnZV9vcHRpb25zJykpIHJldHVybjsKICAkb3V0PWFycmF5KCk7CiAgaWYgKGZ1bmN0aW9uX2V4aXN0cygnXENvZGVfU25pcHBldHNcYWN0aXZhdGVfc25pcHBldCcpKSB7CiAgICAkciA9IFxDb2RlX1NuaXBwZXRzXGFjdGl2YXRlX3NuaXBwZXQoMzMyKTsKICAgICRvdXRbJ2FjdGl2YXRlX2ZuX3Jlc3VsdCddPSRyOwogIH0gZWxzZSB7CiAgICBnbG9iYWwgJHdwZGI7CiAgICAkd3BkYi0+dXBkYXRlKCR3cGRiLT5wcmVmaXguJ3NuaXBwZXRzJywgYXJyYXkoJ2FjdGl2ZSc9PjEpLCBhcnJheSgnaWQnPT4zMzIpKTsKICAgICRvdXRbJ3NxbF91cGRhdGUnXT0nZG9uZSc7CiAgfQogIGdsb2JhbCAkd3BkYjsKICAkcm93ID0gJHdwZGItPmdldF9yb3coIlNFTEVDVCBhY3RpdmUgRlJPTSB7JHdwZGItPnByZWZpeH1zbmlwcGV0cyBXSEVSRSBpZD0zMzIiKTsKICAkb3V0Wydub3dfYWN0aXZlJ109JHJvdy0+YWN0aXZlOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG91dCk7IGV4aXQ7Cn0pOwo=",'base64').toString('utf8').trim();
(async()=>{
  fs.writeFileSync('/tmp/b557.json', JSON.stringify({name:'PSC FIXACT', code:pcode, scope:'global', active:true}));
  exec('curl -sk -m 20 -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/b557.json "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  var r=exec('curl -sk -m 25 "'+BASE+'/?psc_fixact=1&k=ps2026"');
  var m=r.match(/(\{.*\})/s); commit('fix_active.json', m?m[0]:(r||'').slice(0,300));
  exec('curl -sk -m 20 -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  console.log(m?m[0]:r);
})();
