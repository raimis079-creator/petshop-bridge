import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN;
function ghPut(p,buf,m){const u=`https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/${p}`;let s='';try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:m,content:buf.toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}"`,{maxBuffer:20*1024*1024});}
function sh(c){try{return execSync(c,{maxBuffer:40*1024*1024}).toString();}catch(e){return 'ERR';}}
const AUTH=Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').replace(/\s+/g,'')).toString('base64');
const API='https://dev.avesa.lt/wp-json/code-snippets/v1/snippets';
const out={};
const php=`
add_action('wp_loaded', function(){
	if(!isset($_GET['ps_lt'])||$_GET['ps_lt']!=='Lt5Yy9Pp'){return;}
	global $wpdb; $p=$wpdb->prefix; $o=array();

	// SCENARIJUS: suaugęs 15 kg šuo, normali kūno būklė.
	// TAISYKLE: imam TIK weight_basis='current'. adult_expected lenteles NEGALI dalyvauti.
	$sql = "SELECT t.brand, t.shape, t.weight_basis, t.row_dimension, r.weight_from_kg, r.amount_from_g, r.amount_to_g, r.condition_dimensions
		FROM {$p}ps_feeding_rows r JOIN {$p}ps_feeding_tables t ON t.id=r.feeding_table_id
		WHERE t.status='verified' AND t.species='dog' AND t.weight_basis='current'
		  AND r.weight_from_kg<=15 AND r.weight_to_kg>=15
		ORDER BY t.brand LIMIT 6";
	$o['adult_15kg_CORRECT'] = $wpdb->get_results($sql, ARRAY_A);

	// KAS BUTU BE weight_basis vartu (klaidingas rezultatas)
	$o['without_guard_would_include'] = (int)$wpdb->get_var("SELECT COUNT(*) FROM {$p}ps_feeding_rows r
		JOIN {$p}ps_feeding_tables t ON t.id=r.feeding_table_id
		WHERE t.status='verified' AND t.species='dog' AND t.weight_basis='adult_expected'
		  AND r.weight_from_kg<=15 AND r.weight_to_kg>=15");

	// SUNIUKAS: numatomas suaugęs 15 kg, 4 men.
	$o['puppy_4mo_adult15kg'] = $wpdb->get_results("SELECT t.brand, r.weight_from_kg, r.amount_from_g, r.condition_dimensions
		FROM {$p}ps_feeding_rows r JOIN {$p}ps_feeding_tables t ON t.id=r.feeding_table_id
		WHERE t.status='verified' AND t.weight_basis='adult_expected'
		  AND r.weight_from_kg<=15 AND r.weight_to_kg>=15
		  AND r.condition_dimensions LIKE '%4%' LIMIT 4", ARRAY_A);

	// SKU aprėptis pagal weight_basis
	$o['coverage'] = $wpdb->get_results("SELECT t.weight_basis, t.species, COUNT(DISTINCT m.product_id) skus
		FROM {$p}ps_feeding_map m JOIN {$p}ps_feeding_tables t ON t.id=m.feeding_table_id
		WHERE t.status='verified' GROUP BY t.weight_basis, t.species", ARRAY_A);
	header('Content-Type: application/json'); echo wp_json_encode($o); exit;
});`;
fs.writeFileSync('/tmp/snip.json',JSON.stringify({name:'TEMP M8 LiveTest',code:php,scope:'global',active:true}));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/snip.json "${API}"`);
const r=sh('curl -sk --max-time 120 "https://dev.avesa.lt/?ps_lt=Lt5Yy9Pp"');
try{out.p=JSON.parse(r);}catch(e){out.raw=r.slice(0,600);}
const k=`add_action('wp_loaded',function(){if(!isset($_GET['ps_klt'])||$_GET['ps_klt']!=='Rr3Ww8Yy'){return;}global $wpdb;$n=$wpdb->query("DELETE FROM {$wpdb->prefix}snippets WHERE name LIKE 'TEMP M8%'");echo wp_json_encode(array('d'=>$n));exit;});`;
fs.writeFileSync('/tmp/k.json',JSON.stringify({name:'TEMP M8 Kill LT',code:k,scope:'global',active:true}));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/k.json "${API}"`);
out.cleanup=sh('curl -sk --max-time 25 "https://dev.avesa.lt/?ps_klt=Rr3Ww8Yy"').slice(0,40);
ghPut('screenshots/m8_livetest.json',Buffer.from(JSON.stringify(out)),'live calc test');
console.log('DONE');
