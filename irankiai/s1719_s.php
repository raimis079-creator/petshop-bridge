<?php
/** Plugin Name: TEMP PS S1719s — WPAI importų „Skip records that haven't changed" (is_selective_hashing): 1 sausas, 2 įjungti #3 (+#2 jei 0), 9 atstatyti */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1719s'])) return; $f=$_GET['ps_s1719s']; $r=['v'=>'S1719s','faze'=>$f]; global $wpdb; $p=$wpdb->prefix;
  try{
    $rows=$wpdb->get_results("SELECT id,name,processing,executing,triggered,queue_chunk_number,last_activity,options FROM {$p}pmxi_imports WHERE id IN (2,3,7)",ARRAY_A);
    foreach($rows as $row){ $o=@unserialize($row['options']); $r['dabar'][$row['id']]=['name'=>$row['name'],'processing'=>$row['processing'],'executing'=>$row['executing'],'triggered'=>$row['triggered'],'chunk'=>$row['queue_chunk_number'],'last'=>$row['last_activity'],'is_selective_hashing'=>is_array($o)?($o['is_selective_hashing']??'(nėra)'):'unserialize klaida','records_per_request'=>is_array($o)?($o['records_per_request']??null):null]; }
    $r['hash_tbl']=$wpdb->get_var("SELECT COUNT(*) FROM {$p}pmxi_hash");
    if($f==='2'){ $bak=get_option('ps_s1719_wpai_bak',[]); foreach($rows as $row){ $id=(int)$row['id']; if(!in_array($id,[2,3])) continue; if($row['processing']||$row['executing']){ $r['praleista'][$id]='vykdomas dabar'; continue; } $o=@unserialize($row['options']); if(!is_array($o)){ $r['praleista'][$id]='unserialize'; continue; } if((string)($o['is_selective_hashing']??'0')==='1'){ $r['praleista'][$id]='jau 1'; continue; } $bak[$id]=$row['options']; $o['is_selective_hashing']='1'; $wpdb->update("{$p}pmxi_imports",['options'=>serialize($o)],['id'=>$id]); $chk=@unserialize($wpdb->get_var($wpdb->prepare("SELECT options FROM {$p}pmxi_imports WHERE id=%d",$id))); $r['ijungta'][$id]=$chk['is_selective_hashing']??null; } update_option('ps_s1719_wpai_bak',$bak,false); }
    if($f==='9'){ $bak=get_option('ps_s1719_wpai_bak',[]); foreach($bak as $id=>$opt){ $wpdb->update("{$p}pmxi_imports",['options'=>$opt],['id'=>(int)$id]); $r['atstatyta'][]=$id; } }
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE); exit;
},1);
