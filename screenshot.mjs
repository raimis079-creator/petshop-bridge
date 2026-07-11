import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;for(let a=0;a<5;a++){try{const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'v '+n,branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));const r=execSync('curl -s -w "\\nHTTP:%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8',maxBuffer:50000000});if(/HTTP:20[01]/.test(r))return true;}catch(e){}execSync('sleep 3');}return false;}
function putBinary(path,buf){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;for(let a=0;a<5;a++){try{const url='https://api.github.com/repos/'+repo+'/contents/'+path;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'img '+path,branch:'main',content:buf.toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pb.json',JSON.stringify(b));const r=execSync('curl -s -w "\\nHTTP:%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pb.json "'+url+'"',{encoding:'utf8',maxBuffer:50000000});if(/HTTP:20[01]/.test(r))return true;}catch(e){}execSync('sleep 3');}return false;}
let out='';const L=s=>{out+=s+'\n';console.log(s);};
const BASE='https://dev.avesa.lt';
const PROD='/product/exclusion-hepatic-dietinis-sausas-sunu-maistas-su-kiauliena-ryziais-ir-zirneliais-m-l-12kg/';
(async()=>{
  const R={};let browser;
  try{
    browser=await chromium.launch({args:['--no-sandbox']});
    const ctx=await browser.newContext({ignoreHTTPSErrors:true,viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true,userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'});
    const page=await ctx.newPage();
    L('=== LIVE PROD (be injekcijos - tikras rezultatas) ===');
    await page.goto(BASE+PROD,{waitUntil:'domcontentloaded',timeout:60000});
    await page.waitForTimeout(4500);
    const info=await page.evaluate(()=>{const el=document.querySelector('.cmplz-cookiebanner');if(!el)return{found:false};const r=el.getBoundingClientRect();const cs=getComputedStyle(el);return{found:true,rect:{y:Math.round(r.y),h:Math.round(r.height)},vh:window.innerHeight,borderRadius:cs.borderRadius,maxHeight:cs.maxHeight};});
    R.live=info;
    if(info.found){const pct=Math.round(info.rect.h/info.vh*100);L('  Baneris LIVE: y='+info.rect.y+' h='+info.rect.h+'px ('+pct+'%) | radius='+info.borderRadius+' maxH='+info.maxHeight);L('  Turinio virs banerio: '+info.rect.y+'px is '+info.vh);}
    else L('  Baneris nerastas (gal consent cookie yra)');
    putBinary('screenshots/mobile_live_product.png', await page.screenshot({fullPage:false}));
    L('  screenshots/mobile_live_product.png OK');
    L('=== LIVE HOME ===');
    await page.goto(BASE+'/',{waitUntil:'domcontentloaded',timeout:60000});await page.waitForTimeout(3500);
    putBinary('screenshots/mobile_live_home.png', await page.screenshot({fullPage:false}));
    L('  screenshots/mobile_live_home.png OK');
    L('DONE');
  }catch(e){L('!!! EXC: '+(e&&e.stack?e.stack:String(e)));}
  finally{try{if(browser)await browser.close();}catch(e){}putText('cmplz_verify.json',JSON.stringify(R,null,2));putText('_run3_log.txt',out);}
})();
