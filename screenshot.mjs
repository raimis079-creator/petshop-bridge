import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'rm',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbrm.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbrm.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:40000}); }catch(e){ return 'EXC:'+e.message; } }
(async()=>{
  var page = exec('curl -sk -m 30 "'+BASE+'/daugiau-pigiau/"');
  // Randam pirma "product-small" kortele ir istraukiam iki box-text pabaigos
  var out={};
  var idx = page.indexOf('product-small');
  if(idx<0) idx = page.indexOf('class="product ');
  if(idx>=0){
    // atgal iki <div atidarymo
    var start = page.lastIndexOf('<div', idx);
    var chunk = page.slice(start, start+2600);
    out.card_html = chunk;
  } else out.card_html='NERASTA product-small';
  // Ar yra box-image, badge-container, image wrapper klases
  out.has_box_image = page.includes('box-image');
  out.has_badge_container = page.includes('badge-container');
  out.has_image_fade = page.includes('image-fade');
  // "Neturime"/out of stock zyme
  out.has_soldout = page.includes('soldout') || page.includes('out-of-stock') || page.includes('Neturime');
  commit('recon_markup.json', JSON.stringify(out));
  console.log('done');
})();
