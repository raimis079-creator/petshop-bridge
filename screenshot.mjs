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
	if ( ! isset($_GET['ps_fd4']) || $_GET['ps_fd4'] !== 'Fd4Pp7Qq' ) { return; }
	global $wpdb;
	$o = array();
	// Kiek IS SAUSO MAISTO kategorijos (ne viso katalogo) turi feeding rekomendacija
	$dry_ids = get_posts(array('post_type'=>'product','post_status'=>'publish','posts_per_page'=>-1,'fields'=>'ids',
		'tax_query'=>array(array('taxonomy'=>'product_cat','field'=>'slug','terms'=>array('sausas-maistas-sunims','sausas-maistas-katems')))));
	$o['dry_total'] = count($dry_ids);
	$with = 0;
	foreach ($dry_ids as $id) {
		$c = get_post_field('post_content', $id);
		if (stripos($c, 'Šėrimo rekomendacij') !== false) $with++;
	}
	$o['dry_with_feeding_rec'] = $with;
	$o['pct'] = $o['dry_total'] ? round($with / $o['dry_total'] * 100, 1) : 0;

	// Realus turinio pavyzdys — ar tai lentele su svoriu->gramais
	$sample_id = null;
	foreach ($dry_ids as $id) {
		$c = get_post_field('post_content', $id);
		if (stripos($c, 'Šėrimo rekomendacij') !== false) { $sample_id = $id; break; }
	}
	if ($sample_id) {
		$c = get_post_field('post_content', $sample_id);
		$pos = stripos($c, 'Šėrimo rekomendacij');
		$o['sample_title'] = get_the_title($sample_id);
		$o['sample_excerpt'] = mb_substr($c, $pos, 700);
	}
	header('Content-Type: application/json'); echo wp_json_encode($o); exit;
});`;
fs.writeFileSync('/tmp/snip.json', JSON.stringify({ name:'TEMP M8 Feed4', code:php, scope:'global', active:true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/snip.json "${API}"`);
const r = sh('curl -sk --max-time 60 "https://dev.avesa.lt/?ps_fd4=Fd4Pp7Qq"');
try { out.p = JSON.parse(r); } catch(e){ out.raw = r.slice(0,500); }
const kphp = `add_action('wp_loaded', function(){ if(!isset($_GET['ps_ke2'])||$_GET['ps_ke2']!=='Rr3Ww8Yy'){return;} global $wpdb; $n=$wpdb->query("DELETE FROM {$wpdb->prefix}snippets WHERE name LIKE 'TEMP M8%'"); echo wp_json_encode(array('d'=>$n)); exit; });`;
fs.writeFileSync('/tmp/k.json', JSON.stringify({ name:'TEMP M8 Kill wE2', code:kphp, scope:'global', active:true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/k.json "${API}"`);
sh('curl -sk --max-time 25 "https://dev.avesa.lt/?ps_ke2=Rr3Ww8Yy"');
ghPut('screenshots/m8_feed4.json', Buffer.from(JSON.stringify(out)), 'feed4');
console.log('DONE');
