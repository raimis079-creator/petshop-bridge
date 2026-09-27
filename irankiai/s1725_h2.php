<?php
/** Plugin Name: TEMP PS S1725h2 DP generatorius (SKU DP-{bazes}-2): 2× pakai savo sandėlio (AV) sausam maistui 2–10 kg per Rinkinių langą (ps_rink_issaugoti). Fazės: 1 dry, 2a/2b/2c kurti juodraščius (po 25), 3 patikra, 5 publikuoti, 6 patikra po publikavimo, 9 visus sugeneruotus į šiukšlinę */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1725h2'])) return; $f=(string)$_GET['ps_s1725h2']; $r=['v'=>'S1725h2','faze'=>$f,'laikas'=>current_time('mysql')]; global $wpdb; $P=$wpdb->prefix; @set_time_limit(175);
  $ZYMA='_ps_s1725_gen';
  $kandidatai=function() use($wpdb,$P){
    $ids=$wpdb->get_col("SELECT p.ID FROM {$P}posts p JOIN {$P}postmeta s ON s.post_id=p.ID AND s.meta_key='_ps_dydzio_seima' AND s.meta_value<>'' WHERE p.post_status='publish' AND p.post_type='product' AND p.post_title REGEXP '(^|[^0-9,.])([2-9]|10)([,.][0-9]+)? ?kg' AND NOT EXISTS (SELECT 1 FROM {$P}postmeta dp WHERE dp.post_id=p.ID AND dp.meta_key='_dp_base_product_id') AND NOT EXISTS (SELECT 1 FROM {$P}postmeta b2 JOIN {$P}posts pp ON pp.ID=b2.post_id AND pp.post_status<>'trash' WHERE b2.meta_key='_dp_base_product_id' AND b2.meta_value=p.ID) ORDER BY p.ID");
    $out=[]; $atmesta=[];
    foreach($ids as $pid){ $pid=(int)$pid; if(Petshop_Rinkiniai::sandelis($pid)!=='av') continue; $p=wc_get_product($pid); if(!$p) continue;
      $q=$p->get_stock_quantity(); $proc=Petshop_DP_Kainos::numatytoji_proc($pid); $reg=(float)$p->get_regular_price('edit');
      $why=''; if($p->get_stock_status()!=='instock') $why='nera likucio'; elseif($q!==null && $q<2) $why='likutis '.$q; elseif($proc==='') $why='nera %'; elseif($reg<=0) $why='be kainos';
      $e=['id'=>$pid,'pav'=>$p->get_name(),'sku'=>$p->get_sku(),'kaina'=>$reg,'lik'=>$q,'proc'=>$proc,'pakas'=>($proc!==''&&$reg>0)?Petshop_DP_Kainos::kaina($reg,2,$proc):null,'svoris'=>(float)$p->get_weight()*2];
      if($why){ $e['atmesta']=$why; $atmesta[]=$e; } else $out[]=$e; }
    return [$out,$atmesta];
  };
  $sesija=function(){ $u=get_users(['role'=>'administrator','orderby'=>'ID','order'=>'ASC','number'=>1]); $uid=(int)$u[0]->ID; $exp=time()+1200; $man=WP_Session_Tokens::get_instance($uid); $st=$man->create($exp);
    $li=wp_generate_auth_cookie($uid,$exp,'logged_in',$st); $ck=[SECURE_AUTH_COOKIE=>wp_generate_auth_cookie($uid,$exp,'secure_auth',$st),AUTH_COOKIE=>wp_generate_auth_cookie($uid,$exp,'auth',$st),LOGGED_IN_COOKIE=>$li,'ps_js'=>'1'];
    wp_set_current_user($uid); $_COOKIE[LOGGED_IN_COOKIE]=$li; return [$man,$st,$ck,wp_create_nonce('ps_rink')]; };
  $sukurti=function($e,$ck,$nonce){ $sku='DP-'.($e['sku']!==''?$e['sku']:$e['id']).'-2'; $n=2; while(wc_get_product_id_by_sku($sku)){ $sku='DP-'.($e['sku']!==''?$e['sku']:$e['id']).'-2-'.$n; $n++; if($n>9) break; }
    $d=['pav'=>'2 vnt. '.$e['pav'],'sku'=>$sku,'kaina'=>$e['pakas'],'aprasymas'=>'','publikuoti'=>0,'tipas'=>'dp','dp_proc'=>(string)$e['proc'],'kat'=>[],'kat_off'=>[],'komponentai'=>[['id'=>$e['id'],'kiekis'=>2]]];
    $x=wp_remote_post(admin_url('admin-ajax.php'),['timeout'=>40,'sslverify'=>false,'cookies'=>$ck,'body'=>['action'=>'ps_rink_issaugoti','nonce'=>$nonce,'id'=>0,'duomenys'=>wp_json_encode($d)]]);
    if(is_wp_error($x)) return ['ERR'=>$x->get_error_message()]; $j=json_decode(wp_remote_retrieve_body($x),true); return $j?:['ERR'=>'kodas '.wp_remote_retrieve_response_code($x).' '.mb_substr(wp_remote_retrieve_body($x),0,150)]; };
  $sugeneruoti=function() use($wpdb,$P,$ZYMA){ return array_map('intval',$wpdb->get_col("SELECT m.post_id FROM {$P}postmeta m JOIN {$P}posts p ON p.ID=m.post_id AND p.post_status<>'trash' WHERE m.meta_key='$ZYMA' ORDER BY m.post_id")); };
  try{
    if(!class_exists('Petshop_Rinkiniai')||!class_exists('Petshop_DP_Kainos')) throw new Exception('truksta klasiu');
    if($f==='1'){ list($o,$a)=$kandidatai(); $r['kurti']=count($o); $r['atmesta']=array_map(function($e){return $e['id'].' '.mb_substr($e['pav'],0,45).' — '.$e['atmesta'];},$a);
      $r['sarasas']=array_map(function($e){return $e['id'].' | '.mb_substr($e['pav'],0,55).' | '.$e['kaina'].' → 2× '.$e['pakas'].' (−'.$e['proc'].'%) | lik '.$e['lik'].' | '.$e['svoris'].' kg';},$o);
      $r['svoris_virs_25']=count(array_filter($o,function($e){return $e['svoris']>25;})); $r['jau_sugeneruota']=count($sugeneruoti()); }
    if(in_array($f,['2a','2b','2c'],true)){
      list($o)=$kandidatai(); $nuo=['2a'=>0,'2b'=>25,'2c'=>50][$f]; $dalis=array_slice($o,0,25); /* kandidatai jau be sugeneruotų — visada imam pirmus 25 */
      list($man,$st,$ck,$nonce)=$sesija(); $ok=0;
      foreach($dalis as $e){ $j=$sukurti($e,$ck,$nonce); $id=(int)($j['data']['id']??0);
        if($id){ update_post_meta($id,$ZYMA,'1'); update_post_meta($id,'rank_math_robots',['noindex']); $ok++; $r['sukurta'][]=$id.' ← '.$e['id']; }
        else $r['klaidos'][]=$e['id'].': '.json_encode($j,JSON_UNESCAPED_UNICODE); }
      $man->destroy($st); $r['ok']=$ok; $r['liko_kandidatu']=count($kandidatai()[0]); $r['viso_sugeneruota']=count($sugeneruoti()); }
    if($f==='3'||$f==='6'){
      $ids=$sugeneruoti(); $r['viso']=count($ids); $bus=[]; $blogi=[]; $seima=0; $terminas=0; $rob=0;
      foreach($ids as $id){ clean_post_cache($id); $p=wc_get_product($id); $b=(int)get_post_meta($id,'_dp_base_product_id',true); $bp=wc_get_product($b); $proc=get_post_meta($id,'_dp_nuolaida_proc',true);
        $bus[get_post_status($id)]=($bus[get_post_status($id)]??0)+1;
        $tik=Petshop_DP_Kainos::kaina((float)$bp->get_regular_price('edit'),(int)get_post_meta($id,'_dp_pack_qty',true),$proc);
        if(abs((float)$p->get_regular_price('edit')-(float)$tik)>0.005 || (float)get_post_meta($id,'_price',true)<=0) $blogi[]=$id.' '.$p->get_regular_price('edit').' vs '.$tik;
        if(get_post_meta($id,'_ps_dydzio_seima',true)!=='' && get_post_meta($id,'_ps_dydzio_seima',true)===get_post_meta($b,'_ps_dydzio_seima',true)) $seima++;
        $t=wp_get_post_terms($id,'pa_pakuotes_dydis',['fields'=>'names']); if($t && preg_match('/[×x]/u',$t[0])) $terminas++;
        $rv=get_post_meta($id,'rank_math_robots',true); if(is_array($rv)&&in_array('noindex',$rv)) $rob++;
        if(count($r['pvz']??[])<5) $r['pvz'][]=['id'=>$id,'pav'=>$p->get_name(),'sku'=>$p->get_sku(),'kaina'=>$p->get_regular_price('edit'),'proc'=>$proc,'kat'=>wp_get_post_terms($id,'product_cat',['fields'=>'names']),'dydis'=>$t,'svoris'=>$p->get_weight(),'foto'=>(int)$p->get_image_id(),'seima'=>get_post_meta($id,'_ps_dydzio_seima',true),'stock'=>$p->get_stock_status()]; }
      $r['busenos']=$bus; $r['kaina_neatitinka']=$blogi; $r['seimoje']=$seima; $r['dydis_su_x']=$terminas; $r['noindex']=$rob; $r['dp_suvestine']=Petshop_DP_Kainos::suvestine();
      if($f==='6'){ $x=wp_remote_get(home_url('/?ps_hb='.time()),['timeout'=>30,'sslverify'=>false]); $r['hb']=wp_remote_retrieve_response_code($x); $r['automatas_log']=array_slice((array)get_option('ps_dydziai_auto_log',[]),0,5); }
    }
    if($f==='5'){ $n=0; foreach($sugeneruoti() as $id){ if(get_post_status($id)==='draft'){ $p=wc_get_product($id); $p->set_status('publish'); $p->save(); $n++; } } $r['publikuota']=$n;
      if(function_exists('wp_cache_clear_cache')) wp_cache_clear_cache(); delete_transient('ps_dk_seimos'); delete_transient('ps_dp_zemelapis'); }
    if($f==='9'){ $n=0; foreach($sugeneruoti() as $id){ wp_trash_post($id); $n++; } delete_transient('ps_dp_zemelapis'); delete_transient('ps_dk_seimos'); $r['i_siuksline']=$n; }
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
}, 1);
