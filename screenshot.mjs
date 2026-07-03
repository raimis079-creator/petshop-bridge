import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const BASE="https://dev.avesa.lt";
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'yt',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbyt.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbyt.json "'+url+'"',{encoding:'utf8'}); }
(async()=>{
  var out={};
  // Ištraukiam href su filter_tipas iš kategorijos HTML
  var html = execSync('curl -sk -m 40 "'+BASE+'/kategorija/katems/tualetai-kraikai-semtuveliai/?nc='+Date.now()+'"',{encoding:'utf8',maxBuffer:50000000});
  var hrefs = html.match(/href="[^"]*filter_tipas[^"]*"/gi) || [];
  out.raw_hrefs = [...new Set(hrefs)].slice(0,10);
  commit('yith_tipas_hrefs.json', JSON.stringify(out));
  console.log('hrefs:', out.raw_hrefs.length);
})();
