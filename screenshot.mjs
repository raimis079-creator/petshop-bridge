process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import { chromium } from 'playwright';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const out={};
async function api(path,opt={}){ const r=await fetch(WP+path,{...opt,headers:{Authorization:AUTH,'Content-Type':'application/json',...(opt.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(name,code){ const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name,code,scope:'global',active:true,priority:5})}); let id=null; try{ id=JSON.parse(cr.t).id; }catch(e){} return id; }
async function off(id){ if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }

/* 1) tikras perziuros tekstas: konservas + 3 dovanos */
const code = `add_action('wp_loaded', function(){
	if ((\$_GET['ps_t126'] ?? '') !== 'T126x') return;
	\$ref = new ReflectionMethod('Petshop_Laukai','trumpas_aprasas');
	\$ref->setAccessible(true);
	\$o=array();
	foreach (array(19570,16305,19098,17386) as \$pid) {
		\$p = wc_get_product(\$pid);
		\$t = \$ref->invoke(null, \$p);
		\$o[\$pid] = array('pav'=>\$p->get_name(),'ilgis'=>mb_strlen(\$t),'tekstas'=>mb_substr(\$t,0,1200),
			'desc_len'=>mb_strlen(wp_strip_all_tags(\$p->get_description())),
			'short_len'=>mb_strlen(wp_strip_all_tags(\$p->get_short_description())));
	}
	header('Content-Type: application/json'); echo wp_json_encode(\$o); exit;
}, 131);`;
const s1 = await snip('TEMP T126', code);
await new Promise(r=>setTimeout(r,4000));
try{ out.tekstai = JSON.parse(await (await fetch(WP+'/?ps_t126=T126x')).text()); }catch(e){ out.err1=String(e).slice(0,200); }
await off(s1);

/* 2) dovanu langas realiais paspaudimais — uzrakinta ir atrakinta busena */
const br = await chromium.launch({args:['--no-sandbox','--ignore-certificate-errors']});
const ctx = await br.newContext({httpCredentials:{username:process.env.WP_USER,password:process.env.WP_APP_PASS},ignoreHTTPSErrors:true,viewport:{width:1440,height:1100}});
const page = await ctx.newPage();
await page.goto(WP+'/product/test-konservu-deze-800-be-vistienos/',{waitUntil:'networkidle',timeout:60000});
await page.waitForTimeout(2500);
await page.evaluate(()=>{ var c=document.querySelector('.cmplz-cookiebanner'); if(c) c.remove(); });
/* UZRAKINTA: paspaudimas ant korteles kuno */
await page.locator('.pslk-dovk').nth(0).click();
await page.waitForTimeout(800);
out.uzrakinta_kortele = { langas: await page.locator('#pslk-pz.rodo').count(),
  apr: (await page.evaluate(()=>{var a=document.getElementById('pslk-pz-apr');return a?a.textContent.slice(0,150):'';})) };
await page.keyboard.press('Escape').catch(()=>{});
await page.evaluate(()=>{var x=document.querySelector('.pslk-pz-x'); if(x)x.click();});
await page.waitForTimeout(500);
/* UZRAKINTA: „Apie ›" */
await page.locator('.pslk-dovk').nth(1).locator('.pslk-dov-apie').click({force:false}).catch(async e=>{ out.apie_klaida=String(e).slice(0,200); });
await page.waitForTimeout(800);
out.uzrakinta_apie = { langas: await page.locator('#pslk-pz.rodo').count() };
await page.evaluate(()=>{var x=document.querySelector('.pslk-pz-x'); if(x)x.click();});
await page.waitForTimeout(400);
/* ATRAKINTA: „Apie ›" */
await page.evaluate(()=>document.getElementById('pslk-visi').click());
await page.waitForTimeout(500);
for(let i=0;i<6;i++){ await page.evaluate(()=>{var b=document.querySelector('.pslk-kort .pslk-stp button[data-d="1"]');if(b)b.click();}); await page.waitForTimeout(80); }
await page.waitForTimeout(700);
await page.locator('.pslk-dovk').nth(1).locator('.pslk-dov-apie').click().catch(async e=>{ out.apie_klaida2=String(e).slice(0,200); });
await page.waitForTimeout(800);
out.atrakinta_apie = { langas: await page.locator('#pslk-pz.rodo').count(),
  apr: (await page.evaluate(()=>{var a=document.getElementById('pslk-pz-apr');return a?a.textContent.slice(0,150):'';})) };
await br.close();

let sha=null;
try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/probe126.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
const body={message:'rez',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) body.sha=sha;
await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/probe126.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(body)});
console.log('ok');
