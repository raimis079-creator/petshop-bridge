import { execSync } from "child_process";
import fs from "fs";
const WP_USER = process.env.WP_USER, WP_PASS = process.env.WP_APP_PASS;
const BASE = "https://dev.avesa.lt";
const AUTH = "Basic " + Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cb.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000}); }catch(e){ return 'EXC:'+String(e).slice(0,300); } }
const CODE_B64 = "YWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgICBpZiAoIWlzc2V0KCRfR0VUWydwc2Nfc2V0cGFyZW50J10pKSByZXR1cm47CiAgICBpZiAoJF9HRVRbJ3BzY19zZXRwYXJlbnQnXSAhPT0gJ1RBSVAnKSB7IHdwX2RpZSgnUmVpa2lhIGNvbmZpcm09VEFJUCcpOyB9CiAgICAvLyBWaXNpZW1zIGNob2ljZSB0xJd2aW5pYW1zIOKAlCDEr3JhxaFvbSBhdGdhbGluxJkgbnVvcm9kxIUgcGFzbMSXcHRpZW1zCiAgICAkcGFyZW50cyA9IGdldF9wb3N0cyhbCiAgICAgICAgJ3Bvc3RfdHlwZSc9Pidwcm9kdWN0JywgJ3Bvc3RzX3Blcl9wYWdlJz0+LTEsCiAgICAgICAgJ21ldGFfa2V5Jz0+J19wZXRzaG9wX2lzX2Nob2ljZV9idW5kbGUnLCAnbWV0YV92YWx1ZSc9Pid5ZXMnLCAnZmllbGRzJz0+J2lkcycKICAgIF0pOwogICAgJGRvbmUgPSBbXTsKICAgIGZvcmVhY2ggKCRwYXJlbnRzIGFzICRwaWQpIHsKICAgICAgICAkY29uZmlnID0ganNvbl9kZWNvZGUoZ2V0X3Bvc3RfbWV0YSgkcGlkLCAnX3BldHNob3BfY2hvaWNlX2NvbmZpZycsIHRydWUpLCB0cnVlKTsKICAgICAgICBpZiAoIWlzX2FycmF5KCRjb25maWcpKSBjb250aW51ZTsKICAgICAgICBmb3JlYWNoICgkY29uZmlnIGFzICRncmFtPT4kc2l6ZXMpIHsKICAgICAgICAgICAgZm9yZWFjaCAoJHNpemVzIGFzICRzaXplPT4kaW5mbykgewogICAgICAgICAgICAgICAgJGhpZCA9IGludHZhbCgkaW5mb1sncHJvZHVjdF9pZCddKTsKICAgICAgICAgICAgICAgIGlmICgkaGlkKSB7CiAgICAgICAgICAgICAgICAgICAgdXBkYXRlX3Bvc3RfbWV0YSgkaGlkLCAnX3BldHNob3BfY2hvaWNlX3BhcmVudCcsICRwaWQpOwogICAgICAgICAgICAgICAgICAgIHVwZGF0ZV9wb3N0X21ldGEoJGhpZCwgJ19wZXRzaG9wX2Nob2ljZV9ncmFtJywgJGdyYW0pOwogICAgICAgICAgICAgICAgICAgIHVwZGF0ZV9wb3N0X21ldGEoJGhpZCwgJ19wZXRzaG9wX2Nob2ljZV9zaXplJywgJHNpemUpOwogICAgICAgICAgICAgICAgICAgICRkb25lW10gPSAkaGlkOwogICAgICAgICAgICAgICAgfQogICAgICAgICAgICB9CiAgICAgICAgfQogICAgfQogICAgdXBkYXRlX29wdGlvbigncHNjX3Byb2JlX3Jlc3VsdCcsIHdwX2pzb25fZW5jb2RlKFsncGFyZW50cyc9PiRwYXJlbnRzLCAndXBkYXRlZF9oaWRkZW4nPT4kZG9uZV0pKTsKICAgIHdwX2RpZSgnRE9ORTogJy5jb3VudCgkZG9uZSkuJyBwYXNsxJdwdMWzIHN1c2lldGEnKTsKfSk7CmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogICAgaWYgKGlzc2V0KCRfR0VUWydwc2NfcmVhZCddKSAmJiAkX0dFVFsncHNjX3JlYWQnXT09PScxJykgd3BfZGllKGdldF9vcHRpb24oJ3BzY19wcm9iZV9yZXN1bHQnLCdORVJBJykpOwp9KTsK";
const code = Buffer.from(CODE_B64, 'base64').toString('utf8').trim();
(async()=>{
  fs.writeFileSync('/tmp/b557.json', JSON.stringify({name:'PSC PROBE meta', code:code, scope:'global', active:true}));
  exec('curl -sk -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/b557.json "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  var r1 = exec('curl -sk "'+BASE+'/?psc_setparent=TAIP"');
  var m1 = r1.match(/DONE[^<]*/);
  await new Promise(r=>setTimeout(r,1000));
  var r2 = exec('curl -sk "'+BASE+'/?psc_read=1"');
  var m2 = r2.match(/\{.*\}/s);
  commit('setparent.json', JSON.stringify({done: m1?m1[0]:'?', result: m2?m2[0]:'?'}));
  console.log(m1?m1[0]:'?');
  console.log(m2?m2[0].slice(0,300):'?');
})();
