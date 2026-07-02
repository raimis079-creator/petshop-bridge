import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const BASE="https://dev.avesa.lt";
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'yh',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbyh.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbyh.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:50000}); }catch(e){ return 'EXC:'+e.message; } }
(async()=>{
  var out={};
  var html = exec('curl -sk -m 45 "'+BASE+'/kategorija/sunims/maistas-sunims/?nc='+Date.now()+'"');
  out.html_len = (html||'').length;
  // ieskom href su "jautriam-virskinimui" - tai parodys realu YITH filtro URL formata
  var hrefs = html.match(/href="[^"]*jautriam-virskinimui[^"]*"/gi) || [];
  out.jautriam_hrefs = hrefs.slice(0,5);
  var hipoHrefs = html.match(/href="[^"]*hipoalerginis[^"]*"/gi) || [];
  out.hipo_hrefs = hipoHrefs.slice(0,5);
  var begruduHrefs = html.match(/href="[^"]*be-grudu[^"]*"/gi) || [];
  out.begrudu_hrefs = begruduHrefs.slice(0,5);
  var monoHrefs = html.match(/href="[^"]*monoprotein[^"]*"/gi) || [];
  out.mono_hrefs = monoHrefs.slice(0,5);
  // bendras YITH filtro href pavyzdys
  var yithBlock = html.indexOf('yith-wcan');
  out.has_yith = yithBlock;
  if (yithBlock>=0){
    var chunk = html.slice(yithBlock, yithBlock+3000);
    var allhrefs = chunk.match(/href="[^"]*"/g) || [];
    out.yith_sample_hrefs = allhrefs.slice(0,10);
  }
  commit('yith_html.json', JSON.stringify(out));
  console.log('html_len', out.html_len);
})();
