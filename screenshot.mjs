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
const PID=34143;
const MAP=[{id:34144,sz:6,price:'14.99'},{id:34145,sz:12,price:'26.99'},{id:34146,sz:15,price:'31.99'}];
(async()=>{
  const out={ts:new Date().toISOString(), updates:[]};
  for(const m of MAP){
    const body={ regular_price:m.price, mnm_min_container_size:m.sz, mnm_max_container_size:m.sz, mnm_priced_per_product:false };
    const u = call('PUT','/wp-json/wc/v3/products/'+PID+'/variations/'+m.id, body);
    out.updates.push({id:m.id, size:m.sz, ret_price:u&&u.regular_price, ret_min:u&&u.mnm_min_container_size, ret_max:u&&u.mnm_max_container_size, err:(u&&(u.__exc||u.code))||null});
  }
  // read back
  const vs = call('GET','/wp-json/wc/v3/products/'+PID+'/variations?context=edit&per_page=20');
  out.final = Array.isArray(vs)? vs.map(v=>({id:v.id, dydis:(v.attributes||[]).map(a=>a.option).join(','), price:v.regular_price, min:v.mnm_min_container_size, max:v.mnm_max_container_size, pool:Array.isArray(v.mnm_child_items)?v.mnm_child_items.length:v.mnm_child_items})).sort((a,b)=>a.price-b.price) : vs;
  // also parent purchasable
  const par = call('GET','/wp-json/wc/v3/products/'+PID);
  out.parent_price_html = (par&&par.price_html||'').replace(/<[^>]+>/g,'').slice(0,80);
  out.parent_permalink = par&&par.permalink;
  commit('varmnm_fix.json', JSON.stringify(out,null,1));
  console.log("DONE");
})();
