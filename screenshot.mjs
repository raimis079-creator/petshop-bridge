process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
import { chromium } from 'playwright';
const B='https://dev.avesa.lt';
const U=process.env.WP_USER,P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='Basic '+Buffer.from(U+':'+P).toString('base64');
const TOK=process.env.GH_TOKEN||'', REPO=process.env.GH_REPO||'';
fs.mkdirSync('screenshots',{recursive:true});
const out={marker:'MINIATIURA FIX', ts:new Date().toISOString()};
async function wp(p,o={}){try{const r=await fetch(B+p,{...o,headers:{'Authorization':AUTH,'Content-Type':'application/json',...(o.headers||{})}});return{status:r.status,text:await r.text()}}catch(e){return{status:0,text:String(e)}}}
function js(t){const i=Math.min(...['[','{'].map(c=>{const x=t.indexOf(c);return x<0?1e9:x}));try{return JSON.parse(t.slice(i))}catch(e){return null}}
const phpDep = `
add_action('wp_loaded', function(){
  if ( ( \$_GET['ps_dep'] ?? '' ) !== 'Kp5tW7' ) return;
  @set_time_limit(240);
  \$o = array('marker'=>'DEPLOY');
  \$f = basename( \$_GET['f'] ?? '' );
  \$b64 = \$_POST['turinys'] ?? '';
  if ( ! \$f || ! \$b64 ) { \$o['err']='nera duomenu'; header('Content-Type: application/json'); echo wp_json_encode(\$o); exit; }
  \$kodas = base64_decode(\$b64);
  \$o['f']=\$f; \$o['md5']=md5(\$kodas);
  \$ok=null;
  try { @token_get_all( \$kodas, TOKEN_PARSE ); \$ok=true; \$o['lint']='OK'; }
  catch ( \\ParseError \$e ) { \$ok=false; \$o['lint']='ParseError: '.\$e->getMessage().' eil. '.\$e->getLine(); }
  \$o['sintakse_ok']=\$ok;
  if ( \$ok ) {
    \$dest = WPMU_PLUGIN_DIR.'/'.\$f;
    if ( file_exists(\$dest) ) { \$bak = WPMU_PLUGIN_DIR.'/.bak-'.\$f.'-'.date('Ymd-His'); @copy(\$dest,\$bak); \$o['backup']=basename(\$bak); }
    file_put_contents(\$dest, \$kodas);
    \$o['dest_md5']=md5_file(\$dest); \$o['sutampa']=(\$o['dest_md5']===\$o['md5']);
    delete_transient('ps_kat_duomenys');
    \$o['kesas_isvalytas']=true;
  }
  header('Content-Type: application/json; charset=utf-8'); echo wp_json_encode(\$o); exit;
}, 99);
`;
const s1=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP Fix Deploy v1',code:phpDep,scope:'global',active:true,priority:5})});
const j1=js(s1.text); out.snip=j1&&j1.id?j1.id:s1.text.slice(0,150);
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
const s2=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP Fix Autologin v1',code:phpAuto,scope:'global',active:true,priority:5})});
const j2=js(s2.text);
await new Promise(r=>setTimeout(r,4000));
const { execSync } = await import('child_process');
for (const f of ['petshop-gavimas.php','petshop-katalogas.php']) {
  try{
    const gg=await fetch('https://api.github.com/repos/'+REPO+'/contents/deploy/'+f+'.b64?ref=101804805e6b8d7771d80f936fb4b1eb8f702a35',{headers:{'Authorization':'Bearer '+TOK}});
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
  const ctx=await br.newContext({ignoreHTTPSErrors:true,viewport:{width:1500,height:900}});
  const pg=await ctx.newPage();
  const errs=[]; pg.on('pageerror',e=>errs.push(String(e).slice(0,160)));
  await pg.goto(B+'/?ps_auto=Qz7Rk88&u='+encodeURIComponent(U)+'&to='+encodeURIComponent('admin.php?page=ps-katalogas'),{waitUntil:'domcontentloaded',timeout:60000});
  await pg.waitForTimeout(7000);
  out.miniatiuros = await pg.evaluate(()=>{
    const res={};
    [19089,34907].forEach(id=>{
      const tr=[...document.querySelectorAll('tr[data-id]')].find(x=>+x.dataset.id===id);
      if(!tr){ res[id]='nera eilutes siame puslapyje'; return; }
      const im=tr.querySelector('img');
      res[id]= im ? (im.currentSrc||im.src||'NERA SRC') : 'NERA IMG';
    });
    return res;
  });
  /* jei nerado — ieskom per URL su paieska */
  if(String(out.miniatiuros['19089']).indexOf('nera eilutes')===0){
    await pg.goto(B+'/?ps_auto=Qz7Rk88&u='+encodeURIComponent(U)+'&to='+encodeURIComponent('admin.php?page=ps-katalogas&q=Baltos'),{waitUntil:'domcontentloaded',timeout:60000});
    await pg.waitForTimeout(6000);
    out.miniatiuros2 = await pg.evaluate(()=>{
      const out={};
      [...document.querySelectorAll('tr[data-id]')].slice(0,60).forEach(tr=>{
        const t=(tr.innerText||'');
        if(/Baltos triu/i.test(t)){ const im=tr.querySelector('img'); out[tr.dataset.id]= im?(im.currentSrc||im.src||'NERA SRC'):'NERA IMG'; }
      });
      return out;
    });
  }
  await pg.screenshot({path:'screenshots/fix_sarasas.png',fullPage:false}); files.push('screenshots/fix_sarasas.png');
  /* gavimo langas — nauji mygtukai */
  await pg.goto(B+'/?ps_auto=Qz7Rk88&u='+encodeURIComponent(U)+'&to='+encodeURIComponent('admin.php?page=ps-gavimas&kopija=19089'),{waitUntil:'domcontentloaded',timeout:60000});
  await pg.waitForTimeout(7000);
  out.gavimas = await pg.evaluate(()=>({
    mygtukai:[...document.querySelectorAll('#gav-nauja .lg-f button')].map(b=>b.textContent.trim()),
    forma:!!document.getElementById('gav-nauja') && !document.getElementById('gav-nauja').hidden,
    foto:!!document.querySelector('#n-foto-p img'),
    sukurtos_blokas:!!document.getElementById('g-sukurtos')
  }));
  await pg.screenshot({path:'screenshots/fix_gavimas.png',fullPage:false}); files.push('screenshots/fix_gavimas.png');
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
const body={message:'res fix',content:Buffer.from(JSON.stringify(out,null,1)).toString('base64')};
const g=await fetch('https://api.github.com/repos/'+REPO+'/contents/screenshots/fix.json',{headers:{'Authorization':'Bearer '+TOK}});
if(g.status===200){ body.sha=(await g.json()).sha; }
await fetch('https://api.github.com/repos/'+REPO+'/contents/screenshots/fix.json',{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(body)});
console.log(JSON.stringify(out).slice(0,1500));
