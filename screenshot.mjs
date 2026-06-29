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
  let body=''; let status=0; let totalPages='1';
  try{
    body = execSync(cmd, {encoding:'utf8', maxBuffer: 300000000});
    const hdr = fs.existsSync('/tmp/hdr.txt') ? fs.readFileSync('/tmp/hdr.txt','utf8') : '';
    const ms = hdr.match(/HTTP\/[\d.]+\s+(\d+)/);
    if(ms) status = parseInt(ms[1],10);
    const mp = hdr.match(/x-wp-totalpages:\s*(\d+)/i);
    if(mp) totalPages = mp[1];
  }catch(e){ return {status:-1, data:{__exc:String(e).slice(0,200)}, totalPages:'1'}; }
  let data; try{ data=JSON.parse(body); }catch(e){ data={__parse_error:true, raw:body.slice(0,400)}; }
  return {status, data, totalPages};
}

(async()=>{
  const out={ts:new Date().toISOString(), base:BASE};

  const p = jget('/wp-json/wp/v2/plugins?per_page=100');
  out.plugins_status = p.status;
  if(Array.isArray(p.data)){
    out.plugins_count = p.data.length;
    out.mix_match  = p.data.filter(x=>/mix.?and.?match|mix-?match/i.test((x.plugin||'')+' '+(x.name||''))).map(x=>({plugin:x.plugin,name:x.name,status:x.status,version:x.version}));
    out.composite  = p.data.filter(x=>/composite/i.test((x.plugin||'')+' '+(x.name||''))).map(x=>({plugin:x.plugin,name:x.name,status:x.status,version:x.version}));
    out.bundles    = p.data.filter(x=>/bundle/i.test((x.plugin||'')+' '+(x.name||''))).map(x=>({plugin:x.plugin,name:x.name,status:x.status,version:x.version}));
    out.plugins = p.data.map(x=>({plugin:x.plugin, status:x.status, version:x.version}));
  } else {
    out.plugins_err = p.data;
  }

  let cats=[]; let page=1; let tp=1;
  do{
    const c = jget('/wp-json/wc/v3/products/categories?per_page=100&orderby=name&order=asc&page='+page);
    if(!Array.isArray(c.data)){ out.cats_err={page, status:c.status, data:c.data}; break; }
    cats = cats.concat(c.data.map(x=>({id:x.id, name:x.name, slug:x.slug, parent:x.parent, count:x.count})));
    tp = parseInt(c.totalPages||'1',10);
    page++;
  } while(page<=tp && page<=12);
  out.cats_total = cats.length;
  out.cats_relevant = cats.filter(x=>/rinkin|daugiau|pigiau|dovan|\bbox\b|mix|pick|degust|monoprot|jautr|virsk/i.test((x.name||'')+' '+(x.slug||'')));
  out.cats_top_level = cats.filter(x=>x.parent===0).map(x=>({id:x.id,name:x.name,slug:x.slug,count:x.count}));
  out.cats_all = cats;

  commit('recon_rinkiniai.json', JSON.stringify(out,null,1));
  console.log("DONE");
})();
