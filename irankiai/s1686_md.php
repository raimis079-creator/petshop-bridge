<?php
/** TEMP PS S1686 md — READ-ONLY: dispatch šablono kelio filtras ir siuntimo metu naudojama flow_class; Layout::close eilutės 114–145; refill engine 340–410 (payload/context). */
add_action('init', function(){
  if (!isset($_GET['ps_s1686md'])) return; $o=array('v'=>'S1686 md'); $core=WP_PLUGIN_DIR.'/petshop-core/includes';
  $L=file("$core/class-email-dispatch.php"); foreach($L as $i=>$l) if(preg_match('/template_path|flow_class|templates\/emails|file_exists|check_eligibility\(/',$l)) $o['dispatch'][]=($i+1).': '.trim(mb_substr($l,0,220));
  $M=file("$core/class-email-layout.php"); $o['layout_close']=implode("\n",array_map('trim',array_slice($M,113,32)));
  $R=file("$core/class-refill-engine.php"); $o['refill_fire']=implode("\n",array_map('trim',array_slice($R,344,60)));
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
