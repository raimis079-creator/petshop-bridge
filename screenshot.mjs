import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'mr',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbmr.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbmr.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:20000}); }catch(e){ return 'EXC:'+e.message; } }
const pcode=Buffer.from("YWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCgkX0dFVFsncHNjX21lbnVyZWNvbiddID8/ICcnKSAhPT0gJzEnKSByZXR1cm47CiAgaWYgKCgkX0dFVFsnayddID8/ICcnKSAhPT0gJ3BzMjAyNicgJiYgIWN1cnJlbnRfdXNlcl9jYW4oJ21hbmFnZV9vcHRpb25zJykpIHJldHVybjsKICAkb3V0PWFycmF5KCk7CiAgJGxvY2F0aW9ucyA9IGdldF9uYXZfbWVudV9sb2NhdGlvbnMoKTsKICAkb3V0Wydsb2NhdGlvbnMnXSA9ICRsb2NhdGlvbnM7CiAgJG1lbnVzID0gd3BfZ2V0X25hdl9tZW51cygpOwogICRvdXRbJ21lbnVzJ10gPSBhcnJheSgpOwogIGZvcmVhY2ggKCRtZW51cyBhcyAkbSl7CiAgICAkaXRlbXMgPSB3cF9nZXRfbmF2X21lbnVfaXRlbXMoJG0tPnRlcm1faWQpOwogICAgJHNwcmVuZGltYWlfaXRlbSA9IG51bGw7CiAgICAkYXJyID0gYXJyYXkoKTsKICAgIGZvcmVhY2ggKChhcnJheSkkaXRlbXMgYXMgJGl0KXsKICAgICAgJGFycltdID0gYXJyYXkoJ2lkJz0+JGl0LT5JRCwndGl0bGUnPT4kaXQtPnRpdGxlLCdwYXJlbnQnPT4kaXQtPm1lbnVfaXRlbV9wYXJlbnQsJ3VybCc9PiRpdC0+dXJsLCdvYmonPT4kaXQtPm9iamVjdCwnb2JqX2lkJz0+JGl0LT5vYmplY3RfaWQpOwogICAgICBpZiAobWJfc3RyaXBvcygkaXQtPnRpdGxlLCdzcHJlbmRpbWFpJykhPT1mYWxzZSkgJHNwcmVuZGltYWlfaXRlbSA9ICRpdC0+SUQ7CiAgICB9CiAgICAkb3V0WydtZW51cyddW10gPSBhcnJheSgndGVybV9pZCc9PiRtLT50ZXJtX2lkLCduYW1lJz0+JG0tPm5hbWUsJ3NwcmVuZGltYWlfaXRlbV9pZCc9PiRzcHJlbmRpbWFpX2l0ZW0sJ2l0ZW1fY291bnQnPT5jb3VudCgkYXJyKSwnaXRlbXMnPT4kYXJyKTsKICB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZSgkb3V0KTsgZXhpdDsKfSk7Cg==",'base64').toString('utf8').trim();
(async()=>{
  fs.writeFileSync('/tmp/b557.json', JSON.stringify({name:'PSC MENURECON', code:pcode, scope:'global', active:true}));
  exec('curl -sk -m 20 -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/b557.json "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  var r=exec('curl -sk -m 20 "'+BASE+'/?psc_menurecon=1&k=ps2026"');
  var m=r.match(/(\{.*\})/s); commit('menu_recon.json', m?m[0]:(r||'').slice(0,300)); console.log('matched',!!m);
  exec('curl -sk -m 20 -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
})();
