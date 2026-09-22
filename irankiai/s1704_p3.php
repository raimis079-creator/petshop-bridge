<?php
/** Plugin Name: TEMP PS S1704p akcijos v1.4 + per_page 0 */
add_action('init', function(){
  $f=(isset($_GET['ps_s1704q'])?$_GET['ps_s1704q']:''); if(!in_array($f,array('1','2','3','9'),true)) return;
  header('Content-Type: application/json; charset=utf-8');
  $o=array('v'=>'S1704p','faze'=>$f);
  try{
    global $wpdb; $p=$wpdb->prefix; $T=$p.'snippets'; $SID=566; $PID=34445;
    if($f==='1'){
      if(get_option('ps_s1704_akcijos_bak')) throw new Exception('bak jau yra');
      $kodas=$wpdb->get_var($wpdb->prepare("SELECT code FROM {$T} WHERE id=%d",$SID));
      $vardas=$wpdb->get_var($wpdb->prepare("SELECT name FROM {$T} WHERE id=%d",$SID));
      $turinys=get_post_field('post_content',$PID);
      if(!$kodas||!$turinys) throw new Exception('nera kodo/turinio');
      $a1=" * Petshop Akcijos v1.3 (dinaminis gyvūno filtras)";
      $b1=" * Petshop Akcijos v1.4 (S1704, 2026-09-22): skaičiuojamos tik matomos ir turinčios likutį prekės\n * Petshop Akcijos v1.3 (dinaminis gyvūno filtras)";
      $a2="  if (empty(\$all_ids)) {\n    return '<p>Šiuo metu galiojančių akcijų nėra.</p>';";
      $b2="  // v1.4 (S1704): tik matomos ir turinčios likutį — kad „Visos (N)\" sutaptų su rodomomis kortelėmis\n  \$all_ids = array_values(array_filter(\$all_ids, function(\$id){\n    \$pr = wc_get_product(\$id);\n    return \$pr && \$pr->is_visible() && \$pr->is_in_stock();\n  }));\n\n".$a2;
      if(substr_count($kodas,$a1)!==1||substr_count($kodas,$a2)!==1) throw new Exception('inkarai nerasti: '.substr_count($kodas,$a1).'/'.substr_count($kodas,$a2));
      $naujas=str_replace(array($a1,$a2),array($b1,$b2),$kodas);
      $tok=@token_get_all("<?php\n".$naujas,TOKEN_PARSE); if(!$tok) throw new Exception('token_get_all nepavyko');
      $a3='[psc_akcijos per_page="30" columns="4"]'; if(substr_count($turinys,$a3)!==1) throw new Exception('shortcode puslapyje nerastas');
      $naujas_t=str_replace($a3,'[psc_akcijos per_page="0" columns="4"]',$turinys);
      update_option('ps_s1704_akcijos_bak',array('laikas'=>current_time('mysql'),'snippet_id'=>$SID,'name'=>$vardas,'code'=>$kodas,'page_id'=>$PID,'content'=>$turinys),false);
      $wpdb->update($T,array('code'=>$naujas,'name'=>str_replace('v1.3','v1.4',$vardas),'modified'=>current_time('mysql')),array('id'=>$SID));
      $o['snippet_atnaujintas']=$wpdb->rows_affected; $o['snippet_md5']=md5($naujas);
      if(function_exists('Code_Snippets\clean_snippets_cache')) { \Code_Snippets\clean_snippets_cache(); $o['cache']='clean_snippets_cache'; }
      wp_cache_flush();
      $r=wp_update_post(array('ID'=>$PID,'post_content'=>$naujas_t),true); $o['puslapis']=is_wp_error($r)?$r->get_error_message():$r;
      $hb=wp_remote_get(home_url('/?ps_hb='.time()),array('timeout'=>20,'sslverify'=>false)); $o['heartbeat']=is_wp_error($hb)?0:wp_remote_retrieve_response_code($hb);
      if(function_exists('wp_cache_clear_cache')) wp_cache_clear_cache();
    } elseif($f==='3'){
      $bak=get_option('ps_s1704_akcijos_bak'); if(!$bak) throw new Exception('bak nera');
      $turinys=get_post_field('post_content',$PID); $a3='[psc_akcijos per_page="30" columns="4"]';
      if(substr_count($turinys,$a3)===1){ $r=wp_update_post(array('ID'=>$PID,'post_content'=>str_replace($a3,'[psc_akcijos per_page="0" columns="4"]',$turinys)),true); $o['puslapis']=is_wp_error($r)?$r->get_error_message():$r; } else $o['puslapis']='jau pakeistas arba nerastas';
      wp_cache_flush(); if(function_exists('wp_cache_clear_cache')) wp_cache_clear_cache();
      $hb=wp_remote_get(home_url('/?ps_hb='.time()),array('timeout'=>20,'sslverify'=>false)); $o['heartbeat']=is_wp_error($hb)?0:wp_remote_retrieve_response_code($hb);
      $o['snippet_md5']=md5($wpdb->get_var($wpdb->prepare("SELECT code FROM {$T} WHERE id=%d",$SID)));
    } elseif($f==='2'){
      $o['snippet_name']=$wpdb->get_var($wpdb->prepare("SELECT name FROM {$T} WHERE id=%d",$SID));
      $o['puslapis_sc']=preg_match('/\[psc_akcijos[^\]]*\]/',get_post_field('post_content',$PID),$m)?$m[0]:null;
      $html=do_shortcode('[psc_akcijos per_page="0" columns="4"]');
      preg_match('/Visos <span class="psc-akc-count">\((\d+)\)/',$html,$m1); $o['visos']=$m1[1]??null;
      preg_match_all('/<a href="[^"]*gyvunas=([a-z]+)"[^>]*>([^<]+)<span class="psc-akc-count">\((\d+)\)/',$html,$m2,PREG_SET_ORDER); $o['kategorijos']=array_map(function($x){return $x[1].' '.$x[3];},$m2);
      $o['korteliu']=substr_count($html,'class="product-small'); $o['korteliu_li']=preg_match_all('/<div class="product-small[^"]*col/',$html);
      $o['html_ilgis']=strlen($html);
      $r=wp_remote_get(home_url('/akcijos/?nocache='.time()),array('timeout'=>30,'sslverify'=>false)); $o['gyvas_puslapis']=is_wp_error($r)?$r->get_error_message():array('kodas'=>wp_remote_retrieve_response_code($r),'korteliu'=>substr_count(wp_remote_retrieve_body($r),'class="product-small'),'visos'=>(preg_match('/Visos <span class="psc-akc-count">\((\d+)\)/',wp_remote_retrieve_body($r),$mm)?$mm[1]:null));
    } else {
      $bak=get_option('ps_s1704_akcijos_bak'); if(!$bak) throw new Exception('bak nera');
      $wpdb->update($T,array('code'=>$bak['code'],'name'=>$bak['name']),array('id'=>$SID)); wp_update_post(array('ID'=>$bak['page_id'],'post_content'=>$bak['content']));
      wp_cache_flush(); if(function_exists('wp_cache_clear_cache')) wp_cache_clear_cache(); $o['atstatyta']=true;
    }
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
