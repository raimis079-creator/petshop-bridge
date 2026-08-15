process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const out={};
async function irasyk(){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/t133.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const body={message:'rez',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) body.sha=sha;
  await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/t133.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
}
async function api(path,opt={}){ const r=await fetch(WP+path,{...opt,headers:{Authorization:AUTH,'Content-Type':'application/json',...(opt.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(name,code){ const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name,code,scope:'global',active:true,priority:5})}); let id=null; try{ id=JSON.parse(cr.t).id; }catch(e){} return id; }
async function off(id){ if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }
try{
const b64 = fs.readFileSync('deploy/petshop-laukai.php').toString('base64');
const s1 = await snip('TEMP SET 133', `add_action('wp_loaded', function(){
	if ((\$_GET['ps_s133'] ?? '') !== 'S133x') return;
	update_option('ps_l_b64_133','${b64}',false);
	header('Content-Type: application/json'); echo wp_json_encode(array('ok'=>1)); exit; }, 131);`);
await new Promise(r=>setTimeout(r,4000));
await fetch(WP+'/?ps_s133=S133x').then(r=>r.text()).catch(()=>{});
await off(s1); await new Promise(r=>setTimeout(r,3000));
const s2 = await snip('TEMP DEP 133', `add_action('wp_loaded', function(){
	if ((\$_GET['ps_d133'] ?? '') !== 'D133x') return;
	\$o=array(); \$b=get_option('ps_l_b64_133');
	if(!\$b){ \$o['klaida']='tuscia'; }
	else { \$k=base64_decode(\$b);
		try { token_get_all(\$k, TOKEN_PARSE); \$o['sintakse']='OK';
			\$kl=WPMU_PLUGIN_DIR.'/petshop-laukai.php';
			file_put_contents(\$kl,\$k); clearstatcache(true,\$kl);
			\$o['sutampa']=(md5_file(\$kl)===md5(\$k));
		} catch (ParseError \$e){ \$o['sintakse']='KLAIDA: '.\$e->getMessage(); }
		delete_option('ps_l_b64_133'); }
	header('Content-Type: application/json'); echo wp_json_encode(\$o); exit; }, 131);`);
await new Promise(r=>setTimeout(r,4000));
try{ out.diegimas = JSON.parse(await (await fetch(WP+'/?ps_d133=D133x')).text()); }catch(e){ out.diegimas_err=String(e).slice(0,200); }
await off(s2); await new Promise(r=>setTimeout(r,2500));

/* paieskos endpoint testai + renderis */
const s3 = await snip('TEMP TST 133', `add_action('wp_loaded', function(){
	\$v=\$_GET['ps_t133'] ?? ''; if(\$v==='') return;
	wp_set_current_user(1);
	if (\$v==='render') {
		\$o=array();
		try { \$m=new ReflectionMethod('Petshop_Laukai','admin_laukas'); \$m->setAccessible(true);
			ob_start(); \$m->invoke(null,34942); \$h=ob_get_clean();
			\$o['filtrai']=array(
				'paieska'=>strpos(\$h,'id="dov-q"')!==false,
				'rusis'=>strpos(\$h,'id="dov-rusis"')!==false,
				'kaina_iki'=>strpos(\$h,'id="dov-iki"')!==false,
				'rodyti'=>strpos(\$h,'id="dov-filtras"')!==false,
				'sandelio_zyme'=>strpos(\$h,'kaip krepšys')!==false);
			\$o['klaidos']=(strpos(\$h,'Fatal')!==false||strpos(\$h,'Warning:')!==false)?'YRA':'nera';
		} catch (Throwable \$e){ \$o['klaida']=\$e->getMessage(); }
		header('Content-Type: application/json'); echo wp_json_encode(\$o); exit;
	}
	\$_GET['lid']=34942; \$_GET['nonce']=wp_create_nonce('ps_laukai');
	\$_REQUEST=\$_GET;
	Petshop_Laukai::ajax_dov_paieska();
}, 131);`);
await new Promise(r=>setTimeout(r,4500));
async function get(u){ try{ const r=await fetch(WP+u); const t=await r.text(); try{ return JSON.parse(t); }catch(e){ return {ne_json:t.slice(0,200)}; } }catch(e){ return {err:String(e).slice(0,150)}; } }
out.renderis = await get('/?ps_t133=render');
const tuscia = await get('/?ps_t133=x');
out.siulomi = tuscia.data ? {kiek:tuscia.data.prekes.length, viso:tuscia.data.viso, sandelis:tuscia.data.sandelis,
   pirmos:tuscia.data.prekes.slice(0,5).map(p=>[p.pav.slice(0,42),p.kaina,p.savikaina,p.yra])} : tuscia;
const kramt = await get('/?ps_t133=x&rusis=kramtalai&iki=4');
out.kramtalai_iki4 = kramt.data ? {kiek:kramt.data.prekes.length, pirmos:kramt.data.prekes.slice(0,5).map(p=>[p.pav.slice(0,42),p.kaina])} : kramt;
const sav = await get('/?ps_t133=x&sav=1');
out.tik_su_savikaina = sav.data ? {kiek:sav.data.prekes.length, be_savikainos:sav.data.prekes.filter(p=>p.savikaina==null).length} : sav;
const q = await get('/?ps_t133=x&q=ausis');
out.paieska_ausis = q.data ? {kiek:q.data.prekes.length, pirmos:q.data.prekes.slice(0,4).map(p=>[p.pav.slice(0,42),p.kaina])} : q;
/* kates deze — ar sandelis is krepsio ir kaciu prekes */
const s4 = await snip('TEMP TST133B', `add_action('wp_loaded', function(){
	if ((\$_GET['ps_u133'] ?? '')==='') return;
	wp_set_current_user(1);
	\$_GET['lid']=34947; \$_GET['nonce']=wp_create_nonce('ps_laukai'); \$_REQUEST=\$_GET;
	Petshop_Laukai::ajax_dov_paieska(); }, 131);`);
await new Promise(r=>setTimeout(r,4000));
const kat = await get('/?ps_u133=x&rusis=skanestai&iki=4');
out.kates_deze = kat.data ? {kiek:kat.data.prekes.length, sandelis:kat.data.sandelis, pirmos:kat.data.prekes.slice(0,5).map(p=>[p.pav.slice(0,44),p.kaina])} : kat;
await off(s3); await off(s4);
}catch(e){ out.bendra=String(e).slice(0,300); }
await irasyk();
console.log('ok');
