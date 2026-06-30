import { execSync } from "child_process";
import fs from "fs";
const repo = process.env.GH_REPO, tok = process.env.GH_TOKEN;
const WP_USER = process.env.WP_USER, WP_PASS = process.env.WP_APP_PASS;
const BASE = "https://dev.avesa.lt";
const AUTH = "Basic " + Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
function commit(name, str){
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){}
  const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha;
  fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));
  execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'});
}
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000}); }catch(e){ return 'EXC:'+String(e).slice(0,200); } }

// Sukuriu REALŲ testinį pagrindą: 6 paslėpti MnM (400g×{6,12,15} + 800g×{6,12,15})
// + 1 tėvinį su config. Pool filtruojamas pagal gramatūrą iš atributo.
const BUILD = `<?php
add_action('init', function(){
    if (!isset($_GET['build_choice']) || $_GET['build_choice'] !== 'go') return;
    $out = array();
    global $wpdb;
    $table = $wpdb->prefix . 'wc_mnm_child_items';

    // Surenkam pool'us pagal gramatūrą iš kategorijos 73 (Konservai šunims)
    function get_pool_by_gramatura($gramatura_g) {
        $args = array(
            'post_type' => 'product',
            'post_status' => 'publish',
            'posts_per_page' => 30,
            'fields' => 'ids',
            'tax_query' => array(
                array('taxonomy'=>'product_cat', 'field'=>'term_id', 'terms'=>73),
                array('taxonomy'=>'pa_pakuotes_dydis', 'field'=>'name', 'terms'=>$gramatura_g.' g'),
            ),
        );
        $q = new WP_Query($args);
        return $q->posts;
    }

    $pool_400 = get_pool_by_gramatura('400');
    $pool_800 = get_pool_by_gramatura('800');
    $out['pool_400_count'] = count($pool_400);
    $out['pool_800_count'] = count($pool_800);

    // Ribojam pool iki 12 skonių (kad puslapis nebūtų milžiniškas testui)
    $pool_400 = array_slice($pool_400, 0, 12);
    $pool_800 = array_slice($pool_800, 0, 10);

    function make_hidden_mnm($name, $sku, $price, $size, $pool, $table) {
        global $wpdb;
        // Patikrinam ar SKU jau yra
        $existing = wc_get_product_id_by_sku($sku);
        if ($existing) { wp_delete_post($existing, true); }
        $p = new WC_Product_Mix_and_Match();
        $p->set_name($name);
        $p->set_sku($sku);
        $p->set_status('publish');
        $p->set_catalog_visibility('hidden');
        $p->set_price($price);
        $p->set_regular_price($price);
        $p->set_min_container_size($size);
        $p->set_max_container_size($size);
        $p->update_meta_data('_mnm_content_source', 'products');
        $p->update_meta_data('_mnm_per_product_pricing', 'no');
        $p->save();
        $cid = $p->get_id();
        $o = 0;
        foreach ($pool as $pid) { $o++; $wpdb->insert($table, array('product_id'=>$pid,'container_id'=>$cid,'menu_order'=>$o), array('%d','%d','%d')); }
        return $cid;
    }

    // Kainos (testui): 400g pigesni, 800g brangesni; dydžio laipteliai
    $config = array();
    $prices = array(
        '400' => array('6'=>17.99, '12'=>34.99, '15'=>42.99),
        '800' => array('6'=>23.99, '12'=>44.99, '15'=>54.99),
    );
    $pools = array('400'=>$pool_400, '800'=>$pool_800);

    foreach (array('400','800') as $gram) {
        $config[$gram] = array();
        foreach (array('6','12','15') as $size) {
            $price = $prices[$gram][$size];
            $name = "Konservų rinkinys {$gram}g · {$size} vnt (paslėptas)";
            $sku = "HIDDEN-DOG-{$gram}-{$size}";
            $id = make_hidden_mnm($name, $sku, $price, intval($size), $pools[$gram], $table);
            $config[$gram][$size] = array('product_id'=>$id, 'price'=>$price);
        }
    }
    $out['config'] = $config;

    // Tėvinis produktas
    $existing_parent = wc_get_product_id_by_sku('DOG-CHOICE-KONSERVAI');
    if ($existing_parent) { wp_delete_post($existing_parent, true); }
    $parent = new WC_Product_Simple();
    $parent->set_name('Susidėk konservų rinkinį šunims');
    $parent->set_sku('DOG-CHOICE-KONSERVAI');
    $parent->set_status('publish');
    $parent->set_catalog_visibility('visible');
    $parent->set_price($prices['800']['6']);
    $parent->set_category_ids(array(682)); // konservu-rinkiniai
    $parent->save();
    $parent_id = $parent->get_id();
    update_post_meta($parent_id, '_petshop_choice_config', wp_json_encode($config));
    update_post_meta($parent_id, '_petshop_is_choice_bundle', 'yes');
    update_post_meta($parent_id, '_petshop_choice_category', '73'); // šaltinio kategorija
    $out['parent_id'] = $parent_id;
    $out['parent_permalink'] = get_permalink($parent_id);

    update_option('build_choice_result', wp_json_encode($out));
    wp_die('DONE');
});
add_action('init', function(){
    if (!isset($_GET['build_read']) || $_GET['build_read'] !== 'go') return;
    header('Content-Type: application/json');
    echo get_option('build_choice_result', '{}');
    exit;
});
`;
(async()=>{
  const out={ts:new Date().toISOString()};
  fs.writeFileSync('/tmp/snip.json', JSON.stringify({name:'TEMP Build Choice', code: BUILD, desc:'temp', scope:'global', active:true}));
  let raw = exec('curl -sk -X POST -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" -d @/tmp/snip.json "'+BASE+'/wp-json/code-snippets/v1/snippets"');
  let snip; try{ snip=JSON.parse(raw); }catch(e){ snip={}; }
  out.snippet_id = snip && snip.id;
  await new Promise(r=>setTimeout(r,2500));
  exec('curl -sk "'+BASE+'/?build_choice=go" -o /dev/null');
  await new Promise(r=>setTimeout(r,5000));
  const res = exec('curl -sk "'+BASE+'/?build_read=go"');
  try{ out.probe = JSON.parse(res); }catch(e){ out.probe_raw = res.slice(0,2000); }
  if(out.snippet_id) exec('curl -sk -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/'+out.snippet_id+'"');
  commit('build_choice.json', JSON.stringify(out,null,1));
  console.log("DONE");
})();
