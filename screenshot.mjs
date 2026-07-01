import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const WP_USER = process.env.WP_USER, WP_PASS = process.env.WP_APP_PASS;
function commit(name, str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cb2.json',JSON.stringify(body)); try{ execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb2.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function putBin(name,buf){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'r',branch:'main',content:buf.toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cb.json',JSON.stringify(body)); try{ execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
(async()=>{
  const browser=await chromium.launch({args:['--no-sandbox']});
  const ctx=await browser.newContext({ignoreHTTPSErrors:true, viewport:{width:1400,height:1000}, httpCredentials:{username:WP_USER, password:WP_PASS}});
  const page=await ctx.newPage();
  // Bandau prisijungti per wp-login (interaktyvus)
  await page.goto('https://dev.avesa.lt/wp-login.php?nc='+Date.now(),{waitUntil:'domcontentloaded',timeout:40000}).catch(()=>{});
  await page.waitForTimeout(2000);
  var hasLogin = await page.evaluate(()=>!!document.querySelector('#user_login'));
  var adminReachable = false;
  if (hasLogin) {
    // app-password neveiks interaktyviam login; tiesiog pažymim
    adminReachable = false;
  }
  // Bandau tiesiogiai admin puslapį (jei sesija yra)
  await page.goto('https://dev.avesa.lt/wp-admin/edit.php?post_type=product&page=petshop-choice-create&nc='+Date.now(),{waitUntil:'domcontentloaded',timeout:40000}).catch(()=>{});
  await page.waitForTimeout(3000);
  var probe = await page.evaluate(()=>({
    is_login: !!document.querySelector('#user_login'),
    has_form: !!document.getElementById('pcf-title'),
    title: document.title
  }));
  commit('admin_probe.json', JSON.stringify(probe,null,1));
  putBin('admin_probe.png', await page.screenshot({fullPage:false}));
  console.log(JSON.stringify(probe));
  await ctx.close(); await browser.close();
})();
