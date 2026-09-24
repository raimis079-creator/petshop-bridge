<?php
/** Plugin Name: TEMP PS S1716p url_passthrough + _gl (1 skaityti / 2 taisyti / 9 atstatyti) */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1716p'])) return;
  $f=$_GET['ps_s1716p']; @set_time_limit(170); global $wpdb; $r=['v'=>'S1716p','faze'=>$f]; $T=$wpdb->prefix.'snippets';
  try{
    $sc=file_get_contents(WP_PLUGIN_DIR.'/wp-super-cache/wp-cache-phase2.php'); preg_match('#function wpsc_remove_tracking_params_from_uri\(.*?\n\}#s',$sc,$m); $fn_src=$m[0]??'';
    if($f==='1'){
      $row=$wpdb->get_row($wpdb->prepare("SELECT id, name, code, active, modified FROM $T WHERE id=%d",619),ARRAY_A); $r['snippet']=['name'=>$row['name'],'active'=>$row['active'],'modified'=>$row['modified'],'md5'=>md5($row['code']),'ilgis'=>strlen($row['code']),'passthrough_eil'=>substr_count($row['code'],'url_passthrough')];
      preg_match_all('#[^\n]*url_passthrough[^\n]*#',$row['code'],$mm); $r['snippet']['eil']=$mm[0];
      $r['sc_fn']=$fn_src; $r['sc_cfg_tracking']=$GLOBALS['wpsc_tracking_parameters']??null; $r['sc_cfg_ignore']=$GLOBALS['wpsc_ignore_tracking_parameters']??null;
      preg_match('#\$wpsc_tracking_parameters\s*=\s*array\((.*?)\);#s',$sc,$dm); $r['sc_default_list']=isset($dm[1])?array_values(array_filter(array_map(function($x){return trim($x," '\"\n\t");},explode(',',$dm[1])))):null;
      $r['cfg_file_has']=preg_match_all('#^.*wpsc_(ignore_)?tracking_parameters.*$#m',file_get_contents(WP_CONTENT_DIR.'/wp-cache-config.php'),$cm)?$cm[0]:[];
    }
    if($f==='2'){
      // 1) snippet 619
      $row=$wpdb->get_row($wpdb->prepare("SELECT code FROM $T WHERE id=%d",619),ARRAY_A); $old=$row['code'];
      if(substr_count($old,"gtag('set', 'url_passthrough', true)")!==1) throw new Exception('inkaras: '.substr_count($old,"url_passthrough"));
      if(!get_option('ps_s1716_snippet619_bak')) update_option('ps_s1716_snippet619_bak',['code'=>$old,'md5'=>md5($old),'t'=>current_time('mysql')],false);
      $arch=dirname(rtrim(ABSPATH,'/')).'/ps-archyvas/snippet-619-consent-bridge-v1.4.bak_s1716.php'; if(!file_exists($arch)) file_put_contents($arch,"<?php\n".$old);
      $new=str_replace("gtag('set', 'url_passthrough', true)","gtag('set', 'url_passthrough', false) /* S1716 2026-09-25: true = _gl ant visu vidiniu nuorodu nesutikusiems (86 %), Super Cache ju nekesuoja */",$old);
      $new=str_replace('Petshop Consent Bridge v1.4','Petshop Consent Bridge v1.5',$new);
      $tok=@token_get_all("<?php\n".$new,TOKEN_PARSE); if(!$tok) throw new Exception('token');
      $wpdb->update($T,['code'=>$new,'name'=>'Petshop Consent Bridge v1.5 (Complianz -> GTM, legalus denied default, be url_passthrough)'],['id'=>619]);
      if(function_exists('\\Code_Snippets\\clean_snippets_cache')) \Code_Snippets\clean_snippets_cache($T); wp_cache_flush();
      $r['snippet']=['bak_failas'=>$arch,'bak_md5'=>md5($old),'nauja_md5'=>md5($wpdb->get_var("SELECT code FROM $T WHERE id=619")),'name'=>$wpdb->get_var("SELECT name FROM $T WHERE id=619")];
      // 2) Super Cache tracking params + _gl
      preg_match('#\$wpsc_tracking_parameters\s*=\s*array\((.*?)\);#s',$sc,$dm); $def=isset($dm[1])?array_values(array_filter(array_map(function($x){return trim($x," '\"\n\t");},explode(',',$dm[1])))):[];
      $cur=$GLOBALS['wpsc_tracking_parameters']??null; $base=(is_array($cur)&&$cur)?$cur:$def; $r['sc_pries']=$cur; if(!$base) throw new Exception('numatyto saraso nerasta');
      if(!in_array('_gl',$base)) $base[]='_gl'; if(!in_array('_ga',$base)) $base[]='_ga';
      if(!function_exists('wp_cache_setting')) throw new Exception('wp_cache_setting nera');
      update_option('ps_s1716_sc_tracking_bak',['pries'=>$cur,'t'=>current_time('mysql')],false);
      wp_cache_setting('wpsc_tracking_parameters',$base); $r['sc_po']=$base;
      if(function_exists('wp_cache_clear_cache')) wp_cache_clear_cache();
      // 3) patikra: HTML be url_passthrough true; _gl URL kesuojamas
      $h=wp_remote_get(home_url('/?nc='.mt_rand()),['timeout'=>40,'sslverify'=>false]); $b=wp_remote_retrieve_body($h); $r['html']=['kodas'=>wp_remote_retrieve_response_code($h),'passthrough_true'=>preg_match("#url_passthrough',\s*true#",$b)?1:0,'passthrough_false'=>preg_match("#url_passthrough',\s*false#",$b)?1:0,'v15'=>strpos($b,'Consent Bridge v1.5')!==false?1:0];
    }
    if($f==='3'){ foreach(['/kategorija/katems/','/kategorija/katems/?_gl=1*abc*_up*MQ..*_ga*x','/kategorija/katems/?_gl=1*zzz'] as $u){ $h=wp_remote_get(home_url($u),['timeout'=>40,'sslverify'=>false,'headers'=>['User-Agent'=>'Mozilla/5.0 Chrome/128']]); $b=wp_remote_retrieve_body($h); $r['kesas'][$u]=[wp_remote_retrieve_response_code($h),preg_match('#Cached page generated#',$b)?'CACHED':(preg_match('#Dynamic page generated#',$b)?'dynamic':'-')]; } $r['sc_cfg']=$GLOBALS['wpsc_tracking_parameters']??null; }
    if($f==='9'){ $b=get_option('ps_s1716_snippet619_bak'); if($b){ $wpdb->update($T,['code'=>$b['code'],'name'=>'Petshop Consent Bridge v1.4 (Complianz -> GTM, legalus denied default)'],['id'=>619]); if(function_exists('\\Code_Snippets\\clean_snippets_cache')) \Code_Snippets\clean_snippets_cache($T); $r['snippet_atstatytas']=md5($b['code']); } $sb=get_option('ps_s1716_sc_tracking_bak'); if($sb&&function_exists('wp_cache_setting')){ wp_cache_setting('wpsc_tracking_parameters',$sb['pries']?:''); $r['sc_atstatyta']=1; } if(function_exists('wp_cache_clear_cache')) wp_cache_clear_cache(); }
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  wp_send_json($r);
}, 1);
