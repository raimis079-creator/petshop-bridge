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
function jget(path){
  const cmd='curl -sk -H "Authorization: '+AUTH+'" -H "Accept: application/json" "'+BASE+path+'"';
  let raw=''; try{ raw=execSync(cmd,{encoding:'utf8',maxBuffer:300000000}); }catch(e){ return {__exc:String(e).slice(0,120)}; }
  try{ return JSON.parse(raw); }catch(e){ return {__pe:true, raw:raw.slice(0,200)}; }
}
(async()=>{
  const out={ts:new Date().toISOString()};
  // 1. pirmasis rinkinys vis dar OK?
  const r = jget('/wp-json/wc/v3/products/34153');
  out.rinkinys_34153 = r && r.id ? {id:r.id, name:r.name, sku:r.sku, type:r.type, status:r.status, price:r.price, qty:r.stock_quantity, min:r.mnm_min_container_size, max:r.mnm_max_container_size, pool_count:(r.mnm_child_items||[]).length, cats:(r.categories||[]).map(c=>c.id+':'+c.slug).join('|'), images:(r.images||[]).length} : 'NOT FOUND';
  // 2. kategorijos slug'ai
  for(const cid of [679,682,683,684]){
    const c = jget('/wp-json/wc/v3/products/categories/'+cid);
    out['cat_'+cid] = c && c.id ? {name:c.name, slug:c.slug, parent:c.parent, count:c.count} : c;
  }
  // 3. snippet 524 vis dar OK?
  const s = jget('/wp-json/code-snippets/v1/snippets/524');
  out.snippet_524 = s && s.id ? {id:s.id, active:s.active, name:(s.name||'').slice(0,80), code_len:(s.code||'').length} : 'NOT FOUND';
  // 4. python+PIL ant runner'io
  try{ execSync('python3 -c "from PIL import Image; print(Image.__version__ if hasattr(Image,\"__version__\") else \"PIL OK\")"',{encoding:'utf8'}); out.pil = 'OK'; }catch(e){ out.pil = 'NA'; }
  commit('rinkinys_recon.json', JSON.stringify(out,null,1));
  console.log("DONE");
})();
