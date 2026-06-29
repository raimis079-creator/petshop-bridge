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
function commitTxt(name,str){
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){}
  const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha;
  fs.writeFileSync('/tmp/cb2.json',JSON.stringify(body));
  try{ execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb2.json "'+url+'"',{encoding:'utf8'}); }catch(e){}
}
const URL='https://dev.avesa.lt/product/rinkinys-isrankiems-sunims-%c2%b7-6x400g/';
const log={steps:[]};
(async()=>{
  const browser=await chromium.launch({args:['--no-sandbox']});
  const ctx=await browser.newContext({ignoreHTTPSErrors:true, viewport:{width:1440,height:1400}, userAgent:'Mozilla/5.0'});
  const page=await ctx.newPage();
  try{
    await page.goto(URL+'?nc='+Date.now(),{waitUntil:'domcontentloaded',timeout:60000});
    await page.waitForTimeout(5000);
    log.steps.push('loaded');
  }catch(e){ log.steps.push('goto '+String(e).slice(0,60)); }
  putBin('rink_desk_full.png', await page.screenshot({fullPage:true}));
  putBin('rink_desk_top.png', await page.screenshot({clip:{x:0,y:0,width:1440,height:1100}}));
  // mobile
  await ctx.close();
  const mctx=await browser.newContext({ignoreHTTPSErrors:true, viewport:{width:390,height:1800}, userAgent:'Mozilla/5.0 iPhone'});
  const mp=await mctx.newPage();
  try{
    await mp.goto(URL+'?nc='+Date.now(),{waitUntil:'domcontentloaded',timeout:60000});
    await mp.waitForTimeout(4500);
    log.steps.push('mobile loaded');
  }catch(e){}
  putBin('rink_mob_full.png', await mp.screenshot({fullPage:true}));
  // grab visible text + form structure
  try{
    const info = await mp.evaluate(()=>({
      title: document.querySelector('h1')?.textContent?.trim().slice(0,80),
      hasOos: /out of stock|nebėra|šio produkto/i.test(document.body.innerText||''),
      hasAddBtn: !!document.querySelector('button.single_add_to_cart_button, .single_add_to_cart_button'),
      hasMnmForm: !!document.querySelector('.mnm_form, form.cart, .mnm-child-products, .mnm_child_product, .wc-mnm-child'),
      qtyInputs: document.querySelectorAll('input.qty, input[type=number]').length,
      bodyTextSample: (document.querySelector('main')||document.body).innerText.slice(0,1200)
    }));
    commitTxt('rink_dom.txt', JSON.stringify(info,null,2));
  }catch(e){}
  commitTxt('rink_visual_log.json', JSON.stringify(log,null,1));
  await mctx.close(); await browser.close();
})();
