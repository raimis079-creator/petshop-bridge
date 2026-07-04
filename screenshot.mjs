import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'cpk',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbcpk.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbcpk.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:35000}); }catch(e){ return 'EXC:'+e.message; } }

(async()=>{
  var html = exec('curl -sk -m 25 "https://dev.avesa.lt/akcijos/"');
  // Ieskom tik psc-akc-filter block turini (mano custom filter)
  var m = html.match(/<div class="psc-akc-filter">([\s\S]*?)<\/div>/);
  var filter_html = m ? m[1] : 'NOT FOUND';
  // Ir countagam kur žodis "Paukš" atsiranda visam HTML
  var pauksc_matches = html.match(/Paukš[a-ząčęėįšųū]*iam/g) || [];
  commit('check_pauksc.json', JSON.stringify({
    filter_html_block: filter_html.substring(0,2000),
    pauksc_occurrences_in_html: pauksc_matches.length,
    pauksc_in_filter_block: filter_html.includes('Paukš'),
  }));
  console.log('done');
})();
