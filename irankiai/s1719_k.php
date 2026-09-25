<?php
/** Plugin Name: TEMP PS S1719k — AVPN011139 dublikato pataisa: 1 rodyti, 2 #1143 → kitas laisvas, patikra */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1719k'])) return; $f=$_GET['ps_s1719k']; $r=['v'=>'S1719k','faze'=>$f]; global $wpdb; $p=$wpdb->prefix;
  try{
    $r['kas_turi_11139']=$wpdb->get_results("SELECT m.order_id,m.meta_value,o.date_created_gmt FROM {$p}wc_orders_meta m JOIN {$p}wc_orders o ON o.id=m.order_id WHERE m.meta_key='_petshop_avpn_number' AND m.meta_value IN ('AVPN011139','AVPN011140','AVPN011141','AVPN011142') ORDER BY m.meta_value,m.order_id",ARRAY_A);
    $r['counter']=get_option('petshop_avpn_counter');
    if($f==='2'){ $naujas=petshop_get_avpn_number(0); $r['paimtas']=$naujas; $o=wc_get_order(36141); $buvo=$o->get_meta('_petshop_avpn_number'); $o->delete_meta_data('_petshop_avpn_number'); $o->add_meta_data('_petshop_avpn_number',$naujas,true); $o->add_order_note('S1719: PVM sąskaitos numeris '.$buvo.' → '.$naujas.' (011139 jau buvo paimtas naujo užsakymo).'); $o->save(); $r['1143']=[$buvo,$o->get_meta('_petshop_avpn_number')]; $bk=get_option('ps_s1719_avpn_bak'); $bk['pataisa_1143']=$naujas; update_option('ps_s1719_avpn_bak',$bk,false); }
    $av=$wpdb->get_col("SELECT meta_value FROM {$p}wc_orders_meta WHERE meta_key='_petshop_avpn_number' ORDER BY meta_value"); $cnt=array_count_values($av); $r['dubl']=array_keys(array_filter($cnt,function($n){return $n>1;})); $nums=array_map(function($x){return (int)substr($x,4);},$av); sort($nums); $g=[]; for($i=1;$i<count($nums);$i++) for($k=$nums[$i-1]+1;$k<$nums[$i];$k++) $g[]=$k; $r['spragos']=$g; $r['max']=max($nums); $r['counter_po']=get_option('petshop_avpn_counter');
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE); exit;
},1);
