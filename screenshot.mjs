process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const out={}; const NL=String.fromCharCode(10);
async function api(path,opt={}){ const r=await fetch(WP+path,{...opt,headers:{Authorization:AUTH,'Content-Type':'application/json',...(opt.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(name,code){ const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name,code,scope:'global',active:true,priority:5})}); let j=null; try{j=JSON.parse(cr.t);}catch(e){} return j?j.id:null; }
async function off(id){ if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }
const s = await snip('TEMP META', [
"add_action('wp_loaded', function(){",
" if (($_GET['ps_meta'] ?? '') !== 'M1x') return;",
" $o=array();",
" $ord = wc_get_order(34952);",
" if (!$ord) { $o['klaida']='nera uzsakymo'; }",
" else {",
"  foreach ($ord->get_items() as $id => $it) {",
"    $p = $it->get_product();",
"    $meta = array();",
"    foreach ($it->get_meta_data() as $m) { $d=$m->get_data(); $meta[$d['key']] = is_scalar($d['value']) ? substr((string)$d['value'],0,40) : '(masyvas)'; }",
"    $o['eilutes'][] = array(",
"      'item' => (int) $id,",
"      'pav' => mb_substr($it->get_name(),0,34),",
"      'pid' => $it->get_product_id(),",
"      'tipas' => $p ? $p->get_type() : '-',",
"      'meta' => $meta",
"    );",
"  }",
" }",
" header('Content-Type: application/json'); echo wp_json_encode($o); exit;",
"}, 131);"].join(NL));
await new Promise(r=>setTimeout(r,4500));
try{ out.r = JSON.parse(await (await fetch(WP+'/?ps_meta=M1x')).text()); }catch(e){ out.e=String(e).slice(0,200); }
await off(s);
let sha=null;
try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/meta.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
const body={message:'rez',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) body.sha=sha;
await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/meta.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
console.log('ok');
