import { execSync } from "child_process";
import fs from "fs";
const repo = process.env.GH_REPO, tok = process.env.GH_TOKEN;
const WP_USER = process.env.WP_USER, WP_PASS = process.env.WP_APP_PASS;
const BASE = "https://dev.avesa.lt";
const AUTH = "Basic " + Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
function commit(name, str){
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){}
  const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha;
  fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));
  execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'});
}
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000}); }catch(e){ return 'EXC:'+String(e).slice(0,200); } }
function api(path){
  let cmd='curl -sk -H "Authorization: '+AUTH+'" -H "Accept: application/json" "'+BASE+path+'"';
  let raw=exec(cmd);
  try{ return JSON.parse(raw); }catch(e){ return {__raw:raw.slice(0,300)}; }
}
(async()=>{
  const out={ts:new Date().toISOString()};
  // Ieskau pagal SKU - vartotojas davė: 341000, 723000, 338000
  const SKUS = ['341000', '723000', '338000'];
  out.found = [];
  for(const sku of SKUS){
    const arr = api('/wp-json/wc/v3/products?sku='+sku+'&per_page=5&status=any');
    if(Array.isArray(arr) && arr.length){
      for(const p of arr){
        out.found.push({
          searched_sku: sku,
          id: p.id,
          name: (p.name||'').slice(0,80),
          actual_sku: p.sku,
          type: p.type,
          status: p.status,
          price: p.price,
          regular_price: p.regular_price,
          stock_qty: p.stock_quantity,
          stock_status: p.stock_status,
          has_image: (p.images||[]).length > 0,
          cats: (p.categories||[]).map(c=>c.slug).join('|')
        });
      }
    } else {
      out.found.push({searched_sku: sku, error: 'not found', raw: arr.__raw || JSON.stringify(arr).slice(0,200)});
    }
  }
  commit('skanestai_recon.json', JSON.stringify(out,null,1));
  console.log("DONE found="+out.found.length);
})();
