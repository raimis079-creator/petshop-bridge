import { execSync } from 'child_process';
import fs from 'fs';
const TOKG = process.env.GH_TOKEN;
function ghPut(p,buf,m){const u=`https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/${p}`;let s='';try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:m,content:buf.toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}"`,{maxBuffer:20*1024*1024});}
function sh(c){try{return execSync(c,{maxBuffer:40*1024*1024}).toString();}catch(e){return 'ERR';}}
const AUTH=Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').replace(/\s+/g,'')).toString('base64');
const API='https://dev.avesa.lt/wp-json/code-snippets/v1/snippets';
const out={};
const php=`
add_action('wp_loaded', function(){
	if(!isset($_GET['ps_f4'])||$_GET['ps_f4']!=='F4Tt8Gg'){return;}
	if(!isset($_GET['confirm'])||$_GET['confirm']!=='FIX_V4'){echo 'NO CONFIRM';exit;}
	@set_time_limit(600); global $wpdb; $p=$wpdb->prefix; $o=array('errors'=>array());

	function ps_num($s){ $s=str_replace(',','.',$s);
		if(preg_match('/([\\d\\.]+)\\s*[-–—]\\s*([\\d\\.]+)/u',$s,$m)) return array((float)$m[1],(float)$m[2]);
		if(preg_match('/([\\d\\.]+)/u',$s,$m)) return array((float)$m[1],(float)$m[1]); return null; }
	function ps_cells($r){ preg_match_all('/<t[dh][^>]*>(.*?)<\\/t[dh]>/is',$r,$m);
		return array_map(function($x){ return trim(preg_replace('/\\s+/u',' ',html_entity_decode(wp_strip_all_tags($x)))); },$m[1]); }
	function ps_mono($a){ $pv=-INF; foreach($a as $v){ if($v<$pv) return false; $pv=$v; } return true; }

	// v4: + anglu "Months", + activity_level (Bute/Kieme/Aktyvus)
	function ps_rowdim($labels){
		$n=count($labels); if(!$n) return null;
		$age=0;$bc=0;$act=0;
		foreach($labels as $l){
			$l=mb_strtolower($l);
			if(preg_match('/mėn|men\\.|sav\\b|savai|metai|months?\\s*\\d|weeks?\\s*\\d/u',$l)) { $age++; continue; }
			if(preg_match('/lies|antsvor|nutuk|kūno|kuno/u',$l))                              { $bc++;  continue; }
			if(preg_match('/bute|kieme|aktyv|senyv/u',$l))                                    { $act++; continue; }
			if(preg_match('/^normali$|^normalus$/u',$l))                                      { $bc++;  continue; }
		}
		if($age >= $n*0.6) return 'age';
		if($bc  >= $n*0.6) return 'body_condition';
		if($act >= $n*0.6) return 'activity_level';
		// misrus: Liesa/Normali/Antsvoris -> bc laimi jei yra bent vienas stiprus
		if($bc>0 && $bc+$act >= $n*0.6 && $bc>=$act) return 'body_condition';
		if($act>0 && $bc+$act >= $n*0.6) return 'activity_level';
		return null;
	}

	// ===== TRINAM transposed =====
	$tids=$wpdb->get_col("SELECT id FROM {$p}ps_feeding_tables WHERE shape='transposed'");
	if($tids){ $in=implode(',',array_map('intval',$tids));
		$wpdb->query("DELETE FROM {$p}ps_feeding_rows WHERE feeding_table_id IN ($in)");
		$wpdb->query("DELETE FROM {$p}ps_feeding_map  WHERE feeding_table_id IN ($in)");
		$wpdb->query("DELETE FROM {$p}ps_feeding_tables WHERE id IN ($in)"); }
	$o['deleted']=count($tids);

	$ids=get_posts(array('post_type'=>'product','post_status'=>'publish','posts_per_page'=>-1,'fields'=>'ids',
		'tax_query'=>array(array('taxonomy'=>'product_cat','field'=>'slug','terms'=>array('sausas-maistas-sunims','sausas-maistas-katems')))));
	$tabs=array();
	foreach($ids as $id){
		if(get_post_meta($id,'_stock_status',true)!=='instock') continue;
		$c=get_post_field('post_content',$id);
		if(stripos($c,'Šėrimo instrukcij')===false) continue;
		$full=mb_substr($c,stripos($c,'Šėrimo instrukcij'));
		$tbl=null;
		if(preg_match('/<table.*?<\\/table>/is',$full,$m)) $tbl=$m[0];
		elseif(preg_match('/<table.*?(?=<h[1-6]|$)/is',$full,$m)) $tbl=$m[0];
		if(!$tbl) continue;
		preg_match_all('/<tr.*?(?:<\\/tr>|$)/is',$tbl,$trs); $rows=$trs[0];
		if(count($rows)<2) continue;
		$hdr=ps_cells($rows[0]); $ncol=count($hdr); $h0=mb_strtolower($hdr[0]??'');
		$numh=0; for($i=1;$i<$ncol;$i++) if(preg_match('/^[\\d,\\.]+/u',$hdr[$i])) $numh++;
		if($numh<2) continue;
		$cs=md5(mb_strtolower(preg_replace('/\\s+/u','',wp_strip_all_tags($tbl))));
		if(isset($tabs[$cs])){ $tabs[$cs]['products'][]=$id; continue; }

		$labels=array();
		for($i=1;$i<count($rows);$i++){ $cl=ps_cells($rows[$i]); if(count($cl)<2) continue; if($cl[0]!=='') $labels[]=$cl[0]; }
		$rowdim=ps_rowdim($labels);

		$wb=null;
		if(strpos($h0,'suaugusio')!==false)  $wb='adult_expected';
		elseif($rowdim==='age')             $wb='adult_expected';
		elseif($rowdim==='body_condition')  $wb='current';
		elseif($rowdim==='activity_level')  $wb='current';

		$status='ambiguous'; $reason=''; $parsed=array(); $bad=0;
		if(!$rowdim)   $reason='row_dimension_unknown';
		elseif(!$wb)   $reason='weight_basis_unknown';
		else {
			$wc=array(); for($i=1;$i<$ncol;$i++){ $n=ps_num($hdr[$i]); if($n) $wc[$i]=$n; }
			$rv=array();
			for($i=1;$i<count($rows);$i++){
				$cl=ps_cells($rows[$i]); if(count($cl)<2) continue;
				$dl=$cl[0]; if($dl==='') continue;
				foreach($wc as $j=>$w){ if(!isset($cl[$j])) continue;
					$a=ps_num($cl[$j]); if(!$a){$bad++;continue;}
					$parsed[]=array('w_from'=>$w[0],'w_to'=>$w[1],'a_from'=>$a[0],'a_to'=>$a[1],'cond'=>array($rowdim=>$dl));
					$rv[$i][]=$a[0]; } }
			$ws=array_values(array_map(function($x){return $x[0];},$wc));
			$ok=count($parsed)>=4 && ps_mono($ws);
			if($ok) foreach($rv as $x) if(!ps_mono($x)){ $ok=false; $reason='row_not_monotonic'; break; }
			if($ok && $bad>count($parsed)*0.1){ $ok=false; $reason='too_many_bad_cells'; }
			if($ok){ $status='verified'; $reason=''; }
		}
		$b=wp_get_object_terms($id,'product_brand',array('fields'=>'names'));
		$tabs[$cs]=array('source_hash'=>md5($tbl),'brand'=>(!is_wp_error($b)&&$b)?$b[0]:null,
			'species'=>has_term('sausas-maistas-katems','product_cat',$id)?'cat':'dog',
			'weight_basis'=>$wb,'row_dimension'=>$rowdim,'status'=>$status,'reason'=>$reason?:null,
			'rows'=>$parsed,'products'=>array($id),'source_url'=>get_permalink($id));
	}
	$now=current_time('mysql'); $it=0;$ir=0;$im=0;
	foreach($tabs as $cs=>$t){
		if(!$wpdb->insert($p.'ps_feeding_tables',array('checksum'=>$cs,'source_hash'=>$t['source_hash'],
			'brand'=>$t['brand'],'scope'=>count($t['products'])>1?'line':'product','species'=>$t['species'],
			'weight_basis'=>$t['weight_basis'],'row_dimension'=>$t['row_dimension'],'shape'=>'transposed',
			'status'=>$t['status'],'reason'=>$t['reason'],'source_url'=>$t['source_url'],
			'source_version'=>'post_content_2026-07-15','row_count'=>count($t['rows']),'parsed_at'=>$now,
			'verified_at'=>$t['status']==='verified'?$now:null,'verified_by'=>$t['status']==='verified'?'auto_parser_v4':null,
			'created_at'=>$now,'updated_at'=>$now))){ $o['errors'][]=$wpdb->last_error; continue; }
		$ftid=$wpdb->insert_id; $it++; $ord=0;
		foreach($t['rows'] as $r) if($wpdb->insert($p.'ps_feeding_rows',array('feeding_table_id'=>$ftid,'row_order'=>$ord++,
			'weight_from_kg'=>$r['w_from'],'weight_to_kg'=>$r['w_to'],'amount_from_g'=>$r['a_from'],'amount_to_g'=>$r['a_to'],
			'condition_dimensions'=>wp_json_encode($r['cond'],JSON_UNESCAPED_UNICODE)))) $ir++;
		foreach($t['products'] as $pid) if($wpdb->insert($p.'ps_feeding_map',array('feeding_table_id'=>$ftid,'product_id'=>$pid))) $im++;
	}
	$o['inserted']=array('tables'=>$it,'rows'=>$ir,'map'=>$im);

	// matrix cond raktas 'dim' -> 'activity_level'
	$mids=$wpdb->get_col("SELECT id FROM {$p}ps_feeding_tables WHERE shape='matrix'");
	$fixed=0;
	if($mids){ foreach($mids as $mid){
		$rs=$wpdb->get_results($wpdb->prepare("SELECT id,condition_dimensions FROM {$p}ps_feeding_rows WHERE feeding_table_id=%d",$mid),ARRAY_A);
		foreach($rs as $rr){ $j=json_decode($rr['condition_dimensions'],true);
			if(is_array($j) && isset($j['dim'])){ $nj=array('activity_level'=>$j['dim']);
				$wpdb->update($p.'ps_feeding_rows',array('condition_dimensions'=>wp_json_encode($nj,JSON_UNESCAPED_UNICODE)),array('id'=>$rr['id'])); $fixed++; } } } }
	$wpdb->query("UPDATE {$p}ps_feeding_tables SET row_dimension='weight' WHERE shape='matrix'");
	$o['matrix_cond_fixed']=$fixed;

	// ===== PATIKRA (TAISYKLINGA: tikrinam RAKTA, ne reiksme) =====
	$o['after']=array(
	 'total'=>(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}ps_feeding_tables"),
	 'verified'=>(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}ps_feeding_tables WHERE status='verified'"),
	 'rows'=>(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}ps_feeding_rows"),
	 'skus_verified'=>(int)$wpdb->get_var("SELECT COUNT(DISTINCT m.product_id) FROM {$p}ps_feeding_map m JOIN {$p}ps_feeding_tables t ON t.id=m.feeding_table_id WHERE t.status='verified'"),
	 'orphan_rows'=>(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}ps_feeding_rows r LEFT JOIN {$p}ps_feeding_tables t ON t.id=r.feeding_table_id WHERE t.id IS NULL"),
	 'orphan_map'=>(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}ps_feeding_map m LEFT JOIN {$p}ps_feeding_tables t ON t.id=m.feeding_table_id WHERE t.id IS NULL"),
	 'verified_no_basis'=>(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}ps_feeding_tables WHERE status='verified' AND shape<>'by_age' AND weight_basis IS NULL"),
	);
	// RAKTU sarasas (ne reiksmiu!)
	$keys=array();
	$all=$wpdb->get_col("SELECT DISTINCT condition_dimensions FROM {$p}ps_feeding_rows WHERE condition_dimensions IS NOT NULL");
	foreach($all as $j){ $d=json_decode($j,true); if(is_array($d)) foreach(array_keys($d) as $kk){ if(!isset($keys[$kk])) $keys[$kk]=0; $keys[$kk]++; } }
	$o['cond_KEYS']=$keys;
	$o['dist']=$wpdb->get_results("SELECT shape,weight_basis,row_dimension,status,COUNT(*) n FROM {$p}ps_feeding_tables GROUP BY shape,weight_basis,row_dimension,status ORDER BY shape,status",ARRAY_A);
	$o['reasons']=$wpdb->get_results("SELECT reason,COUNT(*) n FROM {$p}ps_feeding_tables WHERE status='ambiguous' GROUP BY reason ORDER BY n DESC",ARRAY_A);
	$o['brands']=$wpdb->get_results("SELECT brand,SUM(status='verified') v,SUM(status='ambiguous') a,
		(SELECT COUNT(DISTINCT m.product_id) FROM {$p}ps_feeding_map m JOIN {$p}ps_feeding_tables t2 ON t2.id=m.feeding_table_id WHERE t2.brand=t.brand AND t2.status='verified') sku
		FROM {$p}ps_feeding_tables t GROUP BY brand ORDER BY v DESC LIMIT 8",ARRAY_A);
	header('Content-Type: application/json'); echo wp_json_encode($o); exit;
});`;
fs.writeFileSync('/tmp/snip.json',JSON.stringify({name:'TEMP M8 Fix4',code:php,scope:'global',active:true}));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/snip.json "${API}"`);
const r=sh('curl -sk --max-time 500 "https://dev.avesa.lt/?ps_f4=F4Tt8Gg&confirm=FIX_V4"');
try{out.p=JSON.parse(r);}catch(e){out.raw=r.slice(0,800);}
const k=`add_action('wp_loaded',function(){if(!isset($_GET['ps_kf4'])||$_GET['ps_kf4']!=='Rr3Ww8Yy'){return;}global $wpdb;$n=$wpdb->query("DELETE FROM {$wpdb->prefix}snippets WHERE name LIKE 'TEMP M8%'");echo wp_json_encode(array('d'=>$n));exit;});`;
fs.writeFileSync('/tmp/k.json',JSON.stringify({name:'TEMP M8 Kill F4',code:k,scope:'global',active:true}));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/k.json "${API}"`);
out.cleanup=sh('curl -sk --max-time 25 "https://dev.avesa.lt/?ps_kf4=Rr3Ww8Yy"').slice(0,40);
ghPut('screenshots/m8_fix4.json',Buffer.from(JSON.stringify(out)),'fix v4');
console.log('DONE');
