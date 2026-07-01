import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cb2.json',JSON.stringify(body)); try{ execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb2.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
(async()=>{
  const browser=await chromium.launch({args:['--no-sandbox']});
  const ctx=await browser.newContext({ignoreHTTPSErrors:true, viewport:{width:1280,height:1100}});
  const page=await ctx.newPage();
  await page.goto('https://dev.avesa.lt/product/susirink-konservu-rinkini-sunims-pats/?nc='+Date.now(),{waitUntil:'domcontentloaded',timeout:50000}).catch(()=>{});
  await page.waitForTimeout(7000);
  const probe = await page.evaluate(()=>{
    var visForm = Array.from(document.querySelectorAll('.psc-form')).find(f=>f.style.display!=='none');
    if(!visForm) return {error:'no visible form'};
    // MnM struktūra matomoje formoje
    var addBtn = visForm.querySelector('button.single_add_to_cart_button, .mnm_add_to_cart button, button[type=submit]');
    var statusEl = visForm.querySelector('.mnm_price, .mnm_message, .mnm_status');
    var qtyInputs = visForm.querySelectorAll('.mnm_child_products input.qty, input[type=number]');
    // Ar yra data atributai su min/max?
    var container = visForm.querySelector('.mnm_form, form');
    return {
      has_add_button: !!addBtn,
      add_button_text: addBtn ? addBtn.textContent.trim().slice(0,30) : null,
      add_button_class: addBtn ? addBtn.className : null,
      add_button_disabled: addBtn ? addBtn.disabled : null,
      has_status: !!statusEl,
      status_class: statusEl ? statusEl.className : null,
      qty_input_count: qtyInputs.length,
      form_class: container ? container.className : null,
      form_data_attrs: container ? Object.keys(container.dataset) : []
    };
  });
  commit('mnm_structure.json', JSON.stringify(probe,null,1));
  console.log(JSON.stringify(probe));
  await ctx.close(); await browser.close();
})();
