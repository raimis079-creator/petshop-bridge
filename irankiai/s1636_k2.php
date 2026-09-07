<?php
/** TEMP PS S1636 run k2 — READ-ONLY: titulinio post_content (kategoriju blokas), post_modified, revizijos (kas/kada). */
add_action('init', function(){
  if (!isset($_GET['ps_s1636k2'])) return;
  $o=array('v'=>'S1636 k2'); global $wpdb; $p=$wpdb->prefix;
  $J=function($o){ header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit; };
  try{
  $fid=(int)get_option('page_on_front'); $o['front_id']=$fid;
  $pg=get_post($fid); $o['modified']=$pg->post_modified; $o['status']=$pg->post_status;
  $c=$pg->post_content; $pos=mb_strpos($c,'Pagrindin');
  $o['blokas']=$pos!==false?mb_substr($c,$pos,1600):'NERASTA (pos=false); pradzia: '.mb_substr($c,0,300);
  $rv=$wpdb->get_results($wpdb->prepare("SELECT ID,post_date,post_author FROM {$p}posts WHERE post_parent=%d AND post_type='revision' ORDER BY post_date DESC LIMIT 6",$fid),OBJECT);
  foreach($rv as $r){ $u=get_userdata((int)$r->post_author); $o['revizijos'][]=$r->post_date.' | '.($u?$u->user_login:'?').' | rev '.$r->ID; }
  // paskutine revizija su emoji? patikrinam ar naujausioj revizijoj yra U+1F436 (šuo)
  if($rv){ $rc=get_post((int)$rv[0]->ID)->post_content; $o['rev0_emoji_suo']=(int)(mb_strpos($rc,"\u{1F436}")!==false); }
  $o['dabar_emoji_suo']=(int)(mb_strpos($c,"\u{1F436}")!==false);
  $J($o);
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage(); $J($o); }
},99);
