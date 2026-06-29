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
function srch(q){ return jget('/wp-json/wc/v3/products?search='+encodeURIComponent(q)+'&per_page=8&status=any'); }
function brief(arr){ return (arr||[]).filter(p=>p&&p.id).map(p=>({id:p.id, name:(p.name||'').slice(0,62), sku:p.sku, type:p.type, st:p.status, price:p.price, qty:p.stock_quantity, cat:(p.categories||[]).map(c=>c.name).slice(0,2).join('|')})); }
(async()=>{
  const out={ts:new Date().toISOString(), queries:{}};
  const Q = {
    '1_monge_bwild_antiena':'BWild antiena',
    '2_animonda_beef_lamb':'GranCarno Beef Lamb',
    '3_animonda_beef':'GranCarno Adult Beef',
    '4_ontario_beef_zoleles':'Ontario jautiena žolel',
    '5_animonda_sens_turkey':'GranCarno Sensitive kalakut',
    '6_ontario_lamb_saltalankis':'Ontario ėriena šaltalank'
  };
  for(const k in Q){ out.queries[k] = brief(srch(Q[k])); }
  // also broad Animonda GranCarno 400g landscape + Ontario + Monge BWild
  out.broad_animonda = brief(jget('/wp-json/wc/v3/products?search=GranCarno&per_page=15&status=any'));
  // MnM per-item quantity capability: inspect child item schema on a real MnM product (none exist now) -> check product schema OPTIONS
  const opt = jget('/wp-json/wc/v3/products');
  // instead inspect mnm_child_items definition via OPTIONS
  commit('komponentu_paieska.json', JSON.stringify(out,null,1));
  console.log("DONE");
})();
