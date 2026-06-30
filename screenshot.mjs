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

  // 1. parsisiunčiu esamą 17057 nuotrauką iš dev
  exec('curl -sk "https://dev.avesa.lt/wp-content/uploads/2026/06/ontario-chicken-salmon-95g-v2.jpg" -o /tmp/orig.jpg');
  if(!fs.existsSync('/tmp/orig.jpg') || fs.statSync('/tmp/orig.jpg').size < 5000){
    out.fatal = 'orig download failed';
    commit('cleanbg_result.json', JSON.stringify(out,null,1));
    return;
  }
  out.orig_size = fs.statSync('/tmp/orig.jpg').size;

  // 2. Python+PIL: aptinka fono spalvą iš keturių kampų, pakeičia į baltą tolerancijos lauke
  exec('python3 -c "from PIL import Image" 2>/dev/null || pip3 install --quiet --break-system-packages Pillow 2>&1');
  const py = `
from PIL import Image, ImageFilter
import sys

img = Image.open('/tmp/orig.jpg').convert('RGB')
w, h = img.size
px = img.load()

# Paimu 4 kampų spalvas (10x10 plotuose)
def sample(x0, y0, sz=10):
    rs, gs, bs = [], [], []
    for x in range(x0, x0+sz):
        for y in range(y0, y0+sz):
            r,g,b = px[x,y]
            rs.append(r); gs.append(g); bs.append(b)
    return (sum(rs)//len(rs), sum(gs)//len(gs), sum(bs)//len(bs))

corners = [
    sample(0, 0),
    sample(w-10, 0),
    sample(0, h-10),
    sample(w-10, h-10)
]
print('Kampų spalvos:', corners, file=sys.stderr)

# Visi 4 kampai turi būti panašūs (tolerancija ±15) — tada tai fonas
def close(c1, c2, tol=20):
    return all(abs(c1[i]-c2[i])<tol for i in range(3))

if not all(close(corners[0], c) for c in corners[1:]):
    print('KAMPAI NEVIENODI - perduot į originalą', file=sys.stderr)
    img.save('/tmp/clean.jpg', 'JPEG', quality=92)
    sys.exit(0)

bg = (
    sum(c[0] for c in corners)//4,
    sum(c[1] for c in corners)//4,
    sum(c[2] for c in corners)//4
)
print('Aptiktas fonas RGB:', bg, file=sys.stderr)

# Tolerancija ±35 (kad pagautume šešėlius, antialiasing'ą)
TOL = 40
new_img = Image.new('RGB', (w, h), (255, 255, 255))
new_px = new_img.load()
changed = 0
for y in range(h):
    for x in range(w):
        r, g, b = px[x, y]
        # Ar šis pikselis "panašus į foną"?
        if abs(r-bg[0])<TOL and abs(g-bg[1])<TOL and abs(b-bg[2])<TOL:
            new_px[x, y] = (255, 255, 255)
            changed += 1
        else:
            new_px[x, y] = (r, g, b)

print(f'Pakeista pikselių: {changed} iš {w*h}', file=sys.stderr)
new_img.save('/tmp/clean.jpg', 'JPEG', quality=92)
print('OK')
`;
  fs.writeFileSync('/tmp/clean.py', py);
  const result = exec('python3 /tmp/clean.py 2>&1');
  out.python_out = result.slice(0, 500);

  if(!fs.existsSync('/tmp/clean.jpg')){
    out.fatal = 'clean failed';
    commit('cleanbg_result.json', JSON.stringify(out,null,1));
    return;
  }
  out.clean_size = fs.statSync('/tmp/clean.jpg').size;
  putBin('ontario_clean_preview.jpg', fs.readFileSync('/tmp/clean.jpg'));

  // 3. Upload kaip naują media
  const filename = 'ontario-chicken-salmon-95g-clean.jpg';
  const upCmd = `curl -sk -X POST -H "Authorization: ${AUTH}" `
    + `-H "Content-Disposition: attachment; filename=\\"${filename}\\"" `
    + `-H "Content-Type: image/jpeg" `
    + `--data-binary @/tmp/clean.jpg `
    + `"${BASE}/wp-json/wp/v2/media"`;
  const upRaw = exec(upCmd);
  let media; try{ media = JSON.parse(upRaw); }catch(e){ media={__raw:upRaw.slice(0,300)}; }
  out.new_media_id = media && media.id;

  // 4. Priskirti 17057
  if(media && media.id){
    const setImg = api('PUT','/wp-json/wc/v3/products/17057', { images: [{id: media.id}] });
    out.assigned = setImg && setImg.images && setImg.images[0] && setImg.images[0].id;
  }

  commit('cleanbg_result.json', JSON.stringify(out,null,1));
  console.log("DONE media="+out.new_media_id);
})();
