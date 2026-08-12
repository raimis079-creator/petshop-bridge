process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
import { execSync } from 'child_process';
import { chromium } from 'playwright';
const B='https://dev.avesa.lt';
const U=process.env.WP_USER,P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='Basic '+Buffer.from(U+':'+P).toString('base64');
const TOK=process.env.GH_TOKEN||'', REPO=process.env.GH_REPO||'';
fs.mkdirSync('screenshots',{recursive:true});
const out={marker:'V70 DEPLOY + SARGAS', ts:new Date().toISOString()};
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
const s1=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP V72 Deploy',code:phpDep,scope:'global',active:true,priority:5})});
const j1=js(s1.text);
const phpAuto = `
add_action('init', function(){
  if ( ( \$_GET['ps_auto'] ?? '' ) !== 'Qz7Rk88' ) return;
  \$a = get_users(array('role'=>'administrator','number'=>1)); \$u = \$a ? \$a[0] : null;
  if ( ! \$u ) { wp_die('no admin'); }
  wp_set_current_user(\$u->ID);
  \$tok = \\WP_Session_Tokens::get_instance(\$u->ID)->create(time()+1800);
  wp_set_auth_cookie(\$u->ID, false, true, \$tok);
  wp_safe_redirect( admin_url( isset(\$_GET['to']) ? \$_GET['to'] : 'index.php' ) ); exit;
});
`;
const s2=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP V72 Autologin',code:phpAuto,scope:'global',active:true,priority:5})});
const j2=js(s2.text);
await new Promise(r=>setTimeout(r,4000));
try{
  for (const f of ['petshop-katalogas.php']) {
    const gg=await fetch('https://api.github.com/repos/'+REPO+'/contents/deploy/'+f+'.b64?ref=83d9927772aee8a81ed996e2c3dad659d1b0d93d',{headers:{'Authorization':'Bearer '+TOK}});
    const gj=await gg.json();
    const raw=Buffer.from(gj.content||'','base64').toString('utf8').trim();
    fs.writeFileSync('/tmp/pl.txt','turinys='+encodeURIComponent(raw));
    const res=execSync('curl -sk -X POST "'+B+'/?ps_dep=Kp5tW7&f='+f+'" --data @/tmp/pl.txt --max-time 180',{encoding:'utf8',maxBuffer:20*1024*1024});
    out['dep_'+f]=js(res)||res.slice(0,250);
  }
}catch(e){ out.deploy_err=String(e).slice(0,300); }

/* SARGAS: inventorius trims prekems */
const phpInv = `
add_action('init', function(){
  if ( ( \$_GET['ps_sarg'] ?? '' ) !== 'Sg1tX1' ) return;
  @set_time_limit(240);
  \$o=array('marker'=>'SARGAS','v'=>Petshop_Katalogas::VERSIJA);
  foreach ( array(34907, 25319, 19902) as \$pid ) {
    ob_start(); Petshop_Katalogas::kortele(\$pid); \$h=ob_get_clean();
    \$e=array();
    foreach ( array(
      'likutis'=>'kort-lik-irasyti','likucio_priez'=>'kort-lik-priez','partijos'=>'kort-t',
      'kategorijos'=>'kort-kat-keisti','sudelioti'=>'ka-sudelioti','karkasas'=>'ka-karkasas',
      'aprasymas'=>'ka-irasyti','trumpas'=>'kt-irasyti','nuotrauka'=>'kn-pagrindine',
      'galerija'=>'kn-galerija','atributai'=>'kort-atr-keisti','kaina'=>'kort-kaina',
      'sku'=>'kort-sku','gpais'=>'kpak-nauja','kopijuoti'=>'kopija=','veiksmai'=>'kort-vm'
    ) as \$k=>\$z ) { \$e[\$k]=substr_count(\$h,\$z); }
    \$e['ilgis']=strlen(\$h);
    \$o['preke_'.\$pid]=\$e;
  }
  header('Content-Type: application/json; charset=utf-8'); echo wp_json_encode(\$o, JSON_UNESCAPED_UNICODE); exit;
}, 1);
`;
const s3=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP V72 Sargas',code:phpInv,scope:'global',active:true,priority:5})});
const j3=js(s3.text);
await new Promise(r=>setTimeout(r,4000));
try{
  const res=execSync('curl -sk "'+B+'/?ps_sarg=Sg1tX1" --max-time 150',{encoding:'utf8',maxBuffer:40*1024*1024});
  out.sargas=js(res)||res.slice(0,800);
}catch(e){ out.sargas_err=String(e).slice(0,300); }

