import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";
const repo = process.env.GH_REPO, tok = process.env.GH_TOKEN;
const WP_USER = process.env.WP_USER, WP_PASS = process.env.WP_APP_PASS;
const BASE = "https://dev.avesa.lt";
const AUTH = "Basic " + Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
function commit(name, str){
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){}
  const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha;
  fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));
  execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'});
}
function putBin(name,buf){
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){}
  const body={message:'r',branch:'main',content:buf.toString('base64')}; if(sha) body.sha=sha;
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
  const out={ts:new Date().toISOString()};
  // Atnaujinu aprašymą rinkiniui 34168
  const newDesc = `<h3>Rinkinyje rasite (15 vnt.):</h3>
<ol>
  <li>5 × Balta jaučio ausis, 1 vnt.</li>
  <li>5 × Ruda jaučio ausis, 1 vnt.</li>
  <li>5 × Ruda kiaulės ausis, 1 vnt.</li>
</ol>`;
  const upd = api('PUT','/wp-json/wc/v3/products/34168', { description: newDesc });
  out.desc_updated = upd && upd.id ? 'OK' : (upd.__raw||'?');

  // Vizualus patikrinimas
  const browser=await chromium.launch({args:['--no-sandbox']});
  const ctx=await browser.newContext({ignoreHTTPSErrors:true, viewport:{width:1440,height:1100}});
  const page=await ctx.newPage();
  await page.goto('https://dev.avesa.lt/product/jaucio-ir-kiaules-ausu-rinkinys-sunims-%c2%b7-15-vnt/?nc='+Date.now(),{waitUntil:'domcontentloaded',timeout:50000}).catch(()=>{});
  await page.waitForTimeout(6000);
  const probe = await page.evaluate(()=>{
    const rows = document.querySelectorAll('.mnm_child_products tbody tr.mnm_item, form.cart tbody tr[data-mnm_item_id]');
    var data = [];
    rows.forEach(function(row){
      var input = row.querySelector('input[type="number"], input.qty');
      data.push({
        pid: row.getAttribute('data-mnm_item_id'),
        input_value: input ? input.value : '?',
        input_min: input ? input.getAttribute('min') : '?',
        input_max: input ? input.getAttribute('max') : '?',
        data_kiekis: row.getAttribute('data-kiekis-rodyti')
      });
    });
    var btn = document.querySelector('.single_add_to_cart_button');
    return { rows: data, btn_text: btn?btn.textContent.trim():'?', btn_disabled: btn?btn.disabled:'?' };
  });
  out.probe = probe;
  putBin('skan_v8.png', await page.screenshot({fullPage:false}));
  commit('skan_v8_result.json', JSON.stringify(out,null,1));
  console.log(JSON.stringify(probe).slice(0,500));
  await ctx.close();
  await browser.close();
})();
