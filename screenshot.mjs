import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN;
function ghPut(p,buf,m){const u=`https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/${p}`;let s='';try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:m,content:buf.toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:30*1024*1024});}
function sh(c){try{return execSync(c,{maxBuffer:40*1024*1024}).toString();}catch(e){return 'ERR';}}
const AUTH=Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').replace(/\s+/g,'')).toString('base64');
const API='https://dev.avesa.lt/wp-json/code-snippets/v1/snippets';
const out={};
try{
const php=`
add_action('wp_loaded', function(){
	if(!isset($_GET['ps_sch'])||$_GET['ps_sch']!=='Sc8Hh3Mm'){return;}
	@set_time_limit(200); global $wpdb; $pf=$wpdb->prefix; $o=array();
	foreach(array('ps_feeding_tables','ps_feeding_rows','ps_feeding_map') as $t){
		$o['schema'][$t]=$wpdb->get_results("DESCRIBE {$pf}{$t}", ARRAY_A);
		$o['count'][$t]=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$pf}{$t}");
	}
	// pavyzdys: verified lentele + jos eilutes + map
	$tid=$wpdb->get_var("SELECT id FROM {$pf}ps_feeding_tables WHERE status='verified' ORDER BY id LIMIT 1");
	$o['sample_table']=$wpdb->get_row($wpdb->prepare("SELECT * FROM {$pf}ps_feeding_tables WHERE id=%d",$tid), ARRAY_A);
	$o['sample_rows']=$wpdb->get_results($wpdb->prepare("SELECT * FROM {$pf}ps_feeding_rows WHERE table_id=%d ORDER BY id LIMIT 5",$tid), ARRAY_A);
	$o['sample_map']=$wpdb->get_results($wpdb->prepare("SELECT * FROM {$pf}ps_feeding_map WHERE table_id=%d LIMIT 3",$tid), ARRAY_A);
	$o['statuses']=$wpdb->get_results("SELECT status, COUNT(*) c FROM {$pf}ps_feeding_tables GROUP BY status", ARRAY_A);
	$o['source_versions']=$wpdb->get_results("SELECT source_version, COUNT(*) c FROM {$pf}ps_feeding_tables GROUP BY source_version ORDER BY c DESC LIMIT 8", ARRAY_A);

	// mūsų HY SKU be lentelės
	$ids=get_posts(array('post_type'=>'product','post_status'=>'publish','posts_per_page'=>-1,'fields'=>'ids',
		'tax_query'=>array(array('taxonomy'=>'product_cat','field'=>'slug','terms'=>array('sausas-maistas-sunims')))));
	$mapped=array_flip(array_map('intval',$wpdb->get_col("SELECT DISTINCT product_id FROM {$pf}ps_feeding_map")));
	$hy=array();
	foreach($ids as $id){
		if(get_post_meta($id,'_stock_status',true)!=='instock') continue;
		if(isset($mapped[$id])) continue;
		$sku=strtoupper((string)get_post_meta($id,'_sku',true));
		if(!preg_match('/^(HY)([PHRDFVI])([SM])(\d+)$/', $sku, $m)) continue;
		$hy[]=array('id'=>$id,'sku'=>$sku,'prot'=>$m[2],'size'=>$m[3],
			'title'=>mb_substr(get_the_title($id),0,66));
	}
	$o['hy']=$hy; $o['hy_count']=count($hy);
	header('Content-Type: application/json'); echo wp_json_encode($o); exit;
});`;
fs.writeFileSync('/tmp/snip.json',JSON.stringify({name:'TEMP M8 Sch',code:php,scope:'global',active:true}));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/snip.json "${API}"`);
const r=sh('curl -sk --max-time 200 "https://dev.avesa.lt/?ps_sch=Sc8Hh3Mm"');
try{ out.p=JSON.parse(r); }catch(e){ out.raw=r.slice(0,500); }
const k=`add_action('wp_loaded',function(){if(!isset($_GET['ps_ks'])||$_GET['ps_ks']!=='Rr3Ww8Yy'){return;}global $wpdb;$n=$wpdb->query("DELETE FROM {$wpdb->prefix}snippets WHERE name LIKE 'TEMP M8%'");echo wp_json_encode(array('d'=>$n));exit;});`;
fs.writeFileSync('/tmp/k.json',JSON.stringify({name:'TEMP M8 Kill S',code:k,scope:'global',active:true}));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/k.json "${API}"`);
out.cleanup=sh('curl -sk --max-time 25 "https://dev.avesa.lt/?ps_ks=Rr3Ww8Yy"').slice(0,40);
}catch(e){ out.FATAL=String(e&&e.message?e.message:e).slice(0,300); }
ghPut('screenshots/m8_sch.json',Buffer.from(JSON.stringify(out)),'schema recon');
console.log('DONE');
