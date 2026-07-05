import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'fc',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbfc.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbfc.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:35000}); }catch(e){ return 'EXC:'+e.message; } }
(async()=>{
  var html = exec('curl -sk -m 25 "https://dev.avesa.lt/product/miamor-konservai-katems-su-tunu-ir-krevetemis-100-g-x-24-vnt/"');
  // Sutaupote blokas
  var m1 = html.match(/Pakuotėje/);
  var m2 = html.match(/Vieneto kaina/);
  var m3 = html.match(/Sutaupote/);
  var m4 = html.match(/Bendras kiekis/);
  // Istraukiam sutaupote bloko turini
  var boxStart = html.indexOf('dp-savings-box');
  var box = boxStart>=0 ? html.substring(boxStart, boxStart+900).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ') : 'NERA';
  commit('final_check.json', JSON.stringify({
    new_v2_image: html.includes('pack_v2_opt'),
    has_pakuoteje: !!m1,
    has_vieneto_kaina: !!m2,
    has_sutaupote: !!m3,
    has_bendras_kiekis: !!m4,
    savings_box_text: box.substring(0,400),
    desc_clean: html.includes('Kas įeina'),
    no_old_1vnt: !html.includes('(1 vnt.)'),
  }));
  console.log('done');
})();
