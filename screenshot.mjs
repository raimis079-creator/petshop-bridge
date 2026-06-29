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
  let body=''; try{ body=execSync(cmd,{encoding:'utf8',maxBuffer:300000000}); }catch(e){ return {__exc:String(e).slice(0,120)}; }
  try{ return JSON.parse(body); }catch(e){ return {__pe:true, raw:body.slice(0,150)}; }
}
function strip(h){ return (h||'').replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/&[a-z]+;/g,' ').replace(/\s+/g,' ').trim(); }
(async()=>{
  const out={ts:new Date().toISOString(), sets:{}};
  for(const id of [17735, 19526, 19516, 17732, 17729]){
    const wc = jget('/wp-json/wc/v3/products/'+id);
    const wp = jget('/wp-json/wp/v2/product/'+id+'?context=edit');
    out.sets[id] = {
      name: wc && wc.name,
      sku: wc && wc.sku,
      price: wc && wc.price,
      qty: wc && wc.stock_quantity,
      images: (wc && wc.images || []).length,
      cats: (wc&&wc.categories||[]).map(c=>c.name).join('|'),
      short: strip(wc && wc.short_description).slice(0,400),
      desc: strip(wp && wp.content && wp.content.raw).slice(0,900)
    };
  }
  commit('sets_detail.json', JSON.stringify(out,null,1));
  console.log("DONE");
})();
