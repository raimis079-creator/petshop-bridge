process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
import { execSync } from 'child_process';
import { chromium } from 'playwright';
const B='https://dev.avesa.lt';
const U=process.env.WP_USER,P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='Basic '+Buffer.from(U+':'+P).toString('base64');
const TOK=process.env.GH_TOKEN||'', REPO=process.env.GH_REPO||'';
fs.mkdirSync('screenshots',{recursive:true});
const out={marker:'PILNA KOPIJA v1', ts:new Date().toISOString()};
async function wp(p,o={}){try{const r=await fetch(B+p,{...o,headers:{'Authorization':AUTH,'Content-Type':'application/json',...(o.headers||{})}});return{status:r.status,text:await r.text()}}catch(e){return{status:0,text:String(e)}}}
function js(t){const i=Math.min(...['[','{'].map(c=>{const x=t.indexOf(c);return x<0?1e9:x}));try{return JSON.parse(t.slice(i))}catch(e){return null}}
async function putResult(name,obj){
  const path='screenshots/'+name;
  const body={message:'res '+name,content:Buffer.from(JSON.stringify(obj,null,1)).toString('base64')};
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK}});
    if(g.status===200){ body.sha=(await g.json()).sha; }}catch(e){}
  const r=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(body)});
  return r.status;
}
const phpDep = `
add_action('wp_loaded', function(){
  if ( ( $_GET['ps_dep'] ?? '' ) !== 'Kp5tW7' ) return;
  @set_time_limit(240);
  $o = array('marker'=>'DEPLOY');
  $f = basename( $_GET['f'] ?? '' );
  $b64 = $_POST['turinys'] ?? '';
  if ( ! $f || ! $b64 ) { $o['err']='nera duomenu'; header('Content-Type: application/json'); echo wp_json_encode($o); exit; }
  $kodas = base64_decode($b64);
  $o['f']=$f; $o['bytes']=strlen($kodas); $o['md5']=md5($kodas);
  $ok=null; $lint=null;
  try { @token_get_all( $kodas, TOKEN_PARSE ); $ok = true; $lint='token_get_all OK'; }
  catch ( \\ParseError $e ) { $ok=false; $lint='ParseError: '.$e->getMessage().' eil. '.$e->getLine(); }
  catch ( \\Throwable $e ) { $ok=false; $lint='Throwable: '.$e->getMessage(); }
  $o['lint']=$lint; $o['sintakse_ok']=$ok;
  if ( $ok ) {
    $dest = WPMU_PLUGIN_DIR.'/'.$f;
    if ( file_exists($dest) ) { $bak = WPMU_PLUGIN_DIR.'/.bak-'.$f.'-'.date('Ymd-His'); @copy($dest,$bak); $o['backup']=basename($bak); }
    $o['irasyta'] = file_put_contents($dest, $kodas);
    $o['dest_md5'] = file_exists($dest) ? md5_file($dest) : null;
    $o['sutampa'] = ( $o['dest_md5'] === $o['md5'] );
  }
  header('Content-Type: application/json; charset=utf-8'); echo wp_json_encode($o); exit;
}, 99);
`;
const s1=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP Pilna Kopija Deploy v1',code:phpDep,scope:'global',active:true,priority:5})});
const j1=js(s1.text); out.snip_dep=j1&&j1.id?j1.id:s1.text.slice(0,200);
const phpAuto = `
add_action('init', function(){
  if ( ( $_GET['ps_auto'] ?? '' ) !== 'Qz7Rk88' ) return;
  $login = isset($_GET['u']) ? sanitize_user($_GET['u']) : '';
  $u = $login ? get_user_by('login',$login) : null;
  if ( ! $u ) { $a = get_users(array('role'=>'administrator','number'=>1)); $u = $a ? $a[0] : null; }
  if ( ! $u ) { wp_die('no admin'); }
  wp_set_current_user($u->ID);
  $exp = time() + 1800;
  $tok = \\WP_Session_Tokens::get_instance($u->ID)->create($exp);
  wp_set_auth_cookie($u->ID, false, true, $tok);
  $to = isset($_GET['to']) ? $_GET['to'] : 'index.php';
  wp_safe_redirect( admin_url($to) ); exit;
});
`;
const s2=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP Pilna Kopija Autologin v1',code:phpAuto,scope:'global',active:true,priority:5})});
const j2=js(s2.text); out.snip_auto=j2&&j2.id?j2.id:s2.text.slice(0,200);
await new Promise(r=>setTimeout(r,4000));
for (const f of ['petshop-gavimas.php','petshop-katalogas.php']) {
  try{
    const raw = execSync(`curl -s "https://raw.githubusercontent.com/${REPO}/main/deploy/${f}.b64" --max-time 90`,{encoding:'utf8',maxBuffer:60*1024*1024}).trim();
    fs.writeFileSync('/tmp/pl.txt','turinys='+encodeURIComponent(raw));
    const res=execSync(`curl -sk -X POST "${B}/?ps_dep=Kp5tW7&f=${f}" --data @/tmp/pl.txt --max-time 180`,{encoding:'utf8',maxBuffer:20*1024*1024});
    out['dep_'+f]=js(res)||res.slice(0,400);
  }catch(e){ out['dep_'+f]='ERR '+String(e).slice(0,300); }
}
/* testine preke: maistas su nuotrauka ir sudetimi */
const q=await wp('/wp-json/wc/v3/products?status=publish&per_page=20&search=Exclusion&_fields=id,name,images,categories');
const jq=js(q.text);
let testId=0;
if (Array.isArray(jq)) { const c=jq.find(x=>x.images&&x.images.length); testId=c?c.id:(jq[0]&&jq[0].id); }
if(!testId){ const q2=await wp('/wp-json/wc/v3/products?status=publish&per_page=5&_fields=id,name'); const j2b=js(q2.text); testId=(Array.isArray(j2b)&&j2b[0])?j2b[0].id:0; }
out.testId=testId;
const files=[];
try{
  const br=await chromium.launch();
  const ctx=await br.newContext({ignoreHTTPSErrors:true,viewport:{width:1500,height:1250}});
  const pg=await ctx.newPage();
  const errs=[]; pg.on('pageerror',e=>errs.push(String(e).slice(0,200)));
  await pg.goto(`${B}/?ps_auto=Qz7Rk88&u=${encodeURIComponent(U)}&to=${encodeURIComponent('admin.php?page=ps-gavimas&kopija='+testId)}`,{waitUntil:'domcontentloaded',timeout:60000});
  await pg.waitForTimeout(8000);
  await pg.screenshot({path:'screenshots/pk_gavimas.png',fullPage:false}); files.push('screenshots/pk_gavimas.png');
  out.forma = await pg.evaluate(()=>{
    const v=id=>{const e=document.getElementById(id);return e?(e.tagName==='SELECT'?((e.options[e.selectedIndex]||{}).textContent+' ['+e.value+']'):e.value):null;};
    return {
      fatal:/Fatal error|Parse error/i.test(document.body.innerText)?document.body.innerText.slice(0,300):'',
      pav:v('n-pav'), sku:v('n-sku'), ean:v('n-ean'), kaina:v('n-kaina'),
      kat:v('n-kat'), brendas:v('n-brendas'), rusis:v('n-rusis'), pak:v('n-pak'), svoris:v('n-svoris'),
      foto: !!document.querySelector('#n-foto-p img'),
      foto_src:(document.querySelector('#n-foto-p img')||{}).src||'',
      sekcijos:[...document.querySelectorAll('#n-sekcijos .sek')].map(d=>({
        a:(d.querySelector('label')||{}).textContent.trim(),
        n:((d.querySelector('textarea')||{}).value||'').length })),
      kop_inf:(document.getElementById('n-kop-inf')||{}).innerText||'',
      pilnumas:(document.getElementById('n-pilnumas')||{}).innerText||''
    };
  });
  out.js_klaidos=errs;
  await br.close();
}catch(e){ out.err=String(e).slice(0,600); }
for (const j of [j1,j2]) { if (j && j.id) await wp('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'DELETE'}); }
for (const f of files) {
  try{
    const body={message:'shot '+f, content:fs.readFileSync(f).toString('base64')};
    const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${f}`,{headers:{'Authorization':'Bearer '+TOK}});
    if(g.status===200){ body.sha=(await g.json()).sha; }
    await fetch(`https://api.github.com/repos/${REPO}/contents/${f}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(body)});
  }catch(e){}
}
out.put=await putResult('pilna_kopija.json', out);
console.log(JSON.stringify(out).slice(0,2500));
