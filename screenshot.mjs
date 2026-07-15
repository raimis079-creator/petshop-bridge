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
	if ( ! isset($_GET['ps_m8pp']) || $_GET['ps_m8pp'] !== 'Qq1Ee3Rr' ) { return; }
	$f = WP_PLUGIN_DIR.'/petshop-core/includes/class-pet-profile.php';
	$o = array('b64' => file_exists($f) ? base64_encode(file_get_contents($f)) : 'MISSING');
	header('Content-Type: application/json'); echo wp_json_encode($o); exit;
});`;
fs.writeFileSync('/tmp/snip.json', JSON.stringify({ name: 'TEMP M8 PpProbe v1', code: php, scope: 'global', active: true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/snip.json "${API}"`);
const res = sh('curl -sk --max-time 30 "https://dev.avesa.lt/?ps_m8pp=Qq1Ee3Rr"');
try { out.probe = JSON.parse(res); } catch(e){ out.raw = res.slice(0,400); }
const kphp = `add_action('wp_loaded', function(){ if(!isset($_GET['ps_m8kill5'])||$_GET['ps_m8kill5']!=='Rr3Ww8Yy'){return;} global $wpdb; $n=$wpdb->query("DELETE FROM {$wpdb->prefix}snippets WHERE name LIKE 'TEMP M8%'"); header('Content-Type: application/json'); echo wp_json_encode(array('deleted'=>$n)); exit; });`;
fs.writeFileSync('/tmp/k.json', JSON.stringify({ name: 'TEMP M8 Kill v5', code: kphp, scope: 'global', active: true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/k.json "${API}"`);
out.kill = sh('curl -sk --max-time 25 "https://dev.avesa.lt/?ps_m8kill5=Rr3Ww8Yy"').slice(0,120);
const list = sh(`curl -sk -H "Authorization: Basic ${AUTH}" "${API}"`);
try { out.remaining = JSON.parse(list).filter(s=>/TEMP M8/i.test(s.name)).length; } catch(e){ out.remaining='err'; }
ghPut('screenshots/m8_ppprobe.json', Buffer.from(JSON.stringify(out)), 'm8 pp probe');
console.log('DONE');
