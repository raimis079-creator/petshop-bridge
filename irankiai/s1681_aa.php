<?php
/** TEMP PS S1681 aa — read-only: petshop-av-sheets.php <style> blokas ir versija/md5. */
add_action('init', function(){
  if (!isset($_GET['ps_s1681aa'])) return; $f=WPMU_PLUGIN_DIR.'/petshop-av-sheets.php'; $s=file_get_contents($f); $o=array('v'=>'S1681 aa','md5'=>md5($s),'dydis'=>strlen($s));
  preg_match('/Version:\s*([\d.]+)/i',$s,$m); $o['ver']=$m[1]??''; $i=strpos($s,'<style'); $j=strpos($s,'</style>',$i); $o['css']=substr($s,$i,$j-$i+8);
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
