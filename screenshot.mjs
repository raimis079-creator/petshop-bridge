import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'e2',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function code(u){ try{ return execSync('curl -sk -o /dev/null -w "%{http_code}|%{redirect_url}" -u "$WPU:$WPP" --max-time 15 "'+DEV+u+'"',{encoding:'utf8',timeout:17000,env:{...process.env,WPU,WPP}}).trim(); }catch(e){ return 'TO'; } }
function codeL(u){ try{ return execSync('curl -sk -o /dev/null -w "%{http_code}|%{url_effective}" -u "$WPU:$WPP" -L --max-time 15 "'+DEV+u+'"',{encoding:'utf8',timeout:17000,env:{...process.env,WPU,WPP}}).trim(); }catch(e){ return 'TO'; } }
function get(path){ try{ return execSync('curl -sk -u "$WPU:$WPP" -L --max-time 25 "'+DEV+path+'"',{encoding:'utf8',maxBuffer:20000000,timeout:27000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }
let out='';
// URL statusai (be ir su redirect)
const urls = [
  '/pasiulymai/',
  '/kategorija/pasiulymai/',
  '/kategorija/sunims/maistas-sunims/',
  '/naujas-augintinis/',
  '/naujas-suniukas/',
  '/naujas-kaciukas/',
];
out+='=STATUSAI=\n';
for(const u of urls){
  out+=u+' noL: '+code(u)+'\n';
  out+=u+' L: '+codeL(u)+'\n';
}
// Turinio analize: /pasiulymai/
out+='\n=/pasiulymai/ TURINYS=\n';
const p = get('/pasiulymai/');
if(p.length > 100){
  const title = (p.match(/<title[^>]*>([^<]*)<\/title>/)||[])[1]||'?';
  const h1 = (p.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)||[])[1]||'?';
  const productCount = (p.match(/class="[^"]*product[^"]*"/g)||[]).length;
  const hasProducts = p.indexOf('woocommerce-loop') >= 0 || p.indexOf('add_to_cart') >= 0;
  const hasNoResults = p.indexOf('Nerasta') >= 0 || p.indexOf('No products') >= 0 || p.indexOf('Nothing found') >= 0;
  out+='title: '+title.slice(0,100)+'\n';
  out+='h1: '+h1.replace(/<[^>]+>/g,'').trim().slice(0,100)+'\n';
  out+='has_products_layout: '+hasProducts+'\n';
  out+='has_no_results: '+hasNoResults+'\n';
  out+='html_size: '+p.length+'\n';
  out+='product_class_hits: '+productCount+'\n';
}
// /kategorija/sunims/maistas-sunims/ - produktų kiekis
out+='\n=/kategorija/sunims/maistas-sunims/ TURINYS=\n';
const m = get('/kategorija/sunims/maistas-sunims/');
if(m.length > 100){
  const title = (m.match(/<title[^>]*>([^<]*)<\/title>/)||[])[1]||'?';
  const shownMatch = m.match(/Rodoma\s+\d+[^<]*iš\s+(\d+)/i) || m.match(/of\s+(\d+)/i);
  out+='title: '+title.slice(0,100)+'\n';
  out+='rodoma_iš: '+(shownMatch?shownMatch[1]:'?')+'\n';
  out+='html_size: '+m.length+'\n';
}
putFile('recon_e2.txt', out);
