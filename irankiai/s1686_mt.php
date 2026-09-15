<?php
/** TEMP PS S1686 mt — READ-ONLY: feeding-calc REST $in konstravimas ir calc() (kaip svetainė sprendžia MISSING_CONDITION_DIMENSION); naršyklė: Josera 18159 ?svoris=20 ir Exclusion 18587 ?svoris=30 rezultatai. */
add_action('init', function(){
  if (!isset($_GET['ps_s1686mt'])) return; $o=array('v'=>'S1686 mt');
  if(isset($_GET['kodas'])){
    $R=file(WPMU_PLUGIN_DIR.'/petshop-feeding-calc-rest.php'); $o['rest_190_260']=implode("\n",array_map('trim',array_slice($R,189,70)));
    $S=file(WP_PLUGIN_DIR.'/petshop-core/includes/class-feeding-service.php'); $o['calc_274_330']=implode("\n",array_map('trim',array_slice($S,273,60)));
  } else {
    $ev="new Promise(function(r){setTimeout(function(){var o=document.querySelector('.ps-calc-out');r({out:o?o.innerText.slice(0,400):null});},4000);})";
    $o['shots']=array(array('n'=>'s1686_josera20','u'=>add_query_arg('svoris',20,get_permalink(18159)),'eval'=>$ev,'full'=>0),array('n'=>'s1686_excl30','u'=>add_query_arg('svoris',30,get_permalink(18587)),'eval'=>$ev,'full'=>0));
  }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
