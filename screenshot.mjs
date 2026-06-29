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
function summ(arr){ return (arr||[]).map(p=>({id:p.id, name:(p.name||'').slice(0,70), sku:p.sku, type:p.type, status:p.status, price:p.price, qty:p.stock_quantity, cats:(p.categories||[]).map(c=>c.name).join('|')})); }
(async()=>{
  const out={ts:new Date().toISOString()};
  out.q_konservu_rinkinys = summ(jget('/wp-json/wc/v3/products?search=konserv%C5%B3%20rinkinys&per_page=20&status=any'));
  out.q_mix = summ(jget('/wp-json/wc/v3/products?search=mix&per_page=25&status=any'));
  out.q_rinkinys_konser = summ(jget('/wp-json/wc/v3/products?search=rinkinys%20konserv&per_page=20&status=any'));
  commit('konser_search.json', JSON.stringify(out,null,1));
  console.log("DONE");
})();
