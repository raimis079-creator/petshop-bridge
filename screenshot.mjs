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
	if ( ! isset($_GET['ps_m8fin']) || $_GET['ps_m8fin'] !== 'Jj9Kk5Ll' ) { return; }
	$o = array();
	// 1. Aplinka
	$o['PETSHOP_ENVIRONMENT_defined'] = defined('PETSHOP_ENVIRONMENT');
	$o['PETSHOP_ENVIRONMENT_value'] = defined('PETSHOP_ENVIRONMENT') ? PETSHOP_ENVIRONMENT : 'NEAPIBREZTA';
	$o['tokens_defined'] = array(
		'MARKETING' => defined('PETSHOP_SENDER_MARKETING_TOKEN'),
		'TRANSACTIONAL' => defined('PETSHOP_SENDER_TRANSACTIONAL_TOKEN'),
	);
	// 2. Ar upsert_contact kvieciamas KUR NORS visuose pluginuose + temoje
	$o['upsert_calls'] = array();
	$dirs = glob(WP_PLUGIN_DIR.'/petshop-*', GLOB_ONLYDIR) ?: array();
	$dirs[] = get_stylesheet_directory();
	foreach ($dirs as $d) {
		$files = array_merge(glob($d.'/*.php')?:array(), glob($d.'/includes/*.php')?:array(), glob($d.'/includes/*/*.php')?:array());
		foreach ($files as $f) {
			$c = file_get_contents($f);
			foreach (explode("\\n", $c) as $i=>$l) {
				if (strpos($l,'upsert_contact')!==false && strpos($l,'function upsert_contact')===false && strpos($l,'log_dev_blocked')===false) {
					$o['upsert_calls'][] = str_replace(array(WP_PLUGIN_DIR, get_stylesheet_directory()),array('','THEME'),$f).':'.($i+1).': '.trim(substr($l,0,120));
				}
			}
		}
	}
	// 3. ps_emit_event funkcijos vieta + ar joje upsert
	$o['ps_emit_event_file'] = '';
	foreach ($dirs as $d) {
		foreach (array_merge(glob($d.'/*.php')?:array(), glob($d.'/includes/*.php')?:array()) as $f) {
			$c = file_get_contents($f);
			if (strpos($c,'function ps_emit_event')!==false) { $o['ps_emit_event_file'] = str_replace(WP_PLUGIN_DIR,'',$f); $o['ps_emit_event_b64'] = base64_encode($c); }
		}
	}
	header('Content-Type: application/json'); echo wp_json_encode($o); exit;
});`;
fs.writeFileSync('/tmp/snip.json', JSON.stringify({ name: 'TEMP M8 FinProbe v1', code: php, scope: 'global', active: true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/snip.json "${API}"`);
const res = sh('curl -sk --max-time 30 "https://dev.avesa.lt/?ps_m8fin=Jj9Kk5Ll"');
try { out.probe = JSON.parse(res); } catch(e){ out.raw = res.slice(0,600); }
const kphp = `add_action('wp_loaded', function(){ if(!isset($_GET['ps_m8kill4'])||$_GET['ps_m8kill4']!=='Rr3Ww8Yy'){return;} global $wpdb; $n=$wpdb->query("DELETE FROM {$wpdb->prefix}snippets WHERE name LIKE 'TEMP M8%'"); header('Content-Type: application/json'); echo wp_json_encode(array('deleted'=>$n)); exit; });`;
fs.writeFileSync('/tmp/k.json', JSON.stringify({ name: 'TEMP M8 Kill v4', code: kphp, scope: 'global', active: true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/k.json "${API}"`);
out.kill = sh('curl -sk --max-time 25 "https://dev.avesa.lt/?ps_m8kill4=Rr3Ww8Yy"').slice(0,120);
const list = sh(`curl -sk -H "Authorization: Basic ${AUTH}" "${API}"`);
try { out.remaining = JSON.parse(list).filter(s=>/TEMP M8/i.test(s.name)).length; } catch(e){ out.remaining='err'; }
ghPut('screenshots/m8_finprobe.json', Buffer.from(JSON.stringify(out)), 'm8 fin probe');
console.log('DONE');
