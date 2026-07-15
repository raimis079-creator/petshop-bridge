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
	if ( ! isset($_GET['ps_th']) || $_GET['ps_th'] !== 'Th3Me7Qq' ) { return; }
	$o = array();
	$o['child'] = get_stylesheet_directory();
	$o['child_woo_exists'] = is_dir(get_stylesheet_directory().'/woocommerce');
	$o['child_myaccount'] = is_dir(get_stylesheet_directory().'/woocommerce/myaccount');
	$o['child_form_login'] = file_exists(get_stylesheet_directory().'/woocommerce/myaccount/form-login.php');
	$parent = get_template_directory();
	$o['flatsome_form_login'] = file_exists($parent.'/woocommerce/myaccount/form-login.php');
	$wc = WP_PLUGIN_DIR.'/woocommerce/templates/myaccount/form-login.php';
	$o['wc_form_login'] = file_exists($wc);
	// Kuris realiai naudojamas
	if (function_exists('wc_locate_template')) $o['located'] = wc_locate_template('myaccount/form-login.php');
	// registracija ijungta?
	$o['registration_enabled'] = get_option('woocommerce_enable_myaccount_registration');
	$o['writable_child'] = is_writable(get_stylesheet_directory());
	header('Content-Type: application/json'); echo wp_json_encode($o); exit;
});`;
fs.writeFileSync('/tmp/snip.json', JSON.stringify({ name:'TEMP M8 Theme', code:php, scope:'global', active:true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/snip.json "${API}"`);
const r = sh('curl -sk --max-time 30 "https://dev.avesa.lt/?ps_th=Th3Me7Qq"');
try { out.p = JSON.parse(r); } catch(e){ out.raw = r.slice(0,400); }
const kphp = `add_action('wp_loaded', function(){ if(!isset($_GET['ps_kv'])||$_GET['ps_kv']!=='Rr3Ww8Yy'){return;} global $wpdb; $n=$wpdb->query("DELETE FROM {$wpdb->prefix}snippets WHERE name LIKE 'TEMP M8%'"); echo wp_json_encode(array('d'=>$n)); exit; });`;
fs.writeFileSync('/tmp/k.json', JSON.stringify({ name:'TEMP M8 Kill vV', code:kphp, scope:'global', active:true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/k.json "${API}"`);
sh('curl -sk --max-time 25 "https://dev.avesa.lt/?ps_kv=Rr3Ww8Yy"');
ghPut('screenshots/m8_theme.json', Buffer.from(JSON.stringify(out)), 'theme');
console.log('DONE');
