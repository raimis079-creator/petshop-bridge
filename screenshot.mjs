process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODUxZiBrYWNpdWt1L3N1bml1a3UgcGlya2VqdSBncml6aW1hcyAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE4NTFmJ10pKSByZXR1cm47IEBzZXRfdGltZV9saW1pdCgyNTApOyBAaW5pX3NldCgnbWVtb3J5X2xpbWl0JywnNTEyTScpOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRyPVsndic9PidTMTg1MWYnXTsKICB0cnl7CiAgICAkSz0ia2l0dGVufGthY2l1a3xrYcSNaXVrfGphdW5vbXMga2F0fGJhYnljYXR8YmFieSBjYXQiOwogICAgJFM9InB1cHB5fHN1bml1a3zFoXVuaXVrfGphdW5pZW1zIHN1bnxqYXVuaWVtcyDFoXVufGp1bmlvcnxraWRzfHdlbHBlbiI7CiAgICAkc3FsPSJTRUxFQ1QgbC5pZCwgREFURSh1LnN1a3VydGFfYXQpIGQsIHUua2xpZW50YXNfZW1haWxfaGFzaCBjLCBsLmN0LCBsLmssIGwucCwgdS5rbGllbnRhc19uYXVqYXMgbmosIGwuZwogICAgICBGUk9NIChTRUxFQ1QgdXpzYWt5bWFzX2lkIGlkLCBTVU0oa2FpbmFfY3QpIGN0LCBNQVgocGF2YWRpbmltYXNfdHVvX21ldHUgUkVHRVhQICckSycpIGssIE1BWChwYXZhZGluaW1hc190dW9fbWV0dSBSRUdFWFAgJyRTJykgcCwgR1JPVVBfQ09OQ0FUKERJU1RJTkNUIGd5dnVuYXMpIGcgRlJPTQogICAgICAgICAgIChTRUxFQ1QgdXpzYWt5bWFzX2lkLGthaW5hX2N0LHBhdmFkaW5pbWFzX3R1b19tZXR1LGd5dnVuYXMgRlJPTSB7JFB9cHNfaXN0X2Zha3RfZWlsdXRlcyBXSEVSRSB0ZXN0aW5pcz0wCiAgICAgICAgICAgIFVOSU9OIEFMTCBTRUxFQ1QgdXpzYWt5bWFzX2lkLGthaW5hX2N0LHBhdmFkaW5pbWFzX3R1b19tZXR1LGd5dnVuYXMgRlJPTSB7JFB9cHNfZmFrdF9laWx1dGVzIFdIRVJFIHRlc3RpbmlzPTApIHggR1JPVVAgQlkgdXpzYWt5bWFzX2lkKSBsCiAgICAgIEpPSU4geyRQfXBzX3ZfYW5hbGl6ZV91enNha3ltYWkgdSBPTiB1LnV6c2FreW1hc19pZD1sLmlkIjsKICAgICRyb3dzPSR3cGRiLT5nZXRfcmVzdWx0cygkc3FsLEFSUkFZX0EpOyBpZigkd3BkYi0+bGFzdF9lcnJvcikgJHJbJ3NxbGVyciddPSR3cGRiLT5sYXN0X2Vycm9yOwogICAgJHJbJ3V6cyddPWNvdW50KCRyb3dzKTsgJGJlPTA7ICRDPVtdOyAkZ3k9W107CiAgICBmb3JlYWNoKCRyb3dzIGFzICRvKXsgZm9yZWFjaChleHBsb2RlKCcsJywoc3RyaW5nKSRvWydnJ10pIGFzICRnKXsgJGd5WyRnXT0oJGd5WyRnXT8/MCkrMTsgfSBpZighJG9bJ2MnXSl7ICRiZSsrOyBjb250aW51ZTsgfSAkQ1skb1snYyddXVtdPSRvOyB9CiAgICAkclsnYmVfa2xpZW50byddPSRiZTsgJHJbJ2tsaWVudHUnXT1jb3VudCgkQyk7IGFyc29ydCgkZ3kpOyAkclsnZ3l2dW5hcyddPWFycmF5X3NsaWNlKCRneSwwLDEyLHRydWUpOwogICAgJHNlZz1mdW5jdGlvbigkbyl7ICRnPW1iX3N0cnRvbG93ZXIoKHN0cmluZykkb1snZyddKTsgaWYoJG9bJ2snXSkgcmV0dXJuICdLX2thY2l1a2FzJzsgaWYoJG9bJ3AnXSkgcmV0dXJuICdQX3N1bml1a2FzJzsKICAgICAgJGthdD0oc3RycG9zKCRnLCdrYXRlJykhPT1mYWxzZSk7ICRzdW49KHN0cnBvcygkZywnc3VvJykhPT1mYWxzZSk7IGlmKHN0cnBvcygkZywnYWJ1JykhPT1mYWxzZSl7ICRrYXQ9JHN1bj10cnVlOyB9CiAgICAgIGlmKCRrYXQmJiEkc3VuKSByZXR1cm4gJ2thdGVfc3VhdWcnOyBpZigkc3VuJiYhJGthdCkgcmV0dXJuICdzdW9fc3VhdWcnOyByZXR1cm4gJ2tpdGEnOyB9OwogICAgJEE9W107ICRtZXRhaT1bXTsKICAgIGZvcmVhY2goJEMgYXMgJGM9PiRvcyl7IHVzb3J0KCRvcyxmdW5jdGlvbigkYSwkYil7IHJldHVybiBzdHJjbXAoJGFbJ2QnXS5zcHJpbnRmKCclMDEyZCcsJGFbJ2lkJ10pLCRiWydkJ10uc3ByaW50ZignJTAxMmQnLCRiWydpZCddKSk7IH0pOwogICAgICAkZj0kb3NbMF07ICRzPSRzZWcoJGYpOyAkeT1zdWJzdHIoJGZbJ2QnXSwwLDQpOyBpZigkZlsnbmonXSkgJG1ldGFpWyR5XVskc109KCRtZXRhaVskeV1bJHNdPz8wKSsxOwogICAgICBmb3JlYWNoKFsndmlzaSc9PnRydWUsJ3Rpa19uYXVqaSc9Pihib29sKSRmWyduaiddXSBhcyAkcms9PiRvayl7IGlmKCEkb2spIGNvbnRpbnVlOwogICAgICAgIGlmKCRmWydkJ10+JzIwMjUtMTEtMTInKSBjb250aW51ZTsgLy8gcmVpa2lhIDM2NSBkLiBzdGViZWppbW8KICAgICAgICAkbGltPWRhdGUoJ1ktbS1kJyxzdHJ0b3RpbWUoJGZbJ2QnXS4nICszNjUgZGF5cycpKTsgJG49MDsgJGN0PTA7ICRkMj1udWxsOyAka3Q9MDsKICAgICAgICBmb3JlYWNoKCRvcyBhcyAkbyl7IGlmKCRvWydkJ108PSRsaW0peyAkbisrOyAkY3QrPSRvWydjdCddOyBpZigkbj09MikgJGQyPSRvWydkJ107IH0gfQogICAgICAgICRhPSYkQVskcmtdWyRzXTsgaWYoISRhKSAkYT1bJ24nPT4wLCdncml6byc9PjAsJ3V6cyc9PjAsJ2N0Jz0+MCwncGlybWFzX2N0Jz0+MCwnM3BsaXVzJz0+MCwnZF9pa2kyJz0+MF07CiAgICAgICAgJGFbJ24nXSsrOyAkYVsndXpzJ10rPSRuOyAkYVsnY3QnXSs9JGN0OyAkYVsncGlybWFzX2N0J10rPSRmWydjdCddOyBpZigkbj49Mil7ICRhWydncml6byddKys7ICRhWydkX2lraTInXSs9KHN0cnRvdGltZSgkZDIpLXN0cnRvdGltZSgkZlsnZCddKSkvODY0MDA7IH0gaWYoJG4+PTMpICRhWyczcGxpdXMnXSsrOyB1bnNldCgkYSk7CiAgICAgIH0gfQogICAgZm9yZWFjaCgkQSBhcyAkcms9PiRzcykgZm9yZWFjaCgkc3MgYXMgJHM9PiRhKXsgJHJbJ3JleiddWyRya11bJHNdPVsna2xpZW50dSc9PiRhWyduJ10sJ2dyaXpvX3Byb2MnPT5yb3VuZCgxMDAqJGFbJ2dyaXpvJ10vJGFbJ24nXSwxKSwnM3BsaXVzX3Byb2MnPT5yb3VuZCgxMDAqJGFbJzNwbGl1cyddLyRhWyduJ10sMSksJ3V6c192aWQnPT5yb3VuZCgkYVsndXpzJ10vJGFbJ24nXSwyKSwnZXVyXzM2NWRfdmlkJz0+cm91bmQoJGFbJ2N0J10vJGFbJ24nXS8xMDAsMSksJ3Bpcm1hc19ldXJfdmlkJz0+cm91bmQoJGFbJ3Bpcm1hc19jdCddLyRhWyduJ10vMTAwLDEpLCdkX2lraV8yX3ZpZCc9PiRhWydncml6byddP3JvdW5kKCRhWydkX2lraTInXS8kYVsnZ3Jpem8nXSk6bnVsbF07IH0KICAgIGtzb3J0KCRtZXRhaSk7ICRyWyduYXVqaV9wYWdhbF9tZXR1cyddPSRtZXRhaTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ2VyciddPSRlLT5nZXRNZXNzYWdlKCk7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0OyB9KTsK';
const VER='dep-105505';
const GKEY='ps_s1851f';
const PHASES=["1"];
const OUT='analize/s1851_f.json';
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
