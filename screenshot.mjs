import { execSync } from 'child_process';
import fs from 'fs';
const TOKG = process.env.GH_TOKEN;
function ghPut(path, buf, msg) {
  const url = `https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/${path}`;
  let sha=''; try { const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${url}"`).toString()); if(j.sha) sha=j.sha; } catch(e){}
  fs.writeFileSync('/tmp/p.json', JSON.stringify({ message: msg, content: buf.toString('base64'), ...(sha?{sha}:{}) }));
  execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${url}"`, {maxBuffer:20*1024*1024});
}
function sh(c){ try { return execSync(c,{maxBuffer:20*1024*1024}).toString(); } catch(e){ return 'ERR:'+(e.message||'').slice(0,300); } }
const AUTH = Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').replace(/\s+/g,'')).toString('base64');
const API = 'https://dev.avesa.lt/wp-json/code-snippets/v1/snippets';
const out = {};

const php = `
add_action('wp_loaded', function(){
	if ( ! isset($_GET['ps_m8ev']) || $_GET['ps_m8ev'] !== 'Ld6Mc2Nq' ) { return; }
	global $wpdb;
	$o = array();
	$o['all_ps_tables'] = $wpdb->get_col("SHOW TABLES LIKE '{$wpdb->prefix}ps%'");
	$t = $wpdb->prefix . 'ps_event_log';
	$o['count'] = $wpdb->get_var("SELECT COUNT(*) FROM {$t}");
	$o['last_error_wpdb'] = $wpdb->last_error;
	$o['rows'] = $wpdb->get_results("SELECT id,event_id,event_name,email,status,attempts,last_error,emitted_at FROM {$t} ORDER BY id DESC LIMIT 8", ARRAY_A);
	$o['rows_err'] = $wpdb->last_error;
	// Emitteriu failas
	$f = WP_PLUGIN_DIR . '/petshop-core/includes/class-event-emitters.php';
	$o['emitters_b64'] = file_exists($f) ? base64_encode(file_get_contents($f)) : 'MISSING';
	// Ar yra hookas
	$o['hooks_pet_created'] = array();
	global $wp_filter;
	foreach (array('petshop_pet_profile_created','petshop_pet_created','ps_pet_created') as $h) {
		$o['hooks_pet_created'][$h] = isset($wp_filter[$h]) ? count($wp_filter[$h]->callbacks) : 0;
	}
	// Ar Sender adapteris/opcijos
	$o['sender_opts'] = array();
	foreach (array('petshop_sender_api_key','petshop_esp_production_mode','petshop_sender_enabled','ps_sender_api_key') as $k) {
		$v = get_option($k, '__NONE__');
		$o['sender_opts'][$k] = ($v === '__NONE__') ? 'NEBUVO' : (is_string($v) && strlen($v)>8 ? substr($v,0,4).'…('.strlen($v).')' : var_export($v,true));
	}
	header('Content-Type: application/json'); echo wp_json_encode($o); exit;
});`;
fs.writeFileSync('/tmp/snip.json', JSON.stringify({ name: 'TEMP M8 EventProbe v1', code: php, scope: 'global', active: true }));
const create = sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/snip.json "${API}"`);
try { out.snip = JSON.parse(create).id; } catch(e){ out.create_raw = create.slice(0,300); }
const res = sh('curl -sk --max-time 30 "https://dev.avesa.lt/?ps_m8ev=Ld6Mc2Nq"');
try { out.probe = JSON.parse(res); } catch(e){ out.raw = res.slice(0,600); }
// valymas
out.clean = sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d '{"name":"TEMP M8 Cleaner2","code":"add_action(\\'wp_loaded\\',function(){global \\$wpdb;\\$wpdb->query(\\"DELETE FROM {\\$wpdb->prefix}snippets WHERE name LIKE \\'TEMP M8%\\'\\");});","scope":"global","active":true}' "${API}"`).slice(0,150);
sh('curl -sk --max-time 20 "https://dev.avesa.lt/"');
const list = sh(`curl -sk -H "Authorization: Basic ${AUTH}" "${API}"`);
try { out.remaining = JSON.parse(list).filter(s=>/TEMP M8/i.test(s.name)).map(s=>s.id+':'+s.name); } catch(e){ out.remaining='err'; }
ghPut('screenshots/m8_evprobe.json', Buffer.from(JSON.stringify(out)), 'm8 event probe');
console.log('DONE');
