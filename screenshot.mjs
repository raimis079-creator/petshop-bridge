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
	if ( ! isset($_GET['ps_img']) || $_GET['ps_img'] !== 'Im5Gg2Vv' ) { return; }
	$o = array();
	$dir = WP_PLUGIN_DIR.'/petshop-core/assets/img';
	$o['dir'] = $dir;
	$o['exists'] = is_dir($dir);
	if (is_dir($dir)) {
		foreach (glob($dir.'/*') as $f) $o['files'][basename($f)] = filesize($f);
	}
	// CSS failas
	$css = WP_PLUGIN_DIR.'/petshop-core/assets/pet-form.css';
	$o['css_exists'] = file_exists($css);
	$o['css_size'] = file_exists($css) ? filesize($css) : 0;
	$o['css_b64'] = file_exists($css) ? base64_encode(file_get_contents($css)) : '';
	// enqueue: kokie failai kraunami
	$ui = WP_PLUGIN_DIR.'/petshop-core/includes/class-pet-ui.php';
	$o['ui_b64'] = base64_encode(file_get_contents($ui));
	header('Content-Type: application/json'); echo wp_json_encode($o); exit;
});`;
fs.writeFileSync('/tmp/snip.json', JSON.stringify({ name:'TEMP M8 Img', code:php, scope:'global', active:true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/snip.json "${API}"`);
const r = sh('curl -sk --max-time 40 "https://dev.avesa.lt/?ps_img=Im5Gg2Vv"');
try { out.p = JSON.parse(r); } catch(e){ out.raw = r.slice(0,300); }
const kphp = `add_action('wp_loaded', function(){ if(!isset($_GET['ps_k2'])||$_GET['ps_k2']!=='Rr3Ww8Yy'){return;} global $wpdb; $n=$wpdb->query("DELETE FROM {$wpdb->prefix}snippets WHERE name LIKE 'TEMP M8%'"); echo wp_json_encode(array('d'=>$n)); exit; });`;
fs.writeFileSync('/tmp/k.json', JSON.stringify({ name:'TEMP M8 Kill w2', code:kphp, scope:'global', active:true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/k.json "${API}"`);
sh('curl -sk --max-time 25 "https://dev.avesa.lt/?ps_k2=Rr3Ww8Yy"');
ghPut('screenshots/m8_img.json', Buffer.from(JSON.stringify(out)), 'img');
console.log('DONE');
