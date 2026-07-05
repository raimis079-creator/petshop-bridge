import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'si2',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbsi2.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbsi2.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:90000}); }catch(e){ return 'EXC:'+e.message.slice(0,200); } }

(async()=>{
  // Failas yra repo screenshots/pack_image_24.jpg - runneris ji cekautino
  // Randam absoliutu kelia
  var pwd = exec('pwd').trim();
  var imgPath = exec('find / -name "pack_image_24.jpg" -path "*screenshots*" 2>/dev/null | head -1').trim();
  commit('img_path_debug.json', JSON.stringify({pwd: pwd, imgPath: imgPath}));
  if (!imgPath) { console.log('IMG NOT FOUND'); return; }
  
  // 1. Ikeliam i WP media
  var uploadRes = exec('curl -sk -m 80 -X POST -H "Authorization: '+AUTH+'" -H "Content-Type: image/jpeg" -H "Content-Disposition: attachment; filename=dp-miamor-tunas-krev-24.jpg" --data-binary @"'+imgPath+'" "'+BASE+'/wp-json/wp/v2/media"');
  var mediaId = null;
  try { mediaId = JSON.parse(uploadRes).id; } catch(e){}
  commit('media_upload2.json', JSON.stringify({media_id: mediaId, raw: uploadRes.slice(0,400)}));
  if (!mediaId) { console.log('UPLOAD FAIL'); return; }
  
  // 2. Priskiriam + aprasymas
  var desc = '<p>Miamor Super Premium – aukštos kokybės pilnavertis konservuotas maistas suaugusioms katėms. Tunas su krevetėmis subtiliame padaže: daug tikros žuvies ir jūros gėrybių, be dirbtinių dažiklių, kvapiųjų medžiagų ir konservantų.</p>'
    + '<p>Tai ekonomiška 24 vienetų pakuotė – tas pats mėgstamas skonis didesniu kiekiu. Renkantis 24 vnt. mokate mažesnę vieneto kainą nei perkant po vieną skardinę. Patogus pasirinkimas, jei jūsų katė mėgsta būtent šį skonį ir perkate jį reguliariai.</p>'
    + '<ul><li>Sudėtis: 24 × Miamor Super Premium konservai katėms su tunu ir krevetėmis, po 100 g</li>'
    + '<li>Tinka: suaugusioms katėms</li><li>Tipas: drėgnas maistas (konservai)</li>'
    + '<li>Privalumas: geresnė vieneto kaina perkant didesnį kiekį</li></ul>';
  var shortDesc = 'Ekonomiška 24 vnt. pakuotė – Miamor Super Premium konservai katėms su tunu ir krevetėmis, po 100 g. Tas pats mėgstamas skonis didesniu kiekiu ir geresne vieneto kaina.';
  fs.writeFileSync('/tmp/wcupd.json', JSON.stringify({images:[{id:mediaId}], description:desc, short_description:shortDesc}));
  var updRes = exec('curl -sk -m 40 -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/wcupd.json "'+BASE+'/wp-json/wc/v3/products/34449"');
  var okId=null, imgCount=null;
  try { var j=JSON.parse(updRes); okId=j.id; imgCount=(j.images||[]).length; } catch(e){}
  commit('wc_update2.json', JSON.stringify({product_id: okId, image_count: imgCount, media_id: mediaId, raw: updRes.slice(0,200)}));
  console.log('done media='+mediaId);
})();
