import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'cp',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbcp.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbcp.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:35000}); }catch(e){ return 'EXC:'+e.message; } }
(async()=>{
  var html = exec('curl -sk -m 25 "https://dev.avesa.lt/akcijos/"');
  // Ieskom - kiek "product-small" korteliu (Flatsome tema)
  var product_smalls = (html.match(/class="[^"]*product-small[^"]*"/g) || []).length;
  // Slider vs grid
  var has_slider = html.includes('row-slider') || html.includes('flickity');
  var has_grid = html.includes('woocommerce columns-4');
  // PHP warning viesai?
  var php_warning = html.includes('Warning</b>') || html.includes('Undefined global variable');
  // AKCIJA prekes matomos?
  var josera_akcija = (html.match(/Josera[^<]*AKCIJA/g) || []).length;
  var josidog_akcija = (html.match(/Josi[DC][ao][gt][^<]*AKCIJA/g) || []).length;
  // Post ID's kortelese?
  var post_ids = html.match(/product post-(\d+)/g) || [];
  var unique_ids = [...new Set(post_ids)];
  
  commit('check_page.json', JSON.stringify({
    product_small_count: product_smalls,
    unique_product_cards_by_class: unique_ids.length,
    has_slider_on_page: has_slider,
    has_grid_on_page: has_grid,
    php_warning_visible: php_warning,
    josera_akcija_mentions: josera_akcija,
    josi_akcija_mentions: josidog_akcija,
    html_length: html.length,
  }));
  console.log('done');
})();
