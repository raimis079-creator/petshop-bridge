<?php
/** Plugin Name: TEMP PS S1719p — 500 recon: filtru-sargas turinys, WC get_current_page_url, klaidos atkartojimas (read-only) */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1719p'])) return; $r=['v'=>'S1719p'];
  try{
    $r['filtru_sargas']=file_get_contents(WP_CONTENT_DIR.'/mu-plugins/petshop-filtru-sargas.php');
    $wc=file_get_contents(WP_CONTENT_DIR.'/plugins/woocommerce/includes/abstracts/abstract-wc-widget.php'); if(preg_match('/protected function get_current_page_url\(\)[\s\S]{0,2200}?\n\t}/',$wc,$m)) $r['wc_fn']=$m[0];
    $u='https://petshop.lt/kategorija/katems/?yith_wcan=1&product_cat=tualetai-kraikai-semtuveliai,kraikai-kaciu-tualetams&query_type_product_cat=or&query_type_tipas=or&filter_tipas=atviras';
    foreach(['paprastas'=>[],'ajax'=>['X-Requested-With'=>'XMLHttpRequest','Accept'=>'application/json']] as $k=>$h){ $h['cookie']='ps_js=1'; $h['user-agent']='Mozilla/5.0 ps-test'; $rs=wp_remote_get($u,['timeout'=>40,'sslverify'=>false,'headers'=>$h,'limit_response_size'=>400]); $r['test_'.$k]=is_wp_error($rs)?$rs->get_error_message():wp_remote_retrieve_response_code($rs).' '.substr(preg_replace('/\s+/',' ',strip_tags((string)wp_remote_retrieve_body($rs))),0,80); }
    $u2='https://petshop.lt/kategorija/katems/?product_cat=tualetai-kraikai-semtuveliai,kraikai-kaciu-tualetams&query_type_product_cat=or';
    $rs=wp_remote_get($u2,['timeout'=>40,'sslverify'=>false,'headers'=>['cookie'=>'ps_js=1','user-agent'=>'Mozilla/5.0 ps-test'],'limit_response_size'=>400]); $r['test_be_filter']=is_wp_error($rs)?$rs->get_error_message():wp_remote_retrieve_response_code($rs);
    $el=ini_get('error_log'); $sz=filesize($el); $fh=fopen($el,'r'); fseek($fh,max(0,$sz-20000)); $t=fread($fh,20000); fclose($fh); $r['log_tail_strstr']=array_values(array_filter(array_map(function($l){return substr($l,0,120);},explode("\n",$t)),function($l){return strpos($l,'strstr')!==false;}));
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE); exit;
},1);
