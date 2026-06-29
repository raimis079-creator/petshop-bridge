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
(async()=>{
  const out={ts:new Date().toISOString()};
  const p = jget('/wp-json/wp/v2/plugins?per_page=100');
  if(Array.isArray(p)){
    out.plugin_count = p.length;
    out.variable_gone = !p.some(x=>/wc-mnm-variable/.test(x.plugin||''));
    out.core_mnm_present = p.some(x=>/woocommerce-mix-and-match-products/.test(x.plugin||''));
    out.core_mnm = p.filter(x=>/mix-and-match/i.test((x.plugin||'')+(x.name||''))).map(x=>({name:x.name,status:x.status,version:x.version}));
  } else out.plugins_err=p;
  // snippets check
  const s = jget('/wp-json/code-snippets/v1/snippets?per_page=100');
  if(Array.isArray(s)){
    out.temp_snippets_remaining = s.filter(x=>/TEMP|519|521/.test(x.name||'')||[519,521].includes(x.id)).map(x=>({id:x.id,name:x.name,active:x.active}));
  } else out.snippets_note='endpoint na';
  // type enum — should no longer include variable-mix-and-match
  const t = jget('/wp-json/wc/v3/products?type=__x__&per_page=1');
  out.type_enum = (t&&t.data&&t.data.params&&t.data.params.type)?t.data.params.type:(t&&t.details&&t.details.type&&t.details.type.message)?t.details.type.message:'?';
  commit('verify_clean.json', JSON.stringify(out,null,1));
  console.log("DONE");
})();
