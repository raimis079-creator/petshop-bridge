<?php
/** Petshop Katalogo Auditas v1 (read-only, token-gated) */
if (!defined('ABSPATH')) return;

add_action('wp_loaded', function(){
    if (empty($_GET['ps_audit']) || (isset($_GET['k']) ? $_GET['k'] : '') !== 'ps2026') return;
    global $wpdb;
    @set_time_limit(280);

    /* ---------- parser-mirror (kaip v5) ---------- */
    $ascii = function($s){
        $s = wp_strip_all_tags($s);
        $m = array("\xC4\x85"=>'a',"\xC4\x8D"=>'c',"\xC4\x99"=>'e',"\xC4\x97"=>'e',"\xC4\xAF"=>'i',"\xC5\xA1"=>'s',"\xC5\xB3"=>'u',"\xC5\xAB"=>'u',"\xC5\xBE"=>'z',"\xC4\x84"=>'a',"\xC4\x8C"=>'c',"\xC4\x98"=>'e',"\xC4\x96"=>'e',"\xC4\xAE"=>'i',"\xC5\xA0"=>'s',"\xC5\xB2"=>'u',"\xC5\xAA"=>'u',"\xC5\xBD"=>'z');
        return strtolower(strtr($s,$m));
    };
    $title = function($mk) use ($ascii){
        $t = $ascii($mk);
        if (strpos($t,'pagrindinis aprasymas')!==false) return 'aprasymas';
        if (strpos($t,'sud')===0) return 'sudetis';
        if (strpos($t,'analitin')===0) return 'analitines';
        if (strpos($t,'pried')!==false) return 'priedai';
        if (strpos($t,'serim')===0 || strpos($t,'rekomenduojamas kiekis')===0) return 'serimo';
        if (strpos($t,'ispejim')!==false) return 'ispejimai';
        if (strpos($t,'pagaminta')!==false) return 'pagaminta';
        return 'kita';
    };
    $clean = function($html){
        if (!is_string($html)) return '';
        $html = html_entity_decode($html, ENT_QUOTES | ENT_HTML5, 'UTF-8');
        $html = preg_replace('#<style[^>]*>.*?</style>#is',' ',$html);
        $html = preg_replace('#<script[^>]*>.*?</script>#is',' ',$html);
        $html = preg_replace('#<!--.*?-->#s',' ',$html);
        $html = preg_replace('/Trumpas\s+prek\x{0117}s\s+apra\x{0161}ymas/iu',' ',$html);
        return $html;
    };
    $patC = '/(?:<(?:strong|b|h[1-6]|p|span|em|div)[^>]*>\s*)*\s*(Sud\x{0117}tis|Maisto\s+pried[a-z\x{0105}-\x{017E}]*|Technologiniai\s+pried[a-z\x{0105}-\x{017E}]*|Pried[a-z\x{0105}-\x{017E}]*\/kg[^:<\n]{0,30}|Pried[a-z\x{0105}-\x{017E}]*|Pagaminta|\x{012E}sp\x{0117}jim[a-z\x{0105}-\x{017E}]*)\s*(?:<\/(?:strong|b|span|em)>\s*)*\s*:/iu';
    $patH = '/(?:<(?:strong|b|h[1-6]|p|span|em|div)[^>]*>\s*)*\s*(Analitin\x{0117}s(?:\s+sudedamosios(?:\s+(?:dalys|med\x{017E}iagos))?)?|\x{0160}\x{0117}rim(?:o|as)?(?:\s+(?:instrukcija|rekomendacij[ao]s?|norma|normos|nurodymai))?|Rekomenduojamas\s+kiekis\s+per\s+par[a\x{0105}]|Pagrindinis\s+apra\x{0161}ymas)\s*(?::|<\/(?:strong|b|h[1-6])>)/iu';

    $analyze = function($content) use ($clean,$title,$patC,$patH){
        $r = array('accordion'=>false,'fallback'=>false,'empty'=>false,'sections'=>array(),'near_empty'=>0,'duplicates'=>0);
        $cl = $clean($content);
        $plain = trim(wp_strip_all_tags($cl));
        if ($plain === '') { $r['empty']=true; return $r; }
        $marks = array();
        foreach (array($patC,$patH) as $pat){
            if (preg_match_all($pat,$cl,$mm,PREG_OFFSET_CAPTURE|PREG_SET_ORDER)){
                foreach($mm as $m){ $marks[]=array('start'=>$m[0][1],'cstart'=>$m[0][1]+strlen($m[0][0]),'phrase'=>$m[1][0]); }
            }
        }
        if (empty($marks)){ $r['fallback']=true; return $r; }
        usort($marks,function($a,$b){return $a['start']-$b['start'];});
        $raw=array(); $n=count($marks);
        $intro=trim(substr($cl,0,$marks[0]['start']));
        if (strlen(trim(wp_strip_all_tags($intro)))>=15) $raw[]=array('aprasymas',$intro);
        for($i=0;$i<$n;$i++){
            $cend=($i+1<$n)?$marks[$i+1]['start']:strlen($cl);
            $body=trim(substr($cl,$marks[$i]['cstart'],$cend-$marks[$i]['cstart']));
            $raw[]=array($title($marks[$i]['phrase']),$body);
        }
        $counts=array(); $map=array();
        foreach($raw as $s){
            $t=$s[0]; $counts[$t]=isset($counts[$t])?$counts[$t]+1:1;
            if(strlen(trim(wp_strip_all_tags($s[1])))<15) $r['near_empty']++;
            if(!isset($map[$t])) $map[$t]=$s[1]; else $map[$t].=' '.$s[1];
        }
        foreach($counts as $t=>$c){ if($c>1) $r['duplicates']++; }
        foreach($map as $t=>$c){ if(strlen(trim(wp_strip_all_tags($c)))<15) unset($map[$t]); }
        $r['sections']=array_keys($map);
        if(count($map)>=2) $r['accordion']=true; else $r['fallback']=true;
        return $r;
    };

    /* ---------- bulk queries ---------- */
    $cnt_pub = (int)$wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->posts} WHERE post_type='product' AND post_status='publish'");
    $cnt_draft = (int)$wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->posts} WHERE post_type='product' AND post_status='draft'");
    $cnt_oos = (int)$wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->postmeta} pm JOIN {$wpdb->posts} p ON p.ID=pm.post_id WHERE p.post_type='product' AND p.post_status='publish' AND pm.meta_key='_stock_status' AND pm.meta_value='outofstock'");

    $off=isset($_GET['off'])?max(0,(int)$_GET['off']):0;
    $lim=isset($_GET['lim'])?max(1,(int)$_GET['lim']):100000;
    $posts=$wpdb->get_results($wpdb->prepare("SELECT ID,post_title,post_content,post_excerpt FROM {$wpdb->posts} WHERE post_type='product' AND post_status='publish' ORDER BY ID LIMIT %d OFFSET %d",$lim,$off));
    $ids=array(); foreach($posts as $p) $ids[]=(int)$p->ID;
    if(empty($ids)){ header('Content-Type: application/json'); echo json_encode(array('empty_batch'=>true)); exit; }
    $in=implode(',',$ids);

    $meta=array();
    $mr=$wpdb->get_results("SELECT post_id,meta_key,meta_value FROM {$wpdb->postmeta} WHERE post_id IN ($in) AND meta_key IN ('_price','_thumbnail_id','_stock_status')");
    foreach($mr as $m){ $meta[(int)$m->post_id][$m->meta_key]=$m->meta_value; }

    $cats=array(); $brand=array();
    $tr=$wpdb->get_results("SELECT tr.object_id oid, tt.taxonomy tax, t.name nm FROM {$wpdb->term_relationships} tr JOIN {$wpdb->term_taxonomy} tt ON tr.term_taxonomy_id=tt.term_taxonomy_id JOIN {$wpdb->terms} t ON tt.term_id=t.term_id WHERE tt.taxonomy IN ('product_cat','product_brand') AND tr.object_id IN ($in)");
    foreach($tr as $row){ $oid=(int)$row->oid; if($row->tax==='product_cat'){ $cats[$oid][]=$row->nm; } else { $brand[$oid][]=$row->nm; } }

    // visu brendu sarasas (mismatch heuristikai)
    $allbrands=$wpdb->get_col("SELECT DISTINCT t.name FROM {$wpdb->term_taxonomy} tt JOIN {$wpdb->terms} t ON tt.term_id=t.term_id WHERE tt.taxonomy='product_brand'");
    $brandlist=array(); foreach($allbrands as $bn){ $bn=trim($bn); if(strlen($bn)>=4) $brandlist[]=$bn; }

    /* ---------- agregatai ---------- */
    $A=array('no_image'=>0,'no_price'=>0,'not_purchasable'=>0,'no_category'=>0,'in_kita'=>0,'no_brand'=>0,'no_content'=>0,'no_short'=>0);
    $D=array('accordion'=>0,'fallback'=>0,'empty'=>0,'short_visible_tags'=>0,'content_junk'=>0,'near_empty'=>0,'dup_sections'=>0,'pagrindinis_visible'=>0,'trumpas_visible'=>0);
    $F=array('total'=>0,'has_sudetis'=>0,'has_analitines'=>0,'has_priedai'=>0,'has_serimo'=>0,'no_sudetis'=>0,'no_analitines'=>0,'no_serimo'=>0);
    $X=array('total'=>0,'clean'=>0,'empty'=>0,'has_dims'=>0,'empty_bullets'=>0,'brand_mismatch'=>0);
    $rows=array('critical'=>array(),'desc'=>array(),'food'=>array(),'fallback'=>array(),'brand'=>array());

    foreach($posts as $p){
        $id=(int)$p->ID; $t=$p->post_title; $content=$p->post_content; $excerpt=$p->post_excerpt;
        $mt=isset($meta[$id])?$meta[$id]:array();
        $pc=isset($cats[$id])?$cats[$id]:array();
        $pb=isset($brand[$id])?$brand[$id]:array();

        $no_image = empty($mt['_thumbnail_id']);
        $price = isset($mt['_price'])?trim($mt['_price']):'';
        $no_price = ($price==='' || $price===null);
        $oos = (isset($mt['_stock_status']) && $mt['_stock_status']==='outofstock');
        $not_purch = $no_price;
        $real_cats = array_values(array_filter($pc,function($c){ return strtolower(trim($c))!=='uncategorized' && trim($c)!==''; }));
        $no_cat = empty($real_cats);
        $in_kita = false; foreach($pc as $c){ if(strtolower(trim($c))==='kita') $in_kita=true; }
        $no_brand = empty($pb);
        $no_content = (trim($content)==='');
        $no_short = (trim($excerpt)==='');

        if($no_image)$A['no_image']++; if($no_price)$A['no_price']++; if($not_purch)$A['not_purchasable']++;
        if($no_cat)$A['no_category']++; if($in_kita)$A['in_kita']++; if($no_brand)$A['no_brand']++;
        if($no_content)$A['no_content']++; if($no_short)$A['no_short']++;

        $crit=array();
        if($no_price)$crit[]='be_kainos'; if($not_purch && !$no_price)$crit[]='ne_purchasable';
        if($no_image)$crit[]='be_foto'; if($no_cat)$crit[]='be_kategorijos'; if($no_content)$crit[]='be_aprasymo';
        if($in_kita)$crit[]='kita_kategorija'; if($no_brand)$crit[]='be_brendo';
        if(!empty($crit)) $rows['critical'][]=array('id'=>$id,'title'=>$t,'issues'=>implode('|',$crit));

        // description quality
        $raw_excerpt = (string)$excerpt;
        $short_tags = (bool)preg_match('/&lt;\/?(p|strong|span|em|div|ul|li|br|h[1-6])\b/i',$raw_excerpt);
        $junk = (bool)preg_match('/(<style|&lt;style|notionvc|\.b2b-)/i',(string)$content);
        $pagr_vis = (bool)preg_match('/Pagrindinis\s+apra\x{0161}ymas/iu',(string)$content);
        $trump_vis = (bool)preg_match('/Trumpas\s+prek\x{0117}s\s+apra\x{0161}ymas/iu',(string)$content);
        $an=$analyze($content);

        if($an['accordion'])$D['accordion']++; if($an['fallback'])$D['fallback']++; if($an['empty'])$D['empty']++;
        if($short_tags)$D['short_visible_tags']++; if($junk)$D['content_junk']++;
        if($an['near_empty']>0)$D['near_empty']++; if($an['duplicates']>0)$D['dup_sections']++;
        if($pagr_vis)$D['pagrindinis_visible']++; if($trump_vis)$D['trumpas_visible']++;

        $dprob=array();
        if($short_tags)$dprob[]='short_tagai'; if($junk)$dprob[]='junk(style/notionvc/b2b)';
        if($an['near_empty']>0)$dprob[]='near_empty_sekcija'; if($an['duplicates']>0)$dprob[]='dubliuota_sekcija';
        if($pagr_vis)$dprob[]='pagrindinis_aprasymas_tekste'; if($trump_vis)$dprob[]='trumpas_aprasymas_tekste';
        if(!empty($dprob)) $rows['desc'][]=array('id'=>$id,'title'=>$t,'problems'=>implode('|',$dprob));

        // food vs accessory
        $is_food=false; foreach($pc as $c){ if(stripos($c,'maistas')!==false){ $is_food=true; break; } }
        $secset=array_flip($an['sections']);
        if($is_food){
            $F['total']++;
            $hs=isset($secset['sudetis']); $ha=isset($secset['analitines']); $hp=isset($secset['priedai']); $hf=isset($secset['serimo']);
            if($hs)$F['has_sudetis']++; else $F['no_sudetis']++;
            if($ha)$F['has_analitines']++; else $F['no_analitines']++;
            if($hp)$F['has_priedai']++;
            if($hf)$F['has_serimo']++; else $F['no_serimo']++;
            if(!$hs || !$ha){
                $miss=array(); if(!$hs)$miss[]='Sudetis'; if(!$ha)$miss[]='Analitines'; if(!$hf)$miss[]='Serimo';
                $rows['food'][]=array('id'=>$id,'title'=>$t,'missing'=>implode('|',$miss),'sections'=>implode(',',$an['sections']));
            }
        } else {
            // accessory: tik tie, kurie fallback arba empty (ne accordion)
            if(!$an['accordion']){
                $X['total']++;
                $cl=$clean($content); $plain=trim(wp_strip_all_tags($cl));
                $emptyfb=($plain==='');
                $dims=(bool)preg_match('/\d+[.,]?\d*\s*[x\x{00D7}]\s*\d+[.,]?\d*\s*[x\x{00D7}]\s*\d+[.,]?\d*\s*(?:cm|mm)|I\x{0161}matavimai|Matmenys|Talpa/iu',(string)$content);
                $ebul=(bool)preg_match('#<li>\s*</li>#i',(string)$content);
                $dirty=$junk || $short_tags || $ebul || $trump_vis;
                if($emptyfb)$X['empty']++;
                if($dims)$X['has_dims']++;
                if($ebul)$X['empty_bullets']++;
                if(!$dirty && !$emptyfb)$X['clean']++;
                if($emptyfb || $dirty){
                    $iss=array(); if($emptyfb)$iss[]='tuscias'; if($ebul)$iss[]='tusti_bulletai'; if($junk)$iss[]='junk'; if($short_tags)$iss[]='short_tagai';
                    $rows['fallback'][]=array('id'=>$id,'title'=>$t,'issue'=>implode('|',$iss),'has_dims'=>$dims?'taip':'ne');
                }
            }
        }

        // brand mismatch heuristika
        if(!empty($brandlist)){
            $tl=strtolower($t); $cl_l=strtolower(wp_strip_all_tags($content));
            $tbrand=''; foreach($brandlist as $bn){ if(strpos($tl,strtolower($bn))!==false){ $tbrand=$bn; break; } }
            if($tbrand!==''){
                $has_tbrand_in_content = (strpos($cl_l,strtolower($tbrand))!==false);
                $other=''; foreach($brandlist as $bn){ if(strtolower($bn)===strtolower($tbrand)) continue; if(strpos($cl_l,strtolower($bn))!==false){ $other=$bn; break; } }
                if(!$has_tbrand_in_content && $other!==''){
                    if($is_food){} // skip - food rarely
                    $X['brand_mismatch']++;
                    $rows['brand'][]=array('id'=>$id,'title'=>$t,'title_brand'=>$tbrand,'content_brand'=>$other);
                }
            }
        }
    }

    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(array(
        'generated'=>date('c'),
        'batch'=>array('off'=>$off,'lim'=>$lim,'scanned'=>count($posts)),
        'totals'=>array('publish'=>$cnt_pub,'draft'=>$cnt_draft,'outofstock'=>$cnt_oos,'brands_total'=>count($brandlist)),
        'catalog'=>$A,'description'=>$D,'food'=>$F,'accessory'=>$X,'rows'=>$rows
    ), JSON_UNESCAPED_UNICODE);
    exit;
});
