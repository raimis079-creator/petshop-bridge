import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'ic',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
const BASE = '/wp-content/uploads/2026/07/';
const files = [
  'upl_logo-mark-v2.png',
  'upl_cat-sunims-v2.webp',
  'upl_cat-katems-v2.webp',
  'upl_cat-grauzikams-v2.webp',
  'upl_cat-pauksciams-v2.webp',
  'upl_cat-zuvims-v2.webp',
  'banner-starter.webp',
  'banner-deals.webp',
  'hero-augintiniai-pagrindinis.webp',
];
let out = 'failas | SU auth | BE auth | ctype | dydis\n';
for(const f of files){
  const url = DEV+BASE+f;
  let withAuth='?', noAuth='?', ctype='?', size='?';
  try{
    const r = execSync('curl -sk -o /dev/null -w "%{http_code}|%{content_type}|%{size_download}" -u "$WPU:$WPP" --max-time 15 "'+url+'"',{encoding:'utf8',timeout:17000,env:{...process.env,WPU,WPP}}).trim();
    [withAuth, ctype, size] = r.split('|');
  }catch(e){ withAuth='ERR'; }
  try{
    noAuth = execSync('curl -sk -o /dev/null -w "%{http_code}" --max-time 15 "'+url+'"',{encoding:'utf8',timeout:17000}).trim();
  }catch(e){ noAuth='ERR'; }
  out += f+' | '+withAuth+' | '+noAuth+' | '+ctype+' | '+size+'\n';
}
out += '\n--- WP media API: ar failai registruoti ---\n';
for(const id of [34561,34562,34563,34564,34565,34566,34577,34578]){
  try{
    const r = execSync('curl -sk -u "$WPU:$WPP" --max-time 20 "'+DEV+'/wp-json/wp/v2/media/'+id+'?_fields=id,source_url,media_details"',{encoding:'utf8',maxBuffer:5000000,timeout:22000,env:{...process.env,WPU,WPP}});
    const j = JSON.parse(r);
    const fsz = (j.media_details && j.media_details.filesize) || '?';
    out += id+': '+(j.source_url||'NERA').split('/').pop()+'  filesize='+fsz+'\n';
  }catch(e){ out += id+': ERR\n'; }
}
// Ar failai fiziskai serveryje? per uploads dir listing negalima, bet HEAD uzteks (aukstciau)
putFile('imgcheck.txt', out);
