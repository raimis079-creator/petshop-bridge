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
function api(path){
  let cmd='curl -sk -H "Authorization: '+AUTH+'" -H "Accept: application/json" "'+BASE+path+'"';
  let raw=exec(cmd);
  try{ return JSON.parse(raw); }catch(e){ return {__raw:raw.slice(0,300)}; }
}
(async()=>{
  const out={ts:new Date().toISOString()};
  // Ieškau choice tėvinių produktų
  const prods = api('/wp-json/wc/v3/products?per_page=30&status=publish&search=susirink');
  out.choice_parents = [];
  if(Array.isArray(prods)){
    for(const p of prods){
      // Ar turi choice config meta?
      const isChoice = (p.meta_data||[]).find(m=>m.key==='_petshop_is_choice_bundle');
      out.choice_parents.push({
        id: p.id, name: p.name, slug: p.slug, price: p.price,
        is_choice: isChoice ? isChoice.value : 'ne',
        type: p.type
      });
    }
  }
  // Aktyvūs choice snippet'ai
  const snips = api('/wp-json/code-snippets/v1/snippets');
  out.choice_snippets = Array.isArray(snips) ? snips.filter(s=>/susidėj|choice|547|550/i.test(s.name)).map(s=>({id:s.id,name:s.name,active:s.active})) : [];
  commit('rinkiniu_state.json', JSON.stringify(out,null,1));
  console.log("DONE");
})();
