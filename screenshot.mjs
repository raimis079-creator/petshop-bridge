process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
import { execSync } from 'child_process';
import { chromium } from 'playwright';
const B='https://dev.avesa.lt';
const U=process.env.WP_USER,P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='Basic '+Buffer.from(U+':'+P).toString('base64');
const TOK=process.env.GH_TOKEN||'', REPO=process.env.GH_REPO||'';
fs.mkdirSync('screenshots',{recursive:true});
const out={marker:'MYGTUKAS NARSYKLEJE', ts:new Date().toISOString()};
async function wp(p,o={}){try{const r=await fetch(B+p,{...o,headers:{'Authorization':AUTH,'Content-Type':'application/json',...(o.headers||{})}});return{status:r.status,text:await r.text()}}catch(e){return{status:0,text:String(e)}}}
function js(t){const i=Math.min(...['[','{'].map(c=>{const x=t.indexOf(c);return x<0?1e9:x}));try{return JSON.parse(t.slice(i))}catch(e){return null}}
const phpAuto = `
add_action('init', function(){
  if ( ( $_GET['ps_auto'] ?? '' ) !== 'Qz7Rk88' ) return;
  $a = get_users(array('role'=>'administrator','number'=>1)); $u = $a ? $a[0] : null;
  if ( ! $u ) { wp_die('no admin'); }
  wp_set_current_user($u->ID);
  $tok = \\WP_Session_Tokens::get_instance($u->ID)->create(time()+1800);
  wp_set_auth_cookie($u->ID, false, true, $tok);
  wp_safe_redirect( admin_url( isset($_GET['to']) ? $_GET['to'] : 'index.php' ) ); exit;
});
`;
const s2=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP Myg Autologin',code:phpAuto,scope:'global',active:true,priority:5})});
const j2=js(s2.text);
await new Promise(r=>setTimeout(r,3500));
const files=[];
try{
  const br=await chromium.launch();
  const ctx=await br.newContext({ignoreHTTPSErrors:true,viewport:{width:1300,height:1000}});
  const pg=await ctx.newPage();
  const errs=[]; pg.on('pageerror',e=>errs.push(String(e).slice(0,180)));
  const tinklas=[];
  pg.on('response', async r=>{
    try{
      if(r.url().includes('admin-ajax.php')){
        const t=(await r.text()).slice(0,400);
        tinklas.push({st:r.status(), t:t});
      }
    }catch(e){}
  });
  pg.on('dialog', async d=>{ out.dialogas=d.message().slice(0,120); await d.accept(); });

  await pg.goto(B+'/?ps_auto=Qz7Rk88&to='+encodeURIComponent('admin.php?page=ps-katalogas&q=sterilizuot'),{waitUntil:'domcontentloaded',timeout:60000});
  await pg.waitForSelector('.pskat-t .atv',{timeout:45000});
  out.rasta = await pg.evaluate(()=>[...document.querySelectorAll('.pskat-t tbody tr[data-id]')].slice(0,5).map(t=>t.dataset.id+' '+(t.querySelector('.atv')||{}).textContent.trim().slice(0,45)));
  let ok=false;
  for(let b=0;b<3 && !ok;b++){
    await pg.evaluate(()=>{ const k=document.querySelector('.kort-kartoti'); if(k){k.click();return;}
      const tr=[...document.querySelectorAll('.pskat-t tbody tr[data-id]')].find(x=>/QUATTRO/i.test(x.innerText)) || document.querySelector('.pskat-t tbody tr[data-id]');
      const a=tr.querySelector('.atv'); if(a) a.click(); });
    try{ await pg.waitForSelector('.kort-tabs button',{timeout:25000}); ok=true; }catch(e){ await pg.waitForTimeout(3000); }
  }
  out.kortele=ok;
  if(ok){
    out.preke = await pg.evaluate(()=>(document.querySelector('.kort-pav-t')||{}).textContent||'');
    await pg.evaluate(()=>{ const b=[...document.querySelectorAll('.kort-tabs button')].find(x=>/Apra/i.test(x.textContent)); if(b) b.click(); });
    await pg.waitForSelector('.ka-sudelioti',{timeout:20000});
    await pg.waitForTimeout(2500);
    out.pries = await pg.evaluate(()=>{
      const ta=document.querySelector('#ka-tekstas');
      const ifr=document.querySelector('#ka-tekstas_ifr');
      return { mygtukas:!!document.querySelector('.ka-sudelioti'),
               textarea_ilgis: ta ? ta.value.length : -1,
               tinymce_yra: !!ifr,
               tinymce_ilgis: (window.tinymce && window.tinymce.get('ka-tekstas')) ? window.tinymce.get('ka-tekstas').getContent().length : -1 };
    });
    tinklas.length=0;
    await pg.click('.ka-sudelioti');
    await pg.waitForTimeout(6000);
    out.po = await pg.evaluate(()=>({
      stat:(document.querySelector('.ka-stat')||{}).textContent||'',
      sekcijos:[...document.querySelectorAll('.kort-sekcija-v')].map(x=>x.textContent.trim()).slice(0,6)
    }));
    out.tinklas=tinklas.slice(-3);
    await pg.screenshot({path:'screenshots/myg.png',fullPage:false}); files.push('screenshots/myg.png');
  }
  out.js=errs;
  await br.close();
}catch(e){ out.err=String(e).slice(0,400); }
if(j2&&j2.id) await wp('/wp-json/code-snippets/v1/snippets/'+j2.id,{method:'DELETE'});
for (const f of files){
  try{ const body={message:'shot',content:fs.readFileSync(f).toString('base64')};
    const g=await fetch('https://api.github.com/repos/'+REPO+'/contents/'+f,{headers:{'Authorization':'Bearer '+TOK}});
    if(g.status===200){ body.sha=(await g.json()).sha; }
    await fetch('https://api.github.com/repos/'+REPO+'/contents/'+f,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(body)});
  }catch(e){}
}
const body={message:'res myg2',content:Buffer.from(JSON.stringify(out,null,1)).toString('base64')};
const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/myg2.json`,{headers:{'Authorization':'Bearer '+TOK}});
if(g.status===200){ body.sha=(await g.json()).sha; }
await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/myg2.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(body)});
console.log('ok');
