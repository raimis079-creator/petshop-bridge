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
// SVARBU: PHP rasomas i faila, ne per JS template literal -> backslash'ai islieka
const php = [
"add_action('wp_loaded', function(){",
"	if(!isset($_GET['ps_h2'])||$_GET['ps_h2']!=='Hh9Qq5Vv'){return;}",
"	@set_time_limit(200); global $wpdb; $pf=$wpdb->prefix; $o=array();",
"	$tid=$wpdb->get_var(\"SELECT id FROM {$pf}ps_feeding_tables WHERE status='verified' AND shape='simple' ORDER BY id LIMIT 1\");",
"	$o['sample_table']=$wpdb->get_row($wpdb->prepare(\"SELECT * FROM {$pf}ps_feeding_tables WHERE id=%d\",$tid), ARRAY_A);",
"	$o['sample_rows']=$wpdb->get_results($wpdb->prepare(\"SELECT * FROM {$pf}ps_feeding_rows WHERE feeding_table_id=%d ORDER BY row_order LIMIT 6\",$tid), ARRAY_A);",
"	$o['sample_map']=$wpdb->get_results($wpdb->prepare(\"SELECT * FROM {$pf}ps_feeding_map WHERE feeding_table_id=%d LIMIT 3\",$tid), ARRAY_A);",
"	$o['shapes']=$wpdb->get_results(\"SELECT shape, COUNT(*) c FROM {$pf}ps_feeding_tables GROUP BY shape\", ARRAY_A);",
"	$ids=get_posts(array('post_type'=>'product','post_status'=>'publish','posts_per_page'=>-1,'fields'=>'ids',",
"		'tax_query'=>array(array('taxonomy'=>'product_cat','field'=>'slug','terms'=>array('sausas-maistas-sunims')))));",
"	$mapped=array_flip(array_map('intval',$wpdb->get_col(\"SELECT DISTINCT product_id FROM {$pf}ps_feeding_map\")));",
"	$hy=array(); $skipped=array();",
"	foreach($ids as $id){",
"		$sku=strtoupper((string)get_post_meta($id,'_sku',true));",
"		if(strpos($sku,'HY')!==0) continue;",
"		$rec=array('id'=>$id,'sku'=>$sku,'stock'=>get_post_meta($id,'_stock_status',true),",
"			'mapped'=>isset($mapped[$id])?1:0,'title'=>mb_substr(get_the_title($id),0,60));",
"		if(preg_match('/^HY([PHRDFVI])([SM])([0-9]+)$/', $sku, $m)){ $rec['prot']=$m[1]; $rec['size']=$m[2]; $hy[]=$rec; }",
"		else { $skipped[]=$rec; }",
"	}",
"	$o['hy']=$hy; $o['hy_count']=count($hy); $o['skipped']=$skipped;",
"	header('Content-Type: application/json'); echo wp_json_encode($o); exit;",
"});"
].join("\n");
fs.writeFileSync('/tmp/snip.json',JSON.stringify({name:'TEMP M8 Hy2',code:php,scope:'global',active:true}));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/snip.json "${API}"`);
const r=sh('curl -sk --max-time 200 "https://dev.avesa.lt/?ps_h2=Hh9Qq5Vv"');
try{ out.p=JSON.parse(r); }catch(e){ out.raw=r.slice(0,500); }
const k="add_action('wp_loaded',function(){if(!isset($_GET['ps_k2'])||$_GET['ps_k2']!=='Rr3Ww8Yy'){return;}global $wpdb;$n=$wpdb->query(\"DELETE FROM {$wpdb->prefix}snippets WHERE name LIKE 'TEMP M8%'\");echo wp_json_encode(array('d'=>$n));exit;});";
fs.writeFileSync('/tmp/k.json',JSON.stringify({name:'TEMP M8 Kill H',code:k,scope:'global',active:true}));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/k.json "${API}"`);
out.cleanup=sh('curl -sk --max-time 25 "https://dev.avesa.lt/?ps_k2=Rr3Ww8Yy"').slice(0,40);
}catch(e){ out.FATAL=String(e&&e.message?e.message:e).slice(0,300); }
ghPut('screenshots/m8_hy2.json',Buffer.from(JSON.stringify(out)),'hy recon fixed');
console.log('DONE');
