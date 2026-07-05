import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'vm',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbvm.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbvm.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:35000}); }catch(e){ return 'EXC:'+e.message; } }
(async()=>{
  // 1. Pagrindinis puslapis - ar meniu HTML turi teisinga DAUGIAU=PIGIAU nuoroda
  var home = exec('curl -sk -m 25 "https://dev.avesa.lt/"');
  var menuHasNewUrl = home.includes('/daugiau-pigiau/');
  var menuHasOldUrl = home.includes('/kategorija/daugiau-pigiau/');
  // 2. Puslapio HTTP status
  var pageStatus = exec('curl -sk -m 20 -o /dev/null -w "%{http_code}" "https://dev.avesa.lt/daugiau-pigiau/"');
  // 3. Ar puslapyje yra filtras ir prekes
  var page = exec('curl -sk -m 25 "https://dev.avesa.lt/daugiau-pigiau/"');
  var hasFilter = page.includes('psc-dp-filter');
  var hasVisos = page.includes('Visos');
  var is404 = page.includes('page can') || page.includes('404');
  commit('verify_menu.json', JSON.stringify({
    menu_has_new_url: menuHasNewUrl,
    menu_has_old_url_bad: menuHasOldUrl,
    page_http_status: pageStatus,
    page_has_filter: hasFilter,
    page_has_visos: hasVisos,
    page_is_404: is404,
  }));
  console.log('done');
})();
