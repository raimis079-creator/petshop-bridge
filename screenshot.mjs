import { execSync } from "child_process";
import fs from "fs";
const BASE="https://dev.avesa.lt";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commitB64(name,b64){
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){}
  const body={message:'verify2',branch:'main',content:b64}; if(sha) body.sha=sha;
  fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));
  execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'});
}
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000}); }catch(e){ return 'EXC:'+e.message; } }
(async()=>{
  // resolve permalink then fetch with -L
  var html = exec('curl -skL "'+BASE+'/?p=34207"');
  var labels=[]; var re=/psc-group-btn[^>]*>\s*<span class="psc-btn-big">([^<]+)<\/span>/g, mm;
  while((mm=re.exec(html))!==null){ labels.push(mm[1].trim()); }
  var res={final_url_len:html.length, group_labels:labels, has_garbage: html.indexOf('016bdu0173')>=0, has_begrudu: html.indexOf('Be grūdų')>=0};
  commitB64('verify34207.json', Buffer.from(JSON.stringify(res),'utf8').toString('base64'));
  console.log(JSON.stringify(res));
  try{
    const { chromium } = await import('playwright');
    const browser = await chromium.launch({args:['--no-sandbox']});
    const ctx = await browser.newContext({ ignoreHTTPSErrors:true, viewport:{width:1300,height:980} });
    const page = await ctx.newPage();
    await page.goto(BASE+'/?p=34207',{waitUntil:'domcontentloaded'});
    await page.waitForTimeout(4000);
    const buf = await page.screenshot({fullPage:false});
    commitB64('verify34207.png', buf.toString('base64'));
    await browser.close();
    console.log('shot OK bytes='+buf.length);
  }catch(e){ console.log('shot EXC:'+e.message); }
})();
