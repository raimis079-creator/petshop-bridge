import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'v2',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbv2.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbv2.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:35000}); }catch(e){ return 'EXC:'+e.message; } }
(async()=>{
  var html = exec('curl -sk -m 25 "https://dev.avesa.lt/product/miamor-konservai-katems-su-tunu-ir-krevetemis-100-g-x-24-vnt/"');
  var boxStart = html.indexOf('dp-savings-box');
  var box = boxStart>=0 ? html.substring(boxStart, boxStart+700).replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,'').replace(/&euro;/g,'EUR').replace(/\s+/g,' ') : 'NERA';
  commit('verify2.json', JSON.stringify({
    savings_box: box.substring(0,300),
    has_bendras_kiekis: html.includes('Bendras kiekis'),
    has_sudetis: html.includes('Sudėtis') || html.includes('Sudetis'),
    has_analitine: html.includes('Analitinė') || html.includes('Analitine'),
    has_tuno_40: html.includes('40%'),
    has_krevetes_11: html.includes('11%'),
    has_maitinimo: html.includes('Maitinimo instrukcija') || html.includes('maitinimo'),
    has_ekonomiska: html.includes('Ekonomiška 24'),
  }));
  console.log('done');
})();
