process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const out={};
async function api(path,opt={}){ const r=await fetch(WP+path,{...opt,headers:{Authorization:AUTH,'Content-Type':'application/json',...(opt.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(name,code){ const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name,code,scope:'global',active:true,priority:5})}); let id=null; try{ id=JSON.parse(cr.t).id; }catch(e){} return id; }
async function off(id){ if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }

const code = `add_action('wp_loaded', function(){
	if ((\$_GET['ps_kat2'] ?? '') !== 'Kat2x') return;
	\$ids = get_posts(array('post_type'=>'product','post_status'=>'publish','numberposts'=>-1,'fields'=>'ids',
		'tax_query'=>array(array('taxonomy'=>'product_cat','field'=>'term_id','terms'=>array(79)))));
	\$o=array('atributai'=>array(),'kandidatai'=>array(),'ismesti'=>array());
	foreach (\$ids as \$pid) {
		\$p = wc_get_product(\$pid); if(!\$p) continue;
		\$sand = strtoupper((string) get_post_meta(\$pid,'_ps_sandelis',true)); if(\$sand==='') \$sand='AV';
		if (\$sand!=='AV' || !\$p->is_in_stock()) continue;
		\$pav = \$p->get_name(); \$pl = mb_strtolower(\$pav);
		/* ne konservai: kraikas, gerimai, skanestai */
		if (preg_match('/kraikas|benek|gėrimas|vitaldrink|skanėst|paštetas šunims/ui',\$pav)) { \$o['ismesti'][]=array((int)\$pid,mb_substr(\$pav,0,50)); continue; }
		\$at = array();
		foreach (\$p->get_attributes() as \$tax=>\$a) {
			\$v = \$p->get_attribute(\$tax);
			if (\$v!=='') \$at[\$tax] = mb_substr(\$v,0,70);
		}
		foreach (\$at as \$tax=>\$v) { \$o['atributai'][\$tax] = (\$o['atributai'][\$tax] ?? 0) + 1; }
		\$dydis=''; if (preg_match('/(\\\\d{2,3})\\\\s*g\\\\s*\$/u',\$pav,\$m)) \$dydis=\$m[1];
		\$aprl = mb_strtolower(wp_strip_all_tags(\$p->get_description().' '.\$p->get_short_description()));
		\$o['kandidatai'][] = array('id'=>(int)\$pid,'pav'=>mb_substr(\$pav,0,70),'d'=>\$dydis,'k'=>(float)\$p->get_price(),
			'z'=>trim(preg_replace('/\\\\s.*\$/u','',\$pav)),
			'vist'=>(mb_strpos(\$pl,'vištien')!==false),
			'mono_apr'=>(mb_strpos(\$aprl,'monoprotein')!==false),
			'be_grudu'=>(mb_strpos(\$aprl,'be grūdų')!==false || mb_strpos(\$pl,'grain free')!==false),
			'at'=>\$at);
	}
	header('Content-Type: application/json'); echo wp_json_encode(\$o); exit;
}, 131);`;
const s = await snip('TEMP KAT2', code);
await new Promise(r=>setTimeout(r,4000));
try{ out.rez = JSON.parse(await (await fetch(WP+'/?ps_kat2=Kat2x')).text()); }catch(e){ out.err=String(e).slice(0,250); }
await off(s);
let sha=null;
try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/kates2.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
const body={message:'rez',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) body.sha=sha;
await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/kates2.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
console.log('ok');
