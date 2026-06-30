import { execSync } from "child_process";
import fs from "fs";
const repo = process.env.GH_REPO, tok = process.env.GH_TOKEN;
const WP_USER = process.env.WP_USER, WP_PASS = process.env.WP_APP_PASS;
const BASE = "https://dev.avesa.lt";
const AUTH = "Basic " + Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
function commit(name, str){
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){}
  const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha;
  fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));
  execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'});
}
function putBin(name,buf){
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){}
  const body={message:'r',branch:'main',content:buf.toString('base64')}; if(sha) body.sha=sha;
  fs.writeFileSync('/tmp/cb2.json',JSON.stringify(body));
  try{ execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb2.json "'+url+'"',{encoding:'utf8'}); }catch(e){}
}
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000}); }catch(e){ return 'EXC:'+String(e).slice(0,200); } }
function api(method, path, body){
  let cmd='curl -sk -X '+method+' -H "Authorization: '+AUTH+'" -H "Content-Type: application/json"';
  if(body!==undefined){ fs.writeFileSync('/tmp/b.json', JSON.stringify(body)); cmd+=' -d @/tmp/b.json'; }
  cmd+=' "'+BASE+path+'"';
  let raw=exec(cmd);
  try{ return JSON.parse(raw); }catch(e){ return {__raw:raw.slice(0,400)}; }
}

(async()=>{
  const out={ts:new Date().toISOString()};
  const UA='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';
  
  // Bandysiu daugiau dydžių iš myshoptet (default + originalas)
  const urls = [
    'https://cdn.myshoptet.com/usr/www.zoo4you.cz/user/shop/big/334_konzerva-ontario-chicken-pieces-salmon-95g-default.png',
    'https://cdn.myshoptet.com/usr/www.zoo4you.cz/user/shop/big/334_konzerva-ontario-chicken-pieces-salmon-95g-default.png?ff=1&x=1024&y=768&q=85'
  ];
  out.tries = {};
  let best=null; let best_size=0;
  for(const u of urls){
    const f = '/tmp/im_'+Math.random().toString(36).slice(2,8);
    exec(`curl -sk -A "${UA}" -H "Referer: https://www.zoo4you.cz/" "${u}" -o "${f}"`);
    const sz = fs.existsSync(f) ? fs.statSync(f).size : 0;
    out.tries[u] = sz;
    if(sz > 5000){
      const buf = fs.readFileSync(f);
      const hex = buf.slice(0,4).toString('hex');
      const isImg = hex.startsWith('ffd8') || hex.startsWith('8950') || hex === '52494646';
      if(isImg && sz > best_size){ best=f; best_size=sz; }
    }
  }
  out.chosen_size = best_size;
  if(!best){ out.fatal='no image'; commit('z4y2.json', JSON.stringify(out,null,1)); return; }

  exec('python3 -c "from PIL import Image" 2>/dev/null || pip3 install --quiet --break-system-packages Pillow 2>&1');
  // Universalus konversija - palaiko ir PNG su alpha, ir JPG
  const py = `
from PIL import Image
im = Image.open('${best}')
print('orig mode:', im.mode, 'size:', im.size)
if im.mode in ('RGBA', 'LA') or (im.mode == 'P' and 'transparency' in im.info):
    im = im.convert('RGBA')
    bg = Image.new('RGB', im.size, (255, 255, 255))
    bg.paste(im, mask=im.split()[3])
    bg.save('/tmp/clean.jpg', 'JPEG', quality=92)
else:
    im.convert('RGB').save('/tmp/clean.jpg', 'JPEG', quality=92)
print('OK saved')
`;
  fs.writeFileSync('/tmp/conv.py', py);
  out.convert = exec('python3 /tmp/conv.py 2>&1').slice(0,300);
  if(!fs.existsSync('/tmp/clean.jpg')){ out.fatal='conversion failed'; commit('z4y2.json', JSON.stringify(out,null,1)); return; }
  out.jpg_size = fs.statSync('/tmp/clean.jpg').size;
  putBin('ontario_z4y_v2.jpg', fs.readFileSync('/tmp/clean.jpg'));

  const filename = 'ontario-chicken-salmon-95g-v3.jpg';
  const upCmd = `curl -sk -X POST -H "Authorization: ${AUTH}" `
    + `-H "Content-Disposition: attachment; filename=\\"${filename}\\"" `
    + `-H "Content-Type: image/jpeg" `
    + `--data-binary @/tmp/clean.jpg `
    + `"${BASE}/wp-json/wp/v2/media"`;
  const upRaw = exec(upCmd);
  let media; try{ media = JSON.parse(upRaw); }catch(e){ media={__raw:upRaw.slice(0,300)}; }
  out.new_media_id = media && media.id;
  out.new_media_url = media && media.source_url;

  if(media && media.id){
    const setImg = api('PUT','/wp-json/wc/v3/products/17057', {
      images: [{id: media.id}]
    });
    out.assigned = setImg && setImg.images && setImg.images[0] && setImg.images[0].id;
  }
  commit('z4y2.json', JSON.stringify(out,null,1));
  console.log("DONE media="+out.new_media_id);
})();
