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
  try{ return JSON.parse(raw); }catch(e){ return {__pe:true, raw:raw.slice(0,300)}; }
}
const POOL=[17421, 19586, 19574, 17179, 19530, 17156];
const SHORT='6 skirtingos skardinės po 1. Su daug jautienos, ėrienos, antienos. Be grūdų, sojų, cukraus, dirbtinių dažiklių ir konservantų.';
const DESC='<h3>Rinkinyje rasite (6 skardinės po 1):</h3><ol>'
  +'<li>Monge BWild begrūdžiai konservai šunims su antiena, moliūgu ir cukinija, 400 g</li>'
  +'<li>Animonda GranCarno Adult Beef + Lamb: konservai šunims su šviežia jautiena ir ėriena, 400 g</li>'
  +'<li>Animonda GranCarno Adult Beef: konservai šunims su šviežia jautiena, 400 g</li>'
  +'<li>Ontario konservai šunims su jautiena, paskaninta žolelėmis, 400 g</li>'
  +'<li>Animonda GranCarno Adult Sensitive Turkey + Potato: konservai jautriems šunims, 400 g</li>'
  +'<li>Ontario konservai šunims su ėriena, paskaninta šaltalankiu, 400 g</li>'
  +'</ol><p><em>Gyvūnas visuomet turi turėti šviežio geriamo vandens.</em></p>';
(async()=>{
  const out={ts:new Date().toISOString()};
  // verify components exist & published
  out.components=[];
  for(const id of POOL){
    const r=call('GET','/wp-json/wc/v3/products/'+id);
    out.components.push({id, name:(r.name||'').slice(0,55), sku:r.sku, status:r.status, qty:r.stock_quantity, price:r.price});
  }
  // create MnM box
  const cr = call('POST','/wp-json/wc/v3/products', {
    name:'Rinkinys išrankiems šunims · 6×400g',
    type:'mix-and-match',
    status:'publish',
    sku:'RINK-ISRANK-6x400',
    regular_price:'13.90',
    short_description: SHORT,
    description: DESC,
    categories:[{id:682}],
    mnm_content_source:'products',
    mnm_child_items: POOL.map(pid=>({product_id:pid})),
    mnm_min_container_size:6,
    mnm_max_container_size:6,
    mnm_priced_per_product:false
  });
  out.created = {id:(cr&&cr.id)||null, sku:cr&&cr.sku, status:cr&&cr.status, permalink:cr&&cr.permalink, err:(cr&&(cr.code||cr.__exc||(cr.__pe?cr.raw:null)))||null};
  if(cr && cr.id){
    const rb = call('GET','/wp-json/wc/v3/products/'+cr.id+'?context=edit');
    out.verify = {
      type: rb.type,
      price: rb.price,
      min: rb.mnm_min_container_size,
      max: rb.mnm_max_container_size,
      priced_per: rb.mnm_priced_per_product,
      pool: (rb.mnm_child_items||[]).map(c=>c.product_id),
      pool_count: (rb.mnm_child_items||[]).length,
      cats: (rb.categories||[]).map(c=>c.id+':'+c.name).join('|'),
      purchasable: rb.purchasable
    };
  }
  commit('rinkinys_built.json', JSON.stringify(out,null,1));
  console.log("DONE id="+(cr&&cr.id));
})();
