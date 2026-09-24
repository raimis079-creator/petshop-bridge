<?php
/** Plugin Name: TEMP PS S1716g functions.php krepselio zinute pagal tarifus (1 patch / 2 patikra / 9 atstatyti) */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1716g'])) return;
  $f=$_GET['ps_s1716g']; @set_time_limit(170); $r=['v'=>'S1716g','faze'=>$f];
  $fn=get_stylesheet_directory().'/functions.php'; $bak=WP_CONTENT_DIR.'/uploads/ps-backups/functions.php.bak_s1716';
  try{
    if($f==='1'){
      $s=file_get_contents($fn); if(md5($s)!=='0aa0dac67df22d13b421b963d53c5707') throw new Exception('md5 kitas: '.md5($s));
      $old=base64_decode('ICAgIGlmICggJHRvdGFsX3dlaWdodCA+IDMwICkgewogICAgICAgICRoYXNfY291cmllcl9vbmx5ID0gdHJ1ZTsKICAgIH0KCiAgICBpZiAoICRoYXNfY291cmllcl9vbmx5ICkgewogICAgICAgIGVjaG8gJzx0cj48dGQgY29sc3Bhbj0iMiIgc3R5bGU9InBhZGRpbmc6MCAwIDEycHg7Ij4nOwo='); $new=base64_decode('ICAgIGlmICggJHRvdGFsX3dlaWdodCA+IDMwICkgewogICAgICAgICRoYXNfY291cmllcl9vbmx5ID0gdHJ1ZTsKICAgIH0KICAgIC8qIFMxNzE2ICgyMDI2LTA5LTI0KTogdGlrcm9qaSB0aWVzYSDigJQgYXIgamF1IGFwc2thacSNaXVvdHVvc2UgcHJpc3RhdHltbyB0YXJpZnVvc2UgeXJhIHBhxaF0b21hdGFzLgogICAgICAgVmVuaXBhayBwbHVnaW5hcyBwYcWhdG9tYXTEhSBpxaFtZXRhIGlyIGTEl2wgbWF0bWVuxbMgKHB2ei4gWkIgbWFpxaFhcyA4MCBjbSksIGtvIHZhcm5lbMSXL3N2b3JpcyBuZW1hdG8sCiAgICAgICBvIGtyZXDFoWVsaXMgxb5hZMSXZGF2byDigJ5uZW1va2FtxIUgcHJpc3RhdHltxIUgxK8gcGHFoXRvbWF0xIXigJwsIGt1cmlvIGthc29qZSBuZWLFq2Rhdm8uICovCiAgICBpZiAoICEgJGhhc19jb3VyaWVyX29ubHkgJiYgZnVuY3Rpb25fZXhpc3RzKCAnV0MnICkgJiYgV0MoKS0+c2hpcHBpbmcoKSApIHsKICAgICAgICAkcHNfcGFrZXRhaSA9IFdDKCktPnNoaXBwaW5nKCktPmdldF9wYWNrYWdlcygpOwogICAgICAgIGlmICggISBlbXB0eSggJHBzX3Bha2V0YWkgKSApIHsKICAgICAgICAgICAgJHBzX3lyYV9wYXN0b21hdGFzID0gZmFsc2U7CiAgICAgICAgICAgIGZvcmVhY2ggKCAkcHNfcGFrZXRhaSBhcyAkcHNfcGsgKSB7CiAgICAgICAgICAgICAgICBmb3JlYWNoICggKGFycmF5KSAoICRwc19wa1sncmF0ZXMnXSA/PyBhcnJheSgpICkgYXMgJHBzX3JhdGUgKSB7CiAgICAgICAgICAgICAgICAgICAgJHBzX21pZCA9IChzdHJpbmcpICRwc19yYXRlLT5nZXRfbWV0aG9kX2lkKCk7CiAgICAgICAgICAgICAgICAgICAgaWYgKCBzdHJwb3MoICRwc19taWQsICdwaWNrdXAnICkgIT09IGZhbHNlIHx8IHN0cnBvcyggJHBzX21pZCwgJ3Rlcm1pbmFsJyApICE9PSBmYWxzZSApIHsgJHBzX3lyYV9wYXN0b21hdGFzID0gdHJ1ZTsgYnJlYWsgMjsgfQogICAgICAgICAgICAgICAgfQogICAgICAgICAgICB9CiAgICAgICAgICAgIGlmICggISAkcHNfeXJhX3Bhc3RvbWF0YXMgKSB7ICRoYXNfY291cmllcl9vbmx5ID0gdHJ1ZTsgfQogICAgICAgIH0KICAgIH0KCiAgICBpZiAoICRoYXNfY291cmllcl9vbmx5ICkgewogICAgICAgIGVjaG8gJzx0cj48dGQgY29sc3Bhbj0iMiIgc3R5bGU9InBhZGRpbmc6MCAwIDEycHg7Ij4nOwo='); if(substr_count($s,$old)!==1) throw new Exception('inkaras rastas '.substr_count($s,$old).' k.');
      $n=str_replace($old,$new,$s); $tok=@token_get_all($n,TOKEN_PARSE); if(!$tok) throw new Exception('token');
      if(!file_exists($bak)) copy($fn,$bak); $r['bak']=[$bak,md5_file($bak)]; file_put_contents($fn,$n); $r['nauja_md5']=md5_file($fn);
      $h=wp_remote_get(home_url('/?nc='.mt_rand()),['timeout'=>40,'sslverify'=>false]); $r['heartbeat']=wp_remote_retrieve_response_code($h); if($r['heartbeat']>=500||$r['heartbeat']==0){ copy($bak,$fn); $r['ROLLBACK']=1; }
      $h=wp_remote_get(home_url('/krepselis/?nc='.mt_rand()),['timeout'=>40,'sslverify'=>false]); $r['krepselis']=wp_remote_retrieve_response_code($h);
    }
    if($f==='2'){ $r['md5']=md5_file($fn); $r['yra']=strpos(file_get_contents($fn),'ps_yra_pastomatas')!==false; $r['php_err_tail']=array_slice(file(dirname(rtrim(ABSPATH,'/')).'/logs/php_error.log')?:[],-2); }
    if($f==='9'){ copy($bak,$fn); $r['atstatyta']=md5_file($fn); }
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  wp_send_json($r);
}, 1);
