import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN;
function ghPut(p,buf,m){const u=`https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/${p}`;let s='';try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:m,content:buf.toString('base64'),...(s?{sha:s}:{})}));
 console.log('put '+execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null -w "%{http_code}"`).toString());}
function sh(c){try{return execSync(c,{maxBuffer:40*1024*1024}).toString();}catch(e){return 'ERR';}}
const AUTH=Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').replace(/\s+/g,'')).toString('base64');
const API='https://dev.avesa.lt/wp-json/code-snippets/v1/snippets';
const out={};
try{
const php=`
add_action('wp_loaded', function(){
	if(!isset($_GET['ps_sf'])||$_GET['ps_sf']!=='Sf9Bb3Rr'){return;}
	global $wpdb; $pf=$wpdb->prefix; $o=array();

	// === 1. AR AS LIECIAU post_content? (produktai keisti siandien) ===
	$o['products_modified_today'] = (int)$wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->posts}
		WHERE post_type='product' AND DATE(post_modified)=CURDATE()");
	$o['products_modified_today_list'] = $wpdb->get_results("SELECT ID,post_title,post_modified FROM {$wpdb->posts}
		WHERE post_type='product' AND DATE(post_modified)=CURDATE() ORDER BY post_modified DESC LIMIT 5", ARRAY_A);
	// revizijos siandien (jei kas rasyta - butu revizija)
	$o['revisions_today'] = (int)$wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->posts}
		WHERE post_type='revision' AND DATE(post_date)=CURDATE()");

	// === 2. AR ps_feeding_* kas nors NAUDOJA? ===
	$refs = array();
	foreach (array('ps_feeding_tables','ps_feeding_rows','ps_feeding_map') as $t) {
		$n = (int)$wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM {$wpdb->prefix}snippets WHERE code LIKE %s", '%'.$t.'%'));
		$refs['snippets_referencing_'.$t] = $n;
	}
	// ar plugin'u kode?
	$hits = array();
	foreach (array('petshop-core','petshop-xml','petshop-esp','petshop-fbt') as $pl) {
		$dir = WP_PLUGIN_DIR.'/'.$pl;
		if(!is_dir($dir)) continue;
		$it = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir));
		foreach($it as $f){ if($f->isFile() && substr($f,-4)==='.php'){
			$c=@file_get_contents($f->getPathname());
			if($c && strpos($c,'ps_feeding')!==false) $hits[]=str_replace(WP_PLUGIN_DIR,'',$f->getPathname()); } }
	}
	$refs['plugin_files_referencing'] = $hits;
	$o['references'] = $refs;

	// === 3. AR TEMP snippetai isvalyti? ===
	$o['temp_snippets_left'] = $wpdb->get_col("SELECT name FROM {$wpdb->prefix}snippets WHERE name LIKE 'TEMP%'");
	$o['active_snippets_total'] = (int)$wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->prefix}snippets WHERE active=1");

	// === 4. Ka istrinsim ===
	$o['to_delete'] = array(
	  'tables'=>(int)$wpdb->get_var("SELECT COUNT(*) FROM {$pf}ps_feeding_tables"),
	  'rows'=>(int)$wpdb->get_var("SELECT COUNT(*) FROM {$pf}ps_feeding_rows"),
	  'map'=>(int)$wpdb->get_var("SELECT COUNT(*) FROM {$pf}ps_feeding_map"),
	);

	// === 5. mb_strpos vs stripos - IRODYMAS ===
	$pid = $wpdb->get_var("SELECT ID FROM {$wpdb->posts} WHERE post_type='product' AND post_status='publish'
		AND post_content LIKE '%Šėrimo instrukcij%' LIMIT 1");
	$c = get_post_field('post_content', $pid);
	$b = stripos($c,'Šėrimo instrukcij');       // BAITAI
	$m = mb_stripos($c,'Šėrimo instrukcij');    // SIMBOLIAI
	$o['offset_proof'] = array('product'=>$pid, 'stripos_bytes'=>$b, 'mb_stripos_chars'=>$m, 'skirtumas'=>$b-$m,
		'BLOGAI_mb_substr_su_stripos'=>mb_substr($c,$b,60),
		'GERAI_mb_substr_su_mb_stripos'=>mb_substr($c,$m,60));
	header('Content-Type: application/json'); echo wp_json_encode($o); exit;
});`;
fs.writeFileSync('/tmp/snip.json',JSON.stringify({name:'TEMP M8 Safety',code:php,scope:'global',active:true}));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/snip.json "${API}"`);
const r=sh('curl -sk --max-time 200 "https://dev.avesa.lt/?ps_sf=Sf9Bb3Rr"');
try{out.p=JSON.parse(r);}catch(e){out.raw=r.slice(0,700);}
const k=`add_action('wp_loaded',function(){if(!isset($_GET['ps_ksf'])||$_GET['ps_ksf']!=='Rr3Ww8Yy'){return;}global $wpdb;$n=$wpdb->query("DELETE FROM {$wpdb->prefix}snippets WHERE name LIKE 'TEMP M8%'");echo wp_json_encode(array('d'=>$n));exit;});`;
fs.writeFileSync('/tmp/k.json',JSON.stringify({name:'TEMP M8 Kill SF',code:k,scope:'global',active:true}));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/k.json "${API}"`);
out.cleanup=sh('curl -sk --max-time 25 "https://dev.avesa.lt/?ps_ksf=Rr3Ww8Yy"').slice(0,40);
}catch(e){out.FATAL=String(e&&e.message?e.message:e).slice(0,300);}
ghPut('screenshots/m8_safety.json',Buffer.from(JSON.stringify(out)),'safety proof');
console.log('DONE');
