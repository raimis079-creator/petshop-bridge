import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const BASE="https://dev.avesa.lt";
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'mv',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbmv.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbmv.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:35000}); }catch(e){ return 'EXC:'+e.message; } }
(async()=>{
  var out={};
  // curl isrankaus puslapio (lengviau nei homepage), su ilgesniu timeout
  var html = exec('curl -sk -m 30 "'+BASE+'/sprendimai/isrankus-augintinis/?nc='+Date.now()+'"');
  out.html_len = (html||'').length;
  out.http_ok = out.html_len > 5000;
  // israsom Sprendimai submenu punktus is nav
  // ieskom <a ...>Naujas šuniukas</a> ir kt. nav kontekste
  var names = ['Naujas šuniukas','Naujas kačiukas','Išrankus augintinis','Jautrus virškinimas','Sterilizuotas augintinis','Kraiko pasirinkimas','Šuo kasosi'];
  out.menu_presence = {};
  names.forEach(function(n){ out.menu_presence[n] = (html.indexOf('>'+n+'<')>=0) || (html.indexOf(n)>=0 && html.indexOf('menu-item')>=0 ? html.indexOf(n)>=0 : false); });
  // tiksliau: ar yra menu-item su siais pavadinimais
  out.menu_exact = {};
  names.forEach(function(n){
    var re = new RegExp('menu-item[^>]*>\\\\s*<a[^>]*>'+n.replace(/[.*+?^${}()|[\\]\\\\]/g,'\\\\$&'), 'i');
    out.menu_exact[n] = re.test(html) || html.indexOf('>'+n+'</a>')>=0;
  });
  // page content check
  out.hero_h1 = html.indexOf('psc-sol-hero-title')>=0;
  out.products = (html.match(/psc-sol-product"/g)||[]).length;
  out.bundle_cards = (html.match(/psc-sol-card"/g)||[]).length;
  commit('menu_verify.json', JSON.stringify(out));
  console.log(JSON.stringify(out).slice(0,400));
})();
