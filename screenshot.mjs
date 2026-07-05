import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'cm2',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbcm2.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbcm2.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:35000}); }catch(e){ return 'EXC:'+e.message; } }
const pcode=Buffer.from("YWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCgkX0dFVFsncHNjX21ubSddID8/ICcnKSAhPT0gJzEnKSByZXR1cm47CiAgaWYgKCgkX0dFVFsnayddID8/ICcnKSAhPT0gJ3BzMjAyNicgJiYgIWN1cnJlbnRfdXNlcl9jYW4oJ21hbmFnZV9vcHRpb25zJykpIHJldHVybjsKICBnbG9iYWwgJHdwZGI7CiAgCiAgLy8gSWVza29tIE1peCBhbmQgTWF0Y2ggdGlwbyBwcm9kdWt0dSAocHJvZHVjdF90eXBlPW1peC1hbmQtbWF0Y2ggdGVybSkKICAkbW5tX3Byb2R1Y3RzID0gJHdwZGItPmdldF9yZXN1bHRzKCIKICAgIFNFTEVDVCBwLklELCBwLnBvc3RfdGl0bGUsIHAucG9zdF9zdGF0dXMKICAgIEZST00geyR3cGRiLT5wb3N0c30gcAogICAgSU5ORVIgSk9JTiB7JHdwZGItPnRlcm1fcmVsYXRpb25zaGlwc30gdHIgT04gdHIub2JqZWN0X2lkPXAuSUQKICAgIElOTkVSIEpPSU4geyR3cGRiLT50ZXJtX3RheG9ub215fSB0dCBPTiB0dC50ZXJtX3RheG9ub215X2lkPXRyLnRlcm1fdGF4b25vbXlfaWQKICAgIElOTkVSIEpPSU4geyR3cGRiLT50ZXJtc30gdCBPTiB0LnRlcm1faWQ9dHQudGVybV9pZAogICAgV0hFUkUgdHQudGF4b25vbXk9J3Byb2R1Y3RfdHlwZScgQU5EIHQuc2x1Zz0nbWl4LWFuZC1tYXRjaCcKICAgIEFORCBwLnBvc3RfdHlwZT0ncHJvZHVjdCciLCBBUlJBWV9BKTsKICAKICAkb3V0ID0gYXJyYXkoJ21ubV9wcm9kdWN0c19mb3VuZCcgPT4gJG1ubV9wcm9kdWN0cyk7CiAgCiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZSgkb3V0KTsgZXhpdDsKfSk7Cg==",'base64').toString('utf8').trim();
(async()=>{
  fs.writeFileSync('/tmp/b557.json', JSON.stringify({name:'PSC MNM', code:pcode, scope:'global', active:true}));
  exec('curl -sk -m 20 -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/b557.json "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  var r=exec('curl -sk -m 25 "'+BASE+'/?psc_mnm=1&k=ps2026"');
  var m=r.match(/(\{.*\})/s); commit('check_mnm.json', m?m[0]:(r||'').slice(0,600));
  exec('curl -sk -m 20 -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  console.log('done');
})();
