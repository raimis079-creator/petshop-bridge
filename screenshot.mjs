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
// 1) SKU sarasas is WP
const php=`
add_action('wp_loaded', function(){
	if(!isset($_GET['ps_sk'])||$_GET['ps_sk']!=='Sk3Vv6Yy'){return;}
	@set_time_limit(200); global $wpdb; $pf=$wpdb->prefix;
	$ids=get_posts(array('post_type'=>'product','post_status'=>'publish','posts_per_page'=>-1,'fields'=>'ids',
		'tax_query'=>array(array('taxonomy'=>'product_cat','field'=>'slug','terms'=>array('sausas-maistas-sunims','sausas-maistas-katems')))));
	$mapped=array_flip(array_map('intval',$wpdb->get_col("SELECT DISTINCT product_id FROM {$pf}ps_feeding_map")));
	$r=array();
	foreach($ids as $id){
		if(get_post_meta($id,'_stock_status',true)!=='instock') continue;
		if(isset($mapped[$id])) continue;
		$b=wp_get_object_terms($id,'product_brand',array('fields'=>'names'));
		$bn=(!is_wp_error($b)&&$b)?$b[0]:'';
		if(stripos($bn,'exclusion')===false && stripos(get_the_title($id),'exclusion')===false) continue;
		$r[]=array('id'=>$id,'sku'=>get_post_meta($id,'_sku',true),'t'=>mb_substr(get_the_title($id),0,60),
			'sp'=>has_term('sausas-maistas-katems','product_cat',$id)?'cat':'dog');
	}
	header('Content-Type: application/json'); echo wp_json_encode($r); exit;
});`;
fs.writeFileSync('/tmp/snip.json',JSON.stringify({name:'TEMP M8 Sku',code:php,scope:'global',active:true}));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/snip.json "${API}"`);
const list=JSON.parse(sh('curl -sk --max-time 200 "https://dev.avesa.lt/?ps_sk=Sk3Vv6Yy"'));
out.count=list.length;

// 2) kodo israiska is SKU: nuimam pabaigos skaicius
const codes = new Map();
for (const p of list) {
  const sku = String(p.sku||'').trim();
  if(!sku) continue;
  const base = sku.replace(/\d+$/,'').toLowerCase();   // NGALM03 -> ngalm
  if(!/^[a-z]{3,6}$/.test(base)) { continue; }
  if(!codes.has(base)) codes.set(base, []);
  codes.get(base).push({id:p.id, sku, t:p.t, sp:p.sp});
}
out.unique_codes = [...codes.keys()];

// 3) testuojam ar egzistuoja razione paveiksliukas
const results=[];
for (const [code, prods] of codes) {
  const tries = [
    `https://www.exclusion.it/images/razioni/${code}_razione_en.png`,
    `https://www.exclusion.it/images/razioni/${code}_razione.png`,
  ];
  let hit=null;
  for (const u of tries) {
    const c = sh(`curl -s -o /dev/null -w "%{http_code}" --max-time 20 "${u}"`).trim();
    if(c==='200'){ hit=u; break; }
  }
  results.push({code, n:prods.length, url:hit, sample:prods[0].t.slice(0,44), sku:prods[0].sku});
}
out.results=results;
out.found = results.filter(r=>r.url).length;
out.missing = results.filter(r=>!r.url).length;

// 4) parsisiunciam rastus i repo
let dl=0;
for(const r of results){ if(!r.url) continue;
  const f=`/tmp/${r.code}.png`;
  sh(`curl -s --max-time 30 -o ${f} "${r.url}"`);
  if(fs.existsSync(f) && fs.statSync(f).size>1000){ ghPut(`razioni/${r.code}.png`, fs.readFileSync(f), 'razione '+r.code); dl++; }
}
out.downloaded=dl;

const k=`add_action('wp_loaded',function(){if(!isset($_GET['ps_ksk'])||$_GET['ps_ksk']!=='Rr3Ww8Yy'){return;}global $wpdb;$n=$wpdb->query("DELETE FROM {$wpdb->prefix}snippets WHERE name LIKE 'TEMP M8%'");echo wp_json_encode(array('d'=>$n));exit;});`;
fs.writeFileSync('/tmp/k.json',JSON.stringify({name:'TEMP M8 Kill SK',code:k,scope:'global',active:true}));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/k.json "${API}"`);
out.cleanup=sh('curl -sk --max-time 25 "https://dev.avesa.lt/?ps_ksk=Rr3Ww8Yy"').slice(0,40);
}catch(e){out.FATAL=String(e&&e.message?e.message:e).slice(0,400);}
ghPut('screenshots/m8_razioni.json',Buffer.from(JSON.stringify(out)),'razioni probe');
console.log('DONE');
