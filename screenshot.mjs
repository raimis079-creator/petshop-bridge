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

  // 1. Šunų konservų kategorijos
  const cats = api('/wp-json/wc/v3/products/categories?per_page=100&search=konserv');
  out.konserv_cats = Array.isArray(cats) ? cats.map(c=>({id:c.id, name:c.name, slug:c.slug, parent:c.parent, count:c.count})) : [];

  // 2. Visi produktų atributai (ar yra "gramatūra", "tipas", "hipoalerginis")
  const attrs = api('/wp-json/wc/v3/products/attributes');
  out.attributes = Array.isArray(attrs) ? attrs.map(a=>({id:a.id, name:a.name, slug:a.slug})) : [];

  // 3. Pavyzdys šunų konservų (pirmi 15) — žiūriu jų struktūrą
  // Ieskom pagal kategoriją "konservai šunims" arba panašiai
  const dogCanCat = (out.konserv_cats.find(c=>/sun|šun/i.test(c.name)) || {}).id;
  out.dog_can_cat_used = dogCanCat;

  let prods;
  if(dogCanCat){
    prods = api('/wp-json/wc/v3/products?category='+dogCanCat+'&per_page=15&status=publish');
  } else {
    prods = api('/wp-json/wc/v3/products?search=konservai&per_page=15&status=publish');
  }
  out.sample_products = Array.isArray(prods) ? prods.map(p=>({
    id: p.id,
    name: (p.name||'').slice(0,55),
    sku: p.sku,
    price: p.price,
    cats: (p.categories||[]).map(c=>c.name).join('|'),
    tags: (p.tags||[]).map(t=>t.name).join('|'),
    attributes: (p.attributes||[]).map(a=>a.name+':'+(a.options||[]).join(',')).join(' || ')
  })) : [];

  commit('dog_can_recon.json', JSON.stringify(out,null,1));
  console.log("DONE");
})();
