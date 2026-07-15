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
// 1) gaunam URL sugadinto ir sveiko produkto
const php=`
add_action('wp_loaded', function(){
	if(!isset($_GET['ps_url'])||$_GET['ps_url']!=='Ur3Nn7Qq'){return;}
	global $wpdb; $pf=$wpdb->prefix;
	$broken = $wpdb->get_row("SELECT m.product_id FROM {$pf}ps_feeding_map m JOIN {$pf}ps_feeding_tables t ON t.id=m.feeding_table_id
		WHERE t.source_version='post_content_recovered_notable_2026-07-15' LIMIT 1", ARRAY_A);
	$good = $wpdb->get_row("SELECT m.product_id FROM {$pf}ps_feeding_map m JOIN {$pf}ps_feeding_tables t ON t.id=m.feeding_table_id
		WHERE t.source_version='post_content_2026-07-15' AND t.status='verified' LIMIT 1", ARRAY_A);
	// KIEK VISO katalogo produktu turi si defekta (ne tik sausas maistas)
	$all = $wpdb->get_col("SELECT ID FROM {$wpdb->posts} WHERE post_type='product' AND post_status='publish'");
	$def=0; $ok=0;
	foreach($all as $id){
		$c=get_post_field('post_content',$id);
		if(stripos($c,'Šėrimo instrukcij')===false) continue;
		// defektas: yra <tr> bet NERA <table
		if(stripos($c,'<tr')!==false && stripos($c,'<table')===false) $def++;
		elseif(stripos($c,'<table')!==false) $ok++;
	}
	header('Content-Type: application/json');
	echo wp_json_encode(array('broken_url'=>get_permalink($broken['product_id']),'broken_id'=>$broken['product_id'],
		'good_url'=>get_permalink($good['product_id']),'good_id'=>$good['product_id'],
		'CATALOG_defective'=>$def,'CATALOG_ok'=>$ok)); exit;
});`;
fs.writeFileSync('/tmp/snip.json',JSON.stringify({name:'TEMP M8 Url',code:php,scope:'global',active:true}));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/snip.json "${API}"`);
const u=sh('curl -sk --max-time 180 "https://dev.avesa.lt/?ps_url=Ur3Nn7Qq"');
let J={}; try{ J=JSON.parse(u); out.urls=J; }catch(e){ out.url_raw=u.slice(0,300); }

if(J.broken_url){
  const {chromium}=await import('playwright');
  const br=await chromium.launch();
  const ctx=await br.newContext({viewport:{width:1200,height:1400},ignoreHTTPSErrors:true});
  const pg=await ctx.newPage(); pg.setDefaultTimeout(20000);
  for (const [tag,url] of [['broken',J.broken_url],['good',J.good_url]]) {
    await pg.goto(url,{waitUntil:'domcontentloaded',timeout:45000});
    await pg.waitForTimeout(3000);
    try{const c=pg.locator('text=PRIIMTI').first(); if(await c.isVisible()) await c.click();}catch(e){}
    await pg.waitForTimeout(500);
    // atidarom accordion su serimu
    try{ const acc=pg.locator('text=/Šėrimo instrukcij/i').first();
      if(await acc.isVisible()){ await acc.scrollIntoViewIfNeeded(); await acc.click(); await pg.waitForTimeout(1200); } }catch(e){}
    // ar yra REALI <table> DOM'e?
    out[tag+'_tables_in_dom'] = await pg.evaluate(()=>document.querySelectorAll('table').length);
    out[tag+'_text'] = await pg.evaluate(()=>{
      const b=document.body.innerText; const i=b.indexOf('Šėrimo instrukcij');
      return i>=0 ? b.slice(i,i+260) : '(nerasta)'; });
    try{ const el=pg.locator('text=/Šėrimo instrukcij/i').first(); await el.scrollIntoViewIfNeeded(); }catch(e){}
    await pg.waitForTimeout(400);
    await pg.screenshot({path:'/tmp/'+tag+'.png'});
  }
  await br.close();
  for(const n of ['broken','good']) if(fs.existsSync('/tmp/'+n+'.png')) ghPut('screenshots/ft_'+n+'.png', fs.readFileSync('/tmp/'+n+'.png'), 'render check');
}
const k=`add_action('wp_loaded',function(){if(!isset($_GET['ps_kur'])||$_GET['ps_kur']!=='Rr3Ww8Yy'){return;}global $wpdb;$n=$wpdb->query("DELETE FROM {$wpdb->prefix}snippets WHERE name LIKE 'TEMP M8%'");echo wp_json_encode(array('d'=>$n));exit;});`;
fs.writeFileSync('/tmp/k.json',JSON.stringify({name:'TEMP M8 Kill UR',code:k,scope:'global',active:true}));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/k.json "${API}"`);
out.cleanup=sh('curl -sk --max-time 25 "https://dev.avesa.lt/?ps_kur=Rr3Ww8Yy"').slice(0,40);
}catch(e){out.FATAL=String(e&&e.message?e.message:e).slice(0,400);}
ghPut('screenshots/m8_render.json',Buffer.from(JSON.stringify(out)),'render check');
console.log('DONE');
