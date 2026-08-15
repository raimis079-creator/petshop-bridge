process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const out={};
async function api(path,opt={}){ const r=await fetch(WP+path,{...opt,headers:{Authorization:AUTH,'Content-Type':'application/json',...(opt.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(name,code){
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name,code,scope:'global',active:true,priority:5})});
  let id=null; try{ id=JSON.parse(cr.t).id; }catch(e){}
  return {status:cr.s,id};
}
async function off(id){ if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }

const failas = fs.readFileSync('deploy/petshop-laukai.php');
const b64 = failas.toString('base64');
out.failo_dydis = failas.length;
out.b64_ilgis = b64.length;

/* 1) SETTER — irašo base64 i option */
const setterCode = `add_action('wp_loaded', function(){
	if ((\$_GET['ps_set116'] ?? '') !== 'Set116x') return;
	\$b = '${b64}';
	update_option('ps_laukai_b64_116', \$b, false);
	header('Content-Type: application/json');
	echo wp_json_encode(array('irasyta'=>strlen(\$b), 'md5_b64'=>md5(\$b)));
	exit;
}, 131);`;
const s1 = await snip('TEMP LAUKAI SET 116', setterCode);
out.setter = s1;
await new Promise(r=>setTimeout(r,4000));
try{ const r=await fetch(WP+'/?ps_set116=Set116x'); out.set_http=r.status; const t=await r.text();
  try{ out.set_rez=JSON.parse(t); }catch(e){ out.set_raw=t.slice(0,600); } }catch(e){ out.set_err=String(e).slice(0,200); }
await off(s1.id);
await new Promise(r=>setTimeout(r,3000));

/* 2) DEPLOY — nuskaito option, sintakses sargas, rašo faila */
const deployCode = `add_action('wp_loaded', function(){
	if ((\$_GET['ps_dep116'] ?? '') !== 'Dep116x') return;
	\$o = array();
	\$b = get_option('ps_laukai_b64_116');
	if (!\$b) { \$o['klaida']='option tuscias'; }
	else {
		\$kodas = base64_decode(\$b);
		\$o['dekoduota'] = strlen(\$kodas);
		\$o['md5_naujas'] = md5(\$kodas);
		try {
			token_get_all(\$kodas, TOKEN_PARSE);
			\$o['sintakse'] = 'OK';
			\$kelias = WPMU_PLUGIN_DIR . '/petshop-laukai.php';
			\$o['senas_md5'] = file_exists(\$kelias) ? md5_file(\$kelias) : 'nera';
			\$n = file_put_contents(\$kelias, \$kodas);
			clearstatcache(true, \$kelias);
			\$o['irasyta'] = \$n;
			\$o['failo_md5_po'] = md5_file(\$kelias);
			\$o['sutampa'] = (md5_file(\$kelias) === md5(\$kodas));
		} catch (ParseError \$e) {
			\$o['sintakse'] = 'KLAIDA: ' . \$e->getMessage();
			\$o['irasyta'] = 'NEIRASYTA — failas nepaliestas';
		}
		delete_option('ps_laukai_b64_116');
	}
	header('Content-Type: application/json'); echo wp_json_encode(\$o); exit;
}, 131);`;
const s2 = await snip('TEMP LAUKAI DEPLOY 116', deployCode);
out.deploy = s2;
await new Promise(r=>setTimeout(r,4000));
try{ const r=await fetch(WP+'/?ps_dep116=Dep116x'); out.dep_http=r.status; const t=await r.text();
  try{ out.dep_rez=JSON.parse(t); }catch(e){ out.dep_raw=t.slice(0,900); } }catch(e){ out.dep_err=String(e).slice(0,200); }
await off(s2.id);
await new Promise(r=>setTimeout(r,2500));

/* 3) PATIKRA — ar klase pakelta i 1.16 ir ar naujos funkcijos gyvos */
const tikCode = `add_action('wp_loaded', function(){
	if ((\$_GET['ps_tik116'] ?? '') !== 'Tik116x') return;
	\$o = array('klase' => class_exists('Petshop_Laukai'));
	if (class_exists('Petshop_Laukai')) {
		\$o['versija'] = Petshop_Laukai::VERSIJA;
		foreach (array('dovanos_riba','dovanos','dydis','su_dovana','sinchronizuoti_dovanas','dovanos_kaina') as \$f) {
			\$o['metodai'][\$f] = method_exists('Petshop_Laukai', \$f);
		}
		\$o['konstantos'] = array(
			'META_DOVANOS'  => defined('Petshop_Laukai::META_DOVANOS')  ? Petshop_Laukai::META_DOVANOS  : 'NERA',
			'META_DOV_RIBA' => defined('Petshop_Laukai::META_DOV_RIBA') ? Petshop_Laukai::META_DOV_RIBA : 'NERA',
			'META_DYDIS'    => defined('Petshop_Laukai::META_DYDIS')    ? Petshop_Laukai::META_DYDIS    : 'NERA',
		);
		\$o['kabliukai'] = array(
			'add_cart_item_data' => has_filter('woocommerce_add_cart_item_data', array('Petshop_Laukai','dovana_i_krepseli')),
			'add_to_cart'        => has_action('woocommerce_add_to_cart', array('Petshop_Laukai','sinchronizuoti_dovanas')),
			'dovanos_kaina'      => has_action('woocommerce_before_calculate_totals', array('Petshop_Laukai','dovanos_kaina')),
		);
		/* esami laukai — ar seni skanestu rinkiniai nesugriuvo */
		\$q = get_posts(array('post_type'=>'product','post_status'=>array('publish','draft'),'numberposts'=>-1,'fields'=>'ids',
			'meta_query'=>array(array('key'=>'_ps_laukas','value'=>'yes'))));
		\$o['laukai_viso'] = count(\$q);
		foreach (\$q as \$lid) {
			\$o['laukai'][] = array('id'=>(int)\$lid, 'pav'=>get_the_title(\$lid),
				'pakopos'=>count(Petshop_Laukai::pakopos(\$lid)),
				'su_dovana'=>Petshop_Laukai::su_dovana(\$lid),
				'dov_riba'=>Petshop_Laukai::dovanos_riba(\$lid));
		}
	}
	header('Content-Type: application/json'); echo wp_json_encode(\$o); exit;
}, 131);`;
const s3 = await snip('TEMP LAUKAI TIKRA 116', tikCode);
out.tikra = s3;
await new Promise(r=>setTimeout(r,4000));
try{ const r=await fetch(WP+'/?ps_tik116=Tik116x'); out.tik_http=r.status; const t=await r.text();
  try{ out.tik_rez=JSON.parse(t); }catch(e){ out.tik_raw=t.slice(0,900); } }catch(e){ out.tik_err=String(e).slice(0,200); }
await off(s3.id);

let sha=null;
try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/dep116.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
const body={message:'rez',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) body.sha=sha;
const p=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/dep116.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
console.log('put',p.status);
