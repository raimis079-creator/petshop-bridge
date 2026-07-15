import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN;
function ghPut(p,buf,m){const u=`https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/${p}`;let s='';try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:m,content:buf.toString('base64'),...(s?{sha:s}:{})}));
 const rr=execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null -w "%{http_code}"`).toString();
 console.log('ghPut '+p+' -> '+rr);}
function sh(c){try{return execSync(c,{maxBuffer:40*1024*1024}).toString();}catch(e){return 'ERR';}}
const AUTH=Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').replace(/\s+/g,'')).toString('base64');
const API='https://dev.avesa.lt/wp-json/code-snippets/v1/snippets';
const out={};
try{
const php=`
add_action('wp_loaded', function(){
	if(!isset($_GET['ps_lv'])||$_GET['ps_lv']!=='Lv2Hh6Jj'){return;}
	global $wpdb; $pf=$wpdb->prefix; $o=array();
	$o['adult15'] = $wpdb->get_results("SELECT t.brand,t.shape,r.amount_from_g,r.amount_to_g,r.condition_dimensions
		FROM {$pf}ps_feeding_rows r JOIN {$pf}ps_feeding_tables t ON t.id=r.feeding_table_id
		WHERE t.status='verified' AND t.species='dog' AND t.weight_basis='current'
		AND r.weight_from_kg<=15 AND r.weight_to_kg>=15 ORDER BY t.brand LIMIT 6", ARRAY_A);
	$o['blocked'] = (int)$wpdb->get_var("SELECT COUNT(*) FROM {$pf}ps_feeding_rows r
		JOIN {$pf}ps_feeding_tables t ON t.id=r.feeding_table_id
		WHERE t.status='verified' AND t.species='dog' AND t.weight_basis='adult_expected'
		AND r.weight_from_kg<=15 AND r.weight_to_kg>=15");
	$o['puppy15'] = $wpdb->get_results("SELECT t.brand,r.amount_from_g,r.condition_dimensions
		FROM {$pf}ps_feeding_rows r JOIN {$pf}ps_feeding_tables t ON t.id=r.feeding_table_id
		WHERE t.status='verified' AND t.weight_basis='adult_expected'
		AND r.weight_from_kg<=15 AND r.weight_to_kg>=15 LIMIT 4", ARRAY_A);
	$o['coverage'] = $wpdb->get_results("SELECT t.weight_basis,t.species,COUNT(DISTINCT m.product_id) skus
		FROM {$pf}ps_feeding_map m JOIN {$pf}ps_feeding_tables t ON t.id=m.feeding_table_id
		WHERE t.status='verified' GROUP BY t.weight_basis,t.species", ARRAY_A);
	header('Content-Type: application/json'); echo wp_json_encode($o); exit;
});`;
fs.writeFileSync('/tmp/snip.json',JSON.stringify({name:'TEMP M8 LV',code:php,scope:'global',active:true}));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/snip.json "${API}"`);
const r=sh('curl -sk --max-time 120 "https://dev.avesa.lt/?ps_lv=Lv2Hh6Jj"');
try{out.p=JSON.parse(r);}catch(e){out.raw=r.slice(0,600);}
const k=`add_action('wp_loaded',function(){if(!isset($_GET['ps_klv'])||$_GET['ps_klv']!=='Rr3Ww8Yy'){return;}global $wpdb;$n=$wpdb->query("DELETE FROM {$wpdb->prefix}snippets WHERE name LIKE 'TEMP M8%'");echo wp_json_encode(array('d'=>$n));exit;});`;
fs.writeFileSync('/tmp/k.json',JSON.stringify({name:'TEMP M8 Kill LV',code:k,scope:'global',active:true}));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/k.json "${API}"`);
out.cleanup=sh('curl -sk --max-time 25 "https://dev.avesa.lt/?ps_klv=Rr3Ww8Yy"').slice(0,40);
}catch(err){ out.FATAL=String(err&&err.message?err.message:err).slice(0,300); }
ghPut('screenshots/m8_lv.json',Buffer.from(JSON.stringify(out)),'live test v2');
console.log('DONE');
