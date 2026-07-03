import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'bd',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbbd.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbbd.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:30000}); }catch(e){ return 'EXC:'+e.message; } }
const pcode=Buffer.from("YWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCgkX0dFVFsncHNjX2JyZGlhZyddID8/ICcnKSAhPT0gJzEnKSByZXR1cm47CiAgaWYgKCgkX0dFVFsnayddID8/ICcnKSAhPT0gJ3BzMjAyNicgJiYgIWN1cnJlbnRfdXNlcl9jYW4oJ21hbmFnZV9vcHRpb25zJykpIHJldHVybjsKICAkb3V0PWFycmF5KCk7CiAgZ2xvYmFsICR3cGRiOyAkdD0kd3BkYi0+cHJlZml4LidzbmlwcGV0cyc7CiAgJHJvdyA9ICR3cGRiLT5nZXRfcm93KCJTRUxFQ1QgaWQsIG5hbWUsIGFjdGl2ZSwgc2NvcGUsIGNvZGUgRlJPTSAkdCBXSEVSRSBpZD01NjQiKTsKICAkb3V0WydpZCddPSRyb3ctPmlkOyAkb3V0WydhY3RpdmUnXT0kcm93LT5hY3RpdmU7ICRvdXRbJ3Njb3BlJ109JHJvdy0+c2NvcGU7CiAgJG91dFsnY29kZV9oYXNfaG9vayddPSAoc3RycG9zKCRyb3ctPmNvZGUsJ3dvb2NvbW1lcmNlX3Byb2R1Y3RfcXVlcnknKSE9PWZhbHNlKT8neWVzJzonbm8nOwogIC8vIGFyIGhvb2snYXMgd29vY29tbWVyY2VfcHJvZHVjdF9xdWVyeSB0dXJpIG3Fq3PFsyBjYWxsYmFjaz8KICBnbG9iYWwgJHdwX2ZpbHRlcjsKICAkb3V0Wyd3cHFfaG9va3MnXT1hcnJheSgpOwogIGlmKGlzc2V0KCR3cF9maWx0ZXJbJ3dvb2NvbW1lcmNlX3Byb2R1Y3RfcXVlcnknXSkpewogICAgZm9yZWFjaCgkd3BfZmlsdGVyWyd3b29jb21tZXJjZV9wcm9kdWN0X3F1ZXJ5J10tPmNhbGxiYWNrcyBhcyAkcHJpbz0+JGNicyl7CiAgICAgICRvdXRbJ3dwcV9ob29rcyddW109J3ByaW9yaXR5ICcuJHByaW8uJzogJy5jb3VudCgkY2JzKS4nIGNhbGxiYWNrcyc7CiAgICB9CiAgfSBlbHNlIHsgJG91dFsnd3BxX2hvb2tzJ109J0hPT0sgTkVFR1pJU1RVT0pBJzsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG91dCk7IGV4aXQ7Cn0pOwo=",'base64').toString('utf8').trim();
(async()=>{
  fs.writeFileSync('/tmp/b557.json', JSON.stringify({name:'PSC BRDIAG', code:pcode, scope:'global', active:true}));
  exec('curl -sk -m 20 -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/b557.json "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  var r=exec('curl -sk -m 25 "'+BASE+'/?psc_brdiag=1&k=ps2026"');
  var m=r.match(/(\{.*\})/s); commit('bridge_diag.json', m?m[0]:(r||'').slice(0,400));
  exec('curl -sk -m 20 -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  console.log(m?m[0]:r);
})();
