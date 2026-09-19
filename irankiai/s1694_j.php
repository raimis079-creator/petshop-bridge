<?php
/** TEMP PS S1694 j — Petshop_Refill_Feedback: hook'ai, URL formavimas, puslapio turinys; reali nuoroda refill #55 ir jos GET kaip svečias. Read-only (token'as sukuriamas, bet feedback NEsiunčiamas). */
add_action('init', function(){
  if (!isset($_GET['ps_s1694j'])) return; $o=array(); $C=WP_CONTENT_DIR;
  $f="$C/plugins/petshop-core/includes/class-refill-feedback.php"; $s=file_get_contents($f); $o['md5']=md5($s); $o['eil']=substr_count($s,"\n");
  preg_match_all('/[^\n]{0,120}(add_filter|add_action|register_rest_route|function [a-z_]+\(|_url|home_url|PATH|purpose|ps_refill|\$_GET\[|\$_POST\[)[^\n]{0,160}/i',$s,$m); $o['struktura']=array_slice(array_values(array_unique($m[0])),0,60);
  // puslapio tekstai
  preg_match_all('/(?:<h1|<h2|<p|<button|<a )[^\n]{0,220}/i',$s,$m2); $o['html_eil']=array_slice(array_values(array_unique($m2[0])),0,25);
  // sugeneruoti realią nuorodą
  $r=new ReflectionClass('Petshop_Refill_Feedback'); $o['metodai']=array_map(function($mm){return $mm->getName().($mm->isStatic()?' (static)':'');},$r->getMethods());
  $url=null; foreach (array('url','feedback_url','build_url','link','nuoroda') as $mn){ if ($r->hasMethod($mn)){ $mt=$r->getMethod($mn); $mt->setAccessible(true); try { $url=$mt->invoke(null,55,5792,21329,'2026-09-23'); } catch (Throwable $e){ $o['url_err'][$mn]=$e->getMessage(); } if ($url) { $o['url_metodas']=$mn; break; } } }
  $o['url']=$url;
  if ($url && is_string($url)){ $rr=wp_remote_get($url,array('timeout'=>20,'redirection'=>2)); if (is_wp_error($rr)) $o['get_err']=$rr->get_error_message(); else { $b=wp_remote_retrieve_body($rr); $o['get_kodas']=wp_remote_retrieve_response_code($rr); preg_match('/<title>(.*?)<\/title>/si',$b,$mt); $o['get_title']=$mt[1]??null; $t=preg_replace('/\s+/',' ',wp_strip_all_tags(preg_replace('#<(script|style)[^>]*>.*?</\1>#si','',$b))); $o['get_tekstas']=mb_substr($t,0,1200); preg_match_all('/<(?:button|input|form|a )[^>]{0,220}>/i',$b,$mf); $o['get_formos']=array_slice($mf[0],0,20); } }
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
