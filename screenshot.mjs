import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";
function putBinary(n,buf){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;for(let a=0;a<5;a++){try{const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'shot '+n,branch:'main',content:buf.toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pb.json',JSON.stringify(b));const r=execSync('curl -s -w "\\nHTTP:%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pb.json "'+url+'"',{encoding:'utf8',maxBuffer:80000000});if(/HTTP:20[01]/.test(r))return true;}catch(e){}execSync('sleep 3');}return false;}
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;try{const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'log',branch:'main',content:Buffer.from(s).toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pt.json',JSON.stringify(b));execSync('curl -s -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pt.json "'+url+'"');}catch(e){}}
let log='';
(async()=>{
  const URL='https://dev.avesa.lt/?taxonomy=pa_speciali_mityba&term=hipoalerginis';
  let browser;
  try{
    browser=await chromium.launch({args:['--no-sandbox','--ignore-certificate-errors']});
    const ctx=await browser.newContext({ignoreHTTPSErrors:true,viewport:{width:1440,height:2400}});
    const page=await ctx.newPage();
    await page.goto(URL,{waitUntil:'domcontentloaded',timeout:60000});
    await page.waitForTimeout(6000);
    const buf=await page.screenshot({fullPage:true});
    log+='shot bytes '+buf.length+'\n';
    putBinary('hipoalerginis_filtras.png',buf);
    // taip pat istraukiam matomu prekiu pavadinimus
    const titles=await page.$$eval('.product h2, .product .woocommerce-loop-product__title, li.product a.woocommerce-LoopProduct-link', els=>els.slice(0,20).map(e=>e.textContent.trim()));
    log+='matomos prekes: '+JSON.stringify(titles).slice(0,1500)+'\n';
  }catch(e){log+='ERR '+e+'\n';}
  finally{if(browser)await browser.close();putText('_shot_log.txt',log);}
})();
