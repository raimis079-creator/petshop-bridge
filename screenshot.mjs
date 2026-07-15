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
const list = sh(`curl -sk -H "Authorization: Basic ${AUTH}" "${API}"`);
try { const j = JSON.parse(list); out.temp_m8 = j.filter(s=>/TEMP M8/i.test(s.name)).map(s=>s.id+':'+s.name); out.total_snippets = j.length; out.active = j.filter(s=>s.active).length; } catch(e){ out.list_err = list.slice(0,150); }
for (const [k,u] of [['home','https://dev.avesa.lt/'],['acct','https://dev.avesa.lt/my-account/'],['pet','https://dev.avesa.lt/my-account/augintinis/'],['anketa','https://dev.avesa.lt/anketa-testas/'],['rest','https://dev.avesa.lt/wp-json/petshop/v1']])
  out[k] = sh(`curl -sk -o /dev/null -w "%{http_code}" --max-time 20 "${u}"`);
const php = `
add_action('wp_loaded', function(){
	if ( ! isset($_GET['ps_sum']) || $_GET['ps_sum'] !== 'Sum1Ary2' ) { return; }
	global $wpdb;
	$o = array();
	$o['versions'] = array();
	$f = WP_PLUGIN_DIR.'/petshop-core/includes/class-pet-ui.php';
	if (preg_match("/const VERSION = '([^']+)'/", file_get_contents($f), $m)) $o['versions']['pet-ui'] = $m[1];
	$o['backups'] = array();
	foreach (array('assets/pet-form.js','assets/pet-profile.js','includes/class-pet-ui.php','includes/class-pet-profile.php','includes/class-magic-login.php','includes/class-pet-dashboard.php') as $r) {
		$p = WP_PLUGIN_DIR.'/petshop-core/'.$r;
		$b = array();
		foreach (array('bak-20260715','bak-s205','bak-s206','bak-s207','bak-s208') as $s) if (file_exists($p.'.'.$s)) $b[] = $s;
		if ($b) $o['backups'][basename($r)] = $b;
	}
	$ea = WP_PLUGIN_DIR.'/petshop-esp/includes/class-sender-adapter.php';
	if (file_exists($ea.'.bak-s205')) $o['backups']['class-sender-adapter.php'] = array('bak-s205');
	$o['test_users'] = (int) $wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->users} WHERE user_email REGEXP '^(m8ui|m8e2e|m8v205|s208|dup206|anon|seed|naujas|dash|ph_|x_|f_|v2_|dupxfer|expired|terra_test)'");
	$o['test_pets'] = (int) $wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->prefix}ps_pets");
	$o['events_dead'] = (int) $wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->prefix}ps_event_log WHERE status='dead'");
	$o['events_skipped'] = (int) $wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->prefix}ps_event_log WHERE esp_response LIKE '%dev_allowlist%'");
	header('Content-Type: application/json'); echo wp_json_encode($o); exit;
});`;
fs.writeFileSync('/tmp/snip.json', JSON.stringify({ name:'TEMP M8 Sum', code:php, scope:'global', active:true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/snip.json "${API}"`);
const s = sh('curl -sk --max-time 30 "https://dev.avesa.lt/?ps_sum=Sum1Ary2"');
try { out.sum = JSON.parse(s); } catch(e){ out.sum_raw = s.slice(0,300); }
const kphp = `add_action('wp_loaded', function(){ if(!isset($_GET['ps_ku'])||$_GET['ps_ku']!=='Rr3Ww8Yy'){return;} global $wpdb; $n=$wpdb->query("DELETE FROM {$wpdb->prefix}snippets WHERE name LIKE 'TEMP M8%'"); echo wp_json_encode(array('d'=>$n)); exit; });`;
fs.writeFileSync('/tmp/k.json', JSON.stringify({ name:'TEMP M8 Kill vU', code:kphp, scope:'global', active:true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/k.json "${API}"`);
out.kill = sh('curl -sk --max-time 25 "https://dev.avesa.lt/?ps_ku=Rr3Ww8Yy"').slice(0,60);
const l2 = sh(`curl -sk -H "Authorization: Basic ${AUTH}" "${API}"`);
try { out.temp_left = JSON.parse(l2).filter(s=>/TEMP M8/i.test(s.name)).length; } catch(e){ out.temp_left='err'; }
ghPut('screenshots/m8_summary.json', Buffer.from(JSON.stringify(out)), 'summary');
console.log('DONE');
