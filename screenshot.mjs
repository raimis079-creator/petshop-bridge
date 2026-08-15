process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const out={};
async function irasyk(){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/v133b.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const body={message:'rez',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) body.sha=sha;
  await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/v133b.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
}
async function api(path,opt={}){ const r=await fetch(WP+path,{...opt,headers:{Authorization:AUTH,'Content-Type':'application/json',...(opt.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(name,code){ const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name,code,scope:'global',active:true,priority:5})}); let id=null; try{ id=JSON.parse(cr.t).id; }catch(e){} return id; }
async function off(id){ if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }
async function get(u,bandymai){ bandymai=bandymai||3;
  for(let i=0;i<bandymai;i++){
    try{ const r=await fetch(WP+u); const t=await r.text();
      try{ return JSON.parse(t); }catch(e){ return {ne_json:t.slice(0,200)}; }
    }catch(e){ if(i===bandymai-1) return {err:String(e).slice(0,120)}; await new Promise(r=>setTimeout(r,3000)); }
  }
}
try{

const b64 = fs.readFileSync('deploy/petshop-laukai.php').toString('base64');
const sA = await snip('TEMP SET 133b', `add_action('wp_loaded', function(){
	if ((\$_GET['ps_s133b'] ?? '') !== 'S133bx') return;
	update_option('ps_l_b64_133b','${b64}',false);
	header('Content-Type: application/json'); echo wp_json_encode(array('ok'=>1)); exit; }, 131);`);
await new Promise(r=>setTimeout(r,4500));
out.set = await get('/?ps_s133b=S133bx');
await off(sA); await new Promise(r=>setTimeout(r,3000));
const sB = await snip('TEMP DEP 133b', `add_action('wp_loaded', function(){
	if ((\$_GET['ps_d133b'] ?? '') !== 'D133bx') return;
	\$o=array(); \$b=get_option('ps_l_b64_133b');
	if(!\$b){ \$o['klaida']='tuscia'; }
	else { \$k=base64_decode(\$b);
		try { token_get_all(\$k, TOKEN_PARSE); \$o['sintakse']='OK';
			\$kl=WPMU_PLUGIN_DIR.'/petshop-laukai.php';
			file_put_contents(\$kl,\$k); clearstatcache(true,\$kl);
			\$o['sutampa']=(md5_file(\$kl)===md5(\$k)); \$o['md5']=md5(\$k);
		} catch (ParseError \$e){ \$o['sintakse']='KLAIDA: '.\$e->getMessage(); }
		delete_option('ps_l_b64_133b'); }
	header('Content-Type: application/json'); echo wp_json_encode(\$o); exit; }, 131);`);
await new Promise(r=>setTimeout(r,4500));
out.diegimas = await get('/?ps_d133b=D133bx');
await off(sB); await new Promise(r=>setTimeout(r,3000));

const s = await snip('TEMP V133', `add_action('wp_loaded', function(){
	\$v=\$_GET['ps_v133'] ?? ''; if(\$v==='') return;
	wp_set_current_user(1);
	if (\$v==='r') {
		\$o=array('versija'=>Petshop_Laukai::VERSIJA);
		try { \$m=new ReflectionMethod('Petshop_Laukai','admin_laukas'); \$m->setAccessible(true);
			ob_start(); \$m->invoke(null,34942); \$h=ob_get_clean();
			\$o['filtrai']=array('paieska'=>strpos(\$h,'id="dov-q"')!==false,'rusis'=>strpos(\$h,'id="dov-rusis"')!==false,
				'kaina_iki'=>strpos(\$h,'id="dov-iki"')!==false,'rodyti'=>strpos(\$h,'id="dov-filtras"')!==false,
				'sandelis'=>strpos(\$h,'kaip krepšys')!==false);
			\$o['klaidos']=(strpos(\$h,'Fatal')!==false||strpos(\$h,'Warning:')!==false)?'YRA':'nera';
		} catch (Throwable \$e){ \$o['klaida']=\$e->getMessage(); }
		header('Content-Type: application/json'); echo wp_json_encode(\$o); exit;
	}
	\$_GET['lid']=(int)(\$_GET['lid'] ?? 34942); \$_GET['nonce']=wp_create_nonce('ps_laukai'); \$_REQUEST=\$_GET;
	Petshop_Laukai::ajax_dov_paieska();
}, 131);`);
await new Promise(r=>setTimeout(r,5000));
out.renderis = await get('/?ps_v133=r');
const a = await get('/?ps_v133=x');
out.siulomi = a.data ? {kiek:a.data.prekes.length,viso:a.data.viso,sandelis:a.data.sandelis,
  pirmos:a.data.prekes.slice(0,6).map(p=>p.pav.slice(0,40)+' | '+p.kaina+'€ | sav '+(p.savikaina??'—'))} : a;
const b = await get('/?ps_v133=x&rusis=kramtalai&iki=4');
out.kramtalai = b.data ? {kiek:b.data.prekes.length,pirmos:b.data.prekes.slice(0,5).map(p=>p.pav.slice(0,40)+' | '+p.kaina+'€')} : b;
const c = await get('/?ps_v133=x&sav=1');
out.su_savikaina = c.data ? {kiek:c.data.prekes.length,be:c.data.prekes.filter(p=>p.savikaina==null).length} : c;
const d = await get('/?ps_v133=x&lid=34947&rusis=skanestai&iki=4');
out.kates = d.data ? {kiek:d.data.prekes.length,sandelis:d.data.sandelis,pirmos:d.data.prekes.slice(0,5).map(p=>p.pav.slice(0,42)+' | '+p.kaina+'€')} : d;
await off(s);
}catch(e){ out.bendra=String(e).slice(0,250); }
await irasyk();
console.log('ok');
