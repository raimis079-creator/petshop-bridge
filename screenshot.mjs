import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'vp',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbvp.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbvp.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:35000}); }catch(e){ return 'EXC:'+e.message; } }
const pcode=Buffer.from("YWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCgkX0dFVFsncHNjX3ZwcmVzZXQnXSA/PyAnJykgIT09ICcxJykgcmV0dXJuOwogIGlmICgoJF9HRVRbJ2snXSA/PyAnJykgIT09ICdwczIwMjYnICYmICFjdXJyZW50X3VzZXJfY2FuKCdtYW5hZ2Vfb3B0aW9ucycpKSByZXR1cm47CiAgJGZpbHRlcnMgPSBnZXRfcG9zdF9tZXRhKDM0MTAzLCdfZmlsdGVycycsdHJ1ZSk7CiAgJG91dCA9IGFycmF5KCdrZXlzJz0+YXJyYXlfa2V5cygkZmlsdGVycykpOwogIGlmIChpc3NldCgkZmlsdGVyc1s0XSkpICRvdXRbJ2Jsb2NrNCddID0gYXJyYXkoJ3RpdGxlJz0+JGZpbHRlcnNbNF1bJ3RpdGxlJ10sJ3RheG9ub215Jz0+JGZpbHRlcnNbNF1bJ3RheG9ub215J10pOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG91dCk7IGV4aXQ7Cn0pOwo=",'base64').toString('utf8').trim();
(async()=>{
  fs.writeFileSync('/tmp/b557.json', JSON.stringify({name:'PSC VPRESET', code:pcode, scope:'global', active:true}));
  exec('curl -sk -m 20 -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/b557.json "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  var r=exec('curl -sk -m 25 "'+BASE+'/?psc_vpreset=1&k=ps2026"');
  var m=r.match(/(\{.*\})/s); commit('verify_preset.json', m?m[0]:(r||'').slice(0,400)); console.log(m?m[0]:r);
  exec('curl -sk -m 20 -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
})();
