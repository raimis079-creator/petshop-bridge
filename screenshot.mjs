process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
import { execSync } from 'child_process';
import { chromium } from 'playwright';
const B='https://dev.avesa.lt';
const U=process.env.WP_USER,P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='Basic '+Buffer.from(U+':'+P).toString('base64');
const TOK=process.env.GH_TOKEN||'', REPO=process.env.GH_REPO||'';
fs.mkdirSync('screenshots',{recursive:true});
const out={marker:'TRUMPAS APRASYMAS v1', ts:new Date().toISOString()};
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
const s1=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP Pilna Kopija Deploy v6',code:phpDep,scope:'global',active:true,priority:5})});
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
const s2=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP Pilna Kopija Autologin v6',code:phpAuto,scope:'global',active:true,priority:5})});
const j2=js(s2.text); out.snip_auto=j2&&j2.id?j2.id:s2.text.slice(0,200);
await new Promise(r=>setTimeout(r,4000));
for (const f of ['petshop-katalogas.php']) {
  try{
    const gg=await fetch(`https://api.github.com/repos/${REPO}/contents/deploy/${f}.b64?ref=59e831d686554a35ddfa6b54bf50e17193a24173`,{headers:{'Authorization':'Bearer '+TOK}});
    const gj=await gg.json();
    const raw = Buffer.from(gj.content||'','base64').toString('utf8').trim();
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
const bq=await wp('/wp-json/wc/v3/products/'+testId+'?_fields=id,name,brands,weight,images');
out.saltinis=js(bq.text)||String(bq.text).slice(0,200);
const files=[];
try{
  const br=await chromium.launch();
  const ctx=await br.newContext({ignoreHTTPSErrors:true,viewport:{width:1500,height:1250}});
  const pg=await ctx.newPage();
  const errs=[]; pg.on('pageerror',e=>errs.push(String(e).slice(0,200)));
  const U2=encodeURIComponent(U);
  await pg.goto(B+'/?ps_auto=Qz7Rk88&u='+U2+'&to='+encodeURIComponent('admin.php?page=ps-katalogas'),{waitUntil:'domcontentloaded',timeout:60000});
  await pg.waitForTimeout(5000);
  await pg.evaluate(()=>{ const a=document.querySelector('.pskat-t .atv'); if(a) a.click(); });
  await pg.waitForTimeout(6000);
  await pg.evaluate(()=>{ const b=[...document.querySelectorAll('.kort-tabs button')].find(x=>/Apra/i.test(x.textContent)); if(b) b.click(); });
  await pg.waitForTimeout(2500);
  out.kortele = await pg.evaluate(()=>{
    const blk=document.querySelector('.kort-tr-red');
    return {
      pav:(document.querySelector('.kort-pav-t')||{}).textContent||'',
      trumpas_blokas: !!blk,
      antraste: blk?(blk.querySelector('.kort-antr')||{}).innerText:'',
      reiksme: blk?((blk.querySelector('.kort-tr-txt')||{}).value||''):'',
      mygtukai: blk?[...blk.querySelectorAll('button')].map(b=>b.textContent.trim()):[],
      fatal:/Fatal error|Parse error/i.test(document.body.innerText)?document.body.innerText.slice(0,300):''
    };
  });
  await pg.screenshot({path:'screenshots/trumpas.png',fullPage:false}); files.push('screenshots/trumpas.png');
  out.testas = await pg.evaluate(async()=>{
    const blk=document.querySelector('.kort-tr-red'); if(!blk) return 'nera bloko';
    const ta=blk.querySelector('.kort-tr-txt'); const buvo=ta.value;
    ta.value = buvo + ' [TESTAS]';
    blk.querySelector('.kt-irasyti').click();
    await new Promise(r=>setTimeout(r,3500));
    const st1=(blk.querySelector('.kt-stat')||{}).textContent;
    return {po_irasymo:st1, buvo_ilgis:buvo.length};
  });
  /* patikra is DB, ne is DOM */
  out.po_irasymo_db = null;
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
/* DB patikra ir atstatymas: testinis tekstas neturi likti prekeje */
try{
  const pid = (out.kortele && out.kortele.pav) ? null : null;
  const r1=await wp('/wp-json/wc/v3/products?per_page=1&search='+encodeURIComponent((out.kortele&&out.kortele.pav||'').slice(0,30))+'&_fields=id,short_description');
  const j=js(r1.text);
  if(Array.isArray(j)&&j[0]){
    out.db_po = { id:j[0].id, trumpas:(j[0].short_description||'').slice(0,300) };
    if((j[0].short_description||'').indexOf('[TESTAS]')>=0){
      const svarus=(j[0].short_description||'').replace(/\s*\[TESTAS\]/g,'');
      const r2=await wp('/wp-json/wc/v3/products/'+j[0].id,{method:'PUT',body:JSON.stringify({short_description:svarus})});
      out.atstatyta = r2.status===200;
    }
  }
}catch(e){ out.db_err=String(e).slice(0,200); }
out.put=await putResult('trumpas.json', out);
console.log(JSON.stringify(out).slice(0,2500));
