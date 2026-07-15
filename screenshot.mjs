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
	if ( ! isset($_GET['ps_fd2']) || $_GET['ps_fd2'] !== 'Fd2Kk8Ll' ) { return; }
	global $wpdb;
	$o = array();
	// Kiek produktu turi turinyje "Rekomenduojama paros doz" ar pan. (recon zinojo si fraze)
	$cnt1 = $wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->posts} WHERE post_type='product' AND post_status='publish' AND post_content LIKE '%Rekomenduojama paros doz%'");
	$o['has_dozavimas_phrase'] = (int) $cnt1;
	$cnt2 = $wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->posts} WHERE post_type='product' AND post_status='publish' AND post_content LIKE '%šėrimo lentel%'");
	$o['has_serimo_lentele_phrase'] = (int) $cnt2;
	$cnt3 = $wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->posts} WHERE post_type='product' AND post_status='publish' AND post_content LIKE '%g/parai%'");
	$o['has_g_parai'] = (int) $cnt3;
	// Josera pavyzdys — realiai isvest turini
	$q = new WP_Query(array('post_type'=>'product','post_status'=>'publish','s'=>'josera','posts_per_page'=>1));
	if ($q->posts) {
		$content = $q->posts[0]->post_content;
		$o['sample_id'] = $q->posts[0]->ID;
		$o['sample_title'] = $q->posts[0]->post_title;
		$pos = stripos($content, 'doz');
		$o['sample_snippet'] = $pos !== false ? mb_substr($content, max(0,$pos-100), 500) : 'nerasta "doz" zodzio';
		$o['content_length'] = mb_strlen($content);
	}
	header('Content-Type: application/json'); echo wp_json_encode($o); exit;
});`;
fs.writeFileSync('/tmp/snip.json', JSON.stringify({ name:'TEMP M8 Feed2', code:php, scope:'global', active:true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/snip.json "${API}"`);
const r = sh('curl -sk --max-time 40 "https://dev.avesa.lt/?ps_fd2=Fd2Kk8Ll"');
try { out.p = JSON.parse(r); } catch(e){ out.raw = r.slice(0,400); }
const kphp = `add_action('wp_loaded', function(){ if(!isset($_GET['ps_kc'])||$_GET['ps_kc']!=='Rr3Ww8Yy'){return;} global $wpdb; $n=$wpdb->query("DELETE FROM {$wpdb->prefix}snippets WHERE name LIKE 'TEMP M8%'"); echo wp_json_encode(array('d'=>$n)); exit; });`;
fs.writeFileSync('/tmp/k.json', JSON.stringify({ name:'TEMP M8 Kill wC', code:kphp, scope:'global', active:true }));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/k.json "${API}"`);
sh('curl -sk --max-time 25 "https://dev.avesa.lt/?ps_kc=Rr3Ww8Yy"');
ghPut('screenshots/m8_feed2.json', Buffer.from(JSON.stringify(out)), 'feed2');
console.log('DONE');
