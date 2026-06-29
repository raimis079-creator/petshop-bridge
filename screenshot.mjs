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
function curlRaw(method, path){
  const cmd='curl -sk -X '+method+' -H "Authorization: '+AUTH+'" -H "Accept: application/json" "'+BASE+path+'"';
  let b=''; try{ b=execSync(cmd,{encoding:'utf8',maxBuffer:300000000}); }catch(e){ return {__exc:String(e).slice(0,150)}; }
  try{ return JSON.parse(b); }catch(e){ return {__pe:true, raw:b.slice(0,300)}; }
}
(async()=>{
  const out={ts:new Date().toISOString()};
  // OPTIONS on products endpoint to read schema
  const opt = curlRaw('OPTIONS','/wp-json/wc/v3/products');
  const props = (opt && opt.schema && opt.schema.properties) ? opt.schema.properties : null;
  if(props){
    out.all_prop_count = Object.keys(props).length;
    // MnM-related fields
    const rx = /mnm|mix|container|contents|priced_per|shipped_per|min_container|max_container|child/i;
    out.mnm_fields = {};
    for(const k of Object.keys(props)){
      if(rx.test(k)){
        out.mnm_fields[k] = { type: props[k].type, desc: (props[k].description||'').slice(0,120), context: props[k].context };
      }
    }
    // also list ALL property keys (compact) to spot anything
    out.all_props = Object.keys(props);
  } else {
    out.options_raw = (opt&&opt.__pe)? opt.raw : (opt? Object.keys(opt): opt);
  }
  commit('mnm_schema.json', JSON.stringify(out,null,1));
  console.log("DONE");
})();
