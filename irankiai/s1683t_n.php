<?php
/** TEMP PS S1683t n — desk.php klausimas()/klausimo_eilutes(): nurašyta laikyti ir _ps_av_reduced_qty>0 (kaip darbalaukis); bak jau yra .bak_s1683 (pirmas), papildomas .bak_s1683b; patikra #1057. */
add_action('init', function(){
  if (!isset($_GET['ps_s1683tn'])) return; $o=array('v'=>'S1683t n'); $f=WPMU_PLUGIN_DIR.'/petshop-desk.php'; $s=file_get_contents($f);
  if(md5($s)!=='4a3e62b9c078acefb9a71cdd650b01cf'){ $o['STOP']='md5'; echo json_encode($o); exit; }
  $u=wp_upload_dir(); $bak=$u['basedir'].'/ps-backups/petshop-desk.php.bak_s1683b'; if(!file_exists($bak)) file_put_contents($bak,$s);
  $old="\t\t\tif ( \$it->get_meta( '_reduced_stock' ) || \$it->get_meta( '_ps_av_reduced' ) ) { continue; }\n";
  $new="\t\t\tif ( \$it->get_meta( '_reduced_stock' ) || \$it->get_meta( '_ps_av_reduced' ) || (int) \$it->get_meta( '_ps_av_reduced_qty' ) > 0 ) { continue; } // S1683: AV nurašymas žymi _ps_av_reduced_qty\n";
  $n=substr_count($s,$old); if($n!==2){ $o['STOP']='old count '.$n; echo json_encode($o); exit; }
  $new_s=str_replace($old,$new,$s); try{ token_get_all($new_s,TOKEN_PARSE);}catch(Throwable $e){ $o['STOP']=$e->getMessage(); echo json_encode($o); exit; }
  file_put_contents($f,$new_s); if(function_exists('opcache_invalidate')) opcache_invalidate($f,true); $o['md5_po']=md5_file($f);
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
