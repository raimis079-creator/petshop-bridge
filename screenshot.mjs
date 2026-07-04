import { execSync } from "child_process"; import fs from "fs";
import { chromium } from "playwright";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const URL="https://dev.avesa.lt/sprendimai/naujas-kaciukas/";
function commit(name,b64){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'sc',branch:'main',content:b64}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbsc.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbsc.json "'+url+'"',{encoding:'utf8'}); }
(async()=>{
  const browser = await chromium.launch({ ignoreHTTPSErrors: true });
  // Desktop 1440
  const desk = await browser.newContext({ viewport:{width:1440,height:900}, ignoreHTTPSErrors:true });
  const p1 = await desk.newPage();
  await p1.goto(URL, { waitUntil:'domcontentloaded' });
  await p1.waitForTimeout(3000);
  const desk_shot = await p1.screenshot({ fullPage:true, type:'png' });
  commit('kaciukas_FULL_desktop_1440.png', desk_shot.toString('base64'));
  await desk.close();
  // Mobile 390
  const mob = await browser.newContext({ viewport:{width:390,height:844}, isMobile:true, ignoreHTTPSErrors:true, userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)'});
  const p2 = await mob.newPage();
  await p2.goto(URL, { waitUntil:'domcontentloaded' });
  await p2.waitForTimeout(3000);
  const mob_shot = await p2.screenshot({ fullPage:true, type:'png' });
  commit('kaciukas_FULL_mobile_390.png', mob_shot.toString('base64'));
  await mob.close();
  await browser.close();
  console.log('done');
})();
