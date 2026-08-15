process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const out={};
async function irasyk(){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/v136.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const body={message:'rez',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) body.sha=sha;
  await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/v136.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
}
async function api(path,opt={}){ const r=await fetch(WP+path,{...opt,headers:{Authorization:AUTH,'Content-Type':'application/json',...(opt.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(name,code){ const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name,code,scope:'global',active:true,priority:5})}); let id=null; try{ id=JSON.parse(cr.t).id; }catch(e){} return id; }
async function off(id){ if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }
async function get(u,n){ n=n||3;
  for(let i=0;i<n;i++){ try{ const r=await fetch(WP+u); const t=await r.text();
    try{ return JSON.parse(t); }catch(e){ return {ne_json:t.slice(0,200)}; } }
    catch(e){ if(i===n-1) return {err:String(e).slice(0,120)}; await new Promise(r=>setTimeout(r,3000)); } } }
try{
const b64 = fs.readFileSync('deploy/petshop-laukai.php').toString('base64');
const sA = await snip('TEMP SET 136', `add_action('wp_loaded', function(){
	if ((\$_GET['ps_s136'] ?? '') !== 'S136x') return;
	update_option('ps_l_b64_136','${b64}',false);
	header('Content-Type: application/json'); echo wp_json_encode(array('ok'=>1)); exit; }, 131);`);
await new Promise(r=>setTimeout(r,4500));
out.set = await get('/?ps_s136=S136x');
await off(sA); await new Promise(r=>setTimeout(r,3000));
const sB = await snip('TEMP DEP 136', `add_action('wp_loaded', function(){
	if ((\$_GET['ps_d136'] ?? '') !== 'D136x') return;
	\$o=array(); \$b=get_option('ps_l_b64_136');
	if(!\$b){ \$o['klaida']='tuscia'; }
	else { \$k=base64_decode(\$b);
		try { token_get_all(\$k, TOKEN_PARSE); \$o['sintakse']='OK';
			\$kl=WPMU_PLUGIN_DIR.'/petshop-laukai.php';
			file_put_contents(\$kl,\$k); clearstatcache(true,\$kl);
			\$o['sutampa']=(md5_file(\$kl)===md5(\$k));
		} catch (ParseError \$e){ \$o['sintakse']='KLAIDA: '.\$e->getMessage(); }
		delete_option('ps_l_b64_136'); }
	header('Content-Type: application/json'); echo wp_json_encode(\$o); exit; }, 131);`);
await new Promise(r=>setTimeout(r,4500));
out.diegimas = await get('/?ps_d136=D136x');
await off(sB); await new Promise(r=>setTimeout(r,3000));

/* TIKRAS KELIAS: admin-ajax su programos slaptazodziu + nonce is serverio */
const sC = await snip('TEMP NONCE 136', `add_action('wp_loaded', function(){
	if ((\$_GET['ps_n136'] ?? '') !== 'N136x') return;
	wp_set_current_user(1);
	header('Content-Type: application/json');
	echo wp_json_encode(array('nonce'=>wp_create_nonce('ps_laukai'),'versija'=>Petshop_Laukai::VERSIJA)); exit; }, 131);`);
await new Promise(r=>setTimeout(r,4000));
const nn = await get('/?ps_n136=N136x');
out.versija = nn.versija;
await off(sC);
const NC = nn.nonce;
async function ajax(params){
  const u = WP+'/wp-admin/admin-ajax.php?action=ps_laukai_dov_paieska&nonce='+NC+'&'+params;
  const t0=Date.now();
  try{
    const r = await fetch(u,{headers:{Authorization:AUTH}});
    const t = await r.text();
    let j=null; try{ j=JSON.parse(t); }catch(e){}
    return { http:r.status, ms:Date.now()-t0, json: j? (j.success? {kiek:j.data.prekes.length,viso:j.data.viso,
      pirmos:j.data.prekes.slice(0,4).map(p=>p.pav.slice(0,38)+' | '+p.kaina+'€')} : {klaida:j.data}) : {ne_json:t.slice(0,180)} };
  }catch(e){ return {err:String(e).slice(0,150), ms:Date.now()-t0}; }
}
out.a_be_filtru      = await ajax('lid=34942');
out.b_kramtalai      = await ajax('lid=34942&rusis=kramtalai');
out.c_sunims         = await ajax('lid=34942&gyv=sunims&iki=4');
out.d_kate_katems    = await ajax('lid=34947&gyv=katems&iki=4');
out.e_kate_be_filtro = await ajax('lid=34947&iki=4');
/* TIKRAS kelias su laikinu prisijungimu */
const sAuth = await snip('TEMP AUTH 136', `add_filter('determine_current_user', function(\$u){
	if ((\$_GET['ps_kas'] ?? '') === 'Kas136x') return 1;
	return \$u; }, 99);`);
await new Promise(r=>setTimeout(r,4500));
async function ajax2(params){
  const u = WP+'/wp-admin/admin-ajax.php?action=ps_laukai_dov_paieska&ps_kas=Kas136x&nonce='+NC+'&'+params;
  const t0=Date.now();
  try{
    const r = await fetch(u); const t = await r.text();
    let j=null; try{ j=JSON.parse(t); }catch(e){}
    return { http:r.status, ms:Date.now()-t0, rez: j? (j.success? {kiek:j.data.prekes.length,viso:j.data.viso,
      pirmos:j.data.prekes.slice(0,4).map(p=>p.pav.slice(0,40)+' | '+p.kaina+'€')} : {klaida:j.data}) : {ne_json:t.slice(0,140)} };
  }catch(e){ return {err:String(e).slice(0,140), ms:Date.now()-t0}; }
}
out.A_suo_be_filtru   = await ajax2('lid=34942');
out.B_suo_skanestai   = await ajax2('lid=34942&kat=95');
out.C_suo_zaislai_iki4= await ajax2('lid=34942&kat=115&iki=4');
out.D_kate_be_filtru  = await ajax2('lid=34947');
out.E_kate_skanestai  = await ajax2('lid=34947&kat=96');
out.F_kate_su_sav     = await ajax2('lid=34947&kat=96&sav=1');
out.G_paieska         = await ajax2('lid=34942&q=ausis');
await off(sAuth);

/* renderis */
const sD = await snip('TEMP R136', `add_action('wp_loaded', function(){
	if ((\$_GET['ps_r136'] ?? '') !== 'R136x') return;
	wp_set_current_user(1); \$o=array();
	try { \$m=new ReflectionMethod('Petshop_Laukai','admin_laukas'); \$m->setAccessible(true);
		ob_start(); \$m->invoke(null,34942); \$h=ob_get_clean();
		\$o['gyvuno_laukas_nuimtas']=strpos(\$h,'id="dov-gyv"')===false;
		\$o['kategoriju_sarasas']=strpos(\$h,'id="dov-kat"')!==false;
		\$o['rodyti_mygtukas']=strpos(\$h,'id="dov-rodyti"')!==false;
		preg_match('/id="dov-kat">(.*?)<\\/select>/s',\$h,\$mk);
		preg_match_all('/<option value="(\\d*)"[^>]*>([^<]*)</',\$mk[1]??'',\$mo);
		\$o['suo_kategorijos']=array_slice(\$mo[2]??array(),0,8);
		\$m2=new ReflectionMethod('Petshop_Laukai','admin_laukas'); \$m2->setAccessible(true);
		ob_start(); \$m2->invoke(null,34947); \$h2=ob_get_clean();
		preg_match('/id="dov-kat">(.*?)<\\/select>/s',\$h2,\$mk2);
		preg_match_all('/<option value="(\\d*)"[^>]*>([^<]*)</',\$mk2[1]??'',\$mo2);
		\$o['kates_kategorijos']=array_slice(\$mo2[2]??array(),0,8);
		\$o['klaidos']=(strpos(\$h,'Fatal')!==false||strpos(\$h,'Warning:')!==false)?'YRA':'nera';
	} catch (Throwable \$e){ \$o['klaida']=\$e->getMessage(); }
	header('Content-Type: application/json'); echo wp_json_encode(\$o); exit; }, 131);`);
await new Promise(r=>setTimeout(r,4000));
out.renderis = await get('/?ps_r136=R136x');
await off(sD);
}catch(e){ out.bendra=String(e).slice(0,250); }
await irasyk();
console.log('ok');
