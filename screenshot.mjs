import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'fr',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function get(path){ try{ return execSync('curl -sk -u "$WPU:$WPP" --max-time 40 "'+DEV+path+'"',{encoding:'utf8',maxBuffer:20000000,timeout:45000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }
function code(u){ try{ return execSync('curl -sk -o /dev/null -w "%{http_code}" -u "$WPU:$WPP" -L "'+DEV+u+'"',{encoding:'utf8',timeout:20000,env:{...process.env,WPU,WPP}}).trim(); }catch(e){ return 'EXC'; } }
const out={};
// 1. LOGO - site_logo (attachment 308 pagal memory) + ieskom logo mark (be teksto)
out.logo_media=get('/wp-json/wp/v2/media?search=logo&per_page=15&_fields=id,source_url,alt_text,media_details').slice(0,3000);
// 2. hipoalerginis kategorijos teisingas URL - gaunam full link
out.hipo=get('/wp-json/wc/v3/products/categories?slug=hipoalerginis-maistas-sunims&_fields=id,name,slug,count,parent').slice(0,600);
// speciali mityba terminu tikslus URL formatas - imam viena termina ir tikrinam jo link
// WooCommerce attribute archive: /pa_speciali_mityba/{slug}/ arba per filtra
out.urls={};
const cands={
  'hipo_kategorija':'/kategorija/hipoalerginis-maistas-sunims/',
  'hipo_be_kat':'/hipoalerginis-maistas-sunims/',
  'sm_hipoalerginis':'/pa_speciali_mityba/hipoalerginis/',
  'sm_jautriam':'/pa_speciali_mityba/jautriam-virskinimui/',
  'sm_monoprotein':'/pa_monoprotein/taip/',
  'sm_begrudu':'/pa_be_grudu/be-grudu/',
  'sprendimai_jautrus':'/jautrus-virskinimas/',
  'sterilizuotas':'/sterilizuotas-augintinis/'
};
for(const[k,u]of Object.entries(cands)) out.urls[k]={url:u,http:code(u)};
putFile('fixrecon.json',JSON.stringify(out));
