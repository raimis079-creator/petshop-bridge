<?php
/** TEMP PS S1695 e — (1) class-plan-attribution.php: atribucijos raktas _ps_source → _ps_plan_source (2 vietos), bak + token_get_all + heartbeat/rollback; #1120 (36094) eilutės meta pervadinta; #1120 vidinė pastaba LAUKTI. (2) patikra. */
add_action('init', function(){
  if (!isset($_GET['ps_s1695e'])) return; global $wpdb; $o=array(); $f=$_GET['ps_s1695e'];
  $u=wp_upload_dir(); $bakdir=$u['basedir'].'/ps-backups'; if (!is_dir($bakdir)) @mkdir($bakdir,0755,true);
  $path=WP_PLUGIN_DIR.'/petshop-core/includes/class-plan-attribution.php';
  if ($f==='1'){
    $c=file_get_contents($path); $o['md5_pries']=md5($c); if ($o['md5_pries']!=='d29b46a0df4b16a1dbfc3ba5c6508123'){ $o['STOP']='md5 nesutampa'; goto out; }
    $pairs=array(
      "\t\t\$item->add_meta_data( '_ps_source', \$values['ps_source'], true );" => "\t\t// S1695 (2026-09-20): raktas `_ps_plan_source` — anksčiau `_ps_source`, kuris sutapo su AV variklio tiekimo kelio raktu (av/vf/zb…) ir neapmokėtuose užsakymuose darbalaukis rodė „CALC_PRODUCT siunčia klientui“.\n\t\t\$item->add_meta_data( '_ps_plan_source', \$values['ps_source'], true );",
      "\t\t\tif ( ! \$item->get_meta( '_ps_source' ) ) { continue; }" => "\t\t\tif ( ! \$item->get_meta( '_ps_plan_source' ) ) { continue; } // S1695",
    );
    $crlf=strpos($c,"\r\n")!==false; if ($crlf){ $pp=array(); foreach ($pairs as $a=>$b) $pp[str_replace("\n","\r\n",$a)]=str_replace("\n","\r\n",$b); $pairs=$pp; }
    $n=0; foreach ($pairs as $a=>$b){ $cnt=substr_count($c,$a); if ($cnt!==1){ $o['STOP']="pakeitimas nerastas vieną kartą ($cnt): ".mb_substr($a,0,60); goto out; } $c=str_replace($a,$b,$c); $n++; }
    try { token_get_all($c, TOKEN_PARSE); } catch (Throwable $e) { $o['STOP']='PARSE: '.$e->getMessage(); goto out; }
    $bak=$bakdir.'/class-plan-attribution.php.bak_s1695'; if (!copy($path,$bak)){ $o['STOP']='bak nepavyko'; goto out; }
    if (file_put_contents($path,$c)===false){ copy($bak,$path); $o['STOP']='rašymas nepavyko'; goto out; }
    $o['pakeitimu']=$n; $o['md5_po']=md5_file($path);
    $r=wp_remote_get(home_url('/'),array('timeout'=>25,'sslverify'=>false)); $code=is_wp_error($r)?0:wp_remote_retrieve_response_code($r); $o['heartbeat']=$code;
    if ($code>=500||$code===0){ copy($bak,$path); $o['ROLLBACK']=true; goto out; }
    // #1120 eilutė + pastaba
    $w=wc_get_order(36094); if ($w && $w->get_order_number()==='1120'){
      foreach ($w->get_items() as $it){ if ($it->get_meta('_ps_source')==='calc_product'){ $it->delete_meta_data('_ps_source'); $it->add_meta_data('_ps_plan_source','calc_product',true); $it->save(); $o['eilute_pervadinta']=$it->get_id(); } }
      $w->add_order_note('LAUKTI — dublikatas: tą pačią prekę tą pačią dieną apmokėjo #1121 (vy.bieliauskas@). Priminimų klientei nesiųsti. „CALC_PRODUCT siunčia klientui“ buvo skaičiuoklės atribucijos raktas, ne tiekėjas — sutvarkyta S1695.',false,true); $o['pastaba']='ok'; }
  }
  if ($f==='2'){
    $o['md5']=md5_file($path); $s=file_get_contents($path); $o['_ps_source_liko']=substr_count($s,"'_ps_source'"); $o['_ps_plan_source']=substr_count($s,"'_ps_plan_source'");
    $o['e1120']=$wpdb->get_results("SELECT oim.meta_key,LEFT(oim.meta_value,40) v FROM {$wpdb->prefix}woocommerce_order_itemmeta oim JOIN {$wpdb->prefix}woocommerce_order_items oi ON oi.order_item_id=oim.order_item_id WHERE oi.order_id=36094 AND oim.meta_key IN ('_ps_source','_ps_plan_source','_ps_pet_id')",ARRAY_A);
    $o['pastabos']=array_map(function($n){return $n->date_created->date('H:i').' '.mb_substr(wp_strip_all_tags($n->content),0,90);},array_slice(wc_get_order_notes(array('order_id'=>36094,'limit'=>3)),0,3));
    $o['statusas_1120']=get_post_status(36094)?:$wpdb->get_var("SELECT status FROM {$wpdb->prefix}wc_orders WHERE id=36094");
  }
  out:
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
