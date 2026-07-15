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
	if(!isset($_GET['ps_rw'])||$_GET['ps_rw']!=='Rw7Kk3Ff'){return;}
	@set_time_limit(200); $o=array('cases'=>array(),'patterns'=>array());
	$ids=get_posts(array('post_type'=>'product','post_status'=>'publish','posts_per_page'=>-1,'fields'=>'ids',
		'tax_query'=>array(array('taxonomy'=>'product_cat','field'=>'slug','terms'=>array('sausas-maistas-sunims','sausas-maistas-katems')))));
	$pat=array('escaped_lt'=>0,'no_close'=>0,'has_tr'=>0,'has_td'=>0,'nothing'=>0,'vet_text'=>0,'total'=>0);
	foreach($ids as $id){
		if(get_post_meta($id,'_stock_status',true)!=='instock') continue;
		$c=get_post_field('post_content',$id);
		if(stripos($c,'Šėrimo instrukcij')===false) continue;
		$full=mb_substr($c, stripos($c,'Šėrimo instrukcij'));
		// jau pagaunami -> praleidziam
		if(preg_match('/<table.*?<\\/table>/is',$full)) continue;
		if(preg_match('/<table.*?(?=<h[1-6]|$)/is',$full)) continue;
		$pat['total']++;
		// KOKIE POZYMIAI?
		if(strpos($full,'&lt;table')!==false)  $pat['escaped_lt']++;
		if(stripos($full,'<table')!==false)    $pat['no_close']++;
		if(stripos($full,'<tr')!==false)       $pat['has_tr']++;
		if(stripos($full,'<td')!==false)       $pat['has_td']++;
		if(stripos($full,'veterinarijos gydytoj')!==false) $pat['vet_text']++;
		if(stripos($full,'table')===false && stripos($full,'&lt;')===false) $pat['nothing']++;
		if(count($o['cases'])<5){
			$o['cases'][]=array('id'=>$id,'title'=>mb_substr(get_the_title($id),0,40),
				'RAW'=>mb_substr($full,0,600));
		}
	}
	$o['patterns']=$pat;
	header('Content-Type: application/json'); echo wp_json_encode($o); exit;
});`;
fs.writeFileSync('/tmp/snip.json',JSON.stringify({name:'TEMP M8 Raw',code:php,scope:'global',active:true}));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/snip.json "${API}"`);
const r=sh('curl -sk --max-time 180 "https://dev.avesa.lt/?ps_rw=Rw7Kk3Ff"');
try{out.p=JSON.parse(r);}catch(e){out.raw=r.slice(0,600);}
const k=`add_action('wp_loaded',function(){if(!isset($_GET['ps_krw'])||$_GET['ps_krw']!=='Rr3Ww8Yy'){return;}global $wpdb;$n=$wpdb->query("DELETE FROM {$wpdb->prefix}snippets WHERE name LIKE 'TEMP M8%'");echo wp_json_encode(array('d'=>$n));exit;});`;
fs.writeFileSync('/tmp/k.json',JSON.stringify({name:'TEMP M8 Kill RW',code:k,scope:'global',active:true}));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/k.json "${API}"`);
out.cleanup=sh('curl -sk --max-time 25 "https://dev.avesa.lt/?ps_krw=Rr3Ww8Yy"').slice(0,40);
}catch(e){out.FATAL=String(e.message).slice(0,300);}
ghPut('screenshots/m8_raw.json',Buffer.from(JSON.stringify(out)),'raw html recon');
console.log('DONE');
