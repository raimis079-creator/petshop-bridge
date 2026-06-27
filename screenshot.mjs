import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function putBin(name, buf){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:buf.toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
function commit(name,str){putBin(name,Buffer.from(str,'utf8'));}
const URL="https://dev.avesa.lt/?p=14535";
(async()=>{
  const out={url:URL};
  const browser=await chromium.launch({args:['--no-sandbox']});
  const ctx=await browser.newContext({ignoreHTTPSErrors:true,httpCredentials:{username:env.WP_USER,password:env.WP_PASS_CLEAN},viewport:{width:1200,height:1600}});
  const page=await ctx.newPage();
  try{await page.goto(URL,{waitUntil:'domcontentloaded',timeout:60000});}catch(e){out.gotoErr=String(e).slice(0,150);}
  await page.waitForTimeout(3500);
  try{const t=await page.$('a[href="#tab-description"], li.description_tab a, .tab-panel-description');if(t){await t.click();await page.waitForTimeout(1200);}}catch(e){}
  try{
    out.desc=await page.evaluate(()=>{
      const el=document.querySelector('#tab-description')||document.querySelector('.woocommerce-Tabs-panel--description')||document.querySelector('.entry-content');
      if(!el)return {found:false};
      const txt=el.innerText||'';
      return {found:true, hasTable:!!el.querySelector('table'), hasB2b:!!el.querySelector('.b2b-black'),
        literalTags: txt.includes('<p>')||txt.includes('</p>')||txt.includes('&lt;'),
        showsAmpersandEntity: txt.includes('&amp;'),
        textLen:txt.length, sample:txt.slice(0,400)};
    });
  }catch(e){out.descErr=String(e).slice(0,150);}
  try{
    const el=await page.$('#tab-description, .woocommerce-Tabs-panel--description, .entry-content');
    let buf;
    if(el){buf=await el.screenshot();}else{buf=await page.screenshot({fullPage:true});}
    putBin('farmina_shotB_14535.png',buf);
  }catch(e){out.shotErr=String(e).slice(0,150);}
  await browser.close();
  commit('farmina_shotB_meta.json',JSON.stringify(out,null,1));
  console.log("SHOTB DONE");
})();
