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
function createCat(name, slug, parent){
  const body={name, slug}; if(parent) body.parent=parent;
  const r = call('POST','/wp-json/wc/v3/products/categories', body);
  return {req:{name,slug,parent:parent||0}, id:(r&&r.id)||null, err:(r&&(r.__exc||r.code||(r.__pe?r.raw:null)))||null};
}
(async()=>{
  const out={ts:new Date().toISOString(), menus:{}, created:{tops:[], subs:[]}};

  // --- RECON MENUS ---
  const menus = call('GET','/wp-json/wp/v2/menus?per_page=50&context=edit');
  if(Array.isArray(menus)){
    out.menus.list = menus.map(m=>({id:m.id, name:m.name, slug:m.slug, locations:m.locations, count:m.count}));
    // fetch items for each menu
    out.menus.items = {};
    for(const m of menus){
      const it = call('GET','/wp-json/wp/v2/menu-items?menus='+m.id+'&per_page=100&context=edit&orderby=menu_order&order=asc');
      if(Array.isArray(it)){
        out.menus.items[m.id] = it.map(x=>({id:x.id, title:(x.title&&x.title.rendered)||x.title, parent:x.menu_order!==undefined?undefined:undefined, order:x.menu_order, type:x.type, object:x.object, obj_id:x.object_id, url:x.url, menu_parent:x.parent}));
      } else { out.menus.items[m.id]={err:it}; }
    }
  } else { out.menus.raw = menus; }

  // --- CREATE TOP CATEGORIES ---
  const T1 = createCat('RINKINIAI','rinkiniai',0);
  const T2 = createCat('SPRENDIMAI','sprendimai',0);
  const T3 = createCat('PASIŪLYMAI','pasiulymai',0);
  out.created.tops=[T1,T2,T3];

  // --- CREATE SUBCATEGORIES (first-pass, renamable) ---
  if(T1.id){
    out.created.subs.push(createCat('Konservų rinkiniai','konservu-rinkiniai',T1.id));
    out.created.subs.push(createCat('Skanėstų rinkiniai','skanestu-rinkiniai',T1.id));
    out.created.subs.push(createCat('Kramtalų rinkiniai','kramtalu-rinkiniai',T1.id));
  }
  if(T2.id){
    out.created.subs.push(createCat('Naujas šuniukas','naujas-suniukas',T2.id));
    out.created.subs.push(createCat('Naujas kačiukas','naujas-kaciukas',T2.id));
    out.created.subs.push(createCat('Jautrus virškinimas','jautrus-virskinimas',T2.id));
    out.created.subs.push(createCat('Šuo kasosi','suo-kasosi',T2.id));
  }
  if(T3.id){
    out.created.subs.push(createCat('Akcijiniai pasiūlymai','akcijiniai-pasiulymai',T3.id));
  }

  commit('build_cats.json', JSON.stringify(out,null,1));
  console.log("DONE");
})();
