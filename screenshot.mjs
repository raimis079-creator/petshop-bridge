import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'md',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbmd.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbmd.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:35000}); }catch(e){ return 'EXC:'+e.message; } }
const pcode=Buffer.from("YWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCgkX0dFVFsncHNjX21kdW1wJ10gPz8gJycpICE9PSAnMScpIHJldHVybjsKICBpZiAoKCRfR0VUWydrJ10gPz8gJycpICE9PSAncHMyMDI2JyAmJiAhY3VycmVudF91c2VyX2NhbignbWFuYWdlX29wdGlvbnMnKSkgcmV0dXJuOwogIAogIC8vIFBhZ3JpbmRpbmlvIG1lbml1IHB1bmt0YWkKICAkaXRlbXMgPSB3cF9nZXRfbmF2X21lbnVfaXRlbXMoMjMyKTsgLy8gIlBhZ3JpbmRpbmlzIG1lbml1IgogIGlmICghJGl0ZW1zKSAkaXRlbXMgPSB3cF9nZXRfbmF2X21lbnVfaXRlbXMoNjgpOyAvLyAiTWFpbiIKICAKICAkb3V0PWFycmF5KCk7CiAgZm9yZWFjaCgkaXRlbXMgYXMgJGl0KXsKICAgICRvdXRbXT1hcnJheSgKICAgICAgJ0lEJz0+JGl0LT5JRCwKICAgICAgJ3RpdGxlJz0+JGl0LT50aXRsZSwKICAgICAgJ2xhYmVsJz0+JGl0LT5wb3N0X3RpdGxlLAogICAgICAncGFyZW50Jz0+JGl0LT5tZW51X2l0ZW1fcGFyZW50LAogICAgICAnb3JkZXInPT4kaXQtPm1lbnVfb3JkZXIsCiAgICAgICd0eXBlJz0+JGl0LT50eXBlLAogICAgICAnb2JqZWN0Jz0+JGl0LT5vYmplY3QsCiAgICAgICdvYmplY3RfaWQnPT4kaXQtPm9iamVjdF9pZCwKICAgICAgJ3VybCc9PiRpdC0+dXJsLAogICAgKTsKICB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZSgkb3V0KTsgZXhpdDsKfSk7Cg==",'base64').toString('utf8').trim();
(async()=>{
  fs.writeFileSync('/tmp/b557.json', JSON.stringify({name:'PSC MDUMP', code:pcode, scope:'global', active:true}));
  exec('curl -sk -m 20 -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/b557.json "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  var r=exec('curl -sk -m 25 "'+BASE+'/?psc_mdump=1&k=ps2026"');
  var m=r.match(/(\[.*\])/s); commit('menu_dump.json', m?m[0]:(r||'').slice(0,600));
  exec('curl -sk -m 20 -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  console.log('done');
})();
