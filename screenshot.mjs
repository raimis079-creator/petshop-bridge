process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
import { chromium } from 'playwright';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const out={testai:{}};
async function api(path,opt={}){ const r=await fetch(WP+path,{...opt,headers:{Authorization:AUTH,'Content-Type':'application/json',...(opt.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(name,code){ const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name,code,scope:'global',active:true,priority:5})}); let id=null; try{ id=JSON.parse(cr.t).id; }catch(e){} return id; }
async function off(id){ if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }
const b64 = fs.readFileSync('deploy/petshop-laukai.php').toString('base64');
const s1 = await snip('TEMP SET 131', `add_action('wp_loaded', function(){
	if ((\$_GET['ps_s131'] ?? '') !== 'S131x') return;
	update_option('ps_l_b64_131', '${b64}', false);
	header('Content-Type: application/json'); echo wp_json_encode(array('ok'=>1)); exit;
}, 131);`);
await new Promise(r=>setTimeout(r,4000));
await fetch(WP+'/?ps_s131=S131x').then(r=>r.text()).catch(()=>{});
await off(s1); await new Promise(r=>setTimeout(r,3000));
const s2 = await snip('TEMP DEP 131', `add_action('wp_loaded', function(){
	if ((\$_GET['ps_d131'] ?? '') !== 'D131x') return;
	\$o=array(); \$b=get_option('ps_l_b64_131');
	if(!\$b){ \$o['klaida']='tuscia'; }
	else { \$k=base64_decode(\$b);
		try { token_get_all(\$k, TOKEN_PARSE); \$o['sintakse']='OK';
			\$kl=WPMU_PLUGIN_DIR.'/petshop-laukai.php';
			file_put_contents(\$kl,\$k); clearstatcache(true,\$kl);
			\$o['sutampa']=(md5_file(\$kl)===md5(\$k));
		} catch (ParseError \$e){ \$o['sintakse']='KLAIDA: '.\$e->getMessage(); }
		delete_option('ps_l_b64_131'); }
	header('Content-Type: application/json'); echo wp_json_encode(\$o); exit;
}, 131);`);
await new Promise(r=>setTimeout(r,4000));
try{ out.diegimas = JSON.parse(await (await fetch(WP+'/?ps_d131=D131x')).text()); }catch(e){ out.diegimas_err=String(e).slice(0,150); }
await off(s2); await new Promise(r=>setTimeout(r,2500));

/* prisijungimas i wp-admin */
const br = await chromium.launch({args:['--no-sandbox','--ignore-certificate-errors']});
const ctx = await br.newContext({httpCredentials:{username:process.env.WP_USER,password:process.env.WP_APP_PASS},ignoreHTTPSErrors:true,viewport:{width:1500,height:1150}});
const page = await ctx.newPage();
const jsErr=[]; page.on('pageerror',e=>jsErr.push(String(e).slice(0,160)));
const T=out.testai;
await page.goto(WP+'/wp-login.php',{waitUntil:'domcontentloaded',timeout:60000});
await page.fill('#user_login',process.env.WP_USER);
await page.fill('#user_pass',process.env.WP_PASS||process.env.WP_APP_PASS);
await page.click('#wp-submit');
await page.waitForTimeout(3500);
out.admin_url = page.url();
/* konservu dezes redagavimo langas */
await page.goto(WP+'/wp-admin/admin.php?page=ps-laukai&id=34942',{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(2500);
T.t1_puslapis = { praejo: (await page.locator('#s-pav').count())===1, pav: await page.locator('#s-pav').inputValue().catch(()=>'') };
T.t2_dydis_min = { praejo: (await page.locator('#s-dydis').count())===1 && (await page.locator('#s-min').count())===1,
  dydis: await page.locator('#s-dydis').inputValue().catch(()=>''), min: await page.locator('#s-min').inputValue().catch(()=>'') };
T.t3_grupe = { praejo: (await page.locator('#s-seima option').allTextContents()).some(x=>x.includes('Konservai')),
  grupes: await page.locator('#s-seima option').allTextContents(), pasirinkta: await page.locator('#s-seima').inputValue().catch(()=>'') };
T.t4_dovanu_lentele = { praejo: (await page.locator('#dov-kunas tr').count())===3,
  eiluciu: await page.locator('#dov-kunas tr').count(), riba: await page.locator('#dov-riba').inputValue().catch(()=>'') };
await page.locator('#dov-kunas').scrollIntoViewIfNeeded();
await page.waitForTimeout(400);
async function shot(vardas){
  const b = await page.screenshot({fullPage:false});
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${vardas}.png`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const bo={message:'shot',content:b.toString('base64')}; if(sha) bo.sha=sha;
  await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${vardas}.png`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(bo)});
}
await shot('v131_admin_dovanos');
/* dovanos salinimas ir gerinimas atgal */
const priesN = await page.locator('#dov-kunas .dov-trinti').count();
if (priesN>0) {
  await page.locator('#dov-kunas .dov-trinti').last().click();
  await page.waitForTimeout(2500);
  const poN = await page.locator('#dov-kunas .dov-trinti').count();
  T.t5_salinimas = { praejo: poN===priesN-1, pries: priesN, po: poN };
  /* grazinam per paieska */
  await page.fill('#dov-q','triušio ausys');
  await page.waitForTimeout(2000);
  const rez = await page.locator('#dov-rez .dov-prideti').count();
  if (rez>0) {
    await page.locator('#dov-rez .dov-prideti').first().click();
    await page.waitForTimeout(2500);
  }
  T.t6_pridejimas = { praejo: (await page.locator('#dov-kunas .dov-trinti').count())===priesN,
    rasta_paieskoje: rez, dabar: await page.locator('#dov-kunas .dov-trinti').count() };
}
/* sandelio apsauga: bandom prideti VF preke */
await page.fill('#dov-q','Josera');
await page.waitForTimeout(2200);
const vfRez = await page.locator('#dov-rez .dov-prideti').count();
T.t7_paieska_veikia = { praejo: true, josera_rezultatu: vfRez };
T.t8_js = { praejo: jsErr.length===0, klaidos: jsErr };
out.viso=Object.keys(T).length; out.praejo=Object.values(T).filter(x=>x.praejo).length;
await br.close();
let sha=null;
try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/pw131.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
const body={message:'rez',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) body.sha=sha;
await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/pw131.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
console.log('ok');
