import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'pr',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function statusOnly(u){ try{ return execSync('curl -sk -o /dev/null -w "code=%{http_code} loc=%{redirect_url} eff=%{url_effective}" -u "$WPU:$WPP" --max-time 15 "'+DEV+u+'"',{encoding:'utf8',timeout:17000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'ERR'; } }
function fetchHtml(u){ try{ return execSync('curl -sk -u "$WPU:$WPP" -L --max-time 25 "'+DEV+u+'"',{encoding:'utf8',maxBuffer:15000000,timeout:27000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }
let out='';
const urls = ['/pasiulymai/', '/kategorija/pasiulymai/', '/kategorija/sunims/maistas-sunims/', '/pardavimai/', '/akcijos/'];
for(const u of urls){
  out += '=== '+u+' ===\n';
  out += statusOnly(u)+'\n';
  const html = fetchHtml(u);
  if(html !== 'EXC' && html.length > 500){
    const title = (html.match(/<title[^>]*>([^<]*)<\/title>/)||[])[1]||'?';
    const h1 = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)||[])[1]||'?';
    // Rodoma X iš Y produktu
    const rodoma = (html.match(/Rodoma[^<]*(\d+)\s*i\u0161\s*(\d+)/)||html.match(/showing[^<]*(\d+)[^<]*(\d+)/i)||[]);
    // WooCommerce nera produktu
    const noProducts = html.indexOf('Nerasta produkt')>=0 || html.indexOf('No products')>=0;
    // Produktu korteliu skaicius
    const productCards = (html.match(/product[- ](small|type|item|card)/g)||[]).length;
    out += 'title: '+title.slice(0,80)+'\n';
    out += 'h1: '+h1.replace(/<[^>]+>/g,'').trim().slice(0,80)+'\n';
    out += 'Rodoma: '+(rodoma[0]||'nera')+'\n';
    out += 'noProducts: '+noProducts+'\n';
    out += 'product-card class count: '+productCards+'\n';
    out += 'body length: '+html.length+'\n';
  } else out += 'html: EXC arba per mažas\n';
  out += '\n';
}
// papildomai - WP meniu Pasiūlymai punkto tikroji nuoroda
const menuHtml = fetchHtml('/');
if(menuHtml && menuHtml !== 'EXC'){
  const menuMatch = menuHtml.match(/href="([^"]*)"[^>]*>[^<]*Pasi\u016blymai/gi);
  if(menuMatch){
    out += '=== MENIU Pasiūlymai link ===\n';
    for(const m of menuMatch) out += m+'\n';
  }
}
putFile('pasiulrecon.txt', out);
