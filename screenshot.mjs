import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'menu',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbm.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbm.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000}); }catch(e){ return 'EXC:'+e.message; } }
const code=Buffer.from("YWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCgkX0dFVFsncHNjX21lbnUnXSA/PyAnJykgIT09ICcxJykgcmV0dXJuOwogIGlmICgoJF9HRVRbJ2snXSA/PyAnJykgIT09ICdwczIwMjYnICYmICFjdXJyZW50X3VzZXJfY2FuKCdtYW5hZ2Vfb3B0aW9ucycpKSByZXR1cm47CiAgJG1lbnVzPXdwX2dldF9uYXZfbWVudXMoKTsKICAkb3V0PWFycmF5KCdtZW51cyc9PmFycmF5KCkpOwogIGZvcmVhY2goJG1lbnVzIGFzICRtbil7CiAgICAkaXRlbXM9d3BfZ2V0X25hdl9tZW51X2l0ZW1zKCRtbi0+dGVybV9pZCk7CiAgICAkbGlzdD1hcnJheSgpOwogICAgaWYoJGl0ZW1zKSBmb3JlYWNoKCRpdGVtcyBhcyAkaXQpewogICAgICAkbGlzdFtdPWFycmF5KCdpZCc9PiRpdC0+SUQsJ3RpdGxlJz0+JGl0LT50aXRsZSwndXJsJz0+JGl0LT51cmwsJ3BhcmVudCc9PiRpdC0+bWVudV9pdGVtX3BhcmVudCwnb3JkZXInPT4kaXQtPm1lbnVfb3JkZXIsJ3R5cGUnPT4kaXQtPnR5cGUsJ29iamVjdCc9PiRpdC0+b2JqZWN0LCdvYmplY3RfaWQnPT4kaXQtPm9iamVjdF9pZCk7CiAgICB9CiAgICAkb3V0WydtZW51cyddW109YXJyYXkoJ25hbWUnPT4kbW4tPm5hbWUsJ3NsdWcnPT4kbW4tPnNsdWcsJ3Rlcm1faWQnPT4kbW4tPnRlcm1faWQsJ2NvdW50Jz0+Y291bnQoJGxpc3QpLCdpdGVtcyc9PiRsaXN0KTsKICB9CiAgLy8gbWVuaXUgdmlldG9zIChsb2NhdGlvbnMpCiAgJG91dFsnbG9jYXRpb25zJ109Z2V0X25hdl9tZW51X2xvY2F0aW9ucygpOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG91dCk7IGV4aXQ7Cn0pOwo=",'base64').toString('utf8').trim();
(async()=>{
  fs.writeFileSync('/tmp/b557.json', JSON.stringify({name:'PSC MENU', code:code, scope:'global', active:true}));
  exec('curl -sk -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/b557.json "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  var r=exec('curl -sk "'+BASE+'/?psc_menu=1&k=ps2026"');
  var m=r.match(/(\{.*\})/s); commit('menu.json', m?m[0]:r.slice(0,500)); console.log((m?m[0]:r).slice(0,100));
  exec('curl -sk -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
})();
