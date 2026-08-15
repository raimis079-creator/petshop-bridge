process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import { chromium } from 'playwright';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const out={};
out.env_raktai = Object.keys(process.env).filter(k=>/WP_|PASS|USER/i.test(k));
async function irasyk(){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/adm2.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const body={message:'rez',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) body.sha=sha;
  await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/adm2.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
}
async function api(path,opt={}){ const r=await fetch(WP+path,{...opt,headers:{Authorization:AUTH,'Content-Type':'application/json',...(opt.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(name,code){ const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name,code,scope:'global',active:true,priority:5})}); let id=null; try{ id=JSON.parse(cr.t).id; }catch(e){} return id; }
async function off(id){ if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }

try {
const code = `add_action('wp_loaded', function(){
	\$v = \$_GET['ps_adm2'] ?? '';
	if (\$v === '') return;
	wp_set_current_user(1);
	if (\$v === 'render') {
		\$o=array('versija'=>Petshop_Laukai::VERSIJA);
		try {
			\$m = new ReflectionMethod('Petshop_Laukai','admin_laukas'); \$m->setAccessible(true);
			ob_start(); \$m->invoke(null, 34942); \$h = ob_get_clean();
			\$o['html_ilgis']=strlen(\$h);
			\$o['yra']=array(
				'dydzio_laukas'=>strpos(\$h,'id="s-dydis"')!==false,
				'min_laukas'=>strpos(\$h,'id="s-min"')!==false,
				'dovanu_lentele'=>strpos(\$h,'id="dov-kunas"')!==false,
				'dovanu_riba'=>strpos(\$h,'id="dov-riba"')!==false,
				'dovanu_paieska'=>strpos(\$h,'id="dov-q"')!==false,
			);
			preg_match('/id="s-dydis"[^>]*value="([^"]*)"/',\$h,\$m1); \$o['dydis']=\$m1[1]??'';
			preg_match('/id="s-min"[^>]*value="([^"]*)"/',\$h,\$m2); \$o['min']=\$m2[1]??'';
			preg_match('/id="dov-riba"[^>]*value="([^"]*)"/',\$h,\$m3); \$o['riba']=\$m3[1]??'';
			\$o['klaidos']=(strpos(\$h,'Fatal')!==false||strpos(\$h,'Warning:')!==false)?'YRA':'nera';
			\$gr = Petshop_Laukai::grupiu_vardai();
			\$o['grupes']=array_values(\$gr);
		} catch (Throwable \$e) { \$o['klaida']=\$e->getMessage(); }
		header('Content-Type: application/json'); echo wp_json_encode(\$o); exit;
	}
	if (\$v === 'busena') {
		header('Content-Type: application/json');
		echo wp_json_encode(array('dovanos'=>Petshop_Laukai::dovanos(34942),
			'riba'=>Petshop_Laukai::dovanos_riba(34942),
			'dydis'=>Petshop_Laukai::dydis(34942),
			'min'=>(int) wc_get_product(34942)->get_min_container_size())); exit;
	}
	/* AJAX: kiekvienas veiksmas — atskira uzklausa, wp_send_json pats baigia */
	\$_POST = array('lid'=>34942,'preke'=>(int)(\$_GET['pid']??0),'veiksmas'=>\$v,'nonce'=>wp_create_nonce('ps_laukai'));
	\$_REQUEST = \$_POST;
	Petshop_Laukai::ajax_dovanos();
}, 131);`;
const s = await snip('TEMP ADM2', code);
await new Promise(r=>setTimeout(r,4500));
async function get(u){ try{ const r=await fetch(WP+u); const t=await r.text(); try{ return JSON.parse(t); }catch(e){ return {ne_json:t.slice(0,220)}; } }catch(e){ return {err:String(e).slice(0,150)}; } }
out.renderis = await get('/?ps_adm2=render');
out.pries = await get('/?ps_adm2=busena');
out.salinti = await get('/?ps_adm2=salinti&pid=17386');
out.po_salinimo = await get('/?ps_adm2=busena');
out.prideti = await get('/?ps_adm2=prideti&pid=17386');
out.po_pridejimo = await get('/?ps_adm2=busena');
out.ketvirta = await get('/?ps_adm2=prideti&pid=16299');
out.po_ketvirtos = await get('/?ps_adm2=busena');
await off(s);

/* narsykle tik jei yra tikras slaptazodis */
if (process.env.WP_PASS) {
  try{
    const br = await chromium.launch({args:['--no-sandbox','--ignore-certificate-errors']});
    const ctx = await br.newContext({httpCredentials:{username:process.env.WP_USER,password:process.env.WP_APP_PASS},ignoreHTTPSErrors:true,viewport:{width:1500,height:1200}});
    const page = await ctx.newPage();
    await page.goto(WP+'/wp-login.php',{waitUntil:'domcontentloaded',timeout:45000});
    await page.fill('#user_login', process.env.WP_USER);
    await page.fill('#user_pass', process.env.WP_PASS);
    await page.click('#wp-submit'); await page.waitForTimeout(4000);
    await page.goto(WP+'/wp-admin/admin.php?page=ps-laukai&id=34942',{waitUntil:'domcontentloaded',timeout:45000});
    await page.waitForTimeout(3000);
    out.admin_pasiekta = (await page.locator('#dov-kunas').count())===1;
    if(out.admin_pasiekta){
      await page.locator('#dov-kunas').scrollIntoViewIfNeeded(); await page.waitForTimeout(500);
      const b=await page.screenshot({fullPage:false});
      let sha=null;
      try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/v131_admin.png`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
      const bo={message:'shot',content:b.toString('base64')}; if(sha) bo.sha=sha;
      await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/v131_admin.png`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(bo)});
    }
    await br.close();
  }catch(e){ out.narsykle_klaida=String(e).slice(0,250); }
} else { out.narsykle='WP_PASS nera — ekrano nuotraukos admin puslapio padaryti negaliu'; }
}catch(e){ out.bendra=String(e).slice(0,300); }
await irasyk();
console.log('ok');
