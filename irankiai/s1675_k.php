<?php
/** TEMP PS S1675 run k — #35873 tylus atšaukimas (klientas jau nusipirko #1003; pašto blokada, likutis per WC), + laiškų flow sąrašas (bacs/dunning). DRY/APPLY. */
add_action('init', function(){
  if (!isset($_GET['ps_k5'])) return; $f=$_GET['ps_k5']; global $wpdb; $p=$wpdb->prefix; $wpdb->suppress_errors(true); $o=array('v'=>'S1675 k','faze'=>$f);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $w=wc_get_order(35873); $items=array(); foreach($w->get_items() as $it){ $pr=$it->get_product(); $items[$it->get_id()]=array('pid'=>$it->get_product_id(),'q'=>$it->get_quantity(),'stock'=>$pr?$pr->get_stock_quantity():null,'own'=>get_post_meta($it->get_product_id(),'_own_stock_qty',true),'reduced'=>$it->get_meta('_reduced_stock'),'src'=>$it->get_meta('_ps_source')); }
  $o['pries']=array('status'=>$w->get_status(),'items'=>$items);
  // flows
  foreach(array('Petshop_Laiskai_Turinys','Petshop_Laiskai','Petshop_Email_Flows') as $c){ if(class_exists($c)){ $m=array_map(function($x){return $x->name;},(new ReflectionClass($c))->getMethods()); $o['klase'][$c]=array_values(array_filter($m,function($n){return preg_match('/bacs|dunning|primin|flow|siusti|dispatch|planuo/i',$n);})); } }
  $o['flows_db']=$wpdb->get_col("SELECT DISTINCT flow FROM {$p}ps_email_content");
  $o['flows_kodas']=$wpdb->get_col("SELECT DISTINCT flow FROM {$p}ps_email_jobs");
  if($f==='APPLY' && $w->get_status()==='on-hold'){
    $blok=function($r){ return true; }; add_filter('pre_wp_mail',$blok,1,1); $sk=0; add_action('phpmailer_init',function() use(&$sk){$sk++;});
    $w->update_status('cancelled','S1675: atšaukta tyliai Raimio nurodymu — klientas užsakė iš naujo ir apmokėjo #1003 (Paysera). Laiškas klientui nesiųstas (pre_wp_mail blokas).');
    remove_filter('pre_wp_mail',$blok,1);
    $w2=wc_get_order(35873); $items2=array(); foreach($w2->get_items() as $it){ $pr=wc_get_product($it->get_product_id()); $items2[$it->get_id()]=array('stock'=>$pr?$pr->get_stock_quantity():null,'own'=>get_post_meta($it->get_product_id(),'_own_stock_qty',true),'reduced'=>$it->get_meta('_reduced_stock')); }
    $o['po']=array('status'=>$w2->get_status(),'items'=>$items2,'laisku_bandyta'=>$sk,'pastabos'=>array_map(function($n){return mb_substr($n->content,0,100);},array_slice(wc_get_order_notes(array('order_id'=>35873,'limit'=>4)),0,4)));
    $o['email_jobs_nauji']=$wpdb->get_results("SELECT flow,status FROM {$p}ps_email_jobs WHERE created_at>DATE_SUB(NOW(),INTERVAL 5 MINUTE)",ARRAY_A);
  }
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
},99);
