process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const out={};
async function irasyk(){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/ban.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const body={message:'rez',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) body.sha=sha;
  await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/ban.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
}
async function api(path,opt={}){ const r=await fetch(WP+path,{...opt,headers:{Authorization:AUTH,'Content-Type':'application/json',...(opt.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(name,code){ const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name,code,scope:'global',active:true,priority:5})}); let id=null; try{ id=JSON.parse(cr.t).id; }catch(e){} return id; }
async function off(id){ if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }
try{
/* 1) modulis */
const b64 = fs.readFileSync('deploy/petshop-laukai.php').toString('base64');
const sS = await snip('TEMP SET 141', `add_action('wp_loaded', function(){
	if ((\$_GET['ps_s141'] ?? '') !== 'S141x') return;
	update_option('ps_l_b64_141','${b64}',false);
	header('Content-Type: application/json'); echo wp_json_encode(array('ok'=>1)); exit; }, 131);`);
await new Promise(r=>setTimeout(r,4500));
try{ out.set = await (await fetch(WP+'/?ps_s141=S141x')).json(); }catch(e){}
await off(sS); await new Promise(r=>setTimeout(r,3000));
const sD = await snip('TEMP DEP 141', `add_action('wp_loaded', function(){
	if ((\$_GET['ps_d141'] ?? '') !== 'D141x') return;
	\$o=array(); \$b=get_option('ps_l_b64_141');
	if(!\$b){ \$o['klaida']='tuscia'; }
	else { \$k=base64_decode(\$b);
		try { token_get_all(\$k, TOKEN_PARSE); \$o['sintakse']='OK';
			\$kl=WPMU_PLUGIN_DIR.'/petshop-laukai.php';
			file_put_contents(\$kl,\$k); clearstatcache(true,\$kl);
			\$o['sutampa']=(md5_file(\$kl)===md5(\$k));
		} catch (ParseError \$e){ \$o['sintakse']='KLAIDA: '.\$e->getMessage(); }
		delete_option('ps_l_b64_141'); }
	header('Content-Type: application/json'); echo wp_json_encode(\$o); exit; }, 131);`);
await new Promise(r=>setTimeout(r,4500));
try{ out.diegimas = await (await fetch(WP+'/?ps_d141=D141x')).json(); }catch(e){}
await off(sD); await new Promise(r=>setTimeout(r,2500));

/* 2) snippet 560 atnaujinimas i v8 */
const kodas = "// Petshop Rinkinio CTA Banneris kategorijose v8\n// v8: d\u0117\u017e\u0117 randama PAGAL GRUP\u0118 (Petshop_Laukai::iejimas), ne pagal \u012fra\u0161yt\u0105 ID.\n//     Prie\u017eastis: v7 rod\u0117 \u012f 34207/34217; toms prek\u0117ms nustojus b\u016bti publish\n//     blokas tyliai dingdavo i\u0161 kategorijos (rasta 2026-08-15).\n//     Vienas \u012f\u0117jimas vienai kategorijai \u2014 dyd\u017eius ir poreikius klientas\n//     renkasi jau vitrinoje.\nadd_action('woocommerce_before_shop_loop', function(){\n    if (!function_exists('is_product_category') || !is_product_category()) return;\n    $term = get_queried_object();\n    if (!$term || empty($term->slug)) return;\n\n    $map = array(\n        'konservai-sunims' => array(\n            'grupe' => 'kons_sunims',\n            'title' => 'Konserv\u0173 rinkiniai \u2013 papras\u010diau i\u0161sirinkti',\n            'text'  => 'Rinkis jau paruo\u0161t\u0105 skoni\u0173 rinkin\u012f arba susid\u0117k savo d\u0117\u017e\u0119 i\u0161 m\u0117gstam\u0173 konserv\u0173.',\n            'mygtukas' => 'Susid\u0117k konserv\u0173 rinkin\u012f \u0161unims',\n            'prepared' => array('Paruo\u0161ti konserv\u0173 rinkiniai', 'konservu-rinkiniai'),\n        ),\n        'konservai-katems' => array(\n            'grupe' => 'kons_kates',\n            'title' => 'Konserv\u0173 rinkiniai \u2013 papras\u010diau i\u0161sirinkti',\n            'text'  => 'Rinkis jau paruo\u0161t\u0105 skoni\u0173 rinkin\u012f arba susid\u0117k savo d\u0117\u017e\u0119 i\u0161 m\u0117gstam\u0173 konserv\u0173.',\n            'mygtukas' => 'Susid\u0117k konserv\u0173 rinkin\u012f kat\u0117ms',\n            'prepared' => array('Paruo\u0161ti konserv\u0173 rinkiniai', 'konservu-rinkiniai'),\n        ),\n        'skanestai-sunims' => array(\n            'grupe' => 'sunys',\n            'title' => 'Skan\u0117st\u0173 rinkiniai \u2013 papras\u010diau i\u0161sirinkti',\n            'text'  => 'Susid\u0117k savo skan\u0117st\u0173 d\u0117\u017e\u0119 arba rinkis jau paruo\u0161tus variantus.',\n            'mygtukas' => 'Susid\u0117k skan\u0117st\u0173 rinkin\u012f \u0161unims',\n            'prepared' => array('Paruo\u0161ti skan\u0117st\u0173 rinkiniai', 'skanestu-rinkiniai'),\n        ),\n        'skanestai-katems' => array(\n            'grupe' => 'kates',\n            'title' => 'Skan\u0117st\u0173 rinkiniai \u2013 papras\u010diau i\u0161sirinkti',\n            'text'  => 'Rinkis jau paruo\u0161t\u0105 rinkin\u012f arba susid\u0117k savo d\u0117\u017e\u0119 i\u0161 m\u0117gstam\u0173 skan\u0117st\u0173.',\n            'mygtukas' => 'Susid\u0117k skan\u0117st\u0173 rinkin\u012f kat\u0117ms',\n            'prepared' => array('Paruo\u0161ti skan\u0117st\u0173 rinkiniai', 'skanestu-rinkiniai'),\n        ),\n        'kramtalai-sunims' => array(\n            'grupe' => 'kramtalai',\n            'title' => 'Kramtal\u0173 rinkiniai \u2013 papras\u010diau i\u0161sirinkti',\n            'text'  => 'Susid\u0117k savo kramtal\u0173 d\u0117\u017e\u0119 arba rinkis jau paruo\u0161tus variantus.',\n            'mygtukas' => 'Susid\u0117k kramtal\u0173 rinkin\u012f',\n            'prepared' => array('Paruo\u0161ti kramtal\u0173 rinkiniai', 'kramtalu-rinkiniai'),\n        ),\n    );\n    if (!isset($map[$term->slug])) return;\n    $cfg = $map[$term->slug];\n\n    // D\u0117\u017e\u0117 pagal grup\u0119. Jei grup\u0117je n\u0117ra publikuotos d\u0117\u017e\u0117s \u2014 bloko nerodom,\n    // bet paruo\u0161t\u0173 rinkini\u0173 nuoroda lieka, jei tokia kategorija egzistuoja.\n    $lid = class_exists('Petshop_Laukai') ? Petshop_Laukai::iejimas($cfg['grupe']) : 0;\n    $btns = '';\n    if ($lid && get_post_status($lid) === 'publish') {\n        $url = get_permalink($lid);\n        if ($url) {\n            $btns .= '<a href=\"'.esc_url($url).'\" class=\"psc-cta-btn\">'.esc_html($cfg['mygtukas']).'</a>';\n        }\n    }\n\n    $prep = '';\n    if (!empty($cfg['prepared'])) {\n        $pt = get_term_by('slug', $cfg['prepared'][1], 'product_cat');\n        if ($pt && !is_wp_error($pt) && $pt->count > 0) {\n            $prep = '<a href=\"'.esc_url(get_term_link($pt)).'\" class=\"psc-cta-link\">'.esc_html($cfg['prepared'][0]).' \u2192</a>';\n        }\n    }\n    if (!$btns && !$prep) return;\n\n    echo '<div class=\"psc-cta\">'\n        . '<div class=\"psc-cta-t\"><b>'.esc_html($cfg['title']).'</b><span>'.esc_html($cfg['text']).'</span></div>'\n        . '<div class=\"psc-cta-b\">'.$btns.$prep.'</div>'\n        . '</div>';\n}, 5);\n\nadd_action('wp_head', function(){\n    if (!function_exists('is_product_category') || !is_product_category()) return;\n    echo '<style id=\"psc-cta-css\">\n    .psc-cta{display:flex;align-items:center;gap:18px;flex-wrap:wrap;background:#0F6E56;color:#fff;\n        border-radius:12px;padding:16px 20px;margin:0 0 22px}\n    .psc-cta-t{flex:1 1 320px;min-width:0}\n    .psc-cta-t b{display:block;font-size:16px;font-weight:800;line-height:1.3;margin-bottom:3px}\n    .psc-cta-t span{display:block;font-size:13.5px;opacity:.9;line-height:1.45}\n    .psc-cta-b{display:flex;align-items:center;gap:12px;flex-wrap:wrap}\n    .psc-cta-btn{display:inline-block;background:#fff;color:#0F6E56 !important;font-weight:800;font-size:14px;\n        border-radius:9px;padding:11px 18px;text-decoration:none;white-space:nowrap}\n    .psc-cta-btn:hover{background:#EAF3EF}\n    .psc-cta-link{color:#fff !important;font-size:13.5px;font-weight:700;text-decoration:underline;white-space:nowrap}\n    @media(max-width:600px){.psc-cta{padding:14px}.psc-cta-b{width:100%}.psc-cta-btn{flex:1 1 auto;text-align:center}}\n    </style>';\n}, 20);\n";
const upd = await api('/wp-json/code-snippets/v1/snippets/560', {method:'POST',
  body: JSON.stringify({id:560, name:'Petshop Rinkinio CTA Banneris kategorijose v8', code: kodas, active:true, scope:'global'})});
out.snippet_atnaujintas = { http: upd.s, pav: (()=>{try{return JSON.parse(upd.t).name;}catch(e){return upd.t.slice(0,120);}})() };
await new Promise(r=>setTimeout(r,4000));

/* 3) iejimai pagal grupes + kategoriju puslapiai */
const sT = await snip('TEMP TIK 141', `add_action('wp_loaded', function(){
	if ((\$_GET['ps_t141'] ?? '') !== 'T141x') return;
	\$o=array('versija'=>Petshop_Laukai::VERSIJA,'iejimai'=>array());
	foreach (array('kons_sunims','kons_kates','sunys','kates','kramtalai') as \$g) {
		\$id = Petshop_Laukai::iejimas(\$g);
		\$o['iejimai'][\$g] = \$id ? array(\$id, get_the_title(\$id), get_permalink(\$id)) : 'NERA';
	}
	foreach (array('konservai-sunims','konservai-katems','skanestai-sunims','skanestai-katems','kramtalai-sunims') as \$s) {
		\$t = get_term_by('slug', \$s, 'product_cat');
		\$o['kategorijos'][\$s] = \$t ? array((int)\$t->term_id, get_term_link(\$t)) : 'NERA TOKIOS';
	}
	header('Content-Type: application/json'); echo wp_json_encode(\$o); exit; }, 131);`);
await new Promise(r=>setTimeout(r,4500));
try{ out.tikrinimas = await (await fetch(WP+'/?ps_t141=T141x')).json(); }catch(e){ out.t_err=String(e).slice(0,150); }
await off(sT);

/* 4) ar banneris realiai piesiamas kategorijose */
out.puslapiai={};
for (const [slug, inf] of Object.entries((out.tikrinimas||{}).kategorijos||{})) {
  if (!Array.isArray(inf)) { out.puslapiai[slug]=inf; continue; }
  try{
    const r = await fetch(inf[1], {headers:{Authorization:AUTH}});
    const t = await r.text();
    const m = t.match(/<div class="psc-cta">[\s\S]{0,700}?<\/div>\s*<\/div>/);
    out.puslapiai[slug] = { http:r.status, blokas: t.indexOf('psc-cta')>0,
      tekstas: m ? m[0].replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().slice(0,180) : '(nerastas)' };
  }catch(e){ out.puslapiai[slug]={err:String(e).slice(0,120)}; }
}
}catch(e){ out.bendra=String(e).slice(0,300); }
await irasyk();
console.log('ok');
