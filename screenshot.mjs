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
function http(method, path){
  const cmd='curl -sk -o /dev/null -w "%{http_code}" -X '+method+' -H "Authorization: '+AUTH+'" "'+BASE+path+'"';
  try{ return execSync(cmd,{encoding:'utf8'}).trim(); }catch(e){ return 'EXC'; }
}
(async()=>{
  const log={ts:new Date().toISOString()};
  log.get_before = http('GET','/wp-json/code-snippets/v1/snippets/519');
  log.delete_force = http('DELETE','/wp-json/code-snippets/v1/snippets/519?force=true');
  log.get_after_force = http('GET','/wp-json/code-snippets/v1/snippets/519');
  log.delete_plain = http('DELETE','/wp-json/code-snippets/v1/snippets/519');
  log.get_final = http('GET','/wp-json/code-snippets/v1/snippets/519');
  log.route_final = http('GET','/wp-json/petshop/v1/plugsrc');
  commit('cleanup519b.json', JSON.stringify(log,null,1));
  console.log("DONE");
})();
