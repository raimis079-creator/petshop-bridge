import { execSync } from "child_process";
import fs from "fs";
const repo = process.env.GH_REPO, tok = process.env.GH_TOKEN;
const WP_USER = process.env.WP_USER, WP_PASS = process.env.WP_APP_PASS;
const BASE = "https://dev.avesa.lt";
const AUTH = "Basic " + Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
function commit(name, str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cb.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000}); }catch(e){ return 'EXC:'+String(e).slice(0,200); } }
(async()=>{
  // Skaitau kas dabar #547 snippete
  const raw = exec('curl -sk -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/547"');
  let cr; try{ cr=JSON.parse(raw); }catch(e){ cr={__raw:raw.slice(0,300)}; }
  var code = cr.code || '';
  var out = {
    snippet_active: cr.active,
    has_konservo_dydis: code.indexOf('Konservo dydis') >= 0,
    has_gramatura: code.indexOf('GRAMATŪRA') >= 0,
    has_intro: code.indexOf('psc-intro') >= 0,
    code_len: code.length
  };
  commit('snippet_check.json', JSON.stringify(out,null,1));
  console.log(JSON.stringify(out));
})();
