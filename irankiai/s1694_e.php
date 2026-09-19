<?php
/** TEMP PS S1694 e — refill_due realaus payload'o šaltinis (feedback_url/reorder_url/magic), augintinis endpoint registracija, S323 kalibravimo mechanizmas. Read-only. */
add_action('init', function(){
  if (!isset($_GET['ps_s1694e'])) return; global $wpdb; $o=array(); $p=$wpdb->prefix; $C=WP_CONTENT_DIR;
  $files=array_merge(glob("$C/mu-plugins/*.php"),glob("$C/mu-plugins/petshop-core/*.php"),glob("$C/mu-plugins/petshop-core/includes/*.php"),glob("$C/mu-plugins/petshop-core/includes/*/*.php"),glob("$C/themes/flatsome-child/*.php"));
  foreach ($files as $f){ $s=file_get_contents($f); $k=str_replace($C,'',$f); $h=array();
    foreach (array('feedback_url','feedback','magic_login','magic-login','augintinis','refill_due','S323','kalibr','ps_feedback','pet_feedback') as $needle){ if (stripos($s,$needle)!==false){ preg_match_all('/[^\n]{0,100}'.preg_quote($needle,'/').'[^\n]{0,140}/i',$s,$m); $h[$needle]=array_slice(array_values(array_unique($m[0])),0,4);} }
    if ($h && (isset($h['feedback_url'])||isset($h['augintinis'])||isset($h['S323'])||isset($h['kalibr'])||isset($h['magic_login'])||isset($h['magic-login']))) $o['failai'][$k]=$h; }
  // snippet'ai su augintinis/feedback (aktyvūs)
  $o['snippets']=$wpdb->get_results("SELECT id,name,active,LENGTH(code) l FROM {$p}snippets WHERE active=1 AND (code LIKE '%augintinis%' OR code LIKE '%feedback%' OR code LIKE '%magic%') LIMIT 15",ARRAY_A);
  // rewrite taisyklės su augintinis
  $rules=(array)get_option('rewrite_rules'); foreach ($rules as $rk=>$rv) if (stripos($rk,'augintin')!==false||stripos($rv,'augintin')!==false) $o['rewrite'][$rk]=$rv;
  $o['puslapis_34789']=array('url'=>get_permalink(34789),'turinys'=>mb_substr(get_post_field('post_content',34789),0,400));
  // refill tracking artimiausi
  $o['refill_artimiausi']=$wpdb->get_results("SELECT id,user_id,product_id,status,predicted_empty_date,last_order_id,confidence FROM {$p}ps_refill_tracking WHERE status IN ('active','pending','tracking') OR predicted_empty_date>=CURDATE() ORDER BY predicted_empty_date LIMIT 6",ARRAY_A);
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
