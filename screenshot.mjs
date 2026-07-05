import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'ac2',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbac2.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbac2.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:50000}); }catch(e){ return 'EXC:'+e.message; } }
const pcode=Buffer.from("YWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCgkX0dFVFsncHNjX2FjMiddID8/ICcnKSAhPT0gJzEnKSByZXR1cm47CiAgaWYgKCgkX0dFVFsnayddID8/ICcnKSAhPT0gJ3BzMjAyNicgJiYgIWN1cnJlbnRfdXNlcl9jYW4oJ21hbmFnZV9vcHRpb25zJykpIHJldHVybjsKICBnbG9iYWwgJHdwZGI7CiAgCiAgLy8gVGllc2lvZ2lhaSBpcyBEQiAtIGdyZWljaWF1IG5laSBnZXRfdGVybXMgc3UgZ2V0X3Rlcm0gY2lrbGFpcwogICRyb3dzID0gJHdwZGItPmdldF9yZXN1bHRzKCIKICAgIFNFTEVDVCB0LnRlcm1faWQsIHQubmFtZSwgdC5zbHVnLCB0dC5wYXJlbnQsIHR0LmNvdW50CiAgICBGUk9NIHskd3BkYi0+dGVybXN9IHQKICAgIElOTkVSIEpPSU4geyR3cGRiLT50ZXJtX3RheG9ub215fSB0dCBPTiB0dC50ZXJtX2lkPXQudGVybV9pZAogICAgV0hFUkUgdHQudGF4b25vbXk9J3Byb2R1Y3RfY2F0JwogICAgT1JERVIgQlkgdHQuY291bnQgQVNDLCB0Lm5hbWUgQVNDIiwgQVJSQVlfQSk7CiAgCiAgLy8gVGV2dSB2YXJkYWkKICAkbmFtZXMgPSBhcnJheSgpOwogIGZvcmVhY2ggKCRyb3dzIGFzICRyKSB7ICRuYW1lc1skclsndGVybV9pZCddXSA9ICRyWyduYW1lJ107IH0KICAKICAkb3V0ID0gYXJyYXkoKTsKICBmb3JlYWNoICgkcm93cyBhcyAkcikgewogICAgJG91dFtdID0gYXJyYXkoCiAgICAgICdpZCcgPT4gKGludCkkclsndGVybV9pZCddLAogICAgICAnbmFtZScgPT4gJHJbJ25hbWUnXSwKICAgICAgJ3BhcmVudCcgPT4gJHJbJ3BhcmVudCddID8gKCRuYW1lc1skclsncGFyZW50J11dID8/ICc/JykgOiAnJywKICAgICAgJ2NvdW50JyA9PiAoaW50KSRyWydjb3VudCddLAogICAgKTsKICB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZShhcnJheSgndG90YWwnPT5jb3VudCgkb3V0KSwnY2F0cyc9PiRvdXQpKTsKICBleGl0Owp9KTsK",'base64').toString('utf8').trim();
(async()=>{
  fs.writeFileSync('/tmp/b557.json', JSON.stringify({name:'PSC AC2', code:pcode, scope:'global', active:true}));
  exec('curl -sk -m 20 -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/b557.json "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  var r=exec('curl -sk -m 45 "'+BASE+'/?psc_ac2=1&k=ps2026"');
  var m=r.match(/(\{.*\})/s); commit('audit_cats2.json', m?m[0]:(r||'').slice(0,900));
  exec('curl -sk -m 20 -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  console.log('done');
})();
