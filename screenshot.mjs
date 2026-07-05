import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'cm',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbcm.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbcm.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:30000}); }catch(e){ return 'EXC:'+e.message.slice(0,100); } }
(async()=>{
  // Ieskom paskutiniu media - gal v2 vis delto ikelta (nutruko tik atsakymas)
  var media = exec('curl -sk -m 25 -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/wp/v2/media?per_page=8&orderby=date&order=desc"');
  var found = [];
  try {
    var arr = JSON.parse(media);
    arr.forEach(m=>{ found.push({id:m.id, slug:m.slug, src:(m.source_url||'').split('/').pop()}); });
  } catch(e){ found = [media.slice(0,200)]; }
  commit('check_media.json', JSON.stringify({recent_media: found}));
  console.log('done');
})();
