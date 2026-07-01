import { execSync } from "child_process";
import fs from "fs";
const WP_USER = process.env.WP_USER, WP_PASS = process.env.WP_APP_PASS;
const BASE = "https://dev.avesa.lt";
const AUTH = "Basic " + Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cb.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000}); }catch(e){ return 'EXC:'+String(e).slice(0,300); } }
const CODE_B64 = "YWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgICBpZiAoIWlzc2V0KCRfR0VUWydwc2NfcHJvYmUnXSkpIHJldHVybjsKICAgIGlmICgkX0dFVFsncHNjX3Byb2JlJ10gPT09ICdyZWFkJykgeyB3cF9kaWUoZ2V0X29wdGlvbigncHNjX3Byb2JlX3Jlc3VsdCcsICdORVJBJykpOyB9CiAgICBpZiAoJF9HRVRbJ3BzY19wcm9iZSddID09PSAncGFyZW50JykgewogICAgICAgIC8vIFTEl3ZpbmlvIGNvbmZpZwogICAgICAgICRjb25maWcgPSBqc29uX2RlY29kZShnZXRfcG9zdF9tZXRhKDM0MTk2LCAnX3BldHNob3BfY2hvaWNlX2NvbmZpZycsIHRydWUpLCB0cnVlKTsKICAgICAgICAkb3V0ID0gWydwYXJlbnQnPT4zNDE5NiwgJ2NvbmZpZ19rZXlzJz0+W11dOwogICAgICAgIGlmIChpc19hcnJheSgkY29uZmlnKSkgewogICAgICAgICAgICBmb3JlYWNoICgkY29uZmlnIGFzICRncmFtPT4kc2l6ZXMpIHsKICAgICAgICAgICAgICAgIGZvcmVhY2ggKCRzaXplcyBhcyAkc2l6ZT0+JGluZm8pIHsKICAgICAgICAgICAgICAgICAgICAkaGlkID0gJGluZm9bJ3Byb2R1Y3RfaWQnXTsKICAgICAgICAgICAgICAgICAgICAkb3V0Wydjb25maWdfa2V5cyddW10gPSBbCiAgICAgICAgICAgICAgICAgICAgICAgICdncmFtJz0+JGdyYW0sICdzaXplJz0+JHNpemUsICdoaWRkZW5faWQnPT4kaGlkLAogICAgICAgICAgICAgICAgICAgICAgICAnaGFzX3BhcmVudF9tZXRhJz0+Z2V0X3Bvc3RfbWV0YSgkaGlkLCAnX3BldHNob3BfY2hvaWNlX3BhcmVudCcsIHRydWUpLAogICAgICAgICAgICAgICAgICAgIF07CiAgICAgICAgICAgICAgICB9CiAgICAgICAgICAgIH0KICAgICAgICB9CiAgICAgICAgdXBkYXRlX29wdGlvbigncHNjX3Byb2JlX3Jlc3VsdCcsIHdwX2pzb25fZW5jb2RlKCRvdXQpKTsKICAgICAgICB3cF9kaWUoJ09LJyk7CiAgICB9Cn0pOwo=";
const code = Buffer.from(CODE_B64, 'base64').toString('utf8').trim();
(async()=>{
  exec('curl -sk -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/b557.json "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  fs.writeFileSync('/tmp/b557.json', JSON.stringify({name:'PSC PROBE meta', code:code, scope:'global', active:true}));
  exec('curl -sk -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/b557.json "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  exec('curl -sk "'+BASE+'/?psc_probe=parent"');
  await new Promise(r=>setTimeout(r,1500));
  const res = exec('curl -sk "'+BASE+'/?psc_probe=read"');
  var m = res.match(/\{.*\}/s);
  commit('parent_link.json', m ? m[0] : res.slice(0,500));
  console.log(m ? m[0].slice(0,800) : 'no json');
})();
