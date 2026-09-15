<?php
/** TEMP PS S1683 d — petshop-partijos.php: nurašyme praleisti Mix-and-Match rinkinio konteinerio eilutę; bak ps-backups/petshop-partijos.php.bak_s1683; token_get_all. */
add_action('init', function(){
  if (!isset($_GET['ps_s1683d'])) return; $o=array('v'=>'S1683 d'); $f=WPMU_PLUGIN_DIR.'/petshop-partijos.php'; $s=file_get_contents($f);
  if(md5($s)!=='7372f8eebf4218afe9786608b7b05448'){ $o['STOP']='md5'; echo json_encode($o); exit; }
  $u=wp_upload_dir(); $bak=$u['basedir'].'/ps-backups/petshop-partijos.php.bak_s1683'; if(!file_exists($bak)) file_put_contents($bak,$s); $o['bak']=md5_file($bak)===md5($s);
  $old="\t\t\tif ( ! method_exists( \$item, 'get_product_id' ) ) { continue; }\n\t\t\t\$pid  = (int) \$item->get_product_id();\n";
  $new="\t\t\tif ( ! method_exists( \$item, 'get_product_id' ) ) { continue; }\n\t\t\t/* S1683: rinkinio (Mix-and-Match) konteineris partijų neturi — nurašomi tik komponentai. */\n\t\t\tif ( \$item->get_meta( '_mnm_config' ) || \$item->get_meta( '_mnm_container_size' ) ) { continue; }\n\t\t\t\$pid  = (int) \$item->get_product_id();\n";
  if(substr_count($s,$old)!==1){ $o['STOP']='old '.substr_count($s,$old); echo json_encode($o); exit; }
  $n=str_replace($old,$new,$s); try { token_get_all($n,TOKEN_PARSE); } catch(Throwable $e){ $o['STOP']=$e->getMessage(); echo json_encode($o); exit; }
  file_put_contents($f,$n); if(function_exists('opcache_invalidate')) opcache_invalidate($f,true); $o['md5_po']=md5_file($f); $o['dydis']=filesize($f);
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
