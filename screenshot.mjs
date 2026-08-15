process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const out={};
async function api(path,opt={}){ const r=await fetch(WP+path,{...opt,headers:{Authorization:AUTH,'Content-Type':'application/json',...(opt.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(name,code){ const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name,code,scope:'global',active:true,priority:5})}); let id=null; try{ id=JSON.parse(cr.t).id; }catch(e){} return id; }
async function off(id){ if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }
const s = await snip('TEMP ATAS', `add_action('wp_loaded', function(){
	if ((\$_GET['ps_atas'] ?? '') !== 'A1x') return;
	\$o=array();
	/* 1) kur gyvena ataskaitos */
	\$f = WPMU_PLUGIN_DIR.'/petshop-pardavimai.php';
	if (file_exists(\$f)) {
		\$t = file_get_contents(\$f);
		preg_match('/const VERSIJA\\\\s*=\\\\s*[\\\\'"]([^\\\\'"]+)/', \$t, \$v);
		\$o['pardavimai'] = array('versija'=>\$v[1] ?? '?', 'dydis'=>round(strlen(\$t)/1024).' KB');
		preg_match_all('/add_submenu_page\\\\(\\\\s*[^,]+,\\\\s*[\\\\'"]([^\\\\'"]+)[\\\\'"],\\\\s*[\\\\'"]([^\\\\'"]+)/', \$t, \$m);
		\$o['pardavimai']['meniu'] = array_map(null, \$m[1], \$m[2]);
		preg_match_all('/function\\\\s+([a-z_0-9]+)\\\\s*\\\\(/i', \$t, \$fn);
		\$o['pardavimai']['funkcijos'] = array_slice(\$fn[1], 0, 40);
		preg_match_all('/[\\\\'"]([a-z_]*skirtuk[a-z_]*|tab)[\\\\'"]\\\\s*=>/i', \$t, \$sk);
		\$o['pardavimai']['skirtukai_uzuomina'] = array_slice(\$sk[1],0,10);
	} else { \$o['pardavimai']='NERA FAILO'; }
	/* 2) visi meniu punktai su „ataskait" */
	global \$submenu, \$menu;
	\$o['meniu_medis']=array();
	if (is_array(\$menu)) foreach (\$menu as \$mm) {
		if (empty(\$mm[0])) continue;
		\$pav = wp_strip_all_tags(\$mm[0]);
		if (stripos(\$pav,'petshop')===false) continue;
		\$vaikai = array();
		if (!empty(\$submenu[\$mm[2]])) foreach (\$submenu[\$mm[2]] as \$sm) { \$vaikai[] = wp_strip_all_tags(\$sm[0]).' | '.\$sm[2]; }
		\$o['meniu_medis'][\$pav] = \$vaikai;
	}
	/* 3) ar yra ivykiu lenteliu */
	global \$wpdb;
	\$lent = \$wpdb->get_col("SHOW TABLES LIKE '{\$wpdb->prefix}ps%'");
	\$o['ps_lenteles'] = \$lent;
	foreach (\$lent as \$l) {
		\$o['eiluciu'][\$l] = (int) \$wpdb->get_var("SELECT COUNT(*) FROM \$l");
	}
	/* 4) MnM lentele — pardavimu analizei */
	\$o['mnm_yra'] = (bool) \$wpdb->get_var("SHOW TABLES LIKE '{\$wpdb->prefix}wc_mnm_child_items'");
	/* 5) kiek uzsakymu dev'e */
	\$o['uzsakymu'] = (int) \$wpdb->get_var("SELECT COUNT(*) FROM {\$wpdb->prefix}posts WHERE post_type='shop_order'");
	\$o['uzsakymu_hpos'] = (int) \$wpdb->get_var("SELECT COUNT(*) FROM {\$wpdb->prefix}wc_orders");
	header('Content-Type: application/json'); echo wp_json_encode(\$o); exit; }, 131);`);
await new Promise(r=>setTimeout(r,4500));
try{ out.r = JSON.parse(await (await fetch(WP+'/?ps_atas=A1x')).text()); }catch(e){ out.e=String(e).slice(0,250); }
await off(s);
let sha=null;
try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/atas.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
const body={message:'rez',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) body.sha=sha;
await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/atas.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
console.log('ok');
