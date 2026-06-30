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
(async()=>{
  const out={ts:new Date().toISOString()};
  // 11 kandidatų — patikrinti pagal ID, juos jau radau anksčiau:
  // 1. 16942 Ontario lašišos pasta 90g
  // 2. 17057 Ontario vištiena+lašiša 95g
  // 3. 17499 Miamor tunas+kalmarai 100g
  // 4. 17493 Miamor tunas+krevetės 100g
  // 5. Miamor Vitaldrink TUNO 135ml — nematėm dev'e, ieškau
  // 6. 19045 CATIT tuno paštetas + sardinės 95g
  // 7. Animonda Vom Feinsten Mild Menu kalakutiena+lašiša 100g — ieškau
  // 8. 17550 Miamor Feine Filets tunas krabų drebučiuose
  // 9. 17547 Miamor Feine Filets tunas lašišos drebučiuose
  // 10. 17538 Miamor Feine Filets tunas su krabais (skirtumas nuo #8?)
  // 11. 17541 Miamor Feine Filets tunas su kalmarais

  const ID_LIST = [16942, 17057, 17499, 17493, 19045, 17550, 17547, 17538, 17541];
  out.found = [];
  for(const id of ID_LIST){
    const p = jget('/wp-json/wc/v3/products/'+id);
    if(p && p.id) out.found.push({
      id:p.id, name:(p.name||'').slice(0,80), sku:p.sku,
      price:p.price, qty:p.stock_quantity, status:p.status
    });
  }

  // Ieškau Miamor Trinkfein Vitaldrink TUNO
  const miamor = jget('/wp-json/wc/v3/products?search=Miamor%20Trinkfein&per_page=10&status=publish');
  out.miamor_trinkfein = (miamor||[]).filter(p=>p&&p.id).map(p=>({
    id:p.id, name:(p.name||'').slice(0,80), sku:p.sku, price:p.price, qty:p.stock_quantity
  }));

  // Ieškau Animonda Vom Feinsten Mild Menu - kalakutiena+lašiša
  const anim = jget('/wp-json/wc/v3/products?search=Mild%20Menu&per_page=20&status=publish');
  out.animonda_mild_menu = (anim||[]).filter(p=>p&&p.id).map(p=>({
    id:p.id, name:(p.name||'').slice(0,80), sku:p.sku, price:p.price, qty:p.stock_quantity
  }));

  // Tikrinu ar 17538 yra "tunas su krabais drebučiuose" - pažiūrim aprašymą
  for(const id of [17538, 17550]){
    const p = jget('/wp-json/wc/v3/products/'+id);
    if(p && p.id) out['detail_'+id] = {name:p.name, sku:p.sku};
  }

  commit('vandenynas_check.json', JSON.stringify(out,null,1));
  console.log("DONE");
})();
