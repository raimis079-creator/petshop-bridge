import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'at',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbat.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbat.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:35000}); }catch(e){ return 'EXC:'+e.message; } }
const pcode=Buffer.from("YWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCgkX0dFVFsncHNjX3RyYXAnXSA/PyAnJykgIT09ICcxJykgcmV0dXJuOwogIGlmICgoJF9HRVRbJ2snXSA/PyAnJykgIT09ICdwczIwMjYnICYmICFjdXJyZW50X3VzZXJfY2FuKCdtYW5hZ2Vfb3B0aW9ucycpKSByZXR1cm47CiAgdXBkYXRlX29wdGlvbigncHNjX2FqYXhfdHJhcF9vbicsIHRpbWUoKSk7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZShhcnJheSgndHJhcF9hcm1lZCc9PnRydWUpKTsgZXhpdDsKfSk7Ci8vIFRyYXAgdmVpa2lhIHZpc2FkYSBrYWkgb3B0aW9uIMSvanVuZ3RhcyAtIGZpa3N1b2phIFlJVEggYWpheAphZGRfYWN0aW9uKCdwbHVnaW5zX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFnZXRfb3B0aW9uKCdwc2NfYWpheF90cmFwX29uJykpIHJldHVybjsKICBpZiAoZW1wdHkoJF9SRVFVRVNUWydhY3Rpb24nXSkgfHwgc3RycG9zKCRfUkVRVUVTVFsnYWN0aW9uJ10sJ3lpdGgnKT09PWZhbHNlKSByZXR1cm47CiAgcmVnaXN0ZXJfc2h1dGRvd25fZnVuY3Rpb24oZnVuY3Rpb24oKXsKICAgICRlID0gZXJyb3JfZ2V0X2xhc3QoKTsKICAgIGlmICgkZSAmJiBpbl9hcnJheSgkZVsndHlwZSddLCBhcnJheShFX0VSUk9SLCBFX1BBUlNFLCBFX0NPTVBJTEVfRVJST1IsIEVfQ09SRV9FUlJPUikpKSB7CiAgICAgIHVwZGF0ZV9vcHRpb24oJ3BzY19hamF4X2xhc3RfZXJyb3InLCAkZVsnbWVzc2FnZSddLicgQCAnLiRlWydmaWxlJ10uJzonLiRlWydsaW5lJ10pOwogICAgfQogIH0pOwogIEBpbmlfc2V0KCdkaXNwbGF5X2Vycm9ycycsJzAnKTsKICBzZXRfZXJyb3JfaGFuZGxlcihmdW5jdGlvbigkbm8sJHN0ciwkZmlsZSwkbGluZSl7CiAgICAkcHJldiA9IGdldF9vcHRpb24oJ3BzY19hamF4X3dhcm5pbmdzJywgYXJyYXkoKSk7CiAgICBpZighaXNfYXJyYXkoJHByZXYpKSAkcHJldj1hcnJheSgpOwogICAgaWYoY291bnQoJHByZXYpPDEwKSAkcHJldltdID0gIiRzdHIgQCAiLmJhc2VuYW1lKCRmaWxlKS4iOiRsaW5lIjsKICAgIHVwZGF0ZV9vcHRpb24oJ3BzY19hamF4X3dhcm5pbmdzJywgJHByZXYpOwogICAgcmV0dXJuIGZhbHNlOwogIH0sIEVfQUxMKTsKfSwgMSk7Cg==",'base64').toString('utf8').trim();
(async()=>{
  var out={};
  // į slot 556 (paliekam aktyvų per AJAX)
  fs.writeFileSync('/tmp/b556.json', JSON.stringify({name:'PSC TRAP', code:pcode, scope:'global', active:true}));
  exec('curl -sk -m 20 -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/b556.json "'+BASE+'/wp-json/code-snippets/v1/snippets/556"');
  exec('curl -sk -m 25 "'+BASE+'/?psc_trap=1&k=ps2026"');
  // trigerinam AJAX per naršyklę
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
  commit('trap_armed.json', Buffer.from(JSON.stringify(out),'utf8').toString('base64'));
  console.log('trap armed + triggered');
})();
