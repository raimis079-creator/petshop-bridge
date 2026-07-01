import { execSync } from "child_process";
import fs from "fs";
const WP_USER = process.env.WP_USER, WP_PASS = process.env.WP_APP_PASS;
const BASE = "https://dev.avesa.lt";
const AUTH = "Basic " + Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cb.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000}); }catch(e){ return 'EXC:'+String(e).slice(0,300); } }
const CODE_B64 = "YWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgICBpZiAoIWlzc2V0KCRfR0VUWydwc2NfYXR0ciddKSkgcmV0dXJuOwogICAgaWYgKCRfR0VUWydwc2NfYXR0ciddID09PSAncmVhZCcpIHsgd3BfZGllKGdldF9vcHRpb24oJ3BzY19hdHRyX3Jlc3VsdCcsICdORVJBJykpOyB9CiAgICBpZiAoJF9HRVRbJ3BzY19hdHRyJ10gPT09ICdzY2FuJykgewogICAgICAgIGdsb2JhbCAkd3BkYjsKICAgICAgICAvLyBWaXNpIHByb2R1a3TFsyBhdHJpYnV0xbMgdGFrc29ub21pam9zIChwYV8qKQogICAgICAgICR0YXhlcyA9ICR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgRElTVElOQ1QgdGF4b25vbXkgRlJPTSB7JHdwZGItPnRlcm1fdGF4b25vbXl9IFdIRVJFIHRheG9ub215IExJS0UgJ3BhXyUnIik7CiAgICAgICAgJG91dCA9IFsndGF4b25vbWllcyc9PltdXTsKICAgICAgICBmb3JlYWNoICgkdGF4ZXMgYXMgJHRheCkgewogICAgICAgICAgICAkdGVybXMgPSBnZXRfdGVybXMoWyd0YXhvbm9teSc9PiR0YXgsICdoaWRlX2VtcHR5Jz0+ZmFsc2VdKTsKICAgICAgICAgICAgJHRpbmZvID0gW107CiAgICAgICAgICAgIGlmICghaXNfd3BfZXJyb3IoJHRlcm1zKSkgewogICAgICAgICAgICAgICAgZm9yZWFjaCAoJHRlcm1zIGFzICR0KSB7CiAgICAgICAgICAgICAgICAgICAgJHRpbmZvW10gPSBbJ3NsdWcnPT4kdC0+c2x1ZywgJ25hbWUnPT4kdC0+bmFtZSwgJ2NvdW50Jz0+JHQtPmNvdW50XTsKICAgICAgICAgICAgICAgIH0KICAgICAgICAgICAgfQogICAgICAgICAgICAkb3V0Wyd0YXhvbm9taWVzJ11bJHRheF0gPSAkdGluZm87CiAgICAgICAgfQogICAgICAgIC8vIEtvbmtyZcSNaWFpIGtvbnNlcnbFsyBwb29sIHBhdnl6ZHlzIOKAlCAzNDE5NiBjb25maWcga29uc2VydmFpLCBrb2tpdXMgYXRyaWJ1dHVzIHR1cmkKICAgICAgICAkY29uZmlnID0ganNvbl9kZWNvZGUoZ2V0X3Bvc3RfbWV0YSgzNDE5NiwgJ19wZXRzaG9wX2Nob2ljZV9jb25maWcnLCB0cnVlKSwgdHJ1ZSk7CiAgICAgICAgJHNhbXBsZV9jYW5zID0gW107CiAgICAgICAgaWYgKGlzX2FycmF5KCRjb25maWcpKSB7CiAgICAgICAgICAgICRmaXJzdCA9IHJlc2V0KCRjb25maWcpOwogICAgICAgICAgICAkZmlyc3RzaXplID0gcmVzZXQoJGZpcnN0KTsKICAgICAgICAgICAgLy8gUGFpbWFtIGtlbGlzIHBvb2wga29uc2VydnVzIGnFoSBNbk0KICAgICAgICB9CiAgICAgICAgdXBkYXRlX29wdGlvbigncHNjX2F0dHJfcmVzdWx0Jywgd3BfanNvbl9lbmNvZGUoJG91dCkpOwogICAgICAgIHdwX2RpZSgnT0snKTsKICAgIH0KfSk7Cg==";
const code = Buffer.from(CODE_B64, 'base64').toString('utf8').trim();
(async()=>{
  fs.writeFileSync('/tmp/b557.json', JSON.stringify({name:'PSC PROBE meta', code:code, scope:'global', active:true}));
  exec('curl -sk -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/b557.json "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  exec('curl -sk "'+BASE+'/?psc_attr=scan"');
  await new Promise(r=>setTimeout(r,1500));
  var r2 = exec('curl -sk "'+BASE+'/?psc_attr=read"');
  var m = r2.match(/\{.*\}/s);
  commit('attr_scan.json', m ? m[0] : r2.slice(0,500));
  console.log(m ? m[0].slice(0,1500) : 'no json');
})();
