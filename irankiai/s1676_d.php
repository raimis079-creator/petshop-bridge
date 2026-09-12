<?php
/** TEMP PS S1676 run d — kur kodo šablonai cart-abandoned-*.php; Petshop_Email_Dispatch::render šaltinio pasirinkimas. READ-ONLY. */
add_action('init', function(){
  if (!isset($_GET['ps_s1676d'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1676 d');
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $it=new RecursiveIteratorIterator(new RecursiveDirectoryIterator(WP_CONTENT_DIR,FilesystemIterator::SKIP_DOTS));
  foreach($it as $f){ $n=$f->getFilename(); if(preg_match('/^cart-abandoned-[12]\.php$/',$n)){ $o['failai'][$f->getPathname()]=array('md5'=>md5_file($f->getPathname()),'turinys'=>file_get_contents($f->getPathname())); } }
  $rc=new ReflectionClass('Petshop_Email_Dispatch'); $o['dispatch_failas']=$rc->getFileName(); $L=explode("\n",file_get_contents($rc->getFileName()));
  foreach(array('render','flows') as $m){ if($rc->hasMethod($m)){ $r=$rc->getMethod($m); $o['src'][$m]=implode("\n",array_slice($L,$r->getStartLine()-1,min(70,$r->getEndLine()-$r->getStartLine()+1))); } }
  $fl=Petshop_Email_Dispatch::flows(); $o['flows_cart']=array('cart_abandoned'=>$fl['cart_abandoned'],'cart_abandoned_2'=>$fl['cart_abandoned_2']);
  $o['renderis_yra']=file_exists(WPMU_PLUGIN_DIR.'/petshop-laiskai/renderis.php');
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
