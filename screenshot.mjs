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
(async()=>{
  const browser=await chromium.launch({args:['--no-sandbox']});
  const ctx=await browser.newContext({ignoreHTTPSErrors:true, viewport:{width:1200,height:1500}});
  const page=await ctx.newPage();
  await page.goto('https://dev.avesa.lt/product/susidek-konservu-rinkini-sunims/?nc='+Date.now(),{waitUntil:'domcontentloaded',timeout:50000}).catch(()=>{});
  await page.waitForTimeout(6000);
  const probe = await page.evaluate(()=>{
    var c = document.querySelector('.petshop-choice-constructor');
    if(!c) return {found:false};
    var gramBtns = c.querySelectorAll('.psc-gram-btn').length;
    var sizeBtns = c.querySelectorAll('.psc-size-btn').length;
    var forms = c.querySelectorAll('.psc-form').length;
    var visibleForms = Array.from(c.querySelectorAll('.psc-form')).filter(f=>f.style.display!=='none').length;
    var price = c.querySelector('.psc-box-price')?.textContent;
    // Aktyvios formos pool dydis
    var visForm = Array.from(c.querySelectorAll('.psc-form')).find(f=>f.style.display!=='none');
    var poolRows = visForm ? visForm.querySelectorAll('tr.mnm_item, tr[data-mnm_item_id]').length : 0;
    return { found:true, gramBtns, sizeBtns, forms, visibleForms, price, poolRows };
  });
  commit('choice_render.json', JSON.stringify(probe,null,1));
  putBin('choice_render.png', await page.screenshot({fullPage:false}));
  console.log(JSON.stringify(probe));
  await ctx.close(); await browser.close();
})();
