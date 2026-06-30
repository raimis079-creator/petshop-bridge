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
function brief(arr){ return (arr||[]).filter(p=>p&&p.id).map(p=>({
  id:p.id, name:(p.name||'').slice(0,80), sku:p.sku, type:p.type, status:p.status,
  price:p.price, qty:p.stock_quantity,
  cats:(p.categories||[]).map(c=>c.id+':'+c.slug).join('|')
})); }
(async()=>{
  const out={ts:new Date().toISOString()};
  // 1. visos RINKINIAI kategorijos vaikai
  out.rinkiniai_679 = brief(jget('/wp-json/wc/v3/products?category=679&per_page=100&status=any'));
  out.konservu_682 = brief(jget('/wp-json/wc/v3/products?category=682&per_page=100&status=any'));
  out.skanestu_683 = brief(jget('/wp-json/wc/v3/products?category=683&per_page=100&status=any'));
  out.kramtalu_684 = brief(jget('/wp-json/wc/v3/products?category=684&per_page=100&status=any'));
  // 2. paieška pagal "rinkinys" — kad surasčiau tuos, kurie kitose kategorijose
  let by_name = [];
  for(let pg=1; pg<=3; pg++){
    const arr = jget('/wp-json/wc/v3/products?search=rinkinys&per_page=100&page='+pg+'&status=any');
    if(!Array.isArray(arr) || arr.length===0) break;
    by_name = by_name.concat(arr.filter(p=>p&&p.id));
  }
  out.by_name = brief(by_name).filter(p => /rinkinys/i.test(p.name));
  commit('rinkiniai_inventory.json', JSON.stringify(out,null,1));
  console.log("DONE");
})();
