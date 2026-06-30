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
  // 11 komponentų ID — tie patys, ką padarėm VANDENYNAS rinkiniui
  const COMPS = [16942, 17057, 17499, 17493, 18369, 19045, 19452, 17550, 17547, 17538, 17541];

  // 1. Parsisiunčiu visus komponentus
  const tmpDir='/tmp/rinkimg_regen'; try{ fs.mkdirSync(tmpDir,{recursive:true}); }catch(e){}
  const dl=[];
  for(const id of COMPS){
    const p = api('GET','/wp-json/wc/v3/products/'+id);
    const url = p && p.images && p.images[0] && p.images[0].src;
    if(!url){ continue; }
    const f = tmpDir+'/c'+id+'.jpg';
    exec('curl -sk "'+url+'" -o "'+f+'"');
    if(fs.existsSync(f) && fs.statSync(f).size>1000){ dl.push(f); }
  }
  out.downloaded = dl.length;

  if(dl.length !== 11){ out.fatal = 'Tikėjausi 11, gavau '+dl.length; commit('regen.json', JSON.stringify(out,null,1)); return; }

  // 2. Python+PIL — 4x3 grid su last_row_count=3 (3 viduryje)
  exec('python3 -c "from PIL import Image" 2>/dev/null || pip3 install --quiet --break-system-packages Pillow 2>&1');
  const composedPath = tmpDir+'/composition.jpg';
  const tile_size = 380;
  const gap = 30;
  const cols = 4;
  const rows = 3;
  const last_row_count = 3;
  const W = cols * tile_size + (cols - 1) * gap + 60;
  const H = rows * tile_size + (rows - 1) * gap + 60;
  const py = `
from PIL import Image
tile_size = ${tile_size}
gap = ${gap}
W, H = ${W}, ${H}
cols = ${cols}
rows = ${rows}
last_row_count = ${last_row_count}
files = ${JSON.stringify(dl)}
canvas = Image.new('RGB', (W, H), (248, 248, 248))
pad_x = (W - cols * tile_size - (cols - 1) * gap) // 2
pad_y = (H - rows * tile_size - (rows - 1) * gap) // 2
for i, f in enumerate(files):
    img = Image.open(f).convert('RGB')
    w, h = img.size
    ratio = min(tile_size / w, tile_size / h)
    nw, nh = int(w * ratio), int(h * ratio)
    img = img.resize((nw, nh), Image.LANCZOS)
    tile = Image.new('RGB', (tile_size, tile_size), (255, 255, 255))
    tile.paste(img, ((tile_size - nw) // 2, (tile_size - nh) // 2))
    row = i // cols
    col = i % cols
    if row == rows - 1 and last_row_count < cols:
        row_pad_x = (W - last_row_count * tile_size - (last_row_count - 1) * gap) // 2
        x = row_pad_x + col * (tile_size + gap)
    else:
        x = pad_x + col * (tile_size + gap)
    y = pad_y + row * (tile_size + gap)
    canvas.paste(tile, (x, y))
canvas.save('${composedPath}', 'JPEG', quality=88)
print('OK')
`;
  fs.writeFileSync('/tmp/compose.py', py);
  const r = exec('python3 /tmp/compose.py 2>&1');
  out.python_out = r.slice(0,200);
  if(!fs.existsSync(composedPath)){ out.fatal='compose failed'; commit('regen.json', JSON.stringify(out,null,1)); return; }
  out.composed_size = fs.statSync(composedPath).size;
  putBin('vand_compo_v2_preview.jpg', fs.readFileSync(composedPath));

  // 3. Upload kaip naują media + priskirti rinkiniui 34158
  const filename = 'rink-vandenynas-cat-11-v2.jpg';
  const upCmd = `curl -sk -X POST -H "Authorization: ${AUTH}" `
    + `-H "Content-Disposition: attachment; filename=\\"${filename}\\"" `
    + `-H "Content-Type: image/jpeg" `
    + `--data-binary @"${composedPath}" `
    + `"${BASE}/wp-json/wp/v2/media"`;
  const upRaw = exec(upCmd);
  let media; try{ media = JSON.parse(upRaw); }catch(e){ media={__raw:upRaw.slice(0,300)}; }
  out.new_media_id = media && media.id;
  out.new_media_url = media && media.source_url;
  if(media && media.id){
    const setImg = api('PUT','/wp-json/wc/v3/products/34158', { images: [{id: media.id}] });
    out.assigned = setImg && setImg.images && setImg.images[0] && setImg.images[0].id;
  }

  commit('regen.json', JSON.stringify(out,null,1));
  console.log("DONE media="+out.new_media_id);
})();
