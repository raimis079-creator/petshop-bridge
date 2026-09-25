<?php
/** Plugin Name: TEMP PS S1719g — recon prieš saugumo paketą, read-only (l) */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1719g'])) return; $r=['v'=>'S1719g','t'=>date('Y-m-d H:i:s')]; @set_time_limit(120);
  global $wpdb; $p=$wpdb->prefix;
  try{
    $dirs=[WP_CONTENT_DIR.'/mu-plugins',WP_CONTENT_DIR.'/plugins/petshop-core',WP_CONTENT_DIR.'/plugins/petshop-xml',WP_CONTENT_DIR.'/plugins/petshop-feeds',WP_CONTENT_DIR.'/themes/flatsome-child',WP_CONTENT_DIR.'/plugins/wc-venipak-shipping',WP_CONTENT_DIR.'/plugins/woo-lithuaniapost-main'];
    $pat='/[^\n]{0,80}(ps-lipdukai|petshop-vf-cache|vetfarmas_response|wpallimport\/files|baseurl[^\n]{0,20}lipduk)[^\n]{0,80}/';
    foreach($dirs as $d){ if(!is_dir($d)) continue; $it=new RecursiveIteratorIterator(new RecursiveDirectoryIterator($d,FilesystemIterator::SKIP_DOTS)); foreach($it as $fi){ if(!$fi->isFile()||substr($fi->getFilename(),-4)!=='.php') continue; $c=file_get_contents($fi->getPathname()); if(preg_match_all($pat,$c,$m)){ $r['kodas'][str_replace(WP_CONTENT_DIR,'',$fi->getPathname())]=array_slice(array_unique(array_map('trim',$m[0])),0,8); } } }
    $s=$wpdb->get_results("SELECT id,name,code FROM {$p}snippets WHERE active=1",ARRAY_A); foreach($s as $x){ if(preg_match_all($pat,$x['code'],$m)) $r['snippets'][$x['id'].' '.$x['name']]=array_slice(array_unique(array_map('trim',$m[0])),0,5); }
    $up=wp_upload_dir()['basedir']; $r['uploads_htaccess_full']=file_exists($up.'/.htaccess')?file_get_contents($up.'/.htaccess'):null;
    foreach(['ps-lipdukai','ps-lipdukai/lp','wpallimport','wpallimport/files','ps-backups','petshop-legacy','pmax-s1672'] as $d){ $r['sub_ht'][$d]=file_exists($up.'/'.$d.'/.htaccess')?substr(file_get_contents($up.'/'.$d.'/.htaccess'),0,200):null; }
    $r['wpai_files']=array_map(function($x){return [basename($x),round(filesize($x)/1048576,1).'MB',date('m-d',filemtime($x))];},glob($up.'/wpallimport/files/*')?:[]);
    $r['wpai_paths']=$wpdb->get_results("SELECT id,name,LEFT(path,90) path FROM {$p}pmxi_imports",ARRAY_A);
    $r['lipdukai_meta']=$wpdb->get_results("SELECT meta_key,COUNT(*) n,LEFT(MAX(meta_value),90) pvz FROM {$p}wc_orders_meta WHERE meta_key LIKE '%lipduk%' OR meta_key LIKE '%label%' OR meta_key LIKE '%sticker%' GROUP BY meta_key",ARRAY_A);
    $r['trash_kandidatai']=array_map(function($x){return [str_replace(ABSPATH,'',$x),filesize($x),date('m-d',filemtime($x))];},array_merge(glob($up.'/*_result.json')?:[],glob($up.'/lookupdiag.json')?:[],glob($up.'/vetfarmas_response_*.xml')?:[],[ABSPATH.'wp-content/phptest.php',ABSPATH.'index.html.backup.5a6defd0b6c8b4cd418a970086e2c0b4']));
    $u=get_user_by('login','testuotojas'); $r['testuotojas']=$u?['id'=>$u->ID,'posts'=>count_user_posts($u->ID),'orders'=>(int)$wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM {$p}wc_orders WHERE customer_id=%d",$u->ID)),'comments'=>(int)$wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM {$p}comments WHERE user_id=%d",$u->ID))]:null;
    $r['snippet465_hooks']=preg_match_all('/add_(action|filter)\(\s*[\'"]([^\'"]+)/',(string)$wpdb->get_var("SELECT code FROM {$p}snippets WHERE id=465"),$m)?$m[2]:[];
    $r['ps_private_logs']=array_map('basename',glob(WP_CONTENT_DIR.'/petshop-private-logs/*')?:[]); $r['private_logs_kodas']=[]; foreach(glob(WP_CONTENT_DIR.'/plugins/*/*.php')?:[] as $f){ if(strpos(file_get_contents($f),'petshop-private-logs')!==false) $r['private_logs_kodas'][]=str_replace(WP_CONTENT_DIR,'',$f); }
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE|JSON_INVALID_UTF8_SUBSTITUTE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
},1);
