<?php
/** Plugin Name: TEMP PS S1717t — 2.14 SEO deploy. Fazes: 1 sausas (bukle+planas), 2 failai (schema-prekes v1.1, gsc-tvarka v1.2, seo-sablonai v1.0), 3 RM opcijos + term/post meta, 4 patikra, 9 atstatyti viska */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1717t'])) return;
  $f=$_GET['ps_s1717t']; @set_time_limit(170); global $wpdb; $P=$wpdb->prefix; $r=['v'=>'S1717t','faze'=>$f]; $BAK='ps_s1717_seo_bak';
  $tz=new DateTimeZone('Europe/Vilnius'); $cut=function($v,$n=200){ $v=(string)$v; return mb_strlen($v)>$n?mb_substr($v,0,$n).'…':$v; };
  $FAILAI=[ 'petshop-schema-prekes.php'=>'__B64_SCHEMA__', 'petshop-gsc-tvarka.php'=>'__B64_GSC__', 'petshop-seo-sablonai.php'=>'__B64_SEO__' ];
  $MD5=[ 'petshop-schema-prekes.php'=>'__MD5_SCHEMA__', 'petshop-gsc-tvarka.php'=>'__MD5_GSC__', 'petshop-seo-sablonai.php'=>'__MD5_SEO__' ];
  $bakdir=WP_CONTENT_DIR.'/uploads/ps-backups/';
  $HUBAI=[70=>['Prekės šunims – maistas, skanėstai, priežiūra ir aksesuarai | Petshop.lt','Viskas šunims vienoje vietoje: sausas ir šlapias maistas, skanėstai, antkakliai ir pavadėliai, guoliai, žaislai, priežiūros priemonės. Padedame išsirinkti pagal sudėtį. Pristatymas per 1–3 d. d., nemokamai į paštomatą nuo 30 €.'],
    77=>['Prekės katėms – maistas, kraikas, žaislai ir priežiūra | Petshop.lt','Viskas katėms: sausas ir šlapias maistas, skanėstai, kraikai ir tualetai, draskyklės, žaislai, transportavimo dėžės, priežiūros priemonės. Padedame išsirinkti pagal sudėtį. Pristatymas per 1–3 d. d., nemokamai į paštomatą nuo 30 €.'],
    87=>['Prekės graužikams – pašaras, skanėstai, narvai ir kraikas | Petshop.lt','Pašarai ir skanėstai graužikams, narvai, kraikas ir šienas, priežiūros priemonės. Pristatymas per 1–3 d. d., nemokamai į paštomatą nuo 30 €.'],
    89=>['Prekės paukščiams – lesalas, skanėstai ir aksesuarai | Petshop.lt','Lesalai ir skanėstai papūgoms bei kitiems naminiams paukščiams, aksesuarai narvams. Pristatymas per 1–3 d. d., nemokamai į paštomatą nuo 30 €.'],
    93=>['Prekės žuvims – maistas akvariumo ir tvenkinių žuvims | Petshop.lt','Maistas akvariumo ir tvenkinių žuvims, akvariumų įranga ir priežiūra. Pristatymas per 1–3 d. d., nemokamai į paštomatą nuo 30 €.']];
  $SHOP=11; $HOME=34543;
  $SHOP_T='Visos prekės gyvūnams internetu | Petshop.lt'; $SHOP_D='Visas Petshop.lt asortimentas: maistas, skanėstai, priežiūra ir aksesuarai šunims, katėms, graužikams, paukščiams ir žuvims. Pristatymas per 1–3 d. d., nemokamai į paštomatą nuo 30 €.';
  $RM=['tax_product_cat_title'=>'%term% – pirkti internetu | %sitename%','tax_product_cat_description'=>'%term_description%','tax_product_brand_title'=>'%term% – prekės gyvūnams | %sitename%','tax_product_brand_description'=>'%term_description%'];
  $hb=function() { $out=[]; foreach(['/?ps_hb='.time(),'/kategorija/sunims/maistas-sunims/sausas-maistas-sunims/?ps_hb=1','/gamintojas/josera/?ps_hb=1','/parduotuve/?ps_hb=1','/?ps_hb=2'] as $u){ $res=wp_remote_get(home_url($u),['timeout'=>30,'redirection'=>2]); $out[$u]=is_wp_error($res)?'ERR '.$res->get_error_message():wp_remote_retrieve_response_code($res); } return $out; };
  $tikrinti=function($u) use($cut){ $res=wp_remote_get(home_url($u),['timeout'=>30,'redirection'=>0]); if(is_wp_error($res)) return ['err'=>$res->get_error_message()]; $h=wp_remote_retrieve_body($res); $x=['code'=>wp_remote_retrieve_response_code($res)];
    $loc=wp_remote_retrieve_header($res,'location'); if($loc) $x['loc']=$loc; $xr=wp_remote_retrieve_header($res,'x-redirect-by'); if($xr) $x['by']=$xr;
    if($x['code']==200){ preg_match('#<title>(.*?)</title>#si',$h,$m); $x['title']=html_entity_decode(trim($m[1]??'')); preg_match('#<meta name="description" content="([^"]*)"#i',$h,$m); $x['meta']=$cut(html_entity_decode($m[1]??''),220); preg_match_all('#<h1[^>]*>(.*?)</h1>#si',$h,$mm); $x['h1']=array_map(function($q){return trim(wp_strip_all_tags($q));},$mm[1]);
      preg_match_all('#<script type="application/ld\+json"[^>]*>(.*?)</script>#si',$h,$js); $x['ld']=[]; foreach($js[1] as $j){ $d=json_decode($j,true); $gr=$d['@graph']??[$d]; foreach($gr as $n){ if(!is_array($n)) continue; $t=is_array($n['@type']??null)?implode('/',$n['@type']):($n['@type']??'?'); $x['ld'][]=$t.(isset($n['telephone'])?'(tel)':'').(isset($n['logo'])?'(logo)':''); if($t==='Product' && isset($n['offers'])){ $of=isset($n['offers']['@type'])?$n['offers']:($n['offers'][0]??[]); $x['ship']=$of['shippingDetails']['shippingRate']['value']??null; } } } }
    return $x; };
  try{
  if($f==='1'){
    foreach($FAILAI as $n=>$b){ $p=WPMU_PLUGIN_DIR.'/'.$n; $r['failai'][$n]=['yra'=>is_file($p),'md5_dabar'=>is_file($p)?md5_file($p):null,'md5_naujas'=>$MD5[$n],'bak_yra'=>is_file($bakdir.$n.'.bak_s1717'),'b64_ok'=>md5(base64_decode($b))===$MD5[$n]]; }
    $t=get_option('rank-math-options-titles',[]); foreach($RM as $k=>$v) $r['rm'][$k]=['dabar'=>$t[$k]??null,'bus'=>$v];
    foreach($HUBAI as $id=>$x){ $tm=get_term($id,'product_cat'); $r['hubai'][$id]=['slug'=>$tm?$tm->slug:null,'t_dabar'=>get_term_meta($id,'rank_math_title',true),'d_dabar'=>get_term_meta($id,'rank_math_description',true),'t_bus'=>$x[0],'d_bus'=>$x[1]]; }
    $r['shop']=['dabar'=>[get_post_meta($SHOP,'rank_math_title',true),get_post_meta($SHOP,'rank_math_description',true)],'bus'=>[$SHOP_T,$SHOP_D]]; $r['home_rs']=get_post_meta($HOME,'rank_math_rich_snippet',true);
    $r['bak_yra']=(bool)get_option($BAK); $r['category_show_title']=get_theme_mod('category_show_title',0);
  }
  if($f==='2'){
    if(!is_dir($bakdir)) wp_mkdir_p($bakdir);
    foreach($FAILAI as $n=>$b){ $p=WPMU_PLUGIN_DIR.'/'.$n; $code=base64_decode($b); if(md5($code)!==$MD5[$n]){ $r['klaida']=$n.': md5 nesutampa'; wp_send_json($r); }
      try{ token_get_all($code,TOKEN_PARSE); }catch(Throwable $e){ $r['klaida']=$n.': parse '.$e->getMessage(); wp_send_json($r); }
      if(is_file($p) && !is_file($bakdir.$n.'.bak_s1717')){ copy($p,$bakdir.$n.'.bak_s1717'); }
      $r['deploy'][$n]=['bak'=>is_file($bakdir.$n.'.bak_s1717'),'irasyta'=>(bool)file_put_contents($p,$code),'md5'=>md5_file($p)]; }
    if(function_exists('opcache_invalidate')) foreach($FAILAI as $n=>$b) @opcache_invalidate(WPMU_PLUGIN_DIR.'/'.$n,true);
    $r['heartbeat']=$hb(); $blogas=false; foreach($r['heartbeat'] as $c){ if(!is_int($c)||$c>=500) $blogas=true; }
    if($blogas){ foreach($FAILAI as $n=>$b){ $p=WPMU_PLUGIN_DIR.'/'.$n; if(is_file($bakdir.$n.'.bak_s1717')) copy($bakdir.$n.'.bak_s1717',$p); else @rename($p,$p.'.off_s1717'); } $r['ATSTATYTA']='heartbeat 5xx — failai grąžinti'; $r['heartbeat2']=$hb(); }
  }
  if($f==='3'){
    if(get_option($BAK)){ $r['klaida']='bak jau yra'; wp_send_json($r); }
    $t=get_option('rank-math-options-titles',[]); $bak=['laikas'=>current_time('mysql'),'rm_titles'=>$t,'hubai'=>[],'shop'=>[get_post_meta($SHOP,'rank_math_title',true),get_post_meta($SHOP,'rank_math_description',true)],'home_rs'=>get_post_meta($HOME,'rank_math_rich_snippet',true)];
    foreach($HUBAI as $id=>$x) $bak['hubai'][$id]=[get_term_meta($id,'rank_math_title',true),get_term_meta($id,'rank_math_description',true)];
    update_option($BAK,$bak,false);
    foreach($RM as $k=>$v) $t[$k]=$v; update_option('rank-math-options-titles',$t);
    foreach($HUBAI as $id=>$x){ update_term_meta($id,'rank_math_title',$x[0]); update_term_meta($id,'rank_math_description',$x[1]); }
    update_post_meta($SHOP,'rank_math_title',$SHOP_T); update_post_meta($SHOP,'rank_math_description',$SHOP_D);
    update_post_meta($HOME,'rank_math_rich_snippet','off');
    foreach($wpdb->get_col("SELECT option_name FROM {$wpdb->options} WHERE option_name LIKE '_transient_ps_seo_sabl_%'") as $on) delete_option($on);
    if(function_exists('wp_cache_clear_cache')) { wp_cache_clear_cache(); $r['cache']='išvalytas'; }
    $r['rm_po']=array_intersect_key(get_option('rank-math-options-titles',[]),$RM);
  }
  if($f==='4'){
    foreach(['/?ps_v=1','/parduotuve/?ps_v=1','/kategorija/sunims/?ps_v=1','/kategorija/katems/maistas-katems/?ps_v=1','/kategorija/sunims/maistas-sunims/sausas-maistas-sunims/?ps_v=1','/kategorija/daugiau-pigiau/?ps_v=1','/gamintojas/josera/?ps_v=1','/gamintojas/trixie/?ps_v=1','/gamintojas/ambrosia/?ps_v=1','/product/ambrosia-begrudis-su-eriena-ir-sviezia-elniena-sausas-maistas-sunims-grain-free-lamb-fresh-venison-12-kg/?ps_v=1'] as $u) $r['puslapiai'][$u]=$tikrinti($u);
    foreach(['/register','/login','/exclusion-me-mono-noble-grain-sausas-pasaras-sterilizuotoms-didelems-katems-su-vistiena-1-5-kg','/konservai-sunims-super-beno-grain-free-jautiena-ir-zveriena-415-g','/monge-puppy-sausas-pascaronaras-eriena-ir-ryziai-12kg-48091-1','/maistas-sterilizuotai-katei-su-antsvorio-problema-ka-pirkti-ir-kaip-maitinti','/20-vnt-kiaules-ausu','/deli-nature-menu-super-premium-lesalas-banguotosioms-papugelems-800-g','/sunims/prieziuros-priemones','/daugiau-pigiau/katems-741072930','/contact','/automatine-serykla-kateisuniui','/trixie-kilimelis-purvui-surinkti-120-80-cm','/image/cache/data/katems_nauji/lemon-scaled-625x625_0.jpg','/images/uploader/hk/hk-cichlid-excel-medium-250-g-1.jpg','/cache/images/products/6/47156/04046-3-kg-1757510513-625x625_0.jpg'] as $u) $r['301'][$u]=$tikrinti($u);
    $r['robots']=$cut(wp_remote_retrieve_body(wp_remote_get(home_url('/robots.txt'),['timeout'=>20])),600);
  }
  if($f==='9'){
    foreach($FAILAI as $n=>$b){ $p=WPMU_PLUGIN_DIR.'/'.$n; if(is_file($bakdir.$n.'.bak_s1717')){ copy($bakdir.$n.'.bak_s1717',$p); $r['failai'][$n]='atstatytas iš bak '.md5_file($p); } elseif(is_file($p)){ rename($p,$p.'.off_s1717'); $r['failai'][$n]='pervadintas .off_s1717'; } }
    $bak=get_option($BAK);
    if($bak){ update_option('rank-math-options-titles',$bak['rm_titles']); foreach($bak['hubai'] as $id=>$x){ if(''===(string)$x[0]) delete_term_meta($id,'rank_math_title'); else update_term_meta($id,'rank_math_title',$x[0]); if(''===(string)$x[1]) delete_term_meta($id,'rank_math_description'); else update_term_meta($id,'rank_math_description',$x[1]); }
      if(''===(string)$bak['shop'][0]) delete_post_meta($SHOP,'rank_math_title'); else update_post_meta($SHOP,'rank_math_title',$bak['shop'][0]); if(''===(string)$bak['shop'][1]) delete_post_meta($SHOP,'rank_math_description'); else update_post_meta($SHOP,'rank_math_description',$bak['shop'][1]);
      if(''===(string)$bak['home_rs']) delete_post_meta($HOME,'rank_math_rich_snippet'); else update_post_meta($HOME,'rank_math_rich_snippet',$bak['home_rs']);
      delete_option($BAK); $r['opcijos']='atstatytos'; } else $r['opcijos']='bak nebuvo';
    if(function_exists('wp_cache_clear_cache')) wp_cache_clear_cache();
    $r['heartbeat']=$hb();
  }
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  $r['laikas']=(new DateTime('now',$tz))->format('H:i:s');
  wp_send_json($r);
}, 1);
