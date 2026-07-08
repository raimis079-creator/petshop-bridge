import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'um',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
const out={};
// nuotrauka jau repo screenshots/hero_bg.webp - runner ja turi lokaliai
const imgPath='screenshots/hero_bg.webp';
if(!fs.existsSync(imgPath)){ out.err='img nerastas runner\'yje'; putFile('uploadmedia.json',JSON.stringify(out)); process.exit(0); }
out.img_size=fs.statSync(imgPath).size;
// WordPress media upload per REST: POST /wp-json/wp/v2/media su binary
try{
  const res=execSync('curl -sk -u "$WPU:$WPP" -X POST '+
    '-H "Content-Type: image/webp" '+
    '-H "Content-Disposition: attachment; filename=hero-augintiniai-pagrindinis.webp" '+
    '--data-binary "@'+imgPath+'" '+
    '"'+DEV+'/wp-json/wp/v2/media"',
    {encoding:'utf8',maxBuffer:20000000,timeout:90000,env:{...process.env,WPU,WPP}});
  const j=JSON.parse(res);
  out.media_id=j.id;
  out.source_url=j.source_url;
  out.media_type=j.media_type;
  out.mime=j.mime_type;
  // nustatom alt teksta
  if(j.id){
    execSync('curl -sk -u "$WPU:$WPP" -X POST -H "Content-Type: application/json" '+
      '-d \'{"alt_text":"Šuo ir katė su maisto dubenėliu - Petshop.lt","title":"Hero augintiniai pagrindinis"}\' '+
      '"'+DEV+'/wp-json/wp/v2/media/'+j.id+'"',
      {encoding:'utf8',timeout:30000,env:{...process.env,WPU,WPP}});
  }
}catch(e){ out.err=String(e).slice(0,300); }
putFile('uploadmedia.json',JSON.stringify(out));
