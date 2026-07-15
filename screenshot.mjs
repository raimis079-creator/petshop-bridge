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

// Cleaner snippet - failas, ne inline escaping
const php = `
add_action('wp_loaded', function(){
	if ( ! isset($_GET['ps_m8kill']) || $_GET['ps_m8kill'] !== 'Rr3Ww8Yy' ) { return; }
	global $wpdb;
	$n = $wpdb->query("DELETE FROM {$wpdb->prefix}snippets WHERE name LIKE 'TEMP M8%'");
	header('Content-Type: application/json'); echo wp_json_encode(array('deleted'=>$n)); exit;
});`;
fs.writeFileSync('/tmp/snip.json', JSON.stringify({ name: 'TEMP M8 Kill v1', code: php, scope: 'global', active: true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/snip.json "${API}"`);
out.kill = sh('curl -sk --max-time 25 "https://dev.avesa.lt/?ps_m8kill=Rr3Ww8Yy"').slice(0,150);
const list = sh(`curl -sk -H "Authorization: Basic ${AUTH}" "${API}"`);
try { out.remaining_temp_m8 = JSON.parse(list).filter(s=>/TEMP M8/i.test(s.name)).map(s=>s.id+':'+s.name); } catch(e){ out.remaining_temp_m8='err'; }
out.alive = sh('curl -sk -o /dev/null -w "%{http_code}" "https://dev.avesa.lt/"');
ghPut('screenshots/m8_kill.json', Buffer.from(JSON.stringify(out)), 'm8 kill');
console.log('DONE');
