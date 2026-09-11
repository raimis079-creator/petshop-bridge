<?php
/** Plugin Name: TEMP PS S1671 feed v2.4 taisykliu dry-run */
add_action('wp_loaded', function(){
  if (!isset($_GET['ps_s1671b']) || $_GET['ps_s1671b']!=='B1') return;
  header('Content-Type: application/json; charset=utf-8'); $o=array('v'=>'S1671b1'); global $wpdb; $p=$wpdb->prefix;
  try {
    $ids = ps_feeds_ids(); $o['ids']=count($ids);
    $st=array('A'=>0,'B'=>0,'C'=>0,'D'=>0,'X'=>0,'out_of_stock'=>0,'akcija'=>0,'ltv'=>0,'ne_reklamai'=>0,'off_google'=>0); $ltv=array(); $ner=array(); $oos=array(); $sale=array(); $pak_by_sand=array(); $excl_kita=array();
    foreach($ids as $id){ if('yes'===get_post_meta($id,'_ps_feed_off_google',true)){$st['off_google']++;continue;} $pr=wc_get_product($id); if(!$pr) continue; $k=(float)$pr->get_price(); if($k<=0) continue;
      $lik=$pr->get_stock_quantity(); if($lik===null) $lik=$pr->is_in_stock()?1:0; if($lik<=0){ $st['out_of_stock']++; if(count($oos)<10)$oos[]=$id.' '.mb_substr($pr->get_name(),0,40); }
      $sav=0; foreach(array('_cost_price','_vf_cost','_zb_cost') as $sk){ $sv=(float)str_replace(',','.',(string)get_post_meta($id,$sk,true)); if($sv>0){$sav=$sv;break;} }
      $kb=$k/1.21; $m=$sav>0?100*($kb-$sav)/$kb:null; $pak=$m===null?'X':($m>=35?'A':($m>=28?'B':($m>=20?'C':'D'))); $st[$pak]++;
      $sand=(string)get_post_meta($id,'_ps_sandelis',true); $pak_by_sand[$sand?:'?'][$pak]=($pak_by_sand[$sand?:'?'][$pak]??0)+1;
      $reg=$pr->get_regular_price(); if($pr->is_on_sale() && $reg!=='' && (float)$reg>$k){ $st['akcija']++; if(count($sale)<5)$sale[]=$id.' '.$reg.'→'.$k; }
      $bt=get_the_terms($id,'product_brand'); $br=($bt&&!is_wp_error($bt))?$bt[0]->name:''; $nm=$pr->get_name(); $kg=(float)str_replace(',','.',(string)$pr->get_weight());
      if($br==='Quattro'){ $st['ne_reklamai']++; if(count($ner)<3)$ner[]=$id; }
      elseif($br==='Exclusion'){ if($kg>=6.5 || preg_match('/\b(7|12)\s*kg\b/iu',$nm)){ $st['ltv']++; $ltv[]=array($id,round($k,2),$kg,$pak,$lik,mb_substr($nm,0,70)); } else { $excl_kita[]=array($id,round($k,2),$kg,mb_substr($nm,0,60)); } }
    }
    $o['st']=$st; $o['pak_by_sand']=$pak_by_sand; $o['ltv']=$ltv; $o['exclusion_ne_ltv_n']=count($excl_kita); $o['exclusion_ne_ltv']=array_slice($excl_kita,0,40); $o['oos_pvz']=$oos; $o['sale_pvz']=$sale; $o['ner_pvz']=$ner;
    $o['ambrosia']=$wpdb->get_var("SELECT COUNT(*) FROM {$p}term_relationships tr JOIN {$p}term_taxonomy tt ON tt.term_taxonomy_id=tr.term_taxonomy_id AND tt.taxonomy='product_brand' JOIN {$p}terms t ON t.term_id=tt.term_id AND t.name='Ambrosia' JOIN {$p}posts p ON p.ID=tr.object_id AND p.post_status='publish'");
    $o['tvenkiniai']=$wpdb->get_results("SELECT p.ID, LEFT(p.post_title,50) t, (SELECT meta_value FROM {$p}postmeta WHERE post_id=p.ID AND meta_key='_stock' LIMIT 1) s, (SELECT meta_value FROM {$p}postmeta WHERE post_id=p.ID AND meta_key='_price' LIMIT 1) k FROM {$p}posts p JOIN {$p}term_relationships tr ON tr.object_id=p.ID JOIN {$p}term_taxonomy tt ON tt.term_taxonomy_id=tr.term_taxonomy_id JOIN {$p}terms t ON t.term_id=tt.term_id AND t.slug='tvenkiniu-zuvu-maistas' WHERE p.post_type='product' AND p.post_status='publish'", ARRAY_A);
  } catch (Throwable $e) { $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  echo json_encode($o, JSON_UNESCAPED_UNICODE); exit;
});