/* E2E: likutis ir kategorijos */
const files=[];
try{
  const br=await chromium.launch();
  const ctx=await br.newContext({ignoreHTTPSErrors:true,viewport:{width:1400,height:1100}});
  const pg=await ctx.newPage();
  const errs=[]; pg.on('pageerror',e=>errs.push(String(e).slice(0,180)));
  await pg.goto(B+'/?ps_auto=Qz7Rk88&to='+encodeURIComponent('admin.php?page=ps-katalogas'),{waitUntil:'domcontentloaded',timeout:60000});
  await pg.waitForSelector('.pskat-t .atv',{timeout:45000});
  /* saraso patikra: ar VF/ZB eilutes nebe redaguojamos */
  out.sarasas = await pg.evaluate(()=>{
    const r={rankiniu:0, xml:0};
    document.querySelectorAll('.pskat-t tbody tr').forEach(tr=>{
      const sd=(tr.querySelector('.sand')||{}).textContent||'';
      const td=tr.querySelector('td.av-lang');
      if(!td) return;
      if(/^(VF|ZB)$/.test(sd.trim())){ if(!td.classList.contains('red-lang')) r.xml++; }
      else { if(td.classList.contains('red-lang')) r.rankiniu++; }
    });
    return r;
  });
  let ok=false;
  for(let b=0;b<3 && !ok;b++){
    await pg.evaluate(()=>{ const k=document.querySelector('.kort-kartoti'); if(k){k.click();return;} const a=document.querySelector('.pskat-t .atv'); if(a) a.click(); });
    try{ await pg.waitForSelector('.kort-lik-irasyti',{timeout:25000}); ok=true; }catch(e){ await pg.waitForTimeout(3000); }
  }
  out.kortele_atsidare=ok;
  if(ok){
    out.pries = await pg.evaluate(()=>({
      likutis:(document.querySelector('.kort-lik-dabar')||{}).textContent||'',
      kategorijos:[...document.querySelectorAll('.kort-kat-z')].map(x=>x.textContent),
      sudelioti:!!document.querySelector('.ka-sudelioti')
    }));
    /* likučio testas: +1 ir atgal -1 */
    await pg.evaluate(()=>{ const i=document.querySelector('.kort-lik-in'); i.value='+1'; document.querySelector('.kort-lik-irasyti').click(); });
    await pg.waitForTimeout(3500);
    out.po_plius = await pg.evaluate(()=>({ dabar:(document.querySelector('.kort-lik-dabar')||{}).textContent||'', stat:(document.querySelector('.kort-lik-stat')||{}).textContent||'' }));
    await pg.evaluate(()=>{ const i=document.querySelector('.kort-lik-in'); i.value='-1'; document.querySelector('.kort-lik-irasyti').click(); });
    await pg.waitForTimeout(3500);
    out.po_minus = await pg.evaluate(()=>({ dabar:(document.querySelector('.kort-lik-dabar')||{}).textContent||'', stat:(document.querySelector('.kort-lik-stat')||{}).textContent||'' }));
    await pg.screenshot({path:'screenshots/v72_apz.png',fullPage:false}); files.push('screenshots/v72_apz.png');
    /* kategorijų langas atsidaro */
    await pg.evaluate(()=>{ document.querySelector('.kort-kat-keisti').click(); });
    await pg.waitForTimeout(1500);
    out.kategoriju_langas = await pg.evaluate(()=>({
      matomas:!document.querySelector('.kort-kat-lauk').hidden,
      eiluciu:document.querySelectorAll('.kort-kat-e').length,
      pazymeta:document.querySelectorAll('.kort-kat-e input:checked').length
    }));
    await pg.screenshot({path:'screenshots/v72_kat.png',fullPage:false}); files.push('screenshots/v72_kat.png');
  }
  out.js_klaidos=errs;
  await br.close();
}catch(e){ out.err=String(e).slice(0,500); }
for (const j of [j1,j2,j3]) { if(j&&j.id) await wp('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'DELETE'}); }
for (const f of files){
  try{ const body={message:'shot',content:fs.readFileSync(f).toString('base64')};
    const g=await fetch('https://api.github.com/repos/'+REPO+'/contents/'+f,{headers:{'Authorization':'Bearer '+TOK}});
    if(g.status===200){ body.sha=(await g.json()).sha; }
    await fetch('https://api.github.com/repos/'+REPO+'/contents/'+f,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(body)});
  }catch(e){}
}
const body={message:'res v70',content:Buffer.from(JSON.stringify(out,null,1)).toString('base64')};
const g=await fetch('https://api.github.com/repos/'+REPO+'/contents/screenshots/v72.json',{headers:{'Authorization':'Bearer '+TOK}});
if(g.status===200){ body.sha=(await g.json()).sha; }
await fetch('https://api.github.com/repos/'+REPO+'/contents/screenshots/v72.json',{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(body)});
console.log(JSON.stringify(out).slice(0,1200));
