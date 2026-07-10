import { chromium } from 'playwright';
import { execSync } from "child_process";
import fs from "fs";
function putFile(n,s){
  const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
  for(let a=0;a<4;a++){ try{
    const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+n;
    let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){}
    const b={message:'ci',branch:'main',content:Buffer.from(s,'utf8').toString('base64')}; if(sha) b.sha=sha;
    fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));
    const r=execSync('curl -s -w "\nHTTP:%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});
    if(/HTTP:20[01]/.test(r)) return true;
  }catch(e){} execSync('sleep 2'); }
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

async function T(n,label,url,action,expect){
  L(''); L('═══════════════════════════════════════');
  L(' TESTAS '+n+': '+label);
  L('═══════════════════════════════════════');
  const ctx=await browser.newContext({ignoreHTTPSErrors:true,userAgent:'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120'});
  const p=await ctx.newPage();
  const ga=[],fb=[],ads=[];
  p.on('request',r=>{const u=r.url();
    if(/\/g\/collect/.test(u)) ga.push(u);
    if(/facebook\.com\/tr/.test(u)) fb.push(u);
    if(/googleadservices|\/pagead\/|\/ccm\/collect/.test(u)) ads.push(u);});
  const resp=await p.goto(url,{waitUntil:'domcontentloaded',timeout:60000});
  if(!resp||resp.status()>=400){ L('  ⚠️ NEUZSIKROVE'); await ctx.close(); return {ok:false}; }
  await p.waitForTimeout(6000);
  if(action){ try{ await action(p); }catch(e){ L('  ⚠️ veiksmas: '+e.message.slice(0,90)); } await p.waitForTimeout(9000); }
  const cookies=await ctx.cookies();
  const b={GA4:[],Meta:[],Ads:[]};
  cookies.filter(c=>cls(c.name)).forEach(c=>b[cls(c.name)].push(c.name));
  const st=await p.evaluate(()=>{
    const dl=window.dataLayer||[]; const cons=[]; const evs=[];
    for(const x of dl){ if(x&&x[0]==='consent') cons.push(x[2]); if(x&&x.event) evs.push(x.event+(x.cmplz_replay?'(replay)':'')); }
    return { gtm: window.google_tag_manager?Object.keys(window.google_tag_manager).filter(k=>/^(GTM-|G-)/.test(k)):[],
             last: cons[cons.length-1]||null, events: evs };
  });
  L('  cookies: GA4='+(b.GA4.join(',')||'—')+'  Meta='+(b.Meta.join(',')||'—')+'  Ads='+(b.Ads.join(',')||'—'));
  L('  uzklausos: GA4='+ga.length+'  Meta='+fb.length+'  Ads='+ads.length);
  L('  containers: '+JSON.stringify(st.gtm));
  if(st.last) L('  consent: analytics='+st.last.analytics_storage+' ad_storage='+st.last.ad_storage);
  L('  events: '+JSON.stringify(st.events));
  if(ga.length){ const m=ga[0].match(/[?&]gcs=([^&]+)/); L('  gcs='+(m?m[1]:'—')); }
  L('');
  let pass=true;
  for(const [k,fn] of Object.entries(expect)){
    const ok=fn({ga:b.GA4,meta:b.Meta,ads:b.Ads,gaReq:ga.length,fbReq:fb.length,events:st.events});
    L('    '+(ok?'✅':'❌')+' '+k); if(!ok) pass=false;
  }
  L('  => '+(pass?'PRAEJO ✅':'NEPRAEJO ❌'));
  await ctx.close();
  return {ok:pass};
}
const accept=async p=>{ await p.click('.cmplz-accept',{timeout:12000}); };
const deny  =async p=>{ await p.click('.cmplz-deny',{timeout:12000}); };
const statsOnly=async p=>{
  await p.click('.cmplz-view-preferences',{timeout:12000});
  await p.waitForTimeout(2000);
  const sel=['input.cmplz-consent-checkbox.statistics','input[data-category="cmplz_statistics"]','#cmplz-statistics-optin','input[name="cmplz_statistics"]','.cmplz-categories input[value="statistics"]'];
  let done=false;
  for(const s of sel){ try{ await p.check(s,{timeout:3000}); L('  [pazymeta: '+s+']'); done=true; break; }catch(e){} }
  if(!done){
    const found = await p.evaluate(()=>{
      const inputs=[...document.querySelectorAll('.cmplz-cookiebanner input[type=checkbox]')];
      const r=inputs.map(i=>({id:i.id,name:i.name,val:i.value,cls:i.className,disabled:i.disabled}));
      const s=inputs.find(i=>/statistic/i.test(i.id+i.name+i.value+i.className));
      if(s && !s.disabled){ s.click(); return {clicked:true, all:r}; }
      return {clicked:false, all:r};
    });
    L('  [JS checkbox: '+(found.clicked?'pazymeta':'NEPAVYKO')+']');
    L('  [rasti: '+JSON.stringify(found.all).slice(0,220)+']');
  }
  await p.waitForTimeout(1000);
  await p.click('.cmplz-save-preferences',{timeout:8000});
};

