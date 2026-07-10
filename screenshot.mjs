import { execSync } from "child_process";
import { putFile } from './gtm_lib.mjs';
let out=''; const L=(s)=>{out+=s+'\n';};

function fetchTxt(url){
  try{ return execSync('curl -sk -L --max-time 45 -A "Mozilla/5.0 Chrome/120" "'+url+'"',{encoding:'utf8',maxBuffer:60000000}); }
  catch(e){ return ''; }
}

L('### IESKOM Google Ads conversion label AW-11117260149/XXXX ###');
L('');

const targets = [
  ['GTM-MZGDV75F gtm.js','https://www.googletagmanager.com/gtm.js?id=GTM-MZGDV75F'],
  ['G-FMTKEGGLMG gtag.js','https://www.googletagmanager.com/gtag/js?id=G-FMTKEGGLMG'],
  ['AW-11117260149 gtag.js','https://www.googletagmanager.com/gtag/js?id=AW-11117260149'],
  ['GT-WPTSZS8 gtag.js','https://www.googletagmanager.com/gtag/js?id=GT-WPTSZS8'],
  ['GT-5TQ4JZWM gtag.js','https://www.googletagmanager.com/gtag/js?id=GT-5TQ4JZWM'],
];

for(const [label,url] of targets){
  const js = fetchTxt(url);
  L('===== '+label+' ('+js.length+' B) =====');
  if(js.length<300){ L('  (tuscia / klaida)'); L(''); continue; }
  const pats = {
    'AW-xxx/LABEL (pilnas)' : /AW-\d{9,12}\/[A-Za-z0-9_\-]{5,30}/g,
    'AW- ID'                : /\bAW-\d{9,12}\b/g,
    'send_to'               : /send_to["'\s:]+[A-Za-z0-9_\-\/]+/g,
    'conversion label kandidatai (aw.l / gcl)' : /["'][A-Za-z0-9_\-]{11,22}["']\s*,\s*["']AW-/g,
    'G- ID'                 : /\bG-[A-Z0-9]{8,12}\b/g,
    'GT- ID'                : /\bGT-[A-Z0-9]{6,12}\b/g,
    'conversion event'      : /gtag\(["']event["'],\s*["']conversion["']/g,
    'purchase'              : /["']purchase["']/g,
  };
  for(const [k,re] of Object.entries(pats)){
    const m = js.match(re);
    if(m){ const u=[...new Set(m)]; L('  ['+String(u.length).padStart(2)+'] '+k);
      u.slice(0,10).forEach(x=>L('        '+x.slice(0,90))); }
  }
  L('');
}

// PROD checkout / success puslapiai
L('===== PROD puslapiu skenavimas =====');
for(const u of ['https://petshop.lt/index.php?route=checkout/success','https://petshop.lt/index.php?route=checkout/checkout','https://petshop.lt/index.php?route=checkout/cart']){
  const h = fetchTxt(u);
  L('  '+u);
  L('    dydis '+h.length+' B');
  const aw = h.match(/AW-\d{9,12}\/[A-Za-z0-9_\-]{5,30}/g);
  const st = h.match(/send_to["'\s:]+[A-Za-z0-9_\-\/]+/g);
  const dl = h.match(/dataLayer\.push\(\{[^}]{0,120}/g);
  L('    AW+label: '+(aw?[...new Set(aw)].join(', '):'-'));
  L('    send_to:  '+(st?[...new Set(st)].slice(0,3).join(' | '):'-'));
  L('    dataLayer.push: '+(dl?dl.length+' vnt':'-'));
  if(dl) dl.slice(0,4).forEach(x=>L('       '+x.replace(/\s+/g,' ').slice(0,100)));
  L('');
}
putFile('ads_label_hunt.txt', out); console.log(out);
