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
  let raw=''; try{ raw=execSync(cmd,{encoding:'utf8',maxBuffer:300000000}); }catch(e){ return {__exc:String(e).slice(0,150)}; }
  try{ return JSON.parse(raw); }catch(e){ return {__pe:true, raw:raw.slice(0,300)}; }
}
const PID=34143, VID=34144;
(async()=>{
  const out={ts:new Date().toISOString()};
  // try multiple candidate meta keys
  const body={ meta_data:[
    {key:'_mnm_min_container_size', value:'6'},
    {key:'_mnm_max_container_size', value:'6'},
    {key:'_min_container_size', value:'6'},
    {key:'_max_container_size', value:'6'}
  ]};
  const u = call('PUT','/wp-json/wc/v3/products/'+PID+'/variations/'+VID, body);
  out.put_min = u && u.mnm_min_container_size;
  out.put_max = u && u.mnm_max_container_size;
  // read back full meta to see what stuck
  const rb = call('GET','/wp-json/wc/v3/products/'+PID+'/variations/'+VID+'?context=edit');
  out.field_min = rb.mnm_min_container_size; out.field_max = rb.mnm_max_container_size;
  out.meta = (rb.meta_data||[]).filter(m=>/container|mnm|size/i.test(m.key)).map(m=>({k:m.key,v:m.value}));
  out.all_meta_keys = (rb.meta_data||[]).map(m=>m.key);
  commit('varmnm_meta.json', JSON.stringify(out,null,1));
  console.log("DONE");
})();
