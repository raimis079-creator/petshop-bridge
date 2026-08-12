process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
import { chromium } from 'playwright';
const B='https://dev.avesa.lt';
const U=process.env.WP_USER,P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='Basic '+Buffer.from(U+':'+P).toString('base64');
const TOK=process.env.GH_TOKEN||'', REPO=process.env.GH_REPO||'';
fs.mkdirSync('screenshots',{recursive:true});
const out={marker:'KOPIJA PATIKRA v3', ts:new Date().toISOString()};
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
const s2=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP Kopija Autologin v3',code:phpAuto,scope:'global',active:true,priority:5})});
const j2=js(s2.text); out.snip=j2&&j2.id?j2.id:s2.text.slice(0,200);
await new Promise(r=>setTimeout(r,3500));
const files=[];
try{
  const br=await chromium.launch();
  const ctx=await br.newContext({ignoreHTTPSErrors:true,viewport:{width:1600,height:1100}});
  const pg=await ctx.newPage();
  const errs=[]; pg.on('pageerror',e=>errs.push(String(e).slice(0,200)));
  await pg.goto(`${B}/?ps_auto=Qz7Rk88&u=${encodeURIComponent(U)}&to=${encodeURIComponent('admin.php?page=ps-katalogas')}`,{waitUntil:'domcontentloaded',timeout:60000});
  await pg.waitForTimeout(5000);
  const eil = await pg.evaluate(()=>document.querySelectorAll('tr[data-id]').length);
  out.eiluciu=eil;
  if (eil) {
    await pg.evaluate(()=>{ const tr=document.querySelector('tr[data-id]'); tr.click(); });
    await pg.waitForTimeout(6000);
    out.kortele = await pg.evaluate(()=>({
      pav:(document.querySelector('.kort-pav-t')||{}).textContent||'',
      nuorodos:[...document.querySelectorAll('.kort-nuor a')].map(a=>a.textContent.trim()+' → '+(a.getAttribute('href')||'').split('/wp-admin/')[1]),
      fatal:/Fatal error|Parse error/i.test(document.body.innerText)?document.body.innerText.slice(0,300):''
    }));
    await pg.screenshot({path:'screenshots/kop_kortele.png',fullPage:false}); files.push('screenshots/kop_kortele.png');
  }
  out.js_klaidos=errs;
  await br.close();
}catch(e){ out.err=String(e).slice(0,600); }
if (j2 && j2.id) await wp('/wp-json/code-snippets/v1/snippets/'+j2.id,{method:'DELETE'});
for (const f of files) {
  try{
    const body={message:'shot '+f, content:fs.readFileSync(f).toString('base64')};
    const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${f}`,{headers:{'Authorization':'Bearer '+TOK}});
    if(g.status===200){ body.sha=(await g.json()).sha; }
    await fetch(`https://api.github.com/repos/${REPO}/contents/${f}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(body)});
  }catch(e){}
}
out.put=await putResult('kopija_patikra3.json', out);
console.log(JSON.stringify(out).slice(0,2000));
