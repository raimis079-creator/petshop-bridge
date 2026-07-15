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
	if ( ! isset($_GET['ps_ft']) || $_GET['ps_ft'] !== 'Ft7Bb4Mm' ) { return; }
	@set_time_limit(300);
	$o = array('stats'=>array(), 'samples'=>array(), 'headers'=>array(), 'anomalies'=>array());

	$ids = get_posts(array('post_type'=>'product','post_status'=>'publish','posts_per_page'=>-1,'fields'=>'ids',
		'tax_query'=>array(array('taxonomy'=>'product_cat','field'=>'slug','terms'=>array('sausas-maistas-sunims','sausas-maistas-katems')))));

	$tot=0; $with_phrase=0; $with_table=0; $rows_total=0;
	$col2=0; $col3=0; $col4plus=0; $no_rows=0;
	$range_w=0; $single_w=0; $range_a=0; $single_a=0;
	$hdr = array();

	foreach ($ids as $id) {
		if (get_post_meta($id,'_stock_status',true) !== 'instock') continue;
		$tot++;
		$c = get_post_field('post_content', $id);
		if (stripos($c,'Šėrimo instrukcij') === false) continue;
		$with_phrase++;

		// Imam turini PO "Serimo instrukcij" antrastes
		$pos = stripos($c,'Šėrimo instrukcij');
		$chunk = mb_substr($c, $pos, 6000);
		if (!preg_match('/<table.*?<\\/table>/is', $chunk, $tm)) { continue; }
		$with_table++;
		$tbl = $tm[0];

		preg_match_all('/<tr.*?<\\/tr>/is', $tbl, $trs);
		$rows = $trs[0];
		if (count($rows) < 2) { $no_rows++; continue; }

		// Antrastes eilute
		preg_match_all('/<t[dh][^>]*>(.*?)<\\/t[dh]>/is', $rows[0], $hm);
		$hcells = array_map(function($x){ return trim(preg_replace('/\\s+/u',' ', wp_strip_all_tags($x))); }, $hm[1]);
		$ncol = count($hcells);
		if ($ncol==2) $col2++; elseif ($ncol==3) $col3++; elseif ($ncol>=4) $col4plus++;
		$hkey = implode(' | ', $hcells);
		if (!isset($hdr[$hkey])) $hdr[$hkey]=0;
		$hdr[$hkey]++;

		// Duomenu eilutes
		$prow = 0;
		for ($i=1; $i<count($rows); $i++) {
			preg_match_all('/<t[dh][^>]*>(.*?)<\\/t[dh]>/is', $rows[$i], $cm);
			$cells = array_map(function($x){ return trim(preg_replace('/\\s+/u',' ', wp_strip_all_tags($x))); }, $cm[1]);
			if (count($cells) < 2) continue;
			$w = $cells[0]; $a = $cells[1];
			if ($w==='' ) continue;
			$rows_total++; $prow++;
			// svoris: intervalas ar vienas?
			if (preg_match('/[\\d,\\.]+\\s*[-–—]\\s*[\\d,\\.]+/u', $w)) $range_w++; else $single_w++;
			// kiekis: intervalas ar vienas?
			if (preg_match('/[\\d,\\.]+\\s*[-–—]\\s*[\\d,\\.]+/u', $a)) $range_a++; else $single_a++;
			// anomalijos: ne skaicius pirmame stulpelyje
			if (!preg_match('/\\d/u', $w) && count($o['anomalies']) < 12) {
				$o['anomalies'][] = array('id'=>$id, 'w'=>mb_substr($w,0,40), 'a'=>mb_substr($a,0,40));
			}
		}
		if (count($o['samples']) < 4 && $prow > 0) {
			$sr = array();
			for ($i=1; $i<min(count($rows),5); $i++) {
				preg_match_all('/<t[dh][^>]*>(.*?)<\\/t[dh]>/is', $rows[$i], $cm2);
				$sr[] = array_map(function($x){ return trim(preg_replace('/\\s+/u',' ', wp_strip_all_tags($x))); }, $cm2[1]);
			}
			$o['samples'][] = array('id'=>$id, 'title'=>mb_substr(get_the_title($id),0,60), 'ncol'=>$ncol, 'header'=>$hcells, 'rows'=>$sr, 'total_rows'=>$prow);
		}
	}
	arsort($hdr);
	$o['headers'] = array_slice($hdr, 0, 12, true);
	$o['stats'] = array(
		'instock_dry'=>$tot, 'with_phrase'=>$with_phrase, 'with_table'=>$with_table,
		'no_rows'=>$no_rows, 'rows_total'=>$rows_total,
		'cols_2'=>$col2, 'cols_3'=>$col3, 'cols_4plus'=>$col4plus,
		'weight_range'=>$range_w, 'weight_single'=>$single_w,
		'amount_range'=>$range_a, 'amount_single'=>$single_a,
		'avg_rows_per_product'=> $with_table ? round($rows_total/$with_table,1) : 0
	);
	header('Content-Type: application/json'); echo wp_json_encode($o); exit;
});`;
fs.writeFileSync('/tmp/snip.json', JSON.stringify({ name:'TEMP M8 FTparse', code:php, scope:'global', active:true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/snip.json "${API}"`);
const r = sh('curl -sk --max-time 200 "https://dev.avesa.lt/?ps_ft=Ft7Bb4Mm"');
try { out.p = JSON.parse(r); } catch(e){ out.raw = r.slice(0,600); }
const kphp = `add_action('wp_loaded', function(){ if(!isset($_GET['ps_kft'])||$_GET['ps_kft']!=='Rr3Ww8Yy'){return;} global $wpdb; $n=$wpdb->query("DELETE FROM {$wpdb->prefix}snippets WHERE name LIKE 'TEMP M8%'"); echo wp_json_encode(array('d'=>$n)); exit; });`;
fs.writeFileSync('/tmp/k.json', JSON.stringify({ name:'TEMP M8 Kill FT', code:kphp, scope:'global', active:true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/k.json "${API}"`);
sh('curl -sk --max-time 25 "https://dev.avesa.lt/?ps_kft=Rr3Ww8Yy"');
ghPut('screenshots/m8_ftparse.json', Buffer.from(JSON.stringify(out)), 'FeedingTable parse dry-run');
console.log('DONE');
