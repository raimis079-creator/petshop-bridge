<?php
/** TEMP PS S1685 nn — TESTAS (atskira užklausa): Q4 plano lango renderis (tekstas) be admin sesijos. */
add_action('init', function(){
  if (!isset($_GET['ps_s1685nn'])) return; $o=array('v'=>'S1685 nn','ver'=>Petshop_Planas_Langas::VER,'pak'=>Petshop_Pakartoti::VER);
  ob_start(); Petshop_Planas_Langas::puslapis(); $h=ob_get_clean(); $o['tekstas']=trim(preg_replace('/\s+/',' ',wp_strip_all_tags(preg_replace('#<style.*?</style>#s','',$h))));
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
