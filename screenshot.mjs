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
// Petshop MnM Rinkinio Vitrina v2 (Stabilus rinkinys, ne pikeris)
add_action('wp_loaded', function () {
    if ( ! function_exists('is_product') ) return;
    add_action('wp_head', function () {
        if ( ! is_product() ) return;
        global $post;
        if ( ! $post || $post->ID !== 34153 ) return;
        ?>
<style id="petshop-mnm-vitrine">
/* === STABILUS RINKINYS - jokio pikerio === */

/* Tinklelis su nuotraukomis */
.single-product.postid-34153 .mnm_child_products,
.single-product.postid-34153 form.cart > table,
.single-product.postid-34153 form.cart .mnm_form_content {
    border: none !important;
    margin: 0 0 1.5rem !important;
}
.single-product.postid-34153 .mnm_child_products thead,
.single-product.postid-34153 form.cart thead,
.single-product.postid-34153 .mnm_child_products th {
    display: none !important;
}
.single-product.postid-34153 .mnm_child_products tbody,
.single-product.postid-34153 form.cart tbody {
    display: grid !important;
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 14px !important;
    border: none !important;
    background: transparent !important;
}
@media (max-width: 900px) {
    .single-product.postid-34153 .mnm_child_products tbody,
    .single-product.postid-34153 form.cart tbody {
        grid-template-columns: repeat(2, 1fr) !important;
    }
}
@media (max-width: 480px) {
    .single-product.postid-34153 .mnm_child_products tbody,
    .single-product.postid-34153 form.cart tbody {
        grid-template-columns: 1fr !important;
    }
}
.single-product.postid-34153 .mnm_child_products tbody tr,
.single-product.postid-34153 form.cart tbody tr {
    display: flex !important;
    flex-direction: column !important;
    background: #fff !important;
    border: 1px solid #ececec !important;
    border-radius: 10px !important;
    padding: 12px !important;
    margin: 0 !important;
    position: relative !important;
}
.single-product.postid-34153 .mnm_child_products tbody td,
.single-product.postid-34153 form.cart tbody td {
    display: block !important;
    border: none !important;
    padding: 0 !important;
    width: 100% !important;
    text-align: center !important;
    background: transparent !important;
}
.single-product.postid-34153 .mnm_child_products tbody td.product-thumbnail,
.single-product.postid-34153 form.cart tbody td:first-child {
    margin-bottom: 10px !important;
}
.single-product.postid-34153 .mnm_child_products tbody td img,
.single-product.postid-34153 form.cart tbody td img {
    width: 100% !important;
    max-width: 180px !important;
    aspect-ratio: 1/1 !important;
    object-fit: contain !important;
    background: #fafafa !important;
    border-radius: 8px !important;
    margin: 0 auto !important;
    display: block !important;
}
.single-product.postid-34153 .mnm_child_products tbody td.product-name,
.single-product.postid-34153 form.cart tbody td:nth-child(2) {
    font-size: 13px !important;
    line-height: 1.4 !important;
    color: #2c2c2c !important;
    font-weight: 500 !important;
    text-align: center !important;
}
.single-product.postid-34153 .mnm_child_products tbody td.product-name a,
.single-product.postid-34153 form.cart tbody td:nth-child(2) a {
    color: #2c2c2c !important;
    text-decoration: none !important;
}
/* "×1" žymelė vietoj input'o */
.single-product.postid-34153 .mnm_child_products tbody tr::after {
    content: "× 1";
    position: absolute;
    top: 10px;
    right: 10px;
    background: #b29051;
    color: #fff;
    font-size: 11px;
    font-weight: 600;
    padding: 3px 9px;
    border-radius: 12px;
    line-height: 1;
}

/* === SLĖPIAM VISKĄ, KAS RODO "PIKERĮ" === */

/* Kiekio input + +/- mygtukai - paslepiam visiškai */
.single-product.postid-34153 .mnm_child_products tbody td.product-quantity,
.single-product.postid-34153 form.cart tbody td:last-child,
.single-product.postid-34153 .mnm_child_products .quantity,
.single-product.postid-34153 form.cart .mnm_child_products input.qty,
.single-product.postid-34153 form.cart .mnm_child_products .plus,
.single-product.postid-34153 form.cart .mnm_child_products .minus {
    display: none !important;
    visibility: hidden !important;
    width: 0 !important;
    height: 0 !important;
    overflow: hidden !important;
}

/* Skaitiklis "You have selected X items..." - paslepiam */
.single-product.postid-34153 .mnm_price_container,
.single-product.postid-34153 .mnm_message,
.single-product.postid-34153 .mnm_status,
.single-product.postid-34153 .mnm_container_status,
.single-product.postid-34153 .mnm_container_message,
.single-product.postid-34153 form.cart .stock-out,
.single-product.postid-34153 form.cart > p:not(.price):not(.cart):not(.stock) {
    display: none !important;
}

/* Pagrindinis kiekio input prie "Į krepšelį" - paliekam (kiek RINKINIŲ pirkti) */
.single-product.postid-34153 form.cart > .quantity {
    display: inline-flex !important;
    margin-right: 10px !important;
}

/* Kainos formatas */
.single-product.postid-34153 p.price,
.single-product.postid-34153 .price {
    font-size: 28px !important;
    font-weight: 500 !important;
    color: #2c2c2c !important;
    margin-bottom: 1rem !important;
}

/* Į krepšelį mygtukas - paryškintas, aktyvus */
.single-product.postid-34153 .single_add_to_cart_button {
    background: #b29051 !important;
    color: #fff !important;
    font-size: 16px !important;
    font-weight: 500 !important;
    padding: 14px 28px !important;
    border-radius: 6px !important;
    border: none !important;
    text-transform: none !important;
    letter-spacing: 0 !important;
    opacity: 1 !important;
    cursor: pointer !important;
}
.single-product.postid-34153 .single_add_to_cart_button:hover {
    background: #9a7c44 !important;
}
.single-product.postid-34153 .single_add_to_cart_button.disabled,
.single-product.postid-34153 .single_add_to_cart_button:disabled {
    opacity: 1 !important;
    background: #b29051 !important;
    color: #fff !important;
    cursor: pointer !important;
    pointer-events: auto !important;
}
</style>
<script id="petshop-mnm-vitrine-js">
(function(){
    function fillRinkinys(){
        // 1. Užpildyk visus komponentų kiekius į 1
        var inputs = document.querySelectorAll('.mnm_child_products input.qty, form.cart .mnm_child_products input[type="number"]');
        if(!inputs.length) return false;
        inputs.forEach(function(inp){
            inp.value = '1';
            // Trigger input + change events, kad MnM JS supdate'intų skaitiklį
            try{ inp.dispatchEvent(new Event('input', {bubbles:true})); }catch(e){}
            try{ inp.dispatchEvent(new Event('change', {bubbles:true})); }catch(e){}
            try{ if(window.jQuery) jQuery(inp).trigger('change').trigger('input'); }catch(e){}
        });
        // 2. Aktyvuok "Į krepšelį" mygtuką
        var btn = document.querySelector('.single_add_to_cart_button');
        if(btn){
            btn.disabled = false;
            btn.classList.remove('disabled');
            btn.removeAttribute('disabled');
        }
        return true;
    }

    // bandom keletą kartų, nes MnM gali lėtai initialize'tis
    var tries = 0;
    var iv = setInterval(function(){
        tries++;
        var ok = fillRinkinys();
        if(ok || tries > 20){ clearInterval(iv); }
    }, 200);

    // ir dar kartą po DOMContentLoaded ir po load
    if (document.readyState === 'loading'){
        document.addEventListener('DOMContentLoaded', function(){ setTimeout(fillRinkinys, 100); setTimeout(fillRinkinys, 500); setTimeout(fillRinkinys, 1500); });
    } else {
        setTimeout(fillRinkinys, 100);
        setTimeout(fillRinkinys, 500);
        setTimeout(fillRinkinys, 1500);
    }
    window.addEventListener('load', function(){ setTimeout(fillRinkinys, 300); setTimeout(fillRinkinys, 1000); });

    // Jeigu klientas kažkaip pakeistų kiekį - grąžinam į 1
    document.addEventListener('change', function(e){
        if(e.target && e.target.matches('.mnm_child_products input.qty')){
            if(e.target.value !== '1' && e.target.value !== 1){
                e.target.value = '1';
                try{ if(window.jQuery) jQuery(e.target).trigger('change'); }catch(err){}
            }
        }
    });
})();
</script>
<?php
    }, 99);
}, 5);
`;

(async()=>{
  const out={ts:new Date().toISOString()};
  // update snippet 524
  const u = api('PUT','/wp-json/code-snippets/v1/snippets/524', {
    name:'Petshop MnM Rinkinio Vitrina v2 (Stabilus rinkinys, ne pikeris)',
    code: SNIPPET_CODE,
    desc:'CSS+JS rinkiniui 34153: auto-fill 6/6, slepia pikerį, vitrinos vaizdas',
    scope: 'global',
    active: true
  });
  out.update_ret = u && (u.id ? 'updated id='+u.id+' active='+u.active : (u.code||u.__raw||'?'));
  // verify
  const g = api('GET','/wp-json/code-snippets/v1/snippets/524');
  out.verify = g && {id:g.id, active:g.active, name:(g.name||'').slice(0,60), code_len:(g.code||'').length};
  commit('design_v2.json', JSON.stringify(out,null,1));
  console.log("DONE");
})();
