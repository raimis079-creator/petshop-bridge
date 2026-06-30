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
  // Visa Animonda GranCarno (per_page 100)
  let all=[]; for(let pg=1; pg<=3; pg++){
    const arr = jget('/wp-json/wc/v3/products?search=GranCarno&per_page=100&page='+pg+'&status=publish');
    if(!Array.isArray(arr) || arr.length===0) break;
    all = all.concat(arr.filter(p=>p&&p.id));
  }
  // Filtruoju: simple, su nuotrauka, NE rinkinys pavadinime, su likučiu
  out.tinka_visi = all.filter(p=>
    p.type==='simple' &&
    p.stock_quantity !== null && p.stock_quantity >= 5 &&
    (p.images||[]).length > 0 &&
    !/rinkin/i.test(p.name)
  ).map(p=>({
    id:p.id,
    name:(p.name||'').slice(0,90),
    sku:p.sku,
    price:p.price,
    qty:p.stock_quantity,
    cats:(p.categories||[]).map(c=>c.name).slice(0,2).join('|')
  }));
  out.total_grancarno = all.length;
  commit('animonda_full.json', JSON.stringify(out,null,1));
  console.log("DONE total="+all.length+" tinka="+out.tinka_visi.length);
})();
