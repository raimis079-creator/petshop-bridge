import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'ci2',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbci2.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbci2.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:35000}); }catch(e){ return 'EXC:'+e.message; } }
const pcode=Buffer.from("YWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCgkX0dFVFsncHNjX2NpMiddID8/ICcnKSAhPT0gJzEnKSByZXR1cm47CiAgaWYgKCgkX0dFVFsnayddID8/ICcnKSAhPT0gJ3BzMjAyNicgJiYgIWN1cnJlbnRfdXNlcl9jYW4oJ21hbmFnZV9vcHRpb25zJykpIHJldHVybjsKICAKICBpZiAoIWZ1bmN0aW9uX2V4aXN0cygnZ2V0X3BsdWdpbnMnKSkgcmVxdWlyZV9vbmNlIEFCU1BBVEguJ3dwLWFkbWluL2luY2x1ZGVzL3BsdWdpbi5waHAnOwogICRhY3RpdmUgPSBnZXRfb3B0aW9uKCdhY3RpdmVfcGx1Z2lucycpOwogIAogIC8vIEFyIHlyYSBwZXRzaG9wIGthdGVnb3JpemF2aW1vIHBsdWdpbi9sb2dpa2EKICAkcGV0c2hvcF9wbHVnaW5zID0gYXJyYXkoKTsKICBmb3JlYWNoICgkYWN0aXZlIGFzICRwKSB7IGlmIChzdHJpcG9zKCRwLCdwZXRzaG9wJykhPT1mYWxzZSkgJHBldHNob3BfcGx1Z2luc1tdID0gJHA7IH0KICAKICAvLyBHeXZ1bm8gcnVzaWVzIGF0cmlidXRhcyAtIGFyIGVnemlzdHVvamEgKFMxMTMuMSBsb2dpa2EpCiAgJGd5dl9hdHRyID0gdGF4b25vbXlfZXhpc3RzKCdwYV9neXZ1bm9fcnVzaXMnKTsKICAKICAvLyBLaWVrIHByZWtpdSBiZSBqb2tpb3Mga2F0ZWdvcmlqb3MgYXJiYSB0aWsgIktpdGEiCiAgZ2xvYmFsICR3cGRiOwogICRraXRhID0gZ2V0X3Rlcm1fYnkoJ25hbWUnLCAnS2l0YScsICdwcm9kdWN0X2NhdCcpOwogICRraXRhX2lkID0gJGtpdGEgPyAka2l0YS0+dGVybV9pZCA6IDA7CiAgCiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsKICBlY2hvIHdwX2pzb25fZW5jb2RlKGFycmF5KAogICAgJ3BldHNob3BfcGx1Z2lucycgPT4gJHBldHNob3BfcGx1Z2lucywKICAgICdneXZ1bm9fcnVzaXNfYXR0cl9leGlzdHMnID0+ICRneXZfYXR0ciwKICAgICdraXRhX2NhdF9pZCcgPT4gJGtpdGFfaWQsCiAgKSk7CiAgZXhpdDsKfSk7Cg==",'base64').toString('utf8').trim();
(async()=>{
  fs.writeFileSync('/tmp/b557.json', JSON.stringify({name:'PSC CI2', code:pcode, scope:'global', active:true}));
  exec('curl -sk -m 20 -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/b557.json "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  var r=exec('curl -sk -m 25 "'+BASE+'/?psc_ci2=1&k=ps2026"');
  var m=r.match(/(\{.*\})/s); commit('check_import.json', m?m[0]:(r||'').slice(0,600));
  exec('curl -sk -m 20 -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  console.log('done');
})();
