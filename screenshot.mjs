process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import { chromium } from 'playwright';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const out={testai:{}};
async function irasyk(){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/adm131.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const body={message:'rez',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) body.sha=sha;
  await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/adm131.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
}
async function api(path,opt={}){ const r=await fetch(WP+path,{...opt,headers:{Authorization:AUTH,'Content-Type':'application/json',...(opt.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(name,code){ const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name,code,scope:'global',active:true,priority:5})}); let id=null; try{ id=JSON.parse(cr.t).id; }catch(e){} return id; }
async function off(id){ if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }

try {
/* SERVERIO PUSE: renderiname admin puslapi ir tikrinam elementus + AJAX logika */
const code = `add_action('wp_loaded', function(){
	if ((\$_GET['ps_a131'] ?? '') !== 'A131x') return;
	\$o=array('versija'=>Petshop_Laukai::VERSIJA);
	wp_set_current_user(1);
	\$u = wp_get_current_user();
	\$o['vartotojas'] = \$u ? \$u->user_login : '—';
	\$o['gali'] = current_user_can('manage_woocommerce') ? 'taip' : 'ne';
	\$_GET['id']=34942; \$_GET['page']='ps-laukai';
	set_current_screen('admin_page_ps-laukai');
	ob_start(); Petshop_Laukai::puslapis(); \$h = ob_get_clean();
	\$o['html_ilgis'] = strlen(\$h);
	\$o['yra'] = array(
		'dydzio_laukas' => strpos(\$h,'id="s-dydis"')!==false,
		'min_laukas'    => strpos(\$h,'id="s-min"')!==false,
		'dovanu_lentele'=> strpos(\$h,'id="dov-kunas"')!==false,
		'dovanu_riba'   => strpos(\$h,'id="dov-riba"')!==false,
		'dovanu_paieska'=> strpos(\$h,'id="dov-q"')!==false,
		'grupe_konservai_sunims' => strpos(\$h,'Konservai šunims')!==false,
		'grupe_konservai_kates'  => strpos(\$h,'Konservai katėms')!==false,
	);
	preg_match('/id="s-dydis"[^>]*value="([^"]*)"/', \$h, \$m1); \$o['dydis_reiksme'] = \$m1[1] ?? '';
	preg_match('/id="s-min"[^>]*value="([^"]*)"/', \$h, \$m2); \$o['min_reiksme'] = \$m2[1] ?? '';
	preg_match('/id="dov-riba"[^>]*value="([^"]*)"/', \$h, \$m3); \$o['riba_reiksme'] = \$m3[1] ?? '';
	preg_match('/var DOV = (\\\\[.*?\\\\]);/s', \$h, \$m4); \$o['dov_js'] = isset(\$m4[1]) ? mb_substr(\$m4[1],0,260) : '';
	\$o['php_klaidos'] = (strpos(\$h,'Fatal error')!==false || strpos(\$h,'Warning:')!==false) ? 'YRA' : 'nera';
	header('Content-Type: application/json'); echo wp_json_encode(\$o); exit;
}, 131);`;
const s1 = await snip('TEMP ADM 131', code);
await new Promise(r=>setTimeout(r,4000));
try{ out.renderis = JSON.parse(await (await fetch(WP+'/?ps_a131=A131x')).text()); }catch(e){ out.renderis_err=String(e).slice(0,300); }
await off(s1); await new Promise(r=>setTimeout(r,2000));

/* AJAX dovanu logika serverio puseje: prideti / salinti / sandelio apsauga / 3 riba */
const code2 = `add_action('wp_loaded', function(){
	if ((\$_GET['ps_b131'] ?? '') !== 'B131x') return;
	wp_set_current_user(1);
	\$o=array(); \$lid=34942;
	\$pries = Petshop_Laukai::dovanos(\$lid);
	\$o['pries'] = \$pries;
	\$kviesk = function(\$veiksmas,\$pid) use (\$lid) {
		\$_POST = array('lid'=>\$lid,'preke'=>\$pid,'veiksmas'=>\$veiksmas,'nonce'=>wp_create_nonce('ps_laukai'));
		\$_REQUEST = \$_POST;
		try { ob_start(); Petshop_Laukai::ajax_dovanos(); \$x = ob_get_clean(); }
		catch (\\\\WPDieException \$e) { \$x = ob_get_clean(); }
		catch (\\\\Exception \$e) { \$x = ob_get_clean(); }
		return json_decode(\$x, true);
	};
	\$r1 = \$kviesk('salinti', 17386);
	\$o['po_salinimo'] = Petshop_Laukai::dovanos(\$lid);
	\$r2 = \$kviesk('prideti', 17386);
	\$o['po_pridejimo'] = Petshop_Laukai::dovanos(\$lid);
	/* 4-a dovana — turi buti atmesta */
	\$r3 = \$kviesk('prideti', 16299);
	\$o['ketvirta'] = isset(\$r3['success']) ? (\$r3['success'] ? 'PRALEIDO' : \$r3['data']) : 'nezinia';
	\$o['po_ketvirtos'] = count(Petshop_Laukai::dovanos(\$lid));
	/* kito sandelio dovana — turi buti atmesta */
	\$vf = get_posts(array('post_type'=>'product','post_status'=>'publish','numberposts'=>1,'fields'=>'ids',
		'meta_query'=>array(array('key'=>'_ps_sandelis','value'=>'VF','compare'=>'='))));
	if (\$vf) { \$kviesk('salinti', 17386); \$r4 = \$kviesk('prideti', (int)\$vf[0]);
		\$o['kitas_sandelis'] = isset(\$r4['success']) ? (\$r4['success'] ? 'PRALEIDO' : \$r4['data']) : 'nezinia';
		\$kviesk('prideti', 17386); }
	\$o['galutinis'] = Petshop_Laukai::dovanos(\$lid);
	header('Content-Type: application/json'); echo wp_json_encode(\$o); exit;
}, 131);`;
const s2 = await snip('TEMP ADM B131', code2);
await new Promise(r=>setTimeout(r,4000));
try{ out.ajax = JSON.parse(await (await fetch(WP+'/?ps_b131=B131x')).text()); }catch(e){ out.ajax_err=String(e).slice(0,300); }
await off(s2);

/* NARSYKLE: prisijungimas ir ekrano nuotrauka — jei nepavyks, uzfiksuojam kodel */
try{
  const br = await chromium.launch({args:['--no-sandbox','--ignore-certificate-errors']});
  const ctx = await br.newContext({httpCredentials:{username:process.env.WP_USER,password:process.env.WP_APP_PASS},ignoreHTTPSErrors:true,viewport:{width:1500,height:1200}});
  const page = await ctx.newPage();
  await page.goto(WP+'/wp-login.php',{waitUntil:'domcontentloaded',timeout:45000});
  await page.fill('#user_login', process.env.WP_USER||'');
  await page.fill('#user_pass', process.env.WP_PASS || process.env.WP_APP_PASS || '');
  await page.click('#wp-submit');
  await page.waitForTimeout(4000);
  out.po_login = page.url();
  await page.goto(WP+'/wp-admin/admin.php?page=ps-laukai&id=34942',{waitUntil:'domcontentloaded',timeout:45000});
  await page.waitForTimeout(3000);
  out.admin_pasiekta = (await page.locator('#dov-kunas').count())===1;
  if (out.admin_pasiekta) {
    await page.locator('#dov-kunas').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    const b = await page.screenshot({fullPage:false});
    let sha=null;
    try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/v131_admin.png`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
    const bo={message:'shot',content:b.toString('base64')}; if(sha) bo.sha=sha;
    await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/v131_admin.png`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(bo)});
  }
  await br.close();
}catch(e){ out.narsykle_klaida = String(e).slice(0,300); }

}catch(e){ out.bendra_klaida = String(e).slice(0,400); }
await irasyk();
console.log('ok');
