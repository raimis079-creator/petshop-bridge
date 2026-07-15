import { execSync } from 'child_process';
import fs from 'fs';
const TOKG = process.env.GH_TOKEN;
function ghPut(p, buf, m) {
  const url = `https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/${p}`;
  let sha=''; try { const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${url}"`).toString()); if(j.sha) sha=j.sha; } catch(e){}
  fs.writeFileSync('/tmp/p.json', JSON.stringify({ message: m, content: buf.toString('base64'), ...(sha?{sha}:{}) }));
  const res = execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${url}"`, {maxBuffer:20*1024*1024}).toString();
  console.log('PUT ' + p + ' -> ' + (res.indexOf('"content"')>0 ? 'OK' : res.slice(0,120)));
}
function sh(c){ try { return execSync(c,{maxBuffer:20*1024*1024}).toString(); } catch(e){ return 'ERR'; } }
const AUTH = Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').replace(/\s+/g,'')).toString('base64');
const API = 'https://dev.avesa.lt/wp-json/code-snippets/v1/snippets';
const out = {};
const php = `
add_action('wp_loaded', function(){
	if ( ! isset($_GET['ps_rc2']) || $_GET['ps_rc2'] !== 'Rc2Vv6Mm' ) { return; }
	global $wpdb;
	$o = array();
	$o['pets_cols'] = $wpdb->get_col("SHOW COLUMNS FROM {$wpdb->prefix}ps_pets", 0);
	$gd = function_exists('gd_info') ? gd_info() : array();
	$o['webp'] = ! empty($gd['WebP Support']);
	$o['png'] = ! empty($gd['PNG Support']);
	$q = new WP_Query(array('post_type'=>'product','post_status'=>'publish','s'=>'josera','posts_per_page'=>3,'no_found_rows'=>true));
	foreach ($q->posts as $p) {
		$prod = wc_get_product($p->ID);
		$pak = wp_get_object_terms($p->ID, 'pa_pakuotes_dydis', array('fields'=>'names'));
		$o['sample'][] = array(
			'id'      => $p->ID,
			'title'   => mb_substr($p->post_title, 0, 45),
			'sku'     => $prod ? (string) $prod->get_sku() : '',
			'pakuote' => is_wp_error($pak) ? 'ERR' : implode('|', (array) $pak),
		);
	}
	$o['pakuotes_terms'] = (int) wp_count_terms(array('taxonomy'=>'pa_pakuotes_dydis','hide_empty'=>true));
	header('Content-Type: application/json'); echo wp_json_encode($o); exit;
});`;
fs.writeFileSync('/tmp/snip.json', JSON.stringify({ name:'TEMP M8 RC2', code:php, scope:'global', active:true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/snip.json "${API}"`);
const r = sh('curl -sk --max-time 40 "https://dev.avesa.lt/?ps_rc2=Rc2Vv6Mm"');
try { out.p = JSON.parse(r); } catch(e){ out.raw = r.slice(0,250); }
console.log(JSON.stringify(out).slice(0, 1500));
const kphp = `add_action('wp_loaded', function(){ if(!isset($_GET['ps_k5'])||$_GET['ps_k5']!=='Rr3Ww8Yy'){return;} global $wpdb; $n=$wpdb->query("DELETE FROM {$wpdb->prefix}snippets WHERE name LIKE 'TEMP M8%'"); echo wp_json_encode(array('d'=>$n)); exit; });`;
fs.writeFileSync('/tmp/k.json', JSON.stringify({ name:'TEMP M8 Kill w5', code:kphp, scope:'global', active:true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/k.json "${API}"`);
sh('curl -sk --max-time 25 "https://dev.avesa.lt/?ps_k5=Rr3Ww8Yy"');
ghPut('screenshots/m8_rc2.json', Buffer.from(JSON.stringify(out)), 'rc2');
console.log('DONE');
