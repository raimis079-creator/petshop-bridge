import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'vv3',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbvv3.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbvv3.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:40000}); }catch(e){ return 'EXC:'+e.message; } }
(async()=>{
  var out={};
  exec('curl -sk -m 15 -o /dev/null -X POST -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" -d \'{"status":"publish"}\' "'+BASE+'/wp-json/wp/v2/pages/34253"');
  exec('curl -sk -m 15 -o /dev/null -X POST -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" -d \'{"status":"publish"}\' "'+BASE+'/wp-json/wp/v2/pages/34254"');
  await new Promise(r=>setTimeout(r,1200));
  var url = BASE+'/sprendimai/isrankus-augintinis/';
  try{
    const { chromium } = await import('playwright');
    const b=await chromium.launch({args:['--no-sandbox']});
    const c=await b.newContext({ignoreHTTPSErrors:true,viewport:{width:1440,height:1000}});
    const p=await c.newPage();
    await p.goto(url+'?nc='+Date.now(),{waitUntil:'domcontentloaded',timeout:25000});
    await p.waitForTimeout(3000);
    out.checks = await p.evaluate(()=>{
      var res = {};
      // 1. bundle kortelė be nuotraukos -> ar yra ikona
      var iconEl = document.querySelector('.psc-sol-card-img-icon');
      res.bundle_icon_present = !!iconEl;
      res.bundle_icon_text = iconEl ? iconEl.textContent.trim() : '';
      // 2. CTA padding
      var cta = document.querySelector('.psc-sol-cta-banner');
      res.cta_padding = cta ? getComputedStyle(cta).padding : '';
      // 3. produkto img object-fit + wrapper aukštis
      var pimg = document.querySelector('.psc-sol-product-img img');
      var pwrap = document.querySelector('.psc-sol-product-img');
      res.product_img_objectfit = pimg ? getComputedStyle(pimg).objectFit : '';
      res.product_wrap_height = pwrap ? getComputedStyle(pwrap).height : '';
      // 4. FAQ background
      var faq = document.querySelector('.psc-sol-faq details');
      res.faq_bg = faq ? getComputedStyle(faq).backgroundColor : '';
      res.faq_border = faq ? getComputedStyle(faq).borderTopWidth : '';
      res.faq_radius = faq ? getComputedStyle(faq).borderTopLeftRadius : '';
      return res;
    });
    await b.close();
  }catch(e){ out.err=e.message.slice(0,200); }
  exec('curl -sk -m 15 -o /dev/null -X POST -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" -d \'{"status":"draft"}\' "'+BASE+'/wp-json/wp/v2/pages/34254"');
  exec('curl -sk -m 15 -o /dev/null -X POST -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" -d \'{"status":"draft"}\' "'+BASE+'/wp-json/wp/v2/pages/34253"');
  commit('verify_v3.json', Buffer.from(JSON.stringify(out),'utf8').toString('base64'));
  console.log(JSON.stringify(out));
})();
