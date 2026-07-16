import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN;
function ghPut(p,buf,m){const u=`https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/${p}`;let s='';try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:m,content:buf.toString('base64'),...(s?{sha:s}:{})}));
 console.log('GHPUT '+execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null -w "%{http_code}"`).toString());}
function sh(c){try{return execSync(c,{maxBuffer:60*1024*1024}).toString();}catch(e){return 'ERR';}}
const AUTH=Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').replace(/\s+/g,'')).toString('base64');
const API='https://dev.avesa.lt/wp-json/code-snippets/v1/snippets';
const out={};
try{
const php=`
add_action('wp_loaded', function(){
	if(!isset($_GET['ps_v6'])||$_GET['ps_v6']!=='V6Ll4Tt'){return;}
	if(!isset($_GET['confirm'])||$_GET['confirm']!=='REBUILD_V6'){echo 'NO CONFIRM';exit;}
	@set_time_limit(900); global $wpdb; $pf=$wpdb->prefix; $o=array('errors'=>array());
	$wpdb->query("DELETE FROM {$pf}ps_feeding_rows"); $wpdb->query("DELETE FROM {$pf}ps_feeding_map");
	$wpdb->query("DELETE FROM {$pf}ps_feeding_tables"); $wpdb->query("ALTER TABLE {$pf}ps_feeding_tables AUTO_INCREMENT=1");

	// FIX 1: '-' = sąmoninga spraga, ne klaida
	function ps_num($s){
		$s=trim(str_replace(',','.',$s));
		if($s===''||$s==='-'||$s==='–'||$s==='—'||$s==='n/a') return 'GAP';
		if(preg_match('/([\\d\\.]+)\\s*[-–—]\\s*([\\d\\.]+)/u',$s,$m)) return array((float)$m[1],(float)$m[2]);
		if(preg_match('/([\\d\\.]+)/u',$s,$m)) return array((float)$m[1],(float)$m[1]); return null; }
	function ps_cells($r){ preg_match_all('/<t[dh][^>]*>(.*?)<\\/t[dh]>/is',$r,$m);
		return array_map(function($x){ return trim(preg_replace('/\\s+/u',' ',html_entity_decode(wp_strip_all_tags($x)))); },$m[1]); }
	function ps_mono($a){ $pv=-INF; foreach($a as $v){ if($v<$pv) return false; $pv=$v; } return true; }

	// FIX 2: antraštė[0] – pirminis rowdim signalas
	function ps_rowdim($h0,$labels){
		$h0=mb_strtolower($h0);
		if(mb_strpos($h0,'amži')!==false) return 'age';        // Josera: "Amžius (mėn.)" – vienetas antraštėje
		$n=count($labels); if(!$n) return null; $age=0;$bc=0;$act=0;
		foreach($labels as $l){ $l=mb_strtolower($l);
			if(preg_match('/mėn|men\\.|sav\\b|savai|metai|months?\\s*\\d|weeks?\\s*\\d|nujunk|nutrauk|weaning/u',$l)){$age++;continue;}
			if(preg_match('/lies|antsvor|nutuk|kūno|kuno/u',$l)){$bc++;continue;}
			if(preg_match('/bute|kieme|aktyv|senyv/u',$l)){$act++;continue;}
			if(preg_match('/^normali$|^normalus$/u',$l)){$bc++;continue;} }
		if($age>=$n*0.6) return 'age'; if($bc>=$n*0.6) return 'body_condition'; if($act>=$n*0.6) return 'activity_level';
		if($bc>0&&$bc+$act>=$n*0.6&&$bc>=$act) return 'body_condition';
		if($act>0&&$bc+$act>=$n*0.6) return 'activity_level'; return null; }

	$ids=get_posts(array('post_type'=>'product','post_status'=>'publish','posts_per_page'=>-1,'fields'=>'ids',
		'tax_query'=>array(array('taxonomy'=>'product_cat','field'=>'slug','terms'=>array('sausas-maistas-sunims','sausas-maistas-katems')))));
	$tabs=array();
	foreach($ids as $id){
		if(get_post_meta($id,'_stock_status',true)!=='instock') continue;
		$c=get_post_field('post_content',$id);
		$pos=mb_stripos($c,'Šėrimo instrukcij'); if($pos===false) continue;
		$full=mb_substr($c,$pos);
		$scope=$full;
		if(preg_match('/^(.*?)(?=<h[1-6])/is',$full,$sm) && strlen($sm[1])>200) $scope=$sm[1];
		$tbl=null;
		if(preg_match('/<table.*?<\\/table>/is',$scope,$m)) $tbl=$m[0];
		elseif(preg_match('/<tr.*<\\/tr>/is',$scope,$m)) $tbl='<table>'.$m[0].'</table>';
		if(!$tbl) continue;
		$cs=md5(mb_strtolower(preg_replace('/\\s+/u','',wp_strip_all_tags($tbl))));
		if(isset($tabs[$cs])){ $tabs[$cs]['products'][]=$id; continue; }
		preg_match_all('/<tr.*?(?:<\\/tr>|$)/is',$tbl,$trs); $rows=$trs[0];
		if(count($rows)<2) continue;
		$hdr=ps_cells($rows[0]); $ncol=count($hdr); $h0raw=$hdr[0]??''; $h0=mb_strtolower($h0raw);
		$numh=0; for($i=1;$i<$ncol;$i++) if(preg_match('/^[\\d,\\.]+/u',$hdr[$i])) $numh++;

		// FIX 5: nauja forma age_weight (Amžius | Svoris | Kiekis)
		$h1=mb_strtolower($hdr[1]??'');
		if($ncol==3 && mb_strpos($h0,'amži')!==false && mb_strpos($h1,'svoris')!==false) $shape='age_weight';
		elseif($numh>=2) $shape='transposed';
		elseif(mb_strpos($h0,'amži')!==false && $ncol==2) $shape='by_age';
		elseif($ncol==2) $shape='simple';
		elseif($ncol>=3 && mb_strpos($h0,'svoris')!==false) $shape='matrix';
		else $shape='unknown';

		$labels=array();
		for($i=1;$i<count($rows);$i++){ $cl=ps_cells($rows[$i]); if(count($cl)<2) continue; if(($cl[0]??'')!=='') $labels[]=$cl[0]; }

		$parsed=array(); $bad=0; $gaps=0; $status='ambiguous'; $reason=$shape; $wb=null; $rowdim=null;

		if($shape==='simple'){
			$rowdim='weight'; $wb = (mb_strpos($h0,'suaugusio')!==false) ? 'adult_expected' : 'current';
			$ws=array();$as=array();
			for($i=1;$i<count($rows);$i++){ $cl=ps_cells($rows[$i]); if(count($cl)<2) continue;
				$k=ps_num($cl[0]); $a=ps_num($cl[1]);
				if($k==='GAP'||$a==='GAP'){$gaps++;continue;}
				if(!$k||!$a){$bad++;continue;}
				$ws[]=$k[0]; $as[]=$a[0];
				$parsed[]=array('w_from'=>$k[0],'w_to'=>$k[1],'a_from'=>$a[0],'a_to'=>$a[1],'cond'=>null); }
			$ok=count($parsed)>=2&&$bad===0;
			if($ok&&!ps_mono($ws)){$ok=false;$reason='weight_not_monotonic';}
			if($ok&&!ps_mono($as)){$ok=false;$reason='amount_not_monotonic';}
			if($ok) foreach($parsed as $r) if($r['a_from']<=0||$r['a_from']>2000){$ok=false;$reason='amount_out_of_range';break;}
			if($ok){$status='verified';$reason='';} elseif($reason===$shape)$reason='parse_fail';

		} elseif($shape==='by_age'){
			// FIX 3: kiekio monotoniskumas NETAIKOMAS; FIX 4: tekstine etikete leidziama
			$rowdim='age'; $wb=null;
			for($i=1;$i<count($rows);$i++){ $cl=ps_cells($rows[$i]); if(count($cl)<2) continue;
				$lbl=$cl[0]; $a=ps_num($cl[1]);
				if($a==='GAP'){$gaps++;continue;}
				if(!$a){$bad++;continue;}
				$k=ps_num($lbl);
				$cond = (is_array($k)) ? array('age_m_from'=>$k[0],'age_m_to'=>$k[1]) : array('age_label'=>$lbl);
				$parsed[]=array('w_from'=>null,'w_to'=>null,'a_from'=>$a[0],'a_to'=>$a[1],'cond'=>$cond); }
			$ok=count($parsed)>=2&&$bad===0;
			if($ok) foreach($parsed as $r) if($r['a_from']<=0||$r['a_from']>2000){$ok=false;$reason='amount_out_of_range';break;}
			if($ok){$status='verified';$reason='';} elseif($reason===$shape)$reason='parse_fail';

		} elseif($shape==='age_weight'){
			// FIX 5: Amzius | Svoris | Kiekis -> svoris yra DABARTINIS
			$rowdim='age'; $wb='current';
			for($i=1;$i<count($rows);$i++){ $cl=ps_cells($rows[$i]); if(count($cl)<3) continue;
				$ag=ps_num($cl[0]); $w=ps_num($cl[1]); $a=ps_num($cl[2]);
				if($w==='GAP'||$a==='GAP'){$gaps++;continue;}
				if(!$w||!$a){$bad++;continue;}
				$cond = is_array($ag) ? array('age_m_from'=>$ag[0],'age_m_to'=>$ag[1]) : array('age_label'=>$cl[0]);
				$parsed[]=array('w_from'=>$w[0],'w_to'=>$w[1],'a_from'=>$a[0],'a_to'=>$a[1],'cond'=>$cond); }
			$ok=count($parsed)>=2&&$bad===0;
			if($ok){$status='verified';$reason='';} elseif($reason===$shape)$reason='parse_fail';

		} elseif($shape==='matrix'){
			$rowdim='weight'; $wb=(mb_strpos($h0,'suaugusio')!==false)?'adult_expected':'current';
			$dims=array_slice($hdr,1); $ws=array(); $cv=array();
			for($i=1;$i<count($rows);$i++){ $cl=ps_cells($rows[$i]); if(count($cl)<2) continue;
				$w=ps_num($cl[0]); if($w==='GAP'||!$w){$bad++;continue;} $ws[]=$w[0];
				for($j=1;$j<count($cl)&&$j<=count($dims);$j++){
					$a=ps_num($cl[$j]);
					if($a==='GAP'){$gaps++;continue;}          // '-' = netaikoma
					if(!$a){$bad++;continue;}
					$parsed[]=array('w_from'=>$w[0],'w_to'=>$w[1],'a_from'=>$a[0],'a_to'=>$a[1],'cond'=>array('activity_level'=>$dims[$j-1]));
					$cv[$j][]=$a[0]; } }
			$ok=count($parsed)>=4&&$bad===0&&ps_mono($ws);
			if($ok) foreach($cv as $x) if(!ps_mono($x)){$ok=false;$reason='matrix_col_not_monotonic';break;}
			if($ok){$status='verified';$reason='';} elseif($reason===$shape)$reason='matrix_parse_fail';

		} elseif($shape==='transposed'){
			$rowdim=ps_rowdim($h0raw,$labels);
			if(mb_strpos($h0,'suaugusio')!==false) $wb='adult_expected';
			elseif($rowdim==='age') $wb='adult_expected';
			elseif($rowdim==='body_condition'||$rowdim==='activity_level') $wb='current';
			if(!$rowdim) $reason='row_dimension_unknown';
			elseif(!$wb) $reason='weight_basis_unknown';
			else { $wc=array(); for($i=1;$i<$ncol;$i++){ $n=ps_num($hdr[$i]); if(is_array($n)) $wc[$i]=$n; }
				$rv=array();
				for($i=1;$i<count($rows);$i++){ $cl=ps_cells($rows[$i]); if(count($cl)<2) continue;
					$dl=$cl[0]??''; if($dl==='') continue;
					foreach($wc as $j=>$w){ if(!isset($cl[$j])) continue;
						$a=ps_num($cl[$j]);
						if($a==='GAP'){$gaps++;continue;}      // '-' = netaikoma
						if(!$a){$bad++;continue;}
						$parsed[]=array('w_from'=>$w[0],'w_to'=>$w[1],'a_from'=>$a[0],'a_to'=>$a[1],'cond'=>array($rowdim=>$dl));
						$rv[$i][]=$a[0]; } }
				$ws=array_values(array_map(function($x){return $x[0];},$wc));
				$ok=count($parsed)>=4&&ps_mono($ws);
				if($ok) foreach($rv as $x) if(count($x)>1&&!ps_mono($x)){$ok=false;$reason='row_not_monotonic';break;}
				if($ok&&$bad>count($parsed)*0.1){$ok=false;$reason='too_many_bad_cells';}
				if($ok){$status='verified';$reason='';} }
		}
		$b=wp_get_object_terms($id,'product_brand',array('fields'=>'names'));
		$tabs[$cs]=array('source_hash'=>md5($tbl),'brand'=>(!is_wp_error($b)&&$b)?$b[0]:null,
			'species'=>has_term('sausas-maistas-katems','product_cat',$id)?'cat':'dog',
			'weight_basis'=>$wb,'row_dimension'=>$rowdim,'shape'=>$shape,'status'=>$status,
			'reason'=>$reason?:null,'rows'=>$parsed,'products'=>array($id),'source_url'=>get_permalink($id));
	}
	foreach($tabs as $t) if($t['status']==='verified' && !in_array($t['shape'],array('by_age')) && !$t['weight_basis']){
		$o['ABORTED']='verified be weight_basis: '.$t['shape']; header('Content-Type: application/json'); echo wp_json_encode($o); exit; }

	$now=current_time('mysql'); $it=0;$ir=0;$im=0;
	foreach($tabs as $cs=>$t){
		if(!$wpdb->insert($pf.'ps_feeding_tables',array('checksum'=>$cs,'source_hash'=>$t['source_hash'],
			'brand'=>$t['brand'],'scope'=>count($t['products'])>1?'line':'product','species'=>$t['species'],
			'weight_basis'=>$t['weight_basis'],'row_dimension'=>$t['row_dimension'],'shape'=>$t['shape'],
			'status'=>$t['status'],'reason'=>$t['reason'],'source_url'=>$t['source_url'],
			'source_version'=>'post_content_v6_2026-07-16','row_count'=>count($t['rows']),'parsed_at'=>$now,
			'verified_at'=>$t['status']==='verified'?$now:null,'verified_by'=>$t['status']==='verified'?'auto_parser_v6':null,
			'created_at'=>$now,'updated_at'=>$now))){ $o['errors'][]=$wpdb->last_error; continue; }
		$ftid=$wpdb->insert_id; $it++; $ord=0;
		foreach($t['rows'] as $r) if($wpdb->insert($pf.'ps_feeding_rows',array('feeding_table_id'=>$ftid,'row_order'=>$ord++,
			'weight_from_kg'=>$r['w_from'],'weight_to_kg'=>$r['w_to'],'amount_from_g'=>$r['a_from'],'amount_to_g'=>$r['a_to'],
			'condition_dimensions'=>$r['cond']?wp_json_encode($r['cond'],JSON_UNESCAPED_UNICODE):null))) $ir++;
		foreach($t['products'] as $pid) if($wpdb->insert($pf.'ps_feeding_map',array('feeding_table_id'=>$ftid,'product_id'=>$pid))) $im++;
	}
	$o['inserted']=array('t'=>$it,'r'=>$ir,'m'=>$im);
	$o['CHECKS']=array(
	 'orphan_rows'=>(int)$wpdb->get_var("SELECT COUNT(*) FROM {$pf}ps_feeding_rows r LEFT JOIN {$pf}ps_feeding_tables t ON t.id=r.feeding_table_id WHERE t.id IS NULL"),
	 'orphan_map'=>(int)$wpdb->get_var("SELECT COUNT(*) FROM {$pf}ps_feeding_map m LEFT JOIN {$pf}ps_feeding_tables t ON t.id=m.feeding_table_id WHERE t.id IS NULL"),
	 'verified_no_basis'=>(int)$wpdb->get_var("SELECT COUNT(*) FROM {$pf}ps_feeding_tables WHERE status='verified' AND shape<>'by_age' AND weight_basis IS NULL"));
	$keys=array();
	foreach($wpdb->get_col("SELECT DISTINCT condition_dimensions FROM {$pf}ps_feeding_rows WHERE condition_dimensions IS NOT NULL") as $j){
		$dd=json_decode($j,true); if(is_array($dd)) foreach(array_keys($dd) as $kk){ if(!isset($keys[$kk]))$keys[$kk]=0; $keys[$kk]++; } }
	$o['CHECKS']['cond_KEYS']=$keys;
	$o['totals']=array(
	 'tables'=>(int)$wpdb->get_var("SELECT COUNT(*) FROM {$pf}ps_feeding_tables"),
	 'verified'=>(int)$wpdb->get_var("SELECT COUNT(*) FROM {$pf}ps_feeding_tables WHERE status='verified'"),
	 'ambiguous'=>(int)$wpdb->get_var("SELECT COUNT(*) FROM {$pf}ps_feeding_tables WHERE status='ambiguous'"),
	 'rows'=>(int)$wpdb->get_var("SELECT COUNT(*) FROM {$pf}ps_feeding_rows"),
	 'SKU_verified'=>(int)$wpdb->get_var("SELECT COUNT(DISTINCT m.product_id) FROM {$pf}ps_feeding_map m JOIN {$pf}ps_feeding_tables t ON t.id=m.feeding_table_id WHERE t.status='verified'"),
	 'SKU_any'=>(int)$wpdb->get_var("SELECT COUNT(DISTINCT product_id) FROM {$pf}ps_feeding_map"));
	$o['live_15kg']=$wpdb->get_results("SELECT t.brand,t.shape,r.amount_from_g,r.amount_to_g FROM {$pf}ps_feeding_rows r
		JOIN {$pf}ps_feeding_tables t ON t.id=r.feeding_table_id WHERE t.status='verified' AND t.species='dog'
		AND t.weight_basis='current' AND r.weight_from_kg<=15 AND r.weight_to_kg>=15 LIMIT 3",ARRAY_A);
	$o['blocked']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$pf}ps_feeding_rows r JOIN {$pf}ps_feeding_tables t ON t.id=r.feeding_table_id
		WHERE t.status='verified' AND t.species='dog' AND t.weight_basis='adult_expected' AND r.weight_from_kg<=15 AND r.weight_to_kg>=15");
	$o['reasons']=$wpdb->get_results("SELECT reason,shape,COUNT(*) n FROM {$pf}ps_feeding_tables WHERE status='ambiguous' GROUP BY reason,shape ORDER BY n DESC",ARRAY_A);
	$o['dist']=$wpdb->get_results("SELECT shape,status,COUNT(*) n FROM {$pf}ps_feeding_tables GROUP BY shape,status ORDER BY shape",ARRAY_A);
	header('Content-Type: application/json'); echo wp_json_encode($o); exit;
});`;
fs.writeFileSync('/tmp/snip.json',JSON.stringify({name:'TEMP M8 V6',code:php,scope:'global',active:true}));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/snip.json "${API}"`);
const r=sh('curl -sk --max-time 800 "https://dev.avesa.lt/?ps_v6=V6Ll4Tt&confirm=REBUILD_V6"');
try{out.p=JSON.parse(r);}catch(e){out.raw=r.slice(0,800);}
const k=`add_action('wp_loaded',function(){if(!isset($_GET['ps_kv6'])||$_GET['ps_kv6']!=='Rr3Ww8Yy'){return;}global $wpdb;$n=$wpdb->query("DELETE FROM {$wpdb->prefix}snippets WHERE name LIKE 'TEMP M8%'");echo wp_json_encode(array('d'=>$n));exit;});`;
fs.writeFileSync('/tmp/k.json',JSON.stringify({name:'TEMP M8 Kill V6',code:k,scope:'global',active:true}));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/k.json "${API}"`);
out.cleanup=sh('curl -sk --max-time 25 "https://dev.avesa.lt/?ps_kv6=Rr3Ww8Yy"').slice(0,40);
}catch(e){out.FATAL=String(e&&e.message?e.message:e).slice(0,300);}
ghPut('screenshots/m8_v6.json',Buffer.from(JSON.stringify(out)),'parser v6');
console.log('DONE');
