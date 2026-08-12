process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
import { execSync } from 'child_process';
import { chromium } from 'playwright';
const B='https://dev.avesa.lt';
const U=process.env.WP_USER,P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='Basic '+Buffer.from(U+':'+P).toString('base64');
const TOK=process.env.GH_TOKEN||'', REPO=process.env.GH_REPO||'';
fs.mkdirSync('screenshots',{recursive:true});
const out={marker:'KOPIJA DEPLOY v1', ts:new Date().toISOString()};

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

/* 1) DEPLOY snippetas */
const phpDep = `
add_action('wp_loaded', function(){
  if ( ( $_GET['ps_dep'] ?? '' ) !== 'Kp5tW7' ) return;
  @set_time_limit(240);
  $o = array('marker'=>'DEPLOY KOPIJA v1');
  $f = basename( $_GET['f'] ?? '' );
  $b64 = $_POST['turinys'] ?? '';
  if ( ! $f || ! $b64 ) { $o['err']='nera duomenu'; header('Content-Type: application/json'); echo wp_json_encode($o); exit; }
  $kodas = base64_decode($b64);
  $o['f']=$f; $o['bytes']=strlen($kodas); $o['md5']=md5($kodas);
  $tmp = sys_get_temp_dir().'/ps-dep-'.$f;
  file_put_contents($tmp, $kodas);
  $lint = null;
  if ( function_exists('shell_exec') ) {
    $php = PHP_BINARY ?: 'php';
    $lint = trim((string) @shell_exec( escapeshellcmd($php).' -l '.escapeshellarg($tmp).' 2>&1' ));
  }
  $o['lint'] = $lint;
  $ok = ( $lint !== null && $lint !== '' ) ? ( stripos($lint,'No syntax errors') !== false ) : null;
  if ( $ok === null ) {
    try { include $tmp; $ok = true; $o['lint']='include OK'; }
    catch (\\ParseError $e) { $ok = false; $o['lint']='ParseError: '.$e->getMessage().' eil. '.$e->getLine(); }
    catch (\\Throwable $e) { $ok = true; $o['lint']='Runtime: '.$e->getMessage().' (sintakse OK)'; }
  }
  $o['sintakse_ok'] = $ok;
  if ( $ok ) {
    $dest = WPMU_PLUGIN_DIR.'/'.$f;
    if ( file_exists($dest) ) {
      $bak = WPMU_PLUGIN_DIR.'/.bak-'.$f.'-'.date('Ymd-His');
      @copy($dest,$bak); $o['backup']=basename($bak);
    }
    $o['irasyta'] = file_put_contents($dest, $kodas);
    $o['dest_md5'] = file_exists($dest) ? md5_file($dest) : null;
    $o['sutampa'] = ( $o['dest_md5'] === $o['md5'] );
  }
  @unlink($tmp);
  header('Content-Type: application/json; charset=utf-8'); echo wp_json_encode($o); exit;
}, 99);
`;
const s1=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP Kopija Deploy v1',code:phpDep,scope:'global',active:true,priority:5})});
const j1=js(s1.text); out.snip_dep=j1&&j1.id?j1.id:s1.text.slice(0,200);

/* 2) autologin */
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
const s2=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP Kopija Autologin v1',code:phpAuto,scope:'global',active:true,priority:5})});
const j2=js(s2.text); out.snip_auto=j2&&j2.id?j2.id:s2.text.slice(0,200);
await new Promise(r=>setTimeout(r,4000));

/* 3) failu irasymas */
for (const f of ['petshop-gavimas.php','petshop-katalogas.php']) {
  try{
    const raw = execSync(`curl -s "https://raw.githubusercontent.com/${REPO}/main/deploy/${f}.b64" --max-time 90`,{encoding:'utf8',maxBuffer:60*1024*1024}).trim();
    fs.writeFileSync('/tmp/pl.txt','turinys='+encodeURIComponent(raw));
    const res=execSync(`curl -sk -X POST "${B}/?ps_dep=Kp5tW7&f=${f}" --data @/tmp/pl.txt --max-time 180`,{encoding:'utf8',maxBuffer:20*1024*1024});
    out['dep_'+f]=js(res)||res.slice(0,600);
  }catch(e){ out['dep_'+f]='ERR '+String(e).slice(0,300); }
}

