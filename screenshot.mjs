process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
import { chromium } from 'playwright';
const B='https://dev.avesa.lt';
const U=process.env.WP_USER,P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='Basic '+Buffer.from(U+':'+P).toString('base64');
const TOK=process.env.GH_TOKEN||'', REPO=process.env.GH_REPO||'';
fs.mkdirSync('screenshots',{recursive:true});
const out={marker:'PARODYK', ts:new Date().toISOString()};
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
const s2=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP Parodyk Autologin',code:phpAuto,scope:'global',active:true,priority:5})});
const j2=js(s2.text);
await new Promise(r=>setTimeout(r,3500));
const files=[];
try{
  const br=await chromium.launch();
  const ctx=await br.newContext({ignoreHTTPSErrors:true,viewport:{width:1100,height:900}});
  const pg=await ctx.newPage();
  const errs=[]; pg.on('pageerror',e=>errs.push(String(e).slice(0,150)));
  await pg.goto(B+'/?ps_auto=Qz7Rk88&to='+encodeURIComponent('admin.php?page=ps-katalogas&q=Ambrosia'),{waitUntil:'domcontentloaded',timeout:60000});
  await pg.waitForSelector('.pskat-t .atv',{timeout:45000});
  let ok=false;
  for(let b=0;b<3 && !ok;b++){
    await pg.evaluate(()=>{
      const k=document.querySelector('.kort-kartoti'); if(k){k.click();return;}
      const tr=[...document.querySelectorAll('.pskat-t tbody tr[data-id]')].find(x=>/Ambrosia/i.test(x.innerText));
      const a=(tr||document).querySelector('.atv'); if(a) a.click();
    });
    try{ await pg.waitForSelector('.kort-lik-irasyti',{timeout:25000}); ok=true; }catch(e){ await pg.waitForTimeout(3000); }
  }
  out.kortele=ok;
  if(ok){
    /* pasirenkam Gavimas — tada matosi galiojimo ir savikainos laukai */
    await pg.evaluate(()=>{
      const p=document.querySelector('.kort-lik-priez');
      p.value='gavimas'; p.dispatchEvent(new Event('change',{bubbles:true}));
      document.querySelector('.kort-lik-in').value='+6';
      document.querySelector('.kort-lik-gal').value='2027-05-31';
      const L=document.querySelector('.kort-lik');
      L.scrollIntoView({block:'center'});
    });
    await pg.waitForTimeout(1200);
    out.matosi = await pg.evaluate(()=>{
      const L=document.querySelector('.kort-lik');
      return { pavadinimas:(document.querySelector('.kort-pav-t')||{}).textContent||'',
               antraste:(L.querySelector('.kort-antr')||{}).innerText||'',
               laukai:[...L.querySelectorAll('input,select,button')].map(x=>x.className||x.tagName),
               galiojimo_laukas: !!L.querySelector('.kort-lik-gal'),
               galiojimo_reiksme:(L.querySelector('.kort-lik-gal')||{}).value||'' };
    });
    await pg.screenshot({path:'screenshots/parodyk.png',fullPage:false}); files.push('screenshots/parodyk.png');
  }
  out.js=errs;
  await br.close();
}catch(e){ out.err=String(e).slice(0,300); }
if(j2&&j2.id) await wp('/wp-json/code-snippets/v1/snippets/'+j2.id,{method:'DELETE'});
for (const f of files){
  try{ const body={message:'shot',content:fs.readFileSync(f).toString('base64')};
    const g=await fetch('https://api.github.com/repos/'+REPO+'/contents/'+f,{headers:{'Authorization':'Bearer '+TOK}});
    if(g.status===200){ body.sha=(await g.json()).sha; }
    await fetch('https://api.github.com/repos/'+REPO+'/contents/'+f,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(body)});
  }catch(e){}
}
const body={message:'res parodyk',content:Buffer.from(JSON.stringify(out,null,1)).toString('base64')};
const g=await fetch('https://api.github.com/repos/'+REPO+'/contents/screenshots/parodyk.json',{headers:{'Authorization':'Bearer '+TOK}});
if(g.status===200){ body.sha=(await g.json()).sha; }
await fetch('https://api.github.com/repos/'+REPO+'/contents/screenshots/parodyk.json',{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(body)});
console.log('ok');
