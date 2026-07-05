import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'ac',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbac.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbac.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:35000}); }catch(e){ return 'EXC:'+e.message; } }
const pcode=Buffer.from("YWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCgkX0dFVFsncHNjX2FjJ10gPz8gJycpICE9PSAnMScpIHJldHVybjsKICBpZiAoKCRfR0VUWydrJ10gPz8gJycpICE9PSAncHMyMDI2JyAmJiAhY3VycmVudF91c2VyX2NhbignbWFuYWdlX29wdGlvbnMnKSkgcmV0dXJuOwogIAogICRjYXRzID0gZ2V0X3Rlcm1zKGFycmF5KCd0YXhvbm9teSc9Pidwcm9kdWN0X2NhdCcsJ2hpZGVfZW1wdHknPT5mYWxzZSwnb3JkZXJieSc9PiduYW1lJykpOwogICRvdXQgPSBhcnJheSgpOwogIGZvcmVhY2ggKCRjYXRzIGFzICRjKSB7CiAgICAvLyBoaWVyYXJjaGlqb3MgZ3lsaXMgKyB0ZXZvIHZhcmRhcwogICAgJGRlcHRoID0gMDsgJHAgPSAkYy0+cGFyZW50OyAkcGFyZW50X25hbWUgPSAnJzsKICAgIGlmICgkcCkgeyAkcHQgPSBnZXRfdGVybSgkcCwncHJvZHVjdF9jYXQnKTsgJHBhcmVudF9uYW1lID0gKCRwdCAmJiAhaXNfd3BfZXJyb3IoJHB0KSkgPyAkcHQtPm5hbWUgOiAnPyc7IH0KICAgIHdoaWxlICgkcCkgeyAkZGVwdGgrKzsgJHB0ID0gZ2V0X3Rlcm0oJHAsJ3Byb2R1Y3RfY2F0Jyk7ICRwID0gKCRwdCAmJiAhaXNfd3BfZXJyb3IoJHB0KSkgPyAkcHQtPnBhcmVudCA6IDA7IGlmKCRkZXB0aD42KSBicmVhazsgfQogICAgJG91dFtdID0gYXJyYXkoCiAgICAgICdpZCcgPT4gJGMtPnRlcm1faWQsCiAgICAgICduYW1lJyA9PiAkYy0+bmFtZSwKICAgICAgJ3NsdWcnID0+ICRjLT5zbHVnLAogICAgICAncGFyZW50JyA9PiAkcGFyZW50X25hbWUsCiAgICAgICdkZXB0aCcgPT4gJGRlcHRoLAogICAgICAnY291bnQnID0+ICRjLT5jb3VudCwKICAgICk7CiAgfQogIC8vIHJ1c2l1b2phbSBwYWdhbCBjb3VudCBkZXNjIChrYWQgbWF0eXR1bWUgdHVzY2lhcy9zaXVrc2xlcykKICB1c29ydCgkb3V0LCBmdW5jdGlvbigkYSwkYil7IHJldHVybiAkYVsnY291bnQnXSAtICRiWydjb3VudCddOyB9KTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKGFycmF5KCd0b3RhbCc9PmNvdW50KCRvdXQpLCdjYXRzJz0+JG91dCkpOwogIGV4aXQ7Cn0pOwo=",'base64').toString('utf8').trim();
(async()=>{
  fs.writeFileSync('/tmp/b557.json', JSON.stringify({name:'PSC AC', code:pcode, scope:'global', active:true}));
  exec('curl -sk -m 20 -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/b557.json "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  var r=exec('curl -sk -m 30 "'+BASE+'/?psc_ac=1&k=ps2026"');
  var m=r.match(/(\{.*\})/s); commit('audit_cats.json', m?m[0]:(r||'').slice(0,900));
  exec('curl -sk -m 20 -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  console.log('done');
})();
