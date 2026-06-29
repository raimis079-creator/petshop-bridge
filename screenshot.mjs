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
function call(method, path, bodyObj){
  let cmd='curl -sk -X '+method+' -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" -H "Accept: application/json"';
  if(bodyObj!==undefined){ fs.writeFileSync('/tmp/b.json', JSON.stringify(bodyObj)); cmd+=' -d @/tmp/b.json'; }
  cmd+=' "'+BASE+path+'"';
  let raw=''; try{ raw=execSync(cmd,{encoding:'utf8',maxBuffer:300000000}); }catch(e){ return {__exc:String(e).slice(0,150)}; }
  try{ return JSON.parse(raw); }catch(e){ return {__pe:true, raw:raw.slice(0,400)}; }
}
(async()=>{
  const out={ts:new Date().toISOString()};
  const body={
    name:'TEST Konservų rinkinys 6 vnt (MnM)',
    type:'mix-and-match',
    status:'publish',
    sku:'TEST-MNM-6',
    regular_price:'14.99',
    mnm_priced_per_product:false,
    mnm_min_container_size:6,
    mnm_max_container_size:6,
    mnm_content_source:'products',
    mnm_child_items:[
      {product_id:17397},
      {product_id:17394},
      {product_id:17400},
      {product_id:33550}
    ],
    categories:[{id:682}]
  };
  const cr = call('POST','/wp-json/wc/v3/products', body);
  out.create = {id:(cr&&cr.id)||null, type:cr&&cr.type, status:cr&&cr.status, permalink:cr&&cr.permalink, err:(cr&&(cr.__exc||cr.code||(cr.__pe?cr.raw:null)))||null};
  const pid = cr && cr.id ? cr.id : null;
  if(pid){
    // read back with context=edit to confirm mnm config
    const rb = call('GET','/wp-json/wc/v3/products/'+pid+'?context=edit');
    out.readback = {
      id:rb.id, type:rb.type, regular_price:rb.regular_price,
      mnm_min:rb.mnm_min_container_size, mnm_max:rb.mnm_max_container_size,
      mnm_content_source:rb.mnm_content_source, mnm_priced_per_product:rb.mnm_priced_per_product,
      child_items: Array.isArray(rb.mnm_child_items)? rb.mnm_child_items.map(c=>({product_id:c.product_id, item_id:c.child_item_id||c.id, sku:c.sku})) : rb.mnm_child_items,
      categories: (rb.categories||[]).map(c=>({id:c.id,name:c.name})),
      purchasable: rb.purchasable, stock_status: rb.stock_status
    };
  }
  commit('mnm_box.json', JSON.stringify(out,null,1));
  console.log("DONE pid="+pid);
})();
