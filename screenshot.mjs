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
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000}); }catch(e){ return String(e).slice(0,200); } }
function api(method, path, body){
  let cmd='curl -sk -X '+method+' -H "Authorization: '+AUTH+'" -H "Content-Type: application/json"';
  if(body!==undefined){ fs.writeFileSync('/tmp/b.json', JSON.stringify(body)); cmd+=' -d @/tmp/b.json'; }
  cmd+=' "'+BASE+path+'"';
  let raw=exec(cmd);
  try{ return JSON.parse(raw); }catch(e){ return {__raw:raw.slice(0,400)}; }
}
function exec_dl(url, file){ exec('curl -sk "'+url+'" -o "'+file+'"'); }
(async()=>{
  const out={ts:new Date().toISOString()};
  // 1. atnaujinu pavadinimą
  const upd = api('PUT','/wp-json/wc/v3/products/34158', {
    name: 'Vandenynas konservų rinkinys katėms',
    slug: 'vandenynas-konservu-rinkinys-katems'
  });
  out.name_update = upd && upd.id ? {id:upd.id, name:upd.name, slug:upd.slug} : (upd.__raw||upd.code);

  // 2. parsisiunčiu kiekvieno komponento pagrindinę nuotrauką ir paskaičiuoju
  //    fono spalvą iš 4 kampų. Jei NE baltas (RGB > 240,240,240) — pažymiu
  const COMPS = [16942, 17057, 17499, 17493, 18369, 19045, 19452, 17550, 17547, 17538, 17541];
  const tmpDir='/tmp/bgcheck'; try{ fs.mkdirSync(tmpDir,{recursive:true}); }catch(e){}
  for(const id of COMPS){
    const p = api('GET','/wp-json/wc/v3/products/'+id);
    const url = p && p.images && p.images[0] && p.images[0].src;
    if(!url) continue;
    const f = tmpDir+'/c'+id+'.jpg';
    exec_dl(url, f);
  }
  // python pillow tikrina kampų spalvas
  const py = `
from PIL import Image
import os, json
results = {}
for fn in sorted(os.listdir('${tmpDir}')):
    if not fn.endswith('.jpg'): continue
    id_ = fn.replace('c','').replace('.jpg','')
    try:
        img = Image.open('${tmpDir}/'+fn).convert('RGB')
        w, h = img.size
        # paimu 4 kampų vidurkius (10x10 plote)
        corners = [
            img.crop((0,0,15,15)),
            img.crop((w-15,0,w,15)),
            img.crop((0,h-15,15,h)),
            img.crop((w-15,h-15,w,h))
        ]
        avg = []
        for c in corners:
            px = list(c.getdata())
            r = sum(p[0] for p in px)//len(px)
            g = sum(p[1] for p in px)//len(px)
            b = sum(p[2] for p in px)//len(px)
            avg.append((r,g,b))
        # ar baltas? — visi 4 kampai > 240
        is_white = all(c[0] > 235 and c[1] > 235 and c[2] > 235 for c in avg)
        results[id_] = {'corners': avg, 'is_white_bg': is_white, 'size': [w,h]}
    except Exception as e:
        results[id_] = {'error': str(e)}
print(json.dumps(results))
`;
  fs.writeFileSync('/tmp/bgc.py', py);
  exec('python3 -c "from PIL import Image" 2>/dev/null || pip3 install --quiet --break-system-packages Pillow 2>&1');
  const bgResult = exec('python3 /tmp/bgc.py 2>&1');
  try{ out.bg_check = JSON.parse(bgResult); }catch(e){ out.bg_check_raw = bgResult.slice(0,500); }

  commit('vandenynas_fix.json', JSON.stringify(out,null,1));
  console.log("DONE");
})();
