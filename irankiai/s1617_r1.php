<?php
/** TEMP PS S1617 run r1 — RECON (tik skaitymas) „Pakartotinis užsakymas“: WC „apmokėti užsakymą“ nuoroda ir prisijungimo reikalavimas, customer_invoice laiškas (LT), Paysera callback, snippet #653 / temos AVPN kabliai, variklių kabliai ant naujo/apmokėto užsakymo (virtuali paslaugos prekė), atviri() atranka, virtualios prekės/PVM, magic-login API, testinių #35434/#35436 adresai. */
add_action('init', function(){
  if (!isset($_GET['ps_r1'])) return;
  $o=array('v'=>'S1617 r1'); global $wpdb; $p=$wpdb->prefix; set_time_limit(280);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $J=function($o){ header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit; };
  $grep=function($file,$pat,$max=40,$ctx=0){ if(!is_file($file)) return 'nera:'.basename($file); $L=file($file); $r=array(); foreach($L as $i=>$l){ if(preg_match($pat,$l)){ $s=''; for($k=$i;$k<=$i+$ctx&&$k<count($L);$k++) $s.=trim($L[$k]).' '; $r[]=($i+1).': '.mb_substr($s,0,260); if(count($r)>=$max) break; } } return $r; };
  $fn=function($file,$name,$len=1800){ if(!is_file($file)) return 'nera'; $c=file_get_contents($file); $i=strpos($c,'function '.$name); return $i!==false?substr($c,$i,$len):'nerasta:'.$name; };
  $mu=WPMU_PLUGIN_DIR; $wc=WP_PLUGIN_DIR.'/woocommerce'; $th=get_stylesheet_directory();
  try{
    // 1. WC order-pay: pay_for_order cap, order_pay() prisijungimo reikalavimas, endpoint
    $o['wc_ver']=WC()->version; $o['locale']=get_locale();
    $o['cap_pay_for_order']=$grep($wc.'/includes/wc-user-functions.php','/pay_for_order|get_user_id\(\)/',12,3);
    $f=$wc.'/includes/shortcodes/class-wc-shortcode-checkout.php';
    $o['order_pay_login']=$grep($f,'/order_pay_login|pay_for_order|log in|login|order_key|woocommerce_order_pay/i',30,1);
    $o['order_pay_endpoint']=get_option('woocommerce_checkout_pay_endpoint'); $o['checkout_page']=wc_get_page_id('checkout'); $o['myaccount_page']=wc_get_page_id('myaccount');
    $o['guest_checkout']=get_option('woocommerce_enable_guest_checkout'); $o['login_from_checkout']=get_option('woocommerce_enable_signup_and_login_from_checkout');
    // 2. customer_invoice laiškas — LT tekstai, įjungtas?, šablonų override
    $em=WC()->mailer()->get_emails(); $list=array();
    foreach($em as $k=>$e){ $list[$k]=array('id'=>$e->id,'on'=>$e->is_enabled()?1:0,'subj'=>mb_substr((string)$e->get_option('subject',''),0,80),'title'=>$e->get_title()); }
    $o['wc_emails']=$list;
    if(isset($em['WC_Email_Customer_Invoice'])){ $e=$em['WC_Email_Customer_Invoice']; $o['inv_default']=array('subj_unpaid'=>$e->get_default_subject(false),'subj_paid'=>$e->get_default_subject(true),'head_unpaid'=>$e->get_default_heading(false),'head_paid'=>$e->get_default_heading(true),'add_text'=>mb_substr((string)$e->get_option('additional_content',''),0,300),'tpl'=>$e->template_html); }
    $o['tema_email_override']=is_dir($th.'/woocommerce/emails')?array_map('basename',glob($th.'/woocommerce/emails/*')):'nera';
    $o['tema_tpl_override']=array_map(function($x) use($th){ return str_replace($th.'/woocommerce/','',$x); },array_merge(glob($th.'/woocommerce/*.php')?:array(),glob($th.'/woocommerce/*/*.php')?:array()));
    $o['inv_tpl_lt']=$grep($wc.'/templates/emails/customer-invoice.php','/pay for|Pay for|printf|esc_html/',10,1);
    // 3. Paysera
    $act=(array)get_option('active_plugins'); $o['paysera_plugins']=array_values(array_filter($act,function($x){ return stripos($x,'paysera')!==false; }));
    $gws=WC()->payment_gateways()->payment_gateways(); foreach($gws as $g){ $o['gateways'][$g->id]=array('on'=>$g->enabled,'title'=>$g->get_title(),'class'=>get_class($g)); }
    foreach($o['paysera_plugins'] as $pp){ $dir=WP_PLUGIN_DIR.'/'.dirname($pp); $files=array(); $it=new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir)); foreach($it as $ff){ if(substr($ff,-4)==='.php'){ $c=file_get_contents($ff); if(preg_match('/payment_complete|woocommerce_api_|callback/i',$c)) $files[]=str_replace(WP_PLUGIN_DIR.'/','',(string)$ff); } } $o['paysera_files']=array_slice($files,0,15);
      foreach(array_slice($files,0,6) as $ff){ $o['paysera_'.basename($ff)]=$grep(WP_PLUGIN_DIR.'/'.$ff,'/payment_complete|woocommerce_api_|add_action\(|update_status|get_return_url|order-pay|checkout_payment_url|process_payment|function .*callback/i',25,0); } }
    // 4. Snippet #653 + kiti aktyvūs; tema functions.php AVPN/IAPV kabliai
    $o['snippets_aktyvus']=$wpdb->get_results("SELECT id,name,scope,priority FROM {$p}snippets WHERE active=1 ORDER BY id",ARRAY_A);
    $s653=$wpdb->get_var("SELECT code FROM {$p}snippets WHERE id=653"); $o['s653']=$s653?mb_substr($s653,0,3500):'nera';
    $tf=$th.'/functions.php'; $o['tema_functions_dydis']=is_file($tf)?filesize($tf):'nera';
    $o['tema_hooks']=$grep($tf,'/add_(action|filter)\(\s*[\'"](woocommerce_(new_order|payment_complete|order_status|checkout_|thankyou|email|mail)|wp_mail|phpmailer)/',60,0);
    $o['tema_avpn']=$grep($tf,'/AVPN|IAPV|_petshop_completed_pdf|_petshop_order_pdf|invoice_number|skaitiklis|counter/i',40,0);
    $o['tema_gen_pdf']=$fn($tf,'petshop_generate_invoice_pdf',1400);
    // 5. Varikliai — kabliai ant naujo/apmokėto/statuso užsakymo
    $files=glob($mu.'/*.php'); $hk=array(); $pat='/add_(action|filter)\(\s*[\'"](woocommerce_(new_order|payment_complete|order_status_|checkout_|thankyou|reduce_order|restore_order|before_order_object_save|update_order|order_refunded|email_)|wc_order|pre_wp_mail|wp_mail)/';
    foreach($files as $f){ $r=$grep($f,$pat,40,0); if($r&&is_array($r)&&count($r)) $hk[basename($f)]=$r; } $o['mu_hooks']=$hk; $o['mu_failai']=array_map('basename',$files);
    $dl=$mu.'/petshop-darbalaukis.php'; $o['dl_auto_rusiuoti']=$fn($dl,'auto_rusiuoti',2200); $o['dl_atviri']=$fn($dl,'atviri',2600); $o['dl_hooks']=$grep($dl,'/add_(action|filter)\(/',80,0);
    $o['dl_laiskai_off']=$fn($dl,'laiskai_off',900); $o['dl_laiskas_fns']=$grep($dl,'/function (laisk|siusti_laisk|email|pastas|mail)\w*/',20,0);
    $o['dl_grizta_sumos']=$fn($dl,'grizta_sumos',2600); $o['dl_pristatymo_ikainis']=$fn($dl,'pristatymo_ikainis',1800);
    $o['dl_kortele_grizta']=$grep($dl,'/Siunta grįžta|dl-sumos|Pakartotinis/',20,0);
    // kur gyvena Petshop_AV_Order, AV_Reduce, faktai, dropship-sargas, partijos — kabliai + pirmi eilučių tvarkymai
    foreach(array('petshop-av-order.php','petshop-av-reduce.php','petshop-faktai.php','petshop-dropship-sargas.php','petshop-partijos.php','petshop-desk.php','petshop-av-dropship.php','petshop-av-tiekimas.php','petshop-siuntu-laiskai.php','petshop-uzsakymu-ivykiai.php') as $b){ $f=$mu.'/'.$b; if(!is_file($f)){ $o['nera'][]=$b; continue; } $o['eng_'.$b]=array('dydis'=>filesize($f),'hooks'=>$grep($f,'/add_(action|filter)\(/',40,0),'virtual'=>$grep($f,'/is_virtual|_virtual|get_virtual|needs_shipping|_ps_sandelis|_ps_pakartotinis|created_via|get_created_via/',20,0)); }
    $o['klases']=array(); foreach(array('Petshop_AV_Order','Petshop_AV_Reduce','Petshop_Desk','Petshop_Siuntos','Petshop_Fakt_Uzsakymai','Petshop_Faktai','Petshop_Dropship_Sargas','Petshop_Partijos','Petshop_Magic_Login','Petshop_Uzsakymu_Ivykiai') as $k){ if(class_exists($k)){ $rc=new ReflectionClass($k); $o['klases'][$k]=array('file'=>basename($rc->getFileName()),'methods'=>array_map(function($m){ return $m->getName().'('.implode(',',array_map(function($pp){ return ($pp->isOptional()?'?':'').'$'.$pp->getName(); },$m->getParameters())).')'; },$rc->getMethods(ReflectionMethod::IS_PUBLIC))); } else $o['klases'][$k]='nera'; }
    $fx=$grep($mu.'/petshop-faktai.php','/function |foreach\s*\(\s*\$\w+->get_items/',60,0); $o['faktai_fns']=$fx;
    $mg=glob(WP_PLUGIN_DIR.'/petshop-core/*magic*'); $mg=array_merge($mg?:array(),glob(WP_PLUGIN_DIR.'/petshop-core/*/*magic*')?:array(),glob($mu.'/*magic*')?:array()); $o['magic_files']=$mg; foreach(array_slice($mg,0,2) as $f){ $o['magic_'.basename($f)]=$grep($f,'/function |add_(action|filter)\(|token|expire|galioja/i',40,0); }
    // 6. Virtualios/paslaugų prekės, PVM
    $o['virt_prekes']=$wpdb->get_results("SELECT p.ID,p.post_title,p.post_status FROM {$p}posts p JOIN {$p}postmeta m ON m.post_id=p.ID AND m.meta_key='_virtual' AND m.meta_value='yes' WHERE p.post_type='product' LIMIT 20",ARRAY_A);
    $o['siunt_prekes']=$wpdb->get_results("SELECT ID,post_title,post_status FROM {$p}posts WHERE post_type='product' AND (post_title LIKE '%siunt%' OR post_title LIKE '%paslaug%' OR post_title LIKE '%pristat%') LIMIT 20",ARRAY_A);
    $o['pvm']=array('calc'=>get_option('woocommerce_calc_taxes'),'incl'=>get_option('woocommerce_prices_include_tax'),'display_shop'=>get_option('woocommerce_tax_display_shop'),'rates'=>$wpdb->get_results("SELECT tax_rate_id,tax_rate_country,tax_rate,tax_rate_name,tax_rate_class,tax_rate_shipping FROM {$p}woocommerce_tax_rates",ARRAY_A),'classes'=>wc_get_product_tax_class_options());
    $o['wc_manage_stock']=get_option('woocommerce_manage_stock');
    // 7. Testiniai #35434 / #35436 — adresai, klientas, payment url
    foreach(array(35434,35436) as $id){ $x=wc_get_order($id); if(!$x) continue; $o['uzs'][$id]=array('st'=>$x->get_status(),'cid'=>$x->get_customer_id(),'email'=>$x->get_billing_email(),'bill'=>$x->get_address('billing'),'ship'=>$x->get_address('shipping'),'pm'=>$x->get_payment_method(),'pmt'=>$x->get_payment_method_title(),'created_via'=>$x->get_created_via(),'key'=>$x->get_order_key(),'pay_url'=>$x->get_checkout_payment_url(),'pay_url_gw'=>$x->get_checkout_payment_url(true),'grizta'=>(string)$x->get_meta('_ps_siunta_grizta'),'meta_ps'=>array_values(array_filter(array_map(function($m){ return strpos($m->key,'_ps_')===0?$m->key.'='.mb_substr(is_scalar($m->value)?$m->value:json_encode($m->value,JSON_UNESCAPED_UNICODE),0,80):null; },$x->get_meta_data())))); }
    // 8. Užsakymo laukai, kuriuos pildo kasa (checkout) — ką reikės nukopijuoti: pastarojo tikro užsakymo meta raktai (ne _ps_)
    $last=$wpdb->get_var("SELECT id FROM {$p}wc_orders WHERE type='shop_order' AND status IN ('wc-completed','wc-processing') AND id NOT BETWEEN 35414 AND 35450 ORDER BY id DESC LIMIT 1");
    if($last){ $x=wc_get_order($last); $o['pask_meta_raktai']=array_values(array_unique(array_map(function($m){ return $m->key; },$x->get_meta_data()))); $o['pask_created_via']=$x->get_created_via(); $o['pask_id']=$last; }
    $o['sekmes']=count($o);
  }catch(Throwable $e){ $o['FATAL']=$e->getMessage().' @'.$e->getFile().':'.$e->getLine(); }
  $J($o);
});
