import { execSync } from "child_process";
import fs from "fs";
const WP_USER = process.env.WP_USER, WP_PASS = process.env.WP_APP_PASS;
const BASE = "https://dev.avesa.lt";
const AUTH = "Basic " + Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo = process.env.GH_REPO, tok = process.env.GH_TOKEN;
function commit(name, str){
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  let sha='';
  try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){}
  const body={message:'health',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};
  if(sha) body.sha=sha;
  fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));
  execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'});
}
function wpGet(path){
  // returns {http, body}
  const out = execSync('curl -sk -w "\\n__HTTP__%{http_code}" -H "Authorization: '+AUTH+'" "'+BASE+path+'"',{encoding:'utf8',maxBuffer:50000000});
  const i = out.lastIndexOf('__HTTP__');
  const http = i>=0 ? out.slice(i+8).trim() : '???';
  const body = i>=0 ? out.slice(0,i) : out;
  return {http, body};
}
(async()=>{
  const report = { ts: new Date().toISOString(), wp_auth: null, snippets: {} };
  // 1) auth probe: list endpoint (lightweight)
  const list = wpGet('/wp-json/code-snippets/v1/snippets?limit=1');
  report.wp_auth = { http: list.http, ok: list.http==='200' };
  // 2) key snippets
  for (const id of [547,550,558,469,557]) {
    const r = wpGet('/wp-json/code-snippets/v1/snippets/'+id);
    let name=null, active=null;
    try{ const j=JSON.parse(r.body); name=j.name; active=j.active; }catch(e){}
    report.snippets[id] = { http: r.http, name, active };
  }
  const js = JSON.stringify(report, null, 2);
  commit('health.json', js);
  console.log(js);
})();
