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
  let raw=''; try{ raw=execSync(cmd,{encoding:'utf8',maxBuffer:300000000}); }catch(e){ return {__exc:String(e).slice(0,120)}; }
  try{ return JSON.parse(raw); }catch(e){ return {__pe:true, raw:raw.slice(0,300)}; }
}
(async()=>{
  const out={ts:new Date().toISOString()};
  // OPTIONS on products endpoint to see mnm_child_items schema details
  const opt = call('OPTIONS','/wp-json/wc/v3/products');
  const props = opt && opt.schema && opt.schema.properties || {};
  const ci = props.mnm_child_items || {};
  out.mnm_child_items_schema = {
    type: ci.type,
    desc: (ci.description||'').slice(0,120),
    items_props: ci.items && ci.items.properties ? Object.keys(ci.items.properties) : null,
    items_full: ci.items && ci.items.properties ? Object.fromEntries(Object.entries(ci.items.properties).map(([k,v])=>[k,{type:v.type,desc:(v.description||'').slice(0,100)}])) : null
  };
  // also any meta hints from existing test (none) - inspect a quickly-created test product's child items raw
  // create + read + delete probe product
  const cr = call('POST','/wp-json/wc/v3/products', {
    name:'PROBE child item schema (delete me)',
    type:'mix-and-match',
    status:'draft',
    sku:'PROBE-CHILD-'+Date.now(),
    mnm_content_source:'products',
    mnm_child_items:[{product_id:17421, min_quantity:1, max_quantity:1, default_quantity:1, optional:false}],
    mnm_min_container_size:1, mnm_max_container_size:1
  });
  const pid = cr && cr.id ? cr.id : null;
  out.probe_id = pid; out.probe_err = (cr && (cr.code||cr.__exc))||null;
  if(pid){
    const rb = call('GET','/wp-json/wc/v3/products/'+pid+'?context=edit');
    out.child_back = (rb.mnm_child_items||[]).map(c=>Object.keys(c));
    out.child_back_full = (rb.mnm_child_items||[])[0] || null;
    call('DELETE','/wp-json/wc/v3/products/'+pid+'?force=true');
  }
  commit('mnm_child_schema.json', JSON.stringify(out,null,1));
  console.log("DONE pid="+pid);
})();
