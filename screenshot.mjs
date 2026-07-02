import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const BASE="https://dev.avesa.lt";
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'ut',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbut.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbut.json "'+url+'"',{encoding:'utf8'}); }
function testUrl(u){
  try {
    var code = execSync('curl -sk -o /dev/null -w "%{http_code}" -m 25 "'+u+'"',{encoding:'utf8',timeout:30000}).trim();
    var html = execSync('curl -sk -m 25 "'+u+'"',{encoding:'utf8',maxBuffer:100000000,timeout:30000});
    // WooCommerce produktu korteles: li.product arba .product-small
    var prodCount = (html.match(/class="[^"]*\bproduct\b[^"]*"/g)||[]).length;
    var liProduct = (html.match(/<li[^>]*class="[^"]*product[^"]*"/g)||[]).length;
    var noResults = /nerasta|no products|Rezultat.*nerasta|Nieko nerasta/i.test(html);
    var addCartBtns = (html.match(/add_to_cart_button/g)||[]).length;
    var title = (html.match(/<title>([\s\S]*?)<\/title>/i)||[])[1]||'';
    return {code:code, li_product:liProduct, add_cart:addCartBtns, no_results:noResults, title:title.slice(0,60), html_len:html.length};
  } catch(e){ return {code:'EXC', err:e.message.slice(0,80)}; }
}
(async()=>{
  var tests = {
    // Jautriam virškinimui — kandidatai
    'jautrus_sun_A_tax_archive': BASE+'/?taxonomy=pa_speciali_mityba&term=jautriam-virskinimui',
    'jautrus_sun_B_cat_yith': BASE+'/kategorija/sunims/maistas-sunims/?filter_speciali-mityba=jautriam-virskinimui',
    'jautrus_sun_C_cat_ya': BASE+'/kategorija/sunims/maistas-sunims/?product_speciali_mityba=jautriam-virskinimui',
    'jautrus_sun_D_cat_pa': BASE+'/kategorija/sunims/maistas-sunims/?pa_speciali_mityba=jautriam-virskinimui',
    // Be grūdų — kandidatai
    'begrudu_sun_B_cat_yith': BASE+'/kategorija/sunims/maistas-sunims/?filter_be-grudu=be-grudu',
    'begrudu_sun_D_cat_pa': BASE+'/kategorija/sunims/maistas-sunims/?pa_be_grudu=be-grudu',
    // Hipoalerginis
    'hipo_sun_B_cat_yith': BASE+'/kategorija/sunims/maistas-sunims/?filter_speciali-mityba=hipoalerginis',
    // Monoprotein
    'mono_sun_B_cat_yith': BASE+'/kategorija/sunims/maistas-sunims/?filter_monoprotein=taip',
    // baseline: pati kategorija be filtro (kontrolė)
    'baseline_maistas_sunims': BASE+'/kategorija/sunims/maistas-sunims/',
  };
  var out={};
  for (var k in tests){ out[k] = {url: tests[k], ...testUrl(tests[k])}; }
  commit('url_test.json', JSON.stringify(out));
  console.log('done');
})();
