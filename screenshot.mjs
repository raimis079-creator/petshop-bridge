import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const WP_USER = process.env.WP_USER, WP_PASS = process.env.WP_APP_PASS;
const BASE = "https://dev.avesa.lt";
const AUTH = "Basic " + Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
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
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000}); }catch(e){ return 'EXC:'+String(e).slice(0,200); } }
function api(method, path, body){
  let cmd='curl -sk -X '+method+' -H "Authorization: '+AUTH+'" -H "Content-Type: application/json"';
  if(body!==undefined){ fs.writeFileSync('/tmp/b.json', JSON.stringify(body)); cmd+=' -d @/tmp/b.json'; }
  cmd+=' "'+BASE+path+'"';
  let raw=exec(cmd);
  try{ return JSON.parse(raw); }catch(e){ return {__raw:raw.slice(0,400)}; }
}
(async()=>{
  // Pirma — padarau produktą matomą (catalog visible) ir patikrinu child_count po cache flush
  api('PUT','/wp-json/wc/v3/products/34179', {catalog_visibility:'visible'});
  await new Promise(r=>setTimeout(r,1500));

  const browser=await chromium.launch({args:['--no-sandbox']});
  const ctx=await browser.newContext({ignoreHTTPSErrors:true, viewport:{width:1440,height:1500}});
  const page=await ctx.newPage();
  await page.goto('https://dev.avesa.lt/?p=34179&nc='+Date.now(),{waitUntil:'domcontentloaded',timeout:50000}).catch(()=>{});
  await page.waitForTimeout(6000);
  const probe = await page.evaluate(()=>{
    const rows = document.querySelectorAll('.mnm_child_products tbody tr.mnm_item, form.cart tbody tr[data-mnm_item_id]');
    var inputs = [];
    rows.forEach(function(row){
      var inp = row.querySelector('input[type="number"], input.qty');
      inputs.push({
        pid: row.getAttribute('data-mnm_item_id'),
        min: inp?inp.getAttribute('min'):'?',
        max: inp?inp.getAttribute('max'):'?',
        value: inp?inp.value:'?'
      });
    });
    var btn = document.querySelector('.single_add_to_cart_button');
    var status = document.querySelector('.mnm_status, .mnm_container_status, .mnm_message');
    return {
      child_rows: rows.length,
      inputs: inputs.slice(0,3),
      btn_text: btn?btn.textContent.trim():'NĖRA',
      status_text: status?status.textContent.trim().slice(0,80):'?'
    };
  });
  commit('choice_visual.json', JSON.stringify(probe,null,1));
  putBin('choice_visual.png', await page.screenshot({fullPage:false}));
  console.log(JSON.stringify(probe).slice(0,500));
  await ctx.close(); await browser.close();
})();
