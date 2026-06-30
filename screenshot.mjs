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
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000}); }catch(e){ return 'EXC:'+String(e).slice(0,200); } }
function api(method, path, body){
  let cmd='curl -sk -X '+method+' -H "Authorization: '+AUTH+'" -H "Content-Type: application/json"';
  if(body!==undefined){ fs.writeFileSync('/tmp/b.json', JSON.stringify(body)); cmd+=' -d @/tmp/b.json'; }
  cmd+=' "'+BASE+path+'"';
  let raw=exec(cmd);
  try{ return JSON.parse(raw); }catch(e){ return {__raw:raw.slice(0,400)}; }
}

(async()=>{
  const out={ts:new Date().toISOString()};
  const code = fs.readFileSync('/home/claude/admin_form.php', 'utf8')
    .replace(/^<\?php\s*\n/, '')  // Snippet'ui nereikia <?php pradžioje
    .trim();
  
  out.code_length = code.length;
  
  const cr = api('POST', '/wp-json/code-snippets/v1/snippets', {
    name: 'Petshop Rinkinių Kūrimo Forma v1',
    code: code,
    desc: 'Admin submeniu po Produktai. Forma sukuria MnM rinkinį su komponentais, kiekiais, kompozicija (PHP GD).',
    scope: 'global',
    active: true
  });
  
  out.created = cr && cr.id ? {id: cr.id, active: cr.active, name: cr.name} : (cr.__raw || cr.code || JSON.stringify(cr).slice(0,300));
  commit('admin_form_deploy.json', JSON.stringify(out, null, 1));
  console.log("DONE id=" + (cr && cr.id));
})();
