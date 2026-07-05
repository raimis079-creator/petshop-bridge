import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'vfe',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbvfe.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbvfe.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:35000}); }catch(e){ return 'EXC:'+e.message; } }
(async()=>{
  var html = exec('curl -sk -m 25 "https://dev.avesa.lt/product/exclusion-hypoallergenic-mazu-veisliu-sunu-maistas-su-kiauliena-ir-zirneliais-2-kg-x-2-vnt/"');
  commit('vf_excl.json', JSON.stringify({
    has_x2_image: html.includes('excl_pack_x2'),
    still_placeholder: html.includes('woocommerce-placeholder'),
    has_bendras_4kg: html.includes('4 kg'),
    has_sutaupote: html.includes('Sutaupote'),
    has_sudetis: html.includes('udėt') || html.includes('udet'),
  }));
  console.log('done');
})();
