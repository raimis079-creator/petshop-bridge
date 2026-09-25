<?php
/** Plugin Name: TEMP PS S1718m — DKIM testas: wp_mail į mail-tester (1 siųsti, 2 WP Mail SMTP būklė read-only) */
add_action('wp_loaded', function(){
  if(!isset($_GET['ps_s1718m'])) return; $f=$_GET['ps_s1718m']; $r=['v'=>'S1718m','faze'=>$f];
  try{
  if($f==='1'){ $to='test-lmepc2fz8@srv1.mail-tester.com';
    $body="Sveiki,\n\nTai techninis Petshop.lt pašto testas (DKIM/SPF patikra po serveriai.lt DNS pakeitimų 2026-09-25).\n\nPetshop.lt – gyvūnų prekių parduotuvė nuo 2010 m.\nhttps://petshop.lt/\n\nUAB Avesa, uzsakymai@petshop.lt\nJei gavote per klaidą – tiesiog ištrinkite šį laišką.\n";
    $ok=wp_mail($to,'Petshop.lt pašto testas 2026-09-25',$body,['Content-Type: text/plain; charset=UTF-8']);
    $r['wp_mail']=$ok; $r['to']=$to; $r['from_opt']=[get_option('wp_mail_smtp')['mail']['from_email']??null, get_option('wp_mail_smtp')['mail']['mailer']??null];
    $dbg=get_option('wp_mail_smtp_debug'); $r['smtp_debug']=is_array($dbg)?array_slice($dbg,-2):$dbg; }
  if($f==='2'){ $o=get_option('wp_mail_smtp'); $r['mailer']=$o['mail']['mailer']??null; $r['from']=$o['mail']['from_email']??null; $r['host']=$o['smtp']['host']??null; $r['port']=$o['smtp']['port']??null; $r['enc']=$o['smtp']['encryption']??null; }
  }catch(Throwable $e){ $r['FATAL']=$e->getMessage().' @'.$e->getLine(); }
  wp_send_json($r);
},1);
