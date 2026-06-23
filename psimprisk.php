<?php
/** Petshop Import-Risk Recon v1 (read-only, token-gated) */
if (!defined('ABSPATH')) return;

add_action('wp_loaded', function(){
    if (empty($_GET['ps_imprisk']) || (isset($_GET['k']) ? $_GET['k'] : '') !== 'ps2026') return;
    global $wpdb;
    @set_time_limit(120);

    $out = array();

    /* ---- 1) WP All Import konfiguracijos ---- */
    $tbl = $wpdb->prefix.'pmxi_imports';
    $imps = $wpdb->get_results("SELECT id, name, options FROM {$tbl} ORDER BY id");
    $impinfo = array();
    foreach ($imps as $im){
        $opt = @unserialize($im->options);
        $row = array('id'=>$im->id, 'name'=>$im->name);
        if (is_array($opt)){
            // surinkti visus 'update' susijusius raktus
            foreach ($opt as $k=>$v){
                if (stripos($k,'update')!==false || stripos($k,'is_update')!==false){
                    if (is_scalar($v)) $row['flags'][$k] = $v;
                }
            }
            // svarbiausi konkretus
            foreach (array('update_post','is_update_title','is_update_content','is_update_excerpt',
                           'is_update_categories','is_update_attributes','is_update_images',
                           'is_update_custom_fields','update_custom_fields_logic','is_update_product_data',
                           'is_update_status','is_update_dates','duplicate_matching','custom_duplicate_name') as $kk){
                if (array_key_exists($kk,$opt) && is_scalar($opt[$kk])) $row['key'][$kk]=$opt[$kk];
            }
            $row['unique_key'] = isset($opt['unique_key'])?$opt['unique_key']:'';
        } else {
            $row['options_unreadable']=true;
        }
        $impinfo[] = $row;
    }
    $out['imports'] = $impinfo;

    /* ---- 2) 124 data-gap saltiniu klasifikacija ---- */
    $ids_raw = isset($_GET['ids']) ? preg_replace('/[^0-9,]/','',$_GET['ids']) : '';
    if ($ids_raw!==''){
        $ids = array_filter(array_map('intval', explode(',', $ids_raw)));
        if (!empty($ids)){
            $in = implode(',', $ids);
            $meta = array();
            $mr = $wpdb->get_results("SELECT post_id,meta_key,meta_value FROM {$wpdb->postmeta} WHERE post_id IN ($in) AND meta_key IN ('_legacy_source','_legacy_manufacturer','_zb_enabled','_zb_cost','_zb_ean','_vf_supplier_sku','_vf_qty','_vf_last_sync')");
            foreach ($mr as $m){ $meta[(int)$m->post_id][$m->meta_key]=$m->meta_value; }
            $titles = array();
            $tr = $wpdb->get_results("SELECT ID,post_title FROM {$wpdb->posts} WHERE ID IN ($in)");
            foreach ($tr as $t){ $titles[(int)$t->ID]=$t->post_title; }

            $cls = array('zb'=>0,'vf'=>0,'legacy'=>0,'vf+legacy'=>0,'unknown'=>0);
            $bysrc = array('zb'=>array(),'vf'=>array(),'legacy'=>array(),'vf+legacy'=>array(),'unknown'=>array());
            foreach ($ids as $id){
                $mt = isset($meta[$id])?$meta[$id]:array();
                $is_zb = (!empty($mt['_zb_enabled']) || isset($mt['_zb_cost']) || isset($mt['_zb_ean']));
                $is_vf = (isset($mt['_vf_supplier_sku']) || isset($mt['_vf_qty']));
                $is_leg = (isset($mt['_legacy_source']) || isset($mt['_legacy_manufacturer']));
                $src='unknown';
                if ($is_zb) $src='zb';
                elseif ($is_vf && $is_leg) $src='vf+legacy';
                elseif ($is_vf) $src='vf';
                elseif ($is_leg) $src='legacy';
                $cls[$src]++;
                if (count($bysrc[$src])<60) $bysrc[$src][]=array('id'=>$id,'t'=>substr($titles[$id]??'',0,40),'leg'=>($mt['_legacy_source']??''));
            }
            $out['datagap_sources'] = $cls;
            $out['datagap_examples'] = $bysrc;
        }
    }

    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($out, JSON_UNESCAPED_UNICODE);
    exit;
});
