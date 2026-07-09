import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(n,s){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+n; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'do',branch:'main',content:Buffer.from(s,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function api(path,method){ let cmd='curl -sk -u "\$WPU:\$WPP" '; if(method) cmd+='-X '+method+' '; cmd+='"'+DEV+path+'"'; try{ return execSync(cmd,{encoding:'utf8',maxBuffer:20000000,timeout:30000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; }}
let out='';

const IDS = [34554,34555,34556,34557,34558,34559,34572,34573];
const backup = {};

// === 1. BACKUP kiekvieno pilnos metadatos ===
out += '=== 1. BACKUP ===\n';
for(const id of IDS){
  const r = api('/wp-json/wp/v2/media/'+id);
  try{
    const j = JSON.parse(r);
    backup[id] = {
      id: j.id,
      title: j.title?.rendered,
      slug: j.slug,
      source_url: j.source_url,
      mime_type: j.mime_type,
      alt_text: j.alt_text,
      date: j.date,
      media_details: j.media_details,
    };
    out += '  '+id+': backed up ('+(j.source_url||'?').split('/').pop()+')\n';
  }catch(e){ out += '  '+id+': BACKUP ERR\n'; }
}
putFile('orphan_media_backup.json', JSON.stringify(backup, null, 2));

// === 2. DELETE force=true ===
out += '\n=== 2. DELETE ===\n';
const deleted = [];
for(const id of IDS){
  const r = api('/wp-json/wp/v2/media/'+id+'?force=true', 'DELETE');
  try{
    const j = JSON.parse(r);
    if(j.deleted === true){
      deleted.push(id);
      out += '  '+id+': DELETED ✓\n';
    } else {
      out += '  '+id+': UNEXPECTED response: '+JSON.stringify(j).slice(0,100)+'\n';
    }
  }catch(e){ out += '  '+id+': DELETE ERR: '+r.slice(0,150)+'\n'; }
}
out += '\n  Ištrinta: '+deleted.length+' iš '+IDS.length+'\n';

// === 3. Verifikacija: media endpoint gauna 404 kiekvienam ===
out += '\n=== 3. Verifikacija (media endpoint) ===\n';
for(const id of IDS){
  const r = api('/wp-json/wp/v2/media/'+id+'?_fields=id,code');
  try{
    const j = JSON.parse(r);
    if(j.code === 'rest_post_invalid_id') out += '  '+id+': 404 rest_post_invalid_id ✓\n';
    else out += '  '+id+': dar egzistuoja: '+JSON.stringify(j).slice(0,80)+'\n';
  }catch(e){ out += '  '+id+': verif ERR\n'; }
}

// === 4. Post-verifikacija: /pagrindinis-test/ vis dar veikia ===
out += '\n=== 4. Homepage patikra ===\n';
try{
  const html = execSync('curl -sk -u "$WPU:$WPP" -L --max-time 25 "'+DEV+'/pagrindinis-test/?nc='+Date.now()+'"',{encoding:'utf8',maxBuffer:20000000,timeout:27000,env:{...process.env,WPU,WPP}});
  out += '  HTML ilgis: '+html.length+'\n';
  out += '  hero URL: '+(html.includes('hero-augintiniai-pagrindinis.webp')?'YRA ✓':'NĖRA ✗')+'\n';
  out += '  upl_cat-sunims-v2: '+(html.includes('upl_cat-sunims-v2.webp')?'YRA ✓':'NĖRA ✗')+'\n';
  out += '  upl_logo-mark-v2: '+(html.includes('upl_logo-mark-v2.png')?'YRA ✓':'NĖRA ✗')+'\n';
  out += '  banner-starter: '+(html.includes('banner-starter.webp')?'YRA ✓':'NĖRA ✗')+'\n';
  out += '  banner-deals: '+(html.includes('banner-deals.webp')?'YRA ✓':'NĖRA ✗')+'\n';
}catch(e){ out += '  homepage ERR\n'; }

putFile('delete_orphan.txt', out);
