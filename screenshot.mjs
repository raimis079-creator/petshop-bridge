import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commitB64(name,b64){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'vf1',branch:'main',content:b64}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbvf1.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbvf1.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:60000}); }catch(e){ return 'EXC:'+e.message; } }
const pcode=Buffer.from("YWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCgkX0dFVFsncHNjX3ZlcmlmeTEnXSA/PyAnJykgIT09ICcxJykgcmV0dXJuOwogIGlmICgoJF9HRVRbJ2snXSA/PyAnJykgIT09ICdwczIwMjYnICYmICFjdXJyZW50X3VzZXJfY2FuKCdtYW5hZ2Vfb3B0aW9ucycpKSByZXR1cm47CiAgJGFjdGlvbiA9ICRfR0VUWydhY3Rpb24nXSA/PyAnJzsKICAkcGFyZW50X2lkID0gMzQyNTM7ICRwYWdlX2lkID0gMzQyNTQ7CiAgaWYgKCRhY3Rpb24gPT09ICdwdWJsaXNoJykgewogICAgd3BfdXBkYXRlX3Bvc3QoYXJyYXkoJ0lEJz0+JHBhcmVudF9pZCwncG9zdF9zdGF0dXMnPT4ncHVibGlzaCcpKTsKICAgIHdwX3VwZGF0ZV9wb3N0KGFycmF5KCdJRCc9PiRwYWdlX2lkLCdwb3N0X3N0YXR1cyc9PidwdWJsaXNoJykpOwogICAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsKICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoYXJyYXkoJ3BhcmVudF9zdGF0dXMnPT5nZXRfcG9zdF9zdGF0dXMoJHBhcmVudF9pZCksJ3BhZ2Vfc3RhdHVzJz0+Z2V0X3Bvc3Rfc3RhdHVzKCRwYWdlX2lkKSwncGFnZV9saW5rJz0+Z2V0X3Blcm1hbGluaygkcGFnZV9pZCkpKTsgZXhpdDsKICB9CiAgaWYgKCRhY3Rpb24gPT09ICdyZXZlcnQnKSB7CiAgICB3cF91cGRhdGVfcG9zdChhcnJheSgnSUQnPT4kcGFyZW50X2lkLCdwb3N0X3N0YXR1cyc9PidkcmFmdCcpKTsKICAgIHdwX3VwZGF0ZV9wb3N0KGFycmF5KCdJRCc9PiRwYWdlX2lkLCdwb3N0X3N0YXR1cyc9PidkcmFmdCcpKTsKICAgIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7CiAgICBlY2hvIHdwX2pzb25fZW5jb2RlKGFycmF5KCdwYXJlbnRfc3RhdHVzJz0+Z2V0X3Bvc3Rfc3RhdHVzKCRwYXJlbnRfaWQpLCdwYWdlX3N0YXR1cyc9PmdldF9wb3N0X3N0YXR1cygkcGFnZV9pZCkpKTsgZXhpdDsKICB9CiAgaWYgKCRhY3Rpb24gPT09ICdjcm9zc2NoZWNrJykgewogICAgLy8gTmVwcmlrbGF1c29tYXMgcGF0aWtyaW5pbWFzOiBrb2tpZSBwcm9kdWt0YWkgacWhIHRpa3LFs2rFsyB5cmEgQVYgKGxlZ2FjeSkgdG9zZSAyIGtvbnNlcnbFsyBrYXRlZ29yaWpvc2UKICAgIGZ1bmN0aW9uIHBzY19yZXNvbHZlKCRwaWQpewogICAgICBpZiAoY2xhc3NfZXhpc3RzKCdQZXRzaG9wX0Z1bGZpbGxtZW50X1NvdXJjZScpKSB7CiAgICAgICAgdHJ5IHsgJHIgPSBQZXRzaG9wX0Z1bGZpbGxtZW50X1NvdXJjZTo6cmVzb2x2ZSgkcGlkKTsgaWYgKGlzX2FycmF5KCRyKSAmJiAhZW1wdHkoJHJbJ3NvdXJjZSddKSkgcmV0dXJuICRyWydzb3VyY2UnXTsgaWYgKGlzX29iamVjdCgkcikgJiYgIWVtcHR5KCRyLT5zb3VyY2UpKSByZXR1cm4gJHItPnNvdXJjZTsgfSBjYXRjaCAoXFRocm93YWJsZSAkZSkge30KICAgICAgfQogICAgICBpZiAoZ2V0X3Bvc3RfbWV0YSgkcGlkLCdfdmZfZW5hYmxlZCcsdHJ1ZSk9PT0neWVzJykgcmV0dXJuICd2Zic7CiAgICAgIGlmIChnZXRfcG9zdF9tZXRhKCRwaWQsJ196Yl9lbmFibGVkJyx0cnVlKT09PSd5ZXMnKSByZXR1cm4gJ3piJzsKICAgICAgcmV0dXJuICdsZWdhY3knOwogICAgfQogICAgJGlkc19kb2cgPSBnZXRfcG9zdHMoYXJyYXkoJ3Bvc3RfdHlwZSc9Pidwcm9kdWN0JywncG9zdF9zdGF0dXMnPT4ncHVibGlzaCcsJ3Bvc3RzX3Blcl9wYWdlJz0+LTEsJ2ZpZWxkcyc9PidpZHMnLAogICAgICAndGF4X3F1ZXJ5Jz0+YXJyYXkoYXJyYXkoJ3RheG9ub215Jz0+J3Byb2R1Y3RfY2F0JywnZmllbGQnPT4nc2x1ZycsJ3Rlcm1zJz0+J2tvbnNlcnZhaS1zdW5pbXMnKSkpKTsKICAgICRhdl9kb2cgPSBhcnJheSgpOyBmb3JlYWNoKCRpZHNfZG9nIGFzICRwaWQpeyBpZihwc2NfcmVzb2x2ZSgkcGlkKT09PSdsZWdhY3knKXsgJHA9d2NfZ2V0X3Byb2R1Y3QoJHBpZCk7IGlmKCRwICYmICRwLT5pc19pbl9zdG9jaygpKSAkYXZfZG9nW109JHBpZDsgfSB9CiAgICAkaWRzX2NhdCA9IGdldF9wb3N0cyhhcnJheSgncG9zdF90eXBlJz0+J3Byb2R1Y3QnLCdwb3N0X3N0YXR1cyc9PidwdWJsaXNoJywncG9zdHNfcGVyX3BhZ2UnPT4tMSwnZmllbGRzJz0+J2lkcycsCiAgICAgICd0YXhfcXVlcnknPT5hcnJheShhcnJheSgndGF4b25vbXknPT4ncHJvZHVjdF9jYXQnLCdmaWVsZCc9PidzbHVnJywndGVybXMnPT4na29uc2VydmFpLWthdGVtcycpKSkpOwogICAgJGF2X2NhdCA9IGFycmF5KCk7IGZvcmVhY2goJGlkc19jYXQgYXMgJHBpZCl7IGlmKHBzY19yZXNvbHZlKCRwaWQpPT09J2xlZ2FjeScpeyAkcD13Y19nZXRfcHJvZHVjdCgkcGlkKTsgaWYoJHAgJiYgJHAtPmlzX2luX3N0b2NrKCkpICRhdl9jYXRbXT0kcGlkOyB9IH0KICAgIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7CiAgICBlY2hvIHdwX2pzb25fZW5jb2RlKGFycmF5KCdhdl9kb2dfaWRzJz0+JGF2X2RvZywnYXZfY2F0X2lkcyc9PiRhdl9jYXQsJ2F2X2RvZ19uJz0+Y291bnQoJGF2X2RvZyksJ2F2X2NhdF9uJz0+Y291bnQoJGF2X2NhdCkpKTsgZXhpdDsKICB9Cn0pOwo=",'base64').toString('utf8').trim();
(async()=>{
  var out={};
  fs.writeFileSync('/tmp/b557.json', JSON.stringify({name:'PSC VERIFY1', code:pcode, scope:'global', active:true}));
  exec('curl -sk -m 20 -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/b557.json "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');

  // 1. cross-check AV ids independently
  var cc=exec('curl -sk -m 30 "'+BASE+'/?psc_verify1=1&k=ps2026&action=crosscheck"');
  var mcc=cc.match(/(\{.*\})/s); out.crosscheck = mcc?JSON.parse(mcc[0]):null;

  // 2. publish temporarily
  var pub=exec('curl -sk -m 20 "'+BASE+'/?psc_verify1=1&k=ps2026&action=publish"');
  var mpub=pub.match(/(\{.*\})/s); out.publish = mpub?JSON.parse(mpub[0]):null;
  var url = (out.publish && out.publish.page_link) ? out.publish.page_link : BASE+'/?page_id=34254';

  try{
    const { chromium } = await import('playwright');
    const b=await chromium.launch({args:['--no-sandbox']});
    const c=await b.newContext({ignoreHTTPSErrors:true,viewport:{width:1300,height:1400}});
    const p=await c.newPage();
    await p.goto(url+(url.includes('?')?'&':'?')+'nc='+Date.now(),{waitUntil:'domcontentloaded',timeout:25000});
    await p.waitForTimeout(3500);
    out.title = await p.evaluate(()=> document.querySelector('h1')?document.querySelector('h1').textContent.trim():'');
    out.bundle_cards = await p.evaluate(()=> document.querySelectorAll('.psc-sol-card').length);
    out.grid_products_dog = await p.evaluate(()=>{ var cols=document.querySelectorAll('.psc-sol-col'); if(cols.length<1) return -1; return cols[0].querySelectorAll('.psc-sol-product').length; });
    out.grid_products_cat = await p.evaluate(()=>{ var cols=document.querySelectorAll('.psc-sol-col'); if(cols.length<4) return -1; return cols[3].querySelectorAll('.psc-sol-product').length; });
    out.all_product_links = await p.evaluate(()=> [].slice.call(document.querySelectorAll('.psc-sol-product-title')).map(function(a){var m=a.href.match(/-p-(\d+)|product\/([^/]+)/); return a.href;}));
    out.warning_box = await p.evaluate(()=>{ var w=document.querySelector('.psc-sol-warning'); return w?w.textContent.replace(/\s+/g,' ').trim().slice(0,80):'NĖRA'; });
    out.faq_count = await p.evaluate(()=> document.querySelectorAll('.psc-sol-faq details').length);
    out.add_to_cart_buttons = await p.evaluate(()=> document.querySelectorAll('.psc-sol-product-cart .button, .psc-sol-product-cart a.add_to_cart_button').length);
    const buf=await p.screenshot({fullPage:true});
    commitB64('sprendimai_isrankus_full.png', buf.toString('base64'));
    await b.close();
  }catch(e){ out.shot_err = e.message.slice(0,200); }

  // 3. revert to draft
  var rev=exec('curl -sk -m 20 "'+BASE+'/?psc_verify1=1&k=ps2026&action=revert"');
  var mrev=rev.match(/(\{.*\})/s); out.revert = mrev?JSON.parse(mrev[0]):null;

  exec('curl -sk -m 20 -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  commitB64('verify1.json', Buffer.from(JSON.stringify(out),'utf8').toString('base64'));
  console.log(JSON.stringify(out).slice(0,500));
})();
