<?php
/** Plugin Name: TEMP PS S1697 feed recon (read-only) */
add_action('wp_loaded', function(){
  $f=(isset($_GET['ps_s1697'])?$_GET['ps_s1697']:''); if($f!=='1'&&$f!=='2') return;
  header('Content-Type: application/json; charset=utf-8');
  $o=array('v'=>'S1697 ma','faze'=>$f,'laikas'=>current_time('mysql'));
  global $wpdb; $p=$wpdb->prefix;
  try{
    if($f==='1'){
      // A. plugin failas
      $kand=array(WP_CONTENT_DIR.'/mu-plugins/petshop-feeds.php', WP_CONTENT_DIR.'/plugins/petshop-feeds/petshop-feeds.php');
      foreach(glob(WP_CONTENT_DIR.'/plugins/petshop-feeds*/*.php') as $g) $kand[]=$g;
      foreach($kand as $k){ if(file_exists($k)){ $src=file_get_contents($k); preg_match('/Version:\s*([\d\.]+)/',$src,$m);
        $o['failai'][]=array('k'=>str_replace(WP_CONTENT_DIR,'',$k),'ver'=>$m[1]??'?','dydis'=>filesize($k),'md5'=>substr(md5($src),0,8),'mtime'=>date('Y-m-d H:i',filemtime($k)),
          'meta_raktai'=>array_values(array_unique(array_filter(preg_split('/[\'"]/',$src),function($s){return strpos($s,'_ps_feed')===0;}))),
          'opcijos'=>array_values(array_unique(array_filter(preg_split('/[\'"]/',$src),function($s){return strpos($s,'ps_feed')===0;}))),
          'cron'=>array_values(array_unique(array_filter(preg_split('/[\'"]/',$src),function($s){return preg_match('/^ps_.*feed|feed.*cron/i',$s);}))),
          'get_raktai'=>array_values(array_unique(array_filter(preg_split('/[\'"]/',$src),function($s){return preg_match('/^ps_feeds/',$s);}))),
          'funkcijos'=>array_slice(array_values(array_unique(preg_replace('/.*function\s+(\w+).*/','$1',preg_grep('/function\s+\w+/',explode("\n",$src))))),0,60)); } }
      // B. statiniai failai
      $up=wp_upload_dir(); $dir=$up['basedir'].'/petshop-feeds';
      foreach(glob($dir.'/*') as $g) $o['statiniai'][]=array('f'=>basename($g),'dydis'=>filesize($g),'mtime'=>date('Y-m-d H:i',filemtime($g)),'items'=>substr_count(file_get_contents($g),'<item>'),'products'=>substr_count(file_get_contents($g),'<product>'));
      // C. cron
      foreach(_get_cron_array() as $ts=>$hooks) foreach($hooks as $h=>$x) if(stripos($h,'feed')!==false) $o['cron'][]=array('h'=>$h,'kada'=>date('Y-m-d H:i',$ts+3*3600));
      // D. HTTP
      foreach(array('kaina24','kainos','google') as $c){ $r=wp_remote_head(home_url('/feed/'.$c),array('timeout'=>15,'redirection'=>2)); $o['http'][$c]=is_wp_error($r)?$r->get_error_message():array(wp_remote_retrieve_response_code($r),wp_remote_retrieve_header($r,'content-length'),wp_remote_retrieve_header($r,'content-type')); }
      // E. feed_off meta
      foreach(array('kaina24','kainos','google') as $c) $o['feed_off'][$c]=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}postmeta WHERE meta_key='_ps_feed_off_$c' AND meta_value IN ('1','yes')");
      $o['do_not_export']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}postmeta WHERE meta_key='_do_not_export' AND meta_value IN ('1','yes')");
      $o['opcijos_db']=$wpdb->get_results("SELECT option_name, LEFT(option_value,300) v FROM {$p}options WHERE option_name LIKE '%ps_feed%' OR option_name LIKE '%petshop_feed%'",ARRAY_A);
    } else {
      // F. kaina24.xml turinys pagal brendą
      $up=wp_upload_dir(); $x=$up['basedir'].'/petshop-feeds/kaina24.xml';
      if(file_exists($x)){ $s=file_get_contents($x); preg_match_all('/<product>(.*?)<\/product>/s',$s,$mm);
        $br=array(); $kat=array(); $n=0; $pvz=array();
        foreach($mm[1] as $it){ $n++; preg_match('/<manufacturer>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/manufacturer>/s',$it,$b); $b=trim($b[1]??'?'); $br[$b]=($br[$b]??0)+1;
          preg_match('/<category_full_path>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/category_full_path>/s',$it,$k); $k=trim($k[1]??'?'); $k1=explode(' > ',$k)[0]; $kat[$k1]=($kat[$k1]??0)+1;
          if(count($pvz)<2) $pvz[]=substr($it,0,900); }
        arsort($br); arsort($kat); $o['kaina24_n']=$n; $o['brendai']=$br; $o['kategorijos_top']=array_slice($kat,0,25,true); $o['pvz']=$pvz;
        preg_match_all('/<(\w+)>/',$mm[1][0]??'',$tg); $o['tagai']=array_values(array_unique($tg[1])); }
      // G. srautas iš kainų palyginimo: ps_web_ivykiai referrer per 30 d.
      $cols=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_web_ivykiai"); $o['web_cols']=$cols;
      $rc=null; foreach($cols as $c) if(preg_match('/ref/i',$c)){$rc=$c;break;}
      $tc=null; foreach($cols as $c) if(preg_match('/laik|time|data|created/i',$c)){$tc=$c;break;}
      $uc=null; foreach($cols as $c) if(preg_match('/url|kelias|path|puslap/i',$c)){$uc=$c;break;}
      if($rc&&$tc){ $o['ref_kainu']=$wpdb->get_results("SELECT DATE(`$tc`) d, SUBSTRING_INDEX(SUBSTRING_INDEX(`$rc`,'/',3),'/',-1) h, COUNT(*) n FROM {$p}ps_web_ivykiai WHERE (`$rc` LIKE '%kaina24%' OR `$rc` LIKE '%kainos.lt%' OR `$rc` LIKE '%kainoteka%') AND `$tc`>=DATE_SUB(NOW(),INTERVAL 30 DAY) GROUP BY d,h ORDER BY d",ARRAY_A);
        if($uc) $o['ref_kainu_landing']=$wpdb->get_results("SELECT `$uc` u, COUNT(*) n FROM {$p}ps_web_ivykiai WHERE (`$rc` LIKE '%kaina24%' OR `$rc` LIKE '%kainos.lt%') AND `$tc`>=DATE_SUB(NOW(),INTERVAL 30 DAY) GROUP BY u ORDER BY n DESC LIMIT 60",ARRAY_A); }
      // H. WC užsakymai iš kainų palyginimo: prekės
      $o['uzs_kainu']=$wpdb->get_results("SELECT o.id, DATE(o.date_created_gmt) d, o.total_amount t, m.meta_value ref, GROUP_CONCAT(oi.order_item_name SEPARATOR ' | ') prekes
        FROM {$p}wc_orders o JOIN {$p}wc_orders_meta m ON m.order_id=o.id AND m.meta_key='_wc_order_attribution_referrer' AND (m.meta_value LIKE '%kaina24%' OR m.meta_value LIKE '%kainos.lt%')
        LEFT JOIN {$p}woocommerce_order_items oi ON oi.order_id=o.id AND oi.order_item_type='line_item'
        WHERE o.type='shop_order' AND o.status IN ('wc-processing','wc-completed','wc-on-hold') AND o.date_created_gmt>='2026-09-08' GROUP BY o.id ORDER BY o.id",ARRAY_A);
      $o['uzs_utm_kainu']=$wpdb->get_results("SELECT o.id, DATE(o.date_created_gmt) d, o.total_amount t, m.meta_value us, GROUP_CONCAT(oi.order_item_name SEPARATOR ' | ') prekes
        FROM {$p}wc_orders o JOIN {$p}wc_orders_meta m ON m.order_id=o.id AND m.meta_key='_wc_order_attribution_utm_source' AND (m.meta_value LIKE '%kaina%')
        LEFT JOIN {$p}woocommerce_order_items oi ON oi.order_id=o.id AND oi.order_item_type='line_item'
        WHERE o.type='shop_order' AND o.status IN ('wc-processing','wc-completed','wc-on-hold') AND o.date_created_gmt>='2026-09-08' GROUP BY o.id ORDER BY o.id",ARRAY_A);
    }
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
