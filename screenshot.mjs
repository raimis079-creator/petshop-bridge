import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const BASE="https://dev.avesa.lt";
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'vru',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbvru.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbvru.json "'+url+'"',{encoding:'utf8'}); }
(async()=>{
  var out={};
  // tikri URL is HTML (decoded &#038; -> &). Testuojam ir sunims, ir katems.
  var tests = {
    'jautrus_sun': BASE+'/kategorija/sunims/maistas-sunims?yith_wcan=1&product_cat=maistas-sunims&query_type_speciali_mityba=or&filter_speciali_mityba=jautriam-virskinimui',
    'jautrus_kat': BASE+'/kategorija/katems/maistas-katems?yith_wcan=1&product_cat=maistas-katems&query_type_speciali_mityba=or&filter_speciali_mityba=jautriam-virskinimui',
    'hipo_sun': BASE+'/kategorija/sunims/maistas-sunims?yith_wcan=1&product_cat=maistas-sunims&query_type_speciali_mityba=or&filter_speciali_mityba=hipoalerginis',
    'begrudu_sun': BASE+'/kategorija/sunims/maistas-sunims?yith_wcan=1&product_cat=maistas-sunims&filter_be_grudu=be-grudu',
    'begrudu_kat': BASE+'/kategorija/katems/maistas-katems?yith_wcan=1&product_cat=maistas-katems&filter_be_grudu=be-grudu',
    'mono_sun': BASE+'/kategorija/sunims/maistas-sunims?yith_wcan=1&product_cat=maistas-sunims&filter_monoprotein=taip',
  };
  try{
    const { chromium } = await import('playwright');
    const b=await chromium.launch({args:['--no-sandbox']});
    const c=await b.newContext({ignoreHTTPSErrors:true,viewport:{width:1200,height:900}});
    for (var k in tests){
      var p=await c.newPage();
      try{
        await p.goto(tests[k],{waitUntil:'domcontentloaded',timeout:35000});
        await p.waitForTimeout(4000);
        var info = await p.evaluate(()=>{
          var rc=document.querySelector('.woocommerce-result-count');
          var prods=document.querySelectorAll('ul.products li.product');
          var titles=[].slice.call(document.querySelectorAll('ul.products li.product .name a, ul.products li.product h2')).slice(0,3).map(function(e){return e.textContent.trim().slice(0,45);});
          return { result:rc?rc.textContent.trim():'', dom_products:prods.length, titles:titles };
        });
        out[k]=info;
      }catch(e){ out[k]={err:e.message.slice(0,60)}; }
      await p.close();
    }
    await b.close();
  }catch(e){ out.fatal=e.message.slice(0,150); }
  commit('verify_real_urls.json', Buffer.from(JSON.stringify(out),'utf8').toString('base64'));
  console.log(JSON.stringify(out).slice(0,400));
})();
