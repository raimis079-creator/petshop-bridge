import { execSync } from "child_process";
import fs from "fs";
const WP_USER = process.env.WP_USER, WP_PASS = process.env.WP_APP_PASS;
const BASE = "https://dev.avesa.lt";
const AUTH = "Basic " + Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cb.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000}); }catch(e){ return 'EXC:'+String(e).slice(0,300); } }
const CODE_B64 = "YWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgICBpZiAoIWlzc2V0KCRfR0VUWydwc2NfYXR0cjInXSkpIHJldHVybjsKICAgIGlmICgkX0dFVFsncHNjX2F0dHIyJ10gPT09ICdyZWFkJykgeyAKICAgICAgICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOwogICAgICAgIGVjaG8gZ2V0X29wdGlvbigncHNjX2F0dHJfcmVzdWx0JywgJ05FUkEnKTsgCiAgICAgICAgZXhpdDsKICAgIH0KICAgIGlmICgkX0dFVFsncHNjX2F0dHIyJ10gPT09ICdzY2FuJykgewogICAgICAgIGdsb2JhbCAkd3BkYjsKICAgICAgICAkdGF4ZXMgPSAkd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIERJU1RJTkNUIHRheG9ub215IEZST00geyR3cGRiLT50ZXJtX3RheG9ub215fSBXSEVSRSB0YXhvbm9teSBMSUtFICdwYV8lJyIpOwogICAgICAgIC8vIFRpayB0YWtzb25vbWlqxbMgcGF2YWRpbmltYWkgKyBraWVrIHRlcm1pbsWzCiAgICAgICAgJG91dCA9IFtdOwogICAgICAgIGZvcmVhY2ggKCR0YXhlcyBhcyAkdGF4KSB7CiAgICAgICAgICAgICRjbnQgPSB3cF9jb3VudF90ZXJtcyhbJ3RheG9ub215Jz0+JHRheCwgJ2hpZGVfZW1wdHknPT5mYWxzZV0pOwogICAgICAgICAgICAkb3V0WyR0YXhdID0gaW50dmFsKCRjbnQpOwogICAgICAgIH0KICAgICAgICB1cGRhdGVfb3B0aW9uKCdwc2NfYXR0cl9yZXN1bHQnLCB3cF9qc29uX2VuY29kZSgkb3V0KSk7CiAgICAgICAgZXhpdCgnT0sgJy5jb3VudCgkdGF4ZXMpKTsKICAgIH0KICAgIC8vIEtvbmtyZcSNaW9zIHRha3Nvbm9taWpvcyB0ZXJtaW5haQogICAgaWYgKHN0cnBvcygkX0dFVFsncHNjX2F0dHIyJ10sICd0ZXJtczonKSA9PT0gMCkgewogICAgICAgICR0YXggPSBzdWJzdHIoJF9HRVRbJ3BzY19hdHRyMiddLCA2KTsKICAgICAgICAkdGVybXMgPSBnZXRfdGVybXMoWyd0YXhvbm9teSc9PiR0YXgsICdoaWRlX2VtcHR5Jz0+ZmFsc2VdKTsKICAgICAgICAkb3V0ID0gW107CiAgICAgICAgaWYgKCFpc193cF9lcnJvcigkdGVybXMpKSBmb3JlYWNoICgkdGVybXMgYXMgJHQpICRvdXRbXSA9ICR0LT5zbHVnLid8Jy4kdC0+bmFtZS4nfCcuJHQtPmNvdW50OwogICAgICAgIHVwZGF0ZV9vcHRpb24oJ3BzY19hdHRyX3Jlc3VsdCcsIHdwX2pzb25fZW5jb2RlKCRvdXQpKTsKICAgICAgICBleGl0KCdPSycpOwogICAgfQp9KTsK";
const code = Buffer.from(CODE_B64, 'base64').toString('utf8').trim();
(async()=>{
  fs.writeFileSync('/tmp/b557.json', JSON.stringify({name:'PSC PROBE meta', code:code, scope:'global', active:true}));
  exec('curl -sk -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/b557.json "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  var s = exec('curl -sk "'+BASE+'/?psc_attr2=scan"');
  await new Promise(r=>setTimeout(r,1200));
  var r2 = exec('curl -sk "'+BASE+'/?psc_attr2=read"');
  commit('attr_list.json', JSON.stringify({scan:s.slice(0,50), taxes:r2.slice(0,2500)}));
  console.log("SCAN:", s.slice(0,30));
  console.log("TAXES:", r2.slice(0,2000));
})();
