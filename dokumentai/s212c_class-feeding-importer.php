<?php
/**
 * Petshop_Feeding_Importer — provenance promotion + būsenų matrica.
 * Kviečia Petshop_Feeding_Canonical_Hash::compute (VIENINTELĖ hash funkcija, jokios kopijos).
 *
 * source_kind (šaltinio RŪŠIS): manufacturer_page|manufacturer_pdf|supplier_feed|local_product_description|other
 * source_verification_status (BŪSENA): unverified|verified|rejected
 * (+ source_verified_at, source_verified_by)
 *
 * BŪSENŲ MATRICA (ingest):
 *  1. tas pats canonical + tas pats verified šaltinis        -> no_op
 *  2. tas pats canonical + silpnas→oficialus verified        -> promotion (naujos versijos NĖRA)
 *  3. tas pats canonical + aktyvus verified → kitas verified  -> source_changed_only (auditas)
 *  4. canonical pasikeitė                                     -> draft v2 (v1 lieka aktyvi)
 *  5. naujas šaltinis silpnesnis už esamą verified            -> no_auto_demote (blokuota)
 *  6. kelios needs_review su tuo pačiu canonical produktui    -> DATA_INTEGRITY_ERROR
 */
if ( ! class_exists( 'Petshop_Feeding_Importer' ) ) {

class Petshop_Feeding_Importer {

	const KINDS = array( 'manufacturer_page','manufacturer_pdf','supplier_feed','local_product_description','other' );
	const STATUSES = array( 'unverified','verified','rejected' );

	// Šaltinio autoritetas (stiprumas) — promotion tik silpnesnis→stipresnis.
	private static function authority_rank( $kind, $vstatus ) {
		if ( $vstatus !== 'verified' ) return 0; // nepatvirtintas = silpniausias
		$map = array( 'local_product_description'=>1, 'other'=>1, 'supplier_feed'=>2,
			'manufacturer_page'=>3, 'manufacturer_pdf'=>3 );
		return isset( $map[$kind] ) ? $map[$kind] : 1;
	}

	/**
	 * @param wpdb   $wpdb
	 * @param string $pf   prefix
	 * @param array  $in   ['product_id','meta'=>[brand,line,species,weight_basis],'rows'=>[...],
	 *                      'source_kind','source_verification_status','source_url','source_version',
	 *                      'verified_by'|null,'batch_id']
	 * @param bool   $apply
	 * @return array ['outcome','table_id'|null,'issues'=>[]]
	 */
	public static function ingest( $wpdb, $pf, array $in, $apply = false ) {
		$T=$pf.'ps_feeding_tables'; $R=$pf.'ps_feeding_rows'; $M=$pf.'ps_feeding_map'; $L=$pf.'ps_feeding_import_log';
		$issues=array();
		$pid=(int)$in['product_id'];
		$kind=$in['source_kind']; $vstatus=$in['source_verification_status'];
		if(!in_array($kind,self::KINDS,true)) return self::err('INVALID_SOURCE_KIND',$issues);
		if(!in_array($vstatus,self::STATUSES,true)) return self::err('INVALID_VERIFICATION_STATUS',$issues);

		$incoming_hash=Petshop_Feeding_Canonical_Hash::compute($in['meta'],$in['rows']);
		$incoming_rank=self::authority_rank($kind,$vstatus);

		// esamos ŠIO produkto lentelės (per mappingą, bet kokia būsena)
		$cands=$wpdb->get_results($wpdb->prepare(
			"SELECT t.* FROM {$T} t JOIN {$M} m ON m.feeding_table_id=t.id
			 WHERE m.product_id=%d AND t.canonical_hash_version='chash_v1'
			 ORDER BY t.id",$pid), ARRAY_A);

		// 6. DATA INTEGRITY: kelios needs_review su TUO PAČIU canonical
		$same_canon=array_values(array_filter($cands,function($c) use($incoming_hash){ return $c['canonical_table_hash']===$incoming_hash; }));
		$nr_same=array_values(array_filter($same_canon,function($c){ return $c['status']==='needs_review'; }));
		if(count($nr_same)>1) return self::err('DATA_INTEGRITY_ERROR',$issues,array('needs_review_su_tuo_paciu_canonical'=>count($nr_same)));

		// aktyvi verified su tuo pačiu canonical?
		$active_verified=array_values(array_filter($same_canon,function($c){ return $c['status']==='verified' && (int)$c['is_active']===1; }));

		if(!empty($active_verified)){
			$av=$active_verified[0];
			$cur_rank=self::authority_rank($av['source_kind']??'local_product_description',
				($av['status']==='verified'?'verified':'unverified'));
			// 1. tas pats šaltinis -> no_op
			if(($av['source_kind']??null)===$kind && ($av['source_verification_status']??null)===$vstatus
			   && ($av['source_url']??null)===$in['source_url']){
				return self::ok('no_op',$av['id'],$issues);
			}
			// 3. kitas verified šaltinis, ta pati semantika -> source_changed_only
			if($vstatus==='verified'){
				if($apply){
					self::log($wpdb,$L,$in['batch_id']??'',$pid,$av['id'],'source_changed_only',
						$av,$kind,$vstatus,$in);
					$wpdb->update($T,array('source_kind'=>$kind,'source_verification_status'=>$vstatus,
						'source_url'=>$in['source_url'],'source_version'=>$in['source_version'],
						'source_verified_at'=>current_time('mysql'),'source_verified_by'=>$in['verified_by']??'importer',
						'updated_at'=>current_time('mysql')),array('id'=>$av['id']));
				}
				return self::ok('source_changed_only',$av['id'],$issues);
			}
			// 5. silpnesnis nei aktyvus verified -> negalima demotuoti
			if($incoming_rank < $cur_rank) return self::err('no_auto_demote',$issues,array('incoming_rank'=>$incoming_rank,'current_rank'=>$cur_rank));
			return self::ok('no_op',$av['id'],$issues);
		}

		// nėra aktyvios verified su tuo canonical. Ar yra needs_review su tuo canonical? -> 2. PROMOTION
		if(count($nr_same)===1){
			$cand=$nr_same[0];
			$cand_rank=self::authority_rank($cand['source_kind']??'local_product_description',
				$cand['source_verification_status']??'unverified');
			// promotion tik jei įeinantis STIPRESNIS ir verified
			if($vstatus==='verified' && $incoming_rank>$cand_rank){
				if($apply){
					$wpdb->query('START TRANSACTION');
					// užrakinam kandidatą + mappingą
					$locked=$wpdb->get_row($wpdb->prepare("SELECT id FROM {$T} WHERE id=%d FOR UPDATE",$cand['id']), ARRAY_A);
					// dar kartą tikrinam vienintelį (lenktynių apsauga)
					$recount=(int)$wpdb->get_var($wpdb->prepare(
						"SELECT COUNT(*) FROM {$T} t JOIN {$M} m ON m.feeding_table_id=t.id
						 WHERE m.product_id=%d AND t.canonical_table_hash=%s AND t.status='needs_review'",$pid,$incoming_hash));
					if(!$locked || $recount!==1){ $wpdb->query('ROLLBACK'); return self::err('DATA_INTEGRITY_ERROR',$issues,array('recount'=>$recount)); }
					self::log($wpdb,$L,$in['batch_id']??'',$pid,$cand['id'],'promotion',$cand,$kind,$vstatus,$in);
					$wpdb->update($T,array('source_kind'=>$kind,'source_verification_status'=>$vstatus,
						'source_url'=>$in['source_url'],'source_version'=>$in['source_version'],
						'source_verified_at'=>current_time('mysql'),'source_verified_by'=>$in['verified_by']??'importer',
						'status'=>'verified','is_active'=>1,'activated_at'=>current_time('mysql'),
						'updated_at'=>current_time('mysql')),array('id'=>$cand['id']));
					$wpdb->update($M,array('is_active'=>1),array('feeding_table_id'=>$cand['id'],'product_id'=>$pid));
					$wpdb->query('COMMIT');
				}
				return self::ok('promotion',$cand['id'],$issues);
			}
			// įeinantis nestipresnis -> lieka needs_review
			return self::ok('kept_needs_review',$cand['id'],$issues);
		}

		// 4. canonical pasikeitė ARBA visai naujas -> draft v2 (v1 lieka). (kūrimo kelias — atskiras, čia tik signalas)
		return self::ok('canonical_changed_new_version',null,$issues,array('note'=>'draft v2 kūrimas — atskiras insert kelias'));
	}

	private static function log($wpdb,$L,$batch,$pid,$tid,$action,$old,$kind,$vstatus,$in){
		// batch žurnale sena IR nauja provenance
		if($wpdb->get_var("SHOW TABLES LIKE '{$L}'")!==$L) return;
		$cols=$wpdb->get_col("SHOW COLUMNS FROM {$L}");
		$row=array('product_id'=>$pid,'feeding_table_id'=>$tid,'action'=>$action,'created_at'=>current_time('mysql'));
		if(in_array('batch_id',$cols)) $row['batch_id']=$batch;
		if(in_array('old_provenance',$cols)) $row['old_provenance']=wp_json_encode(array('kind'=>$old['source_kind']??null,'status'=>$old['source_verification_status']??null,'url'=>$old['source_url']??null));
		if(in_array('new_provenance',$cols)) $row['new_provenance']=wp_json_encode(array('kind'=>$kind,'status'=>$vstatus,'url'=>$in['source_url']));
		$wpdb->insert($L,$row);
	}
	private static function ok($outcome,$tid,$issues,$extra=array()){ return array_merge(array('outcome'=>$outcome,'table_id'=>$tid,'issues'=>$issues),$extra); }
	private static function err($code,$issues,$extra=array()){ $issues[]=$code; return array_merge(array('outcome'=>'error','error'=>$code,'table_id'=>null,'issues'=>$issues),$extra); }
}

}
