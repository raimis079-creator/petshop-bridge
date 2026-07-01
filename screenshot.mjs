import { execSync } from "child_process";
import fs from "fs";
const WP_USER = process.env.WP_USER, WP_PASS = process.env.WP_APP_PASS;
const BASE = "https://dev.avesa.lt";
const AUTH = "Basic " + Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cb.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000}); }catch(e){ return 'EXC'; } }
const CODE_B64 = "YWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgICBpZiAoIWlzc2V0KCRfR0VUWydwc2Nfd2h0ZXN0J10pKSByZXR1cm47CiAgICAkdGVybT0na29uc2VydmFpJzsgJGdyYW09JzQwMCc7CiAgICAkcmVzdWx0cz1hcnJheSgpOwogICAgZm9yZWFjaCAoWycnLCd2ZicsJ3piJ10gYXMgJHdoKSB7CiAgICAgICAgJHRheF9xdWVyeSA9IGFycmF5KCdyZWxhdGlvbic9PidBTkQnLCBhcnJheSgndGF4b25vbXknPT4ncGFfcGFrdW90ZXNfZHlkaXMnLCdmaWVsZCc9PiduYW1lJywndGVybXMnPT4kZ3JhbS4nIGcnKSk7CiAgICAgICAgJG1ldGFfcXVlcnkgPSBhcnJheSgpOwogICAgICAgIGlmICgkd2g9PT0ndmYnKSAkbWV0YV9xdWVyeVtdPWFycmF5KCdrZXknPT4nX3ZmX2VuYWJsZWQnLCd2YWx1ZSc9Pid5ZXMnKTsKICAgICAgICBlbHNlaWYgKCR3aD09PSd6YicpICRtZXRhX3F1ZXJ5W109YXJyYXkoJ2tleSc9PidfemJfZW5hYmxlZCcsJ3ZhbHVlJz0+J3llcycpOwogICAgICAgICRhcmdzPWFycmF5KCdwb3N0X3R5cGUnPT4ncHJvZHVjdCcsJ3Bvc3Rfc3RhdHVzJz0+J3B1Ymxpc2gnLCdzJz0+JHRlcm0sJ3Bvc3RzX3Blcl9wYWdlJz0+MTAwLAogICAgICAgICAgICAndGF4X3F1ZXJ5Jz0+YXJyYXkoYXJyYXkoJ3RheG9ub215Jz0+J3Byb2R1Y3RfdHlwZScsJ2ZpZWxkJz0+J3NsdWcnLCd0ZXJtcyc9PmFycmF5KCdzaW1wbGUnKSkpKTsKICAgICAgICAkYXJnc1sndGF4X3F1ZXJ5J109YXJyYXlfbWVyZ2UoJGFyZ3NbJ3RheF9xdWVyeSddLGFycmF5KCR0YXhfcXVlcnkpKTsKICAgICAgICBpZiAoIWVtcHR5KCRtZXRhX3F1ZXJ5KSkgJGFyZ3NbJ21ldGFfcXVlcnknXT0kbWV0YV9xdWVyeTsKICAgICAgICAkcT1uZXcgV1BfUXVlcnkoJGFyZ3MpOyAkcmVzdWx0c1skd2g/Oid2aXNpJ109JHEtPmZvdW5kX3Bvc3RzOyB3cF9yZXNldF9wb3N0ZGF0YSgpOwogICAgfQogICAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZSgkcmVzdWx0cyk7IGV4aXQ7Cn0pOwo=";
const code = Buffer.from(CODE_B64, 'base64').toString('utf8').trim();
(async()=>{
  fs.writeFileSync('/tmp/b557.json', JSON.stringify({name:'PSC PROBE meta', code:code, scope:'global', active:true}));
  exec('curl -sk -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/b557.json "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  var r=exec('curl -sk "'+BASE+'/?psc_whtest=1"');
  var m=r.match(/\{.*\}/s);
  commit('whtest.json', m?m[0]:r.slice(0,200));
  console.log(m?m[0]:r.slice(0,200));
})();
