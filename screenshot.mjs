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
  // Animonda GranCarno paieška — visi publish su likučiu
  const all = jget('/wp-json/wc/v3/products?search=GranCarno&per_page=50&status=publish');
  out.found = (all||[]).filter(p=>p&&p.id).map(p=>({
    id:p.id,
    name:(p.name||'').slice(0,80),
    sku:p.sku,
    price:p.price,
    qty:p.stock_quantity,
    type:p.type,
    cats:(p.categories||[]).map(c=>c.name).slice(0,2).join('|'),
    has_image: (p.images||[]).length > 0
  }));
  // filtruoju 400g + publish + qty > 5 + simple
  out.tinka_400g = out.found.filter(p =>
    p.type === 'simple' &&
    p.qty !== null && p.qty >= 5 &&
    /400\s?g/i.test(p.name) &&
    p.has_image
  );
  commit('animonda_search.json', JSON.stringify(out,null,1));
  console.log("DONE found="+out.found.length+" tinka="+out.tinka_400g.length);
})();
