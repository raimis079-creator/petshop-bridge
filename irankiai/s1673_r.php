<?php
/** Plugin Name: TEMP PS S1673 recon read */
add_action('init', function(){ if(!isset($_GET['ps_r'])||$_GET['ps_r']!=='GO') return;
  header('Content-Type: application/json; charset=utf-8'); $r=get_option('ps_ads_recon'); echo is_array($r)?$r['body']:json_encode($r); exit; });
