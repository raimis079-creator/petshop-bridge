import { execSync } from 'child_process';
import fs from 'fs';
const TOKG = process.env.GH_TOKEN;
function ghPut(p, buf, m) {
  const url = `https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/${p}`;
  let sha=''; try { const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${url}"`).toString()); if(j.sha) sha=j.sha; } catch(e){}
  fs.writeFileSync('/tmp/p.json', JSON.stringify({ message: m, content: buf.toString('base64'), ...(sha?{sha}:{}) }));
  execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${url}"`, {maxBuffer:30*1024*1024});
}
function sh(c){ try { return execSync(c,{maxBuffer:60*1024*1024}).toString(); } catch(e){ return 'ERR:'+String(e.message).slice(0,200); } }
const AUTH = Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').replace(/\s+/g,'')).toString('base64');
const API = 'https://dev.avesa.lt/wp-json/code-snippets/v1/snippets';
const out = {};
const php = `
add_action('wp_loaded', function(){
	if ( ! isset($_GET['ps_dry']) || $_GET['ps_dry'] !== 'Dy4Ll9Tt' ) { return; }
	@set_time_limit(500);
	global $wpdb;

	// ===== SAUGIKLIS: patvirtinam, kad NIEKO neraso =====
	$GUARD = array('writes'=>0, 'ddl'=>0);

	// ===== 1. AR LENTELES JAU EGZISTUOJA? =====
	$pre = array();
	foreach (array('ps_feeding_tables','ps_feeding_rows','ps_feeding_map') as $t) {
		$full = $wpdb->prefix . $t;
		$pre[$t] = ($wpdb->get_var($wpdb->prepare("SHOW TABLES LIKE %s", $full)) === $full);
	}

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
	function ps_mono($arr) { $p=-INF; foreach ($arr as $v) { if ($v<$p) return false; $p=$v; } return true; }

	$ids = get_posts(array('post_type'=>'product','post_status'=>'publish','posts_per_page'=>-1,'fields'=>'ids',
		'tax_query'=>array(array('taxonomy'=>'product_cat','field'=>'slug','terms'=>array('sausas-maistas-sunims','sausas-maistas-katems')))));

	$tables = array();
	foreach ($ids as $id) {
		if (get_post_meta($id,'_stock_status',true) !== 'instock') continue;
		$c = get_post_field('post_content', $id);
		if (stripos($c,'Šėrimo instrukcij') === false) continue;
		$pos  = stripos($c,'Šėrimo instrukcij');
		$full = mb_substr($c, $pos);
		$tbl = null;
		if (preg_match('/<table.*?<\\/table>/is', $full, $m))        $tbl = $m[0];
		elseif (preg_match('/<table.*?(?=<h[1-6]|$)/is', $full, $m)) $tbl = $m[0];
		if (!$tbl) continue;
		$norm = mb_strtolower(preg_replace('/\\s+/u','', wp_strip_all_tags($tbl)));
		$cs = md5($norm);
		if (isset($tables[$cs])) { $tables[$cs]['products'][] = $id; continue; }

		preg_match_all('/<tr.*?(?:<\\/tr>|$)/is', $tbl, $trs);
		$rows = $trs[0]; if (count($rows)<2) continue;
		$hdr = ps_cells($rows[0]); $ncol=count($hdr); $h0=mb_strtolower($hdr[0]??'');
		$numh=0; for($i=1;$i<$ncol;$i++) if (preg_match('/^[\\d,\\.]+/u',$hdr[$i])) $numh++;
		if ($numh>=2) $shape='transposed';
		elseif (strpos($h0,'amži')!==false && $ncol==2) $shape='by_age';
		elseif ($ncol==2) $shape='simple';
		elseif ($ncol>=3 && strpos($h0,'svoris')!==false) $shape='matrix';
		else $shape='unknown';

		$parsed=array(); $bad=0; $status='ambiguous'; $reason=$shape;
		if ($shape==='simple' || $shape==='by_age') {
			$ws=array(); $as=array();
			for($i=1;$i<count($rows);$i++){ $cl=ps_cells($rows[$i]); if(count($cl)<2) continue;
				$k=ps_num($cl[0]); $a=ps_num($cl[1]); if(!$k||!$a){$bad++;continue;}
				$r=array('a_from'=>$a[0],'a_to'=>$a[1]);
				if($shape==='simple'){$r['w_from']=$k[0];$r['w_to']=$k[1];$ws[]=$k[0];$r['cond']=null;}
				else {$r['w_from']=null;$r['w_to']=null;$r['cond']=array('age_m_from'=>$k[0],'age_m_to'=>$k[1]);}
				$as[]=$a[0]; $parsed[]=$r; }
			$ok = count($parsed)>=2 && $bad===0;
			if($ok && $shape==='simple' && !ps_mono($ws)){$ok=false;$reason='weight_not_monotonic';}
			if($ok && $shape==='simple' && !ps_mono($as)){$ok=false;$reason='amount_not_monotonic';}
			if($ok) foreach($parsed as $r) if($r['a_from']<=0||$r['a_from']>2000){$ok=false;$reason='amount_out_of_range';break;}
			if($ok){$status='verified';$reason='';} elseif($reason===$shape)$reason='parse_fail';
		} elseif ($shape==='matrix') {
			$dims=array_slice($hdr,1); $ws=array(); $cv=array();
			for($i=1;$i<count($rows);$i++){ $cl=ps_cells($rows[$i]); if(count($cl)<2) continue;
				$w=ps_num($cl[0]); if(!$w){$bad++;continue;} $ws[]=$w[0];
				for($j=1;$j<count($cl)&&$j<=count($dims);$j++){ $a=ps_num($cl[$j]); if(!$a){$bad++;continue;}
					$parsed[]=array('w_from'=>$w[0],'w_to'=>$w[1],'a_from'=>$a[0],'a_to'=>$a[1],'cond'=>array('dim'=>$dims[$j-1]));
					$cv[$j][]=$a[0]; } }
			$ok=count($parsed)>=4 && $bad===0 && ps_mono($ws);
			if($ok) foreach($cv as $x) if(!ps_mono($x)){$ok=false;$reason='matrix_col_not_monotonic';break;}
			if($ok){$status='verified';$reason='';} elseif($reason===$shape)$reason='matrix_parse_fail';
		} elseif ($shape==='transposed') {
			$wc=array(); for($i=1;$i<$ncol;$i++){$n=ps_num($hdr[$i]); if($n)$wc[$i]=$n;}
			$rv=array();
			for($i=1;$i<count($rows);$i++){ $cl=ps_cells($rows[$i]); if(count($cl)<2) continue;
				$dl=$cl[0]; if($dl==='') continue;
				foreach($wc as $j=>$w){ if(!isset($cl[$j])) continue; $a=ps_num($cl[$j]); if(!$a){$bad++;continue;}
					$parsed[]=array('w_from'=>$w[0],'w_to'=>$w[1],'a_from'=>$a[0],'a_to'=>$a[1],'cond'=>array($h0=>$dl));
					$rv[$i][]=$a[0]; } }
			$ws=array_values(array_map(function($x){return $x[0];},$wc));
			$ok=count($parsed)>=4 && ps_mono($ws);
			if($ok) foreach($rv as $x) if(!ps_mono($x)){$ok=false;$reason='transposed_row_not_monotonic';break;}
			if($ok && $bad > count($parsed)*0.1){$ok=false;$reason='transposed_too_many_bad_cells';}
			if($ok){$status='verified';$reason='';} elseif($reason===$shape)$reason='transposed_parse_fail';
		}
		$b = wp_get_object_terms($id,'product_brand',array('fields'=>'names'));
		$sp = has_term('sausas-maistas-katems','product_cat',$id) ? 'cat' : 'dog';
		$tables[$cs] = array('checksum'=>$cs,'source_hash'=>md5($tbl),'brand'=>(!is_wp_error($b)&&$b)?$b[0]:null,
			'species'=>$sp,'shape'=>$shape,'status'=>$status,'reason'=>$reason,'header'=>$hdr,
			'rows'=>$parsed,'row_count'=>count($parsed),'products'=>array($id),'bad_cells'=>$bad);
	}

	// ===== 2. KA RASYTUME (payload) =====
	$pl_tables=0; $pl_rows=0; $pl_map=0; $v=0; $a=0;
	foreach ($tables as $t) {
		$pl_tables++; $pl_map += count($t['products']);
		if ($t['status']==='verified') { $v++; $pl_rows += $t['row_count']; } else $a++;
	}

	// ===== 3. DDL (TIK TEKSTAS, NEVYKDOMA) =====
	$p = $wpdb->prefix;
	$cc = $wpdb->get_charset_collate();
	$ddl = array(
	 "CREATE TABLE {$p}ps_feeding_tables (\\n  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,\\n  checksum CHAR(32) NOT NULL,\\n  source_hash CHAR(32) NOT NULL,\\n  brand VARCHAR(100) DEFAULT NULL,\\n  line VARCHAR(150) DEFAULT NULL,\\n  scope VARCHAR(20) NOT NULL DEFAULT 'product',\\n  species VARCHAR(20) DEFAULT NULL,\\n  shape VARCHAR(20) NOT NULL,\\n  status VARCHAR(20) NOT NULL DEFAULT 'draft',\\n  reason VARCHAR(60) DEFAULT NULL,\\n  source_url TEXT DEFAULT NULL,\\n  source_version VARCHAR(50) DEFAULT NULL,\\n  row_count SMALLINT UNSIGNED NOT NULL DEFAULT 0,\\n  parsed_at DATETIME NOT NULL,\\n  verified_at DATETIME DEFAULT NULL,\\n  verified_by VARCHAR(60) DEFAULT NULL,\\n  created_at DATETIME NOT NULL,\\n  updated_at DATETIME NOT NULL,\\n  PRIMARY KEY (id),\\n  UNIQUE KEY uq_checksum (checksum),\\n  KEY idx_status (status),\\n  KEY idx_brand (brand),\\n  KEY idx_shape (shape)\\n) {$cc};",
	 "CREATE TABLE {$p}ps_feeding_rows (\\n  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,\\n  feeding_table_id BIGINT UNSIGNED NOT NULL,\\n  row_order SMALLINT UNSIGNED NOT NULL DEFAULT 0,\\n  weight_from_kg DECIMAL(6,2) DEFAULT NULL,\\n  weight_to_kg DECIMAL(6,2) DEFAULT NULL,\\n  amount_from_g DECIMAL(7,2) NOT NULL,\\n  amount_to_g DECIMAL(7,2) NOT NULL,\\n  condition_dimensions TEXT DEFAULT NULL,\\n  PRIMARY KEY (id),\\n  KEY idx_ft (feeding_table_id),\\n  KEY idx_weight (weight_from_kg, weight_to_kg)\\n) {$cc};",
	 "CREATE TABLE {$p}ps_feeding_map (\\n  feeding_table_id BIGINT UNSIGNED NOT NULL,\\n  product_id BIGINT UNSIGNED NOT NULL,\\n  PRIMARY KEY (feeding_table_id, product_id),\\n  KEY idx_product (product_id)\\n) {$cc};"
	);

	$o = array(
	 'DRY_RUN' => true,
	 'writes_executed' => $GUARD['writes'],
	 'ddl_executed' => $GUARD['ddl'],
	 'tables_exist_before' => $pre,
	 'would_insert' => array('feeding_tables'=>$pl_tables, 'feeding_rows'=>$pl_rows, 'feeding_map'=>$pl_map),
	 'status_split' => array('verified'=>$v, 'ambiguous'=>$a),
	 'ddl_preview' => $ddl,
	 'payload' => array_values($tables),
	);
	header('Content-Type: application/json'); echo wp_json_encode($o); exit;
});`;
fs.writeFileSync('/tmp/snip.json', JSON.stringify({ name:'TEMP M8 FT DryRun', code:php, scope:'global', active:true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/snip.json "${API}"`);
const r = sh('curl -sk --max-time 300 "https://dev.avesa.lt/?ps_dry=Dy4Ll9Tt"');
let ok=false;
try { const j = JSON.parse(r); out.summary = { DRY_RUN:j.DRY_RUN, writes_executed:j.writes_executed, ddl_executed:j.ddl_executed,
  tables_exist_before:j.tables_exist_before, would_insert:j.would_insert, status_split:j.status_split, ddl_preview:j.ddl_preview };
  ghPut('analize/feeding_payload_dryrun.json', Buffer.from(JSON.stringify(j.payload)), 'FeedingTable dry-run payload');
  out.payload_bytes = JSON.stringify(j.payload).length; ok=true;
} catch(e){ out.raw = r.slice(0,700); }
const kphp = `add_action('wp_loaded', function(){ if(!isset($_GET['ps_kdy'])||$_GET['ps_kdy']!=='Rr3Ww8Yy'){return;} global $wpdb; $n=$wpdb->query("DELETE FROM {$wpdb->prefix}snippets WHERE name LIKE 'TEMP M8%'"); echo wp_json_encode(array('d'=>$n)); exit; });`;
fs.writeFileSync('/tmp/k.json', JSON.stringify({ name:'TEMP M8 Kill DY', code:kphp, scope:'global', active:true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/k.json "${API}"`);
out.cleanup = sh('curl -sk --max-time 25 "https://dev.avesa.lt/?ps_kdy=Rr3Ww8Yy"').slice(0,60);
ghPut('screenshots/m8_dryrun.json', Buffer.from(JSON.stringify(out)), 'FT dry-run summary');
console.log('DONE');
