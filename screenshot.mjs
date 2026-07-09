import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(n,s){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+n; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'vo',branch:'main',content:Buffer.from(s,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function api(p){ try{ return execSync('curl -sk -u "$WPU:$WPP" --max-time 25 "'+DEV+p+'"',{encoding:'utf8',maxBuffer:50000000,timeout:27000,env:{...process.env,WPU,WPP}}); }catch(e){ return ''; } }
function code(u){ try{ return execSync('curl -sk -o /dev/null -w "%{http_code}" --max-time 15 "'+DEV+u+'"',{encoding:'utf8',timeout:17000}).trim(); }catch(e){ return 'TO'; } }
let out='';

const IDS = [34554,34555,34556,34557,34558,34559,34572,34573];
const FILES = {
  34554: '/wp-content/uploads/2026/07/upl_logo-mark-white.png',
  34555: '/wp-content/uploads/2026/07/upl_cat-sunims.webp',
  34556: '/wp-content/uploads/2026/07/upl_cat-katems.webp',
  34557: '/wp-content/uploads/2026/07/upl_cat-grauzikams.webp',
  34558: '/wp-content/uploads/2026/07/upl_cat-pauksciams.webp',
  34559: '/wp-content/uploads/2026/07/upl_cat-zuvims.webp',
  34572: '/wp-content/uploads/2026/07/upl_banner-pasiulymai-1.webp',
  34573: '/wp-content/uploads/2026/07/upl_banner-naujas.webp',
};

// 1. WP media GET su explicit _fields (kaip anksčiau, kad palyginta)
out += '=== WP media GET (_fields=id,source_url,title,date,mime_type) ===\n';
for(const id of IDS){
  const r = api('/wp-json/wp/v2/media/'+id+'?_fields=id,source_url,title,date,mime_type');
  try{
    const j = JSON.parse(r);
    if(j.code === 'rest_post_invalid_id') out += '  '+id+': 404 rest_post_invalid_id (NEEGZISTUOJA)\n';
    else out += '  '+id+': EGZISTUOJA - '+((j.source_url||'?').split('/').pop())+' | '+(j.date||'?')+'\n';
  }catch(e){ out += '  '+id+': parse ERR: '+r.slice(0,80)+'\n'; }
}
out += '\n';

// 2. WP media GET be _fields (pilnas atsakymas)
out += '=== WP media GET (full response) ===\n';
for(const id of IDS){
  const r = api('/wp-json/wp/v2/media/'+id);
  try{
    const j = JSON.parse(r);
    if(j.code === 'rest_post_invalid_id') out += '  '+id+': 404 rest_post_invalid_id (NEEGZISTUOJA)\n';
    else out += '  '+id+': EGZISTUOJA - status='+j.status+' | slug='+j.slug+'\n';
  }catch(e){ out += '  '+id+': parse ERR\n'; }
}
out += '\n';

// 3. Failai fiziškai serveryje?
out += '=== Failai serveryje (HTTP status) ===\n';
for(const id of IDS){
  const c = code(FILES[id]);
  out += '  '+id+': '+c+'  '+FILES[id]+'\n';
}
out += '\n';

// 4. Bandau DELETE su kitokia sintaksė
out += '=== DELETE bandymai (mažiausias reiškinio testas) ===\n';
try{
  // Be force=true (soft delete → trash)
  const r = execSync('curl -sk -u "'+WPU+':'+WPP+'" -X DELETE -w "\\n---STATUS:%{http_code}---" --max-time 30 "'+DEV+'/wp-json/wp/v2/media/34554"',{encoding:'utf8',timeout:32000});
  out += 'DELETE be force (34554):\n'+r.slice(0,400)+'\n\n';
}catch(e){ out += 'DELETE EXC: '+e.message.slice(0,200)+'\n\n'; }

try{
  const r = execSync('curl -sk -u "'+WPU+':'+WPP+'" -X DELETE -w "\\n---STATUS:%{http_code}---" --max-time 30 "'+DEV+'/wp-json/wp/v2/media/34555?force=true"',{encoding:'utf8',timeout:32000});
  out += 'DELETE su force=true (34555):\n'+r.slice(0,400)+'\n\n';
}catch(e){ out += 'DELETE EXC 2: '+e.message.slice(0,200)+'\n\n'; }

putFile('verify_orphan.txt', out);
