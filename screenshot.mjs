import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN;
function ghPut(p,buf,m){const u=`https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/${p}`;let s='';try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:m,content:buf.toString('base64'),...(s?{sha:s}:{})}));
 const c=execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null -w "%{http_code}"`).toString();
 console.log('GHPUT '+p+' -> '+c);}
function sh(c){try{return execSync(c,{maxBuffer:40*1024*1024}).toString();}catch(e){return 'ERR:'+String(e.message).slice(0,150);}}
const AUTH=Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').replace(/\s+/g,'')).toString('base64');
const API='https://dev.avesa.lt/wp-json/code-snippets/v1/snippets';
const out={ts:new Date().toISOString()};
const php=`
add_action('wp_loaded', function(){
	if(!isset($_GET['ps_st'])||$_GET['ps_st']!=='St8Jj4Ll'){return;}
	global $wpdb; $pf=$wpdb->prefix;
	$e = ($wpdb->get_var("SHOW TABLES LIKE '{$pf}ps_feeding_tables'") === $pf.'ps_feeding_tables');
	$o = array('exists'=>$e);
	if($e){
		$o['tables']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$pf}ps_feeding_tables");
		$o['rows']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$pf}ps_feeding_rows");
		$o['map']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$pf}ps_feeding_map");
		$o['min_id']=(int)$wpdb->get_var("SELECT MIN(id) FROM {$pf}ps_feeding_tables");
		$o['max_id']=(int)$wpdb->get_var("SELECT MAX(id) FROM {$pf}ps_feeding_tables");
		$o['orphan_rows']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$pf}ps_feeding_rows r LEFT JOIN {$pf}ps_feeding_tables t ON t.id=r.feeding_table_id WHERE t.id IS NULL");
		$o['orphan_map']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$pf}ps_feeding_map m LEFT JOIN {$pf}ps_feeding_tables t ON t.id=m.feeding_table_id WHERE t.id IS NULL");
	}
	$o['temp_m8_snippets']=$wpdb->get_col("SELECT name FROM {$wpdb->prefix}snippets WHERE name LIKE 'TEMP M8%'");
	$o['revisions_today']=(int)$wpdb->get_var("SELECT COUNT(*) FROM {$wpdb->posts} WHERE post_type='revision' AND DATE(post_date)=CURDATE()");
	header('Content-Type: application/json'); echo wp_json_encode($o); exit;
});`;
fs.writeFileSync('/tmp/snip.json',JSON.stringify({name:'TEMP M8 State',code:php,scope:'global',active:true}));
const dep=sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/snip.json "${API}"`);
out.deploy=dep.slice(0,80);
const r=sh('curl -sk --max-time 60 "https://dev.avesa.lt/?ps_st=St8Jj4Ll"');
out.raw=r.slice(0,400);
try{out.p=JSON.parse(r);}catch(e){}
const k=`add_action('wp_loaded',function(){if(!isset($_GET['ps_kst'])||$_GET['ps_kst']!=='Rr3Ww8Yy'){return;}global $wpdb;$n=$wpdb->query("DELETE FROM {$wpdb->prefix}snippets WHERE name LIKE 'TEMP M8%'");echo wp_json_encode(array('d'=>$n));exit;});`;
fs.writeFileSync('/tmp/k.json',JSON.stringify({name:'TEMP M8 Kill ST',code:k,scope:'global',active:true}));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/k.json "${API}"`);
out.cleanup=sh('curl -sk --max-time 25 "https://dev.avesa.lt/?ps_kst=Rr3Ww8Yy"').slice(0,40);
ghPut('screenshots/m8_state.json',Buffer.from(JSON.stringify(out)),'state check');
console.log('DONE');
