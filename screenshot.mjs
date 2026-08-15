process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const out={}; const NL=String.fromCharCode(10);
async function api(path,opt={}){ const r=await fetch(WP+path,{...opt,headers:{Authorization:AUTH,'Content-Type':'application/json',...(opt.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(name,code){ const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name,code,scope:'global',active:true,priority:5})}); let j=null; try{j=JSON.parse(cr.t);}catch(e){} return j?j.id:null; }
async function off(id){ if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }
const s = await snip('TEMP KUR', [
"add_action('wp_loaded', function(){",
" if (($_GET['ps_kur'] ?? '') !== 'K9x') return;",
" $o=array('failai'=>array(),'snippetai'=>array());",
" $ieskom = array('Mitybos plano','Petshop ataskaitos','ps-ataskaitos','ps_ataskaitos');",
" $kelias = array();",
" foreach (glob(WPMU_PLUGIN_DIR.'/*.php') as $f) { $kelias[] = $f; }",
" foreach (glob(WP_CONTENT_DIR.'/plugins/petshop*/*.php') as $f) { $kelias[] = $f; }",
" foreach (glob(WP_CONTENT_DIR.'/plugins/petshop*/includes/*.php') as $f) { $kelias[] = $f; }",
" foreach (glob(WP_CONTENT_DIR.'/themes/*/functions.php') as $f) { $kelias[] = $f; }",
" foreach (glob(WP_CONTENT_DIR.'/themes/*/inc/*.php') as $f) { $kelias[] = $f; }",
" foreach ($kelias as $f) {",
"   $s = @file_get_contents($f); if (!$s) continue;",
"   foreach ($ieskom as $z) {",
"     if (stripos($s,$z)===false) continue;",
"     $o['failai'][str_replace(WP_CONTENT_DIR,'',$f)][] = $z;",
"   }",
" }",
" global $wpdb; $t=$wpdb->prefix.'snippets';",
" foreach ($ieskom as $z) {",
"   $r = $wpdb->get_results($wpdb->prepare(\"SELECT id,name,active FROM $t WHERE code LIKE %s\", '%'.$wpdb->esc_like($z).'%'), ARRAY_A);",
"   foreach ($r as $x) { $o['snippetai'][$z][] = $x['id'].' '.($x['active']?'AKT':'off').' '.$x['name']; }",
" }",
" $o['meniu_slug']=array();",
" foreach ($kelias as $f) {",
"   $s=@file_get_contents($f); if(!$s) continue;",
"   if (stripos($s,'Mitybos plano')===false) continue;",
"   foreach (explode(chr(10),$s) as $l) {",
"     if (stripos($l,'add_menu_page')!==false || stripos($l,'add_submenu_page')!==false) { $o['meniu_slug'][basename($f)][]=trim(substr($l,0,150)); }",
"   }",
" }",
" header('Content-Type: application/json'); echo wp_json_encode($o); exit;",
"}, 131);"].join(NL));
await new Promise(r=>setTimeout(r,4500));
try{ out.r = JSON.parse(await (await fetch(WP+'/?ps_kur=K9x')).text()); }catch(e){ out.e=String(e).slice(0,200); }
await off(s);
let sha=null;
try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/kur.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
const body={message:'rez',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) body.sha=sha;
await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/kur.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
console.log('ok');
