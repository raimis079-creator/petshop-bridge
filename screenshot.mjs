process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2ODEgdCDigJQgRUUvTFYgVmVuaXBhayBwYcWhdG9tYXRhaSAoaW5zdCA1KSBmZWUgMi40NyDihpIgMy41OTsgYmFrIG9wY2lqYSBwc19zMTY4MV9pbnN0NV9iYWs7IHBhdGlrcmE6IExWIHBha2V0YXMg4oaSIHRhcmlmYXMsIGlyIExWIGtsaWVudG8gcHJla8SXcyBrYWluYSAoUFZNKS4gKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfczE2ODF0J10pKSByZXR1cm47ICRvPWFycmF5KCd2Jz0+J1MxNjgxIHQnKTsgJGs9J3dvb2NvbW1lcmNlX3Nob3B1cF92ZW5pcGFrX3NoaXBwaW5nX3BpY2t1cF9tZXRob2RfNV9zZXR0aW5ncyc7CiAgJHM9Z2V0X29wdGlvbigkayk7ICRvWydidXZvJ109JHM7IGlmKCFnZXRfb3B0aW9uKCdwc19zMTY4MV9pbnN0NV9iYWsnKSkgYWRkX29wdGlvbigncHNfczE2ODFfaW5zdDVfYmFrJywkcywnJyxmYWxzZSk7CiAgJHNbJ2ZlZSddPSczLjU5JzsgJHNbJ21pbl9hbW91bnRfZm9yX2ZyZWVfc2hpcHBpbmcnXT0nJzsgdXBkYXRlX29wdGlvbigkaywkcyk7ICRvWydkYWJhciddPWdldF9vcHRpb24oJGspOwogIFdDX0NhY2hlX0hlbHBlcjo6Z2V0X3RyYW5zaWVudF92ZXJzaW9uKCdzaGlwcGluZycsdHJ1ZSk7CiAgJHBpZD13Y19nZXRfcHJvZHVjdHMoYXJyYXkoJ2xpbWl0Jz0+MSwnc3RhdHVzJz0+J3B1Ymxpc2gnLCdzdG9ja19zdGF0dXMnPT4naW5zdG9jaycsJ3JldHVybic9PidpZHMnLCdvcmRlcmJ5Jz0+J3JhbmQnKSlbMF07CiAgZm9yZWFjaChhcnJheSgnTFYnLCdFRScsJ0xUJykgYXMgJGMpeyBXQygpLT5jdXN0b21lci0+c2V0X2JpbGxpbmdfbG9jYXRpb24oJGMsJycsJ0xWMTAxMCcsJycpOyBXQygpLT5jdXN0b21lci0+c2V0X3NoaXBwaW5nX2xvY2F0aW9uKCRjLCcnLCdMVjEwMTAnLCcnKTsKICAgICRwaz1hcnJheSgnY29udGVudHMnPT5hcnJheShhcnJheSgncHJvZHVjdF9pZCc9PiRwaWQsJ3F1YW50aXR5Jz0+MSwnZGF0YSc9PndjX2dldF9wcm9kdWN0KCRwaWQpLCdsaW5lX3RvdGFsJz0+MTAsJ2xpbmVfc3VidG90YWwnPT4xMCwnbGluZV90YXgnPT4wLCdsaW5lX3N1YnRvdGFsX3RheCc9PjApKSwnY29udGVudHNfY29zdCc9PjEwLCdhcHBsaWVkX2NvdXBvbnMnPT5hcnJheSgpLCdkZXN0aW5hdGlvbic9PmFycmF5KCdjb3VudHJ5Jz0+JGMsJ3N0YXRlJz0+JycsJ3Bvc3Rjb2RlJz0+J0xWMTAxMCcsJ2NpdHknPT4nUmlnYScsJ2FkZHJlc3MnPT4nYScsJ2FkZHJlc3NfMSc9PidhJywnYWRkcmVzc18yJz0+JycpLCdjYXJ0X3N1YnRvdGFsJz0+MTApOwogICAgJHo9V0NfU2hpcHBpbmdfWm9uZXM6OmdldF96b25lX21hdGNoaW5nX3BhY2thZ2UoJHBrKTsgJHI9YXJyYXkoKTsKICAgIGZvcmVhY2goJHotPmdldF9zaGlwcGluZ19tZXRob2RzKHRydWUpIGFzICRtKXsgJG0tPnJhdGVzPWFycmF5KCk7ICRtLT5jYWxjdWxhdGVfc2hpcHBpbmcoJHBrKTsgZm9yZWFjaCgkbS0+cmF0ZXMgYXMgJHJ0KSAkcltdPWFycmF5KCdtJz0+JHJ0LT5nZXRfbGFiZWwoKSwnY29zdCc9PiRydC0+Z2V0X2Nvc3QoKSwndGF4Jz0+YXJyYXlfc3VtKCRydC0+Z2V0X3RheGVzKCkpLCd2aXNvJz0+cm91bmQoJHJ0LT5nZXRfY29zdCgpK2FycmF5X3N1bSgkcnQtPmdldF90YXhlcygpKSwyKSk7IH0KICAgICRwcj13Y19nZXRfcHJvZHVjdCgkcGlkKTsgJG9bJ3Rlc3QnXVskY109YXJyYXkoJ3pvbmEnPT4kei0+Z2V0X3pvbmVfbmFtZSgpLCd0YXJpZmFpJz0+JHIsJ3ByZWtlJz0+JHByLT5nZXRfbmFtZSgpLCdrYWluYV9zdV9wdm0nPT53Y19nZXRfcHJpY2VfaW5jbHVkaW5nX3RheCgkcHIpLCdrYWluYV9iZSc9PndjX2dldF9wcmljZV9leGNsdWRpbmdfdGF4KCRwciksJ2thaW5hX3JlZyc9PiRwci0+Z2V0X3ByaWNlKCkpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK';
const VER='dep-115015';
const GKEY='ps_s1681t';
const PHASES=["A"];
const OUT='analize/s1681_t.json';
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
