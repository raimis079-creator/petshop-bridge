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
	if(!isset($_GET['ps_di'])||$_GET['ps_di']!=='Di9Ww4Nn'){return;}
	@set_time_limit(200); global $wpdb; $p=$wpdb->prefix; $o=array();

	// 1) IS KUR 'svoris' cond raktuose?
	$o['bad_cond'] = $wpdb->get_results("SELECT t.shape, t.brand, r.condition_dimensions, COUNT(*) n
		FROM {$p}ps_feeding_rows r JOIN {$p}ps_feeding_tables t ON t.id=r.feeding_table_id
		WHERE r.condition_dimensions LIKE '%svoris%' GROUP BY t.shape, r.condition_dimensions LIMIT 10", ARRAY_A);
	$o['bad_by_shape'] = $wpdb->get_results("SELECT t.shape, COUNT(*) n
		FROM {$p}ps_feeding_rows r JOIN {$p}ps_feeding_tables t ON t.id=r.feeding_table_id
		WHERE r.condition_dimensions LIKE '%svoris%' GROUP BY t.shape", ARRAY_A);

	// 2) row_dimension_unknown — kokios EILUCIU etiketes?
	$ts = $wpdb->get_results("SELECT id, brand, source_url FROM {$p}ps_feeding_tables
		WHERE shape='transposed' AND reason='row_dimension_unknown' LIMIT 12", ARRAY_A);
	$o['unknown_labels'] = array();
	foreach ($ts as $t) {
		$pid = $wpdb->get_var($wpdb->prepare("SELECT product_id FROM {$p}ps_feeding_map WHERE feeding_table_id=%d LIMIT 1",$t['id']));
		if(!$pid){ // map tuscias (nes ambiguous irasem be map? ne - irasem) -> imam per source_url
			$o['unknown_labels'][] = array('brand'=>$t['brand'],'note'=>'no map row','url'=>$t['source_url']); continue; }
		$c = get_post_field('post_content', $pid);
		$full = mb_substr($c, stripos($c,'Šėrimo instrukcij'));
		$tbl=null;
		if(preg_match('/<table.*?<\\/table>/is',$full,$m)) $tbl=$m[0];
		elseif(preg_match('/<table.*?(?=<h[1-6]|$)/is',$full,$m)) $tbl=$m[0];
		if(!$tbl) continue;
		preg_match_all('/<tr.*?(?:<\\/tr>|$)/is',$tbl,$trs);
		$hdr=array(); $labels=array();
		foreach($trs[0] as $i=>$row){
			preg_match_all('/<t[dh][^>]*>(.*?)<\\/t[dh]>/is',$row,$mm);
			$cells=array_map(function($x){return trim(preg_replace('/\\s+/u',' ',html_entity_decode(wp_strip_all_tags($x))));},$mm[1]);
			if($i===0) $hdr=$cells; elseif(isset($cells[0])&&$cells[0]!=='') $labels[]=$cells[0];
		}
		$o['unknown_labels'][] = array('brand'=>$t['brand'],'title'=>mb_substr(get_the_title($pid),0,42),
			'h0'=>$hdr[0]??'', 'hdr'=>array_slice($hdr,0,5), 'labels'=>array_slice($labels,0,6));
	}
	header('Content-Type: application/json'); echo wp_json_encode($o); exit;
});`;
fs.writeFileSync('/tmp/snip.json',JSON.stringify({name:'TEMP M8 Diag',code:php,scope:'global',active:true}));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/snip.json "${API}"`);
const r=sh('curl -sk --max-time 180 "https://dev.avesa.lt/?ps_di=Di9Ww4Nn"');
try{out.p=JSON.parse(r);}catch(e){out.raw=r.slice(0,700);}
const k=`add_action('wp_loaded',function(){if(!isset($_GET['ps_kdi'])||$_GET['ps_kdi']!=='Rr3Ww8Yy'){return;}global $wpdb;$n=$wpdb->query("DELETE FROM {$wpdb->prefix}snippets WHERE name LIKE 'TEMP M8%'");echo wp_json_encode(array('d'=>$n));exit;});`;
fs.writeFileSync('/tmp/k.json',JSON.stringify({name:'TEMP M8 Kill DI',code:k,scope:'global',active:true}));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/k.json "${API}"`);
sh('curl -sk --max-time 25 "https://dev.avesa.lt/?ps_kdi=Rr3Ww8Yy"');
ghPut('screenshots/m8_diag.json',Buffer.from(JSON.stringify(out)),'diag');
console.log('DONE');
