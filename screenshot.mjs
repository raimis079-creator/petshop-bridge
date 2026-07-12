import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";
function putBinary(n,buf){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;for(let a=0;a<5;a++){try{const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'s5 '+n,branch:'main',content:buf.toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pb.json',JSON.stringify(b));const r=execSync('curl -s --max-time 50 -w "\\nHTTP:%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pb.json "'+url+'"',{encoding:'utf8',maxBuffer:80000000});if(/HTTP:20[01]/.test(r))return true;}catch(e){}execSync('sleep 3');}return false;}
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;try{const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'log',branch:'main',content:Buffer.from(s).toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pt.json',JSON.stringify(b));execSync('curl -s --max-time 40 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pt.json "'+url+'"');}catch(e){}}
let log='';
(async()=>{
  const URL='https://dev.avesa.lt/';
  let browser;
  try{
    browser=await chromium.launch({args:['--no-sandbox','--ignore-certificate-errors']});
    // MOBILE
    const ctxM=await browser.newContext({ignoreHTTPSErrors:true,viewport:{width:390,height:844},isMobile:true,hasTouch:true});
    const pM=await ctxM.newPage(); await pM.goto(URL,{waitUntil:'domcontentloaded',timeout:60000}); await pM.waitForTimeout(3500);
    try{ const cb=await pM.$('text=PRIIMTI'); if(cb){await cb.click();await pM.waitForTimeout(600);} }catch(e){}
    await pM.evaluate(()=>{var e=document.querySelector('.ps-pop');if(e)e.scrollIntoView({block:'start'});}); await pM.waitForTimeout(1000);
    log+='mobile kortele plotis: '+await pM.evaluate(()=>{var c=document.querySelector('.ps-pop-card');return c?Math.round(c.getBoundingClientRect().width):0;})+'px\n';
    log+='mobile img zona: '+await pM.evaluate(()=>{var c=document.querySelector('.ps-pop-imgwrap');return c?Math.round(c.getBoundingClientRect().height):0;})+'px\n';
    log+='mobile tab plotis: '+await pM.evaluate(()=>{var t=document.querySelector('.ps-pop-tabs');return t?Math.round(t.getBoundingClientRect().width):0;})+'px\n';
    log+='rodomu korteliu (dog): '+await pM.evaluate(()=>document.querySelectorAll('.ps-pop-panel[data-panel="dog"] .ps-pop-card').length)+'\n';
    const blkM=await pM.$('.ps-pop'); if(blkM){const b=await blkM.screenshot();putBinary('home2_mobile.png',b);}
    await ctxM.close();
    // DESKTOP
    const ctxD=await browser.newContext({ignoreHTTPSErrors:true,viewport:{width:1440,height:900}});
    const pD=await ctxD.newPage(); await pD.goto(URL,{waitUntil:'domcontentloaded',timeout:60000}); await pD.waitForTimeout(3500);
    try{ const cb=await pD.$('text=PRIIMTI'); if(cb){await cb.click();await pD.waitForTimeout(600);} }catch(e){}
    await pD.evaluate(()=>{var e=document.querySelector('.ps-pop');if(e)e.scrollIntoView({block:'center'});}); await pD.waitForTimeout(1000);
    log+='desktop rodomu (dog): '+await pD.evaluate(()=>document.querySelectorAll('.ps-pop-panel[data-panel="dog"] .ps-pop-card').length)+'\n';
    const blkD=await pD.$('.ps-pop'); if(blkD){const b=await blkD.screenshot();putBinary('home2_desktop.png',b);}
    await ctxD.close();
  }catch(e){log+='ERR '+e+'\n';}
  finally{if(browser)await browser.close();putText('_shot5_log.txt',log);}
})();
