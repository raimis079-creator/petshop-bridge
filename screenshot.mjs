import { execSync } from "child_process";
import { putFile } from './gtm_lib.mjs';
let out=''; const L=(s)=>{out+=s+'\n';};
const U=process.env.WP_USER||''; const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH=U+':'+P;
function req(url){
  try{
    const code=execSync('curl -sk -o /tmp/r.txt -w "%{http_code}" --max-time 40 -u "'+AUTH+'" "'+url+'" 2>/dev/null || echo ERR',{encoding:'utf8'}).trim();
    let body=''; try{ body=execSync('cat /tmp/r.txt',{encoding:'utf8'}); }catch(e){}
    return {code, body};
  }catch(e){ return {code:'ERR', body:''}; }
}

L('=== Cart / Checkout puslapiu TURINYS (raw) ===');
for(const [nm,id] of [['Krepselis',12],['Apmokejimas',13]]){
  const r = req('https://dev.avesa.lt/wp-json/wp/v2/pages/'+id+'?context=edit');
  L('');
  L('--- '+nm+' (id '+id+') HTTP '+r.code+' ---');
  if(r.code!=='200'){ L('  '+r.body.slice(0,200)); continue; }
  try{
    const j=JSON.parse(r.body);
    const raw=(j.content?.raw||'').trim();
    L('  slug: '+j.slug+'   status: '+j.status);
    L('  link: '+j.link);
    L('  content.raw ('+raw.length+' simb.):');
    L('    '+raw.slice(0,400).replace(/\n/g,'\n    '));
    L('');
    const sig={
      'shortcode [woocommerce_cart]':     raw.includes('[woocommerce_cart]'),
      'shortcode [woocommerce_checkout]': raw.includes('[woocommerce_checkout]'),
      'blocks wp:woocommerce/cart':       raw.includes('wp:woocommerce/cart'),
      'blocks wp:woocommerce/checkout':   raw.includes('wp:woocommerce/checkout'),
    };
    for(const [k,v] of Object.entries(sig)) L('    '+(v?'✅':'  ')+' '+k);
    const isBlocks = raw.includes('wp:woocommerce/');
    L('');
    L('  >>> TIPAS: '+(isBlocks?'WooCommerce BLOCKS':'KLASIKINIS (shortcode)'));
  }catch(e){ L('  parse err'); }
}
L('');
L('=== Order-received (thankyou) endpoint ===');
const s = req('https://dev.avesa.lt/wp-json/wc/v3/system_status');
if(s.code==='200'){
  try{
    const j=JSON.parse(s.body);
    L('  Permalinks:');
    L('    product base: '+(j.settings?.product_permalinks?.product_base||'?'));
    L('    category base: '+(j.settings?.product_permalinks?.category_base||'?'));
    L('  API enabled: '+j.settings?.api_enabled);
    L('  Currency: '+j.settings?.currency+' ('+j.settings?.currency_symbol+')');
    L('  Taxes enabled: '+j.settings?.taxes_enabled);
    L('  Force SSL: '+j.settings?.force_ssl);
    L('');
    L('  Active plugins ('+((j.active_plugins||[]).length)+'):');
    for(const p of (j.active_plugins||[])) L('    '+p.name+' v'+p.version);
  }catch(e){ L('  parse err'); }
}
putFile('e6_recon2.txt', out); console.log(out);
