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

/* ===== DIEGIMAS ===== */
const b64 = fs.readFileSync('deploy/petshop-laukai.php').toString('base64');
const s1 = await snip('TEMP SET 119', `add_action('wp_loaded', function(){
	if ((\$_GET['ps_s119'] ?? '') !== 'S119x') return;
	update_option('ps_l_b64_119', '${b64}', false);
	header('Content-Type: application/json'); echo wp_json_encode(array('ok'=>1)); exit;
}, 131);`);
await new Promise(r=>setTimeout(r,4000));
await fetch(WP+'/?ps_s119=S119x').then(r=>r.text()).catch(()=>{});
await off(s1); await new Promise(r=>setTimeout(r,3000));

const s2 = await snip('TEMP DEP 119', `add_action('wp_loaded', function(){
	if ((\$_GET['ps_d119'] ?? '') !== 'D119x') return;
	\$o=array(); \$b=get_option('ps_l_b64_119');
	if(!\$b){ \$o['klaida']='tuscia'; }
	else { \$k=base64_decode(\$b);
		try { token_get_all(\$k, TOKEN_PARSE); \$o['sintakse']='OK';
			\$kl=WPMU_PLUGIN_DIR.'/petshop-laukai.php';
			file_put_contents(\$kl,\$k); clearstatcache(true,\$kl);
			\$o['sutampa']=(md5_file(\$kl)===md5(\$k)); \$o['md5']=md5(\$k);
		} catch (ParseError \$e){ \$o['sintakse']='KLAIDA: '.\$e->getMessage(); }
		delete_option('ps_l_b64_119'); }
	header('Content-Type: application/json'); echo wp_json_encode(\$o); exit;
}, 131);`);
await new Promise(r=>setTimeout(r,4000));
try{ out.diegimas = JSON.parse(await (await fetch(WP+'/?ps_d119=D119x')).text()); }catch(e){ out.diegimas_err=String(e).slice(0,150); }
await off(s2); await new Promise(r=>setTimeout(r,2500));

/* ===== dezes ===== */
const s3 = await snip('TEMP DEZ 119', `add_action('wp_loaded', function(){
	if ((\$_GET['ps_z119'] ?? '') !== 'Z119x') return;
	\$o=array('versija'=>Petshop_Laukai::VERSIJA);
	foreach (array(
		array('TEST Konservu deze suniui 800 g', array(19570,19562,19582,19590,19578,19504,19496,19488,19479), '800 g', 45),
		array('TEST Konservu deze suniui 400 g', array(19574,19566,19586,19594,19500,19508,19492,19483,19534), '400 g', 38)
	) as \$d) {
		\$e = get_posts(array('post_type'=>'product','post_status'=>array('publish','draft'),'numberposts'=>1,'fields'=>'ids','title'=>\$d[0]));
		\$a = array('pav'=>\$d[0],'prekes'=>\$d[1],'pakopos'=>array(),'zodis'=>'deze');
		if (\$e) \$a['id']=(int)\$e[0];
		\$r = Petshop_Laukai::issaugoti(\$a);
		if (is_wp_error(\$r)) { \$o['klaida'][]=\$r->get_error_message(); continue; }
		\$lid = is_array(\$r)&&isset(\$r['id'])?(int)\$r['id']:(int)\$r;
		update_post_meta(\$lid, Petshop_Laukai::META_DYDIS, \$d[2]);
		update_post_meta(\$lid, Petshop_Laukai::META_DOV_RIBA, \$d[3]);
		update_post_meta(\$lid, Petshop_Laukai::META_DOVANOS, wp_json_encode(array(16305)));
		update_post_meta(\$lid, '_ps_laukas_grupe', 'Konservai sunims');
		update_post_meta(\$lid, '_ps_laukas_trumpas', 'Be vistienos');
		\$o['dezes'][\$d[2]] = array('id'=>\$lid,'url'=>get_permalink(\$lid),'riba'=>\$d[3]);
	}
	if (function_exists('WC') && WC()->cart) { WC()->cart->empty_cart(); }
	header('Content-Type: application/json'); echo wp_json_encode(\$o); exit;
}, 131);`);
await new Promise(r=>setTimeout(r,4000));
try{ out.paruosimas = JSON.parse(await (await fetch(WP+'/?ps_z119=Z119x')).text()); }catch(e){ out.paruosimas_err=String(e).slice(0,200); }
await off(s3); await new Promise(r=>setTimeout(r,2000));

