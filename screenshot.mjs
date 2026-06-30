import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){}
  const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha;
  fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));
  try{ execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}); }catch(e){}
}
const URL='https://dev.avesa.lt/product/vandenynas-konservu-rinkinys-katems/?nc='+Date.now();
(async()=>{
  const browser=await chromium.launch({args:['--no-sandbox']});
  const ctx=await browser.newContext({ignoreHTTPSErrors:true, viewport:{width:1440,height:1700}});
  const page=await ctx.newPage();
  await page.goto(URL,{waitUntil:'domcontentloaded',timeout:50000}).catch(()=>{});
  await page.waitForTimeout(5000);
  // Ištrauk pirmos eilutės pilną HTML
  const html = await page.evaluate(()=>{
    const tr = document.querySelector('.mnm_child_products tbody tr, form.cart tbody tr');
    if(!tr) return 'NO ROW';
    return {
      classes: tr.className,
      data_attrs: Object.assign({}, ...Array.from(tr.attributes).filter(a=>a.name.startsWith('data-')).map(a=>({[a.name]:a.value}))),
      inputs: Array.from(tr.querySelectorAll('input')).map(i=>({name:i.name, value:i.value, type:i.type})),
      td_classes: Array.from(tr.querySelectorAll('td')).map(td=>td.className),
      html_first200: tr.outerHTML.slice(0,600)
    };
  });
  commit('mnm_dom_recon.json', JSON.stringify(html,null,1));
  console.log("DONE");
  await ctx.close();
  await browser.close();
})();
