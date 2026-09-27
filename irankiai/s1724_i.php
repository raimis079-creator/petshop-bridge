<?php
/** Plugin Name: TEMP PS S1724i recon: kas registruoja petshop_vf_sync_stock_hourly, kaip raso _stock; petshop-cache v1.2 vykdyti() kodas. read-only */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1724i'])) return; $r=['v'=>'S1724i']; @set_time_limit(120);
  try{
    // 1. kas registruoja hook'a
    $rasta=[]; foreach(array_merge(glob(WPMU_PLUGIN_DIR.'/*.php'),glob(WPMU_PLUGIN_DIR.'/*/*.php'),glob(WPMU_PLUGIN_DIR.'/*/*/*.php'),glob(WP_PLUGIN_DIR.'/*/*.php'),glob(WP_PLUGIN_DIR.'/*/*/*.php')) as $fx){ $s=@file_get_contents($fx); if($s!==false&&strpos($s,'petshop_vf_sync_stock_hourly')!==false) $rasta[]=str_replace(ABSPATH,'',$fx); }
    $r['hook_failai']=$rasta;
    // 2. hook'o callback'as
    global $wp_filter; $cb=[]; if(isset($wp_filter['petshop_vf_sync_stock_hourly'])){ foreach($wp_filter['petshop_vf_sync_stock_hourly']->callbacks as $prio=>$fs){ foreach($fs as $k=>$f){ $fn=$f['function']; if(is_array($fn)){ $cls=is_object($fn[0])?get_class($fn[0]):$fn[0]; $cb[]=[$prio,$cls.'::'.$fn[1]]; try{ $rm=new ReflectionMethod($cls,$fn[1]); $cb[count($cb)-1][]=str_replace(ABSPATH,'',$rm->getFileName()).':'.$rm->getStartLine().'-'.$rm->getEndLine(); }catch(Throwable $e){} } elseif(is_string($fn)){ $cb[]=[$prio,$fn]; try{ $rf=new ReflectionFunction($fn); $cb[count($cb)-1][]=str_replace(ABSPATH,'',$rf->getFileName()).':'.$rf->getStartLine(); }catch(Throwable $e){} } else $cb[]=[$prio,'closure']; } } }
    $r['callbacks']=$cb;
    // 3. callback'o kodas (pirmas)
    if($cb && isset($cb[0][2])){ list($fp,$rng)=explode(':',$cb[0][2]); list($a,$b)=array_pad(explode('-',$rng),2,null); $L=file(ABSPATH.$fp); $b=$b?:$a+80; $r['callback_kodas']=implode('',array_slice($L,$a-1,min($b-$a+1,140)));
      // kur set_stock / update_post_meta _stock tame faile
      foreach($L as $i=>$l){ if(preg_match('/set_stock|_stock\b|wc_update_product_stock|update_post_meta|set_stock_status|->save\(/',$l)) $r['stock_eilutes'][]=($i+1).': '.trim($l); } $r['stock_eilutes']=array_slice($r['stock_eilutes']??[],0,60); $r['failas']=$fp; }
    // 4. petshop-cache vykdyti() ir preke_* funkcijos
    $c=file_get_contents(WPMU_PLUGIN_DIR.'/petshop-cache.php'); $L=explode("\n",$c); $r['cache_ver']=preg_match('#Version:\s*([\d.]+)#',$c,$m)?$m[1]:null; $r['cache_md5']=md5($c); $r['cache_eil']=count($L);
    $st=null; foreach($L as $i=>$l){ if(preg_match('/function (preke_obj|preke_id|preke_props|vykdyti|viskas|zurnalas|po_importo)\b/',$l)) $st[]=$i; }
    $r['cache_kodas']=[]; foreach($st as $i){ $r['cache_kodas'][]=implode("\n",array_map(function($j) use($L){ return ($j+1).': '.$L[$j]; },range($i,min(count($L)-1,$i+28)))); }
    $r['cache_config_opt']=['ps_cache_valymai_n'=>count((array)get_option('ps_cache_valymai'))];
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
}, 1);
