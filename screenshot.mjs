import { execSync } from 'child_process';
import fs from 'fs';
const TOKG = process.env.GH_TOKEN;
function ghPut(p, buf, m) {
  const url = `https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/${p}`;
  let sha=''; try { const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${url}"`).toString()); if(j.sha) sha=j.sha; } catch(e){}
  fs.writeFileSync('/tmp/p.json', JSON.stringify({ message: m, content: buf.toString('base64'), ...(sha?{sha}:{}) }));
  execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${url}"`, {maxBuffer:20*1024*1024});
}
function sh(c){ try { return execSync(c,{maxBuffer:20*1024*1024}).toString(); } catch(e){ return 'ERR'; } }
const AUTH = Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').replace(/\s+/g,'')).toString('base64');
const API = 'https://dev.avesa.lt/wp-json/code-snippets/v1/snippets';
const out = {};
const php = `
add_action('wp_loaded', function(){
	if ( ! isset($_GET['ps_food']) || $_GET['ps_food'] !== 'Fd4Sr8Ch' ) { return; }
	$o = array();
	// pa_gyvuno_rusis terminai
	$terms = get_terms(array('taxonomy'=>'pa_gyvuno_rusis','hide_empty'=>true));
	if (!is_wp_error($terms)) foreach ($terms as $t) $o['rusys'][] = array('slug'=>$t->slug,'name'=>$t->name,'count'=>$t->count);
	// Pavyzdine produkto paieska: "josera" + suo
	$q = new WP_Query(array(
		'post_type'=>'product', 'post_status'=>'publish', 's'=>'josera', 'posts_per_page'=>5,
		'tax_query'=>array(array('taxonomy'=>'pa_gyvuno_rusis','field'=>'slug','terms'=>array('sunims','suo','sunys'),'operator'=>'IN')),
	));
	$o['search_found'] = $q->found_posts;
	foreach ($q->posts as $p) {
		$brands = wp_get_object_terms($p->ID, 'product_brand', array('fields'=>'names'));
		$o['sample'][] = array('id'=>$p->ID,'title'=>$p->post_title,'brand'=>is_wp_error($brands)?null:implode(',',$brands));
	}
	// Be tax_query — gal slug kitoks
	$q2 = new WP_Query(array('post_type'=>'product','post_status'=>'publish','s'=>'josera','posts_per_page'=>3));
	$o['search_no_tax'] = $q2->found_posts;
	foreach ($q2->posts as $p) {
		$rus = wp_get_object_terms($p->ID, 'pa_gyvuno_rusis', array('fields'=>'slugs'));
		$o['sample2'][] = array('id'=>$p->ID,'title'=>mb_substr($p->post_title,0,60),'rusis'=>is_wp_error($rus)?null:implode(',',$rus));
	}
	header('Content-Type: application/json'); echo wp_json_encode($o); exit;
});`;
fs.writeFileSync('/tmp/snip.json', JSON.stringify({ name:'TEMP M8 Food', code:php, scope:'global', active:true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/snip.json "${API}"`);
const r = sh('curl -sk --max-time 40 "https://dev.avesa.lt/?ps_food=Fd4Sr8Ch"');
try { out.p = JSON.parse(r); } catch(e){ out.raw = r.slice(0,400); }
const kphp = `add_action('wp_loaded', function(){ if(!isset($_GET['ps_k1'])||$_GET['ps_k1']!=='Rr3Ww8Yy'){return;} global $wpdb; $n=$wpdb->query("DELETE FROM {$wpdb->prefix}snippets WHERE name LIKE 'TEMP M8%'"); echo wp_json_encode(array('d'=>$n)); exit; });`;
fs.writeFileSync('/tmp/k.json', JSON.stringify({ name:'TEMP M8 Kill w1', code:kphp, scope:'global', active:true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/k.json "${API}"`);
sh('curl -sk --max-time 25 "https://dev.avesa.lt/?ps_k1=Rr3Ww8Yy"');
ghPut('screenshots/m8_food.json', Buffer.from(JSON.stringify(out)), 'food');
console.log('DONE');
