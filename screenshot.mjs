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
" if (($_GET['ps_at6'] ?? '') !== 'A6x') return;",
" $o = array('rasta'=>array());",
" $saknys = array(WP_CONTENT_DIR . '/plugins', WP_CONTENT_DIR . '/themes', WPMU_PLUGIN_DIR);",
" foreach ($saknys as $sak) {",
"   $it = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($sak, FilesystemIterator::SKIP_DOTS));",
"   $n = 0;",
"   foreach ($it as $f) {",
"     if ($n++ > 4000) break;",
"     if (!$f->isFile() || substr($f->getFilename(), -4) !== '.php') continue;",
"     $s = @file_get_contents($f->getPathname());",
"     if ($s === false) continue;",
"     if (stripos($s, 'Petshop ataskaitos') === false && stripos($s, 'ps-ataskaitos') === false) continue;",
"     $eil = array();",
"     foreach (explode(chr(10), $s) as $l) {",
"       if (stripos($l,'ataskait')!==false && (stripos($l,'menu')!==false || stripos($l,'page')!==false || stripos($l,'slug')!==false)) { $eil[] = trim(substr($l,0,150)); }",
"     }",
"     $o['rasta'][str_replace(WP_CONTENT_DIR,'',$f->getPathname())] = array_slice($eil,0,6);",
"   }",
" }",
" header('Content-Type: application/json'); echo wp_json_encode($o); exit;",
"}, 131);"].join("\n");

const s = await snip('TEMP ATAS6', kodas);
out.snippetas = s;
await new Promise(r=>setTimeout(r,5000));
try{ const r = await fetch(WP+'/?ps_at6=A6x'); const t = await r.text();
  try{ out.r = JSON.parse(t); }catch(e){ out.ne_json = t.slice(0,200); }
}catch(e){ out.e=String(e).slice(0,150); }
await off(s.id);
/* valymas: TEMP ATAS* snippetai */
const valymas = await snip('TEMP VALYMAS', [
"add_action('wp_loaded', function(){",
" if (($_GET['ps_val'] ?? '') !== 'V9x') return;",
" global $wpdb; $t = $wpdb->prefix . 'snippets';",
" $ids = $wpdb->get_col(\"SELECT id FROM $t WHERE name LIKE 'TEMP %'\");",
" $istrinta = array();",
" foreach ($ids as $id) { if ($wpdb->delete($t, array('id'=>(int)$id), array('%d'))) { $istrinta[] = (int)$id; } }",
" header('Content-Type: application/json'); echo wp_json_encode(array('istrinta'=>$istrinta)); exit;",
"}, 131);"].join(String.fromCharCode(10)));
await new Promise(r=>setTimeout(r,4500));
try{ const rv = await fetch(WP+'/?ps_val=V9x'); out.valymas = JSON.parse(await rv.text()); }catch(e){ out.val_err=String(e).slice(0,120); }
await off(valymas.id);
let sha=null;
try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/atas6.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
const body={message:'rez',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) body.sha=sha;
await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/atas6.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
console.log('ok');
