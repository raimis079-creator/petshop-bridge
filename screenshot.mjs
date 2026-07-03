import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'elt',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbelt.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbelt.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:35000}); }catch(e){ return 'EXC:'+e.message; } }
const pcode=Buffer.from("YWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCgkX0dFVFsncHNjX3RyYWNlJ10gPz8gJycpICE9PSAnMScpIHJldHVybjsKICBpZiAoKCRfR0VUWydrJ10gPz8gJycpICE9PSAncHMyMDI2JyAmJiAhY3VycmVudF91c2VyX2NhbignbWFuYWdlX29wdGlvbnMnKSkgcmV0dXJuOwogIC8vIE51c3RhdG9tIHNhdm8gbG9nIGZhaWzEhSBpciDEr2p1bmdpYW0ga2xhaWTFsyBmaWtzYXZpbcSFCiAgQGluaV9zZXQoJ2xvZ19lcnJvcnMnLCcxJyk7CiAgQGluaV9zZXQoJ2Vycm9yX2xvZycsIFdQX0NPTlRFTlRfRElSLicvcHNjX3RyYWNlLmxvZycpOwogIGVycm9yX3JlcG9ydGluZyhFX0FMTCk7CiAgLy8gacWhdmFsb20gc2VuxIUKICBAdW5saW5rKFdQX0NPTlRFTlRfRElSLicvcHNjX3RyYWNlLmxvZycpOwogIC8vIHByaWRlZGFtIGhvb2snxIUga3VyaXMgZmlrc3VvcyBZSVRIIGZpbHRlciBxdWVyeQogIGFkZF9hY3Rpb24oJ3ByZV9nZXRfcG9zdHMnLCBmdW5jdGlvbigkcSl7CiAgICBpZiAoaXNzZXQoJF9SRVFVRVNUWydmaWx0ZXJfdGlwYXMnXSkpIHsKICAgICAgZXJyb3JfbG9nKCdZSVRIX1RSQUNFIHByZV9nZXRfcG9zdHM6IHRheF9xdWVyeT0nLndwX2pzb25fZW5jb2RlKCRxLT5nZXQoJ3RheF9xdWVyeScpKS4nIHwgZmlsdGVyX3RpcGFzPScuJF9SRVFVRVNUWydmaWx0ZXJfdGlwYXMnXSk7CiAgICB9CiAgfSwgOTk5KTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKGFycmF5KCd0cmFjZV9lbmFibGVkJz0+dHJ1ZSwnbG9nJz0+V1BfQ09OVEVOVF9ESVIuJy9wc2NfdHJhY2UubG9nJykpOyBleGl0Owp9KTsK",'base64').toString('utf8').trim();
(async()=>{
  var out={};
  // Šitas snippet turi likti AKTYVUS per AJAX, tad NEtriname jo iškart. Naudojam kitą slot - 556.
  fs.writeFileSync('/tmp/b556.json', JSON.stringify({name:'PSC TRACE', code:pcode, scope:'global', active:true}));
  exec('curl -sk -m 20 -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/b556.json "'+BASE+'/wp-json/code-snippets/v1/snippets/556"');
  // aktyvuojam trace
  var r=exec('curl -sk -m 25 "'+BASE+'/?psc_trace=1&k=ps2026"');
  out.enable = r.slice(0,150);
  // dabar simuliuojam filtro AJAX per naršyklę
  try{
    const { chromium } = await import('playwright');
    const b=await chromium.launch({args:['--no-sandbox']});
    const c=await b.newContext({ignoreHTTPSErrors:true});
    const p=await c.newPage();
    await p.goto(BASE+'/kategorija/katems/tualetai-kraikai-semtuveliai/?nc='+Date.now(),{waitUntil:'domcontentloaded',timeout:40000});
    await p.waitForTimeout(4000);
    var links = await p.$$('a');
    for (var l of links){ var txt=await l.textContent(); if(txt && txt.trim()==='Uždaras tualetas / namelis'){ await l.click(); break; } }
    await p.waitForTimeout(6000);
    await b.close();
  }catch(e){ out.click_err=e.message.slice(0,80); }
  commit('trace_enabled.json', Buffer.from(JSON.stringify(out),'utf8').toString('base64'));
  console.log(JSON.stringify(out).slice(0,300));
})();
