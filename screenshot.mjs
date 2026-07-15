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
	if ( ! isset($_GET['ps_ap']) || $_GET['ps_ap'] !== 'Ap8Zz2Qq' ) { return; }
	if ( ! isset($_GET['confirm']) || $_GET['confirm'] !== 'APPLY_FEEDING' ) { echo 'NO CONFIRM'; exit; }
	@set_time_limit(600);
	global $wpdb;
	$o = array('steps'=>array(), 'errors'=>array());
	$p = $wpdb->prefix; $cc = $wpdb->get_charset_collate();

	// ===== 1. DDL (idempotentiska: IF NOT EXISTS) =====
	$ddl = array(
	 "CREATE TABLE IF NOT EXISTS {$p}ps_feeding_tables (
	  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, checksum CHAR(32) NOT NULL, source_hash CHAR(32) NOT NULL,
	  brand VARCHAR(100) DEFAULT NULL, line VARCHAR(150) DEFAULT NULL, scope VARCHAR(20) NOT NULL DEFAULT 'product',
	  species VARCHAR(20) DEFAULT NULL, shape VARCHAR(20) NOT NULL, status VARCHAR(20) NOT NULL DEFAULT 'draft',
	  reason VARCHAR(60) DEFAULT NULL, source_url TEXT DEFAULT NULL, source_version VARCHAR(60) DEFAULT NULL,
	  row_count SMALLINT UNSIGNED NOT NULL DEFAULT 0, parsed_at DATETIME NOT NULL, verified_at DATETIME DEFAULT NULL,
	  verified_by VARCHAR(60) DEFAULT NULL, created_at DATETIME NOT NULL, updated_at DATETIME NOT NULL,
	  PRIMARY KEY (id), UNIQUE KEY uq_checksum (checksum), KEY idx_status (status), KEY idx_brand (brand), KEY idx_shape (shape)
	 ) {$cc}",
	 "CREATE TABLE IF NOT EXISTS {$p}ps_feeding_rows (
	  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT, feeding_table_id BIGINT UNSIGNED NOT NULL,
	  row_order SMALLINT UNSIGNED NOT NULL DEFAULT 0, weight_from_kg DECIMAL(6,2) DEFAULT NULL,
	  weight_to_kg DECIMAL(6,2) DEFAULT NULL, amount_from_g DECIMAL(7,2) NOT NULL, amount_to_g DECIMAL(7,2) NOT NULL,
	  condition_dimensions TEXT DEFAULT NULL,
	  PRIMARY KEY (id), KEY idx_ft (feeding_table_id), KEY idx_weight (weight_from_kg, weight_to_kg)
	 ) {$cc}",
	 "CREATE TABLE IF NOT EXISTS {$p}ps_feeding_map (
	  feeding_table_id BIGINT UNSIGNED NOT NULL, product_id BIGINT UNSIGNED NOT NULL,
	  PRIMARY KEY (feeding_table_id, product_id), KEY idx_product (product_id)
	 ) {$cc}"
	);
	foreach ($ddl as $q) { $r = $wpdb->query($q); if ($r === false) $o['errors'][] = 'DDL: '.$wpdb->last_error; }
	foreach (array('ps_feeding_tables','ps_feeding_rows','ps_feeding_map') as $t) {
		$f = $p.$t; $o['steps']['created_'.$t] = ($wpdb->get_var($wpdb->prepare("SHOW TABLES LIKE %s",$f)) === $f);
	}

	// ===== 2. PARSE (identiskas dry-run kodas) =====
	function ps_num($s){ $s=str_replace(',','.',$s);
		if(preg_match('/([\\d\\.]+)\\s*[-–—]\\s*([\\d\\.]+)/u',$s,$m)) return array((float)$m[1],(float)$m[2]);
		if(preg_match('/([\\d\\.]+)/u',$s,$m)) return array((float)$m[1],(float)$m[1]); return null; }
	function ps_cells($row){ preg_match_all('/<t[dh][^>]*>(.*?)<\\/t[dh]>/is',$row,$m);
		return array_map(function($x){ return trim(preg_replace('/\\s+/u',' ',html_entity_decode(wp_strip_all_tags($x)))); },$m[1]); }
	function ps_mono($a){ $pv=-INF; foreach($a as $v){ if($v<$pv) return false; $pv=$v; } return true; }

	$ids = get_posts(array('post_type'=>'product','post_status'=>'publish','posts_per_page'=>-1,'fields'=>'ids',
		'tax_query'=>array(array('taxonomy'=>'product_cat','field'=>'slug','terms'=>array('sausas-maistas-sunims','sausas-maistas-katems')))));
	$tables = array();
	foreach ($ids as $id) {
		if (get_post_meta($id,'_stock_status',true)!=='instock') continue;
		$c = get_post_field('post_content',$id);
		if (stripos($c,'Šėrimo instrukcij')===false) continue;
		$full = mb_substr($c, stripos($c,'Šėrimo instrukcij'));
		$tbl=null;
		if(preg_match('/<table.*?<\\/table>/is',$full,$m)) $tbl=$m[0];
		elseif(preg_match('/<table.*?(?=<h[1-6]|$)/is',$full,$m)) $tbl=$m[0];
		if(!$tbl) continue;
		$cs = md5(mb_strtolower(preg_replace('/\\s+/u','',wp_strip_all_tags($tbl))));
		if(isset($tables[$cs])){ $tables[$cs]['products'][]=$id; continue; }
		preg_match_all('/<tr.*?(?:<\\/tr>|$)/is',$tbl,$trs); $rows=$trs[0];
		if(count($rows)<2) continue;
		$hdr=ps_cells($rows[0]); $ncol=count($hdr); $h0=mb_strtolower($hdr[0]??'');
		$numh=0; for($i=1;$i<$ncol;$i++) if(preg_match('/^[\\d,\\.]+/u',$hdr[$i])) $numh++;
		if($numh>=2) $shape='transposed';
		elseif(strpos($h0,'amži')!==false && $ncol==2) $shape='by_age';
		elseif($ncol==2) $shape='simple';
		elseif($ncol>=3 && strpos($h0,'svoris')!==false) $shape='matrix';
		else $shape='unknown';
		$parsed=array(); $bad=0; $status='ambiguous'; $reason=$shape;
		if($shape==='simple'||$shape==='by_age'){ $ws=array(); $as=array();
			for($i=1;$i<count($rows);$i++){ $cl=ps_cells($rows[$i]); if(count($cl)<2) continue;
				$k=ps_num($cl[0]); $a=ps_num($cl[1]); if(!$k||!$a){$bad++;continue;}
				$r=array('a_from'=>$a[0],'a_to'=>$a[1]);
				if($shape==='simple'){$r['w_from']=$k[0];$r['w_to']=$k[1];$ws[]=$k[0];$r['cond']=null;}
				else {$r['w_from']=null;$r['w_to']=null;$r['cond']=array('age_m_from'=>$k[0],'age_m_to'=>$k[1]);}
				$as[]=$a[0]; $parsed[]=$r; }
			$ok=count($parsed)>=2 && $bad===0;
			if($ok&&$shape==='simple'&&!ps_mono($ws)){$ok=false;$reason='weight_not_monotonic';}
			if($ok&&$shape==='simple'&&!ps_mono($as)){$ok=false;$reason='amount_not_monotonic';}
			if($ok) foreach($parsed as $r) if($r['a_from']<=0||$r['a_from']>2000){$ok=false;$reason='amount_out_of_range';break;}
			if($ok){$status='verified';$reason='';} elseif($reason===$shape)$reason='parse_fail';
		} elseif($shape==='matrix'){ $dims=array_slice($hdr,1); $ws=array(); $cv=array();
			for($i=1;$i<count($rows);$i++){ $cl=ps_cells($rows[$i]); if(count($cl)<2) continue;
				$w=ps_num($cl[0]); if(!$w){$bad++;continue;} $ws[]=$w[0];
				for($j=1;$j<count($cl)&&$j<=count($dims);$j++){ $a=ps_num($cl[$j]); if(!$a){$bad++;continue;}
					$parsed[]=array('w_from'=>$w[0],'w_to'=>$w[1],'a_from'=>$a[0],'a_to'=>$a[1],'cond'=>array('dim'=>$dims[$j-1]));
					$cv[$j][]=$a[0]; } }
			$ok=count($parsed)>=4&&$bad===0&&ps_mono($ws);
			if($ok) foreach($cv as $x) if(!ps_mono($x)){$ok=false;$reason='matrix_col_not_monotonic';break;}
			if($ok){$status='verified';$reason='';} elseif($reason===$shape)$reason='matrix_parse_fail';
		} elseif($shape==='transposed'){ $wc=array(); for($i=1;$i<$ncol;$i++){$n=ps_num($hdr[$i]); if($n)$wc[$i]=$n;}
			$rv=array();
			for($i=1;$i<count($rows);$i++){ $cl=ps_cells($rows[$i]); if(count($cl)<2) continue;
				$dl=$cl[0]; if($dl==='') continue;
				foreach($wc as $j=>$w){ if(!isset($cl[$j])) continue; $a=ps_num($cl[$j]); if(!$a){$bad++;continue;}
					$parsed[]=array('w_from'=>$w[0],'w_to'=>$w[1],'a_from'=>$a[0],'a_to'=>$a[1],'cond'=>array($h0=>$dl));
					$rv[$i][]=$a[0]; } }
			$ws=array_values(array_map(function($x){return $x[0];},$wc));
			$ok=count($parsed)>=4&&ps_mono($ws);
			if($ok) foreach($rv as $x) if(!ps_mono($x)){$ok=false;$reason='transposed_row_not_monotonic';break;}
			if($ok&&$bad>count($parsed)*0.1){$ok=false;$reason='transposed_too_many_bad_cells';}
			if($ok){$status='verified';$reason='';} elseif($reason===$shape)$reason='transposed_parse_fail';
		}
		$b=wp_get_object_terms($id,'product_brand',array('fields'=>'names'));
		$tables[$cs]=array('checksum'=>$cs,'source_hash'=>md5($tbl),'brand'=>(!is_wp_error($b)&&$b)?$b[0]:null,
			'species'=>has_term('sausas-maistas-katems','product_cat',$id)?'cat':'dog','shape'=>$shape,
			'status'=>$status,'reason'=>$reason,'rows'=>$parsed,'products'=>array($id),
			'source_url'=>get_permalink($id));
	}

	// ===== 3. IRASYMAS =====
	$now = current_time('mysql');
	$ins_t=0; $ins_r=0; $ins_m=0; $skip=0;
	foreach ($tables as $cs => $t) {
		$exists = $wpdb->get_var($wpdb->prepare("SELECT id FROM {$p}ps_feeding_tables WHERE checksum=%s", $cs));
		if ($exists) { $skip++; $ftid = $exists; }
		else {
			$ok = $wpdb->insert($p.'ps_feeding_tables', array(
				'checksum'=>$cs, 'source_hash'=>$t['source_hash'], 'brand'=>$t['brand'], 'line'=>null,
				'scope'=> count($t['products'])>1 ? 'line' : 'product', 'species'=>$t['species'],
				'shape'=>$t['shape'], 'status'=>$t['status'], 'reason'=>$t['reason']?:null,
				'source_url'=>$t['source_url'], 'source_version'=>'post_content_2026-07-15',
				'row_count'=>count($t['rows']), 'parsed_at'=>$now,
				'verified_at'=> $t['status']==='verified' ? $now : null,
				'verified_by'=> $t['status']==='verified' ? 'auto_parser_v2' : null,
				'created_at'=>$now, 'updated_at'=>$now
			));
			if(!$ok){ $o['errors'][]='INSERT table: '.$wpdb->last_error; continue; }
			$ftid = $wpdb->insert_id; $ins_t++;
			$ord=0;
			foreach ($t['rows'] as $r) {
				$ok2 = $wpdb->insert($p.'ps_feeding_rows', array(
					'feeding_table_id'=>$ftid, 'row_order'=>$ord++,
					'weight_from_kg'=>$r['w_from'], 'weight_to_kg'=>$r['w_to'],
					'amount_from_g'=>$r['a_from'], 'amount_to_g'=>$r['a_to'],
					'condition_dimensions'=> $r['cond'] ? wp_json_encode($r['cond'], JSON_UNESCAPED_UNICODE) : null
				));
				if($ok2) $ins_r++; else { $o['errors'][]='INSERT row: '.$wpdb->last_error; break; }
			}
		}
		foreach ($t['products'] as $pid) {
			$e = $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM {$p}ps_feeding_map WHERE feeding_table_id=%d AND product_id=%d",$ftid,$pid));
			if(!$e){ if($wpdb->insert($p.'ps_feeding_map', array('feeding_table_id'=>$ftid,'product_id'=>$pid))) $ins_m++; }
		}
	}
	$o['steps']['inserted_tables']=$ins_t; $o['steps']['inserted_rows']=$ins_r;
	$o['steps']['inserted_map']=$ins_m; $o['steps']['skipped_existing']=$skip;

	// ===== 4. PATIKRA IS DB =====
	$o['db'] = array(
	 'tables'      => (int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}ps_feeding_tables"),
	 'verified'    => (int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}ps_feeding_tables WHERE status='verified'"),
	 'ambiguous'   => (int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}ps_feeding_tables WHERE status='ambiguous'"),
	 'rows'        => (int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}ps_feeding_rows"),
	 'map'         => (int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}ps_feeding_map"),
	 'skus_verified' => (int)$wpdb->get_var("SELECT COUNT(DISTINCT m.product_id) FROM {$p}ps_feeding_map m JOIN {$p}ps_feeding_tables t ON t.id=m.feeding_table_id WHERE t.status='verified'"),
	 'rows_null_weight' => (int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}ps_feeding_rows WHERE weight_from_kg IS NULL"),
	 'orphan_rows' => (int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}ps_feeding_rows r LEFT JOIN {$p}ps_feeding_tables t ON t.id=r.feeding_table_id WHERE t.id IS NULL"),
	);
	// gyvas testas: 15kg suo, Farmina
	$o['live_test'] = $wpdb->get_results("SELECT t.brand, t.shape, r.weight_from_kg, r.amount_from_g, r.amount_to_g
		FROM {$p}ps_feeding_rows r JOIN {$p}ps_feeding_tables t ON t.id=r.feeding_table_id
		WHERE t.status='verified' AND t.species='dog' AND r.weight_from_kg=15 LIMIT 4", ARRAY_A);
	header('Content-Type: application/json'); echo wp_json_encode($o); exit;
});`;
fs.writeFileSync('/tmp/snip.json', JSON.stringify({ name:'TEMP M8 FT Apply', code:php, scope:'global', active:true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/snip.json "${API}"`);
const r = sh('curl -sk --max-time 400 "https://dev.avesa.lt/?ps_ap=Ap8Zz2Qq&confirm=APPLY_FEEDING"');
try { out.p = JSON.parse(r); } catch(e){ out.raw = r.slice(0,700); }
const kphp = `add_action('wp_loaded', function(){ if(!isset($_GET['ps_kap'])||$_GET['ps_kap']!=='Rr3Ww8Yy'){return;} global $wpdb; $n=$wpdb->query("DELETE FROM {$wpdb->prefix}snippets WHERE name LIKE 'TEMP M8%'"); echo wp_json_encode(array('d'=>$n)); exit; });`;
fs.writeFileSync('/tmp/k.json', JSON.stringify({ name:'TEMP M8 Kill AP', code:kphp, scope:'global', active:true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/k.json "${API}"`);
out.cleanup = sh('curl -sk --max-time 25 "https://dev.avesa.lt/?ps_kap=Rr3Ww8Yy"').slice(0,60);
ghPut('screenshots/m8_apply.json', Buffer.from(JSON.stringify(out)), 'FT APPLY');
console.log('DONE');
