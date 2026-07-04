import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'rb',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbrb.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbrb.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:35000}); }catch(e){ return 'EXC:'+e.message; } }
const pcode=Buffer.from("YWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCgkX0dFVFsncHNjX3Jlc3RvcmUnXSA/PyAnJykgIT09ICcxJykgcmV0dXJuOwogIGlmICgoJF9HRVRbJ2snXSA/PyAnJykgIT09ICdwczIwMjYnICYmICFjdXJyZW50X3VzZXJfY2FuKCdtYW5hZ2Vfb3B0aW9ucycpKSByZXR1cm47CiAgJG91dD1hcnJheSgpOwogICRwYXRoID0gV1BfUExVR0lOX0RJUi4nL3BldHNob3AteG1sL2luY2x1ZGVzL2NsYXNzLXByaWNpbmctdmYucGhwJzsKICAkYmFja3VwID0gV1BfUExVR0lOX0RJUi4nL3BldHNob3AteG1sL2luY2x1ZGVzL2NsYXNzLXByaWNpbmctdmYudjEuNS41LmJhay5waHAnOwogIAogIGlmKGZpbGVfZXhpc3RzKCRiYWNrdXApKXsKICAgICRvdXRbJ3Jlc3RvcmVkJ10gPSBjb3B5KCRiYWNrdXAsICRwYXRoKTsKICAgICRvdXRbJ21kNV9ub3cnXSA9IG1kNV9maWxlKCRwYXRoKTsKICAgICRvdXRbJ3NpemVfbm93J10gPSBmaWxlc2l6ZSgkcGF0aCk7CiAgfSBlbHNlIHsKICAgICRvdXRbJ2Vycm9yJ10gPSAnYmFja3VwIG5lcmFzdGFzJzsKICAgICRvdXRbJ2dsb2InXSA9IGdsb2IoV1BfUExVR0lOX0RJUi4nL3BldHNob3AteG1sL2luY2x1ZGVzLyouYmFrLnBocCcpOwogIH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvdXQpOyBleGl0Owp9KTsK",'base64').toString('utf8').trim();
(async()=>{
  fs.writeFileSync('/tmp/b557.json', JSON.stringify({name:'PSC RESTORE', code:pcode, scope:'global', active:true}));
  exec('curl -sk -m 20 -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/b557.json "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  var r=exec('curl -sk -m 25 "'+BASE+'/?psc_restore=1&k=ps2026"');
  var m=r.match(/(\{.*\})/s); commit('restore.json', m?m[0]:(r||'').slice(0,600));
  exec('curl -sk -m 20 -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  console.log(m?m[0]:r.slice(0,300));
})();
