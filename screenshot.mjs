import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'v13',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbv13.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbv13.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:35000}); }catch(e){ return 'EXC:'+e.message; } }

function analyze(html){
  // Filtro mygtukai su labels ir counts
  var matches = html.match(/psc-akc-btn[^>]*>[^<]*<span[^>]*>\([0-9]+\)<\/span>/g) || [];
  // Kaip alternatyva - psc-akc-btn (aktyvus arba ne)
  var btns_all = html.match(/class="psc-akc-btn[^"]*"[^>]*>([^<]+)</g) || [];
  var btn_labels = btns_all.map(b=>{ var m=b.match(/>([^<]+)</); return m?m[1].trim():''; });
  // Ar yra "Paukščiams" mygtukas?
  var has_pauksciams = html.includes('Paukščiams') || html.includes('Paukš&#269;iams');
  var has_zuvims = html.includes('Žuvims') || html.includes('&#381;uvims') || html.includes('Žuvims');
  // Aktyvi filter kaladele
  var active_match = html.match(/class="psc-akc-btn is-active"[^>]*>([^<]+)/);
  var active_label = active_match ? active_match[1].trim() : null;
  // Skaiciuojam unique produktu ID
  var post_ids = html.match(/product post-(\d+)/g) || [];
  var unique_ids = [...new Set(post_ids)];
  return {
    btn_labels: btn_labels,
    btn_count: btn_labels.length,
    has_pauksciams_btn: has_pauksciams,
    has_zuvims_btn: has_zuvims,
    active_filter: active_label,
    product_cards: unique_ids.length,
  };
}

(async()=>{
  var default_html = exec('curl -sk -m 25 "https://dev.avesa.lt/akcijos/"');
  var sunims_html = exec('curl -sk -m 25 "https://dev.avesa.lt/akcijos/?gyvunas=sunims"');
  var grauzikams_html = exec('curl -sk -m 25 "https://dev.avesa.lt/akcijos/?gyvunas=grauzikams"');
  var pauksciams_html = exec('curl -sk -m 25 "https://dev.avesa.lt/akcijos/?gyvunas=pauksciams"');
  
  var results = {
    'default (be filtro)': analyze(default_html),
    '?gyvunas=sunims': analyze(sunims_html),
    '?gyvunas=grauzikams': analyze(grauzikams_html),
    '?gyvunas=pauksciams (tuscia kat.)': analyze(pauksciams_html),
  };
  commit('verify_v13.json', JSON.stringify(results,null,2));
  console.log('done');
})();
