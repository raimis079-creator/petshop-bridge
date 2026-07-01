import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function putBin(name,buf){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'r',branch:'main',content:buf.toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cb.json',JSON.stringify(body)); try{ execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function commit(name, str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cb2.json',JSON.stringify(body)); try{ execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb2.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
(async()=>{
  const browser=await chromium.launch({args:['--no-sandbox']});
  const ctx=await browser.newContext({ignoreHTTPSErrors:true, viewport:{width:1280,height:1100}});
  const page=await ctx.newPage();
  await page.goto('https://dev.avesa.lt/product/susirink-konservu-rinkini-sunims-pats-400g-%c2%b7-12-vnt-pasleptas/?nc='+Date.now(),{waitUntil:'domcontentloaded',timeout:50000}).catch(()=>{});
  await page.waitForTimeout(8000);
  var probe = await page.evaluate(()=>{
    var vf = Array.from(document.querySelectorAll('.psc-form')).find(f=>f.style.display!=='none');
    return {
      active_gram: (document.querySelector('.psc-gram-btn.psc-active')||{}).dataset?.gram,
      active_size: (document.querySelector('.psc-size-btn.psc-active')||{}).dataset?.size,
      visible_form: vf ? (vf.dataset.gram+'_'+vf.dataset.size) : 'NĖRA',
      cans_in_visible: vf ? vf.querySelectorAll('.mnm_child_products input.qty, input[type=number]').length : 0,
      has_proxy: !!document.querySelector('.psc-proxy-cta')
    };
  });
  commit('a_e2b_check.json', JSON.stringify(probe,null,1));
  putBin('a_e2b_check.png', await page.screenshot({fullPage:false}));
  console.log(JSON.stringify(probe));
  await ctx.close(); await browser.close();
})();
