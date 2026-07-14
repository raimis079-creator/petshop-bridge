import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";
function putBin(n,localPath){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const content=fs.readFileSync(localPath).toString('base64');const b={message:'x',branch:'main',content:content};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pb.json',JSON.stringify(b));execSync('curl -s --max-time 60 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pb.json "'+url+'"',{encoding:'utf8'});}
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'x',branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));execSync('curl -s --max-time 40 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});}
const BASE='https://dev.avesa.lt';
(async()=>{
  let log='';const L=s=>{log+=s+'\n';};
  const browser=await chromium.launch();
  const ctx=await browser.newContext({viewport:{width:400,height:900},ignoreHTTPSErrors:true});
  const page=await ctx.newPage();
  const errs=[];
  page.on('console',m=>{if(m.type()==='error')errs.push(m.text());});
  page.on('pageerror',e=>errs.push('PAGEERR: '+e.message));

  await page.goto(BASE+'/anketa-testas/?nc='+Date.now(),{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(3000);

  // Ar anketa uzsirenderino?
  const hasTitle = await page.locator('.pspet-title').count();
  L('pspet-title count: '+hasTitle);
  const titleText = hasTitle ? await page.locator('.pspet-title').first().innerText() : '(nera)';
  L('title: '+titleText);
  const pillCount = await page.locator('.pspet-pill').count();
  L('pills: '+pillCount);

  await page.screenshot({path:'/tmp/s1_step1.png',fullPage:true});

  // Paspaudziam "Suo"
  if(pillCount>0){
    await page.locator('.pspet-pill:has-text("Šuo")').first().click();
    await page.waitForTimeout(500);
    const needVisible = await page.locator('.pspet-need-field .pspet-pill').count();
    L('after dog click, need pills: '+needVisible);
    await page.screenshot({path:'/tmp/s2_dog.png',fullPage:true});

    // Iveskim varda
    await page.locator('.pspet-input').first().fill('Reksas');
    await page.waitForTimeout(300);

    // Testi
    await page.locator('.pspet-btn-primary:has-text("Tęsti")').click();
    await page.waitForTimeout(800);
    const step2title = await page.locator('.pspet-title').first().innerText();
    L('step2 title: '+step2title);
    const step2pills = await page.locator('.pspet-pill').count();
    L('step2 pills: '+step2pills);
    await page.screenshot({path:'/tmp/s3_step2.png',fullPage:true});
  }

  L('JS errors: '+(errs.length?errs.slice(0,5).join(' | '):'NONE'));
  await browser.close();
  putText('ui_visual.txt',log);
  putBin('ui_s1.png','/tmp/s1_step1.png');
  putBin('ui_s2.png','/tmp/s2_dog.png');
  putBin('ui_s3.png','/tmp/s3_step2.png');
})();
