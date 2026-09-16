<?php
/** TEMP PS S1688 mi — RECON: class-welcome-modal.php — kaip rodomas/slepiamas (cookie, localStorage, filtras, sąlygos), kad relaunch atėjimui (?svoris/cid) modalo nerodyti. */
add_action('init', function(){
  if (!isset($_GET['ps_s1688mi'])) return; $o=array('v'=>'S1688 mi');
  $f=WP_CONTENT_DIR.'/plugins/petshop-core/includes/class-welcome-modal.php'; $o['md5']=md5_file($f);
  foreach(file($f) as $i=>$l) if(preg_match('/function |apply_filters|cookie|localStorage|sessionStorage|is_product|return;|add_action|\$_GET|const /',$l)) $o['l'][]=($i+1).': '.trim(mb_substr($l,0,200));
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT); exit;
});
