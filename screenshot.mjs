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
  const cmd='curl -sk -D /tmp/h.txt -H "Authorization: '+AUTH+'" -H "Accept: application/json" "'+BASE+path+'"';
  let body=''; let tp='1'; try{ body=execSync(cmd,{encoding:'utf8',maxBuffer:300000000});
    const h=fs.existsSync('/tmp/h.txt')?fs.readFileSync('/tmp/h.txt','utf8'):''; const m=h.match(/x-wp-totalpages:\s*(\d+)/i); if(m) tp=m[1];
  }catch(e){ return {__exc:String(e).slice(0,150)}; }
  try{ return {data:JSON.parse(body), tp}; }catch(e){ return {data:{__pe:true, raw:body.slice(0,300)}, tp}; }
}
(async()=>{
  const out={ts:new Date().toISOString()};

  // 1. THEMES
  const th = jget('/wp-json/wp/v2/themes?status=active');
  if(Array.isArray(th.data)){
    out.active_theme = th.data.map(t=>({stylesheet:t.stylesheet, template:t.template, name:(t.name&&t.name.rendered)||t.name, version:(t.version)||'', status:t.status}));
  } else { out.themes_raw = th.data; }

  // 2. PAGES
  let pages=[]; let page=1; let tp=1;
  do{
    const p = jget('/wp-json/wp/v2/pages?per_page=100&status=publish,draft,private&context=edit&page='+page);
    if(!Array.isArray(p.data)){ out.pages_err={page, data:p.data}; break; }
    for(const pg of p.data){
      const raw = (pg.content && pg.content.raw) || '';
      pages.push({id:pg.id, slug:pg.slug, title:(pg.title&&pg.title.rendered)||'', status:pg.status, template:pg.template||'(default)',
        uses_ux:/\[ux_/.test(raw), uses_products:/\[products|\[ux_products/.test(raw), uses_row:/\[row|\[col/.test(raw), len:raw.length});
    }
    tp=parseInt(p.tp||'1',10); page++;
  } while(page<=tp && page<=5);
  out.pages_total = pages.length;
  out.pages = pages;
  out.shortcode_users = pages.filter(p=>p.uses_ux||p.uses_products||p.uses_row).map(p=>({id:p.id,slug:p.slug,ux:p.uses_ux,prod:p.uses_products,row:p.uses_row}));

  // 3. product_cat: sprendimai / rinkiniai exist?
  const cats = jget('/wp-json/wc/v3/products/categories?per_page=100&search=');
  // search sprendimai + rinkiniai specifically
  const c1 = jget('/wp-json/wc/v3/products/categories?search=sprendim&per_page=10');
  const c2 = jget('/wp-json/wc/v3/products/categories?search=rinkin&per_page=10');
  out.cat_sprendimai = Array.isArray(c1.data)? c1.data.map(c=>({id:c.id,name:c.name,slug:c.slug,parent:c.parent,count:c.count})):c1.data;
  out.cat_rinkiniai  = Array.isArray(c2.data)? c2.data.map(c=>({id:c.id,name:c.name,slug:c.slug,parent:c.parent,count:c.count})):c2.data;

  // 4. page templates available from theme (types -> page supports?)
  const types = jget('/wp-json/wp/v2/types/page');
  out.page_template_field = (types.data && types.data.supports) ? Object.keys(types.data.supports) : (types.data && types.data.__pe ? 'pe' : 'n/a');

  commit('recon_theme.json', JSON.stringify(out,null,1));
  console.log("DONE");
})();
