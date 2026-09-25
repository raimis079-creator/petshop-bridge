<?php
/** Plugin Name: TEMP PS S1719i — AVPN/IAPV atominis numeravimas: 1 sausas, 2 deploy functions.php, 3 pernumeravimas, 9 atstatymas */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1719i'])) return; $f=$_GET['ps_s1719i']; $r=['v'=>'S1719i','faze'=>$f,'t'=>date('Y-m-d H:i:s')]; @set_time_limit(120);
  global $wpdb; $p=$wpdb->prefix;
  $fp=WP_CONTENT_DIR.'/themes/flatsome-child/functions.php'; $bak='/home/gyvunai2/domains/petshop.lt/ps-archyvas/functions.php.bak_s1719';
  $heart=function(){ $rs=wp_remote_get('https://petshop.lt/?ps_hb='.time(),['timeout'=>20,'sslverify'=>false]); return is_wp_error($rs)?'ERR '.$rs->get_error_message():wp_remote_retrieve_response_code($rs); };
  $NEW = <<<'PHP'
/**
 * S1719 (2026-09-25): atominis numerių skaitiklis. Iki tol get_option → update_option dviem žingsniais —
 * lygiagrečios užklausos (darbalaukio „Kurjeris paėmė" keliems užsakymams) perskaitydavo tą patį skaitiklį
 * ir 5 sąskaitos gavo AVPN011105. Dabar: DB užraktas + UPDATE … LAST_INSERT_ID + meta patikra tiesiai iš DB.
 */
