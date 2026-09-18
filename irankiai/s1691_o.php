<?php
/** TEMP PS S1691 o — „Pranešti kai bus" formos HTML (forma() eil. 80–130) ir ar ji yra paslėptos prekės #12453 puslapyje. Read-only. */
add_action('init', function(){
  if (!isset($_GET['ps_s1691o'])) return; $o=array();
  $l=file(WPMU_PLUGIN_DIR.'/petshop-atsargu-laukimas.php'); for($i=82;$i<125;$i++) if(isset($l[$i])) $o['forma'][$i+1]=rtrim($l[$i]);
  $u=get_permalink(12453); $r=wp_remote_get(add_query_arg('ps_nocache',time(),$u),array('timeout'=>25,'sslverify'=>false)); $b=is_wp_error($r)?'':wp_remote_retrieve_body($r);
  foreach (array('ps-laukimas','laukimas','Pranešti','pranesti','back-in-stock','ps-bis','stock-watch','ps_stock') as $z) $o['pusl'][$z]=substr_count($b,$z);
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
