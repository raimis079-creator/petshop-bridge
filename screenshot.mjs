import { execSync } from "child_process";
import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function putBin(name,buf){
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){}
  const body={message:'r',branch:'main',content:buf.toString('base64')}; if(sha) body.sha=sha;
  fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));
  try{ execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}); }catch(e){}
}
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000}); }catch(e){ return 'EXC:'+String(e).slice(0,200); } }
(async()=>{
  // 1. parsisiunčiu webp + konvertuoju į jpg per Pillow (kad būtų matomas patikrinimui)
  exec('curl -sk -A "Mozilla/5.0" "https://ontario.pet/en/wp-content/uploads/213-2002.webp" -o /tmp/orig.webp');
  const stat = fs.existsSync('/tmp/orig.webp') ? fs.statSync('/tmp/orig.webp').size : 0;
  console.log("webp size:", stat);
  if(stat > 1000){
    exec('python3 -c "from PIL import Image; im=Image.open(\\"/tmp/orig.webp\\").convert(\\"RGB\\"); im.save(\\"/tmp/preview.jpg\\", \\"JPEG\\", quality=92)"');
    if(fs.existsSync('/tmp/preview.jpg')){
      const sz = fs.statSync('/tmp/preview.jpg').size;
      console.log("jpg size:", sz);
      putBin('ontario_new_image.jpg', fs.readFileSync('/tmp/preview.jpg'));
    }
  }
})();
