<?php
/** TEMP PS S1683 a — READ-ONLY istorija: maisto/skanėstų pirkėjų kohortos (nauji/mėn., aktyvi bazė, nubyrėjimas, išlaidos/mėn., intervalai, negrįžusių profilis). */
add_action('init', function(){
  if (!isset($_GET['ps_s1683a'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1683 a'); $wpdb->suppress_errors(true);
  $U="{$p}ps_ist_fakt_uzsakymai"; $E="{$p}ps_ist_fakt_eilutes";
  $o['kat_top']=$wpdb->get_results("SELECT SUBSTRING_INDEX(kategoriju_kelias,'>',1) k, COUNT(*) n FROM $E GROUP BY k ORDER BY n DESC LIMIT 15",ARRAY_A);
  $o['kat_l2']=$wpdb->get_results("SELECT SUBSTRING_INDEX(kategoriju_kelias,'>',2) k, COUNT(*) n FROM $E GROUP BY k ORDER BY n DESC LIMIT 30",ARRAY_A);
  $FOOD="(LOWER(e.kategoriju_kelias) LIKE '%maist%' OR LOWER(e.kategoriju_kelias) LIKE '%skan%' OR LOWER(e.kategoriju_kelias) LIKE '%konserv%')";
  // laikina lentelė: maisto užsakymai su kliento raktu
  $wpdb->query("DROP TEMPORARY TABLE IF EXISTS t_mu");
  $wpdb->query("CREATE TEMPORARY TABLE t_mu AS SELECT u.uzsakymas_id, COALESCE(NULLIF(u.klientas_email_hash,''),CONCAT('id',u.klientas_id)) kl, DATE(u.apmoketa_at) d, u.viso_ct, u.klientas_uzsakymo_nr nr, SUM(CASE WHEN $FOOD THEN e.kaina_ct ELSE 0 END) maist_ct, COUNT(DISTINCT e.sku) sku_n, MAX(CASE WHEN $FOOD THEN e.brendas_slug END) brendas FROM $U u JOIN $E e ON e.uzsakymas_id=u.uzsakymas_id WHERE u.apmoketa_at IS NOT NULL AND u.testinis=0 GROUP BY u.uzsakymas_id HAVING maist_ct>0");
  $o['t_mu_n']=$wpdb->get_var("SELECT COUNT(*) FROM t_mu");
  $o['vis_uzs']=$wpdb->get_var("SELECT COUNT(*) FROM $U WHERE apmoketa_at IS NOT NULL AND testinis=0");
  $wpdb->query("DROP TEMPORARY TABLE IF EXISTS t_kl");
  $wpdb->query("CREATE TEMPORARY TABLE t_kl AS SELECT kl, MIN(d) pirmas, MAX(d) pask, COUNT(*) uzs, SUM(viso_ct) viso_ct, SUM(maist_ct) maist_ct FROM t_mu GROUP BY kl");
  // 1. nauji maisto klientai per mėnesį + grįžtantys + pajamos
  $o['men']=$wpdb->get_results("SELECT DATE_FORMAT(m.d,'%Y-%m') m, COUNT(*) uzs, COUNT(DISTINCT m.kl) kl, SUM(k.pirmas=m.d) nauji, ROUND(SUM(m.viso_ct)/100) eur, ROUND(SUM(m.maist_ct)/100) maist_eur FROM t_mu m JOIN t_kl k ON k.kl=m.kl WHERE m.d>='2024-01-01' GROUP BY 1 ORDER BY 1",ARRAY_A);
  // 2. aktyvi bazė (maisto pirkimas per paskutines 90 d.) mėnesio pabaigoje + išlaidos/aktyviam
  $rows=array();
  for($y=2024;$y<=2026;$y++) for($mo=1;$mo<=12;$mo++){ $end=date('Y-m-t',mktime(0,0,0,$mo,1,$y)); if($end>'2026-08-31') break 2;
    $r=$wpdb->get_row($wpdb->prepare("SELECT COUNT(DISTINCT kl) akt, ROUND(SUM(viso_ct)/100) eur90, ROUND(SUM(maist_ct)/100) maist90 FROM t_mu WHERE d>DATE_SUB(%s,INTERVAL 90 DAY) AND d<=%s",$end,$end),ARRAY_A);
    $r['m']=substr($end,0,7); $rows[]=$r; }
  $o['aktyvi90']=$rows;
  // 3. nubyrėjimas: iš aktyvių mėn. M (90 d.) kiek liko aktyvūs M+3
  $ch=array(); foreach(array('2024-06-30','2024-12-31','2025-03-31','2025-06-30','2025-09-30','2025-12-31','2026-03-31','2026-05-31') as $end){
    $e2=date('Y-m-d',strtotime($end.' +92 days'));
    $ch[]=$wpdb->get_row($wpdb->prepare("SELECT %s m, COUNT(*) akt, SUM(EXISTS(SELECT 1 FROM t_mu b WHERE b.kl=a.kl AND b.d>%s AND b.d<=%s)) liko FROM (SELECT DISTINCT kl FROM t_mu WHERE d>DATE_SUB(%s,INTERVAL 90 DAY) AND d<=%s) a",$end,$end,$e2,$end,$end),ARRAY_A); }
  $o['nubyr_ketv']=$ch;
  // 4–7 PHP pusėje (MariaDB temp lentelės neperatidaromos)
  $rows=$wpdb->get_results("SELECT kl,d,viso_ct,maist_ct,sku_n,brendas,uzsakymas_id FROM t_mu ORDER BY kl,d",ARRAY_A);
  $gyv=array(); foreach($wpdb->get_results("SELECT m.uzsakymas_id id, MAX(e.gyvunas) g FROM t_mu m JOIN $E e ON e.uzsakymas_id=m.uzsakymas_id WHERE $FOOD GROUP BY m.uzsakymas_id",ARRAY_A) as $r) $gyv[$r['id']]=$r['g'];
  $K=array(); foreach($rows as $r){ $K[$r['kl']][]=$r; }
  $koh=array(); $iv=array('n'=>0,'sum'=>0,'d30'=>0,'d60'=>0,'d90'=>0,'d180'=>0,'d180p'=>0); $ivb=array(); $prof=array(); $nb=array(); $ng=array(); $vert=array();
  foreach($K as $kl=>$L){ $f=$L[0]; $fd=strtotime($f['d']); $n=count($L); $q=date('Y',$fd).'Q'.ceil(date('n',$fd)/3);
    // kohortos
    if($f['d']>='2023-11-01'){ if(!isset($koh[$q])) $koh[$q]=array('kl'=>0,'g90'=>0,'g180'=>0,'g365'=>0,'uzs12'=>0,'eur12'=>0);
      $c=&$koh[$q]; $c['kl']++; $g90=$g180=$g365=0; $u12=0; $e12=0;
      foreach($L as $x){ $dd=(strtotime($x['d'])-$fd)/86400; if($dd<=365){$u12++;$e12+=$x['viso_ct'];} if($dd>0){ if($dd<=90)$g90=1; if($dd<=180)$g180=1; if($dd<=365)$g365=1; } }
      $c['g90']+=$g90;$c['g180']+=$g180;$c['g365']+=$g365;$c['uzs12']+=$u12;$c['eur12']+=$e12; unset($c); }
    // intervalai
    for($i=1;$i<$n;$i++){ if($L[$i]['d']<'2024-09-01') continue; $d=(strtotime($L[$i]['d'])-strtotime($L[$i-1]['d']))/86400; $iv['n']++; $iv['sum']+=$d;
      if($d<=30)$iv['d30']++; elseif($d<=60)$iv['d60']++; elseif($d<=90)$iv['d90']++; elseif($d<=180)$iv['d180']++; else $iv['d180p']++;
      $b=$L[$i]['brendas']?:'-'; if(!isset($ivb[$b]))$ivb[$b]=array('n'=>0,'sum'=>0); $ivb[$b]['n']++; $ivb[$b]['sum']+=$d; }
    // profilis pirmo pirkimo 2024-09..2025-08
    if($f['d']>='2024-09-01' && $f['d']<='2025-08-31'){ $g=$n>1?1:0;
      if(!isset($prof[$g])) $prof[$g]=array('kl'=>0,'aov'=>0,'maist'=>0,'sku'=>0,'iki30'=>0,'nuo60'=>0,'kraikas'=>0);
      $prof[$g]['kl']++; $prof[$g]['aov']+=$f['viso_ct']; $prof[$g]['maist']+=$f['maist_ct']/$f['viso_ct']; $prof[$g]['sku']+=$f['sku_n']; if($f['viso_ct']<3000)$prof[$g]['iki30']++; if($f['viso_ct']>=6000)$prof[$g]['nuo60']++;
      $b=$f['brendas']?:'-'; if(!isset($nb[$b]))$nb[$b]=array('kl'=>0,'grizo'=>0,'aov'=>0); $nb[$b]['kl']++; $nb[$b]['grizo']+=$g; $nb[$b]['aov']+=$f['viso_ct'];
      $gy=isset($gyv[$f['uzsakymas_id']])?$gyv[$f['uzsakymas_id']]:'-'; if(!isset($ng[$gy]))$ng[$gy]=array('kl'=>0,'grizo'=>0); $ng[$gy]['kl']++; $ng[$gy]['grizo']+=$g; }
    // vertės
    if($f['d']>='2024-09-01'){ $g=$n==1?'1':($n<=3?'2-3':($n<=6?'4-6':($n<=12?'7-12':'13+'))); if(!isset($vert[$g]))$vert[$g]=array('kl'=>0,'eur'=>0); $vert[$g]['kl']++; $s=0; foreach($L as $x)$s+=$x['viso_ct']; $vert[$g]['eur']+=$s; }
  }
  ksort($koh); foreach($koh as $q=>$c){ $o['kohortos'][]=array('q'=>$q,'kl'=>$c['kl'],'g90'=>$c['g90'],'g180'=>$c['g180'],'g365'=>$c['g365'],'uzs12'=>round($c['uzs12']/$c['kl'],2),'eur12'=>round($c['eur12']/$c['kl']/100,1)); }
  $o['interv']=$iv; $o['interv']['vid']=$iv['n']?round($iv['sum']/$iv['n']):null;
  arsort($ivb); foreach(array_slice($ivb,0,12,true) as $b=>$x) if($x['n']>=20) $o['interv_brend'][]=array('b'=>$b,'n'=>$x['n'],'vid'=>round($x['sum']/$x['n']));
  foreach($prof as $g=>$x) $o['profilis'][]=array('grizo'=>$g,'kl'=>$x['kl'],'pirmo_aov'=>round($x['aov']/$x['kl']/100,1),'maist_pct'=>round($x['maist']/$x['kl']*100),'sku_n'=>round($x['sku']/$x['kl'],1),'iki30'=>$x['iki30'],'nuo60'=>$x['nuo60']);
  uasort($nb,function($a,$b){return $b['kl']-$a['kl'];}); foreach(array_slice($nb,0,15,true) as $b=>$x) if($x['kl']>=15) $o['negrizo_brend'][]=array('b'=>$b,'kl'=>$x['kl'],'grizo'=>$x['grizo'],'aov'=>round($x['aov']/$x['kl']/100,1));
  foreach($ng as $g=>$x) $o['negrizo_gyv'][]=array('g'=>$g,'kl'=>$x['kl'],'grizo'=>$x['grizo']);
  foreach($vert as $g=>$x) $o['vertes'][]=array('g'=>$g,'kl'=>$x['kl'],'eur'=>round($x['eur']/100),'eur_kl'=>round($x['eur']/100/$x['kl']));
  header('Content-Type: application/json'); echo json_encode($o,JSON_UNESCAPED_UNICODE); exit;
});
