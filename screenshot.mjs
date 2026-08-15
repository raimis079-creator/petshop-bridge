process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
import { chromium } from 'playwright';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const out={};
async function irasyk(){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/vis.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const body={message:'rez',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) body.sha=sha;
  await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/vis.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
}
async function api(path,opt={}){ const r=await fetch(WP+path,{...opt,headers:{Authorization:AUTH,'Content-Type':'application/json',...(opt.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(name,code){ const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name,code,scope:'global',active:true,priority:5})}); let id=null; try{ id=JSON.parse(cr.t).id; }catch(e){} return id; }
async function off(id){ if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }
try{
const b64 = fs.readFileSync('deploy/petshop-laukai.php').toString('base64');
const sS = await snip('TEMP SET 142', `add_action('wp_loaded', function(){
	if ((\$_GET['ps_s142'] ?? '') !== 'S142x') return;
	update_option('ps_l_b64_142','${b64}',false);
	header('Content-Type: application/json'); echo wp_json_encode(array('ok'=>1)); exit; }, 131);`);
await new Promise(r=>setTimeout(r,4500));
try{ out.set = await (await fetch(WP+'/?ps_s142=S142x')).json(); }catch(e){}
await off(sS); await new Promise(r=>setTimeout(r,3000));
const sD = await snip('TEMP DEP 142', `add_action('wp_loaded', function(){
	if ((\$_GET['ps_d142'] ?? '') !== 'D142x') return;
	\$o=array(); \$b=get_option('ps_l_b64_142');
	if(!\$b){ \$o['klaida']='tuscia'; }
	else { \$k=base64_decode(\$b);
		try { token_get_all(\$k, TOKEN_PARSE); \$o['sintakse']='OK';
			\$kl=WPMU_PLUGIN_DIR.'/petshop-laukai.php';
			file_put_contents(\$kl,\$k); clearstatcache(true,\$kl);
			\$o['sutampa']=(md5_file(\$kl)===md5(\$k));
		} catch (ParseError \$e){ \$o['sintakse']='KLAIDA: '.\$e->getMessage(); }
		delete_option('ps_l_b64_142'); }
	header('Content-Type: application/json'); echo wp_json_encode(\$o); exit; }, 131);`);
await new Promise(r=>setTimeout(r,4500));
try{ out.diegimas = await (await fetch(WP+'/?ps_d142=D142x')).json(); }catch(e){}
await off(sD); await new Promise(r=>setTimeout(r,2500));

/* sutvarkom visas grupes */
const sV = await snip('TEMP VIS 142', `add_action('wp_loaded', function(){
	if ((\$_GET['ps_v142'] ?? '') !== 'V142x') return;
	\$o=array('versija'=>Petshop_Laukai::VERSIJA,'pakeista'=>array(),'busena'=>array());
	foreach (array('kons_sunims','kons_kates','sunys','kates','kramtalai') as \$g) {
		\$o['pakeista'][\$g] = Petshop_Laukai::sutvarkyti_matomuma(\$g);
	}
	\$q = new WP_Query(array('post_type'=>'product','post_status'=>array('publish','draft'),
		'posts_per_page'=>60,'fields'=>'ids','meta_query'=>array(array('key'=>'_ps_laukas','value'=>'yes'))));
	foreach (\$q->posts as \$id) {
		\$p = wc_get_product(\$id); if(!\$p) continue;
		\$o['busena'][] = array((int)\$id, get_the_title(\$id), Petshop_Laukai::grupe(\$id),
			\$p->get_catalog_visibility(), get_post_status(\$id));
	}
	header('Content-Type: application/json'); echo wp_json_encode(\$o); exit; }, 131);`);
await new Promise(r=>setTimeout(r,4500));
try{ out.tvarkymas = await (await fetch(WP+'/?ps_v142=V142x')).json(); }catch(e){ out.tv_err=String(e).slice(0,180); }
await off(sV); await new Promise(r=>setTimeout(r,2000));

/* kategorijos puslapis — kiek deziu matoma */
const br = await chromium.launch({args:['--no-sandbox','--ignore-certificate-errors']});
const ctx = await br.newContext({httpCredentials:{username:process.env.WP_USER,password:process.env.WP_APP_PASS},ignoreHTTPSErrors:true,viewport:{width:1500,height:1100}});
const page = await ctx.newPage();
for (const [pav,kelias] of Object.entries({
  'skanestai-sunims':'/kategorija/sunims/skanestai-sunims/',
  'konservai-sunims':'/kategorija/sunims/maistas-sunims/konservai-sunims/'
})) {
  await page.goto(WP+kelias,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(3000);
  const t = await page.locator('body').innerText();
  out['kat_'+pav] = {
    deziu_pavadinimu: (t.match(/dėžė šuniui|dėžutė katei|Konservu deze|deze katei/gi)||[]).length,
    rasti: (t.match(/(Skanėstų dėžė[^\n]{0,40}|Skanėstų dėžutė[^\n]{0,20}|Konservu deze[^\n]{0,40})/gi)||[]).slice(0,8)
  };
}
await br.close();
}catch(e){ out.bendra=String(e).slice(0,250); }
await irasyk();
console.log('ok');
