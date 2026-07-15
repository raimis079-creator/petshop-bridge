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
	if ( ! isset($_GET['ps_gate']) || $_GET['ps_gate'] !== 'Gg4Hh6Jj' ) { return; }
	$o = array('env' => defined('PETSHOP_ENVIRONMENT') ? PETSHOP_ENVIRONMENT : 'NEAPIBREZTA');
	if ( ! function_exists('ps_esp_adapter') ) { $o['err']='no ps_esp_adapter'; header('Content-Type: application/json'); echo wp_json_encode($o); exit; }
	$a = ps_esp_adapter();
	$o['class'] = get_class($a);
	$rm = new ReflectionMethod($a, 'is_blocked_by_dev_allowlist');
	$rm->setAccessible(true);
	$tests = array('terra@gyvunai.lt','raimundas@gyvunai.lt','terra@petshop.lt','TERRA@GYVUNAI.LT','gutulis@gmail.com','naujas@klientas.lt');
	foreach ($tests as $e) $o['blocked'][$e] = $rm->invoke($a, $e) ? 'BLOKUOJAMAS' : 'praleidziamas';
	// Ar visi 4 metodai turi saugikli (statinis kodo patikrinimas diske)
	$f = WP_PLUGIN_DIR.'/petshop-esp/includes/class-sender-adapter.php';
	$src = file_get_contents($f);
	foreach (array('upsert_contact','emit_event','send_transactional_email','send_transactional_sms') as $fn) {
		$pos = strpos($src, 'public function '.$fn);
		$body = $pos !== false ? substr($src, $pos, 700) : '';
		$o['guards'][$fn] = ( strpos($body,'is_blocked_by_dev_allowlist') !== false || strpos($body,"PETSHOP_ENVIRONMENT") !== false ) ? 'YRA' : 'NERA';
	}
	$o['backups'] = array(
		'adapter' => file_exists($f.'.bak-s205'),
		'profile' => file_exists(WP_PLUGIN_DIR.'/petshop-core/includes/class-pet-profile.php.bak-s205'),
	);
	// Tvarka pet-profile faile
	$pf = file_get_contents(WP_PLUGIN_DIR.'/petshop-core/includes/class-pet-profile.php');
	$mp = strpos($pf, 'self::mirror_to_sender( $user_id, $pet_id );');
	$ep = strpos($pf, 'self::emit_created( $user_id, $pet_id, $input );');
	$o['order_upsert_before_emit'] = ($mp !== false && $ep !== false && $mp < $ep);
	header('Content-Type: application/json'); echo wp_json_encode($o); exit;
});`;
fs.writeFileSync('/tmp/snip.json', JSON.stringify({ name: 'TEMP M8 Gate', code: php, scope: 'global', active: true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/snip.json "${API}"`);
const res = sh('curl -sk --max-time 30 "https://dev.avesa.lt/?ps_gate=Gg4Hh6Jj"');
try { out.probe = JSON.parse(res); } catch(e){ out.raw = res.slice(0,500); }
const kphp = `add_action('wp_loaded', function(){ if(!isset($_GET['ps_m8k8'])||$_GET['ps_m8k8']!=='Rr3Ww8Yy'){return;} global $wpdb; $n=$wpdb->query("DELETE FROM {$wpdb->prefix}snippets WHERE name LIKE 'TEMP M8%'"); header('Content-Type: application/json'); echo wp_json_encode(array('deleted'=>$n)); exit; });`;
fs.writeFileSync('/tmp/k.json', JSON.stringify({ name:'TEMP M8 Kill v8', code:kphp, scope:'global', active:true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/k.json "${API}"`);
out.kill = sh('curl -sk --max-time 25 "https://dev.avesa.lt/?ps_m8k8=Rr3Ww8Yy"').slice(0,120);
const list = sh(`curl -sk -H "Authorization: Basic ${AUTH}" "${API}"`);
try { out.remaining = JSON.parse(list).filter(s=>/TEMP M8/i.test(s.name)).length; } catch(e){ out.remaining='err'; }
ghPut('screenshots/m8_gate.json', Buffer.from(JSON.stringify(out)), 'gate check');
console.log('DONE');
