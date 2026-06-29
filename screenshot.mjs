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

function jget(path){
  const cmd = 'curl -sk -D /tmp/hdr.txt -H "Authorization: '+AUTH+'" -H "Accept: application/json" "'+BASE+path+'"';
  let body=''; let status=0; let totalPages='1'; let total='?';
  try{
    body = execSync(cmd, {encoding:'utf8', maxBuffer: 300000000});
    const hdr = fs.existsSync('/tmp/hdr.txt') ? fs.readFileSync('/tmp/hdr.txt','utf8') : '';
    const ms = hdr.match(/HTTP\/[\d.]+\s+(\d+)/); if(ms) status = parseInt(ms[1],10);
    const mp = hdr.match(/x-wp-totalpages:\s*(\d+)/i); if(mp) totalPages = mp[1];
    const mt = hdr.match(/x-wp-total:\s*(\d+)/i); if(mt) total = mt[1];
  }catch(e){ return {status:-1, data:{__exc:String(e).slice(0,200)}, totalPages:'1', total:'?'}; }
  let data; try{ data=JSON.parse(body); }catch(e){ data={__parse_error:true, raw:body.slice(0,400)}; }
  return {status, data, totalPages, total};
}

function meta(p, key){
  const m = (p.meta_data||[]).find(x=>x.key===key);
  return m ? m.value : null;
}

(async()=>{
  const out={ts:new Date().toISOString()};

  // 1. REST namespaces
  const root = jget('/wp-json/');
  out.namespaces = (root.data && root.data.namespaces) ? root.data.namespaces : root.data;
  // routes hinting at promotions/fbt/bundle/mix
  if(root.data && root.data.routes){
    out.custom_routes = Object.keys(root.data.routes).filter(r=>/promo|fbt|bundle|mix|petshop/i.test(r));
  }

  // 2. Concrete dual-SKU example: Monge Solo
  const ms = jget('/wp-json/wc/v3/products?search=Monge%20Solo&per_page=20');
  out.monge_solo = Array.isArray(ms.data) ? ms.data.map(p=>({
    id:p.id, name:p.name, sku:p.sku, type:p.type, status:p.status,
    manage_stock:p.manage_stock, stock_quantity:p.stock_quantity, stock_status:p.stock_status,
    legacy_manuf: meta(p,'_legacy_manufacturer'), legacy_src: meta(p,'_legacy_source'),
    zb_sku: meta(p,'_zb_supplier_sku'), vf_sku: meta(p,'_vf_supplier_sku')
  })) : {err:ms.data, status:ms.status};

  // 3. manage_stock reality across catalog — sample 4 pages (400 products)
  let total=0; let stats={total_seen:0, manage_on:0, manage_off:0, stock_status:{}, types:{}};
  let legacy={seen:0, manage_on:0, manage_off:0, examples:[]};
  let zb={seen:0, manage_on:0}; let vf={seen:0, manage_on:0};
  for(let page=1; page<=4; page++){
    const r = jget('/wp-json/wc/v3/products?per_page=100&page='+page+'&orderby=id&order=asc');
    if(page===1) total = r.total;
    if(!Array.isArray(r.data)){ out.products_err={page,status:r.status,data:r.data}; break; }
    for(const p of r.data){
      stats.total_seen++;
      if(p.manage_stock) stats.manage_on++; else stats.manage_off++;
      stats.stock_status[p.stock_status]=(stats.stock_status[p.stock_status]||0)+1;
      stats.types[p.type]=(stats.types[p.type]||0)+1;
      const lm = meta(p,'_legacy_manufacturer'); const ls = meta(p,'_legacy_source');
      const zbs = meta(p,'_zb_supplier_sku'); const vfs = meta(p,'_vf_supplier_sku');
      if(lm || ls){
        legacy.seen++;
        if(p.manage_stock) legacy.manage_on++; else legacy.manage_off++;
        if(legacy.examples.length<12) legacy.examples.push({id:p.id,sku:p.sku,name:(p.name||'').slice(0,40),manage_stock:p.manage_stock,qty:p.stock_quantity,ss:p.stock_status,lm:lm});
      }
      if(zbs){ zb.seen++; if(p.manage_stock) zb.manage_on++; }
      if(vfs){ vf.seen++; if(p.manage_stock) vf.manage_on++; }
    }
  }
  out.total_products = total;
  out.stats = stats;
  out.legacy = legacy;
  out.zb = zb;
  out.vf = vf;

  commit('recon_stock.json', JSON.stringify(out,null,1));
  console.log("DONE");
})();
