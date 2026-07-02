import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'deldup',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbdd.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbdd.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:30000}); }catch(e){ return 'EXC'; } }
(async()=>{
  var out={};
  // trinam dublikatą #559
  out.del559=exec('curl -sk -m 20 -o /dev/null -w "%{http_code}" -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/559"');
  // patvirtinam kad liko tik #560
  var v3=exec('curl -sk -m 20 -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/560"');
  try{ var j=JSON.parse(v3); out.remaining={id:j.id,name:j.name,active:j.active}; }catch(e){ out.err=e; }
  var chk559=exec('curl -sk -m 20 -o /dev/null -w "%{http_code}" -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/559"');
  out.get559_after=chk559;
  commit('deldup.json', JSON.stringify(out)); console.log(JSON.stringify(out));
})();
