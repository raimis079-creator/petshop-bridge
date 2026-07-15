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
	if ( ! isset($_GET['ps_p2']) || $_GET['ps_p2'] !== 'P2Kk7Ss' ) { return; }
	@set_time_limit(500);

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
	function ps_mono($arr) { // ar nemazejantis
		$p = -INF;
		foreach ($arr as $v) { if ($v < $p) return false; $p = $v; }
		return true;
	}

	$ids = get_posts(array('post_type'=>'product','post_status'=>'publish','posts_per_page'=>-1,'fields'=>'ids',
		'tax_query'=>array(array('taxonomy'=>'product_cat','field'=>'slug','terms'=>array('sausas-maistas-sunims','sausas-maistas-katems')))));

	$tables = array();
	$stat = array('phrase'=>0,'table_found'=>0,'no_table'=>0);
	$shapes = array(); $reasons = array();

	foreach ($ids as $id) {
		if (get_post_meta($id,'_stock_status',true) !== 'instock') continue;
		$c = get_post_field('post_content', $id);
		if (stripos($c,'Šėrimo instrukcij') === false) continue;
		$stat['phrase']++;
		$pos  = stripos($c,'Šėrimo instrukcij');
		$full = mb_substr($c, $pos);
		$tbl = null;
		if (preg_match('/<table.*?<\\/table>/is', $full, $m))        $tbl = $m[0];
		elseif (preg_match('/<table.*?(?=<h[1-6]|$)/is', $full, $m)) $tbl = $m[0];
		if (!$tbl) { $stat['no_table']++; continue; }
		$stat['table_found']++;

		$norm = mb_strtolower(preg_replace('/\\s+/u','', wp_strip_all_tags($tbl)));
		$cs = md5($norm);
		if (isset($tables[$cs])) { $tables[$cs]['products'][] = $id; continue; }

		preg_match_all('/<tr.*?(?:<\\/tr>|$)/is', $tbl, $trs);
		$rows = $trs[0];
		if (count($rows) < 2) { $stat['no_table']++; continue; }
		$hdr = ps_cells($rows[0]);
		$ncol = count($hdr);
		$h0 = mb_strtolower($hdr[0] ?? '');

		$numh = 0;
		for ($i=1; $i<$ncol; $i++) if (preg_match('/^[\\d,\\.]+/u', $hdr[$i])) $numh++;

		// --- FORMA ---
		if ($numh >= 2)                                       $shape = 'transposed';
		elseif (strpos($h0,'amži') !== false && $ncol == 2)   $shape = 'by_age';
		elseif ($ncol == 2)                                   $shape = 'simple';
		elseif ($ncol >= 3 && strpos($h0,'svoris') !== false) $shape = 'matrix';
		else                                                  $shape = 'unknown';

		$parsed = array(); $bad = 0; $status='ambiguous'; $reason=$shape;

		if ($shape === 'simple' || $shape === 'by_age') {
			$ws=array(); $as=array();
			for ($i=1; $i<count($rows); $i++) {
				$cl = ps_cells($rows[$i]); if (count($cl)<2) continue;
				$k = ps_num($cl[0]); $a = ps_num($cl[1]);
				if (!$k || !$a) { $bad++; continue; }
				$row = array('a_from'=>$a[0],'a_to'=>$a[1]);
				if ($shape==='simple') { $row['w_from']=$k[0]; $row['w_to']=$k[1]; $ws[]=$k[0]; }
				else { $row['cond']=array('age_m_from'=>$k[0],'age_m_to'=>$k[1]); }
				$as[]=$a[0]; $parsed[]=$row;
			}
			$ok = count($parsed)>=2 && $bad===0;
			if ($ok && $shape==='simple' && !ps_mono($ws)) { $ok=false; $reason='weight_not_monotonic'; }
			if ($ok && $shape==='simple' && !ps_mono($as)) { $ok=false; $reason='amount_not_monotonic'; }
			if ($ok) foreach ($parsed as $r) if ($r['a_from']<=0 || $r['a_from']>2000) { $ok=false; $reason='amount_out_of_range'; break; }
			if ($ok) { $status='verified'; $reason=''; }
			elseif ($reason===$shape) $reason='too_few_rows_or_parse_fail';
		}
		elseif ($shape === 'matrix') {
			// eilutes=svoris, stulpeliai=salyga (aktyvumas / kuno bukle)
			$dims = array_slice($hdr, 1);
			$ws=array(); $colvals=array();
			for ($i=1; $i<count($rows); $i++) {
				$cl = ps_cells($rows[$i]); if (count($cl) < 2) continue;
				$w = ps_num($cl[0]);
				if (!$w) { $bad++; continue; }
				$ws[] = $w[0];
				for ($j=1; $j<count($cl) && $j<=count($dims); $j++) {
					$a = ps_num($cl[$j]); if (!$a) { $bad++; continue; }
					$parsed[] = array('w_from'=>$w[0],'w_to'=>$w[1],'a_from'=>$a[0],'a_to'=>$a[1],
						'cond'=>array('dim'=>$dims[$j-1]));
					$colvals[$j][] = $a[0];
				}
			}
			$ok = count($parsed)>=4 && $bad===0 && ps_mono($ws);
			if ($ok) foreach ($colvals as $cv) if (!ps_mono($cv)) { $ok=false; $reason='matrix_col_not_monotonic'; break; }
			if ($ok) { $status='verified'; $reason=''; }
			elseif ($reason===$shape) $reason='matrix_parse_fail';
		}
		elseif ($shape === 'transposed') {
			// stulpeliai=svoriai, eilutes=kita dimensija (amzius/etapas)
			$wcols = array();
			for ($i=1; $i<$ncol; $i++) { $n = ps_num($hdr[$i]); if ($n) $wcols[$i] = $n; }
			$rowvals = array();
			for ($i=1; $i<count($rows); $i++) {
				$cl = ps_cells($rows[$i]); if (count($cl) < 2) continue;
				$dimlabel = $cl[0];
				if ($dimlabel === '') continue;
				foreach ($wcols as $j => $w) {
					if (!isset($cl[$j])) continue;
					$a = ps_num($cl[$j]); if (!$a) { $bad++; continue; }
					$parsed[] = array('w_from'=>$w[0],'w_to'=>$w[1],'a_from'=>$a[0],'a_to'=>$a[1],
						'cond'=>array($h0=>$dimlabel));
					$rowvals[$i][] = $a[0];
				}
			}
			$wsorted = array_values(array_map(function($x){return $x[0];}, $wcols));
			$ok = count($parsed)>=4 && ps_mono($wsorted);
			// kiekis turi augti su svoriu toje pacioje eiluteje
			if ($ok) foreach ($rowvals as $rv) if (!ps_mono($rv)) { $ok=false; $reason='transposed_row_not_monotonic'; break; }
			if ($ok && $bad > count($parsed)*0.1) { $ok=false; $reason='transposed_too_many_bad_cells'; }
			if ($ok) { $status='verified'; $reason=''; }
			elseif ($reason===$shape) $reason='transposed_parse_fail';
		}

		if (!isset($shapes[$shape])) $shapes[$shape]=array('v'=>0,'a'=>0);
		if ($status==='verified') $shapes[$shape]['v']++; else { $shapes[$shape]['a']++;
			if (!isset($reasons[$reason])) $reasons[$reason]=0; $reasons[$reason]++; }

		$b = wp_get_object_terms($id, 'product_brand', array('fields'=>'names'));
		$tables[$cs] = array('shape'=>$shape,'status'=>$status,'reason'=>$reason,
			'brand'=>(!is_wp_error($b)&&$b)?$b[0]:'(be)','header'=>$hdr,'rows'=>$parsed,
			'row_count'=>count($parsed),'products'=>array($id),'bad'=>$bad,
			'title'=>mb_substr(get_the_title($id),0,50),'cs'=>substr($cs,0,8));
	}

	$pv=0; $pa=0; $rows_v=0;
	foreach ($tables as $t) { if ($t['status']==='verified') { $pv+=count($t['products']); $rows_v+=$t['row_count']; } else $pa+=count($t['products']); }
	$vt = 0; foreach ($tables as $t) if ($t['status']==='verified') $vt++;

	arsort($reasons);
	$o = array('stats'=>$stat,'unique_tables'=>count($tables),'verified_tables'=>$vt,
		'ambiguous_tables'=>count($tables)-$vt,'skus_verified'=>$pv,'skus_ambiguous'=>$pa,
		'rows_verified'=>$rows_v,'by_shape'=>$shapes,'reasons'=>$reasons,'samples'=>array(),'brands'=>array());
	$bb=array();
	foreach ($tables as $t) { $k=$t['brand']; if(!isset($bb[$k])) $bb[$k]=array('v'=>0,'a'=>0,'sku'=>0);
		if($t['status']==='verified') $bb[$k]['v']++; else $bb[$k]['a']++; $bb[$k]['sku']+=count($t['products']); }
	$o['brands']=$bb;
	$n=0;
	foreach ($tables as $t) {
		if ($t['status']!=='verified' || $t['shape']==='simple' || $n++>=3) continue;
		$o['samples'][] = array('shape'=>$t['shape'],'brand'=>$t['brand'],'title'=>$t['title'],
			'skus'=>count($t['products']),'rc'=>$t['row_count'],'hdr'=>array_slice($t['header'],0,6),
			'rows'=>array_slice($t['rows'],0,4));
	}
	header('Content-Type: application/json'); echo wp_json_encode($o); exit;
});`;
fs.writeFileSync('/tmp/snip.json', JSON.stringify({ name:'TEMP M8 Parser2', code:php, scope:'global', active:true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/snip.json "${API}"`);
const r = sh('curl -sk --max-time 300 "https://dev.avesa.lt/?ps_p2=P2Kk7Ss"');
try { out.p = JSON.parse(r); } catch(e){ out.raw = r.slice(0,700); }
const kphp = `add_action('wp_loaded', function(){ if(!isset($_GET['ps_kp2'])||$_GET['ps_kp2']!=='Rr3Ww8Yy'){return;} global $wpdb; $n=$wpdb->query("DELETE FROM {$wpdb->prefix}snippets WHERE name LIKE 'TEMP M8%'"); echo wp_json_encode(array('d'=>$n)); exit; });`;
fs.writeFileSync('/tmp/k.json', JSON.stringify({ name:'TEMP M8 Kill P2', code:kphp, scope:'global', active:true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/k.json "${API}"`);
sh('curl -sk --max-time 25 "https://dev.avesa.lt/?ps_kp2=Rr3Ww8Yy"');
ghPut('screenshots/m8_parser2.json', Buffer.from(JSON.stringify(out)), 'parser v2: transposed+matrix');
console.log('DONE');
