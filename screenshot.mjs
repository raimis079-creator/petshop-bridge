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
const POOL=[{product_id:17397},{product_id:17394},{product_id:17400}];
const SIZES=[{sz:6,price:'14.99'},{sz:12,price:'26.99'},{sz:15,price:'31.99'}];
(async()=>{
  const out={ts:new Date().toISOString()};
  // cleanup old 2.x test
  call('DELETE','/wp-json/wc/v3/products/34143?force=true');
  // create fresh parent
  const cr = call('POST','/wp-json/wc/v3/products', {
    name:'TEST Variable v1 (6/12/15)',
    type:'variable-mix-and-match',
    status:'publish', sku:'TEST-VARMNM-V1',
    mnm_content_source:'products',
    attributes:[{ name:'Dydis', visible:true, variation:true, options:['6','12','15'] }],
    categories:[{id:682}]
  });
  const pid = cr && cr.id ? cr.id : null;
  out.parent_id = pid; out.parent_err=(cr&&(cr.__exc||cr.code))||null;
  if(!pid){ commit('v1_box.json', JSON.stringify(out,null,1)); console.log('NOPID'); return; }
  out.created=[];
  for(const s of SIZES){
    const v = call('POST','/wp-json/wc/v3/products/'+pid+'/variations', {
      attributes:[{name:'Dydis', option:String(s.sz)}],
      regular_price:s.price,
      mnm_content_source:'products',
      mnm_child_items:POOL,
      mnm_min_container_size:s.sz,
      mnm_max_container_size:s.sz,
      mnm_priced_per_product:false,
      meta_data:[{key:'_mnm_min_container_size',value:String(s.sz)},{key:'_mnm_max_container_size',value:String(s.sz)}]
    });
    out.created.push({sz:s.sz, id:(v&&v.id)||null, err:(v&&(v.__exc||v.code))||null});
  }
  const vs = call('GET','/wp-json/wc/v3/products/'+pid+'/variations?context=edit&per_page=20');
  out.variations = Array.isArray(vs)? vs.map(v=>({id:v.id,dydis:(v.attributes||[]).map(a=>a.option).join(','),price:v.regular_price,min:v.mnm_min_container_size,max:v.mnm_max_container_size,pool:Array.isArray(v.mnm_child_items)?v.mnm_child_items.length:0})).sort((a,b)=>parseFloat(a.price||0)-parseFloat(b.price||0)) : vs;
  const par = call('GET','/wp-json/wc/v3/products/'+pid);
  out.parent_status = par && par.status;
  out.parent_purchasable = par && par.purchasable;
  out.parent_price_html = (par&&par.price_html||'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().slice(0,80);
  out.permalink = par && par.permalink;
  commit('v1_box.json', JSON.stringify(out,null,1));
  console.log("DONE pid="+pid);
})();
