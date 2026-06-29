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
  let body=''; try{ body=execSync(cmd,{encoding:'utf8',maxBuffer:300000000}); }catch(e){ return {__exc:String(e).slice(0,150)}; }
  try{ return JSON.parse(body); }catch(e){ return {__pe:true, raw:body.slice(0,200)}; }
}
(async()=>{
  const out={ts:new Date().toISOString()};
  const p = jget('/wp-json/wp/v2/plugins?search=mix');
  out.plugins_search_mix = Array.isArray(p)? p.map(x=>({plugin:x.plugin,name:x.name,status:x.status,version:x.version})) : p;
  const p2 = jget('/wp-json/wp/v2/plugins?per_page=100');
  out.all_count = Array.isArray(p2)? p2.length : 'err';
  if(Array.isArray(p2)) out.mnm = p2.filter(x=>/mix/i.test((x.plugin||'')+(x.name||''))).map(x=>({plugin:x.plugin,name:x.name,status:x.status,version:x.version}));
  const t = jget('/wp-json/wc/v3/products?type=mix-and-match&per_page=5');
  out.existing_mnm_products = Array.isArray(t)? t.map(x=>({id:x.id,name:x.name,status:x.status})) : t;
  commit('mnm_check2.json', JSON.stringify(out,null,1));
  console.log("DONE");
})();
