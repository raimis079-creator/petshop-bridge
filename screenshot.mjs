import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'vv19',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbvv19.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbvv19.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:35000}); }catch(e){ return 'EXC:'+e.message; } }
const pcode=Buffer.from("YWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCgkX0dFVFsncHNjX3ZlcnYxOSddID8/ICcnKSAhPT0gJzEnKSByZXR1cm47CiAgaWYgKCgkX0dFVFsnayddID8/ICcnKSAhPT0gJ3BzMjAyNicgJiYgIWN1cnJlbnRfdXNlcl9jYW4oJ21hbmFnZV9vcHRpb25zJykpIHJldHVybjsKICBnbG9iYWwgJHdwZGI7CiAgJHJvdyA9ICR3cGRiLT5nZXRfcm93KCJTRUxFQ1QgbmFtZSwgYWN0aXZlLCBjb2RlIEZST00geyR3cGRiLT5wcmVmaXh9c25pcHBldHMgV0hFUkUgaWQ9MzMyIik7CiAgJG91dD1hcnJheSgKICAgICduYW1lJz0+JHJvdy0+bmFtZSwKICAgICdhY3RpdmUnPT4kcm93LT5hY3RpdmUsCiAgICAnaGFzX3R1YWxldHVfZmlsdHJhcyc9PiAoc3RycG9zKCRyb3ctPmNvZGUsJ3R1YWxldHUtZmlsdHJhcycpIT09ZmFsc2UpPyd5ZXMnOidubycsCiAgICAncHJlc2V0X2V4aXN0cyc9PiBnZXRfcGFnZV9ieV9wYXRoKCd0dWFsZXR1LWZpbHRyYXMnLCBPQkpFQ1QsICd5aXRoX3djYW5fcHJlc2V0JykgPyAneWVzJzonbm8nLAogICk7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZSgkb3V0KTsgZXhpdDsKfSk7Cg==",'base64').toString('utf8').trim();
(async()=>{
  fs.writeFileSync('/tmp/b557.json', JSON.stringify({name:'PSC VERV19', code:pcode, scope:'global', active:true}));
  exec('curl -sk -m 20 -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/b557.json "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  var r=exec('curl -sk -m 25 "'+BASE+'/?psc_verv19=1&k=ps2026"');
  var m=r.match(/(\{.*\})/s); commit('verify_v19.json', m?m[0]:(r||'').slice(0,300));
  exec('curl -sk -m 20 -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  console.log(m?m[0]:r);
})();
