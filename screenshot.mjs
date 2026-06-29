import { execSync } from "child_process";
import fs from "fs";

const repo = process.env.GH_REPO, tok = process.env.GH_TOKEN;
const WP_USER = process.env.WP_USER, WP_PASS = process.env.WP_APP_PASS;
const BASE = "https://dev.avesa.lt";
const AUTH = "Basic " + Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");

function commit(name, str){
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  let sha='';
  try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){}
  const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};
  if(sha) body.sha=sha;
  fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));
  execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'});
}

async function jget(path){
  const r = await fetch(BASE+path, {headers:{Authorization:AUTH, Accept:'application/json'}});
  const txt = await r.text();
  let data; try{ data=JSON.parse(txt); }catch(e){ data={__parse_error:true, raw:txt.slice(0,400)}; }
  return {status:r.status, data, total:r.headers.get('x-wp-total'), totalPages:r.headers.get('x-wp-totalpages')};
}

(async()=>{
  const out={ts:new Date().toISOString(), base:BASE};

  // 1. PLUGINS
  try{
    const p = await jget('/wp-json/wp/v2/plugins?per_page=100');
    if(Array.isArray(p.data)){
      out.plugins_status = p.status;
      out.plugins_count = p.data.length;
      out.plugins = p.data.map(x=>({plugin:x.plugin, name:x.name, status:x.status, version:x.version}));
      out.mix_match  = p.data.filter(x=>/mix.?and.?match|mix-?match/i.test((x.plugin||'')+' '+(x.name||''))).map(x=>({plugin:x.plugin,name:x.name,status:x.status,version:x.version}));
      out.composite  = p.data.filter(x=>/composite/i.test((x.plugin||'')+' '+(x.name||''))).map(x=>({plugin:x.plugin,name:x.name,status:x.status,version:x.version}));
      out.bundles    = p.data.filter(x=>/bundle/i.test((x.plugin||'')+' '+(x.name||''))).map(x=>({plugin:x.plugin,name:x.name,status:x.status,version:x.version}));
    } else {
      out.plugins_status = p.status;
      out.plugins_err = p.data;
    }
  }catch(e){ out.plugins_exc = String(e).slice(0,200); }

  // 2. PRODUCT CATEGORIES (paginate, full tree)
  try{
    let cats=[]; let page=1; let tp=1;
    do{
      const c = await jget('/wp-json/wc/v3/products/categories?per_page=100&orderby=name&order=asc&page='+page);
      if(!Array.isArray(c.data)){ out.cats_err={page, status:c.status, data:c.data}; break; }
      cats = cats.concat(c.data.map(x=>({id:x.id, name:x.name, slug:x.slug, parent:x.parent, count:x.count})));
      tp = parseInt(c.totalPages||'1',10);
      page++;
    } while(page<=tp && page<=12);
    out.cats_total = cats.length;
    out.cats_relevant = cats.filter(x=>/rinkin|daugiau|pigiau|dovan|box|mix|pick|degust|monoprot|jautr|virsk/i.test((x.name||'')+' '+(x.slug||'')));
    out.cats_top_level = cats.filter(x=>x.parent===0).map(x=>({id:x.id,name:x.name,slug:x.slug,count:x.count}));
    out.cats_all = cats;
  }catch(e){ out.cats_exc = String(e).slice(0,200); }

  commit('recon_rinkiniai.json', JSON.stringify(out,null,1));
  console.log("DONE recon_rinkiniai.json");
})();
