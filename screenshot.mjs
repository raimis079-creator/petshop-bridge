import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'pub34228',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbp.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbp.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000}); }catch(e){ return 'EXC:'+e.message; } }
(async()=>{
  var out={};
  fs.writeFileSync('/tmp/pub.json', JSON.stringify({status:'publish'}));
  out.http=exec('curl -sk -o /dev/null -w "%{http_code}" -X POST -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" -d @/tmp/pub.json "'+BASE+'/wp-json/wp/v2/product/34228"');
  var r=exec('curl -sk -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/wp/v2/product/34228"');
  try{ var j=JSON.parse(r); out.status=j.status; out.link=j.link; }catch(e){ out.err=e.message; }
  commit('pub34228.json', JSON.stringify(out)); console.log(JSON.stringify(out));
})();
