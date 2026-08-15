process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const out={};
async function irasyk(){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/v134.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const body={message:'rez',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) body.sha=sha;
  await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/v134.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
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
const sA = await snip('TEMP SET 134', `add_action('wp_loaded', function(){
	if ((\$_GET['ps_s134'] ?? '') !== 'S134x') return;
	update_option('ps_l_b64_134','${b64}',false);
	header('Content-Type: application/json'); echo wp_json_encode(array('ok'=>1)); exit; }, 131);`);
await new Promise(r=>setTimeout(r,4500));
out.set = await get('/?ps_s134=S134x');
await off(sA); await new Promise(r=>setTimeout(r,3000));
const sB = await snip('TEMP DEP 134', `add_action('wp_loaded', function(){
	if ((\$_GET['ps_d134'] ?? '') !== 'D134x') return;
	\$o=array(); \$b=get_option('ps_l_b64_134');
	if(!\$b){ \$o['klaida']='tuscia'; }
	else { \$k=base64_decode(\$b);
		try { token_get_all(\$k, TOKEN_PARSE); \$o['sintakse']='OK';
			\$kl=WPMU_PLUGIN_DIR.'/petshop-laukai.php';
			file_put_contents(\$kl,\$k); clearstatcache(true,\$kl);
			\$o['sutampa']=(md5_file(\$kl)===md5(\$k));
		} catch (ParseError \$e){ \$o['sintakse']='KLAIDA: '.\$e->getMessage(); }
		delete_option('ps_l_b64_134'); }
	header('Content-Type: application/json'); echo wp_json_encode(\$o); exit; }, 131);`);
await new Promise(r=>setTimeout(r,4500));
out.diegimas = await get('/?ps_d134=D134x');
await off(sB); await new Promise(r=>setTimeout(r,3000));

/* TIKRAS KELIAS: admin-ajax su programos slaptazodziu + nonce is serverio */
const sC = await snip('TEMP NONCE 134', `add_action('wp_loaded', function(){
	if ((\$_GET['ps_n134'] ?? '') !== 'N134x') return;
	wp_set_current_user(1);
	header('Content-Type: application/json');
	echo wp_json_encode(array('nonce'=>wp_create_nonce('ps_laukai'),'versija'=>Petshop_Laukai::VERSIJA)); exit; }, 131);`);
await new Promise(r=>setTimeout(r,4000));
const nn = await get('/?ps_n134=N134x');
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
/* renderis */
const sD = await snip('TEMP R134', `add_action('wp_loaded', function(){
	if ((\$_GET['ps_r134'] ?? '') !== 'R134x') return;
	wp_set_current_user(1); \$o=array();
	try { \$m=new ReflectionMethod('Petshop_Laukai','admin_laukas'); \$m->setAccessible(true);
		ob_start(); \$m->invoke(null,34942); \$h=ob_get_clean();
		\$o['gyvuno_laukas']=strpos(\$h,'id="dov-gyv"')!==false;
		\$o['rodyti_mygtukas']=strpos(\$h,'id="dov-rodyti"')!==false;
		\$o['klaidos']=(strpos(\$h,'Fatal')!==false||strpos(\$h,'Warning:')!==false)?'YRA':'nera';
	} catch (Throwable \$e){ \$o['klaida']=\$e->getMessage(); }
	header('Content-Type: application/json'); echo wp_json_encode(\$o); exit; }, 131);`);
await new Promise(r=>setTimeout(r,4000));
out.renderis = await get('/?ps_r134=R134x');
await off(sD);
}catch(e){ out.bendra=String(e).slice(0,250); }
await irasyk();
console.log('ok');
