<?php
/** TEMP PS S1676 run j2 — darbalaukis v3.41 DEPLOY iš media (fazė D) + patikra (fazė T). */
add_action('init', function(){
  if (!isset($_GET['ps_s1676j'])) return; global $wpdb; $p=$wpdb->prefix; $F=$_GET['ps_s1676j']; $o=array('v'=>'S1676 j','faze'=>$F);
  $o['temp_istrinta']=(int)$wpdb->query("DELETE FROM {$p}snippets WHERE name LIKE 'TEMP%' AND active=0");
  $f=WPMU_PLUGIN_DIR.'/petshop-darbalaukis.php'; $bk=wp_upload_dir()['basedir'].'/ps-backups/petshop-darbalaukis.php.bak_s1676b';
  if($F==='D'){
    $mid=isset($_GET['d_dl_v3411_txt'])?(int)$_GET['d_dl_v3411_txt']:0; $mf=$mid?get_attached_file($mid):''; $o['media']=array($mid,$mf?basename($mf):'NĖRA');
    $kodas=$mf&&file_exists($mf)?gzdecode(base64_decode(trim(file_get_contents($mf)))):false;
    $o['senas_md5']=md5_file($f); $o['naujas_md5']=$kodas?md5($kodas):null;
    if($o['senas_md5']!=='586da938edf9e0b2f6705bc71786b987'){ $o['STOP']='gyvas ne v3.41'; }
    elseif($o['naujas_md5']!=='23a911c43994b154c54390de7d323d84'){ $o['STOP']='naujas md5'; }
    elseif(@token_get_all($kodas,TOKEN_PARSE)===false){ $o['STOP']='SINTAKSE'; }
    else { copy($f,$bk); file_put_contents($f,$kodas); $o['irasyta_md5']=md5_file($f);
      $r=wp_remote_get(home_url('/?ps_ping_s1676j='.time()),array('timeout'=>25,'sslverify'=>false)); $c=is_wp_error($r)?'ERR':wp_remote_retrieve_response_code($r); $o['ping']=$c;
      if(is_wp_error($r)||$c>=500){ copy($bk,$f); $o['ROLLBACK']=md5_file($f); } }
    if($mid) { wp_delete_attachment($mid,true); $o['media_istrinta']=1; }
  }
  if($F==='T'){
    $o['gyvas_md5']=md5_file($f); $o['versija']=defined('Petshop_Darbalaukis::VERSIJA')?Petshop_Darbalaukis::VERSIJA:null;
    $rc=new ReflectionClass('Petshop_Darbalaukis');
    foreach(array(35902) as $id){ $w=wc_get_order($id); $mf=$rc->getMethod('faktai'); $mf->setAccessible(true); $fk=$mf->invoke(null,$w); $mb=$rc->getMethod('busena'); $mb->setAccessible(true); $o['busena_'.$id]=$mb->invoke(null,$fk); $o['takelis_'.$id]=isset($fk['takelis'])?$fk['takelis']:(isset($fk['T'])?$fk['T']:array_keys($fk)); $mt=$rc->getMethod('mok_trumpai'); $mt->setAccessible(true); $o['mok_'.$id]=$mt->invoke(null,$w); }
    $o['warn']=$wpdb->get_var("SELECT COUNT(*) FROM {$p}options WHERE option_name='x'");
  }
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
