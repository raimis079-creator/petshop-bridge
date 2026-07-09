import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'e2',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function get(u){ try{ return execSync('curl -sk -u "$WPU:$WPP" -L --max-time 20 "'+DEV+u+'"',{encoding:'utf8',maxBuffer:20000000,timeout:22000,env:{...process.env,WPU,WPP}}); }catch(e){ return ''; } }
let out='';
const urls = ['/bokseris/','/kolis/','/josera-sunu-maistas/','/josera-kaciu-maistas/','/geriausias-sausas-sunu-maistas/','/suns-serimo-lentele-gramais/','/hipoalerginis-maistas/','/be-grudu-maistas/','/pasiulymai/','/daugiau-pigiau/'];
let bad = 0;
for(const u of urls){
  const html = get(u);
  const m = html.match(/<h1\b[^>]*petshop-auto-h1[^>]*>([\s\S]*?)<\/h1>/i);
  out += u+'\n';
  if(!m){ out += '  auto-H1 NERASTA\n\n'; continue; }
  const inner = m[1];
  const dbl = inner.includes('&amp;#') || inner.includes('&amp;amp;');
  if(dbl) bad++;
  out += '  source : '+JSON.stringify(inner)+'\n';
  out += '  dvigubas encode (&amp;#): '+(dbl?'TAIP -- BLOGAI':'ne')+'\n';
  // kaip matys narsykle: dekoduoju entity
  let dec = inner
    .replace(/&amp;/g,'&').replace(/&#8211;/g,'\u2013').replace(/&#8212;/g,'\u2014')
    .replace(/&#8216;/g,'\u2018').replace(/&#8217;/g,'\u2019')
    .replace(/&#8220;/g,'\u201C').replace(/&#8221;/g,'\u201D')
    .replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"');
  out += '  narsykleje: '+JSON.stringify(dec)+'\n\n';
}
out += 'DVIGUBO ENCODE ATVEJU: '+bad+'\n';
putFile('entcheck2.txt', out);
