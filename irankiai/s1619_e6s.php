<?php
/** TEMP PS S1619 run e6s — S: Playwright kadrai (PPK + C): skydelis #35809 (kvitas PPK000102 PDF), #35811 (atsiėmimas įvykdytas — žingsneliai), #35810 (atsiėmimas Neišrūšiuoti, VF eilutė „veža į AV“), Sąskaitos t=ppk, Sąskaitos šablonai (atsiėmimo laiško forma atidaryta), Naujas užsakymas 4. Apmokėjimas. + recon: temos `wp_mail` filtras (priedai). */
add_action('init', function(){
  if (!isset($_GET['ps_e6s'])) return;
  $o=array('v'=>'S1619 e6s'); global $wpdb; $p=$wpdb->prefix;
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $tu=get_user_by('login','testuotojas'); $uid=$tu->ID; $exp=time()+1800; $tok=WP_Session_Tokens::get_instance($uid)->create($exp);
  $o['cookies']=array(array('name'=>SECURE_AUTH_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp,'secure_auth',$tok)),array('name'=>AUTH_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp,'auth',$tok)),array('name'=>LOGGED_IN_COOKIE,'value'=>wp_generate_auth_cookie($uid,$exp,'logged_in',$tok)));
  $L=file(get_stylesheet_directory().'/functions.php'); $g=array(); foreach($L as $i=>$l){ if(preg_match('/wp_mail|phpmailer|attachments/i',$l)){ $g[]=($i+1).': '.mb_substr(trim($l),0,160); } } $o['tema_mail']=array_slice($g,0,25);
  $sk=function($id){ return admin_url('admin.php?page=ps-desk&eile=visi&atidaryti='.$id); };
  $ev='(async function(){ var sl=function(ms){return new Promise(function(r){setTimeout(r,ms);});}; await sl(2500); var d=document.getElementById("skDokT"); var v=document.getElementById("skV"); return {dok:d?d.innerText:"", footer:v?v.innerText:"", pr:(document.getElementById("skPr")||{}).innerText||""}; })()';
  $o['shots']=array(
    array('n'=>'s1619_e6_skydelis_35809_ppk','u'=>$sk(35809),'w'=>1440,'h'=>1000,'full'=>true,'eval'=>$ev),
    array('n'=>'s1619_e6_skydelis_35811_atsiemimas','u'=>$sk(35811),'w'=>1440,'h'=>1000,'full'=>true,'eval'=>$ev),
    array('n'=>'s1619_e6_skydelis_35810_neisrusiuotas','u'=>admin_url('admin.php?page=ps-desk&eile=neisrusiuoti&atidaryti=35810'),'w'=>1440,'h'=>1000,'full'=>true,'eval'=>$ev),
    array('n'=>'s1619_e6_saskaitos_ppk','u'=>admin_url('admin.php?page=ps-desk&view=saskaitos&t=ppk'),'w'=>1440,'h'=>800,'eval'=>'(function(){var t=document.querySelector("table.dl-sask"); return t?t.innerText.slice(0,400):"lentelės nėra";})()'),
    array('n'=>'s1619_e6_saskaitos_sablonai','u'=>admin_url('admin.php?page=ps-desk&view=saskaitos&t=kr&pd_ok=dl_info&pd_nr='.rawurlencode('šablonas|„paruošta atsiimti“ (peržiūra)')),'w'=>1440,'h'=>1400,'full'=>true,'eval'=>'(function(){ document.querySelectorAll("details.dl-sabl").forEach(function(d){d.open=true;}); return Array.from(document.querySelectorAll("details.dl-sabl summary")).map(function(s){return s.innerText;}); })()'),
    array('n'=>'s1619_e6_naujas_apmokejimas','u'=>admin_url('admin.php?page=ps-desk&view=naujas'),'w'=>1440,'h'=>1000,'full'=>true,'eval'=>'(function(){ return Array.from(document.querySelectorAll(".dl-nu-mok label")).map(function(l){return l.innerText;}); })()'),
  );
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
},99);
