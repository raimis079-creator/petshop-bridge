import { execSync } from "child_process";
import fs from "fs";
const WP_USER = process.env.WP_USER, WP_PASS = process.env.WP_APP_PASS;
const BASE = "https://dev.avesa.lt";
const AUTH = "Basic " + Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cb.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000}); }catch(e){ return 'EXC:'+String(e).slice(0,300); } }
(async()=>{
  var out = {};
  for (var tax of ['pa_monoprotein','pa_be_grudu','pa_speciali_mityba','pa_baltymu_saltinis']) {
    exec('curl -sk "'+BASE+'/?psc_attr2=terms:'+tax+'"');
    await new Promise(r=>setTimeout(r,1000));
    var r = exec('curl -sk "'+BASE+'/?psc_attr2=read"');
    var m = r.match(/\[.*\]/s);
    out[tax] = m ? JSON.parse(m[0]) : r.slice(0,200);
    await new Promise(r=>setTimeout(r,300));
  }
  commit('attr_terms.json', JSON.stringify(out,null,1));
  console.log(JSON.stringify(out,null,1).slice(0,1500));
})();
