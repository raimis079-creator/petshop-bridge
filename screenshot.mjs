import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cb2.json',JSON.stringify(body)); try{ execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb2.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
(async()=>{
  const browser=await chromium.launch({args:['--no-sandbox']});
  const ctx=await browser.newContext({ignoreHTTPSErrors:true, viewport:{width:1280,height:900}});
  const page=await ctx.newPage();
  await page.goto('https://dev.avesa.lt/product/susirink-konservu-rinkini-sunims-pats/?nc='+Date.now(),{waitUntil:'domcontentloaded',timeout:50000}).catch(()=>{});
  await page.waitForTimeout(8000);
  // Struktūros analizė: kur mygtukas, ar formoje
  var struct = await page.evaluate(()=>{
    var slot = document.querySelector('.psc-cta-slot');
    var btn = slot ? slot.querySelector('.single_add_to_cart_button') : null;
    if(!btn) return {error:'no button'};
    // Ar mygtukas yra <form> viduje?
    var form = btn.closest('form');
    var mnmForm = btn.closest('.mnm_form');
    // Kur originali forma?
    var visForm = Array.from(document.querySelectorAll('.psc-form')).find(f=>f.style.display!=='none');
    var origFormEl = visForm ? visForm.querySelector('form.cart, form.mnm_form') : null;
    return {
      btn_in_form: !!form,
      btn_form_class: form ? form.className : null,
      btn_in_mnm_form: !!mnmForm,
      btn_type: btn.getAttribute('type'),
      btn_name: btn.getAttribute('name'),
      orig_form_exists: !!origFormEl,
      orig_form_class: origFormEl ? origFormEl.className : null,
      // Ar slot yra formos viduje ar išorėje?
      slot_parent_chain: (function(){ var c=[]; var e=slot; for(var i=0;i<5&&e;i++){ c.push(e.tagName+'.'+(e.className||'').toString().split(' ')[0]); e=e.parentElement;} return c; })()
    };
  });
  commit('cart_debug.json', JSON.stringify(struct,null,1));
  console.log(JSON.stringify(struct));
  await ctx.close(); await browser.close();
})();
