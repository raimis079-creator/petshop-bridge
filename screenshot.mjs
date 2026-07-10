import { chromium } from 'playwright';
import { execSync as __ex } from "child_process";
import __fs from "fs";
function putFile(n,s){
  const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
  for(let a=0;a<4;a++){ try{
    const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+n;
    let sha=''; try{ sha=JSON.parse(__ex('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){}
    const b={message:'ci',branch:'main',content:Buffer.from(s,'utf8').toString('base64')}; if(sha) b.sha=sha;
    __fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));
    const r=__ex('curl -s -w "\nHTTP:%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});
    if(/HTTP:20[01]/.test(r)) return true;
  }catch(e){} __ex('sleep 2'); }
  return false;
}
let out=''; const L=(s)=>{out+=s+'\n';};
function cls(n){
  if(n==='_ga'||n.startsWith('_ga_')||n==='_gid'||n.startsWith('_gat')) return 'GA4';
  if(n==='_fbp'||n==='_fbc'||n==='fr') return 'Meta';
  if(n.startsWith('_gcl')) return 'Ads';
  return null;
}
const browser=await chromium.launch({args:['--no-sandbox','--ignore-certificate-errors']});

async function T(n, label, url, action, expect){
  L(''); L('═══════════════════════════════════════════════');
  L(' TESTAS '+n+': '+label);
  L('═══════════════════════════════════════════════');
  const ctx=await browser.newContext({ignoreHTTPSErrors:true,userAgent:'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120'});
  const p=await ctx.newPage();
  const ga=[],fb=[],ads=[];
  p.on('request', r=>{ const u=r.url();
    if(/\/g\/collect/.test(u)) ga.push(u);
    if(/facebook\.com\/tr/.test(u)) fb.push(u);
    if(/googleadservices|google\.com\/pagead|\/ccm\/collect/.test(u)) ads.push(u);
  });
  const resp=await p.goto(url,{waitUntil:'domcontentloaded',timeout:60000});
  if(!resp||resp.status()>=400){ L('  ⚠️ NEUZSIKROVE — NEGALIOJA'); await ctx.close(); return {ok:false}; }
  await p.waitForTimeout(6000);
  if(action){ try{ await action(p); }catch(e){ L('  veiksmo klaida: '+e.message.slice(0,70)); } await p.waitForTimeout(8000); }

  const cookies=await ctx.cookies();
  const tr=cookies.filter(c=>cls(c.name));
  const byType={GA4:[],Meta:[],Ads:[]};
  tr.forEach(c=>byType[cls(c.name)].push(c.name));

  const st=await p.evaluate(()=>{
    const dl=window.dataLayer||[]; const cons=[];
    for(const x of dl) if(x&&x[0]==='consent') cons.push({m:x[1],v:x[2]});
    const last=cons[cons.length-1];
    return { gtm: window.google_tag_manager?Object.keys(window.google_tag_manager).filter(k=>/^(GTM-|G-)/.test(k)):[],
             lastConsent:last?last.v:null, fbq:typeof window.fbq==='function', consentCount:cons.length };
  });

  L('  cookies:  GA4='+(byType.GA4.join(',')||'—')+'   Meta='+(byType.Meta.join(',')||'—')+'   Ads='+(byType.Ads.join(',')||'—'));
  L('  uzklausos: GA4='+ga.length+'  Meta='+fb.length+'  Ads='+ads.length);
  L('  GTM containers: '+JSON.stringify(st.gtm));
  if(st.lastConsent) L('  galutinis consent: analytics='+st.lastConsent.analytics_storage+'  ad_storage='+st.lastConsent.ad_storage);
  if(ga.length){ const m=ga[0].match(/[?&]gcs=([^&]+)/); L('  gcs='+(m?m[1]:'nera')); }

  L('');
  L('  KRITERIJAI:');
  let pass=true;
  for(const [k,fn] of Object.entries(expect)){
    const r = fn({ga:byType.GA4, meta:byType.Meta, ads:byType.Ads, gaReq:ga.length, fbReq:fb.length});
    L('    '+(r?'✅':'❌')+' '+k);
    if(!r) pass=false;
  }
  L('  => '+(pass?'PRAEJO ✅':'NEPRAEJO ❌'));
  await ctx.close();
  return {ok:pass};
}

const accept = async p => { await p.click('.cmplz-accept',{timeout:12000}); };
const deny   = async p => { await p.click('.cmplz-deny',{timeout:12000}); };
const acceptStats = async p => {
  await p.click('.cmplz-view-preferences',{timeout:12000});
  await p.waitForTimeout(1500);
  await p.check('input[value="statistics"]',{timeout:8000}).catch(async()=>{ await p.click('label[for*="statistics"]',{timeout:6000}); });
  await p.waitForTimeout(800);
  await p.click('.cmplz-save-preferences',{timeout:8000});
};

const U='https://dev.avesa.lt/?gtm_test=1';
const r=[];
r.push(await T(1,'Ijimas, jokio sutikimo', U, null, {
  'nera _ga': x=>x.ga.length===0, 'nera _fbp': x=>x.meta.length===0, 'nera _gcl_au': x=>x.ads.length===0,
  'nera Meta uzklausu': x=>x.fbReq===0 }));
r.push(await T(2,'Reject all', U, deny, {
  'nera _ga': x=>x.ga.length===0, 'nera _fbp': x=>x.meta.length===0, 'nera _gcl_au': x=>x.ads.length===0,
  'nera Meta uzklausu': x=>x.fbReq===0 }));
r.push(await T(3,'Accept ALL', U, accept, {
  '_ga atsirado': x=>x.ga.length>0, '_fbp atsirado': x=>x.meta.length>0, '_gcl_au atsirado': x=>x.ads.length>0,
  'GA4 uzklausa': x=>x.gaReq>0, 'Meta uzklausa': x=>x.fbReq>0,
  'nera dubliu (Meta<=3 req)': x=>x.fbReq<=3 }));
r.push(await T(4,'Tik Analitika (statistics)', U, acceptStats, {
  '_ga atsirado': x=>x.ga.length>0, 'NEra _fbp': x=>x.meta.length===0,
  'nera Meta uzklausu': x=>x.fbReq===0 }));
r.push(await T(5,'Be gtm_test — DEV blokavimas', 'https://dev.avesa.lt/', accept, {
  'nera _ga': x=>x.ga.length===0, 'nera _fbp': x=>x.meta.length===0, 'nera _gcl_au': x=>x.ads.length===0,
  'nera jokiu uzklausu': x=>x.gaReq===0 && x.fbReq===0 }));
r.push(await T(6,'Prekes psl + Accept -> view_item', 'https://dev.avesa.lt/product/trixie-baza-draskykle-2-stulpai-su-guoliu-50-cm-sviesi/?gtm_test=1', accept, {
  '_ga atsirado': x=>x.ga.length>0, 'GA4 uzklausu >=2 (config+view_item)': x=>x.gaReq>=2 }));

L(''); L('═══════════════════════════════════════════════');
L(' SUVESTINE');
L('═══════════════════════════════════════════════');
const names=['1 Jokio sutikimo','2 Reject all','3 Accept all','4 Tik analitika','5 DEV blokavimas','6 view_item'];
r.forEach((x,i)=>L('  '+(x.ok?'✅':'❌')+' '+names[i]));
L('');
L('  '+r.filter(x=>x.ok).length+'/'+r.length+' testu praejo');
await browser.close();
putFile('e9_final_'+Date.now()+'.txt', out); console.log(out);
