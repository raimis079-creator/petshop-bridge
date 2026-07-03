import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'excl-audit',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cb.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:60000}); }catch(e){ return 'EXC:'+e.message; } }
(async()=>{
  var out={};
  var pj = exec('curl -s -H "Authorization: Bearer '+tok+'" "https://api.github.com/repos/'+repo+'/contents/probe_payload.json?ref=6566d20f36866c05ea9a2f7bb4ee5b4c00000000"');
  // fallback: ref=main jei SHA netinkamas
  try{ JSON.parse(pj).content; }catch(e){ pj = exec('curl -s -H "Authorization: Bearer '+tok+'" "https://api.github.com/repos/'+repo+'/contents/probe_payload.json?ref=main&t='+Date.now()+'"'); }
  fs.writeFileSync('/tmp/probe.json', Buffer.from(JSON.parse(pj).content.replace(/\n/g,''),'base64').toString('utf8'));
  var up = exec('curl -sk -m 30 -X POST -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" -d @/tmp/probe.json "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  try{ var uj=JSON.parse(up); out.snippet={name:uj.name,active:uj.active}; }catch(e){ out.snippet_err=up.slice(0,200); }
  await new Promise(r=>setTimeout(r,2000));
  var pr = exec('curl -sk -m 50 "'+BASE+'/?ps_probe=ps2026"');
  try{ out.probe=JSON.parse(pr); }catch(e){ out.probe_raw=pr.slice(0,800); }
  var de = exec('curl -sk -m 30 -X POST -H "Authorization: '+AUTH+'" -d \'{"active":false}\' -H "Content-Type: application/json" "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  try{ out.deactivated = JSON.parse(de).active===false; }catch(e){}
  commit('excl_audit.json', JSON.stringify(out));
  console.log('done');
})();
