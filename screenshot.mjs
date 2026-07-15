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
	if ( ! isset($_GET['ps_pre']) || $_GET['ps_pre'] !== 'Pp5Oo9Ww' ) { return; }
	global $wpdb;
	$o = array();
	// 1. WP useris
	$u = get_user_by('email','terra@petshop.lt');
	$o['wp_user'] = $u ? array('id'=>$u->ID,'login'=>$u->user_login,'roles'=>$u->roles,'registered'=>$u->user_registered) : 'NERA';
	// 2. Ar turi augintiniu
	if ($u) {
		$o['pets'] = $wpdb->get_results($wpdb->prepare("SELECT id,pet_name,species,status,is_primary,created_at FROM {$wpdb->prefix}ps_pets WHERE user_id=%d", $u->ID), ARRAY_A);
	}
	// 3. Sender kontakto dabartine busena (READ ONLY)
	if ( function_exists('ps_esp_adapter') ) {
		$a = ps_esp_adapter();
		$o['adapter_configured'] = $a && $a->is_configured();
		if ($a && $a->is_configured()) {
			$o['contact_status'] = $a->get_contact_status('terra@petshop.lt');
			foreach (array('PS_PET_SPECIES','PS_PET_NAME','PS_PET_LIFE_STAGE','PS_DOG_SIZE','PS_FEEDING_TYPE','PS_PRIMARY_NEED','PS_CURRENT_FOOD_BRAND') as $f) {
				$o['current_fields'][$f] = $a->get_contact_field('terra@petshop.lt', $f);
			}
		}
	}
	header('Content-Type: application/json'); echo wp_json_encode($o); exit;
});`;
fs.writeFileSync('/tmp/snip.json', JSON.stringify({ name: 'TEMP M8 PreCheck', code: php, scope: 'global', active: true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/snip.json "${API}"`);
const res = sh('curl -sk --max-time 40 "https://dev.avesa.lt/?ps_pre=Pp5Oo9Ww"');
try { out.probe = JSON.parse(res); } catch(e){ out.raw = res.slice(0,600); }
const kphp = `add_action('wp_loaded', function(){ if(!isset($_GET['ps_m8k9'])||$_GET['ps_m8k9']!=='Rr3Ww8Yy'){return;} global $wpdb; $n=$wpdb->query("DELETE FROM {$wpdb->prefix}snippets WHERE name LIKE 'TEMP M8%'"); header('Content-Type: application/json'); echo wp_json_encode(array('deleted'=>$n)); exit; });`;
fs.writeFileSync('/tmp/k.json', JSON.stringify({ name:'TEMP M8 Kill v9', code:kphp, scope:'global', active:true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/k.json "${API}"`);
out.kill = sh('curl -sk --max-time 25 "https://dev.avesa.lt/?ps_m8k9=Rr3Ww8Yy"').slice(0,120);
ghPut('screenshots/m8_precheck.json', Buffer.from(JSON.stringify(out)), 'precheck');
console.log('DONE');
