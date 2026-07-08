import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'fu',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function code(u){ try{ return execSync('curl -sk -o /dev/null -w "%{http_code}" -u "$WPU:$WPP" -L "'+DEV+u+'"',{encoding:'utf8',timeout:20000,env:{...process.env,WPU,WPP}}).trim(); }catch(e){ return 'EXC'; } }
const out={urls:{}};
const cands={
  // speciali_mityba archyvai
  'sm_hipoalerginis':'/pa_speciali_mityba/hipoalerginis/',
  'sm_jautriam':'/pa_speciali_mityba/jautriam-virskinimui/',
  'sm_odai':'/pa_speciali_mityba/odai-ir-kailiui/',
  'sm_sterilizuot':'/pa_speciali_mityba/sterilizuotiems/',
  // be grudu / monoprotein archyvai (skirtingi slug variantai)
  'bg_taip':'/pa_be_grudu/taip/',
  'bg_be':'/pa_be_grudu/be-grudu/',
  'mp_taip':'/pa_monoprotein/taip/',
  // kategorijos alternatyvos
  'kat_hipo':'/kategorija/hipoalerginis-maistas-sunims/',
  // sprendimai
  'spr_jautrus':'/jautrus-virskinimas/',
  'spr_steril':'/sterilizuotas-augintinis/',
  'spr_isrankus':'/isrankus-augintinis/'
};
for(const[k,u]of Object.entries(cands)) out.urls[k]={url:u,http:code(u)};
putFile('finalurls.json',JSON.stringify(out));
