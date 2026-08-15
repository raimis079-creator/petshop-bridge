process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const out={};
async function api(path,opt={}){ const r=await fetch(WP+path,{...opt,headers:{Authorization:AUTH,'Content-Type':'application/json',...(opt.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(name,code){ const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name,code,scope:'global',active:true,priority:5})}); let id=null; try{ id=JSON.parse(cr.t).id; }catch(e){} return id; }
async function off(id){ if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }
const s = await snip('TEMP REC3', `add_action('wp_loaded', function(){
	if ((\$_GET['ps_rec3'] ?? '') !== 'R3x') return;
	\$o=array('kabliukai'=>array());
	\$ieskom = array('woocommerce_before_main_content','woocommerce_archive_description','woocommerce_before_shop_loop',
		'woocommerce_after_shop_loop','woocommerce_shop_loop_header','loop_shop_before','woocommerce_before_shop_loop_item');
	foreach (glob(WPMU_PLUGIN_DIR.'/*.php') as \$f) {
		\$t = file_get_contents(\$f);
		foreach (\$ieskom as \$k) {
			if (strpos(\$t,\$k)!==false) {
				preg_match_all('/add_action\\\\(\\\\s*[\\\\\\'"]'.preg_quote(\$k,'/').'[\\\\\\'"]\\\\s*,\\\\s*array\\\\([^,]+,\\\\s*[\\\\\\'"]([a-zA-Z_0-9]+)/', \$t, \$m);
				\$o['kabliukai'][basename(\$f)][\$k] = \$m[1] ?: array('(rastas tekste)');
			}
		}
	}
	/* globalus filtrai/snippetai irgi gali piesti */
	global \$wp_filter;
	foreach (array('woocommerce_before_shop_loop','woocommerce_archive_description','woocommerce_before_main_content') as \$k) {
		\$o['gyvi'][\$k] = array();
		if (isset(\$wp_filter[\$k])) {
			foreach (\$wp_filter[\$k]->callbacks as \$prio => \$cbs) {
				foreach (\$cbs as \$id => \$cb) {
					\$pav = is_array(\$cb['function'])
						? (is_object(\$cb['function'][0]) ? get_class(\$cb['function'][0]) : (string)\$cb['function'][0]).'::'.\$cb['function'][1]
						: (is_string(\$cb['function']) ? \$cb['function'] : 'closure');
					\$o['gyvi'][\$k][] = \$prio.' '.\$pav;
				}
			}
		}
	}
	header('Content-Type: application/json'); echo wp_json_encode(\$o); exit; }, 131);`);
await new Promise(r=>setTimeout(r,4500));
try{ out.r = JSON.parse(await (await fetch(WP+'/?ps_rec3=R3x')).text()); }catch(e){ out.e=String(e).slice(0,250); }
await off(s);
let sha=null;
try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/rec3.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
const body={message:'rez',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) body.sha=sha;
await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/rec3.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
console.log('ok');
