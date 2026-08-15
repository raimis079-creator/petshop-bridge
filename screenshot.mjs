process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const out={};
async function api(path,opt={}){ const r=await fetch(WP+path,{...opt,headers:{Authorization:AUTH,'Content-Type':'application/json',...(opt.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(name,code){ const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name,code,scope:'global',active:true,priority:5})});
  let j=null; try{ j=JSON.parse(cr.t); }catch(e){}
  return {id: j?j.id:null, http: cr.s, klaida: j?null:cr.t.slice(0,150)}; }
async function off(id){ if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }

const kodas = [
"add_action('wp_loaded', function(){",
" if ((\\$_GET['ps_at2'] ?? '') !== 'A2x') return;",
" \\$o = array();",
" global \\$wpdb, \\$menu, \\$submenu;",
" \\$o['lenteles'] = \\$wpdb->get_col(\"SHOW TABLES LIKE '{\\$wpdb->prefix}ps%'\");",
" \\$o['mnm'] = \\$wpdb->get_var(\"SHOW TABLES LIKE '{\\$wpdb->prefix}wc_mnm_child_items'\");",
" \\$o['uzsakymu_hpos'] = (int) \\$wpdb->get_var(\"SELECT COUNT(*) FROM {\\$wpdb->prefix}wc_orders\");",
" \\$o['meniu'] = array();",
" if (is_array(\\$menu)) { foreach (\\$menu as \\$m) {",
"   \\$pav = wp_strip_all_tags(\\$m[0]);",
"   if (stripos(\\$pav, 'petshop') === false) continue;",
"   \\$v = array();",
"   if (!empty(\\$submenu[\\$m[2]])) { foreach (\\$submenu[\\$m[2]] as \\$s) { \\$v[] = wp_strip_all_tags(\\$s[0]) . ' | ' . \\$s[2]; } }",
"   \\$o['meniu'][\\$pav] = \\$v;",
" } }",
" \\$o['moduliai'] = array();",
" foreach (glob(WPMU_PLUGIN_DIR . '/*.php') as \\$f) {",
"   \\$b = basename(\\$f);",
"   if (strpos(\\$b, 'pardav') === false && strpos(\\$b, 'ataskait') === false && strpos(\\$b, 'ivyki') === false) continue;",
"   \\$t = file_get_contents(\\$f);",
"   \\$o['moduliai'][\\$b] = array('kb' => round(strlen(\\$t)/1024), 'klases' => array());",
"   foreach (array('class ', 'add_submenu_page', 'CREATE TABLE', 'dbDelta', 'skirtuk') as \\$z) {",
"     \\$o['moduliai'][\\$b]['turi'][\\$z] = substr_count(\\$t, \\$z);",
"   }",
" }",
" header('Content-Type: application/json'); echo wp_json_encode(\\$o); exit;",
"}, 131);"
].join("\n");

const s = await snip('TEMP ATAS2', kodas);
out.snippetas = s;
await new Promise(r=>setTimeout(r,5000));
try{ const r = await fetch(WP+'/?ps_at2=A2x'); const t = await r.text();
  try{ out.r = JSON.parse(t); }catch(e){ out.ne_json = t.slice(0,200); }
}catch(e){ out.e=String(e).slice(0,150); }
await off(s.id);
let sha=null;
try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/atas2.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
const body={message:'rez',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) body.sha=sha;
await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/atas2.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
console.log('ok');
