process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const out={};
async function api(path,opt={}){ const r=await fetch(WP+path,{...opt,headers:{Authorization:AUTH,'Content-Type':'application/json',...(opt.headers||{})}}); return {s:r.status,t:await r.text()}; }
/* 1) snippetai */
try{
  const r = await api('/wp-json/code-snippets/v1/snippets?per_page=100');
  const j = JSON.parse(r.t);
  out.snippetai = j.map(s=>({id:s.id,pav:s.name,aktyvus:s.active,keista:s.modified||''}))
    .sort((a,b)=>String(b.keista).localeCompare(String(a.keista)));
}catch(e){ out.sn_err=String(e).slice(0,200); }
/* 2) mu-plugins failai + kategorijos puslapio blokai */
async function snip(name,code){ const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name,code,scope:'global',active:true,priority:5})}); let id=null; try{ id=JSON.parse(cr.t).id; }catch(e){} return id; }
async function off(id){ if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }
const s = await snip('TEMP REC', `add_action('wp_loaded', function(){
	if ((\$_GET['ps_rec'] ?? '') !== 'R1x') return;
	\$o=array('failai'=>array());
	foreach (glob(WPMU_PLUGIN_DIR.'/*.php') as \$f) {
		\$o['failai'][] = array(basename(\$f), date('Y-m-d H:i', filemtime(\$f)), round(filesize(\$f)/1024).' KB');
	}
	/* ko ieskom kategorijos puslapyje: kviecianciu bloku pedsakai */
	\$o['paieska']=array();
	foreach (glob(WPMU_PLUGIN_DIR.'/*.php') as \$f) {
		\$t = file_get_contents(\$f);
		foreach (array('rinkin','susidėk','susidek','juosta','banner','reklam','kviet','promo','hero') as \$z) {
			if (stripos(\$t, \$z)!==false) { \$o['paieska'][basename(\$f)][] = \$z; }
		}
	}
	header('Content-Type: application/json'); echo wp_json_encode(\$o); exit; }, 131);`);
await new Promise(r=>setTimeout(r,4500));
try{ out.rec = JSON.parse(await (await fetch(WP+'/?ps_rec=R1x')).text()); }catch(e){ out.rec_err=String(e).slice(0,200); }
await off(s);
/* 3) kategorijos puslapio HTML */
try{
  const r = await fetch(WP+'/product-category/sunims/maistas-sunims/konservai-sunims/',{headers:{Authorization:AUTH}});
  const t = await r.text();
  out.kategorija = { http:r.status, ilgis:t.length,
    blokai: ['pslk','pskat','ps-rinkiniai','rinkiniai','susidek','Susidėk','maisto-tipas','ps-juosta','category-banner','term-description']
      .reduce((a,z)=>{a[z]=t.indexOf(z)>0;return a;},{}) };
}catch(e){ out.kat_err=String(e).slice(0,200); }
let sha=null;
try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/rec.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
const body={message:'rez',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) body.sha=sha;
await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/rec.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
console.log('ok');
