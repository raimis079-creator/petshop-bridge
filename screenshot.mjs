import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN;
function ghPut(p,buf,m){const u=`https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/${p}`;let s='';try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:m,content:buf.toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:60*1024*1024});}
function sh(c){try{return execSync(c,{maxBuffer:60*1024*1024}).toString();}catch(e){return 'ERR';}}
function get(u){ try{ return execSync(`curl -sL --max-time 20 -A "Mozilla/5.0 Chrome/120" "${u}"`,{maxBuffer:20*1024*1024}).toString(); }catch(e){ return ''; } }
const AUTH=Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').replace(/\s+/g,'')).toString('base64');
const API='https://dev.avesa.lt/wp-json/code-snippets/v1/snippets';
const out={};
try{
// PHP be jokiu regex - tik zalias turinys
const php=`
add_action('wp_loaded', function(){
	if(!isset($_GET['ps_raw'])||$_GET['ps_raw']!=='Rw7Kk4Zz'){return;}
	@set_time_limit(300); $o=array();
	$ids=get_posts(array('post_type'=>'product','post_status'=>array('publish','draft'),'posts_per_page'=>-1,'fields'=>'ids',
		'tax_query'=>array(array('taxonomy'=>'product_cat','field'=>'slug','terms'=>array('sausas-maistas-sunims','sausas-maistas-katems')))));
	foreach($ids as $id){
		$t=get_the_title($id);
		if(stripos($t,'exclusion')===false) continue;
		$c=get_post_field('post_content',$id);
		$o[]=array('id'=>$id,'sku'=>get_post_meta($id,'_sku',true),'st'=>get_post_status($id),
			'title'=>$t,'len'=>mb_strlen($c),'content'=>mb_substr($c,0,6000));
	}
	header('Content-Type: application/json'); echo wp_json_encode($o); exit;
});`;
fs.writeFileSync('/tmp/snip.json',JSON.stringify({name:'TEMP M8 Raw',code:php,scope:'global',active:true}));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/snip.json "${API}"`);
const raw=sh('curl -sk --max-time 280 "https://dev.avesa.lt/?ps_raw=Rw7Kk4Zz"');
try{ out.mine=JSON.parse(raw); out.mine_count=out.mine.length; }
catch(e){ out.mine_err=raw.slice(0,300); }

// exclusion.lt - zalias HTML irgi
const cats=['https://exclusion.lt/hypoallergenic/','https://exclusion.lt/hydrolyzed-hypoallergenic/','https://exclusion.lt/intestinal/',
 'https://exclusion.lt/exclusion-mediterraneo-monoprotein/','https://exclusion.lt/metabolic-mobility/','https://exclusion.lt/mobility/',
 'https://exclusion.lt/urinary/','https://exclusion.lt/renal/','https://exclusion.lt/diabetic/','https://exclusion.lt/hepatic/',
 'https://exclusion.lt/hypoallergenic-katems/','https://exclusion.lt/intestinal-katems/','https://exclusion.lt/urinary-katems/',
 'https://exclusion.lt/renal-katems/','https://exclusion.lt/exclusion-mediterraneo/'];
const prods=new Set();
for(const c of cats){ const h=get(c); for(const m of h.matchAll(/href="(https:\/\/exclusion\.lt\/product\/[^"#?]+)"/gi)) prods.add(m[1]); }
const lt=[];
for(const u of [...prods]){
  const h=get(u); if(!h) continue;
  const title=((h.match(/<title>([^<]+)<\/title>/i)||[])[1]||'').replace(/ - exclusion\.lt/,'').replace(/\s+/g,' ').trim();
  // tik "Description" blokas
  let body=h;
  const di=h.indexOf('id="tab-description"');
  if(di>0) body=h.slice(di, di+14000);
  const ser=[...h.matchAll(/uploads\/[^"']*?SERIMAS[^"']*?\.png/gi)].map(x=>x[0].split('/').pop());
  lt.push({url:u,title,ser:ser[0]||null,html:body.slice(0,9000)});
}
out.lt=lt; out.lt_count=lt.length;
const k=`add_action('wp_loaded',function(){if(!isset($_GET['ps_kr'])||$_GET['ps_kr']!=='Rr3Ww8Yy'){return;}global $wpdb;$n=$wpdb->query("DELETE FROM {$wpdb->prefix}snippets WHERE name LIKE 'TEMP M8%'");echo wp_json_encode(array('d'=>$n));exit;});`;
fs.writeFileSync('/tmp/k.json',JSON.stringify({name:'TEMP M8 Kill R',code:k,scope:'global',active:true}));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/k.json "${API}"`);
out.cleanup=sh('curl -sk --max-time 25 "https://dev.avesa.lt/?ps_kr=Rr3Ww8Yy"').slice(0,40);
}catch(e){ out.FATAL=String(e&&e.message?e.message:e).slice(0,400); }
ghPut('screenshots/m8_raw.json',Buffer.from(JSON.stringify(out)),'raw desc');
console.log('DONE');
