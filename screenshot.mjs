import { execSync } from "child_process";
import fs from "fs";
import { putFile } from './gtm_lib.mjs';
let out=''; const L=(s)=>{out+=s+'\n';};
const U=process.env.WP_USER||''; const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH=U+':'+P;
const API='https://dev.avesa.lt/wp-json/code-snippets/v1/snippets';

function api(method, url, bodyObj){
  let cmd = 'curl -sk -o /tmp/r.json -w "%{http_code}" --max-time 45 -u "'+AUTH+'" -X '+method+' ';
  if(bodyObj){
    fs.writeFileSync('/tmp/body.json', JSON.stringify(bodyObj));
    cmd += '-H "Content-Type: application/json" -d @/tmp/body.json ';
  }
  cmd += '"'+url+'" 2>/dev/null || echo ERR';
  const code = execSync(cmd,{encoding:'utf8'}).trim();
  let body=''; try{ body=fs.readFileSync('/tmp/r.json','utf8'); }catch(e){}
  return {code, body};
}
function page(url){
  try{
    const code=execSync('curl -sk -o /tmp/p.html -w "%{http_code}" --max-time 40 "'+url+'" 2>/dev/null || echo ERR',{encoding:'utf8'}).trim();
    let h=''; try{ h=fs.readFileSync('/tmp/p.html','utf8'); }catch(e){}
    return {code, html:h};
  }catch(e){ return {code:'ERR', html:''}; }
}

const CODE = fs.readFileSync('petshop_datalayer_v1.php','utf8');
L('PHP kodas: '+CODE.length+' baitu, '+CODE.split('\n').length+' eiluciu'); L('');

try{
  // --- 0. Ar jau yra? ---
  L('=== 0. Esami DataLayer snippet\'ai ===');
  const list = api('GET', API+'?per_page=100');
  let existing = null;
  if(list.code==='200'){
    const arr = JSON.parse(list.body);
    L('  is viso snippet\'u: '+arr.length);
    existing = arr.find(s => s.name && s.name.includes('DataLayer'));
    if(existing) L('  RASTAS: id='+existing.id+' "'+existing.name+'" active='+existing.active);
    else L('  nerasta — kuriam nauja');
  } else { L('  HTTP '+list.code); throw new Error('list fail'); }
  L('');

  // --- 1. Kuriam / atnaujinam (INACTIVE) ---
  L('=== 1. Deploy (inactive) ===');
  const payload = {
    name: 'Petshop DataLayer v1.0 (GA4 ecommerce)',
    desc: 'GA4 e-commerce dataLayer: view_item, add_to_cart, view_cart, begin_checkout, purchase. Maitina GTM-MF3GZGT.',
    code: CODE,
    scope: 'front-end',
    active: false,
    priority: 10,
    tags: ['tracking','gtm','ga4']
  };
  let snipId = null;
  if(existing){
    const r = api('POST', API+'/'+existing.id, payload);
    L('  UPDATE id='+existing.id+' -> HTTP '+r.code);
    if(r.code!=='200'){ L('  '+r.body.slice(0,400)); throw new Error('update fail'); }
    snipId = existing.id;
  } else {
    const r = api('POST', API, payload);
    L('  CREATE -> HTTP '+r.code);
    if(r.code!=='200' && r.code!=='201'){ L('  '+r.body.slice(0,400)); throw new Error('create fail'); }
    snipId = JSON.parse(r.body).id;
    L('  naujas id='+snipId);
  }
  L('');

  // --- 2. Sintakses patikra (Code Snippets validuoja aktyvuojant) ---
  L('=== 2. Aktyvavimas (sintakses testas) ===');
  const act = api('POST', API+'/'+snipId, { active: true });
  L('  ACTIVATE -> HTTP '+act.code);
  if(act.code!=='200'){
    L('  ❌ '+act.body.slice(0,500));
    throw new Error('activate fail — greiciausiai PHP sintakses klaida');
  }
  const j = JSON.parse(act.body);
  L('  active='+j.active+'  scope='+j.scope+'  code_error='+JSON.stringify(j.code_error||null));
  if(j.code_error){ L('  ❌ PHP KLAIDA: '+JSON.stringify(j.code_error)); }
  L('');

  // --- 3. Ar svetaine gyva ---
  L('=== 3. Svetaines sveikata ===');
  for(const [nm,u] of [['Homepage','https://dev.avesa.lt/'],['Parduotuve','https://dev.avesa.lt/parduotuve/'],['Preke','https://dev.avesa.lt/product/ruda-avies-koja-1-vnt-x-20-vnt/'],['Krepselis','https://dev.avesa.lt/cart/']]){
    const r = page(u);
    const fatal = /Fatal error|Parse error|There has been a critical error/i.test(r.html);
    L('  '+nm.padEnd(12)+' HTTP '+r.code+'  ('+r.html.length+' B)  '+(fatal?'❌ FATAL ERROR':'✅'));
    if(fatal){
      const m = r.html.match(/(Fatal error|Parse error)[^<]{0,300}/i);
      if(m) L('      '+m[0]);
    }
  }
  L('');

  // --- 4. dataLayer patikra ---
  L('=== 4. dataLayer HTML patikra ===');
  const prod = page('https://dev.avesa.lt/product/ruda-avies-koja-1-vnt-x-20-vnt/');
  L('  Prekes puslapis:');
  const checks = {
    'data-petshop-gtm zyma':   /data-petshop-gtm="1"/.test(prod.html),
    'dataLayer.push':          /dataLayer\.push/.test(prod.html),
    'event: view_item':        /"event":"view_item"/.test(prod.html) || /'event': ?'view_item'/.test(prod.html),
    'ecommerce: null':         /ecommerce: null/.test(prod.html),
    'window.petshopGtmItem':   /window\.petshopGtmItem/.test(prod.html),
    'added_to_cart listener':  /added_to_cart/.test(prod.html),
    'item_id':                 /"item_id"/.test(prod.html),
    'item_name':               /"item_name"/.test(prod.html),
    'item_brand':              /"item_brand"/.test(prod.html),
    'item_category':           /"item_category"/.test(prod.html),
  };
  for(const [k,v] of Object.entries(checks)) L('    '+(v?'✅':'❌')+' '+k);
  L('');

  const m = prod.html.match(/window\.dataLayer\.push\(\{[\s\S]{0,700}?\}\);/);
  if(m){
    L('  Realus push (pirmi 700 simb.):');
    L('    '+m[0].replace(/\n/g,'\n    ').slice(0,700));
  } else {
    const m2 = prod.html.match(/window\.petshopGtmItem = [\s\S]{0,400}?;/);
    if(m2) L('  petshopGtmItem:\n    '+m2[0].slice(0,400));
  }
  L('');

  // --- 5. Loop data attribute ---
  L('=== 5. data-gtm-item loop mygtukuose ===');
  const shop = page('https://dev.avesa.lt/parduotuve/');
  const cnt = (shop.html.match(/data-gtm-item/g)||[]).length;
  L('  Parduotuves puslapis: '+cnt+' mygtuku su data-gtm-item');
  if(cnt>0){
    const one = shop.html.match(/data-gtm-item='([^']{0,300})'/) || shop.html.match(/data-gtm-item="([^"]{0,300})"/);
    if(one) L('    pvz: '+one[1].slice(0,220));
  }
  L('');
  L('=== SNIPPET ID: '+snipId+' ===');
  L('Jei reikia deaktyvuoti: POST '+API+'/'+snipId+' {"active":false}');

}catch(e){ L(''); L('!!! ERROR: '+e.message); }
putFile('e6_deploy.txt', out); console.log(out);
