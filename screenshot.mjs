import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'cb',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
let out='';
const urls = [
  'upl_banner-pasiulymai-1.webp',
  'upl_banner-pasiulymai.webp',
  'upl_banner-naujas.webp',
];
for(const u of urls){
  const full = DEV+'/wp-content/uploads/2026/07/'+u;
  try{
    const code = execSync('curl -sk -o /tmp/b.webp -w "%{http_code}" -u "$WPU:$WPP" --max-time 20 "'+full+'"',{encoding:'utf8',timeout:22000,env:{...process.env,WPU,WPP}}).trim();
    let md5='-', size='-';
    if(code==='200'){
      md5 = execSync('md5sum /tmp/b.webp',{encoding:'utf8'}).split(' ')[0];
      size = execSync('stat -c%s /tmp/b.webp',{encoding:'utf8'}).trim();
    }
    out += u+': code='+code+' size='+size+' md5='+md5+'\n';
  }catch(e){ out += u+': ERR\n'; }
}
// Media API - ID 34572, 34573 tikri source_url
for(const id of [34572, 34573]){
  try{
    const r = execSync('curl -sk -u "$WPU:$WPP" --max-time 20 "'+DEV+'/wp-json/wp/v2/media/'+id+'?_fields=id,source_url,title"',{encoding:'utf8',timeout:22000,env:{...process.env,WPU,WPP}});
    const j = JSON.parse(r);
    out += 'media '+id+': '+j.source_url+'\n';
  }catch(e){ out += 'media '+id+': ERR\n'; }
}
putFile('checkbanners.txt', out);
