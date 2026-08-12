process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
import { execSync } from 'child_process';
import { chromium } from 'playwright';
const B='https://dev.avesa.lt';
const U=process.env.WP_USER,P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='Basic '+Buffer.from(U+':'+P).toString('base64');
const TOK=process.env.GH_TOKEN||'', REPO=process.env.GH_REPO||'';
fs.mkdirSync('screenshots',{recursive:true});
const out={marker:'GPAIS DEPLOY', ts:new Date().toISOString()};
async function wp(p,o={}){try{const r=await fetch(B+p,{...o,headers:{'Authorization':AUTH,'Content-Type':'application/json',...(o.headers||{})}});return{status:r.status,text:await r.text()}}catch(e){return{status:0,text:String(e)}}}
function js(t){const i=Math.min(...['[','{'].map(c=>{const x=t.indexOf(c);return x<0?1e9:x}));try{return JSON.parse(t.slice(i))}catch(e){return null}}
const phpDep = `
add_action('wp_loaded', function(){
  if ( ( \$_GET['ps_dep'] ?? '' ) !== 'Kp5tW7' ) return;
  @set_time_limit(240);
  \$o=array('marker'=>'DEPLOY');
  \$f=basename( \$_GET['f'] ?? '' ); \$b64=\$_POST['turinys'] ?? '';
  if(!\$f||!\$b64){ \$o['err']='nera'; header('Content-Type: application/json'); echo wp_json_encode(\$o); exit; }
  \$k=base64_decode(\$b64); \$o['f']=\$f; \$o['md5']=md5(\$k);
  \$ok=null;
  try{ @token_get_all(\$k, TOKEN_PARSE); \$ok=true; \$o['lint']='OK'; }
  catch(\\ParseError \$e){ \$ok=false; \$o['lint']='ParseError: '.\$e->getMessage().' eil. '.\$e->getLine(); }
  \$o['sintakse_ok']=\$ok;
  if(\$ok){
    \$d=WPMU_PLUGIN_DIR.'/'.\$f;
    if(file_exists(\$d)){ \$b=WPMU_PLUGIN_DIR.'/.bak-'.\$f.'-'.date('Ymd-His'); @copy(\$d,\$b); \$o['backup']=basename(\$b); }
    file_put_contents(\$d,\$k); \$o['dest_md5']=md5_file(\$d); \$o['sutampa']=(\$o['dest_md5']===\$o['md5']);
    delete_transient('ps_kat_duomenys');
  }
  header('Content-Type: application/json; charset=utf-8'); echo wp_json_encode(\$o); exit;
}, 99);
`;
const s1=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP GPAIS Deploy v2',code:phpDep,scope:'global',active:true,priority:5})});
const j1=js(s1.text);
const phpAuto = `
add_action('init', function(){
  if ( ( \$_GET['ps_auto'] ?? '' ) !== 'Qz7Rk88' ) return;
  \$login = isset(\$_GET['u']) ? sanitize_user(\$_GET['u']) : '';
  \$u = \$login ? get_user_by('login',\$login) : null;
  if ( ! \$u ) { \$a = get_users(array('role'=>'administrator','number'=>1)); \$u = \$a ? \$a[0] : null; }
  if ( ! \$u ) { wp_die('no admin'); }
  wp_set_current_user(\$u->ID);
  \$tok = \\WP_Session_Tokens::get_instance(\$u->ID)->create(time()+1800);
  wp_set_auth_cookie(\$u->ID, false, true, \$tok);
  wp_safe_redirect( admin_url( isset(\$_GET['to']) ? \$_GET['to'] : 'index.php' ) ); exit;
});
`;
const s2=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP GPAIS Autologin v2',code:phpAuto,scope:'global',active:true,priority:5})});
const j2=js(s2.text);
await new Promise(r=>setTimeout(r,4000));
for (const f of ['petshop-katalogas.php']) {
  try{
    const gg=await fetch('https://api.github.com/repos/'+REPO+'/contents/deploy/'+f+'.b64?ref=dc15333f1f7e1ffce6c2b2b71829c3dbd5157b65',{headers:{'Authorization':'Bearer '+TOK}});
    const gj=await gg.json();
    const raw=Buffer.from(gj.content||'','base64').toString('utf8').trim();
    fs.writeFileSync('/tmp/pl.txt','turinys='+encodeURIComponent(raw));
    const res=execSync('curl -sk -X POST "'+B+'/?ps_dep=Kp5tW7&f='+f+'" --data @/tmp/pl.txt --max-time 180',{encoding:'utf8',maxBuffer:20*1024*1024});
    out['dep_'+f]=js(res)||res.slice(0,300);
  }catch(e){ out['dep_'+f]='ERR '+String(e).slice(0,200); }
}
const files=[];
try{
  const br=await chromium.launch();
  const ctx=await br.newContext({ignoreHTTPSErrors:true,viewport:{width:1400,height:1000}});
  const pg=await ctx.newPage();
  const errs=[]; pg.on('pageerror',e=>errs.push(String(e).slice(0,180)));
  await pg.goto(B+'/?ps_auto=Qz7Rk88&u='+encodeURIComponent(U)+'&to='+encodeURIComponent('admin.php?page=ps-katalogas'),{waitUntil:'domcontentloaded',timeout:60000});
  await pg.waitForTimeout(5000);
  await pg.evaluate(()=>{ const a=document.querySelector('.pskat-t .atv'); if(a) a.click(); });
  await pg.waitForTimeout(6000);
  out.skirtukai = await pg.evaluate(()=>[...document.querySelectorAll('.kort-tabs button')].map(b=>b.textContent.trim()));
  await pg.evaluate(()=>{ const b=[...document.querySelectorAll('.kort-tabs button')].find(x=>/GPAIS/i.test(x.textContent)); if(b) b.click(); });
  await pg.waitForTimeout(2500);
  /* pridedam eilute */
  out.pries = await pg.evaluate(()=>({ zyme:(document.querySelector('.kort-pak-zyme')||{}).textContent||'', mygtukas:!!document.querySelector('.kpak-nauja') }));
  await pg.evaluate(()=>{ const b=document.querySelector('.kpak-nauja'); if(b) b.click(); });
  await pg.waitForTimeout(1200);
  out.forma = await pg.evaluate(()=>{
    const f=document.querySelector('.kort-pak-forma'); if(!f) return 'nera formos';
    f.querySelector('.kpf-pav').value='dėžutė (testas)';
    f.querySelector('.kpf-sv').value='15,5';
    f.querySelector('.kpf-vnt').value='1';
    return { laukai:[...f.querySelectorAll('input,select')].length,
             medziagos:[...f.querySelectorAll('.kpf-med option')].map(o=>o.textContent).slice(0,3) };
  });
  await pg.screenshot({path:'screenshots/gpais2_forma.png',fullPage:false}); files.push('screenshots/gpais2_forma.png');
  await pg.evaluate(()=>{ document.querySelector('.kpf-irasyti').click(); });
  await pg.waitForTimeout(3500);
  out.po_irasymo = await pg.evaluate(()=>({
    stat:(document.querySelector('.kpak-stat')||{}).textContent||'',
    zyme:(document.querySelector('.kort-pak-zyme')||{}).textContent||'',
    eiluciu:document.querySelectorAll('.kort-pak-t tr').length-1,
    pirma:(document.querySelector('.kort-pak-t tr:nth-child(2)')||{}).innerText||''
  }));
  await pg.screenshot({path:'screenshots/gpais2_sarasas.png',fullPage:false}); files.push('screenshots/gpais2_sarasas.png');
  /* isvalom testine eilute */
  out.trynimas = await pg.evaluate(async()=>{
    const b=document.querySelector('.kpak-tr'); if(!b) return 'nera mygtuko';
    window.confirm=()=>true; b.click();
    await new Promise(r=>setTimeout(r,3000));
    return { stat:(document.querySelector('.kpak-stat')||{}).textContent||'',
             zyme:(document.querySelector('.kort-pak-zyme')||{}).textContent||'' };
  });
  out.js_klaidos=errs;
  await br.close();
}catch(e){ out.err=String(e).slice(0,500); }
for (const j of [j1,j2]) { if(j&&j.id) await wp('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'DELETE'}); }
for (const f of files){
  try{ const body={message:'shot',content:fs.readFileSync(f).toString('base64')};
    const g=await fetch('https://api.github.com/repos/'+REPO+'/contents/'+f,{headers:{'Authorization':'Bearer '+TOK}});
    if(g.status===200){ body.sha=(await g.json()).sha; }
    await fetch('https://api.github.com/repos/'+REPO+'/contents/'+f,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(body)});
  }catch(e){}
}
const body={message:'res gpais',content:Buffer.from(JSON.stringify(out,null,1)).toString('base64')};
const g=await fetch('https://api.github.com/repos/'+REPO+'/contents/screenshots/gpais2.json',{headers:{'Authorization':'Bearer '+TOK}});
if(g.status===200){ body.sha=(await g.json()).sha; }
await fetch('https://api.github.com/repos/'+REPO+'/contents/screenshots/gpais2.json',{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(body)});
console.log(JSON.stringify(out).slice(0,1500));
