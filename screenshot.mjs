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
	if(!isset($_GET['ps_am'])||$_GET['ps_am']!=='Am6Dd9Xx'){return;}
	@set_time_limit(300); global $wpdb; $pf=$wpdb->prefix; $o=array('groups'=>array());
	$rs=$wpdb->get_results("SELECT id,brand,shape,reason,row_count,source_url FROM {$pf}ps_feeding_tables WHERE status='ambiguous' ORDER BY reason,id",ARRAY_A);
	$seen=array();
	foreach($rs as $t){
		$rn=$t['reason']?:'(null)';
		if(!isset($o['groups'][$rn])) $o['groups'][$rn]=array('n'=>0,'brands'=>array(),'example'=>null);
		$o['groups'][$rn]['n']++;
		$b=$t['brand']?:'(be)'; if(!in_array($b,$o['groups'][$rn]['brands'])) $o['groups'][$rn]['brands'][]=$b;
		if($o['groups'][$rn]['example']) continue;
		$pid=$wpdb->get_var($wpdb->prepare("SELECT product_id FROM {$pf}ps_feeding_map WHERE feeding_table_id=%d LIMIT 1",$t['id']));
		if(!$pid) continue;
		$c=get_post_field('post_content',$pid);
		$pos=mb_stripos($c,'Šėrimo instrukcij'); if($pos===false) continue;
		$full=mb_substr($c,$pos);
		$tbl=null;
		if(preg_match('/<table.*?<\\/table>/is',$full,$m)) $tbl=$m[0];
		elseif(preg_match('/<tr.*<\\/tr>/is',$full,$m)) $tbl='<table>'.$m[0].'</table>';
		if(!$tbl) continue;
		preg_match_all('/<tr.*?(?:<\\/tr>|$)/is',$tbl,$trs);
		$grid=array();
		foreach(array_slice($trs[0],0,5) as $row){
			preg_match_all('/<t[dh][^>]*>(.*?)<\\/t[dh]>/is',$row,$mm);
			$grid[]=array_map(function($x){return trim(preg_replace('/\\s+/u',' ',html_entity_decode(wp_strip_all_tags($x))));},$mm[1]);
		}
		$o['groups'][$rn]['example']=array('ftid'=>$t['id'],'pid'=>$pid,'brand'=>$t['brand'],'shape'=>$t['shape'],
			'title'=>mb_substr(get_the_title($pid),0,48),'url'=>get_permalink($pid),'grid'=>$grid);
	}
	// kiek SKU pakabinti ant ambiguous IR neturi jokios verified lenteles
	$o['sku_only_ambiguous']=(int)$wpdb->get_var("SELECT COUNT(DISTINCT m.product_id) FROM {$pf}ps_feeding_map m
		JOIN {$pf}ps_feeding_tables t ON t.id=m.feeding_table_id WHERE t.status='ambiguous'
		AND m.product_id NOT IN (SELECT m2.product_id FROM {$pf}ps_feeding_map m2 JOIN {$pf}ps_feeding_tables t2 ON t2.id=m2.feeding_table_id WHERE t2.status='verified')");
	header('Content-Type: application/json'); echo wp_json_encode($o); exit;
});`;
fs.writeFileSync('/tmp/snip.json',JSON.stringify({name:'TEMP M8 Amb',code:php,scope:'global',active:true}));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/snip.json "${API}"`);
const r=sh('curl -sk --max-time 250 "https://dev.avesa.lt/?ps_am=Am6Dd9Xx"');
try{out.p=JSON.parse(r);}catch(e){out.raw=r.slice(0,600);}
const k=`add_action('wp_loaded',function(){if(!isset($_GET['ps_kam'])||$_GET['ps_kam']!=='Rr3Ww8Yy'){return;}global $wpdb;$n=$wpdb->query("DELETE FROM {$wpdb->prefix}snippets WHERE name LIKE 'TEMP M8%'");echo wp_json_encode(array('d'=>$n));exit;});`;
fs.writeFileSync('/tmp/k.json',JSON.stringify({name:'TEMP M8 Kill AM',code:k,scope:'global',active:true}));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/k.json "${API}"`);
out.cleanup=sh('curl -sk --max-time 25 "https://dev.avesa.lt/?ps_kam=Rr3Ww8Yy"').slice(0,40);
}catch(e){out.FATAL=String(e&&e.message?e.message:e).slice(0,300);}
ghPut('screenshots/m8_amb.json',Buffer.from(JSON.stringify(out)),'ambiguous review');
console.log('DONE');
