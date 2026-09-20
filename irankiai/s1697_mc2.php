<?php
/** Plugin Name: TEMP PS S1697 feed recon 3 (read-only) */
add_action('wp_loaded', function(){
  $f=(isset($_GET['ps_s1697'])?$_GET['ps_s1697']:''); if($f!=='1') return;
  header('Content-Type: application/json; charset=utf-8');
  $o=array('v'=>'S1697 mc2');
  global $wpdb; $p=$wpdb->prefix; $W="{$p}ps_web_ivykiai";
  try{
    $o['ses_diena']=$wpdb->get_results("SELECT DATE(laikas) d, referer_domenas h, COUNT(DISTINCT sesija) s, COUNT(*) n FROM $W WHERE (referer_domenas LIKE '%kaina24%' OR referer_domenas LIKE '%kainos.lt%' OR referer_domenas LIKE '%kainoteka%') AND laikas>='2026-09-13' GROUP BY d,h ORDER BY d",ARRAY_A);
    $o['ses_viso']=$wpdb->get_results("SELECT referer_domenas h, COUNT(DISTINCT sesija) s, COUNT(DISTINCT DATE(laikas)) dienos FROM $W WHERE (referer_domenas LIKE '%kaina24%' OR referer_domenas LIKE '%kainos.lt%' OR referer_domenas LIKE '%kainoteka%') AND laikas>='2026-09-13' GROUP BY h",ARRAY_A);
    $o['ses_viso_visi']=$wpdb->get_var("SELECT COUNT(DISTINCT sesija) FROM $W WHERE laikas>='2026-09-13'");
    $o['ivykiai_tipai']=$wpdb->get_results("SELECT * FROM $W WHERE referer_domenas LIKE '%kaina24%' ORDER BY id DESC LIMIT 2",ARRAY_A);
    // pirmas sesijos ivykis su kainu referer -> landing preke -> brendas; sesijos ir uzsakymai pagal brenda
    $rows=$wpdb->get_results("SELECT w.sesija, MIN(w.id) mid FROM $W w WHERE (w.referer_domenas LIKE '%kaina24%' OR w.referer_domenas LIKE '%kainos.lt%' OR w.referer_domenas LIKE '%kainoteka%') AND w.laikas>='2026-09-13' GROUP BY w.sesija",ARRAY_A);
    $br=array(); $sku=array();
    foreach($rows as $r){ $u=$wpdb->get_var("SELECT url_kelias FROM $W WHERE id=".(int)$r['mid']); if(strpos($u,'/product/')!==0){ $br['(ne prekė)']=($br['(ne prekė)']??0)+1; continue; }
      $slug=trim(explode('?',substr($u,9))[0],'/'); $pid=$wpdb->get_var($wpdb->prepare("SELECT ID FROM {$p}posts WHERE post_name=%s AND post_type='product' LIMIT 1",$slug));
      $b=$pid?($wpdb->get_var("SELECT t.name FROM {$p}term_relationships tr JOIN {$p}term_taxonomy tt ON tt.term_taxonomy_id=tr.term_taxonomy_id AND tt.taxonomy='product_brand' JOIN {$p}terms t ON t.term_id=tt.term_id WHERE tr.object_id=$pid LIMIT 1")?:'?'):'(nerasta)';
      $br[$b]=($br[$b]??0)+1; $k=$pid?:$slug; if(!isset($sku[$k])) $sku[$k]=array('pid'=>$pid,'b'=>$b,'ses'=>0,'slug'=>$slug,'kaina'=>$pid?get_post_meta($pid,'_price',true):'','sav'=>$pid?(get_post_meta($pid,'_cost_price',true)?:get_post_meta($pid,'_vf_cost',true)?:get_post_meta($pid,'_zb_cost',true)):''); $sku[$k]['ses']++; }
    arsort($br); uasort($sku,function($a,$b){return $b['ses']-$a['ses'];});
    $o['ses_brendai']=$br; $o['ses_sku']=array_slice(array_values($sku),0,50);
    // kaina24.xml: stock 0 kiekis ir pagal brenda
    $up=wp_upload_dir(); $s=file_get_contents($up['basedir'].'/petshop-feeds/kaina24.xml');
    preg_match_all('/<product id="(\d+)">.*?<price>([\d\.]+)<\/price>.*?<stock>(\d+)<\/stock>.*?<manufacturer><!\[CDATA\[(.*?)\]\]>/s',$s,$mm,PREG_SET_ORDER);
    $st0=array(); $n0=0; $kainos=array('<5'=>0,'5-12'=>0,'12-30'=>0,'30+'=>0); $brn=array();
    foreach($mm as $m){ $brn[$m[4]]=($brn[$m[4]]??0)+1; if((int)$m[3]===0){ $n0++; $st0[$m[4]]=($st0[$m[4]]??0)+1; } $pr=(float)$m[2]; $kainos[$pr<5?'<5':($pr<12?'5-12':($pr<30?'12-30':'30+'))]++; }
    arsort($st0); arsort($brn); $o['k24_viso']=count($mm); $o['k24_stock0']=$n0; $o['k24_stock0_brendai']=array_slice($st0,0,20,true); $o['k24_kainos']=$kainos; $o['k24_brendai']=$brn;
    $o['kainoteka_ref']=$wpdb->get_results("SELECT laikas, url_kelias FROM $W WHERE referer_domenas LIKE '%kainoteka%' ORDER BY id DESC LIMIT 6",ARRAY_A);
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
