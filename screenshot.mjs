import { execSync } from 'child_process';
import fs from 'fs';
const TOKG = process.env.GH_TOKEN;
function ghPut(p, buf, m) {
  const url = `https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/${p}`;
  let sha=''; try { const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${url}"`).toString()); if(j.sha) sha=j.sha; } catch(e){}
  fs.writeFileSync('/tmp/p.json', JSON.stringify({ message: m, content: buf.toString('base64'), ...(sha?{sha}:{}) }));
  execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${url}"`, {maxBuffer:20*1024*1024});
}
function sh(c){ try { return execSync(c,{maxBuffer:20*1024*1024}).toString(); } catch(e){ return 'ERR'; } }
const AUTH = Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').replace(/\s+/g,'')).toString('base64');
const API = 'https://dev.avesa.lt/wp-json/code-snippets/v1/snippets';
const out = {};
const php = `
add_action('wp_loaded', function(){
	if ( ! isset($_GET['ps_col']) || $_GET['ps_col'] !== 'Cl3Mm7Nn' ) { return; }
	global $wpdb;
	$o = array();
	$o['cols_before'] = $wpdb->get_col("SHOW COLUMNS FROM {$wpdb->prefix}ps_pets", 0);
	$o['has_new'] = array_values(array_intersect($o['cols_before'], array('primary_product_sku','primary_product_name','primary_product_package')));
	// Ar naujas failas jau uzkrautas?
	$src = file_get_contents(WP_PLUGIN_DIR.'/petshop-core/includes/class-pet-profile.php');
	$o['file_has_new_cols'] = strpos($src, 'primary_product_sku') !== false;
	// Priverstinai migruojam DABAR (naujas failas jau turetu buti uzkrautas siame requeste)
	if ( class_exists('Petshop_Pet_Profile') ) {
		$r = new ReflectionMethod('Petshop_Pet_Profile','ensure_columns');
		$r->setAccessible(true);
		$r->invoke(null);
		$o['migration_run'] = true;
	}
	$o['cols_after'] = $wpdb->get_col("SHOW COLUMNS FROM {$wpdb->prefix}ps_pets", 0);
	$o['has_new_after'] = array_values(array_intersect($o['cols_after'], array('primary_product_sku','primary_product_name','primary_product_package')));
	$o['last_db_error'] = $wpdb->last_error;
	header('Content-Type: application/json'); echo wp_json_encode($o); exit;
});`;
fs.writeFileSync('/tmp/snip.json', JSON.stringify({ name:'TEMP M8 Col', code:php, scope:'global', active:true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/snip.json "${API}"`);
const r = sh('curl -sk --max-time 40 "https://dev.avesa.lt/?ps_col=Cl3Mm7Nn"');
try { out.p = JSON.parse(r); } catch(e){ out.raw = r.slice(0,300); }

// KRITINIS TESTAS: ar augintinio kurimas dar veikia?
const php2 = `
add_action('wp_loaded', function(){
	if ( ! isset($_GET['ps_ct']) || $_GET['ps_ct'] !== 'Ct5Bb9Vv' ) { return; }
	$l='colt_'.wp_rand(10000,99999);
	$uid=wp_create_user($l, wp_generate_password(24), $l.'@gyvunai.lt');
	if (is_wp_error($uid)) { echo 'ERR'; exit; }
	(new WP_User($uid))->set_role('customer');
	wp_set_current_user($uid);
	$req = new WP_REST_Request('POST', '/petshop/v1/pet-profile');
	$req->set_param('species','dog');
	$req->set_param('pet_name','ColTest');
	$req->set_param('life_stage','adult');
	$resp = rest_do_request($req);
	$data = $resp->get_data();
	global $wpdb;
	$o = array('status'=>$resp->get_status(), 'data'=>$data, 'db_error'=>$wpdb->last_error);
	require_once ABSPATH.'wp-admin/includes/user.php';
	wp_delete_user($uid);
	header('Content-Type: application/json'); echo wp_json_encode($o); exit;
});`;
fs.writeFileSync('/tmp/s2.json', JSON.stringify({ name:'TEMP M8 CT', code:php2, scope:'global', active:true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/s2.json "${API}"`);
const c = sh('curl -sk --max-time 40 "https://dev.avesa.lt/?ps_ct=Ct5Bb9Vv"');
try { out.create = JSON.parse(c); } catch(e){ out.create_raw = c.slice(0,400); }

const kphp = `add_action('wp_loaded', function(){ if(!isset($_GET['ps_k8'])||$_GET['ps_k8']!=='Rr3Ww8Yy'){return;} global $wpdb; $n=$wpdb->query("DELETE FROM {$wpdb->prefix}snippets WHERE name LIKE 'TEMP M8%'"); echo wp_json_encode(array('d'=>$n)); exit; });`;
fs.writeFileSync('/tmp/k.json', JSON.stringify({ name:'TEMP M8 Kill w8', code:kphp, scope:'global', active:true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/k.json "${API}"`);
sh('curl -sk --max-time 25 "https://dev.avesa.lt/?ps_k8=Rr3Ww8Yy"');
ghPut('screenshots/m8_col.json', Buffer.from(JSON.stringify(out)), 'col');
console.log('DONE');
