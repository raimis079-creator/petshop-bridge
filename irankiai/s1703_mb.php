<?php
/** Plugin Name: TEMP PS S1703 mb — skaičiuoklės kodo recon (read-only): product-calc, feeding-service calc(), relaunch dienos()/rusis(), calc testai */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1703mb'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1703 mb'); $f=$_GET['ps_s1703mb'];
  try{
    $src=function($file,$from,$len){ $s=@file_get_contents($file); return $s===false?'NĖRA':mb_substr($s,$from,$len); };
    $core=WP_PLUGIN_DIR.'/petshop-core/';
    if($f==='1'){
      $o['product_calc_php']=$src($core.'includes/class-product-calc.php',0,14800);
      $o['product_calc_js_head']=$src($core.'assets/product-calc.js',0,6000);
    }
    if($f==='2'){
      $s=file_get_contents($core.'includes/class-feeding-service.php');
      // calc() ir evaluate() metodų tekstas
      foreach(array('calc','evaluate','calc_enabled') as $m){ if(preg_match('/public static function '.$m.'\s*\(.*?\n    \}\n/s',$s,$mm)) $o['fs_'.$m]=mb_substr($mm[0],0,9000); }
      $o['fs_head']=mb_substr($s,0,2500);
      $rl=file_get_contents(WPMU_PLUGIN_DIR.'/petshop-relaunch.php');
      foreach(array('rusis','dienos','svoris','paspaudimas') as $m){ if(preg_match('/public static function '.$m.'\s*\(.*?\n  \}\n/s',$rl,$mm)) $o['rl_'.$m]=mb_substr($mm[0],0,4000); }
    }
    if($f==='3'){
      // calc testai: 3 prekės × 10 kg šuo; ir katė
      foreach(array(18587=>'dog',18054=>'dog',18014=>'dog') as $pid=>$sp){
        $pr=wc_get_product($pid); $o['preke'][$pid]=$pr?array('n'=>$pr->get_name(),'kaina'=>$pr->get_price(),'svoris'=>$pr->get_weight(),'st'=>$pr->get_stock_status()):null;
        foreach(array(array('product_id'=>$pid,'weight_kg'=>10,'species_code'=>$sp),array('product_id'=>$pid,'weight_kg'=>10,'species_code'=>$sp,'activity_level'=>'moderate'),array('product_id'=>$pid,'weight_kg'=>10,'species_code'=>$sp,'activity'=>'moderate')) as $i=>$in){
          try{ $r=Petshop_Feeding_Service::calc($in); $o['calc'][$pid][$i]=is_array($r)?json_decode(json_encode($r),true):$r; }catch(Throwable $e){ $o['calc'][$pid][$i]='ERR '.$e->getMessage(); }
        }
      }
      // katės lentelės
      $o['species']=$wpdb->get_results("SELECT species,scope,status,is_active,COUNT(*) n FROM {$p}ps_feeding_tables GROUP BY species,scope,status,is_active",ARRAY_A);
      $o['dims']=$wpdb->get_results("SELECT t.species, r.condition_dimensions d, COUNT(*) n FROM {$p}ps_feeding_rows r JOIN {$p}ps_feeding_tables t ON t.id=r.feeding_table_id WHERE t.is_active=1 GROUP BY t.species, r.condition_dimensions ORDER BY n DESC LIMIT 40",ARRAY_A);
      // rūšis pagal prekę: kategorijos
      $cats=$wpdb->get_results("SELECT tt.term_id, t.name, t.slug, tt.parent, tt.count FROM {$p}term_taxonomy tt JOIN {$p}terms t ON t.term_id=tt.term_id WHERE tt.taxonomy='product_cat' AND tt.parent=0",ARRAY_A); $o['top_cats']=$cats;
      // gyvų prekių su lentele: rūšis per lentelę, kaina/kg, pakuotė
      $rows=$wpdb->get_results("SELECT m.product_id pid, t.species, t.brand, t.line FROM {$p}ps_feeding_map m JOIN {$p}ps_feeding_tables t ON t.id=m.feeding_table_id JOIN {$p}posts po ON po.ID=m.product_id JOIN {$p}postmeta ps ON ps.post_id=m.product_id AND ps.meta_key='_stock_status' AND ps.meta_value='instock' WHERE m.is_active=1 AND t.is_active=1 AND po.post_status='publish'",ARRAY_A);
      $sp=array(); $pak=array(); foreach($rows as $r){ $sp[$r['species']]=($sp[$r['species']]??0)+1; $w=(float)get_post_meta((int)$r['pid'],'_weight',true); $b=$w>=7?'7+':($w>=3?'3-7':($w>0?'<3':'0')); $pak[$r['species'].' '.$b]=($pak[$r['species'].' '.$b]??0)+1; }
      $o['gyvos_pagal_rusi']=$sp; $o['gyvos_pagal_pak']=$pak; $o['gyvos_n']=count($rows);
    }
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getFile().':'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