/* 4) testine preke */
const q=await wp('/wp-json/wc/v3/products?status=publish&per_page=5&orderby=id&order=desc&_fields=id,name,sku,categories');
const jq=js(q.text); out.kandidatai = Array.isArray(jq)? jq.map(x=>({id:x.id,name:x.name,kat:(x.categories||[]).map(c=>c.name)})) : String(q.text).slice(0,200);
const testId = (Array.isArray(jq)&&jq.length)? jq[0].id : 0;
out.testId=testId;

/* 5) vizuali patikra */
const files=[];
try{
  const br=await chromium.launch();
  const ctx=await br.newContext({ignoreHTTPSErrors:true,viewport:{width:1500,height:1200}});
  const pg=await ctx.newPage();
  const errs=[]; pg.on('pageerror',e=>errs.push(String(e).slice(0,200)));
  if (testId) {
    await pg.goto(`${B}/?ps_auto=Qz7Rk88&u=${encodeURIComponent(U)}&to=${encodeURIComponent('admin.php?page=ps-gavimas&kopija='+testId)}`,{waitUntil:'domcontentloaded',timeout:60000});
    await pg.waitForTimeout(7000);
    await pg.screenshot({path:'screenshots/kop_gavimas.png',fullPage:false}); files.push('screenshots/kop_gavimas.png');
    out.gavimas_kopija = await pg.evaluate(()=>{
      const v=id=>{const e=document.getElementById(id);return e?(e.tagName==='SELECT'?((e.options[e.selectedIndex]||{}).textContent+' ['+e.value+']'):e.value):null;};
      return {
        url:location.href,
        fatal:/Fatal error|Parse error/i.test(document.body.innerText)?document.body.innerText.slice(0,400):'',
        forma_matoma: !!document.getElementById('gav-nauja') && !document.getElementById('gav-nauja').hidden,
        kop_laukas: !!document.getElementById('n-kop-q'),
        kop_inf: (document.getElementById('n-kop-inf')||{}).innerText||'',
        kat:v('n-kat'), brendas:v('n-brendas'), rusis:v('n-rusis'), pak:v('n-pak'), svoris:v('n-svoris'),
        sku:v('n-sku'), ean:v('n-ean'), kaina:v('n-kaina'),
        sek_laukai:document.querySelectorAll('#n-sekcijos textarea').length,
        sek_antrastes:[...document.querySelectorAll('#n-sekcijos label')].map(x=>x.textContent.trim()).slice(0,8),
        pilnumas:(document.getElementById('n-pilnumas')||{}).innerText||''
      };
    });

    await pg.goto(`${B}/?ps_auto=Qz7Rk88&u=${encodeURIComponent(U)}&to=${encodeURIComponent('admin.php?page=ps-katalogas&preke='+testId)}`,{waitUntil:'domcontentloaded',timeout:60000});
    await pg.waitForTimeout(4500);
    await pg.screenshot({path:'screenshots/kop_kortele.png',fullPage:false}); files.push('screenshots/kop_kortele.png');
    out.kortele = await pg.evaluate(()=>({
      url:location.href,
      nuorodos:[...document.querySelectorAll('.kort-nuor a')].map(a=>a.textContent.trim()+' → '+a.getAttribute('href')),
      fatal:/Fatal error|Parse error/i.test(document.body.innerText)?document.body.innerText.slice(0,300):''
    }));
  }
  out.js_klaidos=errs;
  await br.close();
}catch(e){ out.browser_err=String(e).slice(0,600); }

/* 6) valymas */
for (const j of [j1,j2]) { if (j && j.id) await wp('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'DELETE'}); }

/* 7) ekranai i repo */
for (const f of files) {
  try{
    const body={message:'shot '+f, content:fs.readFileSync(f).toString('base64')};
    const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${f}`,{headers:{'Authorization':'Bearer '+TOK}});
    if(g.status===200){ body.sha=(await g.json()).sha; }
    await fetch(`https://api.github.com/repos/${REPO}/contents/${f}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(body)});
  }catch(e){}
}
out.failai=files;
out.put=await putResult('kopija_deploy.json', out);
console.log(JSON.stringify(out).slice(0,3000));
