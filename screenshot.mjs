import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(n,s){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+n; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'or',branch:'main',content:Buffer.from(s,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function api(p){ try{ return execSync('curl -sk -u "$WPU:$WPP" --max-time 25 "'+DEV+p+'"',{encoding:'utf8',maxBuffer:50000000,timeout:27000,env:{...process.env,WPU,WPP}}); }catch(e){ return ''; } }
let out='';

const IDS = [34554,34555,34556,34557,34558,34559,34572,34573];

// 1. Kiekvieno media info: title, filename, size, dydis
out += '=== Orphan media candidates ===\n';
for(const id of IDS){
  const r = api('/wp-json/wp/v2/media/'+id+'?_fields=id,title,source_url,mime_type,media_details,date');
  try{
    const j = JSON.parse(r);
    if(j.code === 'rest_post_invalid_id'){
      out += '  '+id+': NEEGZISTUOJA (jau ištrintas)\n';
    } else {
      const fn = (j.source_url||'').split('/').pop();
      const fsize = j.media_details?.filesize || '?';
      const dims = j.media_details ? (j.media_details.width+'x'+j.media_details.height) : '?';
      out += '  '+id+': '+fn+' | '+j.mime_type+' | '+dims+' | '+fsize+'B | '+(j.date||'?')+'\n';
    }
  }catch(e){ out += '  '+id+': ERR '+r.slice(0,100)+'\n'; }
}
out += '\n';

// 2. Kur naudojama? Ieškau content'e per full pages search
// Naudoju kiekvieno ID search per posts endpoint su ID kaip search string
out += '=== Kur naudojami (search per pages/posts) ===\n';
for(const id of IDS){
  // Ieškau ar kur nors atsiranda "wp-image-{id}" arba media ID kaip src
  const r = api('/wp-json/wp/v2/media/'+id+'?_fields=source_url');
  let filename = '';
  try{ const j = JSON.parse(r); filename = (j.source_url||'').split('/').pop().split('.')[0]; }catch(e){}
  if(!filename){ out += '  '+id+': (media neegzistuoja, praleidžiu paiešką)\n'; continue; }
  // Search per pages
  const s = api('/wp-json/wp/v2/pages?search='+encodeURIComponent(filename)+'&per_page=5&_fields=id,slug,title');
  try{
    const arr = JSON.parse(s);
    if(Array.isArray(arr) && arr.length > 0){
      out += '  '+id+' ('+filename+') → RASTA '+arr.length+' pages:\n';
      arr.forEach(p=>out += '     - id='+p.id+' slug='+p.slug+'\n');
    } else {
      out += '  '+id+' ('+filename+') → 0 pages\n';
    }
  }catch(e){ out += '  '+id+': search ERR\n'; }
}
out += '\n';

// 3. Homepage HTML - ar tie failų vardai atsiranda? (patikra)
out += '=== Homepage HTML patikra (v10 gyvas) ===\n';
try{
  const html = execSync('curl -sk -u "$WPU:$WPP" -L --max-time 25 "'+DEV+'/pagrindinis-test/"',{encoding:'utf8',maxBuffer:20000000,timeout:27000,env:{...process.env,WPU,WPP}});
  for(const id of IDS){
    const r = api('/wp-json/wp/v2/media/'+id+'?_fields=source_url');
    let filename = '';
    try{ const j = JSON.parse(r); filename = (j.source_url||'').split('/').pop(); }catch(e){}
    if(filename){
      const hit = html.includes(filename);
      out += '  '+id+' ('+filename+'): '+(hit?'YRA HOMEPAGE':'nera')+'\n';
    }
  }
}catch(e){ out += 'homepage fetch ERR\n'; }

putFile('orphan.txt', out);
