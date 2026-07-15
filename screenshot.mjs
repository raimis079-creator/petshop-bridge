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
	if ( ! isset($_GET['ps_loy']) || $_GET['ps_loy'] !== 'Ly8Ww3Zz' ) { return; }
	$o = array();
	$plugins = get_plugins();
	$loyalty_keywords = array('point','loyal','reward','wallet','bonus','cashback','referral');
	foreach ($plugins as $path => $data) {
		foreach ($loyalty_keywords as $kw) {
			if (stripos($path,$kw)!==false || stripos($data['Name'],$kw)!==false) {
				$o['found'][] = array('path'=>$path,'name'=>$data['Name'],'active'=>is_plugin_active($path));
				break;
			}
		}
	}
	$o['all_plugins_count'] = count($plugins);
	header('Content-Type: application/json'); echo wp_json_encode($o); exit;
});`;
fs.writeFileSync('/tmp/snip.json', JSON.stringify({ name:'TEMP M8 Loy', code:php, scope:'global', active:true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/snip.json "${API}"`);
const r = sh('curl -sk --max-time 30 "https://dev.avesa.lt/?ps_loy=Ly8Ww3Zz"');
try { out.p = JSON.parse(r); } catch(e){ out.raw = r.slice(0,300); }
const kphp = `add_action('wp_loaded', function(){ if(!isset($_GET['ps_kf2'])||$_GET['ps_kf2']!=='Rr3Ww8Yy'){return;} global $wpdb; $n=$wpdb->query("DELETE FROM {$wpdb->prefix}snippets WHERE name LIKE 'TEMP M8%'"); echo wp_json_encode(array('d'=>$n)); exit; });`;
fs.writeFileSync('/tmp/k.json', JSON.stringify({ name:'TEMP M8 Kill wF2', code:kphp, scope:'global', active:true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/k.json "${API}"`);
sh('curl -sk --max-time 25 "https://dev.avesa.lt/?ps_kf2=Rr3Ww8Yy"');
ghPut('screenshots/m8_loy.json', Buffer.from(JSON.stringify(out)), 'loy');
console.log('DONE');
