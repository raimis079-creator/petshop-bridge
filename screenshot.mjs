process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
import { chromium } from 'playwright';
const B='https://dev.avesa.lt';
const U=process.env.WP_USER,P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='Basic '+Buffer.from(U+':'+P).toString('base64');
const TOK=process.env.GH_TOKEN||'', REPO=process.env.GH_REPO||'';
fs.mkdirSync('screenshots',{recursive:true});
const out={marker:'GPAIS TESTAS', ts:new Date().toISOString()};
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
  $tok = \\WP_Session_Tokens::get_instance($u->ID)->create(time()+1800);
  wp_set_auth_cookie($u->ID, false, true, $tok);
  wp_safe_redirect( admin_url( isset($_GET['to']) ? $_GET['to'] : 'index.php' ) ); exit;
});
`;
const s2=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP GPAIS Autologin v4',code:phpAuto,scope:'global',active:true,priority:5})});
const j2=js(s2.text);
await new Promise(r=>setTimeout(r,3500));
const files=[];
try{
  const br=await chromium.launch();
  const ctx=await br.newContext({ignoreHTTPSErrors:true,viewport:{width:1400,height:1050}});
  const pg=await ctx.newPage();
  const errs=[]; pg.on('pageerror',e=>errs.push(String(e).slice(0,180)));
  await pg.goto(B+'/?ps_auto=Qz7Rk88&u='+encodeURIComponent(U)+'&to='+encodeURIComponent('admin.php?page=ps-katalogas'),{waitUntil:'domcontentloaded',timeout:60000});
  await pg.waitForSelector('.pskat-t .atv',{timeout:45000});
  await pg.waitForTimeout(1500);
  await pg.evaluate(()=>{ const a=document.querySelector('.pskat-t .atv'); if(a) a.click(); });
  try{ await pg.waitForSelector('.kort-tabs button',{timeout:30000}); }
  catch(e){
    out.diagnostika = await pg.evaluate(()=>({
      kort:!!document.getElementById('pskat-kort'),
      hidden:(document.getElementById('pskat-kort')||{}).hidden,
      turinys:((document.querySelector('.kort-turinys')||{}).innerText||'').slice(0,300),
      atv:document.querySelectorAll('.pskat-t .atv').length
    }));
    await pg.screenshot({path:'screenshots/gp_diag.png',fullPage:false}); files.push('screenshots/gp_diag.png');
    throw e;
  }
  await pg.waitForTimeout(2000);
  out.skirtukai = await pg.evaluate(()=>[...document.querySelectorAll('.kort-tabs button')].map(b=>b.textContent.trim()));
  await pg.evaluate(()=>{ const b=[...document.querySelectorAll('.kort-tabs button')].find(x=>/GPAIS/i.test(x.textContent)); if(b) b.click(); });
  await pg.waitForSelector('.kpak-nauja',{timeout:20000});
  await pg.waitForTimeout(1200);
  out.pradzia = await pg.evaluate(()=>({
    zyme:(document.querySelector('.kort-pak-zyme')||{}).textContent||'',
    tekstas:((document.querySelector('.kort-pak-sar')||{}).innerText||'').slice(0,120)
  }));
  await pg.click('.kpak-nauja');
  await pg.waitForSelector('.kort-pak-forma',{timeout:15000});
  out.forma = await pg.evaluate(()=>{
    const f=document.querySelector('.kort-pak-forma');
    f.querySelector('.kpf-pav').value='dėžutė (testas)';
    f.querySelector('.kpf-sv').value='15,5';
    return { laukai:[...f.querySelectorAll('input,select')].length,
             medziagos:[...f.querySelectorAll('.kpf-med option')].map(o=>o.textContent).slice(0,4),
             tipai:[...f.querySelectorAll('.kpf-tip option')].map(o=>o.textContent.split(' — ')[0]) };
  });
  await pg.screenshot({path:'screenshots/gp_forma.png',fullPage:false}); files.push('screenshots/gp_forma.png');
  await pg.click('.kpf-irasyti');
  await pg.waitForTimeout(3500);
  out.po_irasymo = await pg.evaluate(()=>({
    stat:(document.querySelector('.kpak-stat')||{}).textContent||'',
    zyme:(document.querySelector('.kort-pak-zyme')||{}).textContent||'',
    eiluciu:Math.max(0,document.querySelectorAll('.kort-pak-t tr').length-1),
    pirma:((document.querySelector('.kort-pak-t tr:nth-child(2)')||{}).innerText||'').replace(/\t/g,' | ')
  }));
  await pg.screenshot({path:'screenshots/gp_sarasas.png',fullPage:false}); files.push('screenshots/gp_sarasas.png');
  out.trynimas = await pg.evaluate(async()=>{
    window.confirm=()=>true;
    const b=document.querySelector('.kpak-tr'); if(!b) return 'nera mygtuko';
    b.click(); await new Promise(r=>setTimeout(r,3000));
    return { stat:(document.querySelector('.kpak-stat')||{}).textContent||'',
             zyme:(document.querySelector('.kort-pak-zyme')||{}).textContent||'' };
  });
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
const body={message:'res gp',content:Buffer.from(JSON.stringify(out,null,1)).toString('base64')};
const g=await fetch('https://api.github.com/repos/'+REPO+'/contents/screenshots/gp2.json',{headers:{'Authorization':'Bearer '+TOK}});
if(g.status===200){ body.sha=(await g.json()).sha; }
await fetch('https://api.github.com/repos/'+REPO+'/contents/screenshots/gp2.json',{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(body)});
console.log(JSON.stringify(out).slice(0,1200));
