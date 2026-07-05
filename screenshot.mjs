import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'cb',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbcb.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbcb.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:35000}); }catch(e){ return 'EXC:'+e.message; } }
(async()=>{
  // Snippet'ai su badge/ekonomiska/overlay
  var all = exec('curl -sk -m 25 -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets?limit=200"');
  var rel=[]; try{ JSON.parse(all).forEach(s=>{ var n=(s.name||''); if(n.match(/badge|Badge|ženkl|zenkl|overlay|Overlay|EKONOMI|ekonomi|Pakuot|Daugiau|pigiau|Pigiau/)) rel.push({id:s.id,name:n,active:s.active}); }); }catch(e){ rel=[{err:all.slice(0,150)}]; }
  commit('badge_snippets.json', JSON.stringify(rel));
  // 3 paku nuotrauku markup - istraukiam img tag'us DP puslapyje
  var page = exec('curl -sk -m 30 "'+BASE+'/daugiau-pigiau/"');
  // Randam produktu img src'us
  var imgs = [];
  var re = /product\/([a-z0-9-]+)[^"]*"[\s\S]{0,600}?<img[^>]+src="([^"]+)"/g; var mm;
  while((mm=re.exec(page))!==null && imgs.length<8){ imgs.push({slug:mm[1].slice(0,45), img:mm[2].split('/').pop()}); }
  // Ar yra kokiu nors overlay elementu (badge div/span) product boxe
  var hasOverlayHtml = page.includes('dp-badge') || page.includes('ekonomiska-badge') || page.includes('pack-badge') || page.includes('dp-overlay');
  commit('dp_page_imgs.json', JSON.stringify({imgs:imgs, has_overlay_html:hasOverlayHtml}));
  console.log('done');
})();
