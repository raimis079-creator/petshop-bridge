import { execSync } from 'child_process';
import fs from 'fs';

function putResult(name, obj) {
  const tok = process.env.GH_TOKEN;
  const url = `https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/screenshots/${name}`;
  let sha = '';
  try { const j = JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${tok}" "${url}"`).toString()); if (j.sha) sha = j.sha; } catch(e) {}
  const content = Buffer.from(JSON.stringify(obj)).toString('base64');
  fs.writeFileSync('/tmp/p.json', JSON.stringify({ message: `r ${name}`, content, ...(sha?{sha}:{}) }));
  execSync(`curl -s -X PUT -H "Authorization: Bearer ${tok}" -d @/tmp/p.json "${url}"`);
}
function sh(c, env){ try { return execSync(c,{maxBuffer:30*1024*1024, env: {...process.env, ...(env||{})}}).toString(); } catch(e){ return 'ERR:'+(e.message||'').slice(0,400); } }

const WP_USER = (process.env.WP_USER||'').trim();
const WP_PASS = (process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH = Buffer.from(WP_USER+':'+WP_PASS).toString('base64');
const API = 'https://dev.avesa.lt/wp-json/code-snippets/v1/snippets';
const out = { ts: new Date().toISOString() };

// PHP probe kodas (be <?php, code-snippets konvencija)
const php = `
add_action('wp_loaded', function(){
	if ( ! isset($_GET['ps_m8probe']) || $_GET['ps_m8probe'] !== 'K9x2Vq7f' ) { return; }
	global $wpdb;
	$out = array();
	$base = WP_PLUGIN_DIR . '/petshop-core/';
	$out['files'] = array();
	foreach (array_merge(glob($base.'*.php')?:array(), glob($base.'includes/*.php')?:array(), glob($base.'assets/*')?:array()) as $f) $out['files'][] = str_replace($base,'',$f);
	$ui = $base.'includes/class-pet-ui.php';
	$out['pet_ui_b64'] = file_exists($ui) ? base64_encode(file_get_contents($ui)) : 'MISSING';
	$mainf = $base.'petshop-core.php';
	$out['main_head'] = file_exists($mainf) ? substr(file_get_contents($mainf),0,800) : 'MISSING';
	$eps = $GLOBALS['wp_rewrite']->endpoints;
	$out['rewrite_endpoints'] = array();
	if (is_array($eps)) foreach ($eps as $e) $out['rewrite_endpoints'][] = $e[1];
	$t = $wpdb->prefix.'ps_event_log';
	$out['esp_table'] = (bool)$wpdb->get_var($wpdb->prepare('SHOW TABLES LIKE %s',$t));
	if ($out['esp_table']) {
		$out['esp_rows'] = $wpdb->get_results("SELECT event_id,event_name,email,status,attempts,reason,last_error,created_at FROM {$t} ORDER BY created_at DESC LIMIT 25", ARRAY_A);
	}
	$out['nr_hits'] = array();
	foreach (glob(WP_PLUGIN_DIR.'/petshop-*', GLOB_ONLYDIR)?:array() as $dir) {
		$phps = array_merge(glob($dir.'/*.php')?:array(), glob($dir.'/includes/*.php')?:array());
		foreach ($phps as $f) {
			$c = file_get_contents($f);
			if (strpos($c,'non_retriable')!==false) {
				$lines = explode("\\n",$c);
				foreach ($lines as $i=>$l) if (strpos($l,'non_retriable')!==false) $out['nr_hits'][] = str_replace(WP_PLUGIN_DIR,'',$f).':'.($i+1).': '.trim(substr($l,0,200));
			}
		}
	}
	header('Content-Type: application/json');
	echo wp_json_encode($out);
	exit;
});`;

// 1. Sukuriam + aktyvuojam snippet
fs.writeFileSync('/tmp/snip.json', JSON.stringify({ name: 'TEMP M8 Probe v1 (read-only)', code: php, scope: 'global', active: true, desc: 'TEMP - istrinti po naudojimo' }));
const create = sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/snip.json "${API}"`);
let snipId = 0;
try { const j = JSON.parse(create); snipId = j.id || 0; out.snippet_created = snipId; if(!snipId) out.create_raw = create.slice(0,500); } catch(e) { out.create_raw = create.slice(0,500); }

if (snipId) {
	// 2. Vykdom probe
	const probe = sh('curl -sk --max-time 30 "https://dev.avesa.lt/?ps_m8probe=K9x2Vq7f"');
	try { out.probe = JSON.parse(probe); } catch(e) { out.probe_raw = probe.slice(0,800); }
	// 3. ISTRINAM snippet (higiena)
	const del = sh(`curl -sk -X DELETE -H "Authorization: Basic ${AUTH}" "${API}/${snipId}"`);
	out.snippet_deleted = del.slice(0,200);
	// patikra kad istrintas
	const chk = sh(`curl -sk -o /dev/null -w "%{http_code}" -H "Authorization: Basic ${AUTH}" "${API}/${snipId}"`);
	out.delete_verify_code = chk;
}

putResult('m8_probe_1.json', out);
console.log('DONE');
