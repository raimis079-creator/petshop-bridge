process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
import { chromium } from 'playwright';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const out={testai:{}};
async function api(path,opt={}){ const r=await fetch(WP+path,{...opt,headers:{Authorization:AUTH,'Content-Type':'application/json',...(opt.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(name,code){
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name,code,scope:'global',active:true,priority:5})});
  let id=null; try{ id=JSON.parse(cr.t).id; }catch(e){} return id;
}
async function off(id){ if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }

/* diegimas */
const b64 = fs.readFileSync('deploy/petshop-laukai.php').toString('base64');
const s1 = await snip('TEMP SET 122', `add_action('wp_loaded', function(){
	if ((\$_GET['ps_s122'] ?? '') !== 'S122x') return;
	update_option('ps_l_b64_122', '${b64}', false);
	header('Content-Type: application/json'); echo wp_json_encode(array('ok'=>1)); exit;
}, 131);`);
await new Promise(r=>setTimeout(r,4000));
await fetch(WP+'/?ps_s122=S122x').then(r=>r.text()).catch(()=>{});
await off(s1); await new Promise(r=>setTimeout(r,3000));
const s2 = await snip('TEMP DEP 122', `add_action('wp_loaded', function(){
	if ((\$_GET['ps_d122'] ?? '') !== 'D122x') return;
	\$o=array(); \$b=get_option('ps_l_b64_122');
	if(!\$b){ \$o['klaida']='tuscia'; }
	else { \$k=base64_decode(\$b);
		try { token_get_all(\$k, TOKEN_PARSE); \$o['sintakse']='OK';
			\$kl=WPMU_PLUGIN_DIR.'/petshop-laukai.php';
			file_put_contents(\$kl,\$k); clearstatcache(true,\$kl);
			\$o['sutampa']=(md5_file(\$kl)===md5(\$k));
		} catch (ParseError \$e){ \$o['sintakse']='KLAIDA: '.\$e->getMessage(); }
		delete_option('ps_l_b64_122'); }
	header('Content-Type: application/json'); echo wp_json_encode(\$o); exit;
}, 131);`);
await new Promise(r=>setTimeout(r,4000));
try{ out.diegimas = JSON.parse(await (await fetch(WP+'/?ps_d122=D122x')).text()); }catch(e){ out.diegimas_err=String(e).slice(0,150); }
await off(s2); await new Promise(r=>setTimeout(r,2500));

/* 5 testines dezes — pilna sutarta struktura */
const s3 = await snip('TEMP DEZ 122', `add_action('wp_loaded', function(){
	if ((\$_GET['ps_z122'] ?? '') !== 'Z122x') return;
	\$o=array('versija'=>Petshop_Laukai::VERSIJA);
	\$dov = wp_json_encode(array(16305,19098,17386));
	\$rink = array(
		array('TEST Konservu deze 800 Be vistienos','Be vištienos','800 g',45,
			array(19570,19562,19582,19590,19578,19504,19496,19488,19479,19538,19471),
			'Iš 79 konservų šunims atrinkome 11 skonių be vištienos — 800 g skardinės dideliam šuniui. Rinkis bet kurį, suklysti neįmanoma.'),
		array('TEST Konservu deze 800 Visi skoniai','Visi skoniai','800 g',45,
			array(19570,19562,19582,19598,19545,19553,19504,19488,19479,19578,19496,19471),
			'Visa GranCarno 800 g skonių paletė — 12 skonių dideliam šuniui. Paskirstyk pats.'),
		array('TEST Konservu deze 400 Be vistienos','Be vištienos','400 g',38,
			array(19574,19566,19586,19594,19500,19508,19492,19483,19534,19530,19542,19475),
			'Iš 79 konservų šunims atrinkome 12 skonių be vištienos — 400 g skardinės mažam ir vidutiniam šuniui.'),
		array('TEST Konservu deze 400 Monoproteinas','Monoproteinas','400 g',38,
			array(18611,18605,18599,18596,17250,17241,17232,17223,17176,17159),
			'Vienas baltymo šaltinis skardinėje — gamintojo deklaruota. Alergiškam ir jautriam šuniui.'),
		array('TEST Konservu deze 400 Visi skoniai','Visi skoniai','400 g',38,
			array(19574,19566,19557,19549,19586,19492,19483,19534,17241,17232,19508,19475),
			'Visa 400 g skonių paletė mažam ir vidutiniam šuniui. Paskirstyk pats.'),
	);
	foreach (\$rink as \$d) {
		\$e = get_posts(array('post_type'=>'product','post_status'=>array('publish','draft'),'numberposts'=>1,'fields'=>'ids','title'=>\$d[0]));
		\$a = array('pav'=>\$d[0],'prekes'=>\$d[4],'pakopos'=>array(),'zodis'=>'deze','min'=>6);
		if (\$e) \$a['id']=(int)\$e[0];
		\$r = Petshop_Laukai::issaugoti(\$a);
		if (is_wp_error(\$r)) { \$o['klaidos'][\$d[0]]=\$r->get_error_message(); continue; }
		\$lid = is_array(\$r)&&isset(\$r['id'])?(int)\$r['id']:(int)\$r;
		update_post_meta(\$lid, Petshop_Laukai::META_DYDIS, \$d[2]);
		update_post_meta(\$lid, Petshop_Laukai::META_DOV_RIBA, \$d[3]);
		update_post_meta(\$lid, Petshop_Laukai::META_DOVANOS, \$dov);
		update_post_meta(\$lid, '_ps_laukas_grupe', 'Konservai sunims');
		update_post_meta(\$lid, '_ps_laukas_trumpas', \$d[1]);
		wp_update_post(array('ID'=>\$lid,'post_content'=>\$d[5]));
		\$o['dezes'][\$d[0]] = array('id'=>\$lid,'url'=>get_permalink(\$lid),
			'min'=>(int) wc_get_product(\$lid)->get_min_container_size(),
			'prekiu'=>count(Petshop_Laukai::krepsys(\$lid)),
			'dovanu'=>count(Petshop_Laukai::dovanos(\$lid)));
	}
	/* senos testines (34940/34941 pavadinimu be poreikiu) — istrinam, kad nesimaisytu */
	foreach (array('TEST Konservu deze suniui 800 g','TEST Konservu deze suniui 400 g') as \$sen) {
		\$e = get_posts(array('post_type'=>'product','post_status'=>array('publish','draft'),'numberposts'=>1,'fields'=>'ids','title'=>\$sen));
		if (\$e) { global \$wpdb;
			\$wpdb->delete(\$wpdb->prefix.'wc_mnm_child_items', array('container_id'=>(int)\$e[0]), array('%d'));
			wp_delete_post((int)\$e[0], true); \$o['istrinta'][]=\$sen; }
	}
	if (function_exists('WC') && WC()->cart) { WC()->cart->empty_cart(); }
	header('Content-Type: application/json'); echo wp_json_encode(\$o); exit;
}, 131);`);
await new Promise(r=>setTimeout(r,4000));
try{ out.paruosimas = JSON.parse(await (await fetch(WP+'/?ps_z122=Z122x')).text()); }catch(e){ out.paruosimas_err=String(e).slice(0,300); }
await off(s3); await new Promise(r=>setTimeout(r,2000));

const D = out.paruosimas && out.paruosimas.dezes;
const d800 = D && D['TEST Konservu deze 800 Be vistienos'];
if(!d800){ out.stop='nera 800 bevist'; }
else {
const br = await chromium.launch({args:['--no-sandbox','--ignore-certificate-errors']});
const ctx = await br.newContext({httpCredentials:{username:process.env.WP_USER,password:process.env.WP_APP_PASS},ignoreHTTPSErrors:true,viewport:{width:1440,height:1100}});
const page = await ctx.newPage();
const jsErr=[]; page.on('pageerror',e=>jsErr.push(String(e).slice(0,160)));
const T=out.testai;

await page.goto(d800.url,{waitUntil:'networkidle',timeout:60000});
await page.waitForTimeout(2500);
await page.evaluate(()=>{ var c=document.querySelector('.cmplz-cookiebanner'); if(c) c.style.display='none'; });

/* poreikiu mygtukai */
const laukai = await page.locator('.pslk-lbtn').allTextContents();
T.t1_poreikiai_800 = { praejo: laukai.length===2, rasta: laukai.map(x=>x.replace(/\s+/g,' ').trim()) };
/* dydzio mygtukai */
const dyd = await page.locator('.pslk-dbtn').count();
T.t2_dydziai = { praejo: dyd===2, kiek: dyd };
/* min 6 */
const cta0 = await page.locator('#pslk-cta').textContent();
T.t3_min6 = { praejo: cta0.includes('6'), cta: cta0.trim() };
/* 3 dovanos */
const dovN = await page.locator('.pslk-dovk').count();
T.t4_trys_dovanos = { praejo: dovN===3, kiek: dovN };
/* 11 skoniu ir kompaktiskos korteles 4 stulpeliais */
const kort = await page.locator('.pslk-kort').count();
const stulpeliai = await page.evaluate(()=>getComputedStyle(document.querySelector('.pslk-korteles')).gridTemplateColumns.split(' ').length);
T.t5_pool_ir_stulpeliai = { praejo: kort===11 && stulpeliai===4, korteliu: kort, stulpeliu: stulpeliai };
/* po 1 vnt → 11 vnt, CTA aktyvus (11>=6) */
await page.evaluate(()=>document.getElementById('pslk-visi').click());
await page.waitForTimeout(900);
const k2=(await page.locator('#pslk-kiek').textContent()).trim();
T.t6_po1 = { praejo: k2==='11 vnt.', kiek: k2, cta: (await page.locator('#pslk-cta').textContent()).trim() };
/* pilnas aprasas perziuroje — atsidarom pirma preke, ziurim ilgi */
await page.evaluate(()=>document.querySelector('.pslk-p').click());
await page.waitForTimeout(700);
const aprIlgis = await page.evaluate(()=>{var a=document.getElementById('pslk-pz-apr');return a?a.textContent.length:0;});
T.t7_pilnas_aprasas = { praejo: aprIlgis>700, ilgis: aprIlgis };
await page.evaluate(()=>document.querySelector('.pslk-pz-x').click());
await page.waitForTimeout(400);
/* dovanos atrakinimas + krepselis */
for(let i=0;i<10;i++){ await page.evaluate(()=>{var b=document.querySelector('.pslk-kort .pslk-stp button[data-d="1"]');if(b)b.click();}); await page.waitForTimeout(90); }
await page.waitForTimeout(800);
const atr = await page.locator('#pslk-dov.atrakinta').count();
T.t8_dovana_atsirakina = { praejo: atr===1, suma:(await page.locator('#pslk-suma').textContent()).trim() };
/* antros dovanos pasirinkimas */
await page.evaluate(()=>{document.querySelectorAll('.pslk-dovk')[1].click();});
await page.waitForTimeout(500);
const in2 = await page.locator('#pslk-dov-in').inputValue();
T.t9_dovanos_pasirinkimas = { praejo: in2==='19098', input: in2 };
await page.evaluate(()=>document.getElementById('pslk-cta').click());
await page.waitForTimeout(4500);
await page.goto(WP+'/cart/',{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(2500);
const kr = await page.locator('.woocommerce-cart-form, .cart, table').first().innerText().catch(()=>'');
T.t10_krepselis = { praejo: kr.toLowerCase().includes('jaučio') && kr.includes('0,00'), jaucio: kr.toLowerCase().includes('jaučio') };
T.t11_js = { praejo: jsErr.length===0, klaidos: jsErr };

/* nuotraukos */
async function shot(vardas){
  const b = await page.screenshot({fullPage:false});
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${vardas}.png`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const bo={message:'shot',content:b.toString('base64')}; if(sha) bo.sha=sha;
  await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${vardas}.png`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(bo)});
}
await page.goto(d800.url,{waitUntil:'networkidle',timeout:60000});
await page.waitForTimeout(2500);
await page.evaluate(()=>{ var c=document.querySelector('.cmplz-cookiebanner'); if(c) c.style.display='none'; });
await shot('v122_tuscia');
await page.evaluate(()=>document.getElementById('pslk-visi').click());
await page.waitForTimeout(600);
for(let i=0;i<6;i++){ await page.evaluate(()=>{var b=document.querySelector('.pslk-kort .pslk-stp button[data-d="1"]');if(b)b.click();}); await page.waitForTimeout(90); }
await page.waitForTimeout(900);
await shot('v122_pilna');
out.viso = Object.keys(T).length;
out.praejo = Object.values(T).filter(x=>x.praejo).length;
await br.close();
}
let sha=null;
try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/pw122.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
const body={message:'rez',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) body.sha=sha;
await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/pw122.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
console.log('ok');
