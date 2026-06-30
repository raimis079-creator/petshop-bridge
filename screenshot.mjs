import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function putBin(name,buf){
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){}
  const body={message:'r',branch:'main',content:buf.toString('base64')}; if(sha) body.sha=sha;
  fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));
  try{ execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}); }catch(e){}
}
function commit(name, str){
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){}
  const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha;
  fs.writeFileSync('/tmp/cb2.json',JSON.stringify(body));
  try{ execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb2.json "'+url+'"',{encoding:'utf8'}); }catch(e){}
}
const URL='https://dev.avesa.lt/product/jaucio-ir-kiaules-ausu-rinkinys-sunims-%c2%b7-15-vnt/?nc='+Date.now();
(async()=>{
  const browser=await chromium.launch({args:['--no-sandbox']});
  const ctx=await browser.newContext({ignoreHTTPSErrors:true, viewport:{width:1440,height:1400}});
  const page=await ctx.newPage();
  await page.goto(URL,{waitUntil:'domcontentloaded',timeout:50000}).catch(()=>{});
  await page.waitForTimeout(6000);
  // Patikrinu inputs ir žymeklius
  const probe = await page.evaluate(()=>{
    const rows = document.querySelectorAll('.mnm_child_products tbody tr.mnm_item, form.cart tbody tr[data-mnm_item_id]');
    var data = [];
    rows.forEach(function(row){
      var pid = row.getAttribute('data-mnm_item_id');
      var input = row.querySelector('input[type="number"], input.qty');
      var afterText = window.getComputedStyle(row, '::after').content;
      data.push({
        pid: pid,
        input_value: input ? input.value : 'NO INPUT',
        input_min: input ? input.getAttribute('min') : '?',
        input_max: input ? input.getAttribute('max') : '?',
        data_kiekis: row.getAttribute('data-kiekis-rodyti'),
        is_required: row.className.includes('required')
      });
    });
    var btn = document.querySelector('.single_add_to_cart_button');
    return {
      rows: data,
      btn_text: btn ? btn.textContent.trim() : 'NO BTN',
      btn_disabled: btn ? btn.disabled : '?'
    };
  });
  fs.writeFileSync('/tmp/probe.json', JSON.stringify(probe,null,1));
  commit('skan_probe.json', JSON.stringify(probe,null,1));
  putBin('skan_visual.png', await page.screenshot({fullPage:false}));
  console.log(JSON.stringify(probe).slice(0,600));
  await ctx.close();
  await browser.close();
})();
