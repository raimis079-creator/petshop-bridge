import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'vl',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbvl.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbvl.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:35000}); }catch(e){ return 'EXC:'+e.message; } }

(async()=>{
  var status = exec('curl -sk -o /dev/null -w "%{http_code}" -m 20 "https://dev.avesa.lt/kategorija/daugiau-pigiau/"');
  var html = exec('curl -sk -m 25 "https://dev.avesa.lt/kategorija/daugiau-pigiau/"');
  var has_miamor = html.includes('Miamor');
  var has_price = html.includes('40,81') || html.includes('40.81');
  var has_no_products_msg = html.includes('Produkt') && html.includes('nerasta');
  var addtocart = (html.match(/add_to_cart|Į krepšelį|i krepseli/gi) || []).length;
  
  commit('verify_live.json', JSON.stringify({
    http_status: status,
    has_miamor_in_html: has_miamor,
    has_price_in_html: has_price,
    has_no_products_message: has_no_products_msg,
    add_to_cart_mentions: addtocart,
    html_len: html.length,
  }));
  console.log('done');
})();
