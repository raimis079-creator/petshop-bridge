import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN;
function ghPut(p,buf,m){const u=`https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/${p}`;let s='';try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:m,content:buf.toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:30*1024*1024});}
function get(u){ try{ return execSync(`curl -sL --max-time 30 -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36" "${u}"`,{maxBuffer:20*1024*1024}).toString(); }catch(e){ return ''; } }

const targets = [
 ['exclusion.pl HYPS','https://exclusion.pl/pork-and-pea-small-breed/3-123-19'],
 ['exclusion.pl HYPM','https://exclusion.pl/pl/karma-dla-psa-hypoallergenic-srednie-duze-rasy-wie/3-123-155'],
 ['gappay HYPS','https://www.gappay-hundesport.com/en/gappay/hundeernaehrung/hundefutter-fuer-kleine-rassen/hypollergenic-futter/exclusion-schwein-erbse_1234568338_7254'],
 ['futterglueck HYPM','https://www.futterglueck-shop.de/en/gappay/hundeernaehrung/hundefutter-fuer-mittlere-grosse-rassen/hypollergenic-futter/exclusion-schwein-erbse_1234568346_8379'],
 ['petplusultra HYPS','https://www.petplusultra.com/en/veterinary-diets/2447-exclusion-diet-hypoallergenic-pork-and-pea-small-breed-2-kg'],
 ['tropical-store HYPS','https://www.tropical-store.com/en/exclusion/9812-7787-exclusion-diet-hypoallergenic-pork-and-peas-small-breed.html'],
 ['exclusion.it IT ngalm','https://exclusion.it/prodotti/ca/me/ng/ad-ng/lam-ad-ng/noble-grainadult-lamb-medium-breed/'],
 ['oasipetshop HYPS','https://oasipetshop.com/en/products/exclusion-hypoallergenic-pork-and-pea-small-breed'],
];
const out={};
for (const [name,u] of targets) {
  const h = get(u);
  if(!h){ out[name]={err:'tuščias'}; continue; }
  const tables = h.match(/<table[\s\S]*?<\/table>/gi) || [];
  // ieskom lenteles su >=4 skaiciais ir "kg" arba "gr"
  let best=null;
  for(const t of tables){
    const txt = t.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
    const nums = (txt.match(/\d+\s*[-–]\s*\d+/g)||[]).length;
    if(nums>=3 && /kg|gr\b|peso|weight|waga|masa/i.test(txt)){ if(!best || nums>best.n) best={n:nums, txt:txt.slice(0,300)}; }
  }
  // ir razione paveiksliukai
  const imgs = (h.match(/[\w\/\.\-:]*razion[\w\/\.\-]*\.(png|jpg|webp)/gi)||[]).slice(0,2);
  out[name]={ tables_total:tables.length, table_with_numbers: best? best.txt : null,
              nums: best? best.n : 0, razione_imgs: imgs, bytes: h.length };
}
ghPut('screenshots/m8_sources.json',Buffer.from(JSON.stringify(out)),'source hunt');
console.log('DONE');
