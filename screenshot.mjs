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
	if ( ! isset($_GET['ps_i2']) || $_GET['ps_i2'] !== 'Ii9Oo3Pp' ) { return; }
	$o = array();
	$d = WP_PLUGIN_DIR.'/petshop-core/assets/images';
	$o['dir_exists'] = is_dir($d);
	if (is_dir($d)) foreach (glob($d.'/*') as $f) $o['files'][basename($f)] = filesize($f);
	$o['url'] = plugins_url('assets/images/', WP_PLUGIN_DIR.'/petshop-core/petshop-core.php');
	header('Content-Type: application/json'); echo wp_json_encode($o); exit;
});`;
fs.writeFileSync('/tmp/snip.json', JSON.stringify({ name:'TEMP M8 I2', code:php, scope:'global', active:true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/snip.json "${API}"`);
const r = sh('curl -sk --max-time 30 "https://dev.avesa.lt/?ps_i2=Ii9Oo3Pp"');
try { out.p = JSON.parse(r); } catch(e){ out.raw = r.slice(0,300); }
const kphp = `add_action('wp_loaded', function(){ if(!isset($_GET['ps_k3'])||$_GET['ps_k3']!=='Rr3Ww8Yy'){return;} global $wpdb; $n=$wpdb->query("DELETE FROM {$wpdb->prefix}snippets WHERE name LIKE 'TEMP M8%'"); echo wp_json_encode(array('d'=>$n)); exit; });`;
fs.writeFileSync('/tmp/k.json', JSON.stringify({ name:'TEMP M8 Kill w3', code:kphp, scope:'global', active:true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/k.json "${API}"`);
sh('curl -sk --max-time 25 "https://dev.avesa.lt/?ps_k3=Rr3Ww8Yy"');
ghPut('screenshots/m8_i2.json', Buffer.from(JSON.stringify(out)), 'i2');
console.log('DONE');
