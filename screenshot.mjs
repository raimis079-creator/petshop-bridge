import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'pg',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbpg.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbpg.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:30000}); }catch(e){ return 'EXC'; } }
const pcode=Buffer.from("YWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCgkX0dFVFsncHNjX3B1cmdlJ10gPz8gJycpICE9PSAnMScpIHJldHVybjsKICBpZiAoKCRfR0VUWydrJ10gPz8gJycpICE9PSAncHMyMDI2JyAmJiAhY3VycmVudF91c2VyX2NhbignbWFuYWdlX29wdGlvbnMnKSkgcmV0dXJuOwogICRvdXQ9YXJyYXkoKTsKICAkYWN0aXZlPShhcnJheSlnZXRfb3B0aW9uKCdhY3RpdmVfcGx1Z2lucycpOwogICRvdXRbJ2NhY2hlX3BsdWdpbnMnXT1hcnJheV92YWx1ZXMoYXJyYXlfZmlsdGVyKCRhY3RpdmUsIGZ1bmN0aW9uKCRwKXsgcmV0dXJuIHN0cmlwb3MoJHAsJ2NhY2hlJykhPT1mYWxzZXx8c3RyaXBvcygkcCwnbGl0ZXNwZWVkJykhPT1mYWxzZXx8c3RyaXBvcygkcCwncm9ja2V0JykhPT1mYWxzZXx8c3RyaXBvcygkcCwndzMtdG90YWwnKSE9PWZhbHNlOyB9KSk7CiAgaWYgKGZ1bmN0aW9uX2V4aXN0cygnd3BfY2FjaGVfZmx1c2gnKSkgeyB3cF9jYWNoZV9mbHVzaCgpOyAkb3V0Wyd3cF9jYWNoZV9mbHVzaCddPTE7IH0KICAvLyBMaXRlU3BlZWQgKHBsdWdpbiArIHNlcnZlcmlvIExTQ2FjaGUgcGVyIGFjdGlvbikKICBkb19hY3Rpb24oJ2xpdGVzcGVlZF9wdXJnZV9hbGwnKTsKICBpZiAoY2xhc3NfZXhpc3RzKCdMaXRlU3BlZWRcUHVyZ2UnKSkgeyAkb3V0WydsaXRlc3BlZWQnXT0nY2xhc3MgeXJhJzsgfQogIC8vIFdQIFJvY2tldAogIGlmIChmdW5jdGlvbl9leGlzdHMoJ3JvY2tldF9jbGVhbl9kb21haW4nKSkgeyByb2NrZXRfY2xlYW5fZG9tYWluKCk7ICRvdXRbJ3JvY2tldCddPTE7IH0KICAvLyBXM1RDCiAgaWYgKGZ1bmN0aW9uX2V4aXN0cygndzN0Y19mbHVzaF9hbGwnKSkgeyB3M3RjX2ZsdXNoX2FsbCgpOyAkb3V0Wyd3M3RjJ109MTsgfQogIC8vIFdQIFN1cGVyIENhY2hlCiAgaWYgKGZ1bmN0aW9uX2V4aXN0cygnd3BfY2FjaGVfY2xlYXJfY2FjaGUnKSkgeyB3cF9jYWNoZV9jbGVhcl9jYWNoZSgpOyAkb3V0WydzdXBlcmNhY2hlJ109MTsgfQogIC8vIExTQ2FjaGUgc2VydmVyaW8gcHVyZ2UgaGVhZGVyIChqZWkgc2VydmVyaXMgTGl0ZVNwZWVkKQogIEBoZWFkZXIoJ1gtTGl0ZVNwZWVkLVB1cmdlOiAqJyk7CiAgJG91dFsnZG9uZSddPTE7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZSgkb3V0KTsgZXhpdDsKfSk7Cg==",'base64').toString('utf8').trim();
(async()=>{
  var out={};
  // pirmiausia — cache headers ant kategorijos
  out.headers=exec('curl -sk -m 15 -I "'+BASE+'/kategorija/sunims/skanestai-sunims/" | grep -iE "x-litespeed|x-cache|cache-control|age|x-lsadc" | head -8');
  fs.writeFileSync('/tmp/b557.json', JSON.stringify({name:'PSC PURGE', code:pcode, scope:'global', active:true}));
  exec('curl -sk -m 20 -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/b557.json "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  var r=exec('curl -sk -m 20 "'+BASE+'/?psc_purge=1&k=ps2026"');
  var m=r.match(/(\{.*\})/s); out.purge=m?JSON.parse(m[0]):((r||'').slice(0,150));
  exec('curl -sk -m 20 -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  commit('purge.json', JSON.stringify(out)); console.log(JSON.stringify(out).slice(0,300));
})();
