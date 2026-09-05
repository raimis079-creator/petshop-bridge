<?php
/** TEMP PS S1617 run r11 (recon, tik skaitymas): kur Pragma eksporto kodas — cron `petshop_pragma_monthly_export` callback'ų failai (Reflection), snippet'ai su 'pragma', plugins/mu-plugins/tema failai su 'pragma', opcijos `*pragma*`. */
add_action('init', function(){
  if (!isset($_GET['ps_r11'])) return;
  $o=array('v'=>'S1617 r11'); global $wpdb,$wp_filter; $p=$wpdb->prefix; set_time_limit(120);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $cb=array(); if(isset($wp_filter['petshop_pragma_monthly_export'])){ foreach($wp_filter['petshop_pragma_monthly_export']->callbacks as $pr=>$fns){ foreach($fns as $fn){ $f=$fn['function']; try{ if(is_string($f)&&function_exists($f)){ $rf=new ReflectionFunction($f); $cb[]=array($pr,$f,str_replace(ABSPATH,'',$rf->getFileName()),$rf->getStartLine()); } elseif(is_array($f)){ $rm=new ReflectionMethod($f[0],$f[1]); $cb[]=array($pr,(is_object($f[0])?get_class($f[0]):$f[0]).'::'.$f[1],str_replace(ABSPATH,'',$rm->getFileName()),$rm->getStartLine()); } elseif($f instanceof Closure){ $rf=new ReflectionFunction($f); $cb[]=array($pr,'closure',str_replace(ABSPATH,'',$rf->getFileName()),$rf->getStartLine()); } }catch(Throwable $e){ $cb[]=array($pr,'?',$e->getMessage()); } } } } $o['cron_cb']=$cb;
  $o['cron_next']=wp_next_scheduled('petshop_pragma_monthly_export'); $o['cron_next_d']=$o['cron_next']?wp_date('Y-m-d H:i',$o['cron_next']):null;
  $o['snippets']=$wpdb->get_results("SELECT id,name,active,scope,LENGTH(code) len FROM {$p}snippets WHERE code LIKE '%pragma%' OR name LIKE '%ragma%'",ARRAY_A);
  $hits=array(); foreach(array(WP_PLUGIN_DIR,WPMU_PLUGIN_DIR,get_stylesheet_directory()) as $dir){ foreach(new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir,FilesystemIterator::SKIP_DOTS)) as $f){ if(!$f->isFile()||substr($f->getFilename(),-4)!=='.php') continue; $path=$f->getPathname(); if(strpos($path,'/vendor/')!==false||strpos($path,'/node_modules/')!==false) continue; if(stripos($f->getFilename(),'pragma')!==false){ $hits[]=str_replace(ABSPATH,'',$path).' ('.$f->getSize().')'; continue; } if($f->getSize()<400000&&stripos((string)file_get_contents($path),'petshop_pragma')!==false){ $hits[]=str_replace(ABSPATH,'',$path).' ('.$f->getSize().') [tekste]'; } if(count($hits)>20) break; } }
  $o['failai']=$hits;
  $o['opcijos']=$wpdb->get_results("SELECT option_name,LEFT(option_value,150) v FROM {$p}options WHERE option_name LIKE '%pragma%'",ARRAY_A);
  $o['active_plugins']=array_values(array_filter((array)get_option('active_plugins'),function($x){ return stripos($x,'pragma')!==false||stripos($x,'petshop')!==false; }));
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
},99);
