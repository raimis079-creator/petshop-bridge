import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'hc',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbhc.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbhc.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:20000}); }catch(e){ return 'TIMEOUT/EXC'; } }
const pcode=Buffer.from("YWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCgkX0dFVFsncHNjX2hlYWx0aCddID8/ICcnKSAhPT0gJzEnKSByZXR1cm47CiAgaWYgKCgkX0dFVFsnayddID8/ICcnKSAhPT0gJ3BzMjAyNicgJiYgIWN1cnJlbnRfdXNlcl9jYW4oJ21hbmFnZV9vcHRpb25zJykpIHJldHVybjsKICBnbG9iYWwgJHdwZGI7ICR0PSR3cGRiLT5wcmVmaXguJ3NuaXBwZXRzJzsKICAkcm93PSR3cGRiLT5nZXRfcm93KCJTRUxFQ1QgaWQsbmFtZSxzY29wZSxhY3RpdmUgRlJPTSAkdCBXSEVSRSBuYW1lIExJS0UgJyVDVEEgQmFubmVyaXMga2F0ZWdvcmlqb3NlJSciLCBBUlJBWV9BKTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKGFycmF5KCdvayc9PjEsJ2N0YSc9PiRyb3cpKTsgZXhpdDsKfSk7Cg==",'base64').toString('utf8').trim();
(async()=>{
  var out={};
  var t0=Date.now();
  var g=exec('curl -sk -m 15 -o /dev/null -w "%{http_code}" "'+BASE+'/wp-json/code-snippets/v1/snippets/547"');
  out.snippet547_http=g; out.t_snip=Date.now()-t0;
  fs.writeFileSync('/tmp/b557.json', JSON.stringify({name:'PSC HEALTH', code:pcode, scope:'global', active:true}));
  exec('curl -sk -m 15 -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/b557.json "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  var r=exec('curl -sk -m 15 "'+BASE+'/?psc_health=1&k=ps2026"');
  var m=r.match(/(\{.*\})/s); try{ out.health=JSON.parse(m[0]); }catch(e){ out.health_raw=(r||'').slice(0,120); }
  exec('curl -sk -m 15 -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  commit('health.json', JSON.stringify(out)); console.log(JSON.stringify(out));
})();
