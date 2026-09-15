<?php
/** TEMP PS S1683t j — desk.php klausimas()/klausimo_eilutes() ir darbalaukis.php eilučių būklė: praleisti MnM rinkinio konteinerį; bak abiem; token_get_all; patikra #1053. */
add_action('init', function(){
  if (!isset($_GET['ps_s1683tj'])) return; $o=array('v'=>'S1683t j'); $u=wp_upload_dir(); $bd=$u['basedir'].'/ps-backups/';
  $mnm="\$it->get_meta( '_mnm_config' ) || \$it->get_meta( '_mnm_container_size' )";
  $files=array(
    'petshop-desk.php'=>array('md5'=>'33c9b1fea242f87a8ed189e2dfd9290e','map'=>array(
      "\t\t\tif ( \$it->get_meta( '_reduced_stock' ) || \$it->get_meta( '_ps_av_reduced' ) ) { continue; }\n\t\t\t\$pid = \$it->get_product_id();\n\t\t\tif ( ! \$pid ) { continue; }\n\t\t\t\$fiksuota"=>"\t\t\tif ( \$it->get_meta( '_reduced_stock' ) || \$it->get_meta( '_ps_av_reduced' ) ) { continue; }\n\t\t\tif ( $mnm ) { continue; } // S1683: rinkinio konteineris — likutis komponentuose\n\t\t\t\$pid = \$it->get_product_id();\n\t\t\tif ( ! \$pid ) { continue; }\n\t\t\t\$fiksuota",
      "\t\t\tif ( \$it->get_meta( '_reduced_stock' ) || \$it->get_meta( '_ps_av_reduced' ) ) { continue; }\n\t\t\t\$pid = \$it->get_product_id();\n\t\t\tif ( ! \$pid ) { continue; }\n\t\t\t\$fix ="=>"\t\t\tif ( \$it->get_meta( '_reduced_stock' ) || \$it->get_meta( '_ps_av_reduced' ) ) { continue; }\n\t\t\tif ( $mnm ) { continue; } // S1683: rinkinio konteineris\n\t\t\t\$pid = \$it->get_product_id();\n\t\t\tif ( ! \$pid ) { continue; }\n\t\t\t\$fix =")),
    'petshop-darbalaukis.php'=>array('md5'=>'8b2f896b2020fe09179e357b6729e264','map'=>array(
      "\t\t\t\$ats = (string) \$it->get_meta( '_ps_atsaukta' ); if ( \$ats ) { \$reduced = true; }"=>"\t\t\tif ( $mnm ) { \$reduced = true; } // S1683: rinkinio (Mix-and-Match) konteineris — likutis komponentuose, trūkumo neskaičiuojam\n\t\t\t\$ats = (string) \$it->get_meta( '_ps_atsaukta' ); if ( \$ats ) { \$reduced = true; }")));
  foreach($files as $n=>$c){ $f=WPMU_PLUGIN_DIR.'/'.$n; $s=file_get_contents($f); if(md5($s)!==$c['md5']){ $o['STOP']=$n.' md5'; echo json_encode($o); exit; }
    foreach($c['map'] as $a=>$b) if(substr_count($s,$a)!==1){ $o['STOP']=$n.' nerasta/kartojasi: '.substr($a,0,60).' ='.substr_count($s,$a); echo json_encode($o); exit; }
    $new=str_replace(array_keys($c['map']),array_values($c['map']),$s); try{ token_get_all($new,TOKEN_PARSE);}catch(Throwable $e){ $o['STOP']=$n.' '.$e->getMessage(); echo json_encode($o); exit; }
    $files[$n]['new']=$new; }
  foreach($files as $n=>$c){ $f=WPMU_PLUGIN_DIR.'/'.$n; $bak=$bd.$n.'.bak_s1683'; if(!file_exists($bak)) file_put_contents($bak,file_get_contents($f)); file_put_contents($f,$c['new']); if(function_exists('opcache_invalidate')) opcache_invalidate($f,true); $o[$n]=array('bak'=>md5_file($bak)===$c['md5'],'md5_po'=>md5_file($f)); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
