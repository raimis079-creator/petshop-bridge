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
" if (($_GET['ps_at5'] ?? '') !== 'A5x') return;",
" $o = array('snippetai'=>array(), 'moduliai'=>array());",
" foreach (glob(WPMU_PLUGIN_DIR . '/*.php') as $ff) {",
"   $s = file_get_contents($ff);",
"   if (stripos($s, 'ps-ataskaitos') !== false || stripos($s, 'Petshop ataskaitos') !== false) {",
"     $eil = array();",
"     foreach (explode(chr(10), $s) as $l) { if (stripos($l,'ataskait')!==false) { $eil[] = trim(substr($l,0,150)); } }",
"     $o['moduliai'][basename($ff)] = array_slice($eil, 0, 8);",
"   }",
" }",
" global $wpdb;",
" $t = $wpdb->prefix . 'snippets';",
" $eil = $wpdb->get_results(\"SELECT id, name, active FROM $t WHERE code LIKE '%ataskait%' OR name LIKE '%taskait%'\", ARRAY_A);",
" $o['snippetai'] = $eil;",
" foreach ($eil as $sn) {",
"   $kodas = $wpdb->get_var($wpdb->prepare(\"SELECT code FROM $t WHERE id=%d\", $sn['id']));",
"   $rast = array();",
"   foreach (explode(chr(10), (string)$kodas) as $l) {",
"     if (stripos($l,'add_menu_page')!==false || stripos($l,'add_submenu_page')!==false || stripos($l,'skirtuk')!==false) { $rast[] = trim(substr($l,0,150)); }",
"   }",
"   if ($rast) { $o['detales'][$sn['id'].' '.$sn['name']] = array_slice($rast,0,8); }",
" }",
" header('Content-Type: application/json'); echo wp_json_encode($o); exit;",
"}, 131);"].join("\n");

const s = await snip('TEMP ATAS5', kodas);
out.snippetas = s;
await new Promise(r=>setTimeout(r,5000));
try{ const r = await fetch(WP+'/?ps_at5=A5x'); const t = await r.text();
  try{ out.r = JSON.parse(t); }catch(e){ out.ne_json = t.slice(0,200); }
}catch(e){ out.e=String(e).slice(0,150); }
await off(s.id);
let sha=null;
try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/atas5.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
const body={message:'rez',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) body.sha=sha;
await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/atas5.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
console.log('ok');
