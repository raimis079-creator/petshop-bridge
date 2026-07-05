import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'dd',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbdd.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbdd.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:35000}); }catch(e){ return 'EXC:'+e.message; } }
const pcode=Buffer.from("YWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCgkX0dFVFsncHNjX2RkJ10gPz8gJycpICE9PSAnMScpIHJldHVybjsKICBpZiAoKCRfR0VUWydrJ10gPz8gJycpICE9PSAncHMyMDI2JyAmJiAhY3VycmVudF91c2VyX2NhbignbWFuYWdlX29wdGlvbnMnKSkgcmV0dXJuOwogIAogICRwYWNrX2lkID0gMzQ0NDk7CiAgJHBhY2sgPSB3Y19nZXRfcHJvZHVjdCgkcGFja19pZCk7CiAgCiAgJG91dCA9IGFycmF5KAogICAgJ3BhY2tfbWFuYWdlX3N0b2NrJyA9PiAkcGFjay0+Z2V0X21hbmFnZV9zdG9jaygpID8gJ3llcycgOiAnbm8nLAogICAgJ3BhY2tfbWFuYWdpbmdfc3RvY2tfbWV0aG9kJyA9PiAkcGFjay0+bWFuYWdpbmdfc3RvY2soKSA/ICd0cnVlJyA6ICdmYWxzZScsCiAgICAncGFja19zdG9ja19zdGF0dXMnID0+ICRwYWNrLT5nZXRfc3RvY2tfc3RhdHVzKCksCiAgICAncGFja19zdG9ja19xdHknID0+ICRwYWNrLT5nZXRfc3RvY2tfcXVhbnRpdHkoKSwKICAgICdwYWNrX21ldGFfbWFuYWdlX3N0b2NrJyA9PiBnZXRfcG9zdF9tZXRhKCRwYWNrX2lkLCAnX21hbmFnZV9zdG9jaycsIHRydWUpLAogICAgJ3BhY2tfbWV0YV9zdG9jaycgPT4gZ2V0X3Bvc3RfbWV0YSgkcGFja19pZCwgJ19zdG9jaycsIHRydWUpLAogICk7CiAgCiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZSgkb3V0KTsgZXhpdDsKfSk7Cg==",'base64').toString('utf8').trim();
(async()=>{
  fs.writeFileSync('/tmp/b557.json', JSON.stringify({name:'PSC DD', code:pcode, scope:'global', active:true}));
  exec('curl -sk -m 20 -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/b557.json "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  var r=exec('curl -sk -m 25 "'+BASE+'/?psc_dd=1&k=ps2026"');
  var m=r.match(/(\{.*\})/s); commit('diag_double.json', m?m[0]:(r||'').slice(0,600));
  exec('curl -sk -m 20 -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  console.log('done');
})();
