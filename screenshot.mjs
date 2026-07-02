import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const BASE="https://dev.avesa.lt";
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'yp',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbyp.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbyp.json "'+url+'"',{encoding:'utf8'}); }
(async()=>{
  var out={};
  try{
    const { chromium } = await import('playwright');
    const b=await chromium.launch({args:['--no-sandbox']});
    const c=await b.newContext({ignoreHTTPSErrors:true,viewport:{width:1280,height:1400}});
    const p=await c.newPage();
    await p.goto(BASE+'/kategorija/sunims/maistas-sunims/?nc='+Date.now(),{waitUntil:'domcontentloaded',timeout:25000});
    await p.waitForTimeout(4000);
    out.baseline_count = await p.evaluate(()=>{ var rc=document.querySelector('.woocommerce-result-count'); return rc?rc.textContent.trim():''; });

    // surandam YITH filtro nuorodas su "jautriam" ar "speciali" ar filtro linkus
    out.filter_links = await p.evaluate(()=>{
      var links = [].slice.call(document.querySelectorAll('.yith-wcan a, .yith-wcan-filters a, a[href*="filter"], a[href*="speciali"], a[href*="mityba"], .wcan-filters a'));
      return links.slice(0,40).map(function(a){ return {text:a.textContent.trim().slice(0,30), href:a.getAttribute('href')}; }).filter(function(x){return x.text.length>0;});
    });
    // ieskom konkreciai "jautriam" teksto filtre
    out.jautriam_filter = await p.evaluate(()=>{
      var links = [].slice.call(document.querySelectorAll('a'));
      var el = links.find(function(a){ return /jautriam/i.test(a.textContent) && (a.href.indexOf('mityba')>=0 || a.href.indexOf('filter')>=0 || a.closest('.yith-wcan')); });
      return el ? {text:el.textContent.trim(), href:el.getAttribute('href')} : null;
    });

    // pabandom paspausti jautriam virskinimui filtra jei radome
    var clicked = await p.evaluate(()=>{
      var links = [].slice.call(document.querySelectorAll('.yith-wcan a, a'));
      var el = links.find(function(a){ return /jautriam vir/i.test(a.textContent) && a.closest && a.closest('.yith-wcan'); });
      if(el){ el.click(); return true; }
      return false;
    });
    out.clicked_jautriam = clicked;
    if (clicked){
      await p.waitForTimeout(4500);
      out.after_click_url = p.url();
      out.after_click_count = await p.evaluate(()=>{ var rc=document.querySelector('.woocommerce-result-count'); return rc?rc.textContent.trim():''; });
      out.after_click_titles = await p.evaluate(()=> [].slice.call(document.querySelectorAll('ul.products li.product .name a, ul.products li.product h2')).slice(0,3).map(function(e){return e.textContent.trim().slice(0,40);}));
    }
    await b.close();
  }catch(e){ out.fatal=e.message.slice(0,200); }
  commit('yith_probe.json', Buffer.from(JSON.stringify(out),'utf8').toString('base64'));
  console.log(JSON.stringify(out).slice(0,500));
})();
