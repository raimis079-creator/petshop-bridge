process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const out={};
async function api(path,opt={}){ const r=await fetch(WP+path,{...opt,headers:{Authorization:AUTH,'Content-Type':'application/json',...(opt.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(name,code){ const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name,code,scope:'global',active:true,priority:5})}); let id=null; try{ id=JSON.parse(cr.t).id; }catch(e){} return id; }
async function off(id){ if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }
const s = await snip('TEMP PAT', `add_action('wp_loaded', function(){
	if ((\$_GET['ps_pat'] ?? '') !== 'P1x') return;
	\$o=array('esantys'=>array(),'istrinti'=>array());
	\$q = new WP_Query(array('post_type'=>'product','post_status'=>array('publish','draft','trash'),
		'posts_per_page'=>-1,'fields'=>'ids','meta_query'=>array(array('key'=>'_ps_laukas','value'=>'yes'))));
	foreach (\$q->posts as \$lid) {
		\$o['esantys'][] = array((int)\$lid, get_the_title(\$lid), get_post_status(\$lid),
			Petshop_Laukai::grupe(\$lid), Petshop_Laukai::dydis(\$lid));
	}
	foreach (array(34950,34951) as \$id) { \$o['patikra'][\$id] = get_post(\$id) ? get_post_status(\$id) : 'NERA'; }
	/* isvalom ZZZ testinius */
	if ((\$_GET['valyk'] ?? '')==='1') {
		global \$wpdb;
		foreach (\$q->posts as \$lid) {
			if (strpos(get_the_title(\$lid),'ZZZ')===0) {
				\$wpdb->delete(\$wpdb->prefix.'wc_mnm_child_items', array('container_id'=>(int)\$lid), array('%d'));
				wp_delete_post((int)\$lid, true); \$o['istrinti'][]=(int)\$lid;
			}
		}
	}
	header('Content-Type: application/json'); echo wp_json_encode(\$o); exit; }, 131);`);
await new Promise(r=>setTimeout(r,4500));
try{ out.pries = JSON.parse(await (await fetch(WP+'/?ps_pat=P1x')).text()); }catch(e){ out.e1=String(e).slice(0,150); }
try{ out.valymas = JSON.parse(await (await fetch(WP+'/?ps_pat=P1x&valyk=1')).text()); }catch(e){ out.e2=String(e).slice(0,150); }
await off(s);
let sha=null;
try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/pat.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
const body={message:'rez',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) body.sha=sha;
await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/pat.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
console.log('ok');
