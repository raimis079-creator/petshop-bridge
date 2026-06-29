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
  const COMP = [17421, 19586, 19574, 17179, 19530, 17156];

  // 1. download component images
  const tmpDir='/tmp/rinkimg'; try{ fs.mkdirSync(tmpDir,{recursive:true}); }catch(e){}
  const dl=[];
  for(let i=0;i<COMP.length;i++){
    const p = api('GET','/wp-json/wc/v3/products/'+COMP[i]);
    const url = p && p.images && p.images[0] && p.images[0].src;
    if(!url){ continue; }
    const f = tmpDir+'/c'+i+'.jpg';
    exec('curl -sk "'+url+'" -o "'+f+'"');
    if(fs.existsSync(f) && fs.statSync(f).size>1000){ dl.push(f); }
  }
  out.downloaded = dl.length;

  // 2. python+PIL composite 3x2 grid
  let composedPath = null;
  if(dl.length === 6){
    composedPath = tmpDir+'/rinkinys_composition.jpg';
    const pyScript = `
import sys
from PIL import Image
W,H = 1280, 880
tile_size = 380
gap = 30
pad_x = (W - tile_size*3 - gap*2) // 2
pad_y = (H - tile_size*2 - gap) // 2
canvas = Image.new('RGB', (W,H), (248,248,248))
files = ${JSON.stringify(dl)}
for i,f in enumerate(files):
    img = Image.open(f).convert('RGB')
    # contain into tile_size x tile_size on white
    w,h = img.size
    ratio = min(tile_size/w, tile_size/h)
    nw, nh = int(w*ratio), int(h*ratio)
    img = img.resize((nw,nh), Image.LANCZOS)
    tile = Image.new('RGB', (tile_size,tile_size), (255,255,255))
    tile.paste(img, ((tile_size-nw)//2, (tile_size-nh)//2))
    col = i % 3
    row = i // 3
    x = pad_x + col*(tile_size+gap)
    y = pad_y + row*(tile_size+gap)
    canvas.paste(tile, (x,y))
canvas.save('${composedPath}', 'JPEG', quality=88)
print('OK', '${composedPath}')
`;
    fs.writeFileSync('/tmp/compose.py', pyScript);
    // ensure PIL
    exec('python3 -c "import PIL" 2>/dev/null || pip3 install --quiet Pillow');
    const r = exec('python3 /tmp/compose.py 2>&1');
    out.python_out = r.slice(0,300);
    if(fs.existsSync(composedPath)){
      out.composed_size = fs.statSync(composedPath).size;
      putBin('rinkinys_compo_preview.jpg', fs.readFileSync(composedPath));
    }
  } else {
    out.compose_skip = 'rasta tik '+dl.length+'/6';
  }

  // 3. upload to WP media + assign as featured
  if(composedPath && fs.existsSync(composedPath)){
    const filename = 'rinkinys-isrankiems-6x400g.jpg';
    const upCmd = 'curl -sk -X POST -H "Authorization: '+AUTH+'" '
      +'-H "Content-Disposition: attachment; filename=\\"'+filename+'\\"" '
      +'-H "Content-Type: image/jpeg" '
      +'--data-binary @"'+composedPath+'" '
      +'"'+BASE+'/wp-json/wp/v2/media"';
    const upRaw = exec(upCmd);
    let media; try{ media = JSON.parse(upRaw); }catch(e){ media={__raw:upRaw.slice(0,300)}; }
    out.media_id = media && media.id;
    out.media_url = media && media.source_url;
    out.media_err = media && (media.code||media.__raw||null);
    if(media && media.id){
      const setImg = api('PUT','/wp-json/wc/v3/products/34153', { images: [{id: media.id}] });
      out.assigned = setImg && setImg.images && setImg.images[0] && setImg.images[0].id;
    }
  }

  commit('compo_result.json', JSON.stringify(out,null,1));
  console.log("DONE dl="+dl.length+" media="+(out.media_id||0));
})();
