process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2ODYgbXcg4oCUIFJFQUQtT05MWToga3JhaWtvIHBpcmvEl2phaSAodG9wX2thdCBrcmFpa2FpKSBwYWdhbCBncnVwxJkgaXIgcGFza3V0aW7El3Mga3JhaWtvIHByZWvEl3MgYsWrc2VuxIU7IEc0IGRlYWRfcHJvZHVjdCBrYXRlZ29yaWpvczsga3JhaWtvIHByZWtpxbMgZ3l2dW1hcyBrYXRhbG9nZS4gKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfczE2ODZtdyddKSkgcmV0dXJuOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J1MxNjg2IG13Jyk7ICR0PVBldHNob3BfUmVsYXVuY2g6OnQoKTsKICAkb1sna3JhaWthc19ncnVwZXMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBncnVwZSwgQ09VTlQoKikgbiwgTUlOKGxhc3RfYW55X2RhdGUpIG51bywgTUFYKGxhc3RfYW55X2RhdGUpIGlraSBGUk9NICR0IFdIRVJFIHRvcF9rYXQgTElLRSAnJUtyYWlrJScgR1JPVVAgQlkgZ3J1cGUgT1JERVIgQlkgbiBERVNDIixBUlJBWV9BKTsKICAkb1snZzRfa2F0J109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgbGFzdF9rYXQsIENPVU5UKCopIG4gRlJPTSAkdCBXSEVSRSBncnVwZT0nRzRfZGVhZF9wcm9kdWN0JyBHUk9VUCBCWSBsYXN0X2thdCBPUkRFUiBCWSBuIERFU0MgTElNSVQgOCIsQVJSQVlfQSk7CiAgJG9bJ2c0X3ByZWtlcyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGxhc3RfYW55X3Byb2R1Y3RfaWQgcGlkLCBDT1VOVCgqKSBuIEZST00gJHQgV0hFUkUgZ3J1cGU9J0c0X2RlYWRfcHJvZHVjdCcgR1JPVVAgQlkgcGlkIE9SREVSIEJZIG4gREVTQyBMSU1JVCA4IixBUlJBWV9BKTsKICBmb3JlYWNoKCRvWydnNF9wcmVrZXMnXSBhcyAmJHIpeyAkcHI9d2NfZ2V0X3Byb2R1Y3QoKGludCkkclsncGlkJ10pOyAkclsncGF2J109JHByPyRwci0+Z2V0X25hbWUoKTonKG7El3JhKSc7ICRyWydidXNlbmEnXT0kcHI/KCRwci0+Z2V0X3N0YXR1cygpLicvJy4oJHByLT5pc19pbl9zdG9jaygpPyd5cmEnOiduxJdyYScpKTonLSc7IH0gdW5zZXQoJHIpOwogICRvWydrcmFpa2FzX2thdGFsb2dhcyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHBwLnBvc3Rfc3RhdHVzIHMsIENPVU5UKCopIG4gRlJPTSB7JHB9cG9zdHMgcHAgSk9JTiB7JHB9dGVybV9yZWxhdGlvbnNoaXBzIHRyIE9OIHRyLm9iamVjdF9pZD1wcC5JRCBKT0lOIHskcH10ZXJtX3RheG9ub215IHR0IE9OIHR0LnRlcm1fdGF4b25vbXlfaWQ9dHIudGVybV90YXhvbm9teV9pZCBKT0lOIHskcH10ZXJtcyB0ZSBPTiB0ZS50ZXJtX2lkPXR0LnRlcm1faWQgV0hFUkUgcHAucG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgdGUubmFtZSBMSUtFICdLcmFpa2FpJScgR1JPVVAgQlkgcyIsQVJSQVlfQSk7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSk7Cg==';
const VER='dep-205241';
const GKEY='ps_s1686mw';
const PHASES=["RECON"];
const OUT='analize/s1686_mw.json';
const DATA=[];
const out={v:VER};
const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(p,buf,m){ const u='https://api.github.com/repos/'+REPO+'/contents/'+p; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:m,content:buf.toString('base64')}; if(sha)b.sha=sha;
  return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
