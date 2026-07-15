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
	if ( ! isset($_GET['ps_fd6']) || $_GET['ps_fd6'] !== 'Fd6Tt4Uu' ) { return; }
	global $wpdb;
	$o = array();

	$dry_ids = get_posts(array('post_type'=>'product','post_status'=>'publish','posts_per_page'=>-1,'fields'=>'ids',
		'tax_query'=>array(array('taxonomy'=>'product_cat','field'=>'slug','terms'=>array('sausas-maistas-sunims','sausas-maistas-katems')))));
	$o['all_publish'] = count($dry_ids);

	// Stock statusai
	$stock_counts = array();
	foreach ($dry_ids as $id) {
		$s = get_post_meta($id, '_stock_status', true) ?: 'unknown';
		$stock_counts[$s] = ($stock_counts[$s] ?? 0) + 1;
	}
	$o['stock_breakdown'] = $stock_counts;

	// TIK instock produktai — kiek turi lentele
	$instock_ids = array_filter($dry_ids, function($id){ return get_post_meta($id,'_stock_status',true) === 'instock'; });
	$o['instock_total'] = count($instock_ids);
	$instock_with = 0;
	$missing_titles = array();
	foreach ($instock_ids as $id) {
		$c = get_post_field('post_content', $id);
		$has = (stripos($c,'Šėrimo instrukcij')!==false) || (stripos($c,'<table')!==false && (stripos($c,'svoris')!==false || stripos($c,'Svoris')!==false));
		if ($has) $instock_with++;
		elseif (count($missing_titles) < 15) $missing_titles[] = get_the_title($id);
	}
	$o['instock_with_table'] = $instock_with;
	$o['instock_pct'] = $o['instock_total'] ? round($instock_with / $o['instock_total'] * 100, 1) : 0;
	$o['sample_missing'] = $missing_titles;

	// Placesne paieska: BET KOKIA <table> su svorio zodziu, ne tik konkretus antrasties tekstas
	$broad_with = 0;
	foreach ($dry_ids as $id) {
		$c = get_post_field('post_content', $id);
		if (stripos($c,'<table')!==false && (stripos($c,'svoris')!==false || stripos($c,'Svoris')!==false || stripos($c,'SVORIS')!==false)) $broad_with++;
	}
	$o['broad_with_any_weight_table'] = $broad_with;
	$o['broad_pct_of_all'] = $o['all_publish'] ? round($broad_with / $o['all_publish'] * 100, 1) : 0;

	// Pagal prekes zenkla (brendas) - kiek brendu VISAI neturi lenteliu nei viename produkte
	$brand_stats = array();
	foreach ($dry_ids as $id) {
		$brands = wp_get_object_terms($id, 'product_brand', array('fields'=>'names'));
		$b = (!is_wp_error($brands) && $brands) ? $brands[0] : '(be brendo)';
		if (!isset($brand_stats[$b])) $brand_stats[$b] = array('total'=>0,'with'=>0);
		$brand_stats[$b]['total']++;
		$c = get_post_field('post_content', $id);
		if (stripos($c,'Šėrimo instrukcij')!==false) $brand_stats[$b]['with']++;
	}
	arsort($brand_stats);
	$top_brands = array_slice($brand_stats, 0, 20, true);
	$o['top_brands'] = array();
	foreach ($top_brands as $name => $st) {
		$o['top_brands'][] = array('brand'=>$name,'total'=>$st['total'],'with'=>$st['with'],'pct'=>$st['total']?round($st['with']/$st['total']*100,1):0);
	}
	// Bendras brendu skaicius, kur PILNAI 100% turi
	$full_brands = 0; $zero_brands = 0;
	foreach ($brand_stats as $name=>$st) { if($st['with']==$st['total']) $full_brands++; if($st['with']==0) $zero_brands++; }
	$o['brands_total'] = count($brand_stats);
	$o['brands_full_coverage'] = $full_brands;
	$o['brands_zero_coverage'] = $zero_brands;

	header('Content-Type: application/json'); echo wp_json_encode($o); exit;
});`;
fs.writeFileSync('/tmp/snip.json', JSON.stringify({ name:'TEMP M8 Feed6', code:php, scope:'global', active:true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/snip.json "${API}"`);
const r = sh('curl -sk --max-time 90 "https://dev.avesa.lt/?ps_fd6=Fd6Tt4Uu"');
try { out.p = JSON.parse(r); } catch(e){ out.raw = r.slice(0,500); }
const kphp = `add_action('wp_loaded', function(){ if(!isset($_GET['ps_ke4'])||$_GET['ps_ke4']!=='Rr3Ww8Yy'){return;} global $wpdb; $n=$wpdb->query("DELETE FROM {$wpdb->prefix}snippets WHERE name LIKE 'TEMP M8%'"); echo wp_json_encode(array('d'=>$n)); exit; });`;
fs.writeFileSync('/tmp/k.json', JSON.stringify({ name:'TEMP M8 Kill wE4', code:kphp, scope:'global', active:true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/k.json "${API}"`);
sh('curl -sk --max-time 25 "https://dev.avesa.lt/?ps_ke4=Rr3Ww8Yy"');
ghPut('screenshots/m8_feed6.json', Buffer.from(JSON.stringify(out)), 'feed6');
console.log('DONE');
