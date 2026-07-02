import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const BASE="https://dev.avesa.lt";
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'utjs',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbutjs.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbutjs.json "'+url+'"',{encoding:'utf8'}); }
(async()=>{
  var out={};
  // testuosim tik esminius kandidatus + baseline; su naršykle JS įvyksta
  var tests = {
    'baseline_sun': BASE+'/kategorija/sunims/maistas-sunims/',
    'jautrus_sun_filter': BASE+'/kategorija/sunims/maistas-sunims/?filter_speciali-mityba=jautriam-virskinimui',
    'begrudu_sun_filter': BASE+'/kategorija/sunims/maistas-sunims/?filter_be-grudu=be-grudu',
    'hipo_sun_filter': BASE+'/kategorija/sunims/maistas-sunims/?filter_speciali-mityba=hipoalerginis',
  };
  try{
    const { chromium } = await import('playwright');
    const b=await chromium.launch({args:['--no-sandbox']});
    const c=await b.newContext({ignoreHTTPSErrors:true,viewport:{width:1280,height:900}});
    for (var k in tests){
      var p=await c.newPage();
      try{
        await p.goto(tests[k]+'&nc='+Date.now(),{waitUntil:'domcontentloaded',timeout:25000});
        await p.waitForTimeout(4000); // palaukiam YITH AJAX
        var info = await p.evaluate(()=>{
          var prods = document.querySelectorAll('ul.products li.product, .products .product-small');
          // paimam pirmu 3 pavadinimus, kad matytume ar realiai skiriasi
          var titles = [].slice.call(document.querySelectorAll('ul.products li.product .woocommerce-loop-product__title, ul.products li.product h2, .product-small .name a')).slice(0,3).map(function(e){return e.textContent.trim().slice(0,40);});
          var resultCount = document.querySelector('.woocommerce-result-count');
          return { product_count: prods.length, first_titles: titles, result_text: resultCount?resultCount.textContent.trim():'' };
        });
        out[k] = info;
      }catch(e){ out[k]={err:e.message.slice(0,80)}; }
      await p.close();
    }
    await b.close();
  }catch(e){ out.fatal=e.message.slice(0,150); }
  commit('url_test_js.json', Buffer.from(JSON.stringify(out),'utf8').toString('base64'));
  console.log(JSON.stringify(out).slice(0,400));
})();
