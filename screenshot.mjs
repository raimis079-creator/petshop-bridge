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
	if(!isset($_GET['ps_t5'])||$_GET['ps_t5']!=='T5Xx9Mm'){return;}
	if(!isset($_GET['confirm'])||$_GET['confirm']!=='TEST_DELETE_5'){echo 'NO CONFIRM';exit;}
	@set_time_limit(300); global $wpdb; $pf=$wpdb->prefix; $o=array();

	// ===== PRIES =====
	$o['before']=array(
	 't'=>(int)$wpdb->get_var("SELECT COUNT(*) FROM {$pf}ps_feeding_tables"),
	 'r'=>(int)$wpdb->get_var("SELECT COUNT(*) FROM {$pf}ps_feeding_rows"),
	 'm'=>(int)$wpdb->get_var("SELECT COUNT(*) FROM {$pf}ps_feeding_map"));

	// ===== PALYGINIMAS: senas irasas vs naujas parsinimas (mb_strpos) =====
	$sample = $wpdb->get_results("SELECT id,brand,shape,row_count,status FROM {$pf}ps_feeding_tables ORDER BY RAND() LIMIT 5", ARRAY_A);
	$o['compare']=array();
	foreach($sample as $s){
		$pid = $wpdb->get_var($wpdb->prepare("SELECT product_id FROM {$pf}ps_feeding_map WHERE feeding_table_id=%d LIMIT 1",$s['id']));
		if(!$pid) continue;
		$c = get_post_field('post_content',$pid);
		// SENAS budas (blogas)
		$old = mb_substr($c, stripos($c,'Šėrimo instrukcij'));
		$oldTbl = preg_match('/<table.*?<\\/table>/is',$old,$m1) ? $m1[0] : (preg_match('/<table.*?(?=<h[1-6]|$)/is',$old,$m1b) ? $m1b[0] : null);
		// NAUJAS budas (teisingas)
		$new = mb_substr($c, mb_stripos($c,'Šėrimo instrukcij'));
		$newTbl = preg_match('/<table.*?<\\/table>/is',$new,$m2) ? $m2[0] : null;
		$cntOld = $oldTbl ? preg_match_all('/<tr/i',$oldTbl) : 0;
		$cntNew = $newTbl ? preg_match_all('/<tr/i',$newTbl) : 0;
		$o['compare'][]=array('ftid'=>$s['id'],'pid'=>$pid,'brand'=>$s['brand'],'shape'=>$s['shape'],
			'db_rows'=>$s['row_count'],'status'=>$s['status'],
			'OLD_tr_count'=>$cntOld, 'NEW_tr_count'=>$cntNew,
			'OLD_start'=>$oldTbl?mb_substr(trim(preg_replace('/\\s+/u',' ',wp_strip_all_tags($oldTbl))),0,55):'(NERADO)',
			'NEW_start'=>$newTbl?mb_substr(trim(preg_replace('/\\s+/u',' ',wp_strip_all_tags($newTbl))),0,55):'(NERADO)');
	}

	// ===== TESTINIS TRYNIMAS: 5 lenteles =====
	$del = $wpdb->get_col("SELECT id FROM {$pf}ps_feeding_tables ORDER BY id LIMIT 5");
	$in = implode(',', array_map('intval',$del));
	$rows_of_them = (int)$wpdb->get_var("SELECT COUNT(*) FROM {$pf}ps_feeding_rows WHERE feeding_table_id IN ($in)");
	$map_of_them = (int)$wpdb->get_var("SELECT COUNT(*) FROM {$pf}ps_feeding_map WHERE feeding_table_id IN ($in)");
	$dr = $wpdb->query("DELETE FROM {$pf}ps_feeding_rows WHERE feeding_table_id IN ($in)");
	$dm = $wpdb->query("DELETE FROM {$pf}ps_feeding_map  WHERE feeding_table_id IN ($in)");
	$dt = $wpdb->query("DELETE FROM {$pf}ps_feeding_tables WHERE id IN ($in)");
	$o['deleted']=array('ids'=>$del,'tables'=>$dt,'rows'=>$dr,'map'=>$dm,
		'expected_rows'=>$rows_of_them,'expected_map'=>$map_of_them);

	// ===== PO: integralumas =====
	$o['after']=array(
	 't'=>(int)$wpdb->get_var("SELECT COUNT(*) FROM {$pf}ps_feeding_tables"),
	 'r'=>(int)$wpdb->get_var("SELECT COUNT(*) FROM {$pf}ps_feeding_rows"),
	 'm'=>(int)$wpdb->get_var("SELECT COUNT(*) FROM {$pf}ps_feeding_map"),
	 'orphan_rows'=>(int)$wpdb->get_var("SELECT COUNT(*) FROM {$pf}ps_feeding_rows r LEFT JOIN {$pf}ps_feeding_tables t ON t.id=r.feeding_table_id WHERE t.id IS NULL"),
	 'orphan_map'=>(int)$wpdb->get_var("SELECT COUNT(*) FROM {$pf}ps_feeding_map m LEFT JOIN {$pf}ps_feeding_tables t ON t.id=m.feeding_table_id WHERE t.id IS NULL"));
	$o['math_ok'] = ($o['after']['t'] === $o['before']['t']-5)
	             && ($o['after']['r'] === $o['before']['r']-$rows_of_them)
	             && ($o['after']['m'] === $o['before']['m']-$map_of_them)
	             && $o['after']['orphan_rows']===0 && $o['after']['orphan_map']===0;
	// ar produktai gyvi?
	$o['products_alive'] = (int)$wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->posts} WHERE post_type='product' AND post_status='publish'");
	$o['revisions_today'] = (int)$wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->posts} WHERE post_type='revision' AND DATE(post_date)=CURDATE()");
	header('Content-Type: application/json'); echo wp_json_encode($o); exit;
});`;
fs.writeFileSync('/tmp/snip.json',JSON.stringify({name:'TEMP M8 Test5',code:php,scope:'global',active:true}));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/snip.json "${API}"`);
const r=sh('curl -sk --max-time 250 "https://dev.avesa.lt/?ps_t5=T5Xx9Mm&confirm=TEST_DELETE_5"');
try{out.p=JSON.parse(r);}catch(e){out.raw=r.slice(0,700);}
const k=`add_action('wp_loaded',function(){if(!isset($_GET['ps_kt5'])||$_GET['ps_kt5']!=='Rr3Ww8Yy'){return;}global $wpdb;$n=$wpdb->query("DELETE FROM {$wpdb->prefix}snippets WHERE name LIKE 'TEMP M8%'");echo wp_json_encode(array('d'=>$n));exit;});`;
fs.writeFileSync('/tmp/k.json',JSON.stringify({name:'TEMP M8 Kill T5',code:k,scope:'global',active:true}));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/k.json "${API}"`);
out.cleanup=sh('curl -sk --max-time 25 "https://dev.avesa.lt/?ps_kt5=Rr3Ww8Yy"').slice(0,40);
}catch(e){out.FATAL=String(e&&e.message?e.message:e).slice(0,300);}
ghPut('screenshots/m8_test5.json',Buffer.from(JSON.stringify(out)),'test delete 5');
console.log('DONE');
