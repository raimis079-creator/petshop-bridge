import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commitB64(name,b64){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'vf2',branch:'main',content:b64}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbvf2.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbvf2.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:60000}); }catch(e){ return 'EXC:'+e.message; } }
const pcode=Buffer.from("YWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCgkX0dFVFsncHNjX3ZlcmlmeTInXSA/PyAnJykgIT09ICcxJykgcmV0dXJuOwogIGlmICgoJF9HRVRbJ2snXSA/PyAnJykgIT09ICdwczIwMjYnICYmICFjdXJyZW50X3VzZXJfY2FuKCdtYW5hZ2Vfb3B0aW9ucycpKSByZXR1cm47CiAgJGFjdGlvbiA9ICRfR0VUWydhY3Rpb24nXSA/PyAnJzsKICAkcGFyZW50X2lkID0gMzQyNTM7ICRwYWdlX2lkID0gMzQyNTQ7CiAgaWYgKCRhY3Rpb24gPT09ICdwdWJsaXNoJykgewogICAgd3BfdXBkYXRlX3Bvc3QoYXJyYXkoJ0lEJz0+JHBhcmVudF9pZCwncG9zdF9zdGF0dXMnPT4ncHVibGlzaCcpKTsKICAgIHdwX3VwZGF0ZV9wb3N0KGFycmF5KCdJRCc9PiRwYWdlX2lkLCdwb3N0X3N0YXR1cyc9PidwdWJsaXNoJykpOwogICAgZWNobyAnb2snOyBleGl0OwogIH0KICBpZiAoJGFjdGlvbiA9PT0gJ3JldmVydCcpIHsKICAgIHdwX3VwZGF0ZV9wb3N0KGFycmF5KCdJRCc9PiRwYXJlbnRfaWQsJ3Bvc3Rfc3RhdHVzJz0+J2RyYWZ0JykpOwogICAgd3BfdXBkYXRlX3Bvc3QoYXJyYXkoJ0lEJz0+JHBhZ2VfaWQsJ3Bvc3Rfc3RhdHVzJz0+J2RyYWZ0JykpOwogICAgZWNobyAnb2snOyBleGl0OwogIH0KfSk7Cg==",'base64').toString('utf8').trim();
(async()=>{
  var out={};
  fs.writeFileSync('/tmp/b557.json', JSON.stringify({name:'PSC VERIFY2', code:pcode, scope:'global', active:true}));
  exec('curl -sk -m 20 -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/b557.json "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  exec('curl -sk -m 20 "'+BASE+'/?psc_verify2=1&k=ps2026&action=publish"');
  var url = BASE+'/sprendimai/isrankus-augintinis/';

  try{
    const { chromium } = await import('playwright');
    const b=await chromium.launch({args:['--no-sandbox']});
    const c=await b.newContext({ignoreHTTPSErrors:true,viewport:{width:1300,height:1400}});
    const p=await c.newPage();
    await p.goto(url+'?nc='+Date.now(),{waitUntil:'domcontentloaded',timeout:25000});
    await p.waitForTimeout(3500);
    out.h1_all = await p.evaluate(()=> [].slice.call(document.querySelectorAll('h1')).map(function(h){return h.textContent.trim();}));
    out.cols_count = await p.evaluate(()=> document.querySelectorAll('.psc-sol-cols').length);
    out.per_col_products = await p.evaluate(()=> [].slice.call(document.querySelectorAll('.psc-sol-col')).map(function(c){return {cards:c.querySelectorAll('.psc-sol-card').length, products:c.querySelectorAll('.psc-sol-product').length, h3:(c.querySelector('h3')?c.querySelector('h3').textContent.trim():'')};}));
    out.all_ids = await p.evaluate(()=> [].slice.call(document.querySelectorAll('.psc-sol-product')).map(function(el){var a=el.querySelector('a.psc-sol-product-img'); var m=a?a.href:''; var btn=el.querySelector('[data-product_id]'); return btn?btn.getAttribute('data-product_id'):m;}));
    out.faq_open_test = await p.evaluate(()=>{ var d=document.querySelector('.psc-sol-faq details'); if(!d) return 'nera'; return d.tagName; });
    const buf=await p.screenshot({fullPage:true});
    commitB64('sprendimai_full2.png', buf.toString('base64'));
    await b.close();
  }catch(e){ out.shot_err = e.message.slice(0,200); }

  exec('curl -sk -m 20 "'+BASE+'/?psc_verify2=1&k=ps2026&action=revert"');
  exec('curl -sk -m 20 -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  commitB64('verify2.json', Buffer.from(JSON.stringify(out),'utf8').toString('base64'));
  console.log(JSON.stringify(out).slice(0,600));
})();
