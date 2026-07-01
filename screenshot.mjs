import { execSync } from "child_process";
import fs from "fs";
const WP_USER = process.env.WP_USER, WP_PASS = process.env.WP_APP_PASS;
const BASE = "https://dev.avesa.lt";
const AUTH = "Basic " + Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cb.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000}); }catch(e){ return 'EXC'; } }
const CODE_B64 = "YWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgICBpZiAoIWlzc2V0KCRfR0VUWydwc2NfYXZ0ZXN0J10pKSByZXR1cm47CiAgICAkdGVybT0na29uc2VydmFpJzsgJGdyYW09JzQwMCc7CiAgICAkcmVzdWx0cz1hcnJheSgpOwogICAgZm9yZWFjaCAoWycnLCd2ZicsJ3piJywnYXYnXSBhcyAkd2gpIHsKICAgICAgICAkdGF4X3F1ZXJ5ID0gYXJyYXkoJ3JlbGF0aW9uJz0+J0FORCcsIGFycmF5KCd0YXhvbm9teSc9PidwYV9wYWt1b3Rlc19keWRpcycsJ2ZpZWxkJz0+J25hbWUnLCd0ZXJtcyc9PiRncmFtLicgZycpKTsKICAgICAgICAkbWV0YV9xdWVyeSA9IGFycmF5KCk7CiAgICAgICAgaWYgKCR3aD09PSd2ZicpICRtZXRhX3F1ZXJ5W109YXJyYXkoJ2tleSc9PidfdmZfZW5hYmxlZCcsJ3ZhbHVlJz0+J3llcycpOwogICAgICAgIGVsc2VpZiAoJHdoPT09J3piJykgJG1ldGFfcXVlcnlbXT1hcnJheSgna2V5Jz0+J196Yl9lbmFibGVkJywndmFsdWUnPT4neWVzJyk7CiAgICAgICAgZWxzZWlmICgkd2g9PT0nYXYnKSB7CiAgICAgICAgICAgICRtZXRhX3F1ZXJ5WydyZWxhdGlvbiddPSdBTkQnOwogICAgICAgICAgICAkbWV0YV9xdWVyeVtdPWFycmF5KCdyZWxhdGlvbic9PidPUicsYXJyYXkoJ2tleSc9PidfdmZfZW5hYmxlZCcsJ2NvbXBhcmUnPT4nTk9UIEVYSVNUUycpLGFycmF5KCdrZXknPT4nX3ZmX2VuYWJsZWQnLCd2YWx1ZSc9Pid5ZXMnLCdjb21wYXJlJz0+JyE9JykpOwogICAgICAgICAgICAkbWV0YV9xdWVyeVtdPWFycmF5KCdyZWxhdGlvbic9PidPUicsYXJyYXkoJ2tleSc9PidfemJfZW5hYmxlZCcsJ2NvbXBhcmUnPT4nTk9UIEVYSVNUUycpLGFycmF5KCdrZXknPT4nX3piX2VuYWJsZWQnLCd2YWx1ZSc9Pid5ZXMnLCdjb21wYXJlJz0+JyE9JykpOwogICAgICAgIH0KICAgICAgICAkYXJncz1hcnJheSgncG9zdF90eXBlJz0+J3Byb2R1Y3QnLCdwb3N0X3N0YXR1cyc9PidwdWJsaXNoJywncyc9PiR0ZXJtLCdwb3N0c19wZXJfcGFnZSc9PjIwMCwKICAgICAgICAgICAgJ3RheF9xdWVyeSc9PmFycmF5KGFycmF5KCd0YXhvbm9teSc9Pidwcm9kdWN0X3R5cGUnLCdmaWVsZCc9PidzbHVnJywndGVybXMnPT5hcnJheSgnc2ltcGxlJykpKSk7CiAgICAgICAgJGFyZ3NbJ3RheF9xdWVyeSddPWFycmF5X21lcmdlKCRhcmdzWyd0YXhfcXVlcnknXSxhcnJheSgkdGF4X3F1ZXJ5KSk7CiAgICAgICAgaWYgKCFlbXB0eSgkbWV0YV9xdWVyeSkpICRhcmdzWydtZXRhX3F1ZXJ5J109JG1ldGFfcXVlcnk7CiAgICAgICAgJHE9bmV3IFdQX1F1ZXJ5KCRhcmdzKTsgJHJlc3VsdHNbJHdoPzondmlzaSddPSRxLT5mb3VuZF9wb3N0czsgd3BfcmVzZXRfcG9zdGRhdGEoKTsKICAgIH0KICAgIC8vIFBhdGlrcmE6IHZmK3piK2F2IHR1cmkgfj0gdmlzaSAoamVpIEFWPWxpa3V0aXMpCiAgICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRyZXN1bHRzKTsgZXhpdDsKfSk7Cg==";
const code = Buffer.from(CODE_B64, 'base64').toString('utf8').trim();
(async()=>{
  fs.writeFileSync('/tmp/b557.json', JSON.stringify({name:'PSC PROBE meta', code:code, scope:'global', active:true}));
  exec('curl -sk -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/b557.json "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  var r=exec('curl -sk "'+BASE+'/?psc_avtest=1"');
  var m=r.match(/\{.*\}/s);
  commit('avtest.json', m?m[0]:r.slice(0,200));
  console.log(m?m[0]:r.slice(0,200));
})();
