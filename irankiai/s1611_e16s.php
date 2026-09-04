<?php
/** TEMP PS S1611 run e16s — SMTP relay isopas.serveriai.lt IP + DNSBL (per jį išėjo S1608 laiškai) */
add_action('init', function(){
  if (!isset($_GET['ps_e16s'])) return;
  $o=array('v'=>'run e16s'); global $wpdb; $p=$wpdb->prefix;
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $ips=array(); foreach((array)@dns_get_record('isopas.serveriai.lt',DNS_A) as $r){ $ips[]=$r['ip']; } $o['isopas_ips']=$ips;
  foreach($ips as $x){ $rev=implode('.',array_reverse(explode('.',$x))); foreach(array('zen.spamhaus.org','bl.spamcop.net','b.barracudacentral.org','dnsbl.sorbs.net','hostkarma.junkemailfilter.com','spam.dnsbl.sorbs.net','dnsbl-1.uceprotect.net','psbl.surriel.com') as $bl){ $h=$rev.'.'.$bl; $a=gethostbyname($h); $o['dnsbl'][$x][$bl]=($a===$h)?'švarus':$a; } }
  $o['ptr']=array_map('gethostbyaddr',$ips);
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
