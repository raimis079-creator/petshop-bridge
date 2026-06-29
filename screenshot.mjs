import { execSync } from "child_process";
import fs from "fs";
const repo = process.env.GH_REPO, tok = process.env.GH_TOKEN;
const WP_USER = process.env.WP_USER, WP_PASS = process.env.WP_APP_PASS;
const BASE = "https://dev.avesa.lt";
const AUTH = "Basic " + Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
function commit(name, str){
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  let sha='';
  try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){}
  const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};
  if(sha) body.sha=sha;
  fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));
  execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'});
}
function jget(path){
  const cmd = 'curl -sk -H "Authorization: '+AUTH+'" -H "Accept: application/json" "'+BASE+path+'"';
  let body=''; try{ body = execSync(cmd, {encoding:'utf8', maxBuffer: 300000000}); }catch(e){ return {__exc:String(e).slice(0,200)}; }
  try{ return JSON.parse(body); }catch(e){ return {__parse_error:true, raw:body.slice(0,300)}; }
}
(async()=>{
  const out={ts:new Date().toISOString()};
  const root = jget('/wp-json/');
  const routes = (root && root.routes) ? root.routes : {};
  const cs = {};
  for(const r of Object.keys(routes)){
    if(/code-snippets/i.test(r)){
      const ep = routes[r].endpoints || [];
      cs[r] = ep.map(e=>({methods:e.methods, args: e.args ? Object.keys(e.args) : []}));
    }
  }
  out.code_snippets_routes = cs;
  commit('recon_csapi.json', JSON.stringify(out,null,1));
  console.log("DONE");
})();
