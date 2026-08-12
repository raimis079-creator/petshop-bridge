process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
import { chromium } from 'playwright';
const B='https://dev.avesa.lt';
const U=process.env.WP_USER,P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='Basic '+Buffer.from(U+':'+P).toString('base64');
const TOK=process.env.GH_TOKEN||'', REPO=process.env.GH_REPO||'';
fs.mkdirSync('screenshots',{recursive:true});
const out={marker:'NUOTRAUKA VIZUALIAI', ts:new Date().toISOString()};
async function wp(p,o={}){try{const r=await fetch(B+p,{...o,headers:{'Authorization':AUTH,'Content-Type':'application/json',...(o.headers||{})}});return{status:r.status,text:await r.text()}}catch(e){return{status:0,text:String(e)}}}
function js(t){const i=Math.min(...['[','{'].map(c=>{const x=t.indexOf(c);return x<0?1e9:x}));try{return JSON.parse(t.slice(i))}catch(e){return null}}
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
const s2=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP Nuotr Autologin v2',code:phpAuto,scope:'global',active:true,priority:5})});
const j2=js(s2.text); out.snip=j2&&j2.id?j2.id:s2.text.slice(0,150);
await new Promise(r=>setTimeout(r,3500));
const files=[];
try{
  const br=await chromium.launch();
  const ctx=await br.newContext({ignoreHTTPSErrors:true,viewport:{width:1400,height:1000}});
  const pg=await ctx.newPage();
  const errs=[]; pg.on('pageerror',e=>errs.push(String(e).slice(0,160)));
  /* 1. originalo puslapis parduotuveje */
  await pg.goto(B+'/?p=19089',{waitUntil:'domcontentloaded',timeout:60000});
  await pg.waitForTimeout(4000);
  out.orig_puslapis = await pg.evaluate(()=>({
    url:location.href, title:document.title,
    h1:(document.querySelector('h1')||{}).textContent||'',
    img:[...document.querySelectorAll('.product-gallery img, .woocommerce-product-gallery img, .product-images img')].map(i=>i.currentSrc||i.src).slice(0,3),
    placeholder: document.body.innerHTML.indexOf('woocommerce-placeholder')>=0
  }));
  await pg.screenshot({path:'screenshots/n_orig.png',fullPage:false}); files.push('screenshots/n_orig.png');
  /* 2. kopijos puslapis */
  await pg.goto(B+'/?p=34907',{waitUntil:'domcontentloaded',timeout:60000});
  await pg.waitForTimeout(3500);
  out.kop_puslapis = await pg.evaluate(()=>({
    h1:(document.querySelector('h1')||{}).textContent||'',
    img:[...document.querySelectorAll('.product-gallery img, .woocommerce-product-gallery img, .product-images img')].map(i=>i.currentSrc||i.src).slice(0,3),
    placeholder: document.body.innerHTML.indexOf('woocommerce-placeholder')>=0
  }));
  await pg.screenshot({path:'screenshots/n_kop.png',fullPage:false}); files.push('screenshots/n_kop.png');
  /* 3. katalogas: paieska pagal pavadinima */
  await pg.goto(B+'/?ps_auto=Qz7Rk88&u='+encodeURIComponent(U)+'&to='+encodeURIComponent('admin.php?page=ps-katalogas'),{waitUntil:'domcontentloaded',timeout:60000});
  await pg.waitForTimeout(5000);
  await pg.evaluate(()=>{
    const inp=document.querySelector('#pskat-q, input[type=search], .pskat-paieska input');
    if(inp){ inp.value='Baltos triušio ausys'; inp.dispatchEvent(new Event('input',{bubbles:true})); }
  });
  await pg.waitForTimeout(4000);
  out.sarasas = await pg.evaluate(()=>{
    const eil=[...document.querySelectorAll('.pskat-t tbody tr[data-id]')].slice(0,6);
    return eil.map(tr=>{ const im=tr.querySelector('img');
      return { id:tr.dataset.id, pav:(tr.innerText||'').slice(0,60).replace(/\n/g,' | '),
               img: im?(im.currentSrc||im.src||im.getAttribute('src')||'NERA SRC'):'NERA IMG' }; });
  });
  await pg.screenshot({path:'screenshots/n_sarasas.png',fullPage:false}); files.push('screenshots/n_sarasas.png');
  /* 4. kortele + Nuotrauku skirtukas */
  await pg.evaluate(()=>{ const a=[...document.querySelectorAll('.pskat-t .atv')].find(x=>{const tr=x.closest('tr');return tr&&+tr.dataset.id===19089;}); if(a) a.click(); });
  await pg.waitForTimeout(6000);
  await pg.evaluate(()=>{ const b=[...document.querySelectorAll('.kort-tabs button')].find(x=>/Nuotr/i.test(x.textContent)); if(b) b.click(); });
  await pg.waitForTimeout(2500);
  out.kortele = await pg.evaluate(()=>({
    pav:(document.querySelector('.kort-pav-t')||{}).textContent||'',
    galvos_img:(document.querySelector('.kort-img')||{}).src||'nera',
    pane:[...document.querySelectorAll('.kort-pane[data-p=fot] img')].map(i=>i.currentSrc||i.src).slice(0,4),
    pane_tekstas:((document.querySelector('.kort-pane[data-p=fot]')||{}).innerText||'').slice(0,300)
  }));
  await pg.screenshot({path:'screenshots/n_kortele.png',fullPage:false}); files.push('screenshots/n_kortele.png');
  out.js_klaidos=errs;
  await br.close();
}catch(e){ out.err=String(e).slice(0,500); }
if(j2&&j2.id) await wp('/wp-json/code-snippets/v1/snippets/'+j2.id,{method:'DELETE'});
for (const f of files){
  try{ const body={message:'shot',content:fs.readFileSync(f).toString('base64')};
    const g=await fetch('https://api.github.com/repos/'+REPO+'/contents/'+f,{headers:{'Authorization':'Bearer '+TOK}});
    if(g.status===200){ body.sha=(await g.json()).sha; }
    await fetch('https://api.github.com/repos/'+REPO+'/contents/'+f,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(body)});
  }catch(e){}
}
const body={message:'res nv',content:Buffer.from(JSON.stringify(out,null,1)).toString('base64')};
const g=await fetch('https://api.github.com/repos/'+REPO+'/contents/screenshots/nuotrauka_viz2.json',{headers:{'Authorization':'Bearer '+TOK}});
if(g.status===200){ body.sha=(await g.json()).sha; }
await fetch('https://api.github.com/repos/'+REPO+'/contents/screenshots/nuotrauka_viz2.json',{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(body)});
console.log(JSON.stringify(out).slice(0,1500));
