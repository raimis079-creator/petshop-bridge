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
	if ( ! isset($_GET['ps_m8reg']) || $_GET['ps_m8reg'] !== 'Vv2Ss6Tt' ) { return; }
	$o = array();
	// Visi petshop pluginai + failai
	$o['plugins'] = array();
	foreach (glob(WP_PLUGIN_DIR.'/petshop-*', GLOB_ONLYDIR)?:array() as $d) {
		$name = basename($d);
		$files = array();
		foreach (array_merge(glob($d.'/*.php')?:array(), glob($d.'/includes/*.php')?:array(), glob($d.'/includes/**/*.php')?:array()) as $f) $files[] = str_replace($d.'/','',$f);
		$o['plugins'][$name] = $files;
	}
	// Grep: kas siuncia i Sender / subscriber
	$o['sender_hits'] = array();
	foreach (glob(WP_PLUGIN_DIR.'/petshop-*', GLOB_ONLYDIR)?:array() as $d) {
		foreach (array_merge(glob($d.'/*.php')?:array(), glob($d.'/includes/*.php')?:array()) as $f) {
			$c = file_get_contents($f);
			if (stripos($c,'subscriber')!==false || stripos($c,'sender.net')!==false || stripos($c,'api.sender')!==false) {
				$o['sender_hits'][] = str_replace(WP_PLUGIN_DIR,'',$f);
			}
		}
	}
	// Failai
	$want = array(
		'registry' => WP_PLUGIN_DIR.'/petshop-core/includes/class-event-registry.php',
		'iface'    => WP_PLUGIN_DIR.'/petshop-core/includes/interface-message-provider.php',
	);
	foreach ($want as $k=>$f) $o[$k.'_b64'] = file_exists($f) ? base64_encode(file_get_contents($f)) : 'MISSING';
	header('Content-Type: application/json'); echo wp_json_encode($o); exit;
});`;
fs.writeFileSync('/tmp/snip.json', JSON.stringify({ name: 'TEMP M8 RegProbe v1', code: php, scope: 'global', active: true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/snip.json "${API}"`);
const res = sh('curl -sk --max-time 30 "https://dev.avesa.lt/?ps_m8reg=Vv2Ss6Tt"');
try { out.probe = JSON.parse(res); } catch(e){ out.raw = res.slice(0,600); }
// kill
const kphp = `add_action('wp_loaded', function(){ if(!isset($_GET['ps_m8kill2'])||$_GET['ps_m8kill2']!=='Rr3Ww8Yy'){return;} global $wpdb; $n=$wpdb->query("DELETE FROM {$wpdb->prefix}snippets WHERE name LIKE 'TEMP M8%'"); header('Content-Type: application/json'); echo wp_json_encode(array('deleted'=>$n)); exit; });`;
fs.writeFileSync('/tmp/k.json', JSON.stringify({ name: 'TEMP M8 Kill v2', code: kphp, scope: 'global', active: true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/k.json "${API}"`);
out.kill = sh('curl -sk --max-time 25 "https://dev.avesa.lt/?ps_m8kill2=Rr3Ww8Yy"').slice(0,120);
const list = sh(`curl -sk -H "Authorization: Basic ${AUTH}" "${API}"`);
try { out.remaining = JSON.parse(list).filter(s=>/TEMP M8/i.test(s.name)).length; } catch(e){ out.remaining='err'; }
ghPut('screenshots/m8_regprobe.json', Buffer.from(JSON.stringify(out)), 'm8 reg probe');
console.log('DONE');
