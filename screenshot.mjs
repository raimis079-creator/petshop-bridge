import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'vc',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbvc.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbvc.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:35000}); }catch(e){ return 'EXC:'+e.message; } }
(async()=>{
  var html = exec('curl -sk -m 25 "https://dev.avesa.lt/akcijos/"');
  // Skaičiuojam <li.product> pasireiškimus
  var matches = html.match(/li[^>]*class="[^"]*product[^"]*"/g) || [];
  var h1_m = html.match(/<h1[^>]*>([^<]+)<\/h1>/);
  var pageTitle_m = html.match(/<title>([^<]+)<\/title>/);
  var result = {
    'product_lis': matches.length,
    'h1': h1_m ? h1_m[1] : null,
    'title': pageTitle_m ? pageTitle_m[1] : null,
    'has_sale_products_shortcode_output': html.includes('woocommerce') && html.includes('products'),
    'has_akcijos_h1': html.includes('Akcijos'),
    'html_len': html.length,
  };
  commit('verify_curl.json', JSON.stringify(result));
  console.log('done');
})();
