process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const out={};
async function irasyk(){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/fix132.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const body={message:'rez',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) body.sha=sha;
  await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/fix132.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
}
async function api(path,opt={}){ const r=await fetch(WP+path,{...opt,headers:{Authorization:AUTH,'Content-Type':'application/json',...(opt.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(name,code){ const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name,code,scope:'global',active:true,priority:5})}); let id=null; try{ id=JSON.parse(cr.t).id; }catch(e){} return id; }
async function off(id){ if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }
try{
const b64 = fs.readFileSync('deploy/petshop-laukai.php').toString('base64');
const s1 = await snip('TEMP SET 132', `add_action('wp_loaded', function(){
	if ((\$_GET['ps_s132'] ?? '') !== 'S132x') return;
	update_option('ps_l_b64_132','${b64}',false);
	header('Content-Type: application/json'); echo wp_json_encode(array('ok'=>1)); exit; }, 131);`);
await new Promise(r=>setTimeout(r,4000));
await fetch(WP+'/?ps_s132=S132x').then(r=>r.text()).catch(()=>{});
await off(s1); await new Promise(r=>setTimeout(r,3000));
const s2 = await snip('TEMP DEP 132', `add_action('wp_loaded', function(){
	if ((\$_GET['ps_d132'] ?? '') !== 'D132x') return;
	\$o=array(); \$b=get_option('ps_l_b64_132');
	if(!\$b){ \$o['klaida']='tuscia'; }
	else { \$k=base64_decode(\$b);
		try { token_get_all(\$k, TOKEN_PARSE); \$o['sintakse']='OK';
			\$kl=WPMU_PLUGIN_DIR.'/petshop-laukai.php';
			file_put_contents(\$kl,\$k); clearstatcache(true,\$kl);
			\$o['sutampa']=(md5_file(\$kl)===md5(\$k));
		} catch (ParseError \$e){ \$o['sintakse']='KLAIDA: '.\$e->getMessage(); }
		delete_option('ps_l_b64_132'); }
	header('Content-Type: application/json'); echo wp_json_encode(\$o); exit; }, 131);`);
await new Promise(r=>setTimeout(r,4000));
try{ out.diegimas = JSON.parse(await (await fetch(WP+'/?ps_d132=D132x')).text()); }catch(e){ out.diegimas_err=String(e).slice(0,200); }
await off(s2); await new Promise(r=>setTimeout(r,2500));

/* DUOMENU TVARKYMAS: vardai -> raktai + patikra */
const s3 = await snip('TEMP MIG 132', `add_action('wp_loaded', function(){
	if ((\$_GET['ps_m132'] ?? '') !== 'M132x') return;
	\$o=array('pakeista'=>array(),'grupes'=>array());
	\$q = new WP_Query(array('post_type'=>'product','post_status'=>array('publish','draft'),'posts_per_page'=>-1,
		'fields'=>'ids','meta_query'=>array(array('key'=>'_ps_laukas','value'=>'yes'))));
	\$zem = array('konservai sunims'=>'kons_sunims','konservai sunims '=>'kons_sunims',
		'konservai katems'=>'kons_kates','konservai katėms'=>'kons_kates','konservai šunims'=>'kons_sunims');
	foreach (\$q->posts as \$lid) {
		\$g = get_post_meta(\$lid,'_ps_laukas_grupe',true);
		\$gl = mb_strtolower(trim((string)\$g));
		if (isset(\$zem[\$gl])) {
			update_post_meta(\$lid,'_ps_laukas_grupe',\$zem[\$gl]);
			update_post_meta(\$lid, Petshop_Laukai::META_SEIMA, Petshop_Laukai::grupiu_vardai()[\$zem[\$gl]]);
			\$o['pakeista'][] = array((int)\$lid, get_the_title(\$lid), \$g.' → '.\$zem[\$gl]);
		}
	}
	foreach (\$q->posts as \$lid) {
		\$k = Petshop_Laukai::grupe(\$lid);
		\$o['grupes'][\$k] = (\$o['grupes'][\$k] ?? 0) + 1;
	}
	header('Content-Type: application/json'); echo wp_json_encode(\$o); exit; }, 131);`);
await new Promise(r=>setTimeout(r,4000));
try{ out.migracija = JSON.parse(await (await fetch(WP+'/?ps_m132=M132x')).text()); }catch(e){ out.mig_err=String(e).slice(0,250); }
await off(s3); await new Promise(r=>setTimeout(r,2000));

/* PATIKRA: ar sarasas dabar rodo konservus */
const s4 = await snip('TEMP TIK 132', `add_action('wp_loaded', function(){
	if ((\$_GET['ps_t132'] ?? '') !== 'T132x') return;
	wp_set_current_user(1);
	\$o=array();
	try {
		\$m = new ReflectionMethod('Petshop_Laukai','admin_sarasas'); \$m->setAccessible(true);
		ob_start(); \$m->invoke(null); \$h=ob_get_clean();
		preg_match('/var R=(\\\\[.*?\\\\]);/s',\$h,\$mm);
		\$duom = isset(\$mm[1]) ? json_decode(\$mm[1],true) : array();
		\$c=array();
		foreach ((array)\$duom as \$d) { \$c[\$d['grupe']] = (\$c[\$d['grupe']] ?? 0)+1; }
		\$o['sarase_grupes']=\$c; \$o['viso']=count((array)\$duom);
		\$o['konservai']=array();
		foreach ((array)\$duom as \$d) { if (strpos(\$d['grupe'],'kons_')===0) \$o['konservai'][]=array(\$d['id'],\$d['pav'],\$d['grupe'],\$d['trumpas'],\$d['st']); }
	} catch (Throwable \$e) { \$o['klaida']=\$e->getMessage(); }
	header('Content-Type: application/json'); echo wp_json_encode(\$o); exit; }, 131);`);
await new Promise(r=>setTimeout(r,4000));
try{ out.sarasas = JSON.parse(await (await fetch(WP+'/?ps_t132=T132x')).text()); }catch(e){ out.sar_err=String(e).slice(0,250); }
await off(s4);
}catch(e){ out.bendra=String(e).slice(0,300); }
await irasyk();
console.log('ok');