/* ===== TESTAI ===== */
const D = out.paruosimas && out.paruosimas.dezes;
if(!D || !D['800 g']){ out.stop='nera deziu'; }
else {
const br = await chromium.launch({args:['--no-sandbox','--ignore-certificate-errors']});
const ctx = await br.newContext({httpCredentials:{username:process.env.WP_USER,password:process.env.WP_APP_PASS},ignoreHTTPSErrors:true});
const page = await ctx.newPage();
const jsErr=[]; page.on('pageerror',e=>jsErr.push(String(e).slice(0,160)));
const T=out.testai;
const kiek=()=>page.locator('#pslk-kiek').textContent();

await page.goto(D['800 g'].url,{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(2500);

/* T1 dydzio eilute */
const dt = await page.locator('.pslk-dbtn').allTextContents();
T.t1_dydzio_eilute = { praejo: dt.length===2, rasta: dt.map(x=>x.trim()) };

/* T2 po 1 vnt. */
await page.evaluate(()=>document.getElementById('pslk-visi').click());
await page.waitForTimeout(900);
const k2 = await kiek(); const s2v = await page.locator('#pslk-suma').textContent();
T.t2_po_1_vnt = { praejo: k2.trim()==='9 vnt.', kiek:k2.trim(), suma:s2v.trim() };

/* T3 langelio paspaudimas nuima VIENA */
await page.evaluate(()=>document.querySelector('.pslk-el:not(.dov)').click());
await page.waitForTimeout(700);
const k3 = await kiek();
T.t3_isemimas_vienas = { praejo: k3.trim()==='8 vnt.', pries:'9 vnt.', po:k3.trim() };

/* T4 PERZIURA KOL UZRAKINTA */
await page.evaluate(()=>document.querySelector('.pslk-dov-f').click());
await page.waitForTimeout(700);
const pzU = await page.locator('#pslk-pz.rodo').count();
const pavU = await page.locator('#pslk-pz-pav').textContent().catch(()=>'');
await page.evaluate(()=>document.querySelector('.pslk-pz-x').click());
await page.waitForTimeout(400);
T.t4_perziura_uzrakinta = { praejo: pzU===1 && pavU.toLowerCase().includes('ausis'), pav:pavU.trim() };

/* T5 dovanos atsirakinimas */
for(let i=0;i<8;i++){ await page.evaluate(()=>{var b=document.querySelector('.pslk-kort .pslk-stp button[data-d="1"]');if(b)b.click();}); await page.waitForTimeout(110); }
await page.waitForTimeout(800);
const atr = await page.locator('#pslk-dov.atrakinta').count();
const dovDez = await page.locator('.pslk-el.dov').count();
const sumaA = await page.locator('#pslk-suma').textContent();
const inp = await page.locator('#pslk-dov-in').inputValue().catch(()=>'');
T.t5_dovana_atsirakina = { praejo: atr===1 && dovDez===1 && inp==='16305', suma:sumaA.trim(), input:inp };

/* T6 PERZIURA KAI ATRAKINTA — buves gedimas */
await page.evaluate(()=>document.querySelector('.pslk-dov-f').click());
await page.waitForTimeout(700);
const pzA = await page.locator('#pslk-pz.rodo').count();
const pavA = await page.locator('#pslk-pz-pav').textContent().catch(()=>'');
const kainaA = await page.locator('#pslk-pz-kaina').textContent().catch(()=>'');
await page.evaluate(()=>document.querySelector('.pslk-pz-x').click());
await page.waitForTimeout(400);
T.t6_perziura_atrakinta = { praejo: pzA===1 && pavA.toLowerCase().includes('ausis'), pav:pavA.trim(), kaina:kainaA.trim() };

/* T7 dovana DINGSTA nukritus zemiau ribos */
for(let i=0;i<9;i++){ await page.evaluate(()=>{var b=document.querySelector('.pslk-kort.turi .pslk-stp button[data-d="-1"]');if(b)b.click();}); await page.waitForTimeout(110); }
await page.waitForTimeout(800);
const atr7 = await page.locator('#pslk-dov.atrakinta').count();
const dov7 = await page.locator('.pslk-el.dov').count();
const suma7 = await page.locator('#pslk-suma').textContent();
T.t7_dovana_dingsta = { praejo: atr7===0 && dov7===0, suma:suma7.trim(), atrakinta:atr7, dezeje:dov7 };

/* T8 400 g deze veikia taip pat */
await page.goto(D['400 g'].url,{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(2500);
await page.evaluate(()=>document.getElementById('pslk-visi').click());
await page.waitForTimeout(900);
const bl400 = await page.locator('#pslk-dov-bl').textContent();
const dt400 = await page.locator('.pslk-dbtn').count();
const kort400 = await page.locator('.pslk-kort').count();
T.t8_400g_deze = { praejo: dt400===2 && kort400===9 && bl400.includes('38'), riba:bl400.trim(), korteliu:kort400 };

/* T9 dovana krepselyje 0,00 EUR */
await page.goto(D['800 g'].url,{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(2000);
await page.evaluate(()=>document.getElementById('pslk-visi').click());
await page.waitForTimeout(600);
for(let i=0;i<8;i++){ await page.evaluate(()=>{var b=document.querySelector('.pslk-kort .pslk-stp button[data-d="1"]');if(b)b.click();}); await page.waitForTimeout(110); }
await page.waitForTimeout(700);
await page.evaluate(()=>document.getElementById('pslk-cta').click());
await page.waitForTimeout(4500);
await page.goto(WP+'/cart/',{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(2500);
const kr = await page.locator('.woocommerce-cart-form, .cart, table').first().innerText().catch(()=>'');
const turiDovana = /ausis[\s\S]{0,80}dovana[\s\S]{0,40}0,00/i.test(kr) || (kr.toLowerCase().includes('ausis') && kr.includes('0,00'));
T.t9_dovana_krepselyje = { praejo: turiDovana, ausis: kr.toLowerCase().includes('ausis'), dovanos_zyme: kr.toLowerCase().includes('dovana') };

T.t10_js_klaidos = { praejo: jsErr.length===0, klaidos: jsErr };

/* EKRANO NUOTRAUKOS — vizuali patikra, be jos „padaryta" nesakom */
async function shot(pg,vardas){
  const b = await pg.screenshot({fullPage:false});
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${vardas}.png`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const bo={message:'shot',content:b.toString('base64')}; if(sha) bo.sha=sha;
  await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${vardas}.png`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(bo)});
}
await page.goto(D['800 g'].url,{waitUntil:'networkidle',timeout:60000});
await page.waitForTimeout(2500);
await page.evaluate(()=>{ var c=document.querySelector('.cmplz-cookiebanner'); if(c) c.style.display='none'; });
await shot(page,'v119_tuscia');
/* ar deze matoma pirmame ekrane */
T.t11_deze_matoma = await page.evaluate(()=>{
  var s=document.querySelector('.pslk-sonas'); if(!s) return {praejo:false, kodel:'nera sono'};
  var r=s.getBoundingClientRect();
  var k=document.querySelector('.pslk-korteles').getBoundingClientRect();
  return {praejo: r.top < 700 && r.left > k.left, dezes_top: Math.round(r.top), dezes_left: Math.round(r.left), korteliu_left: Math.round(k.left)};
});
await page.evaluate(()=>document.getElementById('pslk-visi').click());
await page.waitForTimeout(600);
for(let i=0;i<8;i++){ await page.evaluate(()=>{var b=document.querySelector('.pslk-kort .pslk-stp button[data-d="1"]');if(b)b.click();}); await page.waitForTimeout(90); }
await page.waitForTimeout(900);
await shot(page,'v119_pilna');
out.viso = Object.keys(T).length;
out.praejo = Object.values(T).filter(x=>x.praejo).length;

await br.close();
}

let sha=null;
try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/pw119.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
const body={message:'rez',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) body.sha=sha;
const p=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/pw119.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
console.log('put',p.status);
