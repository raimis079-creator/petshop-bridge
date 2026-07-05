import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'cid',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbcid.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbcid.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:35000}); }catch(e){ return 'EXC:'+e.message; } }
(async()=>{
  var html = exec('curl -sk -m 25 "https://dev.avesa.lt/product/miamor-konservai-katems-su-tunu-ir-krevetemis-100-g-x-24-vnt/"');
  // Rasti product-gallery zona
  var galStart = html.indexOf('product-images');
  if (galStart < 0) galStart = html.indexOf('woocommerce-product-gallery');
  var galleryZone = galStart >= 0 ? html.substring(galStart, galStart+1500) : 'GALLERY ZONE NOT FOUND';
  // Kiek kartu placeholder ir kiek realios
  var placeholderCount = (html.match(/woocommerce-placeholder/g) || []).length;
  var realImgCount = (html.match(/mi-miamor-super-premium/g) || []).length;
  commit('check_img_detail.json', JSON.stringify({
    placeholder_count: placeholderCount,
    real_img_count: realImgCount,
    gallery_zone: galleryZone,
  }));
  console.log('done');
})();
