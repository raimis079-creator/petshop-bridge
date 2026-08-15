process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import { chromium } from 'playwright';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const out={testai:{}};
async function api(path,opt={}){ const r=await fetch(WP+path,{...opt,headers:{Authorization:AUTH,'Content-Type':'application/json',...(opt.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(name,code){ const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name,code,scope:'global',active:true,priority:5})}); let id=null; try{ id=JSON.parse(cr.t).id; }catch(e){} return id; }
async function off(id){ if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }

/* 1) kaciu skanestai dovanoms */
const s1 = await snip('TEMP KAT DOV', `add_action('wp_loaded', function(){
	if ((\$_GET['ps_kdov'] ?? '') !== 'KD1x') return;
	\$o=array('kat'=>array(),'dov'=>array());
	foreach (get_terms(array('taxonomy'=>'product_cat','hide_empty'=>false)) as \$t) {
		if (preg_match('/skanėst/ui', \$t->name)) \$o['kat'][] = array((int)\$t->term_id, \$t->name, (int)\$t->count);
	}
	\$ids = get_posts(array('post_type'=>'product','post_status'=>'publish','numberposts'=>-1,'fields'=>'ids',
		'meta_query'=>array(array('key'=>'_ps_sandelis','value'=>'AV','compare'=>'='))));
	foreach (\$ids as \$pid) {
		\$p = wc_get_product(\$pid); if(!\$p || !\$p->is_in_stock()) continue;
		\$pav = \$p->get_name();
		if (!preg_match('/katė|katėms|kačiuk/ui',\$pav)) continue;
		if (!preg_match('/skanėst|lazdel|pagalvėl|užkand|malonum|snack|stick/ui',\$pav)) continue;
		\$sav=(float)get_post_meta(\$pid,'_ps_savikaina',true);
		\$o['dov'][] = array('id'=>(int)\$pid,'pav'=>mb_substr(\$pav,0,60),'k'=>(float)\$p->get_price(),'sav'=>\$sav);
	}
	header('Content-Type: application/json'); echo wp_json_encode(\$o); exit;
}, 131);`);
await new Promise(r=>setTimeout(r,4000));
try{ out.dovanos = JSON.parse(await (await fetch(WP+'/?ps_kdov=KD1x')).text()); }catch(e){ out.err1=String(e).slice(0,250); }
await off(s1); await new Promise(r=>setTimeout(r,2000));

/* 2) dvi kaciu dezes */
const dovIds = (out.dovanos && out.dovanos.dov || []).slice(0,3).map(x=>x.id);
out.dovanos_parinktos = dovIds;
if (dovIds.length>=1) {
const s2 = await snip('TEMP KAT DEZ', `add_action('wp_loaded', function(){
	if ((\$_GET['ps_kdez'] ?? '') !== 'KZ1x') return;
	\$o=array('versija'=>Petshop_Laukai::VERSIJA);
	\$dov = wp_json_encode(array(${dovIds.join(',')}));
	\$rink = array(
		array('TEST Konservu deze katei Isrankioms','Išrankioms',
			array(17550,17547,17544,17541,17538,17520,17517,17510,17504,17499,17493,17535),
			'Miamor — tikri filė gabalėliai drebučiuose. Iš 78 konservų katėms atrinkome 12 skonių pačioms išrankiausioms.'),
		array('TEST Konservu deze katei Be vistienos','Be vištienos',
			array(19417,19405,19408,19399,19387,19381,19452,19449,18503,18498,18488,19361),
			'12 skonių be vištienos — dažniausio alergeno katėms. 100 g skardinės kasdienei mitybai.'),
	);
	foreach (\$rink as \$d) {
		\$e = get_posts(array('post_type'=>'product','post_status'=>array('publish','draft'),'numberposts'=>1,'fields'=>'ids','title'=>\$d[0]));
		\$a = array('pav'=>\$d[0],'prekes'=>\$d[2],'pakopos'=>array(),'zodis'=>'deze','min'=>6);
		if (\$e) \$a['id']=(int)\$e[0];
		\$r = Petshop_Laukai::issaugoti(\$a);
		if (is_wp_error(\$r)) { \$o['klaidos'][\$d[0]]=\$r->get_error_message(); continue; }
		\$lid = is_array(\$r)&&isset(\$r['id'])?(int)\$r['id']:(int)\$r;
		update_post_meta(\$lid, Petshop_Laukai::META_DYDIS, '100 g');
		update_post_meta(\$lid, Petshop_Laukai::META_DOV_RIBA, 35);
		update_post_meta(\$lid, Petshop_Laukai::META_DOVANOS, \$dov);
		update_post_meta(\$lid, '_ps_laukas_grupe', 'Konservai katems');
		update_post_meta(\$lid, '_ps_laukas_trumpas', \$d[1]);
		wp_update_post(array('ID'=>\$lid,'post_content'=>\$d[3]));
		\$o['dezes'][\$d[1]] = array('id'=>\$lid,'url'=>get_permalink(\$lid),
			'prekiu'=>count(Petshop_Laukai::krepsys(\$lid)),'dovanu'=>count(Petshop_Laukai::dovanos(\$lid)),
			'min'=>(int) wc_get_product(\$lid)->get_min_container_size());
	}
	if (function_exists('WC') && WC()->cart) { WC()->cart->empty_cart(); }
	header('Content-Type: application/json'); echo wp_json_encode(\$o); exit;
}, 131);`);
await new Promise(r=>setTimeout(r,4000));
try{ out.dezes = JSON.parse(await (await fetch(WP+'/?ps_kdez=KZ1x')).text()); }catch(e){ out.err2=String(e).slice(0,300); }
await off(s2); await new Promise(r=>setTimeout(r,2000));
}

/* 3) testai */
const D = out.dezes && out.dezes.dezes && out.dezes.dezes['Išrankioms'];
if (D) {
const br = await chromium.launch({args:['--no-sandbox','--ignore-certificate-errors']});
const ctx = await br.newContext({httpCredentials:{username:process.env.WP_USER,password:process.env.WP_APP_PASS},ignoreHTTPSErrors:true,viewport:{width:1440,height:1100}});
const page = await ctx.newPage();
const jsErr=[]; page.on('pageerror',e=>jsErr.push(String(e).slice(0,160)));
const T=out.testai;
await page.goto(D.url,{waitUntil:'networkidle',timeout:60000});
await page.waitForTimeout(2500);
await page.evaluate(()=>{ var c=document.querySelector('.cmplz-cookiebanner'); if(c) c.remove(); });
T.t1_poreikiai = { praejo:(await page.locator('.pslk-lbtn').count())===2, rasta: (await page.locator('.pslk-lbtn').allTextContents()).map(x=>x.replace(/\s+/g,' ').trim()) };
T.t2_dydzio_eilute_nerodoma = { praejo:(await page.locator('.pslk-dbtn').count())===0, kiek:(await page.locator('.pslk-dbtn').count()) };
T.t3_korteles = { praejo:(await page.locator('.pslk-kort').count())===12, kiek:(await page.locator('.pslk-kort').count()) };
T.t4_dovanos = { praejo:(await page.locator('.pslk-dovk').count())>=1, kiek:(await page.locator('.pslk-dovk').count()) };
T.t5_min6 = { praejo:(await page.locator('#pslk-cta').textContent()).includes('6'), cta:(await page.locator('#pslk-cta').textContent()).trim() };
await page.evaluate(()=>document.getElementById('pslk-visi').click());
await page.waitForTimeout(900);
T.t6_po1 = { kiek:(await page.locator('#pslk-kiek').textContent()).trim(), suma:(await page.locator('#pslk-suma').textContent()).trim(), praejo:(await page.locator('#pslk-kiek').textContent()).trim()==='12 vnt.' };
const likoDov = await page.locator('#pslk-tk-dov .liko').textContent();
T.t7_tikslai = { praejo: likoDov.length>0, dovana: likoDov.trim(), pristatymas:(await page.locator('#pslk-tk-pr .liko').textContent()).trim() };
async function shot(vardas){
  const b = await page.screenshot({fullPage:false});
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${vardas}.png`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const bo={message:'shot',content:b.toString('base64')}; if(sha) bo.sha=sha;
  await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${vardas}.png`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(bo)});
}
await shot('kates_isrankioms');
T.t8_js = { praejo: jsErr.length===0, klaidos: jsErr };
out.viso=Object.keys(T).length; out.praejo=Object.values(T).filter(x=>x.praejo).length;
await br.close();
}
let sha=null;
try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/katbuild.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
const body={message:'rez',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) body.sha=sha;
await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/katbuild.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
console.log('ok');
