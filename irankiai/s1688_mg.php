<?php
/** TEMP PS S1688 mg — DEPLOY petshop-lifecycle-vartai.php v1.2.1 → v1.2.2: aiškiai paprašytas priminimas (ps_refill_tracking.feedback_cycle='relaunch') NEPATENKA į 10 % holdout. md5 sargas 6516bec9…, bak uploads/ps-backups/petshop-lifecycle-vartai.php.bak_s1688, token_get_all, heartbeat/rollback. f=tikrinti — atskira užklausa. */
add_action('init', function(){
  if (!isset($_GET['ps_s1688mg'])) return; $o=array('v'=>'S1688 mg'); $f=$_GET['ps_s1688mg'];
  $fp=WPMU_PLUGIN_DIR.'/petshop-lifecycle-vartai.php'; $bak=wp_upload_dir()['basedir'].'/ps-backups'; wp_mkdir_p($bak);
  if($f==='deploy'){
    $o['md5_pries']=md5_file($fp); $s=file_get_contents($fp);
    $a="		if ( self::holdout( \$email ) ) return array( 'allowed' => false, 'reason' => 'holdout_10', 'terminal' => true );";
    $b="		if ( self::holdout( \$email ) && ! self::prasyta( \$email, \$context ) ) return array( 'allowed' => false, 'reason' => 'holdout_10', 'terminal' => true );";
    $c="	public static function holdout( \$email ) {";
    $d="	/** S1688: klientas pats paprašė priminimo prekės puslapyje (feedback_cycle='relaunch') — holdout netaikomas. */
	public static function prasyta( \$email, \$context ) {
		global \$wpdb; \$uid = isset( \$context['user_id'] ) ? (int) \$context['user_id'] : 0; \$pid = isset( \$context['product_id'] ) ? (int) \$context['product_id'] : 0;
		if ( ! \$uid ) { \$u = get_user_by( 'email', \$email ); \$uid = \$u ? (int) \$u->ID : 0; }
		if ( ! \$uid || ! \$pid ) return false;
		return 'relaunch' === (string) \$wpdb->get_var( \$wpdb->prepare( \"SELECT feedback_cycle FROM {\$wpdb->prefix}ps_refill_tracking WHERE user_id=%d AND product_id=%d\", \$uid, \$pid ) );
	}

	public static function holdout( \$email ) {";
    $o['a_n']=substr_count($s,$a); $o['c_n']=substr_count($s,$c);
    if(substr($o['md5_pries'],0,8)!=='6516bec9'||$o['a_n']!==1||$o['c_n']!==1){ $o['stop']='sargas'; }
    else { $n=str_replace($a,$b,$s); $n=str_replace($c,$d,$n); $n=str_replace('Version: 1.2.1','Version: 1.2.2',$n);
      try { token_get_all($n,TOKEN_PARSE); } catch(Throwable $e){ $o['stop']='token: '.$e->getMessage(); }
      if(empty($o['stop'])){ copy($fp,$bak.'/petshop-lifecycle-vartai.php.bak_s1688'); file_put_contents($fp,$n); $o['md5_po']=md5_file($fp);
        $r=wp_remote_get(home_url('/?ps_hb='.time()),array('timeout'=>25,'sslverify'=>false)); $hb=is_wp_error($r)?0:wp_remote_retrieve_response_code($r); $o['hb']=$hb;
        if($hb>=500||$hb===0){ copy($bak.'/petshop-lifecycle-vartai.php.bak_s1688',$fp); $o['rollback']=md5_file($fp); } } }
  } else {
    $o['md5']=md5_file($fp); $o['ver']=get_file_data($fp,array('v'=>'Version'))['v']; $o['prasyta_met']=method_exists('Petshop_Lifecycle_Vartai','prasyta');
    $o['prasyta_terra']=Petshop_Lifecycle_Vartai::prasyta('terra@gyvunai.lt',array('user_id'=>44,'product_id'=>12466));
    $o['prasyta_kita']=Petshop_Lifecycle_Vartai::prasyta('terra@gyvunai.lt',array('user_id'=>44,'product_id'=>18084));
    $o['holdout_terra']=Petshop_Lifecycle_Vartai::holdout('terra@gyvunai.lt');
    $o['elig_terra']=Petshop_Lifecycle_Vartai::eligibility(array('allowed'=>true),'refill_due','similar_soft_optin','terra@gyvunai.lt',array('user_id'=>44,'product_id'=>12466));
  }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT); exit;
});
