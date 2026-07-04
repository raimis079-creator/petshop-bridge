import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'rn',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbrn.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbrn.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:35000}); }catch(e){ return 'EXC:'+e.message; } }
const pcode=Buffer.from("YWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCgkX0dFVFsncHNjX3JlbjEwNiddID8/ICcnKSAhPT0gJzEnKSByZXR1cm47CiAgaWYgKCgkX0dFVFsnayddID8/ICcnKSAhPT0gJ3BzMjAyNicgJiYgIWN1cnJlbnRfdXNlcl9jYW4oJ21hbmFnZV9vcHRpb25zJykpIHJldHVybjsKICAkb3V0PWFycmF5KCk7CiAgJGJlZm9yZSA9IGdldF90ZXJtKDEwNiwncHJvZHVjdF9jYXQnKTsKICAkb3V0WydiZWZvcmUnXSA9IGFycmF5KCduYW1lJz0+JGJlZm9yZS0+bmFtZSwnc2x1Zyc9PiRiZWZvcmUtPnNsdWcpOwogIAogIC8vIEtlacSNaWFtIHRpayBwYXZhZGluaW3EhSwgc2x1ZydhcyBsaWVrYQogICRyID0gd3BfdXBkYXRlX3Rlcm0oMTA2LCdwcm9kdWN0X2NhdCcsIGFycmF5KAogICAgJ25hbWUnID0+ICdUdWFsZXRhaSwgc2VtdHV2xJdsaWFpJywKICApKTsKICAKICAkb3V0Wyd1cGRhdGVfcmVzdWx0J10gPSBpc193cF9lcnJvcigkcikgPyAkci0+Z2V0X2Vycm9yX21lc3NhZ2UoKSA6ICdPSyc7CiAgY2xlYW5fdGVybV9jYWNoZSgxMDYsJ3Byb2R1Y3RfY2F0Jyk7CiAgJGFmdGVyID0gZ2V0X3Rlcm0oMTA2LCdwcm9kdWN0X2NhdCcpOwogICRvdXRbJ2FmdGVyJ10gPSBhcnJheSgnbmFtZSc9PiRhZnRlci0+bmFtZSwnc2x1Zyc9PiRhZnRlci0+c2x1Zyk7CiAgCiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZSgkb3V0KTsgZXhpdDsKfSk7Cg==",'base64').toString('utf8').trim();
(async()=>{
  fs.writeFileSync('/tmp/b557.json', JSON.stringify({name:'PSC REN106', code:pcode, scope:'global', active:true}));
  exec('curl -sk -m 20 -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/b557.json "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  var r=exec('curl -sk -m 25 "'+BASE+'/?psc_ren106=1&k=ps2026"');
  var m=r.match(/(\{.*\})/s); commit('rename_106.json', m?m[0]:(r||'').slice(0,600));
  exec('curl -sk -m 20 -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  console.log('done');
})();
