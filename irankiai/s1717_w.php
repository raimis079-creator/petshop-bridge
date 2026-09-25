<?php
/** Plugin Name: TEMP PS S1717w — Super Cache: wp_cache_clear_on_post_edit 1 → 0 (kad importai netrintu viso keso). Fazes: 1 sausas, 2 vykdyti (bak ps-archyvas/wp-cache-config.php.bak_s1717), 3 patikra, 9 atstatyti */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1717w'])) return;
  $f=$_GET['ps_s1717w']; @set_time_limit(170); $r=['v'=>'S1717w','faze'=>$f];
  $cf=WP_CONTENT_DIR.'/wp-cache-config.php'; $bak='/home/gyvunai2/domains/petshop.lt/ps-archyvas/wp-cache-config.php.bak_s1717';
  $sc=WP_CONTENT_DIR.'/cache/supercache/petshop.lt';
  $kiek=function() use($sc){ $n=0; if(is_dir($sc)){ $it=new RecursiveIteratorIterator(new RecursiveDirectoryIterator($sc,FilesystemIterator::SKIP_DOTS)); foreach($it as $fi){ if(substr($fi->getFilename(),-5)==='.html') $n++; } } return $n; };
  try{
    $s=file_get_contents($cf); preg_match('#^\$wp_cache_clear_on_post_edit\s*=\s*([^;]*);#m',$s,$m); $r['dabar']=trim($m[1]??'?'); $r['md5']=md5($s); $r['keso_failu']=$kiek();
    if($f==='2'){
      if(!is_file($bak)) copy($cf,$bak); $r['bak']=is_file($bak);
      if(function_exists('wp_cache_setting')){ wp_cache_setting('wp_cache_clear_on_post_edit',0); $r['wp_cache_setting']='ok'; }
      else { $s2=preg_replace('#^(\$wp_cache_clear_on_post_edit\s*=\s*)[^;]*;#m','${1}0;',$s); file_put_contents($cf,$s2); $r['regex']='ok'; }
      $s=file_get_contents($cf); preg_match('#^\$wp_cache_clear_on_post_edit\s*=\s*([^;]*);#m',$s,$m); $r['po']=trim($m[1]??'?');
    }
    if($f==='3'){ $r['patikra']=['nustatymas'=>$r['dabar'],'keso_failu'=>$r['keso_failu'],'laikas'=>current_time('mysql')]; }
    if($f==='9'){ if(is_file($bak)){ copy($bak,$cf); $r['atstatyta']=md5_file($cf); } else $r['klaida']='bak nera'; }
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  wp_send_json($r);
}, 1);
