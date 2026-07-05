import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'vdp',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbvdp.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbvdp.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:35000}); }catch(e){ return 'EXC:'+e.message; } }
function analyze(html){
  var btns=[];
  var re=/psc-dp-btn[^"]*"[^>]*>([^<]+)<span class="psc-dp-count">\(([0-9]+)\)/g; var mm;
  while((mm=re.exec(html))!==null){ btns.push(mm[1].trim()+' '+mm[2]); }
  // Kiek produktu grid'e
  var prodCount=(html.match(/dp-miamor|excl_pack|product-small|box-image/g)||[]).length;
  return {buttons:btns, has_miamor:html.includes('Miamor konservai kat')||html.includes('miamor-konservai'), has_excl:html.includes('Exclusion Hypo')||html.includes('exclusion-hypo')};
}
(async()=>{
  var visos = exec('curl -sk -m 25 "https://dev.avesa.lt/daugiau-pigiau/"');
  var sunims = exec('curl -sk -m 25 "https://dev.avesa.lt/daugiau-pigiau/?gyvunas=sunims"');
  var katems = exec('curl -sk -m 25 "https://dev.avesa.lt/daugiau-pigiau/?gyvunas=katems"');
  var grauz = exec('curl -sk -m 25 "https://dev.avesa.lt/daugiau-pigiau/?gyvunas=grauzikams"');
  commit('verify_dp_page.json', JSON.stringify({
    visos: analyze(visos),
    sunims: analyze(sunims),
    katems: analyze(katems),
    grauzikams_empty_fallback: analyze(grauz),
    has_grauzikams_button: visos.includes('Graužikams'),
    has_pauksciams_button: visos.includes('Paukščiams'),
    has_zuvims_button: visos.includes('Žuvims'),
  }));
  console.log('done');
})();
