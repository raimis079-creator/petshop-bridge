<?php
/** Plugin Name: TEMP PS S1719u — snippet 614 v1.2 (sesija rašoma tik kai ATC eilė netuščia): 1 sausas (kodo fragmentai), 2 pataisa, 9 atstatymas */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1719u'])) return; $f=$_GET['ps_s1719u']; $r=['v'=>'S1719u','faze'=>$f]; global $wpdb; $p=$wpdb->prefix;
  try{ $c=$wpdb->get_var("SELECT code FROM {$p}snippets WHERE id=614"); $name=$wpdb->get_var("SELECT name FROM {$p}snippets WHERE id=614");
    $lines=explode("\n",$c); $out=[]; foreach($lines as $i=>$l){ if(strpos($l,'petshop_gtm_atc_queue')!==false){ for($j=max(0,$i-6);$j<=min(count($lines)-1,$i+6);$j++) $out[$j]=$lines[$j]; } } ksort($out);
    if($f==='1'){ $r['name']=$name; $r['len']=strlen($c); $r['fragmentai']=array_map(function($k,$v){return ($k+1).': '.$v;},array_keys($out),$out); }
    if($f==='2'){ $old="WC()->session->set( 'petshop_gtm_atc_queue', array() );"; $n=substr_count($c,$old); if($n!==1) throw new Exception("rasta $n kartų: $old"); update_option('ps_s1719_snip614_bak',$c,false);
      $new="if ( ! empty( \$queue ) ) { WC()->session->set( 'petshop_gtm_atc_queue', array() ); } // S1719: sesija rašoma tik kai eilė netuščia (botų sesijų/ps DB įrašų mažinimas)"; $c2=str_replace($old,$new,$c); token_get_all("<?php\n".$c2,TOKEN_PARSE);
      $wpdb->update("{$p}snippets",['code'=>$c2,'name'=>str_replace('v1.1','v1.2',$name)],['id'=>614]); wp_cache_flush(); $r['name_po']=$wpdb->get_var("SELECT name FROM {$p}snippets WHERE id=614");
      $hb=wp_remote_get('https://petshop.lt/?ps_hb='.time(),['timeout'=>25,'sslverify'=>false]); $r['hb']=is_wp_error($hb)?'ERR':wp_remote_retrieve_response_code($hb); if($r['hb']!=200){ $wpdb->update("{$p}snippets",['code'=>$c,'name'=>$name],['id'=>614]); $r['ROLLBACK']=true; }
      $rs=wp_remote_get(home_url('/?ps_t='.time()),['timeout'=>25,'sslverify'=>false,'headers'=>['user-agent'=>'Mozilla/5.0 ps-test','cookie'=>'ps_js=1']]); $r['pradinis_set_cookie']=wp_remote_retrieve_header($rs,'set-cookie')?:'nėra (gerai — sesija nekuriama)'; }
    if($f==='9'){ $old=get_option('ps_s1719_snip614_bak'); if($old){ $wpdb->update("{$p}snippets",['code'=>$old,'name'=>str_replace('v1.2','v1.1',$name)],['id'=>614]); $r['atstatyta']=true; } }
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE); exit;
},1);
