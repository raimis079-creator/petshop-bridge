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

const SNIPPET_CODE = `<?php
// Petshop UI Lokalizacija LT v1
// Verčia WooCommerce + Mix and Match angliškus tekstus į lietuvių kalbą.
// Kontekstinis vertimas — "Add to cart" / "Select options" pagal produkto tipą.

// === A) Pridėti į krepšelį mygtukas KATEGORIJOS kortelėje (loop) ===
add_filter('woocommerce_product_add_to_cart_text', function($text, $product){
    if ( ! $product ) return $text;
    $type = $product->get_type();
    if ( $type === 'mix-and-match' ) {
        return 'Į krepšelį'; // mūsų rinkiniai - be pasirinkimo
    }
    if ( $type === 'variable' ) {
        return 'Pasirinkti'; // variable produktai - reikia pasirinkti
    }
    if ( $type === 'grouped' ) {
        return 'Peržiūrėti';
    }
    if ( $type === 'external' ) {
        return 'Pirkti'; // external produktai (affiliate)
    }
    // simple - default
    return 'Į krepšelį';
}, 10, 2);

// === B) Pagrindinis "Add to cart" mygtukas PRODUKTO PUSLAPYJE ===
add_filter('woocommerce_product_single_add_to_cart_text', function($text, $product){
    if ( ! $product ) return $text;
    return 'Į krepšelį';
}, 10, 2);

// === C) MnM ir WC tekstai per gettext ===
add_filter('gettext', function($translation, $text, $domain){
    // Mix and Match plėtinio tekstai
    if ( $domain === 'wc_mnm' || $domain === 'woocommerce-mix-and-match-products' ) {
        $mnm_translations = array(
            'Clear selections' => 'Atstatyti',
            'Please select %s items.' => 'Pasirinkite %s prekes.',
            'Please select %1\\$s or fewer items.' => 'Pasirinkite %1\\$s arba mažiau prekių.',
            'Please select %1\\$s or more items.' => 'Pasirinkite %1\\$s arba daugiau prekių.',
            'Please select between %1\\$s and %2\\$s items.' => 'Pasirinkite nuo %1\\$s iki %2\\$s prekių.',
            'You have selected %s items.' => 'Pasirinkote %s prekes.',
            'You have selected 1 item.' => 'Pasirinkote 1 prekę.',
            'You have selected %s item.' => 'Pasirinkote %s prekę.',
            'You have selected 0 items. Please select %s items to continue&hellip;' => 'Pasirinkite %s prekes.',
            'You have selected 0 items. Please select %s items to continue...' => 'Pasirinkite %s prekes.',
            'Out of stock' => 'Nėra sandėlyje',
            'Optional' => 'Pasirenkamas',
            'remove' => 'pašalinti',
        );
        if ( isset($mnm_translations[$text]) ) {
            return $mnm_translations[$text];
        }
    }
    // WooCommerce core tekstai (jei dar neišversti)
    if ( $domain === 'woocommerce' ) {
        $wc_translations = array(
            'Add to cart' => 'Į krepšelį',
            'Select options' => 'Pasirinkti',
            'Read more' => 'Skaityti daugiau',
        );
        if ( isset($wc_translations[$text]) ) {
            return $wc_translations[$text];
        }
    }
    return $translation;
}, 20, 3);

// === D) gettext_with_context — kai kurios MnM eilutės naudoja context ===
add_filter('gettext_with_context', function($translation, $text, $context, $domain){
    if ( $domain === 'wc_mnm' || $domain === 'woocommerce-mix-and-match-products' ) {
        if ( $text === 'Clear selections' ) return 'Atstatyti';
    }
    return $translation;
}, 20, 4);
`;

(async()=>{
  const out={ts:new Date().toISOString()};
  // sukuriu naują snippet'ą (ne pridėju prie 524, kad būtų atskira sritis)
  const cr = api('POST','/wp-json/code-snippets/v1/snippets', {
    name:'Petshop UI Lokalizacija LT v1',
    code: SNIPPET_CODE,
    desc:'Lokalizuoja WC + MnM angliškus tekstus į LT (kontekstinis vertimas pagal produkto tipą)',
    scope: 'global',
    active: true
  });
  out.created = cr && cr.id ? {id:cr.id, active:cr.active, name:cr.name, code_len:(cr.code||'').length} : (cr.__raw||cr.code||'?');
  commit('lt_snippet.json', JSON.stringify(out,null,1));
  console.log("DONE id="+(cr && cr.id));
})();
