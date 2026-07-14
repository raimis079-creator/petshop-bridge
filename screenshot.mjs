import { execSync } from 'child_process';
import fs from 'fs';
function putResult(name, obj) {
  const tok = process.env.GH_TOKEN;
  const url = `https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/screenshots/${name}`;
  let sha = '';
  try { const j = JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${tok}" "${url}"`).toString()); if (j.sha) sha = j.sha; } catch(e) {}
  fs.writeFileSync('/tmp/p.json', JSON.stringify({ message: `r ${name}`, content: Buffer.from(JSON.stringify(obj)).toString('base64'), ...(sha?{sha}:{}) }));
  execSync(`curl -s -X PUT -H "Authorization: Bearer ${tok}" -d @/tmp/p.json "${url}"`);
}
function sh(c){ try { return execSync(c,{maxBuffer:20*1024*1024}).toString(); } catch(e){ return 'ERR:'+(e.message||'').slice(0,300); } }
const AUTH = Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').replace(/\s+/g,'')).toString('base64');
const API = 'https://dev.avesa.lt/wp-json/code-snippets/v1/snippets';
const out = {};

// Deleter snippet: DB trynimas + savizudybe
const php = `
add_action('wp_loaded', function(){
	if ( ! isset($_GET['ps_m8clean']) || $_GET['ps_m8clean'] !== 'Wt5Xn9Rk' ) { return; }
	global $wpdb;
	$t = $wpdb->prefix . 'snippets';
	$n1 = $wpdb->query("DELETE FROM {$t} WHERE name LIKE 'TEMP M8%'");
	$n2 = $wpdb->query("DELETE FROM {$t} WHERE name = 'TEMP M8 Cleaner v1'");
	header('Content-Type: application/json');
	echo wp_json_encode(array('deleted_temp'=>$n1,'deleted_self'=>$n2));
	exit;
});`;
fs.writeFileSync('/tmp/snip.json', JSON.stringify({ name: 'TEMP M8 Cleaner v1', code: php, scope: 'global', active: true }));
const create = sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/snip.json "${API}"`);
try { out.cleaner_id = JSON.parse(create).id; } catch(e) { out.create_raw = create.slice(0,300); }

const run = sh('curl -sk --max-time 30 "https://dev.avesa.lt/?ps_m8clean=Wt5Xn9Rk"');
out.clean_result = run.slice(0,300);

// Verifikacija
const list = sh(`curl -sk -H "Authorization: Basic ${AUTH}" "${API}"`);
try { out.remaining_temp_m8 = JSON.parse(list).filter(s => /TEMP M8/i.test(s.name)).map(s=>s.id+':'+s.name); } catch(e) { out.remaining_temp_m8 = 'err'; }
putResult('m8_cleanup_2.json', out);
console.log('DONE');
