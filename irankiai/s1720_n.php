<?php
/** Plugin Name: TEMP PS S1720n — prekes-tvarka deploy: 1 = rašyti (kodas įdėtas) + heartbeat, 2 = patikra (tvarka HTML), 9 = pašalinti */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1720n'])) return; $f=$_GET['ps_s1720n']; $r=['v'=>'S1720n','faze'=>$f];
  $pl=WPMU_PLUGIN_DIR.'/petshop-prekes-tvarka.php'; $ar=dirname(ABSPATH).'/ps-archyvas';
  $hb=function(){ $rs=wp_remote_get(home_url('/?ps_hb=1'),['timeout'=>25,'sslverify'=>false,'user-agent'=>'Mozilla/5.0 ps-s1720']); return is_wp_error($rs)?'ERR':wp_remote_retrieve_response_code($rs); };
  try{
  if($f==='1'){
    $kodas=base64_decode('PD9waHAKLyoqCiAqIFBsdWdpbiBOYW1lOiBQZXRzaG9wIHByZWvEl3MgcHVzbGFwaW8gdHZhcmthIHYxLjAgKFMxNzIwLCBwbGFuYXMgMi4xNykKICogRGVzY3JpcHRpb246IOKAnkRhxb5uYWkgcGVya2FtYSBrYXJ0deKAnCAoUGV0c2hvcF9GQlQ6OnJlbmRlcl93aWRnZXQsIHdvb2NvbW1lcmNlX2FmdGVyX2FkZF90b19jYXJ0X2Zvcm0gcHJpbyAyMCkgcGVya2VsaWFtYXMgUE8gc2thacSNaXVva2zEl3MKICogICAoUGV0c2hvcF9Qcm9kdWN0X0NhbGM6OndpZGdldCwgd29vY29tbWVyY2Vfc2luZ2xlX3Byb2R1Y3Rfc3VtbWFyeSBwcmlvIDMxKSDihpIgc3VtbWFyeSBwcmlvIDMyLiBSYWltaW8gc3ByZW5kaW1hcyAyMDI2LTA5LTI1IChTMTcxMiByYWRpbnlzICM5KS4KICogICBJxaFqdW5ndGk6IG9wY2lqYSBwc19wcmVrZXNfdHZhcmthX2lzanVuZ3RhPTEgKGdyxK/FvnRhIHNlbmEgdHZhcmthKS4KICogVmVyc2lvbjogMS4wCiAqLwppZiAoICEgZGVmaW5lZCggJ0FCU1BBVEgnICkgKSB7IGV4aXQ7IH0KCmFkZF9hY3Rpb24oICd3cCcsIGZ1bmN0aW9uICgpIHsKCWlmICggaXNfYWRtaW4oKSB8fCBnZXRfb3B0aW9uKCAncHNfcHJla2VzX3R2YXJrYV9pc2p1bmd0YScgKSApIHsgcmV0dXJuOyB9CglnbG9iYWwgJHdwX2ZpbHRlcjsKCSRoID0gJ3dvb2NvbW1lcmNlX2FmdGVyX2FkZF90b19jYXJ0X2Zvcm0nOwoJaWYgKCBlbXB0eSggJHdwX2ZpbHRlclsgJGggXSApIHx8IGVtcHR5KCAkd3BfZmlsdGVyWyAkaCBdLT5jYWxsYmFja3NbMjBdICkgKSB7IHJldHVybjsgfQoJZm9yZWFjaCAoICR3cF9maWx0ZXJbICRoIF0tPmNhbGxiYWNrc1syMF0gYXMgJGNiICkgewoJCSRmbiA9ICRjYlsnZnVuY3Rpb24nXTsKCQlpZiAoICEgaXNfYXJyYXkoICRmbiApIHx8IGNvdW50KCAkZm4gKSAhPT0gMiApIHsgY29udGludWU7IH0KCQkka2wgPSBpc19vYmplY3QoICRmblswXSApID8gZ2V0X2NsYXNzKCAkZm5bMF0gKSA6IChzdHJpbmcpICRmblswXTsKCQlpZiAoICdQZXRzaG9wX0ZCVCcgIT09ICRrbCB8fCAncmVuZGVyX3dpZGdldCcgIT09ICRmblsxXSApIHsgY29udGludWU7IH0KCQlyZW1vdmVfYWN0aW9uKCAkaCwgJGZuLCAyMCApOwoJCWFkZF9hY3Rpb24oICd3b29jb21tZXJjZV9zaW5nbGVfcHJvZHVjdF9zdW1tYXJ5JywgJGZuLCAzMiApOwoJCXJldHVybjsKCX0KfSwgMjAgKTsK'); if(strpos($kodas,'Petshop_FBT')===false) throw new Exception('blogas turinys');
    try{ token_get_all($kodas,TOKEN_PARSE); }catch(Throwable $e){ throw new Exception('PARSE '.$e->getMessage()); }
    file_put_contents($pl,$kodas); $r['md5']=md5_file($pl); $r['heartbeat']=$hb(); if($r['heartbeat']!==200){ @unlink($pl); $r['ATSTATYTA']=1; }
    if(function_exists('wp_cache_clear_cache')){ wp_cache_clear_cache(); $r['super_cache']='išvalytas'; }
  }
  if($f==='2'){
    foreach([18560,35316] as $pid){ $rs=wp_remote_get(get_permalink($pid).'?ps_nocache='.time(),['timeout'=>40,'sslverify'=>false,'user-agent'=>'Mozilla/5.0 ps-s1720']); $b=wp_remote_retrieve_body($rs);
      $r['prekes'][$pid]=['http'=>wp_remote_retrieve_response_code($rs),'add_to_cart'=>strpos($b,'single_add_to_cart_button'),'calc'=>strpos($b,'class="ps-calc"'),'fbt'=>strpos($b,'petshop-fbt__heading'),'atsargos'=>strpos($b,'ps-atsargu'),'meta'=>strpos($b,'product_meta'),'fbt_kartu'=>substr_count($b,'petshop-fbt__heading')]; }
    $r['heartbeat']=$hb(); $r['php_error_tail']=substr(file_get_contents(dirname(ABSPATH).'/logs/php_error.log'),-400);
  }
  if($f==='9'){ if(file_exists($pl)) rename($pl,$ar.'/petshop-prekes-tvarka.php.off_s1720'); if(function_exists('wp_cache_clear_cache')) wp_cache_clear_cache(); $r['heartbeat']=$hb(); }
  }catch(Throwable $e){ $r['ERR']=$e->getMessage(); }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($r,JSON_UNESCAPED_UNICODE); exit;
});
