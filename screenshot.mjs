import { chromium } from "playwright";
import { execSync } from "child_process";
import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function putFile(name, b64){
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}
  const body={message:'r',branch:'main',content:b64};if(sha)body.sha=sha;
  fs.writeFileSync('/tmp/pf.json',JSON.stringify(body));
  return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8',maxBuffer:90000000}).trim();
}
const out={steps:[]};
let browser;
try{
  browser=await chromium.launch({args:['--no-sandbox']});
  async function shot(name,width){
    const ctx=await browser.newContext({ignoreHTTPSErrors:true,viewport:{width,height:2600}});
    const page=await ctx.newPage();
    await page.goto("https://dev.avesa.lt/?p=25439&ps_desc=1",{waitUntil:'domcontentloaded',timeout:60000});
    await page.waitForTimeout(3500);
    await page.evaluate(()=>{document.querySelectorAll('details').forEach(d=>d.open=true);});
    await page.waitForTimeout(700);
    const found=await page.evaluate(()=>{
      const els=[...document.querySelectorAll('th,summary,details,p')];
      const f=els.find(e=>/Am\u017eius \(m\u0117n/.test(e.textContent||''));
      if(f){(f.closest('details')||f).scrollIntoView({block:'center'});return true;}return false;
    });
    await page.waitForTimeout(600);
    let tgt=await page.$('.ps-desc-acc');
    const buf= tgt? await tgt.screenshot() : await page.screenshot({fullPage:false});
    const code=putFile(name, buf.toString('base64'));
    out.steps.push({name,width,found,bytes:buf.length,http:code});
    await ctx.close();
  }
  await shot("vj_desktop.png",1100);
  await shot("vj_mobile.png",380);
  out.ok=true;
}catch(e){out.ok=false;out.err=String(e).slice(0,300);}
finally{ if(browser) await browser.close(); }
// result JSON
{
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/vj_result.json';
  let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}
  const body={message:'r',branch:'main',content:Buffer.from(JSON.stringify(out,null,2)).toString('base64')};if(sha)body.sha=sha;
  fs.writeFileSync('/tmp/rj.json',JSON.stringify(body));
  execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/rj.json "'+url+'"');
}
console.log("DONE "+JSON.stringify(out));
