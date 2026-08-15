process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const out={};
async function api(path,opt={}){ const r=await fetch(WP+path,{...opt,headers:{Authorization:AUTH,'Content-Type':'application/json',...(opt.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(name,code){ const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name,code,scope:'global',active:true,priority:5})}); let id=null; try{ id=JSON.parse(cr.t).id; }catch(e){} return id; }
async function off(id){ if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }
const s = await snip('TEMP REC2', `add_action('wp_loaded', function(){
	if ((\$_GET['ps_rec2'] ?? '') !== 'R2x') return;
	\$o=array();
	foreach (array(73,79,95,96,72) as \$tid) {
		\$t = get_term(\$tid,'product_cat');
		if (\$t && !is_wp_error(\$t)) \$o['nuorodos'][\$t->name] = get_term_link(\$t);
	}
	/* petshop-katalogas kabliukai ir ju funkcijos */
	\$f = WPMU_PLUGIN_DIR.'/petshop-katalogas.php';
	if (file_exists(\$f)) {
		\$t = file_get_contents(\$f);
		preg_match_all('/add_action\\\\(\\\\s*[\\\\\\'"]([a-z_0-9]+)[\\\\\\'"]\\\\s*,\\\\s*array\\\\([^,]+,\\\\s*[\\\\\\'"]([a-zA-Z_0-9]+)/', \$t, \$m);
		\$o['katalogo_kabliukai'] = array_map(null, \$m[1], \$m[2]);
		preg_match('/const VERSIJA\\\\s*=\\\\s*[\\\\\\'"]([^\\\\\\'"]+)/', \$t, \$v);
		\$o['katalogo_versija'] = \$v[1] ?? '?';
	}
	\$o['moduliai']=array();
	foreach (glob(WPMU_PLUGIN_DIR.'/*.php') as \$ff) {
		\$o['moduliai'][basename(\$ff)] = date('m-d H:i', filemtime(\$ff));
	}
	header('Content-Type: application/json'); echo wp_json_encode(\$o); exit; }, 131);`);
await new Promise(r=>setTimeout(r,4500));
try{ out.info = JSON.parse(await (await fetch(WP+'/?ps_rec2=R2x')).text()); }catch(e){ out.e=String(e).slice(0,250); }
await off(s);
const url = out.info && out.info.nuorodos && out.info.nuorodos['Konservai šunims'];
if (url) {
  try{
    const r = await fetch(url,{headers:{Authorization:AUTH}});
    const t = await r.text();
    out.puslapis = { url, http:r.status, ilgis:t.length };
    /* kas yra tarp breadcrumb ir pirmos prekes */
    const i = t.indexOf('woocommerce-breadcrumb');
    const j = t.indexOf('product-small');
    out.tarpas = i>0 && j>i ? t.slice(i, Math.min(i+2600, j)).replace(/\s+/g,' ') : '(nerasta)';
    out.zymes = {};
    ['pskat','ps-kat','pslk','rinkin','Susidėk','maisto-tipas','ps-tipas','category-description','term-description','shop-page-title','ps-hero','ps-kviet']
      .forEach(z=>{ out.zymes[z]=t.indexOf(z)>0; });
  }catch(e){ out.p_err=String(e).slice(0,200); }
}
let sha=null;
try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/rec2.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
const body={message:'rez',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) body.sha=sha;
await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/rec2.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
console.log('ok');
