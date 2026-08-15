process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const out={}; const NL=String.fromCharCode(10);
async function api(path,opt={}){ const r=await fetch(WP+path,{...opt,headers:{Authorization:AUTH,'Content-Type':'application/json',...(opt.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(name,code){ const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name,code,scope:'global',active:true,priority:5})}); let j=null; try{j=JSON.parse(cr.t);}catch(e){} return j?j.id:null; }
async function off(id){ if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }
const s = await snip('TEMP SK', [
"add_action('wp_loaded', function(){",
" if (($_GET['ps_sk'] ?? '') !== 'SK1x') return;",
" $f = WP_CONTENT_DIR.'/plugins/petshop-core/includes/class-admin-reports.php';",
" $o = array('yra'=>file_exists($f));",
" if ($o['yra']) {",
"  $s = file_get_contents($f);",
"  $o['kb'] = round(strlen($s)/1024);",
"  $eil = explode(chr(10), $s);",
"  $o['struktura'] = array();",
"  foreach ($eil as $i => $l) {",
"    $t = trim($l);",
"    if (strpos($t,'class ')===0 || strpos($t,'const ')===0 || strpos($t,'public static function')===0 || strpos($t,'private static function')===0",
"        || stripos($t,'add_menu_page')!==false || stripos($t,'add_submenu_page')!==false || stripos($t,'nav-tab')!==false) {",
"      $o['struktura'][] = ($i+1).': '.substr($t,0,130);",
"    }",
"  }",
"  $i = stripos($s, 'add_menu_page');",
"  $o['meniu_registracija'] = $i!==false ? substr($s, max(0,$i-300), 900) : '';",
"  $j = stripos($s, 'nav-tab');",
"  $o['skirtukai'] = $j!==false ? substr($s, max(0,$j-500), 1200) : '(nav-tab nerasta)';",
" }",
" header('Content-Type: application/json'); echo wp_json_encode($o); exit;",
"}, 131);"].join(NL));
await new Promise(r=>setTimeout(r,4500));
try{ out.r = JSON.parse(await (await fetch(WP+'/?ps_sk=SK1x')).text()); }catch(e){ out.e=String(e).slice(0,200); }
await off(s);
let sha=null;
try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/sk.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
const body={message:'rez',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) body.sha=sha;
await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/sk.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
console.log('ok');
