import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'frs',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbfrs.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbfrs.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:35000}); }catch(e){ return 'EXC:'+e.message; } }
(async()=>{
  var all = exec('curl -sk -m 25 -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets?limit=200"');
  var rel = [];
  try {
    JSON.parse(all).forEach(s=>{
      var n=(s.name||'');
      if(n.match(/rinkin|Rinkin|Susid|susid|mix|Mix|component|Component|Sukurti/)) rel.push({id:s.id,name:n,active:s.active});
    });
  } catch(e){ rel=[{err:all.slice(0,200)}]; }
  commit('find_rink_snips.json', JSON.stringify(rel));
  console.log('done');
})();
