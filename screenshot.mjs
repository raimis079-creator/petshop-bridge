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
" if (($_GET['ps_at4'] ?? '') !== 'A4x') return;",
" $o = array();",
" global $wpdb;",
" $t = $wpdb->prefix . 'ps_ivykiai';",
" $o['stulpeliai'] = $wpdb->get_results(\"SHOW COLUMNS FROM $t\", ARRAY_A);",
" $o['eiluciu'] = (int) $wpdb->get_var(\"SELECT COUNT(*) FROM $t\");",
" $o['pavyzdziai'] = $wpdb->get_results(\"SELECT * FROM $t ORDER BY id DESC LIMIT 5\", ARRAY_A);",
" $o['tipai'] = $wpdb->get_results(\"SELECT tipas, COUNT(*) k FROM $t GROUP BY tipas ORDER BY k DESC LIMIT 15\", ARRAY_A);",
" $f = WPMU_PLUGIN_DIR . '/petshop-ivykiai.php';",
" $src = file_exists($f) ? file_get_contents($f) : '';",
" $o['ivykiai_klase'] = array();",
" foreach (explode(chr(10), $src) as $eil) {",
"   $e = trim($eil);",
"   if (strpos($e,'class ')===0 || strpos($e,'public static function')===0 || strpos($e,'const ')===0) { $o['ivykiai_klase'][] = substr($e,0,120); }",
" }",
" $o['ataskaitu_meniu'] = array();",
" foreach (glob(WPMU_PLUGIN_DIR . '/*.php') as $ff) {",
"   $s = file_get_contents($ff);",
"   if (stripos($s, 'ataskait') === false) continue;",
"   $eil = array();",
"   foreach (explode(chr(10), $s) as $l) { if (stripos($l,'ataskait')!==false && (stripos($l,'menu')!==false || stripos($l,'page')!==false)) { $eil[] = trim(substr($l,0,140)); } }",
"   if ($eil) { $o['ataskaitu_meniu'][basename($ff)] = array_slice($eil,0,6); }",
" }",
" $p = WPMU_PLUGIN_DIR . '/petshop-pardavimai.php';",
" $ps = file_exists($p) ? file_get_contents($p) : '';",
" $o['pardavimai'] = array();",
" foreach (explode(chr(10), $ps) as $eil) {",
"   $e = trim($eil);",
"   if (strpos($e,'class ')===0 || strpos($e,'public static function')===0 || strpos($e,'add_action')===0) { $o['pardavimai'][] = substr($e,0,120); }",
" }",
" header('Content-Type: application/json'); echo wp_json_encode($o); exit;",
"}, 131);"].join("\n");

const s = await snip('TEMP ATAS4', kodas);
out.snippetas = s;
await new Promise(r=>setTimeout(r,5000));
try{ const r = await fetch(WP+'/?ps_at4=A4x'); const t = await r.text();
  try{ out.r = JSON.parse(t); }catch(e){ out.ne_json = t.slice(0,200); }
}catch(e){ out.e=String(e).slice(0,150); }
await off(s.id);
let sha=null;
try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/atas4.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
const body={message:'rez',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) body.sha=sha;
await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/atas4.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
console.log('ok');
