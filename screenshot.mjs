import { execSync } from "child_process";
import { putFile } from './gtm_lib.mjs';
let out=''; const L=(s)=>{out+=s+'\n';};
const U=process.env.WP_USER||'';
const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH=U+':'+P;

function req(url, auth){
  const a = auth ? '-u "'+auth+'" ' : '';
  try{
    const code = execSync('curl -sk -o /tmp/r.txt -w "%{http_code}" --max-time 40 '+a+'"'+url+'" 2>/dev/null || echo ERR',{encoding:'utf8'}).trim();
    let body=''; try{ body=execSync('cat /tmp/r.txt',{encoding:'utf8'}); }catch(e){}
    return {code, body};
  }catch(e){ return {code:'ERR', body:''}; }
}

L('############ E6 RECON — WooCommerce dataLayer aplinka ############'); L('');

// --- 1. WC puslapiu ID ---
L('=== 1. WooCommerce puslapiai ===');
const ss = req('https://dev.avesa.lt/wp-json/wc/v3/system_status', AUTH);
if(ss.code==='200'){
  try{
    const j=JSON.parse(ss.body);
    L('  WC '+j.environment?.version+' | WP '+j.environment?.wp_version+' | PHP '+j.environment?.php_version);
    L('  Tema: '+(j.theme?.name||'?')+' v'+(j.theme?.version||'?')+'  child='+(j.theme?.is_child_theme?'TAIP':'ne'));
    if(j.theme?.is_child_theme) L('  Parent: '+(j.theme?.parent_name||'?'));
    L('  HPOS / custom orders table: '+JSON.stringify(j.settings?.HPOS_enabled ?? 'n/a'));
    L('  Pages:');
    for(const p of (j.pages||[])) L('    '+String(p.page_name).padEnd(16)+' id='+p.page_id+'  set='+p.page_set+'  exists='+p.page_exists+'  visible='+p.page_visible);
  }catch(e){ L('  parse err'); }
} else L('  HTTP '+ss.code);
L('');

// --- 2. Aktyvus plugin'ai (tracking-related) ---
L('=== 2. Tracking-related plugin\'ai ===');
const pl = req('https://dev.avesa.lt/wp-json/wp/v2/plugins?per_page=100', AUTH);
if(pl.code==='200'){
  try{
    const arr=JSON.parse(pl.body);
    L('  is viso plugin\'u: '+arr.length);
    const keys=/analytic|tag|pixel|facebook|meta|google|consent|complianz|gtm|track|conversion/i;
    const hits=arr.filter(p=>keys.test(p.name)||keys.test(p.plugin));
    for(const p of hits) L('    ['+(p.status==='active'?'ON ':'off')+'] '+p.name+' v'+p.version);
    L('  aktyvus is viso: '+arr.filter(p=>p.status==='active').length);
  }catch(e){ L('  parse err'); }
} else L('  HTTP '+pl.code);
L('');

// --- 3. HTML skenavimas: checkout tipas ---
L('=== 3. Checkout / Cart tipas (Blocks ar klasikinis) ===');
const urls = [
  ['Krepselis','https://dev.avesa.lt/krepselis/'],
  ['Kasa','https://dev.avesa.lt/kasa/'],
  ['Cart (en)','https://dev.avesa.lt/cart/'],
  ['Checkout (en)','https://dev.avesa.lt/checkout/'],
  ['Parduotuve','https://dev.avesa.lt/parduotuve/'],
];
for(const [nm,u] of urls){
  const r = req(u, null);
  L('  '+nm.padEnd(14)+' HTTP '+r.code+'  ('+r.body.length+' B)');
  if(r.code==='200'){
    const h=r.body;
    const sig = {
      'wc-blocks (wp-block-woocommerce)': /wp-block-woocommerce-(cart|checkout)/.test(h),
      'klasikinis checkout form':          /class="[^"]*woocommerce-checkout/.test(h),
      'klasikinis cart form':              /class="[^"]*woocommerce-cart-form/.test(h),
      'Flatsome':                          /flatsome/i.test(h),
      'esamas dataLayer':                  /dataLayer/.test(h),
      'esamas gtag':                       /gtag\(/.test(h),
      'esamas fbq':                        /fbq\(/.test(h),
      'GTM snippet':                       /GTM-[A-Z0-9]{6,9}/.test(h),
      'ajax_add_to_cart':                  /ajax_add_to_cart/.test(h),
    };
    for(const [k,v] of Object.entries(sig)) if(v) L('      → '+k);
  }
}
L('');

// --- 4. Prekes puslapis ---
L('=== 4. Prekes puslapio pavyzdys ===');
const prods = req('https://dev.avesa.lt/wp-json/wc/v3/products?per_page=1&status=publish', AUTH);
if(prods.code==='200'){
  try{
    const arr=JSON.parse(prods.body);
    if(arr.length){
      const p=arr[0];
      L('  id='+p.id+'  sku='+(p.sku||'-')+'  "'+p.name.slice(0,45)+'"');
      L('  permalink: '+p.permalink);
      L('  kaina: '+p.price+' '+(p.currency||'EUR')+'   tipas: '+p.type);
      L('  kategorijos: '+(p.categories||[]).map(c=>c.name).join(', ').slice(0,80));
      L('  brand tax: '+JSON.stringify((p.brands||[]).map(b=>b.name)).slice(0,60));
      const ph = req(p.permalink, null);
      L('  puslapis HTTP '+ph.code+' ('+ph.body.length+' B)');
      if(ph.code==='200'){
        L('    dataLayer: '+(/dataLayer/.test(ph.body)?'YRA':'nera'));
        L('    ajax_add_to_cart: '+(/ajax_add_to_cart/.test(ph.body)?'YRA':'nera'));
        L('    single_add_to_cart_button: '+(/single_add_to_cart_button/.test(ph.body)?'YRA':'nera'));
      }
    } else L('  (nera publikuotu prekiu)');
  }catch(e){ L('  parse err: '+prods.body.slice(0,150)); }
} else L('  HTTP '+prods.code);
L('');

// --- 5. Valiuta ir mokesciai ---
L('=== 5. WC nustatymai ===');
for(const [nm,key] of [['Valiuta','woocommerce_currency'],['Kainos su PVM','woocommerce_prices_include_tax'],['Mokesciai','woocommerce_calc_taxes']]){
  const r = req('https://dev.avesa.lt/wp-json/wc/v3/settings/general/'+key, AUTH);
  if(r.code==='200'){ try{ const j=JSON.parse(r.body); L('  '+nm.padEnd(16)+' = '+j.value); }catch(e){ L('  '+nm+' parse err'); } }
  else L('  '+nm.padEnd(16)+' HTTP '+r.code);
}
putFile('e6_recon.txt', out); console.log(out);
