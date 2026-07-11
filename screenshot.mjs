import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;for(let a=0;a<5;a++){try{const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'xv '+n,branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));const r=execSync('curl -s -w "\\nHTTP:%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8',maxBuffer:50000000});if(/HTTP:20[01]/.test(r))return true;}catch(e){}execSync('sleep 3');}return false;}
let out='';const L=s=>{out+=s+'\n';console.log(s);};
const BASE='https://dev.avesa.lt';
const PROD='/product/exclusion-hepatic-dietinis-sausas-sunu-maistas-su-kiauliena-ryziais-ir-zirneliais-m-l-12kg/';
function rel(cs){return cs.filter(c=>/^cmplz/.test(c.name)).map(c=>c.name+'='+c.value).sort();}
(async()=>{const R={};let browser;try{
  browser=await chromium.launch({args:['--no-sandbox']});
  const ctx=await browser.newContext({ignoreHTTPSErrors:true,viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const page=await ctx.newPage();
  await page.goto(BASE+PROD,{waitUntil:'domcontentloaded',timeout:60000});await page.waitForTimeout(4500);
  L('Cookies PRIES: '+JSON.stringify(rel(await ctx.cookies())));
  const clicked=await page.evaluate(()=>{var x=document.querySelector('.cmplz-cookiebanner .cmplz-close');if(x){x.click();return true;}return false;});
  L('X paspaustas: '+clicked);
  await page.waitForTimeout(2500);
  const after=rel(await ctx.cookies());
  R.after=after;
  L('Cookies PO X: '+JSON.stringify(after));
  const hasStat=after.some(c=>/cmplz_statistics=deny/.test(c));
  const hasMkt=after.some(c=>/cmplz_marketing=deny/.test(c));
  const hasFunc=after.some(c=>/cmplz_functional=allow/.test(c));
  const hasPolicy=after.some(c=>/cmplz_policy_id=/.test(c));
  L('=== PATIKRA: X dabar = ATMESTI? ===');
  L('  cmplz_statistics=deny: '+hasStat);
  L('  cmplz_marketing=deny: '+hasMkt);
  L('  cmplz_functional=allow: '+hasFunc);
  L('  cmplz_policy_id yra: '+hasPolicy);
  R.verdict=(hasStat&&hasMkt&&hasFunc&&hasPolicy)?'PASS - X = ATMESTI (pilnas deny uzfiksuotas)':'FAIL - vis dar ne deny';
  L('  VERDIKTAS: '+R.verdict);
  // navigacija - ar issilaiko
  await page.goto(BASE+'/',{waitUntil:'domcontentloaded',timeout:60000});await page.waitForTimeout(3000);
  const nav=rel(await ctx.cookies());
  const bannerVis=await page.evaluate(()=>{var el=document.querySelector('.cmplz-cookiebanner');return el?el.classList.contains('cmplz-show'):false;});
  L('Po navigacijos cookies: '+JSON.stringify(nav));
  L('Baneris vel matomas: '+bannerVis+' (turi buti false)');
  L('DONE');
}catch(e){L('!!! '+(e&&e.stack?e.stack:e));}finally{try{if(browser)await browser.close();}catch(e){}putText('cmplz_xverify.json',JSON.stringify(R,null,2));putText('_run7_log.txt',out);}})();
