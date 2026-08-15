process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import { chromium } from 'playwright';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const out={};
async function api(path,opt={}){ const r=await fetch(WP+path,{...opt,headers:{Authorization:AUTH,'Content-Type':'application/json',...(opt.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(name,code){
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name,code,scope:'global',active:true,priority:5})});
  let id=null; try{ id=JSON.parse(cr.t).id; }catch(e){} return id;
}
async function off(id){ if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }

/* --- 1) antra testine deze 400 g, kad dydzio eilute turetu ka rodyti --- */
const kodas = `add_action('wp_loaded', function(){
	if ((\$_GET['ps_k400'] ?? '') !== 'K400x') return;
	\$o=array();
	\$prekes = array(19574,19566,19586,19594,19500,19508,19492,19483,19534);
	\$esamas = get_posts(array('post_type'=>'product','post_status'=>array('publish','draft'),
		'numberposts'=>1,'fields'=>'ids','title'=>'TEST Konservu deze suniui 400 g'));
	\$args = array('pav'=>'TEST Konservu deze suniui 400 g','prekes'=>\$prekes,'pakopos'=>array(),'zodis'=>'deze');
	if (\$esamas) { \$args['id']=(int)\$esamas[0]; }
	\$r = Petshop_Laukai::issaugoti(\$args);
	if (is_wp_error(\$r)) { \$o['klaida']=\$r->get_error_message(); }
	else {
		\$lid = is_array(\$r)&&isset(\$r['id']) ? (int)\$r['id'] : (int)\$r;
		update_post_meta(\$lid, Petshop_Laukai::META_DYDIS, '400 g');
		update_post_meta(\$lid, Petshop_Laukai::META_DOV_RIBA, 38);
		update_post_meta(\$lid, Petshop_Laukai::META_DOVANOS, wp_json_encode(array(16305)));
		update_post_meta(\$lid, '_ps_laukas_grupe', 'Konservai sunims');
		update_post_meta(\$lid, '_ps_laukas_trumpas', 'Be vistienos');
		\$o['lid_400']=\$lid; \$o['url_400']=get_permalink(\$lid);
		\$k = get_posts(array('post_type'=>'product','post_status'=>array('publish','draft'),
			'numberposts'=>1,'fields'=>'ids','title'=>'TEST Konservu deze suniui 800 g'));
		if (\$k) { \$o['lid_800']=(int)\$k[0]; \$o['url_800']=get_permalink((int)\$k[0]); }
	}
	header('Content-Type: application/json'); echo wp_json_encode(\$o); exit;
}, 131);`;
const s1 = await snip('TEMP K400', kodas);
await new Promise(r=>setTimeout(r,4000));
try{ const r=await fetch(WP+'/?ps_k400=K400x'); const t=await r.text();
  try{ out.dezes=JSON.parse(t); }catch(e){ out.dezes_raw=t.slice(0,500); } }catch(e){ out.err1=String(e).slice(0,150); }
await off(s1);

if(!out.dezes || !out.dezes.url_800){ out.stop='nera 800 g dezes'; }
else {
  /* --- 2) Playwright: tikri paspaudimai --- */
  const b = await chromium.launch({args:['--no-sandbox','--ignore-certificate-errors']});
  const ctx = await b.newContext({httpCredentials:{username:process.env.WP_USER,password:process.env.WP_APP_PASS},ignoreHTTPSErrors:true});
  const page = await ctx.newPage();
  const jsKlaidos=[]; page.on('pageerror',e=>jsKlaidos.push(String(e).slice(0,160)));

  await page.goto(out.dezes.url_800,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(2500);

  out.t1_pradzia = {
    dydzio_mygtukai: await page.locator('.pslk-dbtn').count(),
    dydzio_tekstai: await page.locator('.pslk-dbtn').allTextContents(),
    korteles: await page.locator('.pslk-kort').count(),
    dovanu_korteliu: await page.locator('.pslk-dovk').count(),
    dovana_atrakinta: await page.locator('#pslk-dov.atrakinta').count(),
    dov_bl: await page.locator('#pslk-dov-bl').textContent().catch(()=>''),
    cta: await page.locator('#pslk-cta').textContent().catch(()=>''),
    cta_disabled: await page.locator('#pslk-cta').isDisabled().catch(()=>null)
  };

  /* „Po 1 vnt. visu" */
  await page.evaluate(()=>{ document.getElementById('pslk-visi').click(); });
  await page.waitForTimeout(900);
  out.t2_po1 = {
    kiek: await page.locator('#pslk-kiek').textContent(),
    langeliu_dezeje: await page.locator('.pslk-el:not(.dov)').count(),
    suma: await page.locator('#pslk-suma').textContent(),
    dovana_atrakinta: await page.locator('#pslk-dov.atrakinta').count(),
    kita: await page.locator('#pslk-kita').textContent(),
    cta: await page.locator('#pslk-cta').textContent()
  };

  /* Langelio paspaudimas — ar nuima VIENA */
  const priesIsem = await page.locator('#pslk-kiek').textContent();
  await page.evaluate(()=>{ document.querySelector('.pslk-el:not(.dov)').click(); });
  await page.waitForTimeout(700);
  out.t3_isemimas = { pries: priesIsem, po: await page.locator('#pslk-kiek').textContent() };

  /* Renkam iki dovanos ribos 45 EUR */
  for(let i=0;i<8;i++){
    await page.evaluate(()=>{ var b=document.querySelector('.pslk-kort .pslk-stp button[data-d="1"]'); if(b) b.click(); });
    await page.waitForTimeout(120);
  }
  await page.waitForTimeout(700);
  out.t4_dovana = {
    suma: await page.locator('#pslk-suma').textContent(),
    kiek: await page.locator('#pslk-kiek').textContent(),
    atrakinta: await page.locator('#pslk-dov.atrakinta').count(),
    dov_bl: await page.locator('#pslk-dov-bl').textContent(),
    dovana_dezeje: await page.locator('.pslk-el.dov').count(),
    dbr: await page.locator('#pslk-dbr').textContent(),
    input: await page.locator('#pslk-dov-in').inputValue().catch(()=>'')
  };

  /* Dovanos perziura */
  await page.evaluate(()=>{ document.querySelector('.pslk-dovk').click(); });
  await page.waitForTimeout(600);
  out.t5_perziura = {
    langas_matomas: await page.locator('#pslk-pz.rodo').count(),
    pav: await page.locator('#pslk-pz-pav').textContent().catch(()=>''),
    zenklas: await page.locator('#pslk-pz-b').textContent().catch(()=>''),
    kaina: await page.locator('#pslk-pz-kaina').textContent().catch(()=>'')
  };
  await page.evaluate(()=>{ document.querySelector('.pslk-pz-x').click(); });
  await page.waitForTimeout(400);

  /* Į krepšelį */
  await page.evaluate(()=>{ document.getElementById('pslk-cta').click(); });
  await page.waitForTimeout(4000);
  await page.goto(WP+'/cart/',{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(2500);
  const krTekstas = await page.locator('.woocommerce-cart-form, .cart, table').first().innerText().catch(()=>'');
  out.t6_krepselis = {
    url: page.url(),
    yra_dovana: krTekstas.toLowerCase().includes('dovana'),
    yra_ausis: krTekstas.toLowerCase().includes('ausis'),
    tekstas: krTekstas.slice(0,1400)
  };

  /* Sumazinam zemiau ribos — ar dovana dingsta */
  out.jsKlaidos = jsKlaidos;
  await b.close();
}

let sha=null;
try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/pw117.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
const body={message:'rez',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) body.sha=sha;
const p=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/pw117.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
console.log('put',p.status);
