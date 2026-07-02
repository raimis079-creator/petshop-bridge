import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'pub',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbpub.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbpub.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:60000}); }catch(e){ return 'EXC:'+e.message; } }
(async()=>{
  var out={};
  // 1. read probe payload from repo file probe_payload.json
  var pj = exec('curl -s -H "Authorization: Bearer '+tok+'" "https://api.github.com/repos/'+repo+'/contents/probe_payload.json?ref=main&t='+Date.now()+'"');
  var payloadB64 = JSON.parse(pj).content.replace(/\n/g,'');
  fs.writeFileSync('/tmp/probe.json', Buffer.from(payloadB64,'base64').toString('utf8'));
  // 2. update+activate snippet 557
  var up = exec('curl -sk -m 30 -X POST -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" -d @/tmp/probe.json "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  try{ var uj=JSON.parse(up); out.snippet_update={id:uj.id,name:uj.name,active:uj.active}; }catch(e){ out.snippet_update_err=up.slice(0,300); }
  await new Promise(r=>setTimeout(r,2000));
  // 3. hit probe
  var pr = exec('curl -sk -m 40 "'+BASE+'/?ps_probe=ps2026"');
  try{ out.probe=JSON.parse(pr); }catch(e){ out.probe_raw=pr.slice(0,1500); }
  // 4. deactivate
  var de = exec('curl -sk -m 30 -X POST -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" -d \'{"active":false}\' "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  try{ out.deactivated = JSON.parse(de).active===false; }catch(e){ out.deact_err=de.slice(0,200); }
  commit('audit_b.json', JSON.stringify(out));
  console.log('done');
})();
