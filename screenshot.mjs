import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'vl2',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbvl2.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbvl2.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:70000}); }catch(e){ return 'EXC:'+e.message.slice(0,150); } }
const vcode=Buffer.from("YWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCgkX0dFVFsncHNjX3ZsJ10gPz8gJycpICE9PSAnMScpIHJldHVybjsKICBpZiAoKCRfR0VUWydrJ10gPz8gJycpICE9PSAncHMyMDI2JyAmJiAhY3VycmVudF91c2VyX2NhbignbWFuYWdlX29wdGlvbnMnKSkgcmV0dXJuOwogIGdsb2JhbCAkd3BkYjsKICAkb3V0PWFycmF5KCk7CiAgLy8gNTczIG92ZXJsYXkgYWt0eXZ1cz8KICAkczU3MyA9ICR3cGRiLT5nZXRfcm93KCJTRUxFQ1QgYWN0aXZlLCBzY29wZSBGUk9NIHskd3BkYi0+cHJlZml4fXNuaXBwZXRzIFdIRVJFIGlkPTU3MyIsIEFSUkFZX0EpOwogICRvdXRbJ3NuaXA1NzMnXSA9ICRzNTczOwogIC8vIFZpc2kgRFAgcGFrYWk6IGFyIHRodW1ibmFpbCA9IHN2YXJpIGJhemluZSAobmUgZHAtcGFjay0qKT8KICAkaWRzID0gJHdwZGItPmdldF9jb2woIlNFTEVDVCBwLklEIEZST00geyR3cGRiLT5wb3N0c30gcCBKT0lOIHskd3BkYi0+cG9zdG1ldGF9IG0gT04gbS5wb3N0X2lkPXAuSUQgQU5EIG0ubWV0YV9rZXk9J19kcF9iYXNlX3Byb2R1Y3RfaWQnIFdIRVJFIHAucG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcC5wb3N0X3N0YXR1cz0ncHVibGlzaCcgT1JERVIgQlkgcC5JRCBERVNDIik7CiAgJGltZ3M9YXJyYXkoKTsKICBmb3JlYWNoKCRpZHMgYXMgJHBpZCl7CiAgICAkdGlkPWdldF9wb3N0X3RodW1ibmFpbF9pZCgkcGlkKTsgJHRmPSR0aWQ/YmFzZW5hbWUoZ2V0X2F0dGFjaGVkX2ZpbGUoJHRpZCkpOicnOwogICAgJGltZ3NbXT1hcnJheSgncGlkJz0+JHBpZCwncXR5Jz0+Z2V0X3Bvc3RfbWV0YSgkcGlkLCdfZHBfcGFja19xdHknLHRydWUpLCd0aHVtYl9maWxlJz0+JHRmLCdpc19iYWtlZCc9PihzdHJwb3MoJHRmLCdkcC1wYWNrLScpPT09MCkpOwogIH0KICAkb3V0WydwYWNrcyddPSRpbWdzOwogICRvdXRbJ2FueV9iYWtlZCddID0gKGJvb2wpYXJyYXlfZmlsdGVyKCRpbWdzLCBmbigkaSk9PiRpWydpc19iYWtlZCddKTsKICAvLyA1NzIgZm9ybWEgT0s/CiAgJG91dFsnZm9ybWFfb2snXSA9IGZ1bmN0aW9uX2V4aXN0cygncGV0c2hvcF9kcF9mb3JtYV9wYWdlJyk7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZSgkb3V0KTsgZXhpdDsKfSk7Cg==",'base64').toString('utf8');
(async()=>{
  // 572 scope patikra
  var g=exec('curl -sk -m 30 -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/572"');
  var s572={}; try{ var j=JSON.parse(g); s572={scope:j.scope,active:j.active,name:j.name}; }catch(e){ s572={err:'parse'}; }
  fs.writeFileSync('/tmp/b557.json', JSON.stringify({name:'PSC VL2', code:vcode, scope:'global', active:true}));
  exec('curl -sk -m 30 -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/b557.json "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  var r=exec('curl -sk -m 60 "'+BASE+'/?psc_vl=1&k=ps2026"');
  exec('curl -sk -m 20 -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  var out={}; try{ out=JSON.parse(r.match(/(\{.*\})/s)[0]); }catch(e){ out={err:(r||'').slice(0,200)}; }
  out.s572=s572;
  commit('vl2.json', JSON.stringify(out));
  console.log('done');
})();
