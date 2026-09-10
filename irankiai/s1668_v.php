<?php
/** TEMP PS S1668 v — Quattro kainos+savikainos pagal „Quattro -20" lapą. DRY (be rašymo) / A (rašymas su sargais + backup opcija). */
add_action('init', function(){
  if (!isset($_GET['ps_s1668v'])) return;
  $f=$_GET['ps_s1668v']; global $wpdb; $o=array('v'=>'S1668 v','faze'=>$f);
  $D=json_decode('[[16540, "4770107253772", 13.0, 15.0, 9.9174], [16558, "4770107253796", 47.0, 52.0, 34.3802], [16546, "4770107253802", 12.0, 14.0, 9.2562], [16564, "4770107253826", 44.0, 50.0, 33.0579], [16537, "4770107253833", 12.0, 14.0, 9.2562], [16555, "4770107253857", 44.0, 49.0, 32.3967], [16552, "4770107253864", 13.0, 15.0, 9.9174], [16570, "4770107253888", 47.0, 52.0, 34.3802], [16543, "4770107253895", 12.0, 14.0, 9.2562], [16561, "4770107253918", 44.0, 49.0, 32.3967], [16549, "4770107253925", 13.0, 15.0, 9.9174], [16567, "4770107253949", 43.5, 52.0, 34.3802], [16612, "4770107255455", 22.0, 24.0, 15.8678], [16705, "4770107255479", 69.0, 72.0, 47.6033], [16606, "4770107255486", 22.0, 24.0, 15.8678], [16699, "4770107255509", 69.0, 72.0, 47.6033], [16609, "4770107255516", 22.0, 24.0, 15.8678], [16702, "4770107255530", 69.0, 72.0, 47.6033], [16603, "4770107255547", 22.0, 24.0, 15.8678], [16696, "4770107255561", 69.0, 72.0, 47.6033], [16615, "4770107255578", 23.0, 25.0, 16.5289], [16708, "4770107255592", 70.0, 73.0, 48.2645], [16597, "4770107255639", 22.0, 24.0, 15.8678], [16690, "4770107255653", 69.0, 72.0, 47.6033], [16591, "4770107255981", 22.0, 24.0, 15.8678], [16594, "4770107255998", 69.0, 72.0, 47.6033], [16600, "4770107255608", 23.0, 25.0, 16.5289], [16693, "4770107255622", 70.0, 73.0, 48.2645], [16724, "4770107258302", 15.0, 16.5, 10.9091], [16573, "4770107258364", 54.99, 60.0, 39.6694], [16721, "4770107258326", 15.0, 16.5, 10.9091], [16576, "4770107258388", 54.99, 60.0, 39.6694], [16718, "4770107258333", 16.0, 17.5, 11.5702], [16582, "4770107258395", 60.0, 63.0, 41.6529], [16715, "4770107258319", 17.0, 18.5, 12.2314], [16579, "4770107258371", 65.0, 68.0, 44.9587], [16712, "4770107258357", 17.0, 18.5, 12.2314], [16588, "4770107258418", 65.0, 68.0, 44.9587], [16727, "4770107258340", 17.0, 18.5, 12.2314], [16585, "4770107258401", 65.0, 68.0, 44.9587], [16624, "4770107250139", 12.0, 14.0, 9.2562], [16627, "4770107250146", 42.0, 44.0, 29.0909], [16648, "4770107250115", 11.0, 13.0, 8.595], [16651, "4770107250122", 39.0, 40.0, 26.4463], [16672, "4770107250061", 11.0, 13.0, 8.595], [16675, "4770107250078", 38.0, 42.0, 27.7686], [16684, "4770107250030", 15.0, 17.0, 11.2397], [16687, "4770107250047", 48.0, 52.0, 34.3802], [16654, "4770107256018", 49.0, 53.0, 35.0413], [16669, "4770107254410", 49.0, 53.0, 35.0413], [16639, "4770107251839", 7.5, 8.5, 5.6198], [16636, "4770107251891", 26.0, 28.0, 18.5124], [16645, "4770107257251", 10.0, 12.0, 7.9339], [16642, "4770107257268", 33.0, 36.0, 23.8017], [16633, "4770107257275", 11.0, 13.0, 8.595], [16630, "4770107257282", 34.0, 37.0, 24.4628], [16663, "4770107250092", 7.5, 8.5, 5.6198], [16660, "4770107250108", 26.0, 28.0, 18.5124], [16657, "4770107254144", 10.0, 12.0, 7.9339], [16681, "4770107249959", 9.0, 11.0, 7.2727], [16678, "4770107249966", 34.0, 38.0, 25.124], [16621, "4770107249980", 10.0, 12.0, 7.9339], [16618, "4770107249997", 35.0, 40.0, 26.4463], [16666, "4770107254403", null, 18.0, 11.9008]]',true); $SRC='quattro_kainorastis_20_20260910'; $now=current_time('mysql');
  $bak=($f==='A')?get_option('ps_s1668_quattro_bak',array()):array();
  $ok=0; $skip=array(); $pav=array();
  try{
  foreach($D as $x){ list($pid,$ean,$oldk,$nk,$ns)=$x;
    $pr=wc_get_product($pid); if(!$pr){ $skip[]=array($pid,'nera'); continue; }
    $e1=(string)get_post_meta($pid,'_ean',true); $e2=(string)$pr->get_global_unique_id(); $sand=get_post_meta($pid,'_ps_sandelis',true);
    $reg=(string)$pr->get_regular_price(); $cost=(string)get_post_meta($pid,'_cost_price',true); $t=$pr->get_name();
    if($pr->get_type()!=='simple'){ $skip[]=array($pid,'tipas '.$pr->get_type()); continue; }
    if($sand!=='quattro'){ $skip[]=array($pid,'sandelis '.$sand); continue; }
    if($pid==16666){ if(stripos($t,'extra salmon')===false||stripos($t,'3kg')===false){ $skip[]=array($pid,'zodziu sargas: '.$t); continue; }
      if(($e1!==''&&$e1!==$ean)||($e2!==''&&$e2!==$ean)){ $skip[]=array($pid,'EAN kitas: '.$e1.'/'.$e2); continue; } }
    else { if($e1!==$ean && $e2!==$ean){ $skip[]=array($pid,'EAN nesutampa '.$e1.'/'.$e2); continue; }
      if($oldk!==null && abs((float)$reg-(float)$oldk)>0.001){ $skip[]=array($pid,'kaina pasikeitė nuo DRY: '.$reg); continue; } }
    if($pr->get_sale_price()!==''){ $skip[]=array($pid,'turi akcijos kaina '.$pr->get_sale_price()); continue; }
    $pav[]=array($pid,mb_substr($t,0,50),$reg.'→'.$nk,round((float)$cost,2).'→'.round($ns,2),'EAN '.($e1?:'-').'/'.($e2?:'-'));
    if($f==='A'){
      if(!isset($bak[$pid])) $bak[$pid]=array('reg'=>$reg,'price'=>$pr->get_price(),'cost'=>$cost,'src'=>get_post_meta($pid,'_cost_price_source',true),'at'=>get_post_meta($pid,'_cost_price_imported_at',true));
      $pr->set_regular_price(wc_format_decimal($nk,2)); $pr->save();
      update_post_meta($pid,'_cost_price',number_format($ns,4,'.',''));
      update_post_meta($pid,'_cost_price_source',$SRC); update_post_meta($pid,'_cost_price_imported_at',$now);
      wc_delete_product_transients($pid);
    }
    $ok++;
  }
  if($f==='A') update_option('ps_s1668_quattro_bak',$bak,false);
  if($f==='V'){ foreach(array(16540,16558,16666) as $pid){ $pr=wc_get_product($pid); $lk=$wpdb->get_row($wpdb->prepare("SELECT min_price,max_price FROM {$wpdb->prefix}wc_product_meta_lookup WHERE product_id=%d",$pid),ARRAY_A);
      $r=wp_remote_get(get_permalink($pid),array('timeout'=>20)); $h=is_wp_error($r)?'':wp_remote_retrieve_body($r);
      preg_match_all('/woocommerce-Price-amount amount"><bdi>([\d,\.]+)/',$h,$m);
      $o['ver'][$pid]=array('reg'=>$pr->get_regular_price(),'price'=>$pr->get_price(),'cost'=>get_post_meta($pid,'_cost_price',true),'lookup'=>$lk,'front_kodas'=>is_wp_error($r)?'ERR':wp_remote_retrieve_response_code($r),'front_kainos'=>array_slice(array_unique($m[1]),0,4)); }
    $o['bak_n']=count((array)get_option('ps_s1668_quattro_bak',array()));
    $o['src_n']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->prefix}postmeta WHERE meta_key='_cost_price_source' AND meta_value='$SRC'"); }
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  $o['ok']=$ok; $o['skip']=$skip; $o['pavyzdziai']=array_slice($pav,0,4); $o['p16666']=array_values(array_filter($pav,function($p){return $p[0]==16666;}));
  wp_send_json($o);
});
