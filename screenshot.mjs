import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'s4',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function api(p){ try{ return execSync('curl -sk -u "$WPU:$WPP" --max-time 30 "'+DEV+p+'"',{encoding:'utf8',maxBuffer:60000000,timeout:32000,env:{...process.env,WPU,WPP}}); }catch(e){ return ''; } }
function get(u){ try{ return execSync('curl -sk -u "$WPU:$WPP" -L --max-time 20 "'+DEV+u+'"',{encoding:'utf8',maxBuffer:20000000,timeout:22000,env:{...process.env,WPU,WPP}}); }catch(e){ return ''; } }
// TIKSLUS auto-H1: h1 tagas su klase (ne <style> turinys)
function analyze(html){
  const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]{0,200}?)<\/h1>/gi)];
  const autoH1 = h1s.filter(m => /class\s*=\s*["'][^"']*petshop-auto-h1/i.test(m[0])).length;
  const is404 = /That page can.{0,6}t be found|Puslapis nerastas/i.test(html);
  return { n: h1s.length, auto: autoH1, is404, texts: h1s.map(m=>m[1].replace(/<[^>]+>/g,'').trim().slice(0,50)) };
}
let out='';

// === A. Woo sisteminiai TIKRAIS slug'ais ===
out += '=== WOO SISTEMINIAI (snippet turi juos praleisti) ===\n';
for(const u of ['/', '/cart/', '/checkout/', '/my-account/', '/shop/']){
  const html = get(u);
  if(!html || html.length<400){ out += '  FETCH-FAIL '+u+'\n'; continue; }
  const a = analyze(html);
  const verdict = a.auto === 0 ? 'OK (auto-H1 nepridetas)' : 'PROBLEMA: auto-H1 pridetas!';
  out += '  '+verdict.padEnd(30)+' h1='+a.n+' auto='+a.auto+' 404='+a.is404+'  '+u+'\n';
  if(a.texts.length) out += '        → '+a.texts.join(' | ')+'\n';
}
out += '\n';

// === B. Puslapiai kurie JAU turejo H1 - snippet NETURI prideti antro ===
out += '=== JAU TUREJO H1 (auto turi buti 0) ===\n';
for(const u of ['/pagrindinis-test/','/apie-mus/','/sprendimai/','/sunu-veisles/','/akcijos/','/jautrus-virskinimas/','/prieziuros-priemones-sunims/','/taisykles/']){
  const html = get(u);
  if(!html || html.length<400){ out += '  FETCH-FAIL '+u+'\n'; continue; }
  const a = analyze(html);
  const ok = (a.n === 1 && a.auto === 0);
  out += '  '+(ok?'OK':'TIKRINTI').padEnd(10)+' h1='+a.n+' auto='+a.auto+'  '+u+'\n';
  if(!ok && a.texts.length) out += '        → '+a.texts.join(' | ')+'\n';
}
out += '\n';

// === C. Puslapiai kurie NETUREJO H1 - auto turi buti 1 ===
out += '=== NETUREJO H1 (auto turi buti 1) ===\n';
for(const u of ['/naujas-augintinis/','/hipoalerginis-maistas/','/monoproteinis-maistas/','/be-grudu-maistas/','/odai-ir-kailiui/','/kontaktai/','/pristatymas/','/pasiulymai/','/daugiau-pigiau/','/kolis/','/bokseris/','/taksas/','/siamo-kate/','/jorksyro-terjeras/','/senbernaras/']){
  const html = get(u);
  if(!html || html.length<400){ out += '  FETCH-FAIL '+u+'\n'; continue; }
  const a = analyze(html);
  const ok = (a.n === 1 && a.auto === 1);
  out += '  '+(ok?'OK':'TIKRINTI').padEnd(10)+' h1='+a.n+' auto='+a.auto+'  '+u+'\n';
  if(!ok && a.texts.length) out += '        → '+a.texts.join(' | ')+'\n';
}
out += '\n';

// === D. BLOG postai - snippet NETURI liesti ===
out += '=== BLOG POSTAI (auto turi buti 0) ===\n';
const posts = api('/wp-json/wp/v2/posts?per_page=10&status=publish&_fields=id,slug,link');
try{
  const arr = JSON.parse(posts);
  for(const p of arr.slice(0,4)){
    const html = get('/'+p.slug+'/');
    const a = analyze(html);
    const ok = (a.n === 1 && a.auto === 0);
    out += '  '+(ok?'OK':'TIKRINTI').padEnd(10)+' h1='+a.n+' auto='+a.auto+'  /'+p.slug+'/\n';
  }
}catch(e){ out += '  posts read err\n'; }
out += '\n';

// === E. PILNAS SKENAVIMAS: visi published pages, ieskau >1 H1 ===
out += '=== PILNAS SKENAVIMAS (visi published pages) ===\n';
let pages=[];
for(let p=1;p<=3;p++){
  const r = api('/wp-json/wp/v2/pages?per_page=100&status=publish&_fields=id,slug,link&page='+p);
  if(!r || r[0]!=='[') break;
  let a; try{ a=JSON.parse(r); }catch(e){ break; }
  if(!a.length) break; pages=pages.concat(a); if(a.length<100) break;
}
out += 'viso pages: '+pages.length+'\n';
const zero=[], multi=[], ok1=[];
for(const pg of pages){
  const path = pg.link.replace(DEV,'');
  const html = get(path);
  if(!html || html.length<400){ out += '  FETCH-FAIL '+pg.slug+'\n'; continue; }
  const a = analyze(html);
  if(a.n === 0) zero.push(pg.slug);
  else if(a.n > 1) multi.push(pg.slug+' ('+a.n+'): '+a.texts.join(' | '));
  else ok1.push(pg.slug);
}
out += 'su 1 H1: '+ok1.length+'\n';
out += 'BE H1 ('+zero.length+'): '+(zero.length?zero.join(', '):'-')+'\n';
out += 'SU >1 H1 ('+multi.length+'): '+(multi.length?'\n  '+multi.join('\n  '):'-')+'\n';
putFile('step4.txt', out);
