<?php
/** TEMP PS S1694 c — „Keisti priminimą" nuoroda refill laiške: kur veda (feedback_url), kas ją generuoja, ką rodo. Read-only. */
add_action('init', function(){
  if (!isset($_GET['ps_s1694c'])) return; global $wpdb; $o=array(); $p=$wpdb->prefix;
  $tpl=WP_CONTENT_DIR.'/mu-plugins/ps-sablonai/refill-pakartoti.php'; $src=file_exists($tpl)?file_get_contents($tpl):'';
  preg_match_all('/.{0,160}(feedback_url|Keisti priminim|keisti_url|patikslinti).{0,200}/u',$src,$m); $o['sablonas']=array_slice($m[0],0,6);
  // kas generuoja feedback_url — mu-plugins ir core
  $hits=array(); foreach (glob(WP_CONTENT_DIR.'/mu-plugins/*.php') as $f){ $s=file_get_contents($f); if (strpos($s,'feedback_url')!==false){ preg_match_all('/.{0,120}feedback_url.{0,160}/',$s,$mm); $hits[basename($f)]=array_slice($mm[0],0,4);} }
  foreach (glob(WP_CONTENT_DIR.'/mu-plugins/petshop-core/includes/*.php') as $f){ $s=file_get_contents($f); if (strpos($s,'feedback_url')!==false){ preg_match_all('/.{0,120}feedback_url.{0,160}/',$s,$mm); $hits['core/'.basename($f)]=array_slice($mm[0],0,4);} }
  $o['feedback_url_kode']=$hits;
  // snippet'ai
  $o['snippets']=$wpdb->get_results("SELECT id,name,active FROM {$p}snippets WHERE code LIKE '%feedback_url%' OR code LIKE '%ps_feedback%' OR name LIKE '%S323%' OR name LIKE '%kalibr%' LIMIT 10",ARRAY_A);
  // paskutinis išsiųstas / suplanuotas refill_due job payload
  $o['jobs']=$wpdb->get_results("SELECT id,flow_key,status,scheduled_at,sent_at,LEFT(payload_json,900) payload FROM {$p}ps_email_jobs WHERE flow_key='refill_due' ORDER BY id DESC LIMIT 3",ARRAY_A);
  // rasti kelią iš payload ir gauti puslapį kaip svečias
  $url=null; foreach ((array)$o['jobs'] as $j){ $pl=json_decode($j['payload']??'',true); if (is_array($pl)){ array_walk_recursive($pl,function($v,$k)use(&$url){ if(!$url && is_string($v) && stripos($v,'http')===0 && (stripos($v,'feedback')!==false||stripos($v,'primin')!==false||stripos($v,'kalibr')!==false)) $url=$v; }); } if($url) break; }
  if (!$url && $o['sablonas']){ if (preg_match('/https?:\/\/[^\s\'"]+/',implode(' ',$o['sablonas']),$mu)) $url=$mu[0]; }
  $o['url']=$url;
  if ($url){ $r=wp_remote_get($url,array('timeout'=>20,'redirection'=>3)); if (is_wp_error($r)) $o['puslapis_err']=$r->get_error_message(); else { $b=wp_remote_retrieve_body($r); $o['puslapis_kodas']=wp_remote_retrieve_response_code($r); $o['puslapis_url_galutinis']=$r['http_response']->get_response_object()->url??null; $t=wp_strip_all_tags(preg_replace('#<(script|style)[^>]*>.*?</\1>#si','',$b)); $t=preg_replace('/\s+/',' ',$t); $pos=stripos($t,'primin'); $o['puslapis_tekstas']=mb_substr($t,max(0,($pos?:0)-300),1500); preg_match('/<title>(.*?)<\/title>/si',$b,$mt); $o['title']=$mt[1]??null; preg_match_all('/<(?:input|select|button)[^>]{0,200}>/i',$b,$mf); $o['formos_laukai']=array_slice($mf[0],0,25); } }
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
