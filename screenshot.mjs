import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commitB64(name,b64){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'vj',branch:'main',content:b64}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbvj.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbvj.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:40000}); }catch(e){ return 'EXC:'+e.message; } }
(async()=>{
  var out={};
  exec('curl -sk -m 15 -o /dev/null -X POST -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" -d \'{"status":"publish"}\' "'+BASE+'/wp-json/wp/v2/pages/34260"');
  await new Promise(r=>setTimeout(r,1200));
  var url = BASE+'/sprendimai/jautrus-virskinimas/';

  // 1. curl HTML -> patikrinam ar krypties korteles renderinasi ir ar href teisingi
  var html = exec('curl -sk -m 25 "'+url+'?nc='+Date.now()+'"');
  out.html_len = html.length;
  out.krypt_cards = (html.match(/psc-sol-krypt"/g)||[]).length;
  out.krypt_btns = (html.match(/psc-sol-krypt-btn"/g)||[]).length;
  out.secondary_links = (html.match(/psc-sol-krypt-secondary"/g)||[]).length;
  out.keitimas_table = html.indexOf('psc-sol-keitimas')>=0;
  out.warning = html.indexOf('psc-sol-warning')>=0;
  out.faq = (html.match(/psc-sol-faq details/g)||[]).length;
  out.no_addcart = (html.match(/add_to_cart_button/g)||[]).length; // turi būti 0 grid'uose (gali būti footer'yje bet footer paslėptas)
  // ištraukiam pirmą krypties kortelės href
  var hrefMatch = html.match(/psc-sol-krypt-btn"[^>]*href="([^"]+)"/);
  if(!hrefMatch) hrefMatch = html.match(/href="([^"]*filter_speciali_mityba[^"]*)"/);
  out.first_filter_href = hrefMatch ? hrefMatch[1] : '(nerasta)';
  // ar href turi teisingus &amp; (HTML lygyje) — esc_url output
  out.href_has_amp_entity = out.first_filter_href.indexOf('&#038;')>=0 || out.first_filter_href.indexOf('&amp;')>=0;

  try{
    const { chromium } = await import('playwright');
    const b=await chromium.launch({args:['--no-sandbox']});
    // Screenshots
    const cD=await b.newContext({ignoreHTTPSErrors:true,viewport:{width:1440,height:1000}});
    const pD=await cD.newPage();
    await pD.goto(url+'?nc='+Date.now(),{waitUntil:'domcontentloaded',timeout:25000});
    await pD.waitForTimeout(3000);
    out.h1 = await pD.evaluate(()=>{ var h=document.querySelector('.psc-sol-hero-title'); return h?h.textContent.trim():''; });
    // paimam realų href iš DOM (po visų filtrų)
    out.dom_first_href = await pD.evaluate(()=>{ var a=document.querySelector('.psc-sol-krypt-btn'); return a?a.href:''; });
    const bufD = await pD.screenshot({fullPage:true}); commitB64('jautrus_desktop.png', bufD.toString('base64'));
    await cD.close();

    const cM=await b.newContext({ignoreHTTPSErrors:true, viewport:{width:390,height:844}, isMobile:true, hasTouch:true});
    const pM=await cM.newPage();
    await pM.goto(url+'?nc='+Date.now(),{waitUntil:'domcontentloaded',timeout:25000});
    await pM.waitForTimeout(3000);
    const bufM = await pM.screenshot({fullPage:true}); commitB64('jautrus_mobile.png', bufM.toString('base64'));
    await cM.close();

    // KLIK TESTAS: atidarom pirmos kortelės "Šunims" nuorodą, ar filtruoja
    const cT=await b.newContext({ignoreHTTPSErrors:true,viewport:{width:1200,height:900}});
    const pT=await cT.newPage();
    await pT.goto(url+'?nc='+Date.now(),{waitUntil:'domcontentloaded',timeout:25000});
    await pT.waitForTimeout(2500);
    var targetHref = await pT.evaluate(()=>{ var a=document.querySelector('.psc-sol-krypt-btn'); return a?a.href:''; });
    out.click_target = targetHref;
    if (targetHref){
      await pT.goto(targetHref,{waitUntil:'domcontentloaded',timeout:35000});
      await pT.waitForTimeout(4000);
      out.click_result = await pT.evaluate(()=>{ var rc=document.querySelector('.woocommerce-result-count'); return rc?rc.textContent.trim():'(nėra result-count)'; });
    }
    await cT.close();
    await b.close();
  }catch(e){ out.err=e.message.slice(0,200); }

  exec('curl -sk -m 15 -o /dev/null -X POST -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" -d \'{"status":"draft"}\' "'+BASE+'/wp-json/wp/v2/pages/34260"');
  commitB64('verify_jautrus.json', Buffer.from(JSON.stringify(out),'utf8').toString('base64'));
  console.log(JSON.stringify(out).slice(0,400));
})();
