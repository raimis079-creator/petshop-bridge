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
// Petshop MnM Rinkinio Dizainas v1 (Vitrinos stilius)
add_action('wp_loaded', function () {
    if ( ! function_exists('is_product') ) return;
    add_action('wp_head', function () {
        if ( ! is_product() ) return;
        global $post;
        if ( ! $post || $post->ID !== 34153 ) return;
        ?>
<style id="petshop-mnm-vitrine">
/* Rinkinio kortelės stilius - vitrinos vaizdas */
.single-product.postid-34153 .mnm_child_products,
.single-product.postid-34153 form.cart .mnm_form_content,
.single-product.postid-34153 form.cart > table {
    border: none !important;
    margin: 0 0 1.5rem !important;
}
/* Pavadinimai PRODUCT/QUANTITY - paslepiam */
.single-product.postid-34153 .mnm_child_products thead,
.single-product.postid-34153 form.cart thead {
    display: none !important;
}
/* Tinklelis kortelėms */
.single-product.postid-34153 .mnm_child_products tbody,
.single-product.postid-34153 form.cart tbody {
    display: grid !important;
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 14px !important;
    border: none !important;
    background: transparent !important;
}
@media (max-width: 720px) {
    .single-product.postid-34153 .mnm_child_products tbody,
    .single-product.postid-34153 form.cart tbody {
        grid-template-columns: 1fr !important;
    }
}
/* Kiekviena eilutė -> kortelė */
.single-product.postid-34153 .mnm_child_products tbody tr,
.single-product.postid-34153 form.cart tbody tr {
    display: flex !important;
    flex-direction: column !important;
    background: #fff !important;
    border: 1px solid #ececec !important;
    border-radius: 10px !important;
    padding: 14px !important;
    margin: 0 !important;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04) !important;
    transition: box-shadow .2s, transform .2s;
}
.single-product.postid-34153 .mnm_child_products tbody tr:hover {
    box-shadow: 0 3px 12px rgba(0,0,0,0.08) !important;
    transform: translateY(-1px);
}
/* Cell -> blokas viduje */
.single-product.postid-34153 .mnm_child_products tbody td,
.single-product.postid-34153 form.cart tbody td {
    display: block !important;
    border: none !important;
    padding: 0 !important;
    width: 100% !important;
    text-align: left !important;
}
/* Nuotrauka - didelė, viršuje */
.single-product.postid-34153 .mnm_child_products tbody td.product-thumbnail,
.single-product.postid-34153 form.cart tbody td:first-child {
    margin-bottom: 10px !important;
    text-align: center !important;
}
.single-product.postid-34153 .mnm_child_products tbody td img,
.single-product.postid-34153 form.cart tbody td img {
    width: 100% !important;
    max-width: 200px !important;
    height: auto !important;
    aspect-ratio: 1/1 !important;
    object-fit: contain !important;
    background: #fafafa !important;
    border-radius: 8px !important;
    margin: 0 auto !important;
    display: block !important;
}
/* Pavadinimas */
.single-product.postid-34153 .mnm_child_products tbody td.product-name,
.single-product.postid-34153 form.cart tbody td:nth-child(2) {
    font-size: 13.5px !important;
    line-height: 1.4 !important;
    color: #2c2c2c !important;
    font-weight: 500 !important;
    margin-bottom: 8px !important;
    min-height: 56px !important;
}
.single-product.postid-34153 .mnm_child_products tbody td.product-name a,
.single-product.postid-34153 form.cart tbody td:nth-child(2) a {
    color: #2c2c2c !important;
    text-decoration: none !important;
}
.single-product.postid-34153 .mnm_child_products tbody td.product-name a:hover,
.single-product.postid-34153 form.cart tbody td:nth-child(2) a:hover {
    color: #b29051 !important;
}
/* Likučio žyma - subtili */
.single-product.postid-34153 .stock,
.single-product.postid-34153 .in-stock {
    font-size: 11px !important;
    color: #6a9954 !important;
    font-weight: 400 !important;
    margin: 4px 0 8px !important;
    text-transform: uppercase !important;
    letter-spacing: 0.04em !important;
}
.single-product.postid-34153 .out-of-stock,
.single-product.postid-34153 .stock.out-of-stock {
    color: #b86060 !important;
}
/* Kiekio input -> mažas, subtilus, kortelės apačioje */
.single-product.postid-34153 .mnm_child_products tbody td.product-quantity,
.single-product.postid-34153 form.cart tbody td:last-child {
    margin-top: auto !important;
    padding-top: 10px !important;
    border-top: 1px dashed #ececec !important;
    text-align: center !important;
}
.single-product.postid-34153 .quantity {
    display: inline-flex !important;
    align-items: center !important;
    gap: 4px !important;
    margin: 0 auto !important;
}
.single-product.postid-34153 input.qty {
    width: 44px !important;
    height: 32px !important;
    text-align: center !important;
    font-size: 14px !important;
    border: 1px solid #d8d8d8 !important;
    border-radius: 5px !important;
    background: #fff !important;
    padding: 0 4px !important;
}
.single-product.postid-34153 .plus,
.single-product.postid-34153 .minus,
.single-product.postid-34153 .quantity button {
    width: 28px !important;
    height: 32px !important;
    background: #f5f5f5 !important;
    border: 1px solid #d8d8d8 !important;
    border-radius: 5px !important;
    color: #555 !important;
    font-size: 14px !important;
    cursor: pointer !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
}
/* Pridėk etiketę "Kiekis" prie input */
.single-product.postid-34153 .mnm_child_products tbody td.product-quantity::before,
.single-product.postid-34153 form.cart tbody td:last-child::before {
    content: "Kiekis";
    display: block;
    font-size: 10px;
    color: #999;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 6px;
}
/* Skaitiklis + total + add to cart - paryškinta apačia */
.single-product.postid-34153 .mnm_price_container,
.single-product.postid-34153 .mnm_message,
.single-product.postid-34153 .mnm_status,
.single-product.postid-34153 .single_add_to_cart_button {
    margin-top: 1rem !important;
}
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
    width: 100% !important;
    transition: background .2s;
}
.single-product.postid-34153 .single_add_to_cart_button:hover:not(:disabled) {
    background: #9a7c44 !important;
}
.single-product.postid-34153 .single_add_to_cart_button:disabled {
    background: #d8d8d8 !important;
    color: #888 !important;
    cursor: not-allowed !important;
}
/* Skaitiklis "You have selected X / 6" - lokalizuojam ir paryškinam */
.single-product.postid-34153 .mnm_price_container,
.single-product.postid-34153 .mnm_message {
    font-size: 14px !important;
    color: #555 !important;
    padding: 10px 14px !important;
    background: #fafafa !important;
    border-radius: 6px !important;
    text-align: center !important;
}
/* Kainos skaitiklis viršuje */
.single-product.postid-34153 p.price,
.single-product.postid-34153 .price {
    font-size: 28px !important;
    font-weight: 500 !important;
    color: #2c2c2c !important;
}
/* "PRODUCT" "QUANTITY" antraščių paslėpimas, jei vis tiek lieka kažkur */
.single-product.postid-34153 .mnm_child_products th {
    display: none !important;
}
</style>
<?php
    }, 99);
}, 5);
`;

(async()=>{
  const out={ts:new Date().toISOString()};
  // 1. cleanup TEMP probe snippets if jie liko
  for(const sid of [522,523]){
    exec('curl -sk -X POST -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/'+sid+'/deactivate"');
    const d=exec('curl -sk -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/'+sid+'"');
    out['cleanup_'+sid]=d.slice(0,80);
  }
  // 2. create the design snippet
  const cr = api('POST','/wp-json/code-snippets/v1/snippets', {
    name:'Petshop MnM Rinkinio Dizainas v1 (Vitrinos stilius)',
    code: SNIPPET_CODE,
    desc:'CSS rinkiniui 34153 - vitrinos vaizdas, gražūs kortelės su nuotraukomis',
    scope: 'global',
    active: true
  });
  out.snippet_id = cr && cr.id;
  out.snippet_active = cr && cr.active;
  out.snippet_err = cr && (cr.code || cr.__raw);
  commit('design_snippet.json', JSON.stringify(out,null,1));
  console.log("DONE snip="+out.snippet_id);
})();
