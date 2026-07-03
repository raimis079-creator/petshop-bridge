import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'hc',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbhc.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbhc.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:35000}); }catch(e){ return 'EXC:'+e.message; } }
const pcode=Buffer.from("YWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCgkX0dFVFsncHNjX2h0bWxjaGsnXSA/PyAnJykgIT09ICcxJykgcmV0dXJuOwogIGlmICgoJF9HRVRbJ2snXSA/PyAnJykgIT09ICdwczIwMjYnICYmICFjdXJyZW50X3VzZXJfY2FuKCdtYW5hZ2Vfb3B0aW9ucycpKSByZXR1cm47CiAgLy8gVGllc2lvZ2lhaSB2eWtkb20gdcW+a2xhdXPEhSBrYWlwIGthdGVnb3Jpam9zIHB1c2xhcGlzIHN1IGZpbHRydQogICRfR0VUWydmaWx0ZXJfdGlwYXMnXT0ndXpkYXJhcy1uYW1lbGlzJzsKICAkX0dFVFsncXVlcnlfdHlwZV90aXBhcyddPSdvcic7CiAgJHEgPSBuZXcgV1BfUXVlcnkoYXJyYXkoCiAgICAncG9zdF90eXBlJz0+J3Byb2R1Y3QnLCdwb3N0X3N0YXR1cyc9PidwdWJsaXNoJywncG9zdHNfcGVyX3BhZ2UnPT4tMSwnZmllbGRzJz0+J2lkcycsCiAgICAndGF4X3F1ZXJ5Jz0+YXJyYXkoJ3JlbGF0aW9uJz0+J0FORCcsCiAgICAgIGFycmF5KCd0YXhvbm9teSc9Pidwcm9kdWN0X2NhdCcsJ2ZpZWxkJz0+J3Rlcm1faWQnLCd0ZXJtcyc9PjEwNiksCiAgICAgIGFycmF5KCd0YXhvbm9teSc9PidwYV90aXBhcycsJ2ZpZWxkJz0+J3NsdWcnLCd0ZXJtcyc9Pid1emRhcmFzLW5hbWVsaXMnKSwKICAgICkpKTsKICAkb3V0PWFycmF5KCdmb3VuZCc9PiRxLT5mb3VuZF9wb3N0cywgJ3NhbXBsZSc9PmFycmF5KCkpOwogIGZvcmVhY2goYXJyYXlfc2xpY2UoJHEtPnBvc3RzLDAsNSkgYXMgJHBpZCl7ICRvdXRbJ3NhbXBsZSddW109Z2V0X3RoZV90aXRsZSgkcGlkKTsgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG91dCk7IGV4aXQ7Cn0pOwo=",'base64').toString('utf8').trim();
(async()=>{
  var out={};
  fs.writeFileSync('/tmp/b557.json', JSON.stringify({name:'PSC HTMLCHK', code:pcode, scope:'global', active:true}));
  exec('curl -sk -m 20 -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/b557.json "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  var r=exec('curl -sk -m 25 "'+BASE+'/?psc_htmlchk=1&k=ps2026"');
  var m=r.match(/(\{.*\})/s); out.query=m?JSON.parse(m[0]):(r||'').slice(0,200);
  exec('curl -sk -m 20 -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  // Ir HTML per curl - suskaičiuojam product elementus
  var html = exec('curl -sk -m 30 "'+BASE+'/kategorija/katems/tualetai-kraikai-semtuveliai/?yith_wcan=1&filter_tipas=uzdaras-namelis&query_type_tipas=or&nc='+Date.now()+'"');
  var matches = (html.match(/li[^>]*class="[^"]*product[^"]*"/g)||[]).length;
  var resultCount = html.match(/woocommerce-result-count[^>]*>([^<]+)</);
  var nerasta = html.includes('Produktų nerasta') || html.includes('No products');
  out.html_product_li = matches;
  out.html_result_count = resultCount?resultCount[1].trim():'(nerasta count elemento)';
  out.html_says_nerasta = nerasta;
  commit('html_check.json', Buffer.from(JSON.stringify(out),'utf8').toString('base64'));
  console.log(JSON.stringify(out).slice(0,400));
})();
