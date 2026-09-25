<?php
/** Plugin Name: TEMP PS S1720d2 — petshop-paieska v1.1 deploy (1 = bak+rašyti+heartbeat, 2 = testai, 3 = HTML patikra, 9 = atstatyti v1.0) */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1720d2'])) return; $f=$_GET['ps_s1720d2']; $r=['v'=>'S1720d2','faze'=>$f,'t'=>date('Y-m-d H:i:s')];
  global $wpdb; $p=$wpdb->prefix; @set_time_limit(280);
  $fp=WPMU_PLUGIN_DIR.'/petshop-paieska.php'; $bak=dirname(ABSPATH).'/ps-archyvas/petshop-paieska.php.bak_s1720';
  $hb=function() { $rs=wp_remote_get(home_url('/?ps_hb=1&s=exclusion&post_type=product'),['timeout'=>25,'sslverify'=>false,'user-agent'=>'Mozilla/5.0 ps-s1720']); return is_wp_error($rs)?'ERR '.$rs->get_error_message():wp_remote_retrieve_response_code($rs); };
  try{
  if($f==='1'){
    $r['md5_pries']=md5_file($fp);
    if(!isset($_GET['d_petshop_paieska_v1_1b_php_txt'])) throw new Exception('nėra DATA media id');
    $mid=(int)$_GET['d_petshop_paieska_v1_1b_php_txt']; $path=get_attached_file($mid); if(!$path||!file_exists($path)) throw new Exception('media failas nerastas '.$mid);
    $kodas=gzdecode(base64_decode(trim(file_get_contents($path)))); if(!$kodas||strpos($kodas,'Petshop_Paieska')===false) throw new Exception('blogas turinys');
    $r['nauja_md5']=md5($kodas); $r['bytes']=strlen($kodas);
    try{ token_get_all($kodas,TOKEN_PARSE); }catch(Throwable $e){ throw new Exception('PARSE: '.$e->getMessage().' @'.$e->getLine()); }
    if(!is_dir(dirname($bak))) throw new Exception('nėra ps-archyvas');
    if(!file_exists($bak)) copy($fp,$bak); $r['bak']=md5_file($bak);
    file_put_contents($fp,$kodas); $r['md5_po']=md5_file($fp);
    wp_delete_attachment($mid,true); $r['media_istrinta']=1;
    $r['heartbeat']=$hb();
    if(!in_array($r['heartbeat'],[200,'200'],true)){ copy($bak,$fp); $r['ATSTATYTA']='heartbeat '.$r['heartbeat']; }
  }
  if($f==='2'){
    $r['md5']=md5_file($fp); $r['klase']=class_exists('Petshop_Paieska')?'yra':'nera';
    $frazes=['hills','hill\'s science plan kitten','exclusion pork and peas','pork and peas','oazy chicken pollo adult sterilised','monge pet solution dog struvite','ambrozia','royal canin mini adult 8+','bravecto','prima dog','ziurkėnų pavadėliai','hepac','exclusion','animonda','josera','kiauliena su zirneis','duck potato','kitten','sterilised cat','dog food chicken','inps11','19997','leger','triušio','šuniukams','miamor','kraikas','exclusion hypoallergenic duck and potato','royal canin sterilised in jelly','carnilove','dovanu kuponas','animonda vom feinstein','farmina n&d kitten wet'];
    foreach($frazes as $s){ $t0=microtime(true); $q=new WP_Query(['s'=>$s,'post_type'=>'product','post_status'=>'publish','posts_per_page'=>3,'fields'=>'ids','tax_query'=>[['taxonomy'=>'product_visibility','field'=>'name','terms'=>['exclude-from-search'],'operator'=>'NOT IN']]]);
      $alt=Petshop_Paieska::alternatyva($s); $r['test'][$s]=['n'=>(int)$q->found_posts,'ms'=>round((microtime(true)-$t0)*1000),'pvz'=>array_map(function($id){return mb_substr(get_the_title($id),0,50);},array_slice($q->posts,0,2)),'alt'=>$alt?$alt[0]:null,'terminai'=>array_map(function($t){return $t->name;},Petshop_Paieska::terminai($s,5))]; }
    $r['pasleptos_josera']=Petshop_Paieska::pasleptos('josera leger'); $r['pasleptos_exclusion']=Petshop_Paieska::pasleptos('exclusion intestinal');
    $r['kontaktai']=['from'=>get_option('woocommerce_email_from_address'),'tel'=>get_option('woocommerce_store_phone'),'kontaktai_psl'=>get_page_by_path('kontaktai')?get_permalink(get_page_by_path('kontaktai')):null];
    $r['hubai']=array_map(function($id){$t=get_term($id,'product_cat');return $t&&!is_wp_error($t)?$t->name.' ('.$t->count.')':'?';},Petshop_Paieska::HUBAI);
    $r['heartbeat']=$hb();
  }
  if($f==='3'){
    foreach(['hills','hill\'s kitten','exclusion pork and peas','bravecto','kitten','dovanu kuponas'] as $s){ $rs=wp_remote_get(home_url('/?s='.rawurlencode($s).'&post_type=product'),['timeout'=>25,'sslverify'=>false,'user-agent'=>'Mozilla/5.0 ps-s1720']); $b=wp_remote_retrieve_body($rs); $x=['http'=>wp_remote_retrieve_response_code($rs),'prekiu'=>preg_match_all('/class="[^"]*product-small[^"]*"/',$b),'nulis'=>strpos($b,'ps-paieska-nulis')!==false,'juosta'=>strpos($b,'ps-paieska-juosta')!==false,'wc_nerasta'=>strpos($b,'Produktų nerasta')!==false];
      if(preg_match('#<div class="ps-paieska-(nulis|juosta)">(.*?)</div>\s*(?:<div class="products|</div>\s*</div>)#s',$b,$m)){ $x['tekstas']=mb_substr(preg_replace('/\s+/',' ',strip_tags(preg_replace('#<style.*?</style>#s','',$m[0]))),0,900); }
      $r['html'][$s]=$x; }
    $rs=wp_remote_post(admin_url('admin-ajax.php'),['timeout'=>20,'sslverify'=>false,'body'=>['action'=>'flatsome_ajax_search_products','query'=>'hills']]); $r['ajax_hills']=substr(wp_remote_retrieve_body($rs),0,300);
    $rs=wp_remote_post(admin_url('admin-ajax.php'),['timeout'=>20,'sslverify'=>false,'body'=>['action'=>'flatsome_ajax_search_products','query'=>'pork peas']]); $r['ajax_porkpeas']=substr(wp_remote_retrieve_body($rs),0,400);
    $r['php_error_tail']=file_exists(dirname(ABSPATH).'/logs/php_error.log')?substr(file_get_contents(dirname(ABSPATH).'/logs/php_error.log'),-1500):'-';
  }
  if($f==='9'){
    if(!file_exists($bak)) throw new Exception('nėra bak'); copy($bak,$fp); $r['md5_po']=md5_file($fp); $r['heartbeat']=$hb();
  }
  }catch(Throwable $e){ $r['ERR']=$e->getMessage(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
