import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'sc',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function get(u){ try{ return execSync('curl -sk -u "$WPU:$WPP" -L --max-time 25 "'+DEV+u+'"',{encoding:'utf8',maxBuffer:20000000,timeout:27000,env:{...process.env,WPU,WPP}}); }catch(e){ return ''; } }
let out='';
// 1. Rendered HTML - visi img tagai su ph- klase
const html = get('/pagrindinis-test/?nc='+Date.now());
out += 'HTML ilgis: '+html.length+'\n\n';
out += '=== <img> tagai puslapyje (ph-*) ===\n';
const imgs = [...html.matchAll(/<img[^>]*(?:ph-cat-img|ph-hero-badge|petshop)[^>]*>/gi)];
if(!imgs.length){
  // plaèiau: visi img hero/cat zonoje
  const all = [...html.matchAll(/<img[^>]+>/gi)].slice(0,20);
  out += 'ph- img nerasta. Pirmi 20 img:\n';
  all.forEach((m,i)=>{ out += '  ['+i+'] '+m[0].slice(0,240)+'\n'; });
} else {
  imgs.forEach((m,i)=>{ out += '  ['+i+'] '+m[0].slice(0,300)+'\n'; });
}
out += '\n=== ar yra lazy-load perrasymas ===\n';
out += 'data-src: '+(html.match(/data-src=/g)||[]).length+'\n';
out += 'data-lazy: '+(html.match(/data-lazy/g)||[]).length+'\n';
out += 'srcset: '+(html.match(/srcset=/g)||[]).length+'\n';
out += 'lazyload class: '+(html.match(/class="[^"]*lazyload/g)||[]).length+'\n';
out += 'shortpixel: '+(html.toLowerCase().indexOf('shortpixel')>=0)+'\n';
out += '\n=== raw ph-cat-img fragmentas ===\n';
const idx = html.indexOf('ph-cat-img');
if(idx>0) out += JSON.stringify(html.slice(Math.max(0,idx-200), idx+320))+'\n';
else out += 'ph-cat-img NERASTA HTML!\n';
out += '\n=== raw ph-hero-badge fragmentas ===\n';
const idx2 = html.indexOf('ph-hero-badge');
if(idx2>0) out += JSON.stringify(html.slice(idx2, idx2+380))+'\n';
else out += 'ph-hero-badge NERASTA!\n';
// 2. DB content.raw
const raw = get('/wp-json/wp/v2/pages/34543?context=edit&_fields=content');
try{
  const c = JSON.parse(raw).content.raw||'';
  const m = c.match(/<img class="ph-cat-img"[^>]*>/);
  out += '\n=== DB content.raw pirmas ph-cat-img ===\n'+(m?m[0]:'nerasta')+'\n';
  const b = c.match(/<span class="ph-hero-badge">[\s\S]{0,200}/);
  out += '\n=== DB badge ===\n'+(b?b[0]:'nerasta')+'\n';
}catch(e){ out += '\nDB read err\n'; }
putFile('srccheck.txt', out);
