process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import { chromium } from 'playwright';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const out={};
async function irasyk(){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/ban9.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const body={message:'rez',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) body.sha=sha;
  await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/ban9.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
}
async function api(path,opt={}){ const r=await fetch(WP+path,{...opt,headers:{Authorization:AUTH,'Content-Type':'application/json',...(opt.headers||{})}}); return {s:r.status,t:await r.text()}; }
try{
const upd = await api('/wp-json/code-snippets/v1/snippets/560', {method:'POST',
  body: JSON.stringify({id:560, name:'Petshop Rinkinio CTA Banneris kategorijose v9', code: "// Petshop Rinkinio CTA Banneris kategorijose v9\n// v9 = v7 ATSTATYTAS. Vienintelis skirtumas nuo v7: d\u0117\u017e\u0117 randama pagal grup\u0119\n//      (Petshop_Laukai::iejimas), o ne pagal \u012fra\u0161yt\u0105 prek\u0117s ID \u2014 v7 rod\u0117 \u012f\n//      34207/34217, ir toms prek\u0117ms nustojus b\u016bti publish blokas tyliai\n//      dingdavo i\u0161 kategorij\u0173 (rasta 2026-08-15).\n//      Dizainas, tekstai ir mygtukai \u2014 kaip v7/v1: gradientas, sub eilut\u0117,\n//      baltas mygtukas + r\u0117melio mygtukas \u201eParuo\u0161ti\u2026\".\nadd_action('woocommerce_before_shop_loop', function(){\n    if (!function_exists('is_product_category') || !is_product_category()) return;\n    $term = get_queried_object();\n    if (!$term || empty($term->slug)) return;\n\n    $map = array(\n        'konservai-sunims' => array(\n            'title' => 'Konserv\u0173 rinkiniai \u2013 papras\u010diau i\u0161sirinkti',\n            'text'  => 'Rinkis jau paruo\u0161t\u0105 skoni\u0173 rinkin\u012f arba susid\u0117k savo d\u0117\u017e\u0119 i\u0161 m\u0117gstam\u0173 konserv\u0173.',\n            'grupe' => 'kons_sunims',\n            'etikete' => '\ud83c\udf81 Susid\u0117k pats',\n            'prepared' => array('Paruo\u0161ti konserv\u0173 rinkiniai', 'konservu-rinkiniai'),\n        ),\n        'konservai-katems' => array(\n            'title' => 'Konserv\u0173 rinkiniai \u2013 papras\u010diau i\u0161sirinkti',\n            'text'  => 'Rinkis jau paruo\u0161t\u0105 skoni\u0173 rinkin\u012f arba susid\u0117k savo d\u0117\u017e\u0119 i\u0161 m\u0117gstam\u0173 konserv\u0173.',\n            'grupe' => 'kons_kates',\n            'etikete' => '\ud83c\udf81 Susid\u0117k pats',\n            'prepared' => array('Paruo\u0161ti konserv\u0173 rinkiniai', 'konservu-rinkiniai'),\n        ),\n        'skanestai-sunims' => array(\n            'title' => 'Skan\u0117st\u0173 ir kramtal\u0173 rinkiniai \u2013 papras\u010diau i\u0161sirinkti',\n            'text'  => 'Susid\u0117k savo skan\u0117st\u0173 ar kramtal\u0173 rinkin\u012f arba rinkis jau paruo\u0161tus variantus.',\n            'grupe' => 'sunys',\n            'etikete' => '\ud83c\udf81 Susid\u0117k skan\u0117st\u0173 rinkin\u012f',\n            'antra_grupe' => 'kramtalai',\n            'antra_etikete' => '\ud83e\uddb4 Susid\u0117k kramtal\u0173 rinkin\u012f',\n            'prepared' => array('Paruo\u0161ti skan\u0117st\u0173 rinkiniai', 'skanestu-rinkiniai'),\n        ),\n        'skanestai-katems' => array(\n            'title' => 'Skan\u0117st\u0173 rinkiniai \u2013 papras\u010diau i\u0161sirinkti',\n            'text'  => 'Rinkis jau paruo\u0161t\u0105 rinkin\u012f arba susid\u0117k savo d\u0117\u017e\u0119 i\u0161 m\u0117gstam\u0173 skan\u0117st\u0173.',\n            'grupe' => 'kates',\n            'etikete' => '\ud83c\udf81 Susid\u0117k pats',\n            'prepared' => array('Paruo\u0161ti skan\u0117st\u0173 rinkiniai', 'skanestu-rinkiniai'),\n        ),\n    );\n    if (!isset($map[$term->slug])) return;\n    $cfg = $map[$term->slug];\n\n    $btns = '';\n    $deze = function($grupe) {\n        if (!class_exists('Petshop_Laukai')) return 0;\n        $id = Petshop_Laukai::iejimas($grupe);\n        return ($id && get_post_status($id) === 'publish') ? $id : 0;\n    };\n    $id1 = $deze($cfg['grupe']);\n    if ($id1) {\n        $u = get_permalink($id1);\n        if ($u) $btns .= '<a href=\"'.esc_url($u).'\" class=\"psc-cta-btn\">'.esc_html($cfg['etikete']).'</a>';\n    }\n    if (!empty($cfg['antra_grupe'])) {\n        $id2 = $deze($cfg['antra_grupe']);\n        if ($id2) {\n            $u2 = get_permalink($id2);\n            if ($u2) $btns .= '<a href=\"'.esc_url($u2).'\" class=\"psc-cta-btn\">'.esc_html($cfg['antra_etikete']).'</a>';\n        }\n    }\n    if (!$btns) return;\n\n    $prep_btn = '';\n    if (!empty($cfg['prepared'])) {\n        $pt = get_term_by('slug', $cfg['prepared'][1], 'product_cat');\n        if ($pt) {\n            $purl = get_term_link($pt);\n            if (!is_wp_error($purl)) {\n                $prep_btn = '<a href=\"'.esc_url($purl).'\" class=\"psc-cta-btn psc-cta-btn-outline\">'.esc_html($cfg['prepared'][0]).'</a>';\n            }\n        }\n    }\n\n    static $rendered = false; if ($rendered) return; $rendered = true;\n\n    echo '<div class=\"psc-cta-banner\">';\n    echo   '<div class=\"psc-cta-text\">';\n    echo     '<span class=\"psc-cta-title\">'.esc_html($cfg['title']).'</span>';\n    echo     '<span class=\"psc-cta-sub\">'.esc_html($cfg['text']).'</span>';\n    echo   '</div>';\n    echo   '<div class=\"psc-cta-btns\">'.$btns.$prep_btn.'</div>';\n    echo '</div>';\n    ?>\n    <style>\n    .psc-cta-banner{\n        display:flex; align-items:center; justify-content:space-between; gap:20px; flex-wrap:wrap;\n        background:linear-gradient(135deg,#3a6b46,#2f5a3a); color:#fff;\n        border-radius:14px; padding:20px 26px; margin:0 0 26px;\n        box-shadow:0 4px 16px rgba(47,90,58,.18);\n    }\n    .psc-cta-text{ display:flex; flex-direction:column; gap:4px; }\n    .psc-cta-title{ font-size:20px; font-weight:700; line-height:1.2; }\n    .psc-cta-sub{ font-size:14px; opacity:.92; }\n    .psc-cta-btns{ display:flex; gap:10px; flex-wrap:wrap; }\n    .psc-cta-btn{\n        display:inline-block; background:#fff; color:#2f5a3a !important;\n        font-weight:700; font-size:14px; text-decoration:none;\n        padding:11px 20px; border-radius:9px; white-space:nowrap;\n        transition:transform .12s ease, box-shadow .12s ease;\n    }\n    .psc-cta-btn:hover{ transform:translateY(-2px); box-shadow:0 4px 12px rgba(0,0,0,.18); color:#2f5a3a !important; }\n    .psc-cta-btn-outline{\n        background:transparent; color:#fff !important; border:2px solid rgba(255,255,255,.7);\n        padding:9px 18px;\n    }\n    .psc-cta-btn-outline:hover{ background:rgba(255,255,255,.12); color:#fff !important; }\n    @media (max-width:600px){\n        .psc-cta-banner{ flex-direction:column; align-items:flex-start; text-align:left; }\n        .psc-cta-btn{ width:100%; text-align:center; }\n        .psc-cta-btns{ width:100%; }\n    }\n    </style>\n    <?php\n}, 15);\n", active:true, scope:'global'})});
out.atnaujinta = { http: upd.s, pav:(()=>{try{return JSON.parse(upd.t).name;}catch(e){return upd.t.slice(0,100);}})() };
await new Promise(r=>setTimeout(r,5000));
const br = await chromium.launch({args:['--no-sandbox','--ignore-certificate-errors']});
const ctx = await br.newContext({httpCredentials:{username:process.env.WP_USER,password:process.env.WP_APP_PASS},ignoreHTTPSErrors:true,viewport:{width:1500,height:1000}});
const page = await ctx.newPage();
const puslapiai = {
  'konservai-sunims':'/kategorija/sunims/maistas-sunims/konservai-sunims/',
  'skanestai-sunims':'/kategorija/sunims/skanestai-sunims/',
  'skanestai-katems':'/kategorija/katems/skanestai-katems/'
};
out.rez={};
for (const [pav,kelias] of Object.entries(puslapiai)) {
  await page.goto(WP+kelias,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(3000);
  await page.evaluate(()=>{ var c=document.querySelector('.cmplz-cookiebanner'); if(c) c.remove(); });
  const b = page.locator('.psc-cta-banner');
  out.rez[pav] = {
    yra: await b.count(),
    antraste: await page.locator('.psc-cta-title').textContent().catch(()=>''),
    sub: await page.locator('.psc-cta-sub').textContent().catch(()=>''),
    mygtukai: await page.locator('.psc-cta-btn').allTextContents(),
    fonas: await page.evaluate(()=>{var e=document.querySelector('.psc-cta-banner');return e?getComputedStyle(e).backgroundImage.slice(0,60):'';}),
    seselis: await page.evaluate(()=>{var e=document.querySelector('.psc-cta-banner');return e?getComputedStyle(e).boxShadow.slice(0,40):'';})
  };
  if (pav==='konservai-sunims') {
    const sh = await page.screenshot({fullPage:false});
    let sha=null;
    try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/ban9.png`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
    const bo={message:'shot',content:sh.toString('base64')}; if(sha) bo.sha=sha;
    await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/ban9.png`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(bo)});
  }
}
await br.close();
}catch(e){ out.bendra=String(e).slice(0,250); }
await irasyk();
console.log('ok');
