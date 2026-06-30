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
  let cmd='curl -sk -X '+method+' -H "Authorization: '+AUTH+'" "'+BASE+path+'"';
  let raw=exec(cmd);
  try{ return JSON.parse(raw); }catch(e){ return {__raw:raw.slice(0,200)}; }
}
(async()=>{
  const out={ts:new Date().toISOString(), deleted:[]};
  // Tėvinis + 6 paslėpti
  for(const id of [34189, 34183, 34184, 34185, 34186, 34187, 34188]){
    const d = api('DELETE','/wp-json/wc/v3/products/'+id+'?force=true');
    out.deleted.push({id, result: d&&d.id?'OK':'fail/jau nėra'});
  }
  // Patikrinu ar liko choice produktų (is_choice_bundle meta)
  const remaining = api('GET','/wp-json/wc/v3/products?per_page=50&status=publish&search=susidėk');
  out.remaining_choice = Array.isArray(remaining) ? remaining.map(p=>({id:p.id,name:p.name})) : [];
  commit('cleanup_choice.json', JSON.stringify(out,null,1));
  console.log("DONE");
})();