function petshop_ps_kitas_numeris( $opcija, $prefiksas, $order_id, $meta_key ) {
    global $wpdb;
    $order    = $order_id ? wc_get_order( $order_id ) : null;
    $existing = $order ? (string) $order->get_meta( $meta_key ) : '';
    if ( $existing ) return $existing;
    $lock = 'ps_num_' . $opcija;
    $got  = (int) $wpdb->get_var( $wpdb->prepare( 'SELECT GET_LOCK(%s, 10)', $lock ) );
    try {
        if ( $order ) {
            $db = $wpdb->get_var( $wpdb->prepare( "SELECT meta_value FROM {$wpdb->prefix}wc_orders_meta WHERE order_id=%d AND meta_key=%s AND meta_value<>'' ORDER BY id ASC LIMIT 1", $order_id, $meta_key ) );
            if ( $db ) return (string) $db;
        }
        $aff = $wpdb->query( $wpdb->prepare( "UPDATE {$wpdb->options} SET option_value = LAST_INSERT_ID(option_value + 1) WHERE option_name = %s", $opcija ) );
        if ( $aff === 1 ) {
            $naujas = (int) $wpdb->get_var( 'SELECT LAST_INSERT_ID()' );
        } else {
            $naujas = (int) get_option( $opcija, 101 ) + 1;
            update_option( $opcija, $naujas, false );
        }
        wp_cache_delete( $opcija, 'options' );
        wp_cache_delete( 'alloptions', 'options' );
        $number = $prefiksas . str_pad( $naujas - 1, 6, '0', STR_PAD_LEFT );
        if ( $order ) {
            $order->update_meta_data( $meta_key, $number );
            $order->save();
        }
        return $number;
    } finally {
        if ( $got ) $wpdb->query( $wpdb->prepare( 'SELECT RELEASE_LOCK(%s)', $lock ) );
    }
}
function petshop_get_avpn_number( $order_id ) {
    return petshop_ps_kitas_numeris( 'petshop_avpn_counter', 'AVPN', $order_id, '_petshop_avpn_number' );
}
function petshop_get_iapv_number( $order_id ) {
    return petshop_ps_kitas_numeris( 'petshop_iapv_counter', 'IAPV', $order_id, '__IAPV_META__' );
}
PHP;
  $PLANAS=[36020=>['AVPN011105','AVPN011107'],36112=>'AVPN011107',36118=>'AVPN011108',36141=>'AVPN011139',36144=>'AVPN011140',36281=>'AVPN011141'];
  try{
  $c=file_get_contents($fp); $reA='/function petshop_get_avpn_number\([^)]*\)\s*\{[\s\S]*?\n\}\n/'; $reI='/function petshop_get_iapv_number\([^)]*\)\s*\{[\s\S]*?\n\}\n/';
  $nA=preg_match_all($reA,$c,$mA); $nI=preg_match_all($reI,$c,$mI); $iapvMeta=null; if($nI&&preg_match('/update_meta_data\(\s*\'([^\']+)\'/',$mI[0][0],$mm)) $iapvMeta=$mm[1];
  if($f==='1'){ $r['functions_md5']=md5($c); $r['avpn_rasta']=$nA; $r['iapv_rasta']=$nI; $r['iapv_fn']=$nI?$mI[0][0]:null; $r['iapv_meta']=$iapvMeta; $r['bak_yra']=file_exists($bak);
    preg_match_all('/^function\s+(\w+)/m',$c,$fn,PREG_OFFSET_CAPTURE); $r['funkcijos']=array_map(function($x) use($c){ return substr_count(substr($c,0,$x[1]),"\n")+1 .' '.$x[0]; },$fn[1]);
    preg_match_all('/[^\n]{0,80}(wcdn|dompdf|attachments|_pdf|generate)[^\n]{0,80}/i',$c,$pm); $r['pdf_eil']=array_slice(array_unique(array_map('trim',$pm[0])),0,25);
    $r['sql_test']=[$wpdb->get_var("SELECT GET_LOCK('ps_test',1)"),$wpdb->get_var("SELECT RELEASE_LOCK('ps_test')")]; }
  if($f==='2'){ if($nA!==1||$nI!==1||!$iapvMeta) throw new Exception("regex: avpn=$nA iapv=$nI meta=$iapvMeta");
    if(!file_exists($bak)){ if(!copy($fp,$bak)) throw new Exception('bak nepavyko'); } $r['bak']=$bak.' '.md5_file($bak);
    $new=str_replace('__IAPV_META__',$iapvMeta,$NEW); $c2=preg_replace($reI,'',$c,1); $c2=preg_replace($reA,$new."\n",$c2,1);
    if(!$c2||strpos($c2,'petshop_ps_kitas_numeris')===false) throw new Exception('keitimas nepavyko');
    try{ token_get_all($c2,TOKEN_PARSE); }catch(Throwable $e){ throw new Exception('PARSE: '.$e->getMessage()); }
    file_put_contents($fp,$c2); $r['md5_po']=md5($c2); $r['hb']=$heart(); if($r['hb']!=200){ copy($bak,$fp); $r['ROLLBACK']=true; } }
  if($f==='3'){ $bakopt=get_option('ps_s1719_avpn_bak'); if(!$bakopt){ $bakopt=[]; foreach(array_keys($PLANAS) as $oid){ $bakopt[$oid]=$wpdb->get_col($wpdb->prepare("SELECT meta_value FROM {$p}wc_orders_meta WHERE order_id=%d AND meta_key='_petshop_avpn_number' ORDER BY id",$oid)); } $bakopt['counter']=get_option('petshop_avpn_counter'); update_option('ps_s1719_avpn_bak',$bakopt,false); } $r['bak_opcija']=$bakopt;
    foreach($PLANAS as $oid=>$v){ $o=wc_get_order($oid); if(!$o){ $r['rez'][$oid]='nėra'; continue; } $buvo=$wpdb->get_col($wpdb->prepare("SELECT meta_value FROM {$p}wc_orders_meta WHERE order_id=%d AND meta_key='_petshop_avpn_number' ORDER BY id",$oid));
      $naujas=is_array($v)?$v[0]:$v; $o->delete_meta_data('_petshop_avpn_number'); $o->add_meta_data('_petshop_avpn_number',$naujas,true); $o->add_order_note('S1719: PVM sąskaitos numeris '.implode('/',$buvo).' → '.$naujas.' (numeravimo lenktynių pataisa; ankstesnis numeris dubliavosi).'); $o->save();
      $po=$wpdb->get_col($wpdb->prepare("SELECT meta_value FROM {$p}wc_orders_meta WHERE order_id=%d AND meta_key='_petshop_avpn_number' ORDER BY id",$oid)); $r['rez'][$oid]=['nr'=>$o->get_order_number(),'buvo'=>$buvo,'po'=>$po]; }
    update_option('petshop_avpn_counter',11142,false); wp_cache_delete('alloptions','options'); $r['counter']=get_option('petshop_avpn_counter');
    $av=$wpdb->get_col("SELECT meta_value FROM {$p}wc_orders_meta WHERE meta_key='_petshop_avpn_number' ORDER BY meta_value"); $cnt=array_count_values($av); $r['dubl_po']=array_keys(array_filter($cnt,function($n){return $n>1;})); $nums=array_map(function($x){return (int)substr($x,4);},$av); sort($nums); $g=[]; for($i=1;$i<count($nums);$i++) for($k=$nums[$i-1]+1;$k<$nums[$i];$k++) $g[]=$k; $r['spragos_po']=$g; $r['max']=max($nums); }
  if($f==='9'){ if(file_exists($bak)){ copy($bak,$fp); $r['functions_atstatytas']=md5_file($fp); } $bakopt=get_option('ps_s1719_avpn_bak'); if($bakopt){ foreach($bakopt as $oid=>$vals){ if($oid==='counter'){ update_option('petshop_avpn_counter',$vals,false); continue; } $o=wc_get_order((int)$oid); if(!$o) continue; $o->delete_meta_data('_petshop_avpn_number'); foreach((array)$vals as $vv) $o->add_meta_data('_petshop_avpn_number',$vv,false); $o->add_order_note('S1719: numeriai atstatyti į pradinius ('.implode('/',(array)$vals).').'); $o->save(); $r['atstatyta'][$oid]=$vals; } } $r['hb']=$heart(); }
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
},1);
