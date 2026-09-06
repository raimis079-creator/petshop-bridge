<?php
/** TEMP PS S1620 run e1 — R: dev-pastas žurnalo `priedai` + kodas · T: naujas atsiėmimo užs. (grynais, 19708) → Surinkti → Paruošta atsiimti → Klientas atsiėmė su `pre_wp_mail` gaudykle prior. 4 (tikros nuorodos, tas pats procesas per flag opciją) · P: Pragma recon (tik skaitymas). */
if ( get_option( 'ps_s1620_gaudykle' ) ) {
	add_filter( 'pre_wp_mail', function( $pre, $atts ) { global $wpdb; $a = $atts['attachments'] ?? null; $z = (array) get_option( 'ps_s1620_laiskai', array() );
		$z[] = array( 'kam' => is_array( $atts['to'] ?? '' ) ? implode( ',', $atts['to'] ) : (string) ( $atts['to'] ?? '' ), 'tema' => mb_substr( (string) ( $atts['subject'] ?? '' ), 0, 100 ), 'tipas' => gettype( $a ), 'export' => mb_substr( var_export( $a, true ), 0, 300 ), 'kiek_arr' => is_array( $a ) ? count( $a ) : null, 'kiek_devpastas' => count( (array) ( $a ?? array() ) ), 'failai' => is_array( $a ) ? array_map( function( $f ) { return basename( (string) $f ) . ':' . ( file_exists( $f ) ? filesize( $f ) : 'NĖRA' ); }, $a ) : null, 'uri' => mb_substr( (string) ( $_SERVER['REQUEST_URI'] ?? '' ), 0, 100 ) );
		update_option( 'ps_s1620_laiskai', $z, false ); return $pre; }, 4, 2 );
}
add_action('init', function(){
  if (!isset($_GET['ps_e1'])) return;
  $f=strtoupper(sanitize_key($_GET['ps_e1'])); $o=array('v'=>'S1620 e1','f'=>$f); global $wpdb; $p=$wpdb->prefix; set_time_limit(280);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $J=function($o){ header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit; };
  $tu=get_user_by('login','testuotojas'); $uid=$tu->ID; $exp=time()+1800; $tok=WP_Session_Tokens::get_instance($uid)->create($exp); $li=wp_generate_auth_cookie($uid,$exp,'logged_in',$tok);
  $cs=array(new WP_Http_Cookie(array('name'=>SECURE_AUTH_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp,'secure_auth',$tok))),new WP_Http_Cookie(array('name'=>AUTH_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp,'auth',$tok))),new WP_Http_Cookie(array('name'=>LOGGED_IN_COOKIE,'value'=>$li)));
  $G=function($u,$t=90) use($cs){ return wp_remote_get(html_entity_decode($u,ENT_QUOTES),array('cookies'=>$cs,'timeout'=>$t,'sslverify'=>false,'redirection'=>0)); };
  $eiles=function() use($G){ $r=$G(admin_url('admin.php?page=ps-desk&eile=klausimai')); $h=(string)wp_remote_retrieve_body($r); return array('code'=>wp_remote_retrieve_response_code($r),'nav'=>mb_substr(trim(preg_replace('/\s+/',' ',wp_strip_all_tags(preg_match('/<main class="dl-main">(.*?)<div class="dl-kortele/su',$h,$mm)?$mm[1]:''))),0,140)); };
  $inst=function() use($wpdb,$p){ return $wpdb->get_row("SELECT instance_id,is_enabled FROM {$p}woocommerce_shipping_zone_methods WHERE zone_id=1 AND method_id='local_pickup' ORDER BY instance_id LIMIT 1",ARRAY_A); };
  $gaud=function() use($wpdb,$p){ $v=$wpdb->get_var("SELECT option_value FROM {$p}options WHERE option_name='ps_s1620_laiskai'"); return $v?maybe_unserialize($v):array(); };
  try{
  $_COOKIE[LOGGED_IN_COOKIE]=$li; wp_set_current_user($uid); $n=wp_create_nonce('ps_dl_zurnalas');
  $sk=function($id) use($G,$n){ $r=$G(admin_url('admin-ajax.php?action=ps_dl_skydelis&id='.$id.'&n='.$n),60); return json_decode((string)wp_remote_retrieve_body($r),true)['data']??array(); };
  $skz=function($d){ return array('kur'=>$d['kur']??null,'btn'=>$d['btn']['t']??null,'takelis'=>array_map(function($t){return $t[0].':'.$t[2];},(array)($d['takelis']??array())),'dok'=>array_map(function($x){return $x['t'].' '.$x['nr'].(isset($x['bt'])?' ['.$x['bt'].']':'');},(array)($d['dok']??array()))); };
  $uz=function($id){ wp_cache_flush(); $x=wc_get_order($id); if(!$x) return 'NĖRA'; return array('st'=>$x->get_status(),'pm'=>$x->get_payment_method(),'paid'=>$x->is_paid(),'total'=>$x->get_total(),'avpn'=>$x->get_meta('_petshop_avpn_number'),'pdf'=>basename((string)$x->get_meta('_petshop_completed_pdf')),'surinkta'=>$x->get_meta('_ps_surinkta'),'ats'=>$x->get_meta('_ps_atsiemimas'),'iss'=>$x->get_meta('_ps_dalys_issiusta')); };
  $klik=function($u) use($G){ $r=$G($u,120); $loc=(string)wp_remote_retrieve_header($r,'location'); parse_str((string)parse_url($loc,PHP_URL_QUERY),$q); return array('code'=>wp_remote_retrieve_response_code($r),'pd_ok'=>$q['pd_ok']??null,'pd'=>$q['pd_nr']??null,'body'=>mb_substr(wp_strip_all_tags((string)wp_remote_retrieve_body($r)),0,140)); };
  $post=function($body) use($cs){ $r=wp_remote_post(admin_url('admin-post.php'),array('cookies'=>$cs,'timeout'=>120,'sslverify'=>false,'redirection'=>0,'body'=>$body)); $loc=(string)wp_remote_retrieve_header($r,'location'); parse_str((string)parse_url($loc,PHP_URL_QUERY),$q2); return array('code'=>wp_remote_retrieve_response_code($r),'pd_ok'=>$q2['pd_ok']??null,'pd'=>$q2['pd_nr']??null,'id'=>(int)($q2['atidaryti']??0)); };
  if($f==='R'){
    $z=(array)get_option('ps_dev_pastas_zurnalas',array()); $o['dev_pastas_n']=count($z);
    $o['dev_pastas_priedai']=array_map(function($e){return array($e['laikas']??'',mb_substr($e['tema']??'',0,70),$e['priedai']??null);},array_slice($z,-14));
    $dp=(string)file_get_contents(WPMU_PLUGIN_DIR.'/petshop-dev-pastas.php'); $o['dev_pastas_kodas']=preg_match('/\'priedai\'\s*=>\s*([^,]+),/',$dp,$m)?$m[1]:'?';
    $dl=(string)file_get_contents(WPMU_PLUGIN_DIR.'/petshop-darbalaukis.php'); $o['dl_md5']=md5($dl); $o['ats_send']=preg_match('/ats_laiskas_sudeti\(\s*\$o\s*\);\s*\$mailer = WC\(\)->mailer\(\); \$ok = ([^;]+);/',$dl,$m2)?mb_substr($m2[1],0,140):'?';
    $o['wc_email_send']=preg_match('/public function send\( \$to, \$subject, \$message, \$headers = [^,]+, \$attachments = ([^)]+)\)/',(string)file_get_contents(WP_PLUGIN_DIR.'/woocommerce/includes/class-wc-emails.php'),$m3)?$m3[1]:'?';
    $o['eiles']=$eiles(); $o['inst']=$inst(); $pp=wc_get_product(19708); $o['av19708']=$pp?$pp->get_stock_quantity():null; $J($o);
  }
  if($f==='T'){
    $i=$inst(); if($i){ $wpdb->update("{$p}woocommerce_shipping_zone_methods",array('is_enabled'=>1),array('instance_id'=>(int)$i['instance_id'])); WC_Cache_Helper::get_transient_version('shipping',true); } $o['inst_on']=$inst();
    $pp=wc_get_product(19708); if(!$pp||$pp->get_stock_quantity()<2){ $o['STOP']='19708 likutis'; $J($o); }
    $pr=array(array('id'=>19708,'q'=>1,'kaina'=>number_format((float)wc_get_price_including_tax($pp),2,'.','')));
    $body=array('action'=>'ps_dl_naujas','_wpnonce'=>wp_create_nonce('ps_dl_naujas'),'kl'=>array('uid'=>'0','vardas'=>'ATSIEMIMAS','pavarde'=>'Testas S1620','tel'=>'+37060000098','el'=>'atsiemimas.s1620@dev.avesa.lt','imone'=>'','adresas'=>'','miestas'=>'','kodas'=>''),'pr'=>$pr,'prist'=>'av','prist_kaina'=>'0.00','vieta'=>'','nuolaida'=>'0','nuolaida_pastaba'=>'','pastaba'=>'TEST S1620 priedo patikra','mok'=>'grynais');
    $z0=count((array)get_option('ps_dev_pastas_zurnalas',array())); $o['post']=$post($body); $id=$o['post']['id']; if(!$id){ $J($o); } $o['id']=$id; $o['uzs']=$uz($id); $d=$sk($id); $o['sk']=$skz($d);
    if(($d['btn']['t']??'')!=='Surinkti'){ $o['STOP']='btn ne Surinkti: '.($d['btn']['t']??'-'); $J($o); }
    $r=$G($d['btn']['u'],120); $o['lapai']=wp_remote_retrieve_response_code($r); wp_cache_flush(); $d=$sk($id); $o['sk_po_lapu']=$skz($d);
    if(($d['btn']['t']??'')!=='Paruošta atsiimti'){ $o['STOP']='btn ne Paruošta: '.($d['btn']['t']??'-'); $J($o); }
    $wpdb->query("DELETE FROM {$p}options WHERE option_name IN ('ps_s1620_gaudykle','ps_s1620_laiskai')"); update_option('ps_s1620_gaudykle',1,false); wp_cache_flush();
    $o['paruosta']=$klik($d['btn']['u']); $o['gaudykle_paruosta']=$gaud(); $o['uzs_po_paruosta']=$uz($id); $d=$sk($id); $o['sk_po_paruosta']=$skz($d);
    if(($d['btn']['t']??'')==='Klientas atsiėmė'){ $o['atsieme']=$klik($d['btn']['u']); $o['gaudykle_viso']=$gaud(); $o['uzs_po_atsieme']=$uz($id); $d=$sk($id); $o['sk_po_atsieme']=$skz($d); } else { $o['STOP']='btn ne Atsiėmė: '.($d['btn']['t']??'-'); }
    $wpdb->query("DELETE FROM {$p}options WHERE option_name IN ('ps_s1620_gaudykle','ps_s1620_laiskai')"); wp_cache_flush(); $o['gaud_isvalyta']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}options WHERE option_name LIKE 'ps_s1620_%'");
    $i=$inst(); if($i){ $wpdb->update("{$p}woocommerce_shipping_zone_methods",array('is_enabled'=>0),array('instance_id'=>(int)$i['instance_id'])); WC_Cache_Helper::get_transient_version('shipping',true); } $o['inst_off']=$inst();
    $z=(array)get_option('ps_dev_pastas_zurnalas',array()); $o['dev_pastas']=array('pries'=>$z0,'po'=>count($z),'nauji'=>array_map(function($e){return array(mb_substr($e['tema']??'',0,80),$e['priedai']??null);},array_slice($z,$z0)));
    $notes=wc_get_order_notes(array('order_id'=>$id,'limit'=>6)); $o['pastabos']=array_map(function($nn){return mb_substr($nn->content,0,120);},$notes);
    $o['eiles']=$eiles(); $J($o);
  }
  if($f==='P'){
    $fp=WP_PLUGIN_DIR.'/petshop-pragma/petshop-pragma.php'; $o['yra']=file_exists($fp); if(!$o['yra']){ $o['dir']=is_dir(WP_PLUGIN_DIR.'/petshop-pragma')?scandir(WP_PLUGIN_DIR.'/petshop-pragma'):null; $J($o); }
    $c=(string)file_get_contents($fp); $L=explode("\n",$c); $o['dydis']=strlen($c); $o['md5']=md5($c); $o['eiluciu']=count($L); $o['aktyvus']=(int)is_plugin_active('petshop-pragma/petshop-pragma.php');
    $o['dir']=array_values(array_diff(scandir(WP_PLUGIN_DIR.'/petshop-pragma'),array('.','..'))); $o['antraste']=array_map(function($l){return mb_substr($l,0,160);},array_slice($L,0,45));
    $g=array(); foreach($L as $k=>$l){ if(preg_match('/add_action|add_filter|wp_schedule|register_activation|get_option\(|update_option\(|function |cron|AVPN|IAPV|KR-|kredit|refund|receipt|PPK|kvit|csv|xml|export|eksport|prod|petshop_pragma/i',$l)){ $g[]=($k+1).': '.mb_substr(trim($l),0,150); } if(count($g)>140) break; } $o['grep']=$g;
    $o['opcijos']=$wpdb->get_results("SELECT option_name,LEFT(option_value,120) v FROM {$p}options WHERE option_name LIKE '%pragma%'",ARRAY_A);
    $o['cron']=array_values(array_filter(array_map(function($t,$h){ $k=array_keys((array)$h); return implode(',',array_filter($k,function($x){return stripos($x,'pragma')!==false;})); },array_keys((array)_get_cron_array()),(array)_get_cron_array())));
    $up=wp_upload_dir(); $o['uploads_pragma']=array_values(array_filter(glob($up['basedir'].'/*pragma*')?:array()));
    $o['temp_liko']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}snippets WHERE name LIKE 'TEMP%'"); $J($o);
  }
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.basename($e->getFile()).':'.$e->getLine(); }
  $J($o);
},99);
