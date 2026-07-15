import { execSync } from 'child_process';
import fs from 'fs';
const TOKG = process.env.GH_TOKEN;
function ghPut(p, buf, m) {
  const url = `https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/${p}`;
  let sha=''; try { const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${url}"`).toString()); if(j.sha) sha=j.sha; } catch(e){}
  fs.writeFileSync('/tmp/p.json', JSON.stringify({ message: m, content: buf.toString('base64'), ...(sha?{sha}:{}) }));
  execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${url}"`, {maxBuffer:20*1024*1024});
}
function sh(c){ try { return execSync(c,{maxBuffer:20*1024*1024}).toString(); } catch(e){ return 'ERR:'+(e.message||'').slice(0,300); } }
const AUTH = Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').replace(/\s+/g,'')).toString('base64');
const API = 'https://dev.avesa.lt/wp-json/code-snippets/v1/snippets';
const out = {};
const php = `
add_action('wp_loaded', function(){
	if ( ! isset($_GET['ps_ml']) || $_GET['ps_ml'] !== 'Ll7Kk3Hh' ) { return; }
	$o = array();
	foreach (array('magic'=>'class-magic-login.php','tokens'=>'class-action-tokens.php') as $k=>$f) {
		$p = WP_PLUGIN_DIR.'/petshop-core/includes/'.$f;
		$o[$k] = file_exists($p) ? base64_encode(file_get_contents($p)) : 'MISSING';
	}
	global $wpdb;
	$o['token_table_cols'] = $wpdb->get_col("SHOW COLUMNS FROM {$wpdb->prefix}ps_action_tokens", 0);
	header('Content-Type: application/json'); echo wp_json_encode($o); exit;
});`;
fs.writeFileSync('/tmp/snip.json', JSON.stringify({ name:'TEMP M8 ML', code:php, scope:'global', active:true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/snip.json "${API}"`);
const r = sh('curl -sk --max-time 30 "https://dev.avesa.lt/?ps_ml=Ll7Kk3Hh"');
try { out.p = JSON.parse(r); } catch(e){ out.raw = r.slice(0,400); }
const kphp = `add_action('wp_loaded', function(){ if(!isset($_GET['ps_ke'])||$_GET['ps_ke']!=='Rr3Ww8Yy'){return;} global $wpdb; $n=$wpdb->query("DELETE FROM {$wpdb->prefix}snippets WHERE name LIKE 'TEMP M8%'"); echo wp_json_encode(array('d'=>$n)); exit; });`;
fs.writeFileSync('/tmp/k.json', JSON.stringify({ name:'TEMP M8 Kill vE', code:kphp, scope:'global', active:true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/k.json "${API}"`);
sh('curl -sk --max-time 25 "https://dev.avesa.lt/?ps_ke=Rr3Ww8Yy"');
ghPut('screenshots/m8_ml.json', Buffer.from(JSON.stringify(out)), 'ml');
console.log('DONE');
