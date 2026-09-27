<?php
/** Plugin Name: TEMP PS S1725b read-only: kur yra admin langas „Rinkiniai" (meniu, failas/snippetas, render funkcija), ir ką turi */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1725b'])) return; $r=['v'=>'S1725b']; global $wpdb; $P=$wpdb->prefix; @set_time_limit(120);
  $grep=function($s,$pat,$ctx=140,$max=25){ preg_match_all('#[^\n]{0,'.$ctx.'}('.$pat.')[^\n]{0,'.$ctx.'}#u',$s,$m); return array_slice(array_map('trim',$m[0]),0,$max); };
  try{
    $pat="Rinkiniai|add_menu_page|add_submenu_page";
    $files=array_merge(glob(WPMU_PLUGIN_DIR.'/*.php')?:[],glob(WP_PLUGIN_DIR.'/petshop-*/*.php')?:[],glob(WP_PLUGIN_DIR.'/petshop-*/includes/*.php')?:[],glob(WP_PLUGIN_DIR.'/petshop-*/admin/*.php')?:[],glob(get_stylesheet_directory().'/*.php')?:[],glob(get_stylesheet_directory().'/inc/*.php')?:[]);
    foreach($files as $f){ $s=file_get_contents($f); if(preg_match('/Rinkiniai/u',$s)) $r['failai'][str_replace(ABSPATH,'',$f)]=['dydis'=>strlen($s),'md5'=>md5($s),'eil'=>$grep($s,$pat)]; }
    foreach($wpdb->get_results("SELECT id,name,scope,active FROM {$P}snippets WHERE active=1 AND code LIKE '%Rinkiniai%'",ARRAY_A) as $x){ $c=$wpdb->get_var($wpdb->prepare("SELECT code FROM {$P}snippets WHERE id=%d",$x['id'])); $r['snippetai'][$x['id'].' '.$x['name'].' ['.$x['scope'].']']=$grep($c,$pat); }
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE); exit;
}, 1);
