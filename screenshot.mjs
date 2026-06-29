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
  const cmd='curl -sk -w "\\n__HTTP__%{http_code}" -X '+method+' -H "Authorization: '+AUTH+'" -H "Accept: application/json" "'+BASE+path+'"';
  try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000}); }catch(e){ return '__EXC__'+String(e).slice(0,150); }
}
(async()=>{
  const log={ts:new Date().toISOString()};
  // before: does 519 exist?
  const before = curlRaw('GET','/wp-json/code-snippets/v1/snippets/519');
  log.before = before.slice(0,200);
  // deactivate then delete
  log.deact = curlRaw('POST','/wp-json/code-snippets/v1/snippets/519/deactivate').slice(0,120);
  log.del = curlRaw('DELETE','/wp-json/code-snippets/v1/snippets/519').slice(0,200);
  // after: confirm gone
  const after = curlRaw('GET','/wp-json/code-snippets/v1/snippets/519');
  log.after = after.slice(0,200);
  // also confirm the rest route is gone
  const route = curlRaw('GET','/wp-json/petshop/v1/plugsrc');
  log.route_after = route.slice(0,160);
  commit('cleanup519.json', JSON.stringify(log,null,1));
  console.log("DONE");
})();
