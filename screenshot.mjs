import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'ct',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbct.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbct.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:35000}); }catch(e){ return 'EXC:'+e.message; } }
const pcode=Buffer.from("YWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCgkX0dFVFsncHNjX3R1YWxldCddID8/ICcnKSAhPT0gJzEnKSByZXR1cm47CiAgaWYgKCgkX0dFVFsnayddID8/ICcnKSAhPT0gJ3BzMjAyNicgJiYgIWN1cnJlbnRfdXNlcl9jYW4oJ21hbmFnZV9vcHRpb25zJykpIHJldHVybjsKICBnbG9iYWwgJHdwZGI7CiAgLy8gUGFyZW50IGthdGVnb3JpamEgMTA2CiAgJHBhcmVudCA9IGdldF90ZXJtKDEwNiwncHJvZHVjdF9jYXQnKTsKICAkY2hpbGRyZW4gPSBnZXRfdGVybXMoYXJyYXkoJ3RheG9ub215Jz0+J3Byb2R1Y3RfY2F0JywncGFyZW50Jz0+MTA2LCdoaWRlX2VtcHR5Jz0+ZmFsc2UpKTsKICAkb3V0PWFycmF5KAogICAgJ3BhcmVudCc9PmFycmF5KCdpZCc9PiRwYXJlbnQtPnRlcm1faWQsJ25hbWUnPT4kcGFyZW50LT5uYW1lLCdzbHVnJz0+JHBhcmVudC0+c2x1ZywnY291bnQnPT4kcGFyZW50LT5jb3VudCksCiAgICAnY2hpbGRyZW4nPT5hcnJheV9tYXAoZnVuY3Rpb24oJGMpe3JldHVybiBhcnJheSgnaWQnPT4kYy0+dGVybV9pZCwnbmFtZSc9PiRjLT5uYW1lLCdzbHVnJz0+JGMtPnNsdWcsJ2NvdW50Jz0+JGMtPmNvdW50KTt9LCRjaGlsZHJlbiksCiAgKTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvdXQpOyBleGl0Owp9KTsK",'base64').toString('utf8').trim();
(async()=>{
  fs.writeFileSync('/tmp/b557.json', JSON.stringify({name:'PSC TUALET', code:pcode, scope:'global', active:true}));
  exec('curl -sk -m 20 -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/b557.json "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  var r=exec('curl -sk -m 25 "'+BASE+'/?psc_tualet=1&k=ps2026"');
  var m=r.match(/(\{.*\})/s); commit('check_tualet.json', m?m[0]:(r||'').slice(0,600));
  exec('curl -sk -m 20 -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  console.log('done');
})();