const U='https://dev.avesa.lt/?gtm_test=1';
const r=[];
r.push(await T(1,'Jokio sutikimo',U,null,{
  'nera _ga':x=>x.ga.length===0,'nera _fbp':x=>x.meta.length===0,'nera _gcl_au':x=>x.ads.length===0,
  'nera GA4 uzklausu':x=>x.gaReq===0,'nera Meta uzklausu':x=>x.fbReq===0}));
r.push(await T(2,'Reject all',U,deny,{
  'nera _ga':x=>x.ga.length===0,'nera _fbp':x=>x.meta.length===0,'nera _gcl_au':x=>x.ads.length===0,
  'nera uzklausu':x=>x.gaReq===0&&x.fbReq===0}));
r.push(await T(3,'Accept ALL',U,accept,{
  '_ga atsirado':x=>x.ga.length>0,'_fbp atsirado':x=>x.meta.length>0,'_gcl_au atsirado':x=>x.ads.length>0,
  'GA4 uzklausa':x=>x.gaReq>0,'Meta uzklausa':x=>x.fbReq>0,
  'nera Meta dubliu':x=>x.fbReq<=2}));
r.push(await T(4,'Tik Analitika',U,statsOnly,{
  '_ga atsirado':x=>x.ga.length>0,'NEra _fbp':x=>x.meta.length===0,
  'NEra _gcl_au':x=>x.ads.length===0,'nera Meta uzklausu':x=>x.fbReq===0}));
r.push(await T(5,'Be gtm_test — DEV blok.','https://dev.avesa.lt/',accept,{
  'nera _ga':x=>x.ga.length===0,'nera _fbp':x=>x.meta.length===0,'nera _gcl_au':x=>x.ads.length===0,
  'nera uzklausu':x=>x.gaReq===0&&x.fbReq===0}));
r.push(await T(6,'Preke + Accept -> view_item replay','https://dev.avesa.lt/product/trixie-baza-draskykle-2-stulpai-su-guoliu-50-cm-sviesi/?gtm_test=1',accept,{
  '_ga atsirado':x=>x.ga.length>0,
  'view_item replay dataLayer\'yje':x=>x.events.some(e=>e.includes('replay')),
  'GA4 uzklausu >=2':x=>x.gaReq>=2}));

L(''); L('═══════════════════════════════════════');
L(' SUVESTINE');
L('═══════════════════════════════════════');
const nm=['1 Jokio sutikimo','2 Reject all','3 Accept all','4 Tik analitika','5 DEV blokavimas','6 view_item replay'];
r.forEach((x,i)=>L('  '+(x.ok?'✅':'❌')+'  '+nm[i]));
L(''); L('  '+r.filter(x=>x.ok).length+'/'+r.length+' praejo');
await browser.close();
putFile('e9_v2_'+Date.now()+'.txt', out); console.log(out);
