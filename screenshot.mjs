process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzQ1eCBsaWZlY3ljbGUgbGFpc2t1IGxvZ2lrYSAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE3NDV4J10pKSByZXR1cm47IGlmKGlzc2V0KCRfR0VUWydwc19zMTc0NXgnXSkgJiYgJF9HRVRbJ3BzX3MxNzQ1eCddPT09J3BwJykgJF9HRVRbJ3BwJ109MTsgZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkcj1bJ3YnPT4nUzE3NDV4J107CiAgJGZuPWZ1bmN0aW9uKCRmaWxlLCRuYW1lLCRsZW49MjIwMCl7ICR0PUBmaWxlX2dldF9jb250ZW50cygkZmlsZSk7IGlmKCEkdCkgcmV0dXJuICduZXJhIGZhaWxvJzsgJHA9c3RycG9zKCR0LCdmdW5jdGlvbiAnLiRuYW1lKTsgcmV0dXJuICRwPT09ZmFsc2U/J25lcmEgZi1qb3MnOnN1YnN0cigkdCwkcCwkbGVuKTsgfTsKICAkaGQ9ZnVuY3Rpb24oJGZpbGUsJGxlbj0yNjAwKXsgJHQ9QGZpbGVfZ2V0X2NvbnRlbnRzKCRmaWxlKTsgcHJlZ19tYXRjaCgnIy9cKlwqLio/XCovI3MnLChzdHJpbmcpJHQsJG0pOyByZXR1cm4gbWJfc3Vic3RyKCRtWzBdPz8nJywwLCRsZW4pOyB9OwogICRtdT1XUE1VX1BMVUdJTl9ESVIuJy8nOyAkY29yZT1XUF9QTFVHSU5fRElSLicvcGV0c2hvcC1jb3JlL2luY2x1ZGVzLyc7CiAgJHJbJ3Bha2FydG90aV9oZCddPSRoZCgkbXUuJ3BldHNob3AtcGFrYXJ0b3RpLnBocCcpOwogICRyWydwYWthcnRvdGlfdmFydGFpJ109JGZuKCRtdS4ncGV0c2hvcC1wYWthcnRvdGkucGhwJywndmFydGFpJywxODAwKTsKICAkclsnc3VncmF6aW5pbWFzX2hkJ109JGhkKCRtdS4ncGV0c2hvcC1zdWdyYXppbmltYXMucGhwJywxNTAwKTsKICAkclsnc3VncmF6aW5pbWFzX2RpZW5hJ109JGZuKCRtdS4ncGV0c2hvcC1zdWdyYXppbmltYXMucGhwJywnZGllbmEnLDIyMDApOwogICRyWyd2YXJ0YWlfZWxpZ2liaWxpdHknXT0kZm4oJG11LidwZXRzaG9wLWxpZmVjeWNsZS12YXJ0YWkucGhwJywnZWxpZ2liaWxpdHknLDIwMDApOwogICRyWyd2YXJ0YWlfY2lrbGFzJ109JGZuKCRtdS4ncGV0c2hvcC1saWZlY3ljbGUtdmFydGFpLnBocCcsJ3BhdGFpc3l0aV9laWx1dGUnLDIyMDApOwogICRyWydwcF9oZCddPSRoZCgkY29yZS4nY2xhc3MtcG9zdC1wdXJjaGFzZS5waHAnLDMwMDApOwogICR0PUBmaWxlX2dldF9jb250ZW50cygkY29yZS4nY2xhc3MtcG9zdC1wdXJjaGFzZS5waHAnKTsgcHJlZ19tYXRjaF9hbGwoIi9mdW5jdGlvblxzK1x3K3wncmVhc29uJ1xzKj0+XHMqJ1thLXpfMC05XSsnfGNvbnN0XHMrXHcrXHMqPVxzKlteO10rOy8iLChzdHJpbmcpJHQsJG0pOyAkclsncHBfc3RydWt0dXJhJ109JG1bMF07CiAgJHJbJ3BwX2VsaWcnXT0kZm4oJGNvcmUuJ2NsYXNzLXBvc3QtcHVyY2hhc2UucGhwJywnZWxpZ2liaWxpdHknLDIyMDApOwogIGlmKGlzc2V0KCRfR0VUWydwcCddKSl7ICRyPVsndic9PidTMTc0NXgyJywncGlya29fcG8nPT4kZm4oJG11LidwZXRzaG9wLXN1Z3JhemluaW1hcy5waHAnLCdwaXJrb19wbycsMTIwMCksJ3NpbWlsYXJfb2snPT4kZm4oJG11LidwZXRzaG9wLWxpZmVjeWNsZS12YXJ0YWkucGhwJywnc2ltaWxhcl9vaycsMTQwMCksJ3NvZnRfbWV0YSc9PiR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG1ldGFfdmFsdWUgdiwgQ09VTlQoKikgbiBGUk9NIHskUH11c2VybWV0YSBXSEVSRSBtZXRhX2tleT0ncHNfc29mdF9vcHRpbl9lbGlnaWJsZScgR1JPVVAgQlkgMSIsQVJSQVlfQSksJ3JlZmlsbF91c2Vyc19iZV9zb2Z0Jz0+KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKERJU1RJTkNUIHIudXNlcl9pZCkgRlJPTSB7JFB9cHNfcmVmaWxsX3RyYWNraW5nIHIgTEVGVCBKT0lOIHskUH11c2VybWV0YSBtIE9OIG0udXNlcl9pZD1yLnVzZXJfaWQgQU5EIG0ubWV0YV9rZXk9J3BzX3NvZnRfb3B0aW5fZWxpZ2libGUnIFdIRVJFIHIuc3RhdHVzPSdhY3RpdmUnIEFORCBtLnVtZXRhX2lkIElTIE5VTEwiKSwncmVmaWxsX3VzZXJzJz0+KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKERJU1RJTkNUIHVzZXJfaWQpIEZST00geyRQfXBzX3JlZmlsbF90cmFja2luZyBXSEVSRSBzdGF0dXM9J2FjdGl2ZSciKV07IH0KICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QUkVUVFlfUFJJTlQpOyBleGl0Owp9KTsK';
const VER='dep-183858';
const GKEY='ps_s1745x';
const PHASES=["pp"];
const OUT='out/s1745_x.json';
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
