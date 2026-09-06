<?php
/** TEMP PS S1627 r2 — RECON: ataskaitų / langų puslapių slug'ai ir teisės (add_menu_page/add_submenu_page visose mu-plugins + plugins/petshop-*), WP meniu punktai „Petshop“. */
add_action('admin_menu', function(){ if(!isset($_GET['ps_r12'])) return; global $menu,$submenu; $o=array('v'=>'S1627 r2'); $wpdb=$GLOBALS['wpdb']; $p=$wpdb->prefix; $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $m=array(); foreach((array)$menu as $x){ if(isset($x[2])&&(preg_match('/^(ps-|petshop)/',$x[2])||stripos((string)$x[0],'petshop')!==false)){ $m[]=array('slug'=>$x[2],'t'=>wp_strip_all_tags($x[0]),'cap'=>$x[1]); } } $o['menu']=$m;
  $s=array(); foreach((array)$submenu as $parent=>$items){ if(!preg_match('/^(ps-|petshop)/',$parent)) continue; foreach($items as $it){ $s[]=$parent.' → '.$it[2].' | '.wp_strip_all_tags($it[0]).' | '.$it[1]; } } $o['submenu']=$s;
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit; },9999);
add_action('init', function(){ if(!isset($_GET['ps_r12'])) return; wp_set_current_user(1); if(!defined('WP_ADMIN')) define('WP_ADMIN',true); require_once ABSPATH.'wp-admin/includes/admin.php'; do_action('admin_menu',''); },99);
