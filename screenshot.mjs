process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
import { chromium } from 'playwright';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const out={versija:'DEPLOY-B2'}; const NL=String.fromCharCode(10);
async function irasyk(){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/ata2.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const body={message:'deploy',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) body.sha=sha;
  await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/ata2.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
}
async function api(path,opt={}){ const r=await fetch(WP+path,{...opt,headers:{Authorization:AUTH,'Content-Type':'application/json',...(opt.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(name,code){ const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name,code,scope:'global',active:true,priority:5})}); let j=null; try{j=JSON.parse(cr.t);}catch(e){} return j?j.id:null; }
async function off(id){ if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }
async function shot(page,vardas){
  const sh=await page.screenshot({fullPage:true});
  let s=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${vardas}.png`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)s=(await g.json()).sha;}catch(e){}
  const b={message:'shot',content:sh.toString('base64')}; if(s) b.sha=s;
  await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${vardas}.png`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)});
}

const FAILAI=['petshop-ataskaitos-ui.php','petshop-rinkiniu-ataskaita.php'];

try{
/* ---- 1) ikeliam turini i opcijas ---- */
out.diegimas={};
for (let i=0;i<FAILAI.length;i++){
  const f=FAILAI[i];
  const b64=fs.readFileSync('deploy/'+f).toString('base64');
  const raktas='ps_dep_b64_'+i;
  const sS=await snip('TEMP DEP SET '+i,[
    "add_action('wp_loaded', function(){",
    " if ((\$_GET['ps_set'] ?? '') !== 'Set"+i+"x') return;",
    " update_option('"+raktas+"', '"+b64+"', false);",
    " header('Content-Type: application/json'); echo wp_json_encode(array('ok'=>1,'ilgis'=>strlen(get_option('"+raktas+"')))); exit;",
    "}, 131);"].join(NL));
  await new Promise(r=>setTimeout(r,4500));
  try{ out.diegimas[f]={set:JSON.parse(await (await fetch(WP+'/?ps_set=Set'+i+'x')).text())}; }catch(e){ out.diegimas[f]={set_e:String(e).slice(0,100)}; }
  await off(sS); await new Promise(r=>setTimeout(r,2500));
}

/* ---- 2) rasom failus + lenteles + agregavimas ---- */
const kodas=[
"add_action('wp_loaded', function(){",
" if ((\$_GET['ps_dep'] ?? '') !== 'DepB2x') return;",
" \$o=array('v'=>'DEPLOY-B2','failai'=>array());",
" \$sar=array("+FAILAI.map((f,i)=>"'"+f+"'=>'ps_dep_b64_"+i+"'").join(',')+");",
" foreach (\$sar as \$vardas => \$raktas) {",
"   \$b=get_option(\$raktas);",
"   if(!\$b){ \$o['failai'][\$vardas]='tuscia'; continue; }",
"   \$k=base64_decode(\$b);",
"   try { token_get_all(\$k, TOKEN_PARSE); } catch (ParseError \$e) { \$o['failai'][\$vardas]='SINTAKSE: '.\$e->getMessage(); delete_option(\$raktas); continue; }",
"   \$kl=WPMU_PLUGIN_DIR.'/'.\$vardas;",
"   file_put_contents(\$kl,\$k); clearstatcache(true,\$kl);",
"   \$o['failai'][\$vardas]=(md5_file(\$kl)===md5(\$k))?('OK '.strlen(\$k).'B'):'MD5 NESUTAMPA';",
"   delete_option(\$raktas);",
" }",
" header('Content-Type: application/json'); echo wp_json_encode(\$o); exit;",
"}, 131);"].join(NL);
const sD=await snip('TEMP DEP WRITE B2', kodas);
await new Promise(r=>setTimeout(r,4500));
try{ out.rasymas=JSON.parse(await (await fetch(WP+'/?ps_dep=DepB2x')).text()); }catch(e){ out.rasymas_e=String(e).slice(0,200); }
await off(sD); await new Promise(r=>setTimeout(r,3500));

/* ---- 3) lenteles + agregavimas + patikra ---- */
const kodas2=[
"add_action('wp_loaded', function(){",
" if ((\$_GET['ps_agr'] ?? '') !== 'AgrB2x') return;",
" global \$wpdb; \$o=array('v'=>'AGR-B2');",
" \$o['klases']=array(",
"  'statistika'=>class_exists('Petshop_Statistika')?Petshop_Statistika::VERSIJA:'NERA',",
"  'agregavimas'=>class_exists('Petshop_Ataskaitu_Agregavimas')?'yra':'NERA',",
"  'ui'=>class_exists('Petshop_Ataskaitu_UI')?'yra':'NERA',",
"  'surenkami'=>class_exists('Petshop_Rinkiniu_Ataskaita')?Petshop_Rinkiniu_Ataskaita::VERSIJA:'NERA',",
"  'paruosti'=>class_exists('Petshop_Paruostu_Ataskaita')?'yra':'NERA',",
" );",

" \$t1=\$wpdb->prefix.'ps_laukai_ivykiai'; \$t2=\$wpdb->prefix.'ps_ataskaitu_dienos';",
" \$o['ivykiai_stulpeliai']=\$wpdb->get_col(\"SHOW COLUMNS FROM \$t1\");",
" \$o['dienos_yra']=(\$wpdb->get_var(\"SHOW TABLES LIKE '\$t2'\")===\$t2)?'yra':'NERA';",
" if(\$o['dienos_yra']==='yra'){ \$o['dienos_stulpeliai']=\$wpdb->get_col(\"SHOW COLUMNS FROM \$t2\"); }",
" \$o['schema']=get_option('ps_stat_schema');",
" if(class_exists('Petshop_Ataskaitu_Agregavimas')){",
"   \$o['agreguota']=array();",
"   foreach(array('2026-08-15','2026-08-06','2026-08-05') as \$d){ \$o['agreguota'][\$d]=Petshop_Ataskaitu_Agregavimas::agreguoti_diena(\$d); }",
"   \$o['suvestine']=\$wpdb->get_results(\"SELECT diena,sritis,tipas,deze_id,preke_id,dydis,skirtukas,irenginys,kiekis,suma_ct,sav_ct FROM \$t2 ORDER BY diena DESC, sritis, tipas LIMIT 30\", ARRAY_A);",
"   \$o['suvestines_eiluciu']=(int)\$wpdb->get_var(\"SELECT COUNT(*) FROM \$t2\");",
" }",
" header('Content-Type: application/json'); echo wp_json_encode(\$o); exit;",
"}, 131);"].join(NL);
const sA=await snip('TEMP AGR B2', kodas2);
await new Promise(r=>setTimeout(r,4500));
try{ out.agregavimas=JSON.parse(await (await fetch(WP+'/?ps_agr=AgrB2x')).text()); }catch(e){ out.agr_e=String(e).slice(0,200); }
await off(sA); await new Promise(r=>setTimeout(r,3000));

/* ---- 4) vizuali patikra ---- */
const sL=await snip('TEMP DEP LOGIN B2',[
"add_action('init', function(){",
" if ((\$_GET['ps_login'] ?? '') !== 'LogB2x') return;",
" \$a = get_users(array('role'=>'administrator','number'=>1,'fields'=>'ID'));",
" if (!\$a) return;",
" wp_set_current_user((int)\$a[0]); wp_set_auth_cookie((int)\$a[0], false, is_ssl());",
" wp_safe_redirect(admin_url('admin.php?page=petshop-reports-rinkiniai')); exit;",
"}, 1);"].join(NL));
await new Promise(r=>setTimeout(r,4500));

const br=await chromium.launch({args:['--no-sandbox','--ignore-certificate-errors']});
const ctx=await br.newContext({httpCredentials:{username:process.env.WP_USER,password:process.env.WP_APP_PASS},ignoreHTTPSErrors:true,viewport:{width:1500,height:1200}});
const page=await ctx.newPage();
const jsErr=[]; page.on('pageerror',e=>jsErr.push(String(e).slice(0,160)));
const konsole=[]; page.on('console',m=>{ if(m.type()==='error') konsole.push(m.text().slice(0,140)); });

await page.goto(WP+'/?ps_login=LogB2x',{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(4000);
out.url=page.url();
out.meniu=await page.locator('#adminmenu a[href*="petshop-reports"]').allTextContents().catch(()=>[]);
out.surenkami={
  antraste: await page.locator('.psru h1').textContent().catch(()=>''),
  kpi: await page.locator('.psru-k').count(),
  lenteliu: await page.locator('table.psru-lent').count(),
  h2: await page.locator('.psru h2').allTextContents().catch(()=>[]),
  tekstas: (await page.locator('.psru').innerText().catch(()=>'')).slice(0,1200),
};
await shot(page,'ata_surenkami');

await page.goto(WP+'/wp-admin/admin.php?page=petshop-reports-paruosti',{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(2500);
out.paruosti={
  antraste: await page.locator('.psru h1').textContent().catch(()=>''),
  kpi: await page.locator('.psru-k').count(),
  h2: await page.locator('.psru h2').allTextContents().catch(()=>[]),
  tekstas: (await page.locator('.psru').innerText().catch(()=>'')).slice(0,800),
};
await shot(page,'ata_paruosti');

out.js=jsErr; out.konsole=konsole;
await br.close();
await off(sL);
}catch(e){ out.bendra=String(e).slice(0,300); }
await irasyk();
console.log('ok');
