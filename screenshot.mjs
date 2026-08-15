process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const out={};
async function api(path,opt={}){ const r=await fetch(WP+path,{...opt,headers:{Authorization:AUTH,'Content-Type':'application/json',...(opt.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(name,code){ const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name,code,scope:'global',active:true,priority:5})}); let id=null; try{ id=JSON.parse(cr.t).id; }catch(e){} return id; }
async function off(id){ if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }

const code = `add_action('wp_loaded', function(){
	if ((\$_GET['ps_kat'] ?? '') !== 'Kat1x') return;
	\$ids = get_posts(array('post_type'=>'product','post_status'=>'publish','numberposts'=>-1,'fields'=>'ids',
		'tax_query'=>array(array('taxonomy'=>'product_cat','field'=>'term_id','terms'=>array(79)))));
	\$o=array('viso'=>count(\$ids),'av'=>0,'prekes'=>array());
	foreach (\$ids as \$pid) {
		\$p = wc_get_product(\$pid); if(!\$p) continue;
		\$sand = strtoupper((string) get_post_meta(\$pid,'_ps_sandelis',true)); if(\$sand==='') \$sand='AV';
		if (\$sand!=='AV') continue;
		if (!\$p->is_in_stock()) continue;
		\$pav = \$p->get_name();
		/* pakuote is pavadinimo */
		\$dydis=''; if (preg_match('/(\\\\d{2,3})\\\\s*g\\\\s*\$/u', \$pav, \$m)) { \$dydis=\$m[1].' g'; }
		\$sav = (float) get_post_meta(\$pid,'_ps_savikaina',true);
		\$k = (float) \$p->get_price();
		\$marza = (\$sav>0 && \$k>0) ? round((\$k/1.21-\$sav)/(\$k/1.21)*100,1) : null;
		\$zenklas = '';
		\$br = wp_get_post_terms(\$pid,'product_brand',array('fields'=>'names'));
		if (!is_wp_error(\$br) && \$br) \$zenklas = \$br[0];
		if (\$zenklas==='') { \$zenklas = trim(preg_replace('/\\\\s.*\$/u','',\$pav)); }
		\$pl = mb_strtolower(\$pav);
		\$o['prekes'][] = array('id'=>(int)\$pid,'pav'=>\$pav,'z'=>\$zenklas,'dydis'=>\$dydis,'k'=>\$k,'sav'=>\$sav,'m'=>\$marza,
			'vist'=>(mb_strpos(\$pl,'vištien')!==false || mb_strpos(\$pl,'chicken')!==false),
			'mono'=>(mb_strpos(\$pl,'monoprotein')!==false));
		\$o['av']++;
	}
	header('Content-Type: application/json'); echo wp_json_encode(\$o); exit;
}, 131);`;
const s = await snip('TEMP KAT REKON', code);
await new Promise(r=>setTimeout(r,4000));
try{ out.rez = JSON.parse(await (await fetch(WP+'/?ps_kat=Kat1x')).text()); }catch(e){ out.err=String(e).slice(0,250); }
await off(s);
let sha=null;
try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/kates.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
const body={message:'rez',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) body.sha=sha;
await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/kates.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
console.log('ok');
