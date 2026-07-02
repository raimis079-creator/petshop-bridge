import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commitB64(name,b64){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'rects2',branch:'main',content:b64}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbrc2.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbrc2.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:40000}); }catch(e){ return 'EXC:'+e.message; } }
(async()=>{
  var out={};
  exec('curl -sk -m 15 -o /dev/null -X POST -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" -d \'{"status":"publish"}\' "'+BASE+'/wp-json/wp/v2/pages/34253"');
  exec('curl -sk -m 15 -o /dev/null -X POST -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" -d \'{"status":"publish"}\' "'+BASE+'/wp-json/wp/v2/pages/34254"');
  await new Promise(r=>setTimeout(r,1200));
  var url = BASE+'/sprendimai/isrankus-augintinis/';

  const getRects = async (page) => {
    return await page.evaluate(() => {
      function rect(sel, idx){ var els=document.querySelectorAll(sel); var el=els[idx||0]; if(!el) return null; var r=el.getBoundingClientRect(); return {top:r.top, bottom:r.bottom}; }
      var h2s = [].slice.call(document.querySelectorAll('h2'));
      var h2map = {}; h2s.forEach(function(h){ h2map[h.textContent.trim()] = h.getBoundingClientRect().top; });
      var gridSections = document.querySelectorAll('.psc-sol-grid-section');
      var dog = gridSections[0] ? gridSections[0].getBoundingClientRect() : null;
      var cat = gridSections[1] ? gridSections[1].getBoundingClientRect() : null;
      var hero = rect('.psc-sol-hero');
      var ctaBanner = rect('.psc-sol-cta-banner');
      var warning = rect('.psc-sol-warning');
      var h1 = rect('h1');
      var faq = rect('.psc-sol-faq');
      var docHeight = document.body.scrollHeight;
      var footerWidgetsVisible = (function(){ var f=document.querySelector('footer .footer-widgets.footer-1'); if(!f) return 'nera-elemento'; var cs=getComputedStyle(f); return cs.display; })();
      var mobileHiddenCount = (function(){
        var grids = document.querySelectorAll('.psc-sol-grid');
        var res = [];
        grids.forEach(function(g){
          var items = g.querySelectorAll('.psc-sol-product');
          var visible = 0;
          items.forEach(function(it){ if(getComputedStyle(it).display !== 'none') visible++; });
          res.push({total: items.length, visible: visible});
        });
        return res;
      })();
      return { h2map, hero, ctaBanner, warning, h1, faq, docHeight, dog, cat, footerWidgetsVisible, mobileHiddenCount };
    });
  };

  try{
    const { chromium } = await import('playwright');
    const b=await chromium.launch({args:['--no-sandbox']});

    const cD=await b.newContext({ignoreHTTPSErrors:true,viewport:{width:1440,height:1000}});
    const pD=await cD.newPage();
    await pD.goto(url+'?nc='+Date.now(),{waitUntil:'domcontentloaded',timeout:25000});
    await pD.waitForTimeout(3000);
    out.desktop_rects = await getRects(pD);
    const bufD = await pD.screenshot({fullPage:true});
    commitB64('rv3_desktop_full.png', bufD.toString('base64'));
    await cD.close();

    const cM=await b.newContext({ignoreHTTPSErrors:true, viewport:{width:390,height:844}, isMobile:true, hasTouch:true});
    const pM=await cM.newPage();
    await pM.goto(url+'?nc='+Date.now(),{waitUntil:'domcontentloaded',timeout:25000});
    await pM.waitForTimeout(3000);
    out.mobile_rects = await getRects(pM);
    const bufM = await pM.screenshot({fullPage:true});
    commitB64('rv3_mobile_full.png', bufM.toString('base64'));
    await cM.close();

    await b.close();
  }catch(e){ out.err = e.message.slice(0,300); }

  exec('curl -sk -m 15 -o /dev/null -X POST -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" -d \'{"status":"draft"}\' "'+BASE+'/wp-json/wp/v2/pages/34254"');
  exec('curl -sk -m 15 -o /dev/null -X POST -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" -d \'{"status":"draft"}\' "'+BASE+'/wp-json/wp/v2/pages/34253"');

  commitB64('rects2.json', Buffer.from(JSON.stringify(out),'utf8').toString('base64'));
  console.log(JSON.stringify(out).slice(0,500));
})();
