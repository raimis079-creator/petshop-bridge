import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'io',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbio.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbio.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:110000}); }catch(e){ return 'EXC:'+e.message.slice(0,150); } }
(async()=>{
  var imgPath = exec('find / -name "pack_v2_opt.jpg" -path "*screenshots*" 2>/dev/null | head -1').trim();
  if (!imgPath) { commit('img_only.json', JSON.stringify({err:'not found'})); return; }
  var up = exec('curl -sk -m 100 -X POST -H "Authorization: '+AUTH+'" -H "Content-Type: image/jpeg" -H "Content-Disposition: attachment; filename=dp-miamor-24-v2.jpg" --data-binary @"'+imgPath+'" "'+BASE+'/wp-json/wp/v2/media"');
  var mediaId=null; try{ mediaId=JSON.parse(up).id; }catch(e){}
  if (!mediaId) { commit('img_only.json', JSON.stringify({err:'upload fail', raw:up.slice(0,200)})); return; }
  fs.writeFileSync('/tmp/wcimg.json', JSON.stringify({images:[{id:mediaId}]}));
  var updRes = exec('curl -sk -m 40 -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/wcimg.json "'+BASE+'/wp-json/wc/v3/products/34449"');
  var okId=null, imgSrc=null; try{ var j=JSON.parse(updRes); okId=j.id; imgSrc=(j.images&&j.images[0])?j.images[0].src:null; }catch(e){}
  commit('img_only.json', JSON.stringify({media_id:mediaId, product:okId, new_img_src:imgSrc}));
  console.log('done');
})();
