import { execSync } from 'child_process';
import fs from 'fs';
const TOKG = process.env.GH_TOKEN;
function ghPut(p, buf, m) {
  const url = `https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/${p}`;
  let sha=''; try { const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${url}"`).toString()); if(j.sha) sha=j.sha; } catch(e){}
  fs.writeFileSync('/tmp/p.json', JSON.stringify({ message: m, content: buf.toString('base64'), ...(sha?{sha}:{}) }));
  execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${url}"`, {maxBuffer:20*1024*1024});
}
function sh(c){ try { return execSync(c,{maxBuffer:30*1024*1024}).toString(); } catch(e){ return 'ERR'; } }
const AUTH = Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').replace(/\s+/g,'')).toString('base64');
const API = 'https://dev.avesa.lt/wp-json/code-snippets/v1/snippets';
const out = {};
const php = `
add_action('wp_loaded', function(){
	if ( ! isset($_GET['ps_dd']) || $_GET['ps_dd'] !== 'Dd6Hh1Kk' ) { return; }
	@set_time_limit(300);
	$o = array();
	$ids = get_posts(array('post_type'=>'product','post_status'=>'publish','posts_per_page'=>-1,'fields'=>'ids',
		'tax_query'=>array(array('taxonomy'=>'product_cat','field'=>'slug','terms'=>array('sausas-maistas-sunims','sausas-maistas-katems')))));

	$hashes = array(); $prod_with = 0;
	foreach ($ids as $id) {
		if (get_post_meta($id,'_stock_status',true) !== 'instock') continue;
		$c = get_post_field('post_content', $id);
		if (stripos($c,'Šėrimo instrukcij') === false) continue;
		$pos = stripos($c,'Šėrimo instrukcij');
		$full = mb_substr($c, $pos);
		// ATLAIDUS: imam nuo pirmo "table" iki kito accordion antrastes arba galo
		if (!preg_match('/<table.*?<\\/table>/is', $full, $m)) continue;
		$prod_with++;
		// normalizuojam: tik skaiciai+raides, be tarpu/stiliu
		$norm = wp_strip_all_tags($m[0]);
		$norm = preg_replace('/\\s+/u', '', $norm);
		$norm = mb_strtolower($norm);
		$h = md5($norm);
		if (!isset($hashes[$h])) $hashes[$h] = array('n'=>0, 'sample_id'=>$id, 'brands'=>array(), 'preview'=>mb_substr(trim(preg_replace('/\\s+/u',' ', wp_strip_all_tags($m[0]))), 0, 90));
		$hashes[$h]['n']++;
		$b = wp_get_object_terms($id, 'product_brand', array('fields'=>'names'));
		$bn = (!is_wp_error($b) && $b) ? $b[0] : '(be)';
		if (!in_array($bn, $hashes[$h]['brands'])) $hashes[$h]['brands'][] = $bn;
	}
	uasort($hashes, function($a,$b){ return $b['n'] - $a['n']; });
	$o['products_with_table'] = $prod_with;
	$o['UNIQUE_TABLES'] = count($hashes);
	$o['reduction'] = $prod_with ? round($prod_with / max(count($hashes),1), 1) : 0;
	// pasiskirstymas
	$dist = array('1 prod'=>0, '2-4'=>0, '5-9'=>0, '10+'=>0);
	foreach ($hashes as $h) {
		if ($h['n']==1) $dist['1 prod']++;
		elseif ($h['n']<5) $dist['2-4']++;
		elseif ($h['n']<10) $dist['5-9']++;
		else $dist['10+']++;
	}
	$o['distribution'] = $dist;
	$o['top'] = array();
	$i=0;
	foreach ($hashes as $h => $d) {
		if ($i++ >= 12) break;
		$o['top'][] = array('n'=>$d['n'], 'brands'=>implode(',', array_slice($d['brands'],0,3)), 'preview'=>$d['preview']);
	}
	// kiek lenteliu padengia 80% produktu?
	$cum=0; $need=0; $target=$prod_with*0.8;
	foreach ($hashes as $d) { $cum += $d['n']; $need++; if ($cum >= $target) break; }
	$o['tables_covering_80pct_products'] = $need;
	header('Content-Type: application/json'); echo wp_json_encode($o); exit;
});`;
fs.writeFileSync('/tmp/snip.json', JSON.stringify({ name:'TEMP M8 Dedup', code:php, scope:'global', active:true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/snip.json "${API}"`);
const r = sh('curl -sk --max-time 200 "https://dev.avesa.lt/?ps_dd=Dd6Hh1Kk"');
try { out.p = JSON.parse(r); } catch(e){ out.raw = r.slice(0,600); }
const kphp = `add_action('wp_loaded', function(){ if(!isset($_GET['ps_kdd'])||$_GET['ps_kdd']!=='Rr3Ww8Yy'){return;} global $wpdb; $n=$wpdb->query("DELETE FROM {$wpdb->prefix}snippets WHERE name LIKE 'TEMP M8%'"); echo wp_json_encode(array('d'=>$n)); exit; });`;
fs.writeFileSync('/tmp/k.json', JSON.stringify({ name:'TEMP M8 Kill DD', code:kphp, scope:'global', active:true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/k.json "${API}"`);
sh('curl -sk --max-time 25 "https://dev.avesa.lt/?ps_kdd=Rr3Ww8Yy"');
ghPut('screenshots/m8_dedup.json', Buffer.from(JSON.stringify(out)), 'dedup: how many UNIQUE tables');
console.log('DONE');
