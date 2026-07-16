import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN;
function ghPut(p,buf,m){const u=`https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/${p}`;let s='';try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:m,content:buf.toString('base64'),...(s?{sha:s}:{})}));
 console.log('GHPUT '+execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null -w "%{http_code}"`).toString());}
function sh(c){try{return execSync(c,{maxBuffer:40*1024*1024}).toString();}catch(e){return 'ERR';}}
const AUTH=Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').replace(/\s+/g,'')).toString('base64');
const API='https://dev.avesa.lt/wp-json/code-snippets/v1/snippets';
const out={};
try{
const php=`
add_action('wp_loaded', function(){
	if(!isset($_GET['ps_mp'])||$_GET['ps_mp']!=='Mp2Ss8Hh'){return;}
	@set_time_limit(400); global $wpdb; $pf=$wpdb->prefix; $o=array();
	$apply = (isset($_GET['confirm']) && $_GET['confirm']==='APPLY_MULTIPACK');
	$o['mode'] = $apply ? 'APPLY' : 'DRY-RUN';

	// produktai BE lenteles (turi fraze arba ne), sauso maisto, instock
	$ids=get_posts(array('post_type'=>'product','post_status'=>'publish','posts_per_page'=>-1,'fields'=>'ids',
		'tax_query'=>array(array('taxonomy'=>'product_cat','field'=>'slug','terms'=>array('sausas-maistas-sunims','sausas-maistas-katems')))));
	$mapped = $wpdb->get_col("SELECT DISTINCT product_id FROM {$pf}ps_feeding_map");
	$mapped = array_flip(array_map('intval',$mapped));

	// normalizavimas: nuimam pakuotes dydi ir akcijos zymas
	$norm = function($t){
		$t = mb_strtolower(html_entity_decode($t));
		$t = preg_replace('/\\d+[\\s]*[\\+][\\s]*\\d+\\s*kg/u','',$t);      // "15+3kg"
		$t = preg_replace('/\\d+[.,]?\\d*\\s*kg/u','',$t);                  // "2,7 kg"
		$t = preg_replace('/\\d+[.,]?\\d*\\s*g\\b/u','',$t);
		$t = preg_replace('/akcij\\w*|nemokam\\w*|dovan\\w*|\\bx\\s*\\d+\\b|\\d+\\s*vnt/u','',$t);
		$t = preg_replace('/[^\\p{L}\\p{N}]+/u',' ',$t);
		return trim(preg_replace('/\\s+/u',' ',$t)); };

	// donorai: produktai SU verified lentele
	$donors=array();
	$dr = $wpdb->get_results("SELECT m.product_id, m.feeding_table_id FROM {$pf}ps_feeding_map m
		JOIN {$pf}ps_feeding_tables t ON t.id=m.feeding_table_id WHERE t.status='verified'", ARRAY_A);
	foreach($dr as $d){
		$k = $norm(get_the_title($d['product_id']));
		if($k==='') continue;
		if(!isset($donors[$k])) $donors[$k]=array('ftid'=>$d['feeding_table_id'],'src'=>$d['product_id']);
	}
	$o['donor_keys']=count($donors);

	// kandidatai: be map, bet normalizuotas pav. sutampa su donoru
	$pairs=array(); $nomatch=array();
	foreach($ids as $id){
		if(get_post_meta($id,'_stock_status',true)!=='instock') continue;
		if(isset($mapped[$id])) continue;
		$c=get_post_field('post_content',$id);
		if(mb_stripos($c,'veterinar')!==false && mb_stripos($c,'Šėrimo instrukcij')!==false) continue; // vet dieta
		$k=$norm(get_the_title($id));
		if(isset($donors[$k])){
			$pairs[]=array('pid'=>$id,'title'=>mb_substr(get_the_title($id),0,52),
				'ftid'=>$donors[$k]['ftid'],'donor'=>mb_substr(get_the_title($donors[$k]['src']),0,52),'key'=>$k);
		} else { if(count($nomatch)<10) $nomatch[]=array('id'=>$id,'t'=>mb_substr(get_the_title($id),0,50),'k'=>$k); }
	}
	$o['pairs_found']=count($pairs);
	$o['pairs']=array_slice($pairs,0,12);
	$o['nomatch_sample']=$nomatch;

	// pagal brenda
	$bb=array();
	foreach($pairs as $p2){ $b=wp_get_object_terms($p2['pid'],'product_brand',array('fields'=>'names'));
		$bn=(!is_wp_error($b)&&$b)?$b[0]:'(be)'; if(!isset($bb[$bn]))$bb[$bn]=0; $bb[$bn]++; }
	arsort($bb); $o['by_brand']=$bb;

	if($apply){
		$n=0;
		foreach($pairs as $p2){
			$e=$wpdb->get_var($wpdb->prepare("SELECT COUNT(*) FROM {$pf}ps_feeding_map WHERE feeding_table_id=%d AND product_id=%d",$p2['ftid'],$p2['pid']));
			if(!$e && $wpdb->insert($pf.'ps_feeding_map',array('feeding_table_id'=>$p2['ftid'],'product_id'=>$p2['pid']))) $n++;
		}
		// scope -> 'line' visoms, kurios dabar dengia >1 produkta
		$wpdb->query("UPDATE {$pf}ps_feeding_tables t SET scope='line'
			WHERE (SELECT COUNT(*) FROM {$pf}ps_feeding_map m WHERE m.feeding_table_id=t.id)>1");
		$o['inserted_map']=$n;
		$o['after']=array(
		 'SKU_verified'=>(int)$wpdb->get_var("SELECT COUNT(DISTINCT m.product_id) FROM {$pf}ps_feeding_map m JOIN {$pf}ps_feeding_tables t ON t.id=m.feeding_table_id WHERE t.status='verified'"),
		 'SKU_any'=>(int)$wpdb->get_var("SELECT COUNT(DISTINCT product_id) FROM {$pf}ps_feeding_map"),
		 'orphan_map'=>(int)$wpdb->get_var("SELECT COUNT(*) FROM {$pf}ps_feeding_map m LEFT JOIN {$pf}ps_feeding_tables t ON t.id=m.feeding_table_id WHERE t.id IS NULL"),
		 'scope_line'=>(int)$wpdb->get_var("SELECT COUNT(*) FROM {$pf}ps_feeding_tables WHERE scope='line'"));
	}
	header('Content-Type: application/json'); echo wp_json_encode($o); exit;
});`;
fs.writeFileSync('/tmp/snip.json',JSON.stringify({name:'TEMP M8 Multipack',code:php,scope:'global',active:true}));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/snip.json "${API}"`);
out.dry=JSON.parse(sh('curl -sk --max-time 300 "https://dev.avesa.lt/?ps_mp=Mp2Ss8Hh"'));
ghPut('screenshots/m8_mp_dry.json',Buffer.from(JSON.stringify(out.dry)),'multipack dry');
console.log('DRY: pairs='+out.dry.pairs_found);
}catch(e){out.FATAL=String(e&&e.message?e.message:e).slice(0,300);}
ghPut('screenshots/m8_mp.json',Buffer.from(JSON.stringify(out)),'multipack dry-run');
console.log('DONE');
