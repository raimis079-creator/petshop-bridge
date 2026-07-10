import { chromium } from 'playwright';
import { execSync as __ex } from "child_process";
import __fs from "fs";
function putFile(n, s){
  const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
  for(let attempt=0; attempt<4; attempt++){
    try{
      const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+n;
      let sha='';
      try{ const r=JSON.parse(__ex('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})); sha=r.sha||''; }catch(e){}
      const body={message:'ci '+n,branch:'main',content:Buffer.from(s,'utf8').toString('base64')};
      if(sha) body.sha=sha;
      __fs.writeFileSync('/tmp/pf.json',JSON.stringify(body));
      const resp=__ex('curl -s -w "\nHTTP:%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});
      const code=(resp.match(/HTTP:(\d+)/)||[])[1];
      console.log('putFile '+n+' attempt '+(attempt+1)+' -> HTTP '+code);
      if(code==='200'||code==='201') return true;
    }catch(e){ console.log('putFile err: '+e.message.slice(0,100)); }
    __ex('sleep 2');
  }
  return false;
}
let out=''; const L=(s)=>{out+=s+'\n';};
function classify(n){
  if(n==='_ga'||n.startsWith('_ga_')||n==='_gid'||n.startsWith('_gat')) return 'GA4';
  if(n==='_fbp'||n==='_fbc'||n==='fr') return 'Meta';
  if(n.startsWith('_gcl')) return 'Ads';
  return null;
}
const browser = await chromium.launch({ args:['--no-sandbox','--ignore-certificate-errors'] });

async function run(label, url, action){
  L(''); L('##############################################');
  L('### '+label); L('##############################################');
  const ctx=await browser.newContext({ignoreHTTPSErrors:true, userAgent:'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120'});
  const page=await ctx.newPage();
  const ga=[], fb=[];
  page.on('request', r=>{ const u=r.url();
    if(/google-analytics\.com\/g\/collect|\/g\/collect/.test(u)) ga.push(u);
    if(/facebook\.com\/tr/.test(u)) fb.push(u);
  });
  const resp=await page.goto(url,{waitUntil:'domcontentloaded',timeout:60000});
  if(!resp || resp.status()>=400){ L('  ⚠️ NEUZSIKROVE'); await ctx.close(); return; }
  await page.waitForTimeout(6000);
  if(action){ await action(page); await page.waitForTimeout(7000); }

  const st = await page.evaluate(()=>{
    var dl=window.dataLayer||[]; var consents=[], events=[];
    for(var i=0;i<dl.length;i++){
      var x=dl[i];
      if(x && x[0]==='consent') consents.push({i:i, mode:x[1], val:x[2]});
      if(x && x.event) events.push(x.event);
    }
    return { dlLen:dl.length, consents:consents, events:events,
             gtm: window.google_tag_manager ? Object.keys(window.google_tag_manager).filter(k=>/^(GTM-|G-)/.test(k)) : [] };
  });
  L('  dataLayer: '+st.dlLen+' irasu');
  L('  consent irasai:');
  st.consents.forEach(c=>{
    const v=c.val||{};
    L('    ['+c.i+'] '+c.mode+'  analytics='+(v.analytics_storage||'-')+'  ad_storage='+(v.ad_storage||'-')+'  ad_user_data='+(v.ad_user_data||'-'));
  });
  if(st.consents.length===0) L('    ❌ NERA');
  L('  event\'ai: '+JSON.stringify(st.events));
  L('  GTM containers: '+JSON.stringify(st.gtm));
  L('');
  const cookies=await ctx.cookies();
  const tr=cookies.filter(c=>classify(c.name));
  L('  Tracking cookies:');
  if(tr.length===0) L('    (nera)');
  tr.forEach(c=>L('    '+classify(c.name).padEnd(6)+' '+c.name));
  L('  cmplz: '+cookies.filter(c=>c.name.startsWith('cmplz')).map(c=>c.name+'='+c.value).join(', ').slice(0,140));
  L('');
  L('  GA4 uzklausu: '+ga.length);
  ga.slice(0,2).forEach(u=>{ const m=u.match(/[?&]gcs=([^&]+)/); L('    gcs='+(m?m[1]:'nera')); });
  L('  Meta uzklausu: '+fb.length);
  await ctx.close();
  return { tr:tr.length, ga:ga.length, fb:fb.length, gcs:(ga[0]||'').match(/[?&]gcs=([^&]+)/)?.[1] };
}

L('##### CONSENT BRIDGE TESTAS (visi su gtm_test=1) #####');
const r1 = await run('1) PRIES SUTIKIMA', 'https://dev.avesa.lt/?gtm_test=1', null);
const r2 = await run('2) ACCEPT ALL', 'https://dev.avesa.lt/?gtm_test=1', async p=>{ await p.click('.cmplz-accept',{timeout:10000}); L('  [paspausta PRIIMTI]'); });
const r3 = await run('3) DENY ALL', 'https://dev.avesa.lt/?gtm_test=1', async p=>{ await p.click('.cmplz-deny',{timeout:10000}); L('  [paspausta NEIGTI]'); });
const r4 = await run('4) BE gtm_test (blocking trigger)', 'https://dev.avesa.lt/', null);

L(''); L('##############################################');
L('### SUVESTINE'); L('##############################################');
L('  1) Pries sutikima:   cookies='+r1?.tr+'  gcs='+r1?.gcs+'  meta_req='+r1?.fb+'   laukiama: gcs=G100');
L('  2) Accept All:       cookies='+r2?.tr+'  gcs='+r2?.gcs+'  meta_req='+r2?.fb+'   laukiama: gcs=G111, _ga+_fbp');
L('  3) Deny All:         cookies='+r3?.tr+'  gcs='+r3?.gcs+'  meta_req='+r3?.fb+'   laukiama: gcs=G100, jokiu cookies');
L('  4) Be gtm_test:      cookies='+r4?.tr+'  ga_req='+r4?.ga+'  meta_req='+r4?.fb+'   laukiama: viskas 0');
await browser.close();
const ok = putFile('bt_'+Date.now()+'.txt', out);
console.log('PUTFILE OK: '+ok);
console.log(out);
