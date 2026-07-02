import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'pub',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbpub.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbpub.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:30000}); }catch(e){ return 'EXC:'+e.message; } }
(async()=>{
  var out={};
  for (var id of [34260, 34261]){
    exec('curl -sk -m 15 -o /dev/null -X POST -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" -d \'{"status":"publish"}\' "'+BASE+'/wp-json/wp/v2/pages/'+id+'"');
  }
  await new Promise(r=>setTimeout(r,1500));
  // patikra
  var r = exec('curl -sk -m 20 "'+BASE+'/wp-json/wp/v2/pages/34260" -H "Authorization: '+AUTH+'"');
  try{ out.jautrus = JSON.parse(r).status; }catch(e){ out.jautrus='?'; }
  var r2 = exec('curl -sk -m 20 "'+BASE+'/wp-json/wp/v2/pages/34261" -H "Authorization: '+AUTH+'"');
  try{ out.steril = JSON.parse(r2).status; }catch(e){ out.steril='?'; }
  // ar puslapiai realiai atsidaro (front-end 200)
  out.jautrus_http = exec('curl -sk -o /dev/null -w "%{http_code}" -m 20 "'+BASE+'/sprendimai/jautrus-virskinimas/"').trim();
  out.steril_http = exec('curl -sk -o /dev/null -w "%{http_code}" -m 20 "'+BASE+'/sprendimai/sterilizuotas-augintinis/"').trim();
  commit('publish.json', JSON.stringify(out));
  console.log(JSON.stringify(out));
})();
