import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN;
function ghPut(p,buf,m){const u=`https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/${p}`;let s='';try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:m,content:buf.toString('base64'),...(s?{sha:s}:{})}));
 console.log('put '+execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null -w "%{http_code}"`).toString());}
function sh(c){try{return execSync(c,{maxBuffer:40*1024*1024}).toString();}catch(e){return 'ERR';}}
const AUTH=Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').replace(/\s+/g,'')).toString('base64');
const API='https://dev.avesa.lt/wp-json/code-snippets/v1/snippets';
const out={};
try{
const php=`
add_action('wp_loaded', function(){
	if(!isset($_GET['ps_rc'])||$_GET['ps_rc']!=='Rc4Mm8Vv'){return;}
	if(!isset($_GET['confirm'])||$_GET['confirm']!=='RECOVER_105'){echo 'NO CONFIRM';exit;}
	@set_time_limit(600); global $wpdb; $pf=$wpdb->prefix; $o=array('errors'=>array());

	function ps_num($s){ $s=str_replace(',','.',$s);
		if(preg_match('/([\\d\\.]+)\\s*[-–—]\\s*([\\d\\.]+)/u',$s,$m)) return array((float)$m[1],(float)$m[2]);
		if(preg_match('/([\\d\\.]+)/u',$s,$m)) return array((float)$m[1],(float)$m[1]); return null; }
	function ps_cells($r){ preg_match_all('/<t[dh][^>]*>(.*?)<\\/t[dh]>/is',$r,$m);
		return array_map(function($x){ return trim(preg_replace('/\\s+/u',' ',html_entity_decode(wp_strip_all_tags($x)))); },$m[1]); }
	function ps_mono($a){ $pv=-INF; foreach($a as $v){ if($v<$pv) return false; $pv=$v; } return true; }
	function ps_rowdim($labels){ $n=count($labels); if(!$n) return null; $age=0;$bc=0;$act=0;
		foreach($labels as $l){ $l=mb_strtolower($l);
			if(preg_match('/mėn|men\\.|sav\\b|savai|metai|months?\\s*\\d|weeks?\\s*\\d/u',$l)){$age++;continue;}
			if(preg_match('/lies|antsvor|nutuk|kūno|kuno/u',$l)){$bc++;continue;}
			if(preg_match('/bute|kieme|aktyv|senyv/u',$l)){$act++;continue;}
			if(preg_match('/^normali$|^normalus$/u',$l)){$bc++;continue;} }
		if($age>=$n*0.6) return 'age'; if($bc>=$n*0.6) return 'body_condition'; if($act>=$n*0.6) return 'activity_level';
		if($bc>0&&$bc+$act>=$n*0.6&&$bc>=$act) return 'body_condition';
		if($act>0&&$bc+$act>=$n*0.6) return 'activity_level'; return null; }

	$ids=get_posts(array('post_type'=>'product','post_status'=>'publish','posts_per_page'=>-1,'fields'=>'ids',
		'tax_query'=>array(array('taxonomy'=>'product_cat','field'=>'slug','terms'=>array('sausas-maistas-sunims','sausas-maistas-katems')))));
	$tabs=array(); $found=0;
	foreach($ids as $id){
		if(get_post_meta($id,'_stock_status',true)!=='instock') continue;
		$c=get_post_field('post_content',$id);
		if(stripos($c,'Šėrimo instrukcij')===false) continue;
		$full=mb_substr($c, stripos($c,'Šėrimo instrukcij'));
		// jau apdorota anksciau -> praleidziam
		if(preg_match('/<table.*?<\\/table>/is',$full)) continue;
		if(preg_match('/<table.*?(?=<h[1-6]|$)/is',$full)) continue;
		// ATGAVIMAS: <tr> BE <table> apvalkalo, iki kitos antrastes
		$scope = $full;
		if(preg_match('/^(.*?)(?=<h[1-6])/is',$full,$sm)) $scope=$sm[1];
		preg_match_all('/<tr.*?<\\/tr>/is',$scope,$trs);
		$rows=$trs[0];
		if(count($rows)<2) continue;
		$found++;
		// pseudo-lentele checksum'ui
		$tbl = '<table>'.implode('',$rows).'</table>';
		$cs=md5(mb_strtolower(preg_replace('/\\s+/u','',wp_strip_all_tags($tbl))));
		if(isset($tabs[$cs])){ $tabs[$cs]['products'][]=$id; continue; }

		$hdr=ps_cells($rows[0]); $ncol=count($hdr); $h0=mb_strtolower($hdr[0]??'');
		$numh=0; for($i=1;$i<$ncol;$i++) if(preg_match('/^[\\d,\\.]+/u',$hdr[$i])) $numh++;
		if($numh>=2) $shape='transposed';
		elseif(strpos($h0,'amži')!==false && $ncol==2) $shape='by_age';
		elseif($ncol==2) $shape='simple';
		elseif($ncol>=3 && strpos($h0,'svoris')!==false) $shape='matrix';
		else $shape='unknown';

		$labels=array();
		for($i=1;$i<count($rows);$i++){ $cl=ps_cells($rows[$i]); if(count($cl)<2) continue; if($cl[0]!=='') $labels[]=$cl[0]; }

		$parsed=array(); $bad=0; $status='ambiguous'; $reason=$shape; $wb=null; $rowdim=null;
		if($shape==='simple'||$shape==='by_age'){
			$rowdim = ($shape==='simple') ? 'weight' : 'age';
			$wb = ($shape==='simple') ? 'current' : null;
			if($shape==='simple' && strpos($h0,'suaugusio')!==false) $wb='adult_expected';
			$ws=array(); $as=array();
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
		} elseif($shape==='matrix'){
			$rowdim='weight'; $wb='current';
			$dims=array_slice($hdr,1); $ws=array(); $cv=array();
			for($i=1;$i<count($rows);$i++){ $cl=ps_cells($rows[$i]); if(count($cl)<2) continue;
				$w=ps_num($cl[0]); if(!$w){$bad++;continue;} $ws[]=$w[0];
				for($j=1;$j<count($cl)&&$j<=count($dims);$j++){ $a=ps_num($cl[$j]); if(!$a){$bad++;continue;}
					$parsed[]=array('w_from'=>$w[0],'w_to'=>$w[1],'a_from'=>$a[0],'a_to'=>$a[1],'cond'=>array('activity_level'=>$dims[$j-1]));
					$cv[$j][]=$a[0]; } }
			$ok=count($parsed)>=4&&$bad===0&&ps_mono($ws);
			if($ok) foreach($cv as $x) if(!ps_mono($x)){$ok=false;$reason='matrix_col_not_monotonic';break;}
			if($ok){$status='verified';$reason='';} elseif($reason===$shape)$reason='matrix_parse_fail';
		} elseif($shape==='transposed'){
			$rowdim=ps_rowdim($labels);
			if(strpos($h0,'suaugusio')!==false) $wb='adult_expected';
			elseif($rowdim==='age') $wb='adult_expected';
			elseif($rowdim==='body_condition'||$rowdim==='activity_level') $wb='current';
			if(!$rowdim) $reason='row_dimension_unknown';
			elseif(!$wb) $reason='weight_basis_unknown';
			else { $wc=array(); for($i=1;$i<$ncol;$i++){ $n=ps_num($hdr[$i]); if($n) $wc[$i]=$n; }
				$rv=array();
				for($i=1;$i<count($rows);$i++){ $cl=ps_cells($rows[$i]); if(count($cl)<2) continue;
					$dl=$cl[0]; if($dl==='') continue;
					foreach($wc as $j=>$w){ if(!isset($cl[$j])) continue; $a=ps_num($cl[$j]); if(!$a){$bad++;continue;}
						$parsed[]=array('w_from'=>$w[0],'w_to'=>$w[1],'a_from'=>$a[0],'a_to'=>$a[1],'cond'=>array($rowdim=>$dl));
						$rv[$i][]=$a[0]; } }
				$ws=array_values(array_map(function($x){return $x[0];},$wc));
				$ok=count($parsed)>=4&&ps_mono($ws);
				if($ok) foreach($rv as $x) if(!ps_mono($x)){$ok=false;$reason='row_not_monotonic';break;}
				if($ok&&$bad>count($parsed)*0.1){$ok=false;$reason='too_many_bad_cells';}
				if($ok){$status='verified';$reason='';} }
		}
		$b=wp_get_object_terms($id,'product_brand',array('fields'=>'names'));
		$tabs[$cs]=array('source_hash'=>md5($tbl),'brand'=>(!is_wp_error($b)&&$b)?$b[0]:null,
			'species'=>has_term('sausas-maistas-katems','product_cat',$id)?'cat':'dog',
			'weight_basis'=>$wb,'row_dimension'=>$rowdim,'shape'=>$shape,'status'=>$status,
			'reason'=>$reason?:null,'rows'=>$parsed,'products'=>array($id),'source_url'=>get_permalink($id));
	}
	$o['products_recovered']=$found; $o['new_unique_tables']=count($tabs);

	// SAUGIKLIS pries irasant
	$gate_ok = true;
	foreach($tabs as $t) if($t['status']==='verified' && $t['shape']!=='by_age' && !$t['weight_basis']) { $gate_ok=false; break; }
	$o['gate_weight_basis_ok'] = $gate_ok;
	if(!$gate_ok){ $o['ABORTED']='verified be weight_basis'; header('Content-Type: application/json'); echo wp_json_encode($o); exit; }

	$now=current_time('mysql'); $it=0;$ir=0;$im=0;$dup=0;
	foreach($tabs as $cs=>$t){
		if($wpdb->get_var($wpdb->prepare("SELECT id FROM {$pf}ps_feeding_tables WHERE checksum=%s",$cs))){ $dup++; continue; }
		if(!$wpdb->insert($pf.'ps_feeding_tables',array('checksum'=>$cs,'source_hash'=>$t['source_hash'],
			'brand'=>$t['brand'],'scope'=>count($t['products'])>1?'line':'product','species'=>$t['species'],
			'weight_basis'=>$t['weight_basis'],'row_dimension'=>$t['row_dimension'],'shape'=>$t['shape'],
			'status'=>$t['status'],'reason'=>$t['reason'],'source_url'=>$t['source_url'],
			'source_version'=>'post_content_recovered_notable_2026-07-15','row_count'=>count($t['rows']),
			'parsed_at'=>$now,'verified_at'=>$t['status']==='verified'?$now:null,
			'verified_by'=>$t['status']==='verified'?'auto_parser_v5_recovered':null,
			'created_at'=>$now,'updated_at'=>$now))){ $o['errors'][]=$wpdb->last_error; continue; }
		$ftid=$wpdb->insert_id; $it++; $ord=0;
		foreach($t['rows'] as $r) if($wpdb->insert($pf.'ps_feeding_rows',array('feeding_table_id'=>$ftid,'row_order'=>$ord++,
			'weight_from_kg'=>$r['w_from'],'weight_to_kg'=>$r['w_to'],'amount_from_g'=>$r['a_from'],'amount_to_g'=>$r['a_to'],
			'condition_dimensions'=>$r['cond']?wp_json_encode($r['cond'],JSON_UNESCAPED_UNICODE):null))) $ir++;
		foreach($t['products'] as $pid) if($wpdb->insert($pf.'ps_feeding_map',array('feeding_table_id'=>$ftid,'product_id'=>$pid))) $im++;
	}
	$o['inserted']=array('tables'=>$it,'rows'=>$ir,'map'=>$im,'dup_skipped'=>$dup);
	$o['after']=array(
	 'total'=>(int)$wpdb->get_var("SELECT COUNT(*) FROM {$pf}ps_feeding_tables"),
	 'verified'=>(int)$wpdb->get_var("SELECT COUNT(*) FROM {$pf}ps_feeding_tables WHERE status='verified'"),
	 'rows'=>(int)$wpdb->get_var("SELECT COUNT(*) FROM {$pf}ps_feeding_rows"),
	 'skus_verified'=>(int)$wpdb->get_var("SELECT COUNT(DISTINCT m.product_id) FROM {$pf}ps_feeding_map m JOIN {$pf}ps_feeding_tables t ON t.id=m.feeding_table_id WHERE t.status='verified'"),
	 'orphan_rows'=>(int)$wpdb->get_var("SELECT COUNT(*) FROM {$pf}ps_feeding_rows r LEFT JOIN {$pf}ps_feeding_tables t ON t.id=r.feeding_table_id WHERE t.id IS NULL"),
	 'verified_no_basis'=>(int)$wpdb->get_var("SELECT COUNT(*) FROM {$pf}ps_feeding_tables WHERE status='verified' AND shape<>'by_age' AND weight_basis IS NULL"),
	);
	$o['brands']=$wpdb->get_results("SELECT brand,SUM(status='verified') v,SUM(status='ambiguous') a FROM {$pf}ps_feeding_tables GROUP BY brand ORDER BY v DESC LIMIT 10",ARRAY_A);
	$o['broken_html_products']=$found;
	header('Content-Type: application/json'); echo wp_json_encode($o); exit;
});`;
fs.writeFileSync('/tmp/snip.json',JSON.stringify({name:'TEMP M8 Recover',code:php,scope:'global',active:true}));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/snip.json "${API}"`);
const r=sh('curl -sk --max-time 500 "https://dev.avesa.lt/?ps_rc=Rc4Mm8Vv&confirm=RECOVER_105"');
try{out.p=JSON.parse(r);}catch(e){out.raw=r.slice(0,700);}
const k=`add_action('wp_loaded',function(){if(!isset($_GET['ps_krc'])||$_GET['ps_krc']!=='Rr3Ww8Yy'){return;}global $wpdb;$n=$wpdb->query("DELETE FROM {$wpdb->prefix}snippets WHERE name LIKE 'TEMP M8%'");echo wp_json_encode(array('d'=>$n));exit;});`;
fs.writeFileSync('/tmp/k.json',JSON.stringify({name:'TEMP M8 Kill RC',code:k,scope:'global',active:true}));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/k.json "${API}"`);
out.cleanup=sh('curl -sk --max-time 25 "https://dev.avesa.lt/?ps_krc=Rr3Ww8Yy"').slice(0,40);
}catch(e){out.FATAL=String(e.message).slice(0,300);}
ghPut('screenshots/m8_recover.json',Buffer.from(JSON.stringify(out)),'recover 105 broken tables');
console.log('DONE');
