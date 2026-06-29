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
  const cmd = 'curl -sk -H "Authorization: '+AUTH+'" -H "Accept: application/json" "'+BASE+path+'"';
  let body=''; try{ body=execSync(cmd,{encoding:'utf8',maxBuffer:300000000}); }catch(e){ return {__exc:String(e).slice(0,150)}; }
  try{ return JSON.parse(body); }catch(e){ return {__pe:true, raw:body.slice(0,300)}; }
}
(async()=>{
  const out={ts:new Date().toISOString()};
  // 1. plugins — find mix and match
  const p = jget('/wp-json/wp/v2/plugins?per_page=100');
  if(Array.isArray(p.data)){
    out.mnm = p.data.filter(x=>/mix.?and.?match|mix-?match/i.test((x.plugin||'')+' '+(x.name||''))).map(x=>({plugin:x.plugin,name:x.name,status:x.status,version:x.version}));
    out.total_plugins = p.data.length;
  } else { out.plugins_err = p.data; }
  // 2. product types registered (wc/v3 doesnt list types directly; check via products?type=mix_and_match)
  const t1 = jget('/wp-json/wc/v3/products?type=mix_and_match&per_page=1');
  out.type_mix_and_match = Array.isArray(t1.data) ? ('ok, count='+t1.data.length) : t1.data;
  // 3. namespaces — MnM may add wc-mnm route
  const root = jget('/wp-json/');
  out.mnm_namespaces = (root.namespaces||[]).filter(n=>/mnm|mix/i.test(n));
  out.mnm_routes = root.routes ? Object.keys(root.routes).filter(r=>/mnm|mix-and-match|mix_and_match/i.test(r)) : [];
  commit('mnm_check.json', JSON.stringify(out,null,1));
  console.log("DONE");
})();
