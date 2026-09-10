<?php
/** TEMP PS S1668 n — DEPLOY petshop-legacy-301.php v2.0→v2.1 (query string išsaugojimas) + TEST (atskira užklausa). */
add_action('init', function(){
  if (!isset($_GET['ps_s1668n'])) return;
  $f=$_GET['ps_s1668n']; $o=array('v'=>'S1668 n','faze'=>$f);
  $T=WPMU_PLUGIN_DIR.'/petshop-legacy-301.php'; $BAKD=WP_CONTENT_DIR.'/uploads/ps-backups'; $BAK=$BAKD.'/petshop-legacy-301.php.bak_s1668';
  $OLD='1516e611f0822f3c5b65927bff426e30'; $NEW='46c8948be9cf2c7fb01007ad3fe340e1';
  try{
  if($f==='D'){
    $cur=md5_file($T); $o['pries']=$cur;
    if($cur===$NEW){ $o['rez']='JAU v2.1'; wp_send_json($o); }
    if($cur!==$OLD){ $o['rez']='STOP: gyvas md5 nesutampa'; wp_send_json($o); }
    $src=base64_decode('PD9waHAKLyoqCiAqIFBldHNob3AgTGVnYWN5IDMwMSB2Mi4xIChTNDM2LCBTMTY2OCkg4oCUIHNlbm9zIHBsYXRmb3Jtb3MgYWRyZXPFsyBudWtyZWlwaW1hcy4KICoKICogdjIuMSAoUzE2NjgpOiAzMDEgUEVSS0VMSUEgdcW+a2xhdXNvcyBlaWx1dMSZIChnY2xpZCwgZ2FkX3NvdXJjZSwgdXRtXyosIF9nbCkuCiAqICAgdjIuMCBqxIUgbnVtZXNkYXZvIOKGkiBQTWF4L01lcmNoYW50IHBhc3BhdWRpbWFpIHByYXJhZGF2byBnY2xpZCwgQWRzIG5lbWF0xJcga29udmVyc2lqxbMuCiAqCiAqIFZpZW5hcyBtZWNoYW5pem1hcyB2aXNpZW1zIHNlbmllbXMgYWRyZXNhbXMuIMW9ZW3El2xhcGlzIGxhaWtvbWFzIEFUU0tJUkFNRQogKiBKU09OIGZhaWxlIGlyIGtyYXVuYW1hcyBUSUsgdGFkYSwga2FpIGFkcmVzYXMgcmVhbGlhaSA0MDQg4oCUIGthZCBraWVrdmllbmEKICogdcW+a2xhdXNhIG5lcGFyc2ludMWzIDEzNyBLQiBQSFAgbWFzeXZvLgogKgogKiDFoEXFoEkgU0xVT0tTTklBSSAodmlzaSDErsWgQUxEWVRJIGnFoSBHU0MgMiA0NDUgVVJMIC8gMTkgNzM1IGNsaWNrcyAvIDE2IG3El24uKToKICogICAxLiBrYXRlZ29yaWpvcyBiZSAva2F0ZWdvcmlqYS8gcHJpZcWhZMSXbGlvICAgICAgICAgIDM0IMK3IDEgNTk2CiAqICAgMi4gc2VuaSBVUkwgc3UgSUQgdW9kZWdvbWlzICAgICAgICAgICAgICAgICAgICAgICAgNDIgwrcgICA2NjYKICogICAzLiBwZXJ2YWRpbnRpIHNsdWcgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAxMCDCtyAgICAzMAogKiAgIDQuIHByb2R1a3RhaSBpxaEgxaFha25pZXMg4oaSIC9wcm9kdWN0LyAgICAgICAgICAgICAgICA4MDUgwrcgMiA5NjgKICogICA1LiBsaWt1c2lvcyBrYXRlZ29yaWpvcyAgICAgICAgICAgICAgICAgICAgICAgICAgICAyNCDCtyAgIDEwMgogKiAgIDYuIGJyZW5kYWkg4oaSIC9nYW1pbnRvamFzLyAgICAgICAgICAgICAgICAgICAgICAgICAgMjIgwrcgICA1MDEKICoKICogS1JJVElOSVMgNiBzbHVva3NuaXM6IGJlIGpvIFdvcmRQcmVzcyByZWRpcmVjdF9jYW5vbmljYWwgL2V4Y2x1c2lvbgogKiAoMjE4IGNsaWNrcykgU1DElkpJTVUgMzAxLWluYSDEryBBVFNJVElLVElOxK4gU0tVLiBUxb0gdjEuNTYgdGFpIMSvc3DEl2pvLCBpcgogKiAyMDI2LTA4LTA0IHRhaSB2aXMgZGFyIHZ5a28uCiAqCiAqIFZBUlRBSToKICogICAtIFRJSyB0aWtzbGlhbSBhZHJlc3VpIGnFoSDFvmVtxJdsYXBpbywgVElLIGthaSBqaXMgREFCQVIgNDA0CiAqICAgLSB2aWVuYXMgMzAxIHRpZXNpYWkgxK8gZ2FsdXRpbsSvIDIwMCwgam9racWzIGdyYW5kaW5pxbMKICogICAtIEpPS0lPIOKAnnBhbmHFoWlhdXNpbyBVUkwiIHNwxJdqaW1vCiAqICAgLSByZWRpcmVjdF9jYW5vbmljYWwgacWhanVuZ2lhbWFzIFRJSyBtxatzxbMgYXRwYcW+aW50YW0gYWRyZXN1aQogKiAgIC0gWC1SZWRpcmVjdC1CeTogUGV0c2hvcC1MZWdhY3ktQ2F0ZWdvcnkKICoKICogxK7FoEFMRFlUQSwgTkUgRElOQU1JTklTLiBOYXVqb21zIGthdGVnb3Jpam9tcy9wcmVrxJdtcyB0YWlzeWtsxJdzIE5FS1VSSUFNT1MuCiAqIE5hdWphcyDEr3JhxaFhcyDigJQgdGlrIHJhbmtpbml1IGLFq2R1IHN1IEdTQyBwYWdyaW5kaW11LgogKi8KaWYgKCAhIGRlZmluZWQoICdBQlNQQVRIJyApICkgeyBleGl0OyB9Cgpjb25zdCBQU19MRUdBQ1lfMzAxX01BUCA9IF9fRElSX18gLiAnL3BldHNob3AtbGVnYWN5LTMwMS1tYXAuanNvbic7CgpmdW5jdGlvbiBwZXRzaG9wX2xlZ2FjeV8zMDFfbWFwKCkgewoJc3RhdGljICRtID0gbnVsbDsKCWlmICggbnVsbCAhPT0gJG0gKSB7IHJldHVybiAkbTsgfQoJJHJhdyA9IEBmaWxlX2dldF9jb250ZW50cyggUFNfTEVHQUNZXzMwMV9NQVAgKTsKCSRtICAgPSAoIGZhbHNlID09PSAkcmF3ICkgPyBhcnJheSgpIDogKGFycmF5KSBqc29uX2RlY29kZSggJHJhdywgdHJ1ZSApOwoJcmV0dXJuICRtOwp9CgpmdW5jdGlvbiBwZXRzaG9wX2xlZ2FjeV8zMDFfcGF0aCgpIHsKCSRwID0gKHN0cmluZykgcGFyc2VfdXJsKCAoc3RyaW5nKSAoICRfU0VSVkVSWydSRVFVRVNUX1VSSSddID8/ICcnICksIFBIUF9VUkxfUEFUSCApOwoJcmV0dXJuIHN0cnRvbG93ZXIoIHRyaW0oIHJhd3VybGRlY29kZSggJHAgKSwgJy8nICkgKTsKfQoKYWRkX2FjdGlvbiggJ3RlbXBsYXRlX3JlZGlyZWN0JywgZnVuY3Rpb24gKCkgewoJaWYgKCBpc19hZG1pbigpIHx8IHdwX2RvaW5nX2FqYXgoKSB8fCBpc19yb2JvdHMoKSB8fCBpc19mZWVkKCkgKSB7IHJldHVybjsgfQoJaWYgKCAhIGlzXzQwNCgpICkgeyByZXR1cm47IH0gICAgICAgICAgLy8gZXNhbWkgcHVzbGFwaWFpIE5FTElFxIxJQU1JCgoJJGtlbGlhcyA9IHBldHNob3BfbGVnYWN5XzMwMV9wYXRoKCk7CglpZiAoICcnID09PSAka2VsaWFzICkgeyByZXR1cm47IH0KCgkkbWFwID0gcGV0c2hvcF9sZWdhY3lfMzAxX21hcCgpOwoJaWYgKCAhIGlzc2V0KCAkbWFwWyAka2VsaWFzIF0gKSApIHsgcmV0dXJuOyB9ICAgLy8gam9raW8gc3DEl2ppbW8KCgkkdCA9ICRtYXBbICRrZWxpYXMgXTsKCWlmICggMCA9PT0gc3RycG9zKCAkdCwgJ19fVEVSTV9fJyApICkgewoJCSR0ZXJtID0gZ2V0X3Rlcm0oIChpbnQpIHN1YnN0ciggJHQsIDggKSwgJ3Byb2R1Y3RfY2F0JyApOwoJCWlmICggISAkdGVybSB8fCBpc193cF9lcnJvciggJHRlcm0gKSApIHsgcmV0dXJuOyB9CgkJJHVybCA9IGdldF90ZXJtX2xpbmsoICR0ZXJtICk7CgkJaWYgKCBpc193cF9lcnJvciggJHVybCApIHx8ICEgJHVybCApIHsgcmV0dXJuOyB9Cgl9IGVsc2UgewoJCSR1cmwgPSBob21lX3VybCggJHQgKTsKCX0KCgkvLyBBcHNhdWdhIG51byBraWxwb3MKCWlmICggc3RydG9sb3dlciggdHJpbSggKHN0cmluZykgcGFyc2VfdXJsKCAkdXJsLCBQSFBfVVJMX1BBVEggKSwgJy8nICkgKSA9PT0gJGtlbGlhcyApIHsgcmV0dXJuOyB9CgoJLy8gdjIuMTogdcW+a2xhdXNvcyBlaWx1dMSXIGtlbGlhdWphIGthcnR1IChnY2xpZC91dG0vZ2FkX3NvdXJjZSDigJQgQWRzIGF0cmlidWNpamFpKQoJJHFzID0gKHN0cmluZykgcGFyc2VfdXJsKCAoc3RyaW5nKSAoICRfU0VSVkVSWydSRVFVRVNUX1VSSSddID8/ICcnICksIFBIUF9VUkxfUVVFUlkgKTsKCWlmICggJycgIT09ICRxcyApIHsgJHVybCAuPSAoIGZhbHNlID09PSBzdHJwb3MoICR1cmwsICc/JyApID8gJz8nIDogJyYnICkgLiAkcXM7IH0KCglyZW1vdmVfYWN0aW9uKCAndGVtcGxhdGVfcmVkaXJlY3QnLCAncmVkaXJlY3RfY2Fub25pY2FsJyApOwoJd3BfcmVkaXJlY3QoICR1cmwsIDMwMSwgJ1BldHNob3AtTGVnYWN5LUNhdGVnb3J5JyApOwoJZXhpdDsKfSwgMSApOwo=');
    if(md5($src)!==$NEW){ $o['rez']='STOP: payload md5'; wp_send_json($o); }
    try{ token_get_all($src, TOKEN_PARSE); }catch(Throwable $e){ $o['rez']='STOP: TOKEN_PARSE '.$e->getMessage(); wp_send_json($o); }
    if(!is_dir($BAKD)) wp_mkdir_p($BAKD);
    if(!copy($T,$BAK) || md5_file($BAK)!==$OLD){ $o['rez']='STOP: backup nepavyko'; wp_send_json($o); }
    $tmp=$T.'.tmp-s1668'; file_put_contents($tmp,$src);
    if(md5_file($tmp)!==$NEW){ @unlink($tmp); $o['rez']='STOP: tmp md5'; wp_send_json($o); }
    rename($tmp,$T); if(function_exists('opcache_invalidate')) @opcache_invalidate($T,true);
    $o['po']=md5_file($T);
    $r=wp_remote_get(home_url('/?ps_hb=s1668'),array('timeout'=>20)); $c=is_wp_error($r)?0:(int)wp_remote_retrieve_response_code($r);
    $o['ping']=$c;
    if($c===0||$c>=500){ copy($BAK,$T); if(function_exists('opcache_invalidate')) @opcache_invalidate($T,true); $o['rez']='ROLLBACK (ping '.$c.')'; $o['atstatyta']=md5_file($T); }
    else $o['rez']='OK';
  } elseif($f==='T'){
    $o['md5']=md5_file($T); $h=array('User-Agent'=>'Mozilla/5.0 PS-S1668T');
    $map=json_decode(file_get_contents(WPMU_PLUGIN_DIR.'/petshop-legacy-301-map.json'),true); $prod=null;
    foreach($map as $k=>$v){ if(strpos($v,'__TERM__')!==0){ $prod=$k; break; } }
    $cases=array('/katems/maistas-katems?gclid=PSTEST1668&gad_source=1','/sunims/maistas-sunims/?utm_source=google&utm_medium=cpc','/katems/maistas-katems','/'.$prod.'?gclid=PSTEST1668','/exclusion?gclid=X1&_gl=1*14r9wo1*_up*MQ..','/kategorija/katems/maistas-katems/?gclid=PSTEST1668','/','/nesamas-xyz-1668?gclid=1');
    foreach($cases as $u){ $r=wp_remote_get(home_url($u),array('timeout'=>20,'redirection'=>0,'headers'=>$h));
      $o['t'][$u]=is_wp_error($r)?'ERR':wp_remote_retrieve_response_code($r).' → '.(string)wp_remote_retrieve_header($r,'location'); }
  }
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  wp_send_json($o);
});
