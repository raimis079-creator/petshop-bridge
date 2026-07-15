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
	if(!isset($_GET['ps_fin'])||$_GET['ps_fin']!=='Fn7Cc2Ww'){return;}
	@set_time_limit(400); $o=array();
	$ids=get_posts(array('post_type'=>'product','post_status'=>'publish','posts_per_page'=>-1,'fields'=>'ids',
		'tax_query'=>array(array('taxonomy'=>'product_cat','field'=>'slug','terms'=>array('sausas-maistas-sunims','sausas-maistas-katems')))));
	$tot=0; $has=0; $miss=array(); $vet=0; $bybrand=array();
	foreach($ids as $id){
		if(get_post_meta($id,'_stock_status',true)!=='instock') continue;
		$tot++;
		$c=get_post_field('post_content',$id);
		$b=wp_get_object_terms($id,'product_brand',array('fields'=>'names'));
		$bn=(!is_wp_error($b)&&$b)?$b[0]:'(be brendo)';
		if(!isset($bybrand[$bn])) $bybrand[$bn]=array('t'=>0,'ok'=>0,'vet'=>0,'none'=>0);
		$bybrand[$bn]['t']++;
		$pos = mb_stripos($c,'Šėrimo instrukcij');  // TEISINGAI: mb_
		if($pos===false){ $bybrand[$bn]['none']++; $miss[]=$id; continue; }
		$full = mb_substr($c,$pos);
		// lentele SU teisingu offsetu
		$hasT = preg_match('/<table.*?<\\/table>/is',$full) || preg_match('/<tr.*?<\\/tr>.*<tr/is',$full);
		if($hasT){ $has++; $bybrand[$bn]['ok']++; }
		else {
			if(mb_stripos($full,'veterinar')!==false){ $vet++; $bybrand[$bn]['vet']++; }
			else { $bybrand[$bn]['none']++; $miss[]=$id; }
		}
	}
	uasort($bybrand,function($a,$b){return $b['t']-$a['t'];});
	$o['instock_total']=$tot;
	$o['HAS_table']=$has;
	$o['vet_text_no_table']=$vet;   // samoningai be normos
	$o['MISSING']=count($miss);
	$o['by_brand']=array_slice($bybrand,0,18,true);
	// truksta - pavyzdziai
	$o['missing_sample']=array();
	foreach(array_slice($miss,0,8) as $id) $o['missing_sample'][]=array('id'=>$id,'t'=>mb_substr(get_the_title($id),0,50));
	header('Content-Type: application/json'); echo wp_json_encode($o); exit;
});`;
fs.writeFileSync('/tmp/snip.json',JSON.stringify({name:'TEMP M8 Final',code:php,scope:'global',active:true}));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/snip.json "${API}"`);
const r=sh('curl -sk --max-time 280 "https://dev.avesa.lt/?ps_fin=Fn7Cc2Ww"');
try{out.p=JSON.parse(r);}catch(e){out.raw=r.slice(0,500);}
const k=`add_action('wp_loaded',function(){if(!isset($_GET['ps_kfn'])||$_GET['ps_kfn']!=='Rr3Ww8Yy'){return;}global $wpdb;$n=$wpdb->query("DELETE FROM {$wpdb->prefix}snippets WHERE name LIKE 'TEMP M8%'");echo wp_json_encode(array('d'=>$n));exit;});`;
fs.writeFileSync('/tmp/k.json',JSON.stringify({name:'TEMP M8 Kill FN',code:k,scope:'global',active:true}));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/k.json "${API}"`);
out.cleanup=sh('curl -sk --max-time 25 "https://dev.avesa.lt/?ps_kfn=Rr3Ww8Yy"').slice(0,40);
}catch(e){out.FATAL=String(e&&e.message?e.message:e).slice(0,300);}
ghPut('screenshots/m8_final_recon.json',Buffer.from(JSON.stringify(out)),'final recon mb_stripos');
console.log('DONE');
