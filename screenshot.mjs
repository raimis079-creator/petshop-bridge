import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'rp2',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbrp2.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbrp2.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:35000}); }catch(e){ return 'EXC:'+e.message; } }
const pcode=Buffer.from("YWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCgkX0dFVFsncHNjX3JlbiddID8/ICcnKSAhPT0gJzEnKSByZXR1cm47CiAgaWYgKCgkX0dFVFsnayddID8/ICcnKSAhPT0gJ3BzMjAyNicgJiYgIWN1cnJlbnRfdXNlcl9jYW4oJ21hbmFnZV9vcHRpb25zJykpIHJldHVybjsKICAkcmVuYW1lcyA9IGFycmF5KAogICAgMzQyNTggPT4gJ05hdWphcyDFoXVuaXVrYXMnLAogICAgMzQyNTQgPT4gJ0nFoXJhbmt1cyBhdWdpbnRpbmlzJywKICAgIDM0MjYwID0+ICdKYXV0cnVzIHZpcsWha2luaW1hcycsCiAgICAzNDI2MSA9PiAnU3RlcmlsaXp1b3RhcyBhdWdpbnRpbmlzJywKICAgIDM0MjYyID0+ICdLcmFpa28gcGFzaXJpbmtpbWFzJywKICApOwogICRvdXQgPSBhcnJheSgpOwogIGZvcmVhY2ggKCRyZW5hbWVzIGFzICRpZCA9PiAkbmV3X3RpdGxlKSB7CiAgICAkYmVmb3JlID0gZ2V0X3RoZV90aXRsZSgkaWQpOwogICAgJHIgPSB3cF91cGRhdGVfcG9zdChhcnJheSgKICAgICAgJ0lEJyA9PiAkaWQsCiAgICAgICdwb3N0X3RpdGxlJyA9PiAkbmV3X3RpdGxlLAogICAgICAvLyBORUtFScSMSUFNIHBvc3RfbmFtZSAoc2x1ZykgLSBsaWVrYSB0b2tzIHBhdAogICAgKSwgdHJ1ZSk7CiAgICAkb3V0W10gPSBhcnJheSgKICAgICAgJ2lkJyA9PiAkaWQsCiAgICAgICdiZWZvcmUnID0+ICRiZWZvcmUsCiAgICAgICdhZnRlcicgPT4gZ2V0X3RoZV90aXRsZSgkaWQpLAogICAgICAnc2x1Z191bmNoYW5nZWQnID0+IGdldF9wb3N0X2ZpZWxkKCdwb3N0X25hbWUnLCRpZCksCiAgICAgICdyZXN1bHQnID0+IGlzX3dwX2Vycm9yKCRyKSA/ICRyLT5nZXRfZXJyb3JfbWVzc2FnZSgpIDogJ09LJywKICAgICk7CiAgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG91dCk7IGV4aXQ7Cn0pOwo=",'base64').toString('utf8').trim();
(async()=>{
  fs.writeFileSync('/tmp/b557.json', JSON.stringify({name:'PSC REN', code:pcode, scope:'global', active:true}));
  exec('curl -sk -m 20 -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/b557.json "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  var r=exec('curl -sk -m 25 "'+BASE+'/?psc_ren=1&k=ps2026"');
  var m=r.match(/(\[.*\])/s); commit('rename_pages.json', m?m[0]:(r||'').slice(0,600));
  exec('curl -sk -m 20 -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  console.log('done');
})();
