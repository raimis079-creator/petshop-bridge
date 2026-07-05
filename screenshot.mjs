import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'sg',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbsg.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbsg.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:40000}); }catch(e){ return 'EXC:'+e.message.slice(0,120); } }
const pcode=Buffer.from("YWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCgkX0dFVFsncHNjX3BnJ10gPz8gJycpICE9PSAnMScpIHJldHVybjsKICBpZiAoKCRfR0VUWydrJ10gPz8gJycpICE9PSAncHMyMDI2JyAmJiAhY3VycmVudF91c2VyX2NhbignbWFuYWdlX29wdGlvbnMnKSkgcmV0dXJuOwogICRmbj0ncGV0c2hvcF9yaW5raW5pb19mb3JtYV9wYWdlJzsKICAkb3V0PWFycmF5KCdleGlzdHMnPT5mdW5jdGlvbl9leGlzdHMoJGZuKSk7CiAgaWYoZnVuY3Rpb25fZXhpc3RzKCRmbikpewogICAgJGVycnM9YXJyYXkoKTsKICAgIHNldF9lcnJvcl9oYW5kbGVyKGZ1bmN0aW9uKCRuLCRzKXVzZSgmJGVycnMpeyAkZXJyc1tdPSJbJG5dICRzIjsgcmV0dXJuIHRydWU7IH0pOwogICAgb2Jfc3RhcnQoKTsKICAgIHRyeXsgY2FsbF91c2VyX2Z1bmMoJGZuKTsgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRlcnJzW109J0VYQzonLiRlLT5nZXRNZXNzYWdlKCk7IH0KICAgICRoPW9iX2dldF9jbGVhbigpOwogICAgcmVzdG9yZV9lcnJvcl9oYW5kbGVyKCk7CiAgICAkb3V0WydlcnJvcnMnXT0kZXJyczsKICAgICRvdXRbJ2xlbiddPXN0cmxlbigkaCk7CiAgICAkb3V0Wydicm93c2UnXT1zdHJwb3MoJGgsJ2JmLWJyb3dzZScpIT09ZmFsc2U7CiAgICAkb3V0WydjYXRmaWx0ZXInXT1zdHJwb3MoJGgsJ2JmLWNhdC1maWx0ZXInKSE9PWZhbHNlOwogICAgJG91dFsnYWRkY2hlY2tlZCddPXN0cnBvcygkaCwnYmYtYWRkLWNoZWNrZWQnKSE9PWZhbHNlOwogICAgJG91dFsnY2hrYWxsJ109c3RycG9zKCRoLCdiZi1jaGstYWxsJykhPT1mYWxzZTsKICAgICRvdXRbJ3J1bnNlYXJjaCddPXN0cnBvcygkaCwnZnVuY3Rpb24gcnVuU2VhcmNoJykhPT1mYWxzZTsKICAgICRvdXRbJ2Jyb3dzZWhhbmRsZXInXT1zdHJwb3MoJGgsInJ1blNlYXJjaCgnJywgdHJ1ZSkiKSE9PWZhbHNlOwogICAgaWYocHJlZ19tYXRjaCgnL3BldENhdHNccyo9XHMqKFxbLio/XF0pOy9zJywkaCwkbW0pKXsgJGRkPWpzb25fZGVjb2RlKCRtbVsxXSx0cnVlKTsgJG91dFsncGV0Y2F0cyddPWlzX2FycmF5KCRkZCk/Y291bnQoJGRkKTowOyAkb3V0WydzYW1wbGUnXT1pc19hcnJheSgkZGQpP2FycmF5X3NsaWNlKGFycmF5X2NvbHVtbigkZGQsJ25hbWUnKSwwLDUpOm51bGw7IH0gZWxzZSB7ICRvdXRbJ3BldGNhdHMnXT0nTUlTUyc7IH0KICB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZSgkb3V0KTsgZXhpdDsKfSk7Cg==",'base64').toString('utf8');
(async()=>{
  // 1. 539 -> global
  fs.writeFileSync('/tmp/g.json', JSON.stringify({scope:'global', active:true}));
  exec('curl -sk -m 20 -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/g.json "'+BASE+'/wp-json/code-snippets/v1/snippets/539"');
  // 2. probe
  fs.writeFileSync('/tmp/b557.json', JSON.stringify({name:'PSC PG', code:pcode, scope:'global', active:true}));
  exec('curl -sk -m 20 -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/b557.json "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  var r=exec('curl -sk -m 30 "'+BASE+'/?psc_pg=1&k=ps2026"');
  var m=r.match(/(\{.*\})/s); commit('probe_gen.json', m?m[0]:(r||'').slice(0,600));
  exec('curl -sk -m 20 -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  // 3. 539 -> admin (GRAZINAM)
  fs.writeFileSync('/tmp/a.json', JSON.stringify({scope:'admin', active:true}));
  var back=exec('curl -sk -m 20 -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/a.json "'+BASE+'/wp-json/code-snippets/v1/snippets/539"');
  var scopeNow=''; try{ scopeNow=JSON.parse(back).scope; }catch(e){}
  commit('scope_back.json', JSON.stringify({scope_539_now:scopeNow}));
  console.log('done');
})();
