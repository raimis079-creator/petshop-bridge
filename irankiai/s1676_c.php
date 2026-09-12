<?php
/** TEMP PS S1676 run c — kodo šablonai cart-abandoned-1/2.php + kaip renderinti() renkasi DB/kodą. READ-ONLY. */
add_action('init', function(){
  if (!isset($_GET['ps_s1676c'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1676 c');
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $rc=new ReflectionClass('Petshop_Laiskai_Turinys'); $cf=$rc->getFileName(); $o['klase_failas']=$cf;
  $s=file_get_contents($cf); $L=explode("\n",$s);
  foreach(array('renderinti','perziura','paskelbtas','renderio_failas','uztikrinti_renderi','dabartinis_flow') as $m){ $r=$rc->getMethod($m); $o['src'][$m]=implode("\n",array_slice($L,$r->getStartLine()-1,min(60,$r->getEndLine()-$r->getStartLine()+1))); }
  foreach(glob(WP_PLUGIN_DIR.'/*/**/cart-abandoned-*.php').glob(WP_PLUGIN_DIR.'/*/cart-abandoned-*.php').glob(WP_PLUGIN_DIR.'/*/*/*/cart-abandoned-*.php') as $f){ $o['failai'][$f]=array('md5'=>md5_file($f),'dydis'=>filesize($f),'turinys'=>file_get_contents($f)); }
  $o['draft_blocks']=$wpdb->get_results("SELECT id,flow,blocks_json FROM {$p}ps_email_content WHERE flow IN ('cart_abandoned','cart_abandoned_2')",ARRAY_A);
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
