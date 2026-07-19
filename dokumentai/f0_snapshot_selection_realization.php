add_action('wp_loaded', function(){
	if(!isset($_GET['ps_f0s'])||$_GET['ps_f0s']!=='F0sKw8Nx'){return;}
	@set_time_limit(600); @ini_set('memory_limit','1024M');
	global $wpdb; $pf=$wpdb->prefix; $o=array('readonly'=>true,'generated_at'=>current_time('mysql'));
	$T=$pf.'ps_feeding_tables'; $R=$pf.'ps_feeding_rows'; $M=$pf.'ps_feeding_map';

	// === KATEGORIJŲ APIMTIS: 72(dog) + descendants, 81(cat) + descendants ===
	$dog=array(72); $c1=get_term_children(72,'product_cat'); if(!is_wp_error($c1)) $dog=array_merge($dog,array_map('intval',$c1));
	$cat=array(81); $c2=get_term_children(81,'product_cat'); if(!is_wp_error($c2)) $cat=array_merge($cat,array_map('intval',$c2));
	$dog=array_values(array_unique($dog)); sort($dog);
	$cat=array_values(array_unique($cat)); sort($cat);
	$all=array_values(array_unique(array_merge($dog,$cat))); sort($all);
	$dog_set=array_flip($dog); $cat_set=array_flip($cat);
	$in=implode(',',$all);

	// === PARENT PRODUKTAI (vardiklis, vieną kartą) ===
	$pids=$wpdb->get_col("SELECT DISTINCT p.ID FROM {$pf}posts p
		JOIN {$pf}term_relationships tr ON tr.object_id=p.ID
		JOIN {$pf}term_taxonomy tt ON tt.term_taxonomy_id=tr.term_taxonomy_id
		WHERE tt.taxonomy='product_cat' AND tt.term_id IN ($in)
		AND p.post_type='product' AND p.post_status='publish' ORDER BY p.ID");
	$pids=array_map('intval',$pids);

	// === BATCH: visi mappingai šiems produktams (be GROUP_CONCAT) ===
	$map_rows=$wpdb->get_results("SELECT feeding_table_id,product_id,is_active FROM {$M}
		WHERE product_id IN (".implode(',',$pids).")", ARRAY_A);
	$maps_by_pid=array();
	foreach($map_rows as $mr){ $maps_by_pid[(int)$mr['product_id']][]=array('tid'=>(int)$mr['feeding_table_id'],'active'=>(int)$mr['is_active']); }

	// === BATCH: lentelių būsenos (verified+active+hash) ===
	$tab_rows=$wpdb->get_results("SELECT id,status,is_active,
		CASE WHEN canonical_table_hash IS NULL THEN 0 ELSE 1 END AS has_hash FROM {$T}", ARRAY_A);
	$tab=array();
	foreach($tab_rows as $tr){ $tab[(int)$tr['id']]=array('status'=>$tr['status'],'active'=>(int)$tr['is_active'],'has_hash'=>(int)$tr['has_hash']); }

	// === SNAPSHOT eilutės ===
	$csv=array();
	$csv[]='product_id,sku,sku_missing,product_type,species_scope,matched_category_ids,stock_status,package_term,feeding_table_ids,active_verified_table_ids,active_verified_table_count,feeding_mapping_count,runtime_integrity_status';
	$cnt=array('dog'=>0,'cat'=>0,'ambiguous'=>0,'unsupported'=>0);
	$rt=array('OK'=>0,'NO_ACTIVE_VERIFIED'=>0,'DATA_INTEGRITY_ERROR'=>0);
	$stock=array('instock'=>0,'outofstock'=>0,'onbackorder'=>0,'unknown'=>0);
	$sku_missing_n=0;
	foreach($pids as $pid){
		$sku=(string)get_post_meta($pid,'_sku',true);
		$sku_missing=($sku==='')?1:0; if($sku_missing)$sku_missing_n++;
		$product=wc_get_product($pid);
		$ptype=$product?$product->get_type():'unknown';
		$ss=$product?$product->get_stock_status():'unknown';
		if(!isset($stock[$ss]))$stock[$ss]=0; $stock[$ss]++;

		// matched kategorijos (mūsų apimties) + species_scope
		$pcats=wp_get_object_terms($pid,'product_cat',array('fields'=>'ids'));
		$pcats=is_wp_error($pcats)?array():array_map('intval',$pcats);
		$matched=array(); $in_dog=false; $in_cat=false;
		foreach($pcats as $ci){ if(isset($dog_set[$ci])||isset($cat_set[$ci])){ $matched[]=$ci; } if(isset($dog_set[$ci]))$in_dog=true; if(isset($cat_set[$ci]))$in_cat=true; }
		sort($matched);
		if($in_dog&&$in_cat){ $species='AMBIGUOUS_SPECIES_SCOPE'; $cnt['ambiguous']++; }
		elseif($in_dog){ $species='dog'; $cnt['dog']++; }
		elseif($in_cat){ $species='cat'; $cnt['cat']++; }
		else { $species='UNSUPPORTED_SPECIES_SCOPE'; $cnt['unsupported']++; }

		// pakuotės terminas
		$pk=wp_get_object_terms($pid,'pa_pakuotes_dydis',array('fields'=>'names'));
		$package_term=(!is_wp_error($pk)&&!empty($pk))?$pk[0]:'';

		// feeding tables (deterministiškai)
		$ml=isset($maps_by_pid[$pid])?$maps_by_pid[$pid]:array();
		$feeding_mapping_count=count($ml);
		$ftids=array(); $avtids=array();
		foreach($ml as $m){
			$ftids[]=$m['tid'];
			$ti=isset($tab[$m['tid']])?$tab[$m['tid']]:null;
			if($m['active']===1 && $ti && $ti['status']==='verified' && $ti['active']===1 && $ti['has_hash']===1){
				$avtids[]=$m['tid'];
			}
		}
		$ftids=array_values(array_unique($ftids)); sort($ftids);
		$avtids=array_values(array_unique($avtids)); sort($avtids);
		$avc=count($avtids);
		if($avc>1){ $ris='DATA_INTEGRITY_ERROR'; }
		elseif($avc===1){ $ris='OK'; }
		else { $ris='NO_ACTIVE_VERIFIED'; }
		$rt[$ris]++;

		$q=function($v){ $v=(string)$v; return (strpos($v,',')!==false||strpos($v,'"')!==false)?'"'.str_replace('"','""',$v).'"':$v; };
		$csv[]=implode(',',array(
			$pid, $q($sku), $sku_missing, $q($ptype), $species,
			$q(implode('|',$matched)), $ss, $q($package_term),
			$q(implode('|',$ftids)), $q(implode('|',$avtids)), $avc, $feeding_mapping_count, $ris
		));
	}
	$csv_text=implode("\n",$csv)."\n";

	// === VARIACIJOS sidecar (atskirai, vardiklio nedidina) ===
	$var_rows=$wpdb->get_results("SELECT v.ID,v.post_parent FROM {$pf}posts v
		WHERE v.post_type='product_variation' AND v.post_parent IN (".implode(',',$pids).") ORDER BY v.ID", ARRAY_A);
	$var_csv=array('variation_id,parent_product_id,sku');
	foreach($var_rows as $vr){ $var_csv[]=$vr['ID'].','.$vr['post_parent'].','.(string)get_post_meta($vr['ID'],'_sku',true); }
	$var_text=implode("\n",$var_csv)."\n";

	// === PILNI BASELINE HASH (PHP-side, be GROUP_CONCAT) ===
	$trows=$wpdb->get_results("SELECT id,canonical_table_hash,status,is_active FROM {$T} ORDER BY id", ARRAY_A);
	$tparts=array(); foreach($trows as $r){ $tparts[]=$r['id'].':'.($r['canonical_table_hash']===null?'NULL':$r['canonical_table_hash']).':'.$r['status'].':'.$r['is_active']; }
	$tables_hash=hash('sha256',implode('|',$tparts));
	$mrows=$wpdb->get_results("SELECT feeding_table_id,product_id,is_active FROM {$M} ORDER BY feeding_table_id,product_id", ARRAY_A);
	$mparts=array(); foreach($mrows as $r){ $mparts[]=$r['feeding_table_id'].':'.$r['product_id'].':'.$r['is_active']; }
	$map_hash=hash('sha256',implode('|',$mparts));
	$rrows=$wpdb->get_results("SELECT id,feeding_table_id,cell_type,weight_from_kg,weight_to_kg,amount_from_g,amount_to_g FROM {$R} ORDER BY id", ARRAY_A);
	$rparts=array(); foreach($rrows as $r){ $rparts[]=$r['id'].':'.$r['feeding_table_id'].':'.$r['cell_type'].':'.$r['weight_from_kg'].':'.$r['weight_to_kg'].':'.$r['amount_from_g'].':'.$r['amount_to_g']; }
	$rows_hash=hash('sha256',implode('|',$rparts));

	$o['scope']=array('dog_tree'=>$dog,'cat_tree'=>$cat,'all_categories'=>$all);
	$o['denominator']=count($pids);
	$o['species_breakdown']=$cnt;
	$o['runtime_integrity_breakdown']=$rt;
	$o['stock_breakdown']=$stock;
	$o['sku_missing_count']=$sku_missing_n;
	$o['variations_count']=count($var_rows);
	$o['baseline_full']=array(
		'tables_count'=>count($trows),'rows_count'=>count($rrows),'map_count'=>count($mrows),
		'tables_hash'=>$tables_hash,'rows_hash'=>$rows_hash,'map_hash'=>$map_hash,
	);
	$o['snapshot_sha256']=hash('sha256',$csv_text);
	$o['variations_sha256']=hash('sha256',$var_text);
	$o['snapshot_csv_b64']=base64_encode($csv_text);
	$o['variations_csv_b64']=base64_encode($var_text);
	header('Content-Type: application/json'); echo wp_json_encode($o); exit;
});
