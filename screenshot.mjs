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
function call(method, path, bodyObj){
  let cmd='curl -sk -X '+method+' -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" -H "Accept: application/json"';
  if(bodyObj!==undefined){ fs.writeFileSync('/tmp/b.json', JSON.stringify(bodyObj)); cmd+=' -d @/tmp/b.json'; }
  cmd+=' "'+BASE+path+'"';
  let raw=''; try{ raw=execSync(cmd,{encoding:'utf8',maxBuffer:300000000}); }catch(e){ return {__exc:String(e).slice(0,120)}; }
  try{ return JSON.parse(raw); }catch(e){ return {__pe:true, raw:raw.slice(0,200)}; }
}
(async()=>{
  const out={ts:new Date().toISOString(), actions:{}};
  // 1. delete test products + order
  out.actions.del_34140 = (()=>{ const r=call('DELETE','/wp-json/wc/v3/products/34140?force=true'); return r&&r.id?('deleted '+r.id):(r.code||r.__exc||'?'); })();
  out.actions.del_34141_order = (()=>{ const r=call('DELETE','/wp-json/wc/v3/orders/34141?force=true'); return r&&r.id?('deleted '+r.id):(r.code||r.__exc||'?'); })();
  out.actions.del_34148 = (()=>{ const r=call('DELETE','/wp-json/wc/v3/products/34148?force=true'); return r&&r.id?('deleted '+r.id):(r.code||r.__exc||'?'); })();
  // also stray variations if parent delete didn't cascade
  for(const vid of [34149,34150,34151,34143,34144,34145,34146]){
    const r=call('DELETE','/wp-json/wc/v3/products/'+vid+'?force=true');
    out.actions['del_'+vid] = r&&r.id?'deleted':(r.code||'gone/na');
  }
  // 2. deactivate + delete Variable MnM plugin
  const PLUG='wc-mnm-variable/wc-mnm-variable';
  const deact = call('PUT','/wp-json/wp/v2/plugins/'+encodeURIComponent(PLUG), {status:'inactive'});
  out.actions.plugin_deactivate = deact && deact.status ? deact.status : (deact.code||deact.__exc||'?');
  const delp = call('DELETE','/wp-json/wp/v2/plugins/'+encodeURIComponent(PLUG));
  out.actions.plugin_delete = (delp && delp.deleted) ? 'deleted' : (delp.code || delp.__exc || JSON.stringify(delp).slice(0,80));
  // 3. TEMP snippets best-effort
  for(const sid of [519,521]){
    call('POST','/wp-json/code-snippets/v1/snippets/'+sid+'/deactivate', {});
    const d=call('DELETE','/wp-json/code-snippets/v1/snippets/'+sid);
    out.actions['snippet_'+sid] = (d && (d.id||d.deleted))?'deleted':(d.code||'500/manual');
  }
  // verify
  const p = call('GET','/wp-json/wp/v2/plugins?per_page=100');
  out.var_plugin_still = Array.isArray(p)? p.some(x=>/wc-mnm-variable/.test(x.plugin||'')) : 'check_fail';
  out.plugin_count = Array.isArray(p)? p.length : '?';
  const chk = call('GET','/wp-json/wc/v3/products?include=34140,34148&per_page=5');
  out.test_products_remaining = Array.isArray(chk)? chk.map(x=>x.id) : 'na';
  commit('cleanup.json', JSON.stringify(out,null,1));
  console.log("DONE");
})();
