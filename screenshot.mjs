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
	if ( ! isset($_GET['ps_fd3']) || $_GET['ps_fd3'] !== 'Fd3Mm5Nn' ) { return; }
	global $wpdb;
	$o = array();
	// Susiaurinam iki SAUSO maisto kategorijos (jei tokia yra)
	$cats = get_terms(array('taxonomy'=>'product_cat','hide_empty'=>false,'search'=>'sausas'));
	if (!is_wp_error($cats)) foreach ($cats as $c) $o['dry_cats'][] = array('id'=>$c->term_id,'name'=>$c->name,'slug'=>$c->slug,'count'=>$c->count);

	// Alternatyvios fraziu formos
	$phrases = array('Dozavimas','dozavimo lentel','Šėrimo rekomendacij','Paros racionas','g per dien','Feeding','FEEDING GUIDE','kg / g');
	foreach ($phrases as $ph) {
		$cnt = $wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM {$wpdb->posts} WHERE post_type='product' AND post_status='publish' AND post_content LIKE %s", '%'.$wpdb->esc_like($ph).'%'));
		$o['phrase_counts'][$ph] = (int) $cnt;
	}

	// Accordion snippet paieska
	$snip = $wpdb->get_row("SELECT id, name FROM {$wpdb->prefix}snippets WHERE name LIKE '%512%' OR name LIKE '%ccordion%' LIMIT 1");
	$o['accordion_snippet'] = $snip;

	// pa_pakuotes_dydis produktai su "Rekomenduojama paros doz" -> ar tai butent sausas maistas
	$withdoz = new WP_Query(array('post_type'=>'product','post_status'=>'publish','posts_per_page'=>3,
		's'=>'', 'meta_query'=>array()));
	$q2 = $wpdb->get_results("SELECT ID, post_title FROM {$wpdb->posts} WHERE post_type='product' AND post_status='publish' AND post_content LIKE '%Rekomenduojama paros doz%' LIMIT 5");
	$o['doz_examples'] = $q2;

	header('Content-Type: application/json'); echo wp_json_encode($o); exit;
});`;
fs.writeFileSync('/tmp/snip.json', JSON.stringify({ name:'TEMP M8 Feed3', code:php, scope:'global', active:true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/snip.json "${API}"`);
const r = sh('curl -sk --max-time 40 "https://dev.avesa.lt/?ps_fd3=Fd3Mm5Nn"');
try { out.p = JSON.parse(r); } catch(e){ out.raw = r.slice(0,400); }
const kphp = `add_action('wp_loaded', function(){ if(!isset($_GET['ps_kd'])||$_GET['ps_kd']!=='Rr3Ww8Yy'){return;} global $wpdb; $n=$wpdb->query("DELETE FROM {$wpdb->prefix}snippets WHERE name LIKE 'TEMP M8%'"); echo wp_json_encode(array('d'=>$n)); exit; });`;
fs.writeFileSync('/tmp/k.json', JSON.stringify({ name:'TEMP M8 Kill wD', code:kphp, scope:'global', active:true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/k.json "${API}"`);
sh('curl -sk --max-time 25 "https://dev.avesa.lt/?ps_kd=Rr3Ww8Yy"');
ghPut('screenshots/m8_feed3.json', Buffer.from(JSON.stringify(out)), 'feed3');
console.log('DONE');
