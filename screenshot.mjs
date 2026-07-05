import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'sid',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbsid.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbsid.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:60000}); }catch(e){ return 'EXC:'+e.message; } }

(async()=>{
  // 1. Ikeliam nuotrauka i WP media per REST (wp/v2/media)
  var uploadRes = exec('curl -sk -m 50 -X POST -H "Authorization: '+AUTH+'" -H "Content-Type: image/jpeg" -H "Content-Disposition: attachment; filename=dp-miamor-tunas-krev-24.jpg" --data-binary @pack_image_24.jpg "'+BASE+'/wp-json/wp/v2/media"');
  var mediaId = null;
  try { mediaId = JSON.parse(uploadRes).id; } catch(e){}
  commit('media_upload.json', JSON.stringify({media_id: mediaId, raw: uploadRes.slice(0,300)}));
  
  if (!mediaId) { console.log('MEDIA UPLOAD FAILED'); return; }
  
  // 2. Priskiriam nuotrauka pack'ui + perrasom aprasyma per wc/v3
  var desc = '<p>Miamor Super Premium – aukštos kokybės pilnavertis konservuotas maistas suaugusioms katėms. Tunas su krevetėmis subtiliame padaže: daug tikros žuvies ir jūros gėrybių, be dirbtinių dažiklių, kvapiųjų medžiagų ir konservantų.</p>'
    + '<p>Tai ekonomiška 24 vienetų pakuotė – tas pats mėgstamas skonis didesniu kiekiu. Renkantis 24 vnt. mokate mažesnę vieneto kainą nei perkant po vieną skardinę. Patogus pasirinkimas, jei jūsų katė mėgsta būtent šį skonį ir perkate jį reguliariai.</p>'
    + '<ul>'
    + '<li>Sudėtis: 24 × Miamor Super Premium konservai katėms su tunu ir krevetėmis, po 100 g</li>'
    + '<li>Tinka: suaugusioms katėms</li>'
    + '<li>Tipas: drėgnas maistas (konservai)</li>'
    + '<li>Privalumas: geresnė vieneto kaina perkant didesnį kiekį</li>'
    + '</ul>';
  var shortDesc = 'Ekonomiška 24 vnt. pakuotė – Miamor Super Premium konservai katėms su tunu ir krevetėmis, po 100 g. Tas pats mėgstamas skonis didesniu kiekiu ir geresne vieneto kaina.';
  
  var updateBody = JSON.stringify({
    images: [{ id: mediaId }],
    description: desc,
    short_description: shortDesc
  });
  fs.writeFileSync('/tmp/wcupd.json', updateBody);
  var updRes = exec('curl -sk -m 40 -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/wcupd.json "'+BASE+'/wp-json/wc/v3/products/34449"');
  var okId=null, imgCount=null;
  try { var j=JSON.parse(updRes); okId=j.id; imgCount=(j.images||[]).length; } catch(e){}
  commit('wc_update.json', JSON.stringify({product_id: okId, image_count: imgCount, raw: updRes.slice(0,300)}));
  console.log('done, media_id='+mediaId+' product='+okId);
})();
