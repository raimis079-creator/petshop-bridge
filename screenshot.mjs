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
  // Visos product kategorijos, susijusios su rinkiniais
  const cats = api('/wp-json/wc/v3/products/categories?per_page=100&orderby=name');
  out.all_cats = [];
  if(Array.isArray(cats)){
    for(const c of cats){
      // Ieskau "rinkin" pavadinime/slug arba parent yra rinkiniai
      const isRinkinys = (c.slug||'').includes('rinkin') || (c.name||'').toLowerCase().includes('rinkin');
      if(isRinkinys){
        out.all_cats.push({
          id: c.id, name: c.name, slug: c.slug,
          parent: c.parent, count: c.count, menu_order: c.menu_order
        });
      }
    }
  }
  // Visi MnM rinkiniai ir jų kategorijos
  const bundles = api('/wp-json/wc/v3/products?type=mix-and-match&per_page=30');
  out.bundles = Array.isArray(bundles) ? bundles.map(p=>({
    id:p.id, name:p.name,
    cats:(p.categories||[]).map(c=>c.slug+':'+c.name).join(' | ')
  })) : [];
  commit('cat_recon.json', JSON.stringify(out,null,1));
  console.log("DONE");
})();
