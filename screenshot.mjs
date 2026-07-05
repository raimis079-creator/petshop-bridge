import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'cs',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbcs.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbcs.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:35000}); }catch(e){ return 'EXC:'+e.message.slice(0,150); } }
(async()=>{
  // Ar 568 (ar bet koks Display snippet) egzistuoja?
  var snips = exec('curl -sk -m 20 -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets?limit=100"');
  var displayFound = [];
  try {
    var arr = JSON.parse(snips);
    arr.forEach(s=>{ if((s.name||'').includes('Daugiau=Pigiau Display')) displayFound.push({id:s.id, name:s.name, active:s.active}); });
  } catch(e){}
  // Kokia dabar pack nuotrauka + aprasymas
  var pack = exec('curl -sk -m 20 -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/wc/v3/products/34449"');
  var imgUrl=null, descHas=null;
  try { var p=JSON.parse(pack); imgUrl=(p.images&&p.images[0])?p.images[0].src:null; descHas=(p.description||'').includes('Kas įeina'); } catch(e){}
  commit('check_state.json', JSON.stringify({
    display_snippets_found: displayFound,
    current_pack_image: imgUrl,
    desc_is_clean_version: descHas,
  }));
  console.log('done');
})();
