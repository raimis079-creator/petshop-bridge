process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const out={};
async function api(path,opt={}){ const r=await fetch(WP+path,{...opt,headers:{Authorization:AUTH,'Content-Type':'application/json',...(opt.headers||{})}}); return {s:r.status,t:await r.text()}; }
const code = `add_action('wp_loaded', function(){
	if ((\$_GET['ps_apr'] ?? '') !== 'Apr122') return;
	\$o=array();
	foreach (array(19570,19562,19582) as \$pid) {
		\$p = wc_get_product(\$pid);
		\$o[\$pid] = array(
			'short_len' => mb_strlen(wp_strip_all_tags(\$p->get_short_description())),
			'desc_len'  => mb_strlen(wp_strip_all_tags(\$p->get_description())),
		);
	}
	header('Content-Type: application/json'); echo wp_json_encode(\$o); exit;
}, 131);`;
const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP APR',code,scope:'global',active:true,priority:5})});
let id=null; try{ id=JSON.parse(cr.t).id; }catch(e){}
await new Promise(r=>setTimeout(r,4000));
try{ out.rez=JSON.parse(await (await fetch(WP+'/?ps_apr=Apr122')).text()); }catch(e){ out.err=String(e).slice(0,150); }
if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})});
let sha=null;
try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/apr.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
const body={message:'rez',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) body.sha=sha;
await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/apr.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
console.log('ok');
