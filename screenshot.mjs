import { execSync } from 'child_process';
import fs from 'fs';
const TOKG = process.env.GH_TOKEN;
function ghPut(p, buf, m) {
  const url = `https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/${p}`;
  let sha=''; try { const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${url}"`).toString()); if(j.sha) sha=j.sha; } catch(e){}
  fs.writeFileSync('/tmp/p.json', JSON.stringify({ message: m, content: buf.toString('base64'), ...(sha?{sha}:{}) }));
  execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${url}"`, {maxBuffer:20*1024*1024});
}
function sh(c){ try { return execSync(c,{maxBuffer:40*1024*1024}).toString(); } catch(e){ return 'ERR'; } }
const AUTH = Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').replace(/\s+/g,'')).toString('base64');
const API = 'https://dev.avesa.lt/wp-json/code-snippets/v1/snippets';
const out = {};
const php = `
add_action('wp_loaded', function(){
	if ( ! isset($_GET['ps_pr']) || $_GET['ps_pr'] !== 'Pr5Nn8Ww' ) { return; }
	@set_time_limit(400);

	function ps_num($s) {
		$s = str_replace(',', '.', $s);
		if (preg_match('/([\\d\\.]+)\\s*[-–—]\\s*([\\d\\.]+)/u', $s, $m)) return array((float)$m[1], (float)$m[2]);
		if (preg_match('/([\\d\\.]+)/u', $s, $m)) return array((float)$m[1], (float)$m[1]);
		return null;
	}
	function ps_cells($row) {
		preg_match_all('/<t[dh][^>]*>(.*?)<\\/t[dh]>/is', $row, $m);
		return array_map(function($x){ return trim(preg_replace('/\\s+/u',' ', html_entity_decode(wp_strip_all_tags($x)))); }, $m[1]);
	}

	$ids = get_posts(array('post_type'=>'product','post_status'=>'publish','posts_per_page'=>-1,'fields'=>'ids',
		'tax_query'=>array(array('taxonomy'=>'product_cat','field'=>'slug','terms'=>array('sausas-maistas-sunims','sausas-maistas-katems')))));

	$tables = array();   // checksum => data
	$stat = array('scanned'=>0,'phrase'=>0,'table_found'=>0,'no_table'=>0,
	              'verified'=>0,'ambiguous'=>0,'rows_ok'=>0,'rows_bad'=>0);
	$amb_reasons = array();

	foreach ($ids as $id) {
		if (get_post_meta($id,'_stock_status',true) !== 'instock') continue;
		$stat['scanned']++;
		$c = get_post_field('post_content', $id);
		if (stripos($c,'Šėrimo instrukcij') === false) continue;
		$stat['phrase']++;
		$pos  = stripos($c,'Šėrimo instrukcij');
		$full = mb_substr($c, $pos);

		// ATLAIDI ekstrakcija: su </table> arba be jo (iki kito <h ar galo)
		$tbl = null;
		if (preg_match('/<table.*?<\\/table>/is', $full, $m))      $tbl = $m[0];
		elseif (preg_match('/<table.*?(?=<h[1-6]|$)/is', $full, $m)) $tbl = $m[0];
		if (!$tbl) { $stat['no_table']++; continue; }
		$stat['table_found']++;

		preg_match_all('/<tr.*?(?:<\\/tr>|$)/is', $tbl, $trs);
		$rows = $trs[0];
		if (count($rows) < 2) { $stat['no_table']++; continue; }

		$hdr = ps_cells($rows[0]);
		$ncol = count($hdr);

		// --- FORMOS ATPAZINIMAS ---
		$shape = 'unknown';
		$h0 = mb_strtolower($hdr[0] ?? '');
		$numeric_headers = 0;
		for ($i=1; $i<$ncol; $i++) if (preg_match('/^[\\d,\\.]+/u', $hdr[$i])) $numeric_headers++;

		if ($numeric_headers >= 2)                        $shape = 'transposed';   // svoriai antrastese
		elseif (strpos($h0,'amži') !== false)             $shape = 'by_age';
		elseif ($ncol == 2 && strpos($h0,'svoris') !== false) $shape = 'simple';
		elseif ($ncol >= 3 && strpos($h0,'svoris') !== false) $shape = 'matrix';
		elseif (strpos($h0,'svoris') !== false)           $shape = 'simple';

		// checksum
		$norm = mb_strtolower(preg_replace('/\\s+/u','', wp_strip_all_tags($tbl)));
		$cs = md5($norm);

		if (isset($tables[$cs])) { $tables[$cs]['products'][] = $id; continue; }

		$parsed = array(); $bad = 0;
		if ($shape === 'simple') {
			for ($i=1; $i<count($rows); $i++) {
				$cl = ps_cells($rows[$i]);
				if (count($cl) < 2) continue;
				$w = ps_num($cl[0]); $a = ps_num($cl[1]);
				if (!$w || !$a) { $bad++; continue; }
				$parsed[] = array('w_from'=>$w[0],'w_to'=>$w[1],'a_from'=>$a[0],'a_to'=>$a[1]);
			}
		}

		// --- AUTO-VALIDACIJA (tik simple) ---
		$status = 'ambiguous'; $reason = $shape;
		if ($shape === 'simple' && count($parsed) >= 2 && $bad === 0) {
			$ok = true; $prev_w = -1; $prev_a = -1;
			foreach ($parsed as $r) {
				if ($r['w_from'] > $r['w_to'] || $r['a_from'] > $r['a_to']) { $ok=false; $reason='range_from_gt_to'; break; }
				if ($r['w_from'] < $prev_w) { $ok=false; $reason='weight_not_monotonic'; break; }
				if ($r['a_from'] < $prev_a) { $ok=false; $reason='amount_not_monotonic'; break; }
				if ($r['a_from'] <= 0 || $r['a_from'] > 2000) { $ok=false; $reason='amount_out_of_range'; break; }
				$prev_w = $r['w_from']; $prev_a = $r['a_from'];
			}
			if ($ok) { $status = 'verified'; $reason = ''; }
		}
		if ($status==='verified') { $stat['verified']++; $stat['rows_ok'] += count($parsed); }
		else { $stat['ambiguous']++; $stat['rows_bad'] += $bad;
		       if (!isset($amb_reasons[$reason])) $amb_reasons[$reason]=0; $amb_reasons[$reason]++; }

		$b = wp_get_object_terms($id, 'product_brand', array('fields'=>'names'));
		$tables[$cs] = array('checksum'=>$cs, 'shape'=>$shape, 'status'=>$status, 'reason'=>$reason,
			'brand'=>(!is_wp_error($b)&&$b)?$b[0]:'(be)', 'header'=>$hdr,
			'rows'=>$parsed, 'row_count'=>count($parsed), 'products'=>array($id),
			'sample_title'=>mb_substr(get_the_title($id),0,55));
	}

	// SKU padengimas
	$prod_verified = 0; $prod_amb = 0;
	foreach ($tables as $t) { if ($t['status']==='verified') $prod_verified += count($t['products']); else $prod_amb += count($t['products']); }

	arsort($amb_reasons);
	$o = array('stats'=>$stat, 'unique_tables'=>count($tables),
		'products_verified'=>$prod_verified, 'products_ambiguous'=>$prod_amb,
		'ambiguous_reasons'=>$amb_reasons, 'samples'=>array(), 'by_brand'=>array());

	$bb = array();
	foreach ($tables as $t) {
		$k = $t['brand'];
		if (!isset($bb[$k])) $bb[$k] = array('v'=>0,'a'=>0,'skus'=>0);
		if ($t['status']==='verified') $bb[$k]['v']++; else $bb[$k]['a']++;
		$bb[$k]['skus'] += count($t['products']);
	}
	$o['by_brand'] = $bb;

	$i=0;
	foreach ($tables as $t) {
		if ($t['status']!=='verified' || $i++ >= 5) continue;
		$o['samples'][] = array('brand'=>$t['brand'],'title'=>$t['sample_title'],'skus'=>count($t['products']),
			'rows'=>array_slice($t['rows'],0,4), 'row_count'=>$t['row_count'], 'cs'=>substr($t['checksum'],0,8));
	}
	header('Content-Type: application/json'); echo wp_json_encode($o); exit;
});`;
fs.writeFileSync('/tmp/snip.json', JSON.stringify({ name:'TEMP M8 Parser', code:php, scope:'global', active:true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/snip.json "${API}"`);
const r = sh('curl -sk --max-time 280 "https://dev.avesa.lt/?ps_pr=Pr5Nn8Ww"');
try { out.p = JSON.parse(r); } catch(e){ out.raw = r.slice(0,700); }
const kphp = `add_action('wp_loaded', function(){ if(!isset($_GET['ps_kpr'])||$_GET['ps_kpr']!=='Rr3Ww8Yy'){return;} global $wpdb; $n=$wpdb->query("DELETE FROM {$wpdb->prefix}snippets WHERE name LIKE 'TEMP M8%'"); echo wp_json_encode(array('d'=>$n)); exit; });`;
fs.writeFileSync('/tmp/k.json', JSON.stringify({ name:'TEMP M8 Kill PR', code:kphp, scope:'global', active:true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/k.json "${API}"`);
sh('curl -sk --max-time 25 "https://dev.avesa.lt/?ps_kpr=Rr3Ww8Yy"');
ghPut('screenshots/m8_parser.json', Buffer.from(JSON.stringify(out)), 'FeedingTable parser dry-run v1');
console.log('DONE');
