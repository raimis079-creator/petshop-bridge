import { execSync } from 'child_process';
import fs from 'fs';
const TOKG = process.env.GH_TOKEN;
function ghPut(p,buf,m){const u=`https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/${p}`;let s='';try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:m,content:buf.toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}"`,{maxBuffer:20*1024*1024});}
function sh(c){try{return execSync(c,{maxBuffer:40*1024*1024}).toString();}catch(e){return 'ERR';}}
const AUTH=Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').replace(/\s+/g,'')).toString('base64');
const API='https://dev.avesa.lt/wp-json/code-snippets/v1/snippets';
const out={};
const php=`
add_action('wp_loaded', function(){
	if(!isset($_GET['ps_sem'])||$_GET['ps_sem']!=='Sm3Vv7Bb'){return;}
	@set_time_limit(200); global $wpdb; $p=$wpdb->prefix; $o=array();

	// Imam transposed lenteles is DB + ju SKU
	$ts = $wpdb->get_results("SELECT t.id,t.brand,t.species,t.source_url,
		(SELECT product_id FROM {$p}ps_feeding_map WHERE feeding_table_id=t.id LIMIT 1) pid
		FROM {$p}ps_feeding_tables t WHERE t.shape='transposed' AND t.status='verified' LIMIT 40", ARRAY_A);

	$o['examined'] = count($ts);
	$o['cases'] = array();
	$puppy=0; $adult_word=0; $unclear=0;

	foreach ($ts as $t) {
		$pid = $t['pid']; if(!$pid) continue;
		$c = get_post_field('post_content', $pid);
		$pos = stripos($c,'Šėrimo instrukcij');
		$chunk = mb_substr($c, max(0,$pos-400), 3000);
		$txt = trim(preg_replace('/\\s+/u',' ', wp_strip_all_tags($chunk)));
		$title = get_the_title($pid);

		// KRITINIS: ar antrastes tekste minimas "suaugusio" / "numatomas"?
		$hint = '';
		if (preg_match('/(suaugusio|numatom|galutin|expected|adult)[^.]{0,60}/iu', $txt, $mm)) { $hint = $mm[0]; $adult_word++; }
		// ar produktas SUNIUKAMS?
		$is_puppy = (bool)preg_match('/puppy|junior|kitten|kačiuk|šuniuk|starter|growth/iu', $title);
		if ($is_puppy) $puppy++;
		if (!$hint) $unclear++;

		// pirmos 2 duomenu eilutes is DB
		$rr = $wpdb->get_results($wpdb->prepare("SELECT weight_from_kg,amount_from_g,condition_dimensions
			FROM {$p}ps_feeding_rows WHERE feeding_table_id=%d ORDER BY row_order LIMIT 3", $t['id']), ARRAY_A);

		if (count($o['cases']) < 6) {
			$o['cases'][] = array('title'=>mb_substr($title,0,52), 'is_puppy_product'=>$is_puppy,
				'hint'=>$hint ?: '(nerasta užuominos)', 'rows'=>$rr,
				'ctx'=>mb_substr($txt, 0, 230));
		}
	}
	$o['summary'] = array('puppy_products'=>$puppy, 'has_adult_hint'=>$adult_word, 'no_hint'=>$unclear);
	header('Content-Type: application/json'); echo wp_json_encode($o); exit;
});`;
fs.writeFileSync('/tmp/snip.json',JSON.stringify({name:'TEMP M8 Sem',code:php,scope:'global',active:true}));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/snip.json "${API}"`);
const r=sh('curl -sk --max-time 180 "https://dev.avesa.lt/?ps_sem=Sm3Vv7Bb"');
try{out.p=JSON.parse(r);}catch(e){out.raw=r.slice(0,700);}
const k=`add_action('wp_loaded',function(){if(!isset($_GET['ps_ksm'])||$_GET['ps_ksm']!=='Rr3Ww8Yy'){return;}global $wpdb;$n=$wpdb->query("DELETE FROM {$wpdb->prefix}snippets WHERE name LIKE 'TEMP M8%'");echo wp_json_encode(array('d'=>$n));exit;});`;
fs.writeFileSync('/tmp/k.json',JSON.stringify({name:'TEMP M8 Kill SM',code:k,scope:'global',active:true}));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/k.json "${API}"`);
out.cleanup=sh('curl -sk --max-time 25 "https://dev.avesa.lt/?ps_ksm=Rr3Ww8Yy"').slice(0,40);
ghPut('screenshots/m8_sem.json',Buffer.from(JSON.stringify(out)),'transposed semantics check');
console.log('DONE');
