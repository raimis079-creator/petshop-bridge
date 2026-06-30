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
function api(method, path){
  let cmd='curl -sk -X '+method+' -H "Authorization: '+AUTH+'" -H "Accept: application/json" "'+BASE+path+'"';
  let raw=exec(cmd);
  try{ return JSON.parse(raw); }catch(e){ return {__raw:raw.slice(0,300)}; }
}
(async()=>{
  const out={ts:new Date().toISOString()};
  // 1. Ištrinu testinį 34179
  const del = api('DELETE','/wp-json/wc/v3/products/34179?force=true');
  out.deleted_test = del && del.id ? 'OK '+del.id : (del.__raw||'?');

  // 2. Patikrinu, kokios gramatūros yra šunų konservuose - per atributo reikšmes
  // Kategorija 73 = Konservai šunims
  const prods = api('GET','/wp-json/wc/v3/products?category=73&per_page=100&status=publish');
  out.total_dog_cans = Array.isArray(prods) ? prods.length : 0;
  // Surenkam gramatūras
  const gramaturos = {};
  const brandai = {};
  if(Array.isArray(prods)){
    for(const p of prods){
      const attrs = p.attributes || [];
      for(const a of attrs){
        if(a.name === 'Pakuotės dydis'){
          for(const opt of (a.options||[])){
            gramaturos[opt] = (gramaturos[opt]||0) + 1;
          }
        }
      }
      // Brandas iš pavadinimo (pirmas žodis)
      const brand = (p.name||'').split(' ')[0];
      brandai[brand] = (brandai[brand]||0) + 1;
    }
  }
  out.gramaturos = gramaturos;
  out.brandai = brandai;
  commit('gram_recon.json', JSON.stringify(out,null,1));
  console.log("DONE");
})();
