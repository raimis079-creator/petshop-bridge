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
	if(!isset($_GET['ps_ex'])||$_GET['ps_ex']!=='Ex4Pp7Nn'){return;}
	@set_time_limit(400); global $wpdb; $pf=$wpdb->prefix; $o=array();
	$ids=get_posts(array('post_type'=>'product','post_status'=>'publish','posts_per_page'=>-1,'fields'=>'ids',
		'tax_query'=>array(array('taxonomy'=>'product_cat','field'=>'slug','terms'=>array('sausas-maistas-sunims','sausas-maistas-katems')))));
	$mapped=array_flip(array_map('intval',$wpdb->get_col("SELECT DISTINCT product_id FROM {$pf}ps_feeding_map")));
	$has=array(); $miss=array();
	foreach($ids as $id){
		if(get_post_meta($id,'_stock_status',true)!=='instock') continue;
		$b=wp_get_object_terms($id,'product_brand',array('fields'=>'names'));
		$bn=(!is_wp_error($b)&&$b)?$b[0]:'';
		$mf=get_post_meta($id,'_legacy_manufacturer',true);
		if(stripos($bn,'exclusion')===false && stripos($mf,'exclusion')===false && stripos(get_the_title($id),'exclusion')===false) continue;
		$c=get_post_field('post_content',$id);
		$phrase = (mb_stripos($c,'Šėrimo instrukcij')!==false);
		$vet = (mb_stripos($c,'veterinar')!==false);
		$sku = get_post_meta($id,'_sku',true);
		$rec=array('id'=>$id,'sku'=>$sku,'t'=>mb_substr(get_the_title($id),0,58),'phrase'=>$phrase,'vet'=>$vet,
			'species'=>has_term('sausas-maistas-katems','product_cat',$id)?'cat':'dog','manuf'=>$mf);
		if(isset($mapped[$id])) $has[]=$rec; else $miss[]=$rec;
	}
	$o['HAS_count']=count($has); $o['MISS_count']=count($miss);
	$o['HAS']=$has;
	$o['MISS']=array_slice($miss,0,50);
	// kaip atrodo tie, kurie TURI (formatas, kuri reikes atkartoti)
	$o['sample_good']=array();
	foreach(array_slice($has,0,2) as $h){
		$c=get_post_field('post_content',$h['id']);
		$pos=mb_stripos($c,'Šėrimo instrukcij');
		$o['sample_good'][]=array('id'=>$h['id'],'t'=>$h['t'],'html'=>mb_substr($c,$pos,900));
	}
	// ka turi tie, kurie NETURI (ar yra fraze? kas vietoj lenteles?)
	$o['sample_miss']=array();
	foreach(array_slice($miss,0,3) as $m2){
		$c=get_post_field('post_content',$m2['id']);
		$pos=mb_stripos($c,'Šėrimo instrukcij');
		$o['sample_miss'][]=array('id'=>$m2['id'],'t'=>$m2['t'],'phrase'=>$m2['phrase'],
			'chunk'=> $pos!==false ? mb_substr($c,$pos,500) : mb_substr($c,0,400));
	}
	// linijos
	$lines=array();
	foreach($miss as $m2){ if(preg_match('/(Hypoallergenic|Mediterraneo|Diet|Vet Diet|Formula|Monoprotein|Noble Grain|Ancestral)/iu',$m2['t'],$mm)){
		$k=$mm[1]; if(!isset($lines[$k]))$lines[$k]=0; $lines[$k]++; } }
	$o['lines_missing']=$lines;
	header('Content-Type: application/json'); echo wp_json_encode($o); exit;
});`;
fs.writeFileSync('/tmp/snip.json',JSON.stringify({name:'TEMP M8 Excl',code:php,scope:'global',active:true}));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/snip.json "${API}"`);
const r=sh('curl -sk --max-time 300 "https://dev.avesa.lt/?ps_ex=Ex4Pp7Nn"');
try{out.p=JSON.parse(r);}catch(e){out.raw=r.slice(0,600);}
const k=`add_action('wp_loaded',function(){if(!isset($_GET['ps_kex'])||$_GET['ps_kex']!=='Rr3Ww8Yy'){return;}global $wpdb;$n=$wpdb->query("DELETE FROM {$wpdb->prefix}snippets WHERE name LIKE 'TEMP M8%'");echo wp_json_encode(array('d'=>$n));exit;});`;
fs.writeFileSync('/tmp/k.json',JSON.stringify({name:'TEMP M8 Kill EX',code:k,scope:'global',active:true}));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/k.json "${API}"`);
out.cleanup=sh('curl -sk --max-time 25 "https://dev.avesa.lt/?ps_kex=Rr3Ww8Yy"').slice(0,40);
}catch(e){out.FATAL=String(e&&e.message?e.message:e).slice(0,300);}
ghPut('screenshots/m8_excl.json',Buffer.from(JSON.stringify(out)),'exclusion recon');
console.log('DONE');
