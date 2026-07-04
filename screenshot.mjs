import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'cs',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbcs.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbcs.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:35000}); }catch(e){ return 'EXC:'+e.message; } }
const pcode=Buffer.from("YWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCgkX0dFVFsncHNjX2NoZWNrJ10gPz8gJycpICE9PSAnMScpIHJldHVybjsKICBpZiAoKCRfR0VUWydrJ10gPz8gJycpICE9PSAncHMyMDI2JyAmJiAhY3VycmVudF91c2VyX2NhbignbWFuYWdlX29wdGlvbnMnKSkgcmV0dXJuOwogIGdsb2JhbCAkd3BkYjsgJHQ9JHdwZGItPnByZWZpeC4nc25pcHBldHMnOwogICRvdXQ9YXJyYXkoKTsKICAkcm93PSR3cGRiLT5nZXRfcm93KCJTRUxFQ1QgaWQsbmFtZSxhY3RpdmUsc2NvcGUsTEVOR1RIKGNvZGUpIGFzIGxlbixMRUZUKGNvZGUsMTAwKSBhcyBoZWFkIEZST00gJHQgV0hFUkUgbmFtZSBMSUtFICdQZXRzaG9wIFZGIFN5bmMlJyIpOwogICRvdXRbJ3NuaXAnXT0gJHJvdz8oYXJyYXkpJHJvdzonTkVSQVNUQSc7CiAgLy8gYXIgdmVpa2lhIGhvb2snYXM/CiAgJG91dFsnYWN0aW9uX3JlZ2lzdGVyZWQnXT0gaGFzX2FjdGlvbignaW5pdCcpID8gJ3llcyc6Jz8nOwogIC8vIGFyIGZ1bmtjaWphIGVnemlzdHVvamE/CiAgJG91dFsnZm5fcGV0c2hvcF92Zl9zeW5jX3JlcHJpY2UnXT0gZnVuY3Rpb25fZXhpc3RzKCdwZXRzaG9wX3ZmX3N5bmNfcmVwcmljZScpPyd5ZXMnOidOTyc7CiAgJG91dFsnZm5fcGV0c2hvcF92Zl9zeW5jX3N0b2NrJ109IGZ1bmN0aW9uX2V4aXN0cygncGV0c2hvcF92Zl9zeW5jX3N0b2NrJyk/J3llcyc6J05PJzsKICAkb3V0Wydmbl9wZXRzaG9wX3ZmX3N5bmNfcHVibGlzaCddPSBmdW5jdGlvbl9leGlzdHMoJ3BldHNob3BfdmZfc3luY19wdWJsaXNoJyk/J3llcyc6J05PJzsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvdXQpOyBleGl0Owp9KTsK",'base64').toString('utf8').trim();
(async()=>{
  fs.writeFileSync('/tmp/b557.json', JSON.stringify({name:'PSC CHECK', code:pcode, scope:'global', active:true}));
  exec('curl -sk -m 20 -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/b557.json "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  var r=exec('curl -sk -m 25 "'+BASE+'/?psc_check=1&k=ps2026"');
  var m=r.match(/(\{.*\})/s); commit('check.json', m?m[0]:(r||'').slice(0,600));
  exec('curl -sk -m 20 -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  console.log(m?m[0]:r.slice(0,400));
})();