async function fx(u,o,k){ for(let i=0;i<5;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(8000);} } throw new Error('fx:'+k); }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
const UA={'Cache-Control':'no-cache','User-Agent':'Mozilla/5.0'};
let sid=null;
try{
  try{ const l=await fx(SNIP,{headers:A},'list'); const arr=JSON.parse(await l.text());
  for(const s of (Array.isArray(arr)?arr:[]).filter(s=>s.active&&/^TEMP/.test(s.name||''))){
    await fetch(SNIP+'/'+s.id,{method:'POST',headers:A,body:JSON.stringify({id:s.id,active:false})}); } }catch(e){ out.list_praleistas=String(e).slice(0,80); }
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS '+VER,
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  const ct=await c.text(); out.kurimas=c.status; try{sid=JSON.parse(ct).id; out.sid=sid;}catch(e){out.kurimo_atsakas=ct.slice(0,400);}
  let dq='';
  if(DATA.length){ out.data={}; for(const p of DATA){ const name=p.split('/').pop();
      const g=await fx('https://api.github.com/repos/'+REPO+'/contents/'+p,{headers:{Authorization:'Bearer '+TOK,Accept:'application/vnd.github.raw+json'}},'gh_'+name);
      const buf=Buffer.from(await g.arrayBuffer());
      const m=await fx(WP+'/wp-json/wp/v2/media',{method:'POST',headers:{Authorization:AUTH,'Content-Type':'text/plain','Content-Disposition':'attachment; filename="'+name+'"'},body:buf},'media_'+name);
      const mt=await m.text(); try{ const j=JSON.parse(mt); out.data[name]={id:j.id,status:m.status}; dq+='&d_'+name.replace(/\W/g,'_')+'='+j.id; }catch(e){ out.data[name]={status:m.status,err:mt.slice(0,200)}; } } }
  await miegok(9000);
  if(process.env.GTM_SA_JSON){ try{ const sr=await fx(WP+'/wp-json/ps-seo-temp/v1/sa',{method:'POST',headers:{Authorization:AUTH,'Content-Type':'text/plain'},body:process.env.GTM_SA_JSON},'sa'); out.sa_push={status:sr.status,body:(await sr.text()).slice(0,200)}; }catch(e){ out.sa_push=String(e).slice(0,200);} }
  for(let i=0;i<PHASES.length;i++){
    const f=PHASES[i];
    if(i>0) await miegok(5000);
    const d=await fx(WP+'/?'+GKEY+'='+encodeURIComponent(f)+dq,{headers:UA},'faze_'+f);
    const t=await d.text();
    try{ out[f]=JSON.parse(t); }catch(e){ out['zalias_'+f]=t.slice(0,3000); }
  }
  // EKRANO NUOTRAUKOS (browser=1): fazė grąžina shots:[{n,u,w}], cookies:[{name,value}]
  const SH=(()=>{ for(const f of PHASES){ if(out[f]&&out[f].shots) return out[f]; } return null; })();
  if(SH){ try{ const {chromium}=await import('playwright'); const br=await chromium.launch(); const ctx=await br.newContext({viewport:{width:1440,height:900},ignoreHTTPSErrors:true});
      if(SH.cookies){ await ctx.addCookies(SH.cookies.map(c=>({name:c.name,value:c.value,domain:new URL(WP).hostname,path:'/',secure:true}))); }
      out.shots={};
      for(const s of SH.shots){ try{ const pg=await ctx.newPage(); const errs=[]; pg.on('pageerror',e=>errs.push('pageerror: '+String(e).slice(0,300))); pg.on('console',m=>{ if(m.type()==='error'||m.type()==='warning') errs.push(m.type()+': '+m.text().slice(0,300)); }); pg.on('response',r=>{ if(r.status()>=400) errs.push('http '+r.status()+' '+r.url().slice(0,120)); });
          if(s.w) await pg.setViewportSize({width:s.w,height:s.h||900}); await pg.goto(s.u,{waitUntil:'networkidle',timeout:60000}); await pg.waitForTimeout(800);
          const res={}; if(s.click){ try{ await pg.click(s.click,{timeout:5000}); await pg.waitForTimeout(600); res.clicked=s.click; }catch(e){ res.click_err=String(e).slice(0,200); } }
          if(s.eval){ try{ res.eval=await pg.evaluate(s.eval); }catch(e){ res.eval_err=String(e).slice(0,200); } }
          const buf=await pg.screenshot({fullPage:!!s.full}); const st=await put('screenshots/'+s.n+'.png',buf,VER+' '+s.n); out.shots[s.n]=Object.assign({status:st,url:pg.url(),title:await pg.title(),errors:errs.slice(0,12)},res); await pg.close(); }catch(e){ out.shots[s.n]=String(e).slice(0,200); } }
      await br.close(); }catch(e){ out.shots_klaida=String(e).slice(0,300); } }
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put(OUT, Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
