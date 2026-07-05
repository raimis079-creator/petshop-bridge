import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'gbd',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbgbd.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbgbd.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:35000}); }catch(e){ return 'EXC:'+e.message; } }
const pcode=Buffer.from("YWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCgkX0dFVFsncHNjX2diZCddID8/ICcnKSAhPT0gJzEnKSByZXR1cm47CiAgaWYgKCgkX0dFVFsnayddID8/ICcnKSAhPT0gJ3BzMjAyNicgJiYgIWN1cnJlbnRfdXNlcl9jYW4oJ21hbmFnZV9vcHRpb25zJykpIHJldHVybjsKICAKICAkYmFzZV9pZCA9IDE3NDkzOwogICRiYXNlID0gZ2V0X3Bvc3QoJGJhc2VfaWQpOwogICRwcm9kdWN0ID0gd2NfZ2V0X3Byb2R1Y3QoJGJhc2VfaWQpOwogIAogICRvdXQgPSBhcnJheSgKICAgICdiYXNlX2lkJyA9PiAkYmFzZV9pZCwKICAgICd0aXRsZScgPT4gJHByb2R1Y3QtPmdldF9uYW1lKCksCiAgICAnZGVzY3JpcHRpb25fZnVsbCcgPT4gJGJhc2UtPnBvc3RfY29udGVudCwKICAgICdzaG9ydF9kZXNjcmlwdGlvbicgPT4gJGJhc2UtPnBvc3RfZXhjZXJwdCwKICAgICdkZXNjX2xlbmd0aCcgPT4gc3RybGVuKCRiYXNlLT5wb3N0X2NvbnRlbnQpLAogICk7CiAgCiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZSgkb3V0KTsgZXhpdDsKfSk7Cg==",'base64').toString('utf8').trim();
(async()=>{
  fs.writeFileSync('/tmp/b557.json', JSON.stringify({name:'PSC GBD', code:pcode, scope:'global', active:true}));
  exec('curl -sk -m 20 -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/b557.json "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  var r=exec('curl -sk -m 30 "'+BASE+'/?psc_gbd=1&k=ps2026"');
  var m=r.match(/(\{.*\})/s); commit('get_base_desc.json', m?m[0]:(r||'').slice(0,600));
  exec('curl -sk -m 20 -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  console.log('done');
})();
