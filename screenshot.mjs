import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";
function putBinary(n,buf){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;for(let a=0;a<5;a++){try{const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'shot '+n,branch:'main',content:buf.toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pb.json',JSON.stringify(b));const r=execSync('curl -s --max-time 50 -w "\\nHTTP:%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pb.json "'+url+'"',{encoding:'utf8',maxBuffer:80000000});if(/HTTP:20[01]/.test(r))return true;}catch(e){}execSync('sleep 3');}return false;}
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;try{const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'log',branch:'main',content:Buffer.from(s).toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pt.json',JSON.stringify(b));execSync('curl -s --max-time 40 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pt.json "'+url+'"');}catch(e){}}
let log='';
(async()=>{
  const URL='https://dev.avesa.lt/?ps_poppreview=1&token=cmplz_6680aa2a42151d54fa8d64ec';
  let browser;
  try{
    browser=await chromium.launch({args:['--no-sandbox','--ignore-certificate-errors']});
    // DESKTOP
    const ctxD=await browser.newContext({ignoreHTTPSErrors:true,viewport:{width:1280,height:1000}});
    const pD=await ctxD.newPage();
    await pD.goto(URL,{waitUntil:'domcontentloaded',timeout:60000});
    await pD.waitForTimeout(4000);
    const bD=await pD.screenshot({fullPage:true});
    log+='desktop bytes '+bD.length+'\n'; putBinary('pop_desktop.png',bD);
    await ctxD.close();
    // MOBILE
    const ctxM=await browser.newContext({ignoreHTTPSErrors:true,viewport:{width:390,height:844},isMobile:true});
    const pM=await ctxM.newPage();
    await pM.goto(URL,{waitUntil:'domcontentloaded',timeout:60000});
    await pM.waitForTimeout(4000);
    const bM=await pM.screenshot({fullPage:true});
    log+='mobile bytes '+bM.length+'\n'; putBinary('pop_mobile.png',bM);
    await ctxM.close();
  }catch(e){log+='ERR '+e+'\n';}
  finally{if(browser)await browser.close();putText('_shot2_log.txt',log);}
})();
