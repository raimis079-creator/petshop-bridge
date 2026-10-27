process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODAyYyByZWNvbiBwcmlzdGF0eW1hcy9ULTUgKHJlYWQtb25seSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxODAyYyddKSkgcmV0dXJuOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRyPVsndic9PidTMTgwMmMnXTsKICAkZD1XUE1VX1BMVUdJTl9ESVI7CiAgJHBrPWZpbGVfZ2V0X2NvbnRlbnRzKCIkZC9wZXRzaG9wLXByZW51bWVyYXRhLXBhc2t5cmEucGhwIik7ICRsPWV4cGxvZGUoIlxuIiwkcGspOyAkb3V0PVtdOwogIGZvcmVhY2goJGwgYXMgJGk9PiRsbil7IGlmKHByZWdfbWF0Y2goJy9kZWxpdmVyeXxwYXN0b21hdHxrdXJqZXJ8bWV0aG9kfHBpY2t1cHx2ZW5pcGFrfGxwX3x0ZXJtaW5hbC9pJywkbG4pKSAkb3V0W109KCRpKzEpLic6ICcudHJpbShtYl9zdWJzdHIoJGxuLDAsMjIwKSk7IH0KICAkclsncGFza3lyYV9kZWxpdmVyeV9laWx1dGVzJ109YXJyYXlfc2xpY2UoJG91dCwwLDEyMCk7CiAgZm9yZWFjaChbJ3N1YnNjcmlwdGlvbi10NS5waHAnLCdzdWJzY3JpcHRpb25fdDUucGhwJ10gYXMgJGYpeyBmb3JlYWNoKFsiJGQvcHMtc2FibG9uYWkvJGYiLCIkZC9wZXRzaG9wLWNvcmUvdGVtcGxhdGVzL2VtYWlscy8kZiIsV1BfUExVR0lOX0RJUi4iL3BldHNob3AtY29yZS90ZW1wbGF0ZXMvZW1haWxzLyRmIl0gYXMgJHApeyBpZihmaWxlX2V4aXN0cygkcCkpeyAkclsndDVfa2VsaWFzJ109JHA7ICRyWyd0NSddPWZpbGVfZ2V0X2NvbnRlbnRzKCRwKTsgYnJlYWsgMjsgfSB9IH0KICBpZihlbXB0eSgkclsndDUnXSkpeyAkeD0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBmbG93LCB0ZW1wbGF0ZSBGUk9NIHskUH1wc19lbWFpbF9jb250ZW50IFdIRVJFIGZsb3cgTElLRSAnJXQ1JScgT1IgZmxvdyBMSUtFICclc3Vic2NyaXB0aW9uJScgTElNSVQgMTAiLEFSUkFZX0EpOyAkclsndDVfZGInXT0keDsgJHJbJ3Q1X2ZhaWxfcGFpZXNrYSddPWdsb2IoIiRkLyovKnQ1KiIpOyAkclsnY29yZV9kaXInXT1nbG9iKCIkZC9wZXRzaG9wLWNvcmUvdGVtcGxhdGVzL2VtYWlscy8qc3Vic2NyKiIpOyB9CiAgJHJbJ2VtYWlsX2NvbnRlbnRfcm93cyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGZsb3csIExFRlQoc3ViamVjdCw4MCkgcywgTEVOR1RIKGJsb2NrcykgYiBGUk9NIHskUH1wc19lbWFpbF9jb250ZW50IFdIRVJFIGZsb3cgTElLRSAnJXN1YnNjciUnIE9SIGZsb3cgTElLRSAnJXByZW4lJyBPUiBmbG93IExJS0UgJyVwYXltZW50JSciLEFSUkFZX0EpOyAkclsnU1FMJ109JHdwZGItPmxhc3RfZXJyb3I7CiAgJHJbJ2VtYWlsX2NvbnRlbnRfY29scyddPSR3cGRiLT5nZXRfY29sKCJTSE9XIENPTFVNTlMgRlJPTSB7JFB9cHNfZW1haWxfY29udGVudCIpOwogICR6PVtdOyBmb3JlYWNoKFdDX1NoaXBwaW5nX1pvbmVzOjpnZXRfem9uZXMoKSBhcyAkem9uZSl7ICRtPVtdOyBmb3JlYWNoKCR6b25lWydzaGlwcGluZ19tZXRob2RzJ10gYXMgJHNtKXsgJG1bXT1bJ2lkJz0+JHNtLT5pZCwnaW5zdCc9PiRzbS0+aW5zdGFuY2VfaWQsJ3RpdGxlJz0+JHNtLT5nZXRfdGl0bGUoKSwnZW5hYmxlZCc9PiRzbS0+ZW5hYmxlZCwnY29zdCc9Pm1ldGhvZF9leGlzdHMoJHNtLCdnZXRfb3B0aW9uJyk/JHNtLT5nZXRfb3B0aW9uKCdjb3N0Jyk6bnVsbCwnbWluJz0+bWV0aG9kX2V4aXN0cygkc20sJ2dldF9vcHRpb24nKT8kc20tPmdldF9vcHRpb24oJ21pbl9hbW91bnQnKTpudWxsXTsgfSAkeltdPVsnem9uYSc9PiR6b25lWyd6b25lX25hbWUnXSwnbWV0b2RhaSc9PiRtXTsgfQogICRyWyd6b25vcyddPSR6OwogICRyWyd0YXJpZmFpJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgKiBGUk9NIHskUH1wc190YXJpZmFpIExJTUlUIDIwIixBUlJBWV9BKTsKICAkclsncGF6YWRhc19vcGMnXT1bJ3BzX3Rpa19rdXJqZXJpdSc9PmdldF9vcHRpb24oJ3BzX3Rpa19rdXJqZXJpdScpXTsKICAkbz13Y19nZXRfb3JkZXJzKFsnbGltaXQnPT4zLCdvcmRlcmJ5Jz0+J2RhdGUnLCdvcmRlcic9PidERVNDJywnc3RhdHVzJz0+Wydwcm9jZXNzaW5nJywnY29tcGxldGVkJ11dKTsgZm9yZWFjaCgkbyBhcyAkb28peyAkc2g9W107IGZvcmVhY2goJG9vLT5nZXRfc2hpcHBpbmdfbWV0aG9kcygpIGFzICRzKXsgJHNoW109WydtZXRob2RfaWQnPT4kcy0+Z2V0X21ldGhvZF9pZCgpLCdpbnN0Jz0+JHMtPmdldF9pbnN0YW5jZV9pZCgpLCduYW1lJz0+JHMtPmdldF9uYW1lKCksJ3RvdGFsJz0+JHMtPmdldF90b3RhbCgpLCdtZXRhJz0+YXJyYXlfc2xpY2UoJHMtPmdldF9tZXRhX2RhdGEoKSwwLDYpXTsgfSAkclsncHZ6X3V6cyddW109Wyducic9PiRvby0+Z2V0X29yZGVyX251bWJlcigpLCdzaGlwJz0+JHNoLCdwaWNrdXBfbWV0YSc9PlsnX3BzX3Bhc3RvbWF0YXMnPT4kb28tPmdldF9tZXRhKCdfcHNfcGFzdG9tYXRhcycpLCd2ZW5pcGFrX3BpY2t1cCc9PiRvby0+Z2V0X21ldGEoJ3ZlbmlwYWtfcGlja3VwX3BvaW50X2lkJyksJ192ZW5pcGFrJz0+YXJyYXlfZmlsdGVyKGFycmF5X21hcChmdW5jdGlvbigkbSl7cmV0dXJuIHN0cnBvcygkbS0+a2V5LCd2ZW5pcGFrJykhPT1mYWxzZXx8c3RycG9zKCRtLT5rZXksJ3BpY2t1cCcpIT09ZmFsc2V8fHN0cnBvcygkbS0+a2V5LCd0ZXJtaW5hbCcpIT09ZmFsc2U/JG0tPmtleS4nPScuKGlzX3NjYWxhcigkbS0+dmFsdWUpPyRtLT52YWx1ZTpqc29uX2VuY29kZSgkbS0+dmFsdWUpKTpudWxsO30sJG9vLT5nZXRfbWV0YV9kYXRhKCkpKV1dOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9LDEpOwo=';
const VER='dep-084435';
const GKEY='ps_s1802c';
const PHASES=["1"];
const OUT='analize/s1802_c.json';
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
