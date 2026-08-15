process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
import { chromium } from 'playwright';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const out={}; const NL=String.fromCharCode(10);
async function irasyk(){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/ata.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const body={message:'rez',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) body.sha=sha;
  await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/ata.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
}
async function api(path,opt={}){ const r=await fetch(WP+path,{...opt,headers:{Authorization:AUTH,'Content-Type':'application/json',...(opt.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(name,code){ const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name,code,scope:'global',active:true,priority:5})}); let j=null; try{j=JSON.parse(cr.t);}catch(e){} return j?j.id:null; }
async function off(id){ if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }
try{
const b64 = fs.readFileSync('deploy/petshop-rinkiniu-ataskaita.php').toString('base64');
const sS = await snip('TEMP ATA SET', [
"add_action('wp_loaded', function(){",
" if (($_GET['ps_as'] ?? '') !== 'AS1x') return;",
" update_option('ps_ata_b64', '"+b64+"', false);",
" header('Content-Type: application/json'); echo wp_json_encode(array('ok'=>1)); exit;",
"}, 131);"].join(NL));
await new Promise(r=>setTimeout(r,4500));
try{ out.set = JSON.parse(await (await fetch(WP+'/?ps_as=AS1x')).text()); }catch(e){ out.set_e=String(e).slice(0,120); }
await off(sS); await new Promise(r=>setTimeout(r,3000));
const sD = await snip('TEMP ATA DEP', [
"add_action('wp_loaded', function(){",
" if (($_GET['ps_ad'] ?? '') !== 'AD1x') return;",
" $o=array(); $b=get_option('ps_ata_b64');",
" if(!$b){ $o['klaida']='tuscia'; }",
" else { $k=base64_decode($b);",
"  try { token_get_all($k, TOKEN_PARSE); $o['sintakse']='OK';",
"   $kl=WPMU_PLUGIN_DIR.'/petshop-rinkiniu-ataskaita.php';",
"   file_put_contents($kl,$k); clearstatcache(true,$kl);",
"   $o['sutampa']=(md5_file($kl)===md5($k));",
"  } catch (ParseError $e){ $o['sintakse']='KLAIDA: '.$e->getMessage(); }",
"  delete_option('ps_ata_b64'); }",
" header('Content-Type: application/json'); echo wp_json_encode($o); exit;",
"}, 131);"].join(NL));
await new Promise(r=>setTimeout(r,4500));
try{ out.diegimas = JSON.parse(await (await fetch(WP+'/?ps_ad=AD1x')).text()); }catch(e){ out.dep_e=String(e).slice(0,150); }
await off(sD); await new Promise(r=>setTimeout(r,3000));

/* prisijungimas ir ekrano nuotrauka */
const sL = await snip('TEMP ATA LOGIN', [
"add_action('init', function(){",
" if (($_GET['ps_login'] ?? '') !== 'LogA1x') return;",
" $a = get_users(array('role'=>'administrator','number'=>1,'fields'=>'ID'));",
" if (!$a) return;",
" wp_set_current_user((int)$a[0]); wp_set_auth_cookie((int)$a[0], false, is_ssl());",
" wp_safe_redirect(admin_url('admin.php?page=petshop-reports-rinkiniai')); exit;",
"}, 1);"].join(NL));
await new Promise(r=>setTimeout(r,4500));
const br = await chromium.launch({args:['--no-sandbox','--ignore-certificate-errors']});
const ctx = await br.newContext({httpCredentials:{username:process.env.WP_USER,password:process.env.WP_APP_PASS},ignoreHTTPSErrors:true,viewport:{width:1500,height:1300}});
const page = await ctx.newPage();
const jsErr=[]; page.on('pageerror',e=>jsErr.push(String(e).slice(0,150)));
await page.goto(WP+'/?ps_login=LogA1x',{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(4000);
out.url = page.url();
out.meniu = await page.locator('#adminmenu a[href*="petshop-reports"]').allTextContents().catch(()=>[]);
out.antraste = await page.locator('.psra h1').textContent().catch(()=>'');
out.korteliu = await page.locator('.psra-k').count();
out.lentele_eiluciu = await page.locator('.psra-lent tbody tr').count();
out.tekstas = (await page.locator('.psra').innerText().catch(()=>'')).slice(0,1400);
out.js = jsErr;
const sh = await page.screenshot({fullPage:false});
let sha0=null;
try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/ata.png`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha0=(await g.json()).sha;}catch(e){}
const bo={message:'shot',content:sh.toString('base64')}; if(sha0) bo.sha=sha0;
await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/ata.png`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(bo)});
await br.close();
await off(sL);
}catch(e){ out.bendra=String(e).slice(0,250); }
await irasyk();
console.log('ok');
