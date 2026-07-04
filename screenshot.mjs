import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'c5',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbc5.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbc5.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:35000}); }catch(e){ return 'EXC:'+e.message; } }
const pcode=Buffer.from("YWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCgkX0dFVFsncHNjX2NrNTY1J10gPz8gJycpICE9PSAnMScpIHJldHVybjsKICBpZiAoKCRfR0VUWydrJ10gPz8gJycpICE9PSAncHMyMDI2JyAmJiAhY3VycmVudF91c2VyX2NhbignbWFuYWdlX29wdGlvbnMnKSkgcmV0dXJuOwogIGdsb2JhbCAkd3BkYjsgJHQ9JHdwZGItPnByZWZpeC4nc25pcHBldHMnOwogICRyPSR3cGRiLT5nZXRfcm93KCJTRUxFQ1QgaWQsbmFtZSxhY3RpdmUsTEVOR1RIKGNvZGUpIGFzIGxlbixMRUZUKGNvZGUsODApIGFzIGhlYWQgRlJPTSAkdCBXSEVSRSBpZD01NjUiKTsKICAkb3V0PWFycmF5KCdzbmlwcGV0Jz0+JHI/KGFycmF5KSRyOidubycsCiAgICAnZm5fcmVwcmljZSc9PmZ1bmN0aW9uX2V4aXN0cygncGV0c2hvcF92Zl9zeW5jX3JlcHJpY2UnKT8neWVzJzonTk8nLAogICAgJ2ZuX3N0b2NrJz0+ZnVuY3Rpb25fZXhpc3RzKCdwZXRzaG9wX3ZmX3N5bmNfc3RvY2snKT8neWVzJzonTk8nLAogICAgJ2ZuX3B1Ymxpc2gnPT5mdW5jdGlvbl9leGlzdHMoJ3BldHNob3BfdmZfc3luY19wdWJsaXNoJyk/J3llcyc6J05PJyk7CiAgLy8gdGVzdHVvamFtIHRpZXNpb2cgZ3l2YWkKICBpZihmdW5jdGlvbl9leGlzdHMoJ3BldHNob3BfdmZfc3luY19yZXByaWNlJykpewogICAgJHJyID0gcGV0c2hvcF92Zl9zeW5jX3JlcHJpY2UoJ2RyeXJ1bicsIDEwLCAwLCBhcnJheSgpKTsKICAgICRvdXRbJ3Rlc3RfY2FsbCddID0gJHJyOwogIH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvdXQpOyBleGl0Owp9KTsK",'base64').toString('utf8').trim();
(async()=>{
  fs.writeFileSync('/tmp/b557.json', JSON.stringify({name:'PSC CK565', code:pcode, scope:'global', active:true}));
  exec('curl -sk -m 20 -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/b557.json "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  var r=exec('curl -sk -m 30 "'+BASE+'/?psc_ck565=1&k=ps2026"');
  var m=r.match(/(\{.*\})/s); commit('check565.json', m?m[0]:(r||'').slice(0,600));
  exec('curl -sk -m 20 -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  console.log('done');
})();
