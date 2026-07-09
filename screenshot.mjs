import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
function putFile(n,s){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+n; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'d',branch:'main',content:Buffer.from(s,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
let out='';

const testUrls = [
  '/wp-content/uploads/2026/07/hero-augintiniai-pagrindinis.webp',
  '/wp-content/uploads/2026/07/upl_cat-sunims-v2.webp',
  '/wp-content/uploads/2026/07/upl_logo-mark-v2.png',
];

// 1. HEAD (be jokio auth, be jokio user-agent) - kaip anoniminis lankytojas
out += '=== HEAD requests (be user-agent) ===\n';
for(const u of testUrls){
  try{
    const r = execSync('curl -sk -I -o /dev/null -w "%{http_code}|ct=%{content_type}|size=%{size_download}|time=%{time_total}" --max-time 20 "'+DEV+u+'"',{encoding:'utf8',timeout:22000}).trim();
    out += '  '+r+'\n  URL: '+u+'\n';
  }catch(e){ out += '  ERR: '+u+'\n'; }
}
out += '\n';

// 2. GET su Chrome user-agent (kaip realaus PC naršyklės)
out += '=== GET su Chrome UA ===\n';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';
for(const u of testUrls){
  try{
    const r = execSync('curl -sk -o /dev/null -w "%{http_code}|size=%{size_download}|time=%{time_total}" -A "'+UA+'" --max-time 20 "'+DEV+u+'"',{encoding:'utf8',timeout:22000}).trim();
    out += '  '+r+'  '+u+'\n';
  }catch(e){ out += '  ERR: '+u+'\n'; }
}
out += '\n';

// 3. FULL response headers is hero (kad matytume Server, Cloudflare/hostingo headerius)
out += '=== hero.webp response headers ===\n';
try{
  const r = execSync('curl -sk -I -A "'+UA+'" --max-time 20 "'+DEV+'/wp-content/uploads/2026/07/hero-augintiniai-pagrindinis.webp"',{encoding:'utf8',timeout:22000});
  out += r+'\n';
}catch(e){ out += 'ERR\n'; }

// 4. Kartu su Referer: dev.avesa.lt (kai naršyklė kraunasi iš puslapio, Referer būna nustatytas)
out += '=== GET su Chrome UA + Referer ===\n';
for(const u of testUrls){
  try{
    const r = execSync('curl -sk -o /dev/null -w "%{http_code}|size=%{size_download}|time=%{time_total}" -A "'+UA+'" -H "Referer: '+DEV+'/" --max-time 20 "'+DEV+u+'"',{encoding:'utf8',timeout:22000}).trim();
    out += '  '+r+'  '+u+'\n';
  }catch(e){ out += '  ERR: '+u+'\n'; }
}
out += '\n';

// 5. 5 GET is eiles - ar rate-limit?
out += '=== 5 GET iš eilės (rate-limit test) ===\n';
for(let i=0;i<5;i++){
  try{
    const r = execSync('curl -sk -o /dev/null -w "%{http_code}|%{time_total}s" --max-time 15 "'+DEV+'/wp-content/uploads/2026/07/hero-augintiniai-pagrindinis.webp?t='+i+'"',{encoding:'utf8',timeout:17000}).trim();
    out += '  ['+(i+1)+'] '+r+'\n';
  }catch(e){ out += '  ['+(i+1)+'] ERR\n'; }
}

// 6. DEV /pagrindinis-test/ HTML: koks tikslus img src?
out += '\n=== /pagrindinis-test/ HTML fragmentai ===\n';
try{
  const html = execSync('curl -sk -L --max-time 30 -A "'+UA+'" "'+DEV+'/"',{encoding:'utf8',maxBuffer:20000000,timeout:32000});
  const bgHits = [...html.matchAll(/background-image:\s*url\([^)]+2026\/07\/[^)]+\)/g)].slice(0,3);
  bgHits.forEach(m=>out += '  CSS bg: '+m[0].slice(0,200)+'\n');
  const imgHits = [...html.matchAll(/<img[^>]+2026\/07\/[^>]+>/g)].slice(0,3);
  imgHits.forEach(m=>out += '  IMG: '+m[0].slice(0,200)+'\n');
}catch(e){ out += 'ERR: '+e.message+'\n'; }

putFile('diag.txt', out);
