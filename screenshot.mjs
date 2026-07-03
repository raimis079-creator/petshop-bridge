import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'tir',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbtir.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbtir.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:45000}); }catch(e){ return 'EXC:'+e.message; } }
const pcode=Buffer.from("YWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCgkX0dFVFsncHNjX3RpcGFzcmVjb24nXSA/PyAnJykgIT09ICcxJykgcmV0dXJuOwogIGlmICgoJF9HRVRbJ2snXSA/PyAnJykgIT09ICdwczIwMjYnICYmICFjdXJyZW50X3VzZXJfY2FuKCdtYW5hZ2Vfb3B0aW9ucycpKSByZXR1cm47CiAgJHEgPSBuZXcgV1BfUXVlcnkoYXJyYXkoJ3Bvc3RfdHlwZSc9Pidwcm9kdWN0JywncG9zdF9zdGF0dXMnPT4ncHVibGlzaCcsJ3Bvc3RzX3Blcl9wYWdlJz0+LTEsJ2ZpZWxkcyc9PidpZHMnLAogICAgJ3RheF9xdWVyeSc9PmFycmF5KGFycmF5KCd0YXhvbm9teSc9Pidwcm9kdWN0X2NhdCcsJ2ZpZWxkJz0+J3Rlcm1faWQnLCd0ZXJtcyc9PjEwNikpLCdub19mb3VuZF9yb3dzJz0+dHJ1ZSkpOwogICRpZHMgPSAkcS0+cG9zdHM7IHdwX3Jlc2V0X3Bvc3RkYXRhKCk7CiAgJG91dD1hcnJheSgpOwogIGZvcmVhY2goJGlkcyBhcyAkcGlkKXsKICAgICRwPXdjX2dldF9wcm9kdWN0KCRwaWQpOwogICAgaWYoISRwKSBjb250aW51ZTsKICAgICRzaG9ydCA9IHdwX3N0cmlwX2FsbF90YWdzKCRwLT5nZXRfc2hvcnRfZGVzY3JpcHRpb24oKSk7CiAgICAkb3V0W109YXJyYXkoCiAgICAgICdpZCc9PiRwaWQsJ3NrdSc9PiRwLT5nZXRfc2t1KCksJ25hbWUnPT4kcC0+Z2V0X25hbWUoKSwKICAgICAgJ3Nob3J0Jz0+bWJfc3Vic3RyKCRzaG9ydCwwLDEyMCksCiAgICAgICdleGlzdGluZ190aXBhcyc9PndwX2dldF9wb3N0X3Rlcm1zKCRwaWQsJ3BhX3RpcGFzJyxhcnJheSgnZmllbGRzJz0+J25hbWVzJykpCiAgICApOwogIH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvdXQpOyBleGl0Owp9KTsK",'base64').toString('utf8').trim();
(async()=>{
  fs.writeFileSync('/tmp/b557.json', JSON.stringify({name:'PSC TIPASRECON', code:pcode, scope:'global', active:true}));
  exec('curl -sk -m 20 -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/b557.json "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  var r=exec('curl -sk -m 40 "'+BASE+'/?psc_tipasrecon=1&k=ps2026"');
  var m=r.match(/(\[.*\])/s); commit('tipas_recon.json', m?m[0]:(r||'').slice(0,600)); console.log('matched',!!m,'len',r.length);
  exec('curl -sk -m 20 -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
})();
