import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const BASE="https://dev.avesa.lt";
const SINGLE="https://dev.avesa.lt/product/miamor-konservai-katems-su-tunu-ir-krevetemis-100-g-x-24-vnt/";
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'rs',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbrs.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbrs.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:40000}); }catch(e){ return 'EXC'; } }
(async()=>{
  var page=exec('curl -sk -m 30 "'+SINGLE+'"');
  var out={};
  var i=page.indexOf('woocommerce-product-gallery');
  if(i>=0){ var start=page.lastIndexOf('<div',i); out.gallery = page.slice(start, start+1400).replace(/\s+/g,' '); }
  out.has_gallery = page.includes('woocommerce-product-gallery');
  out.has_gallery_image = page.includes('woocommerce-product-gallery__image');
  out.has_gallery_wrapper = page.includes('woocommerce-product-gallery__wrapper');
  commit('recon_single.json', JSON.stringify(out));
  console.log('done');
})();
