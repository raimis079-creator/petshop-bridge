<?php
/** TEMP PS S1686 my — RECON (read-only): adapter upsert_contact/reaktyvavimo logika ir fields formatas; magic login viešos statinės funkcijos; Petshop_Relaunch metodai. */
add_action('init', function(){
  if (!isset($_GET['ps_s1686my'])) return; $o=array('v'=>'S1686 my');
  $r=new ReflectionClass('Petshop_Sender_Adapter'); $L=file($r->getFileName());
  $m=$r->getMethod('upsert_contact'); for($i=$m->getStartLine()-1;$i<$m->getEndLine();$i++){ $l=trim($L[$i]); if($l!==''&&strpos($l,'//')!==0&&strpos($l,'*')!==0) $o['upsert'][]=($i+1).': '.mb_substr($l,0,170); }
  $m=$r->getMethod('get_contact_field'); for($i=$m->getStartLine()-1;$i<$m->getEndLine();$i++){ $l=trim($L[$i]); if(preg_match('/request|fields|columns|title/',$l)) $o['getfield'][]=($i+1).': '.mb_substr($l,0,170); }
  $core=WP_CONTENT_DIR.'/plugins/petshop-core'; foreach(glob($core.'/includes/class-magic-login.php') as $f){ foreach(file($f) as $i=>$l) if(preg_match('/function |home_url|add_query_arg|const /',$l)) $o['magic'][]=($i+1).': '.trim(mb_substr($l,0,150)); }
  if(class_exists('Petshop_Relaunch')){ foreach((new ReflectionClass('Petshop_Relaunch'))->getMethods() as $mm){ $o['relaunch_met'][]=($mm->isStatic()?'s ':'').$mm->getName(); } }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT); exit;
});
