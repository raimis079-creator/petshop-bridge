process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzQxciBnYWx1dGluZSBwYXRpa3JhIHBvIDMgcGF0YWlzdSAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE3NDFyJ10pKSByZXR1cm47IEBzZXRfdGltZV9saW1pdCgxMjApOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRyPVsndic9PidTMTc0MXInXTsgJHR6PW5ldyBEYXRlVGltZVpvbmUoJ0V1cm9wZS9WaWxuaXVzJyk7CiAgdHJ5ewogICAgJHJbJ2xhaWthcyddPShuZXcgRGF0ZVRpbWUoJ25vdycsJHR6KSktPmZvcm1hdCgnSDppOnMnKTsKICAgICRtdD1mdW5jdGlvbigkZil7IHJldHVybiBpc19maWxlKCRmKT8obmV3IERhdGVUaW1lKCdAJy5maWxlbXRpbWUoJGYpKSktPnNldFRpbWV6b25lKCR0ej1uZXcgRGF0ZVRpbWVab25lKCdFdXJvcGUvVmlsbml1cycpKS0+Zm9ybWF0KCdIOmk6cycpLicgJy5zdWJzdHIobWQ1X2ZpbGUoJGYpLDAsOCk6J05FUkEnOyB9OwogICAgJHJbJ2ZhaWxhaSddPVsncm1fa2VzYXMnPT4kbXQoV1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1ybS1rZXNhcy5waHAnKSwnbG9naW4nPT4kbXQoV1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1sb2dpbi1zYXJnYXMucGhwJyksJ2RhcmJhbGF1a2lzJz0+JG10KFdQTVVfUExVR0lOX0RJUi4nL3BldHNob3AtZGFyYmFsYXVraXMucGhwJyldOwogICAgJGN2PWdldF9vcHRpb24oJ3BzX2NhY2hlX3ZhbHltYWknKTsgJHJbJ3ZhbHltYWlfcG9fMTAwNyddPVtdOyBpZihpc19hcnJheSgkY3YpKXsgZm9yZWFjaCgkY3YgYXMgJHgpeyBpZigkeFswXT49JzA5LTMwIDEwOjMwOjAwJykgJHJbJ3ZhbHltYWlfcG9fMTAwNyddW109WyR4WzBdLCR4WzFdLG1iX3N1YnN0cigkeFsyXSwwLDUwKSxzdHJwb3MoJHhbNF0/PycnLCdjYWNoZS13YXRjaGVyJykhPT1mYWxzZT8nUk0nOidrdCcsbWJfc3Vic3RyKCR4WzNdPz8nJywwLDcwKV07IH0gfQogICAgJHJbJ3JtX3ByYWxlaXN0YSddPWdldF9vcHRpb24oJ3BzX3JtX2tlc2FzX3ByYWxlaXN0YScpOyAkclsndGlrc2xpbmlhaSddPWdldF9vcHRpb24oJ3BzX2NhY2hlX3Rpa3NsaW5pYWknKTsgJHJbJ3dwYWk3J109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgdGltZV9ydW4sTEVGVChzdW1tYXJ5LDkwKSBzLGRhdGUgRlJPTSB7JFB9cG14aV9oaXN0b3J5IFdIRVJFIGltcG9ydF9pZD03IEFORCBkYXRlPj1VVENfVElNRVNUQU1QKCktSU5URVJWQUwgMyBIT1VSIE9SREVSIEJZIGlkIERFU0MgTElNSVQgNCIsQVJSQVlfQSk7CiAgICAkZD1XUF9DT05URU5UX0RJUi4nL2NhY2hlL3N1cGVyY2FjaGUvcGV0c2hvcC5sdCc7ICRuPTA7ICRvbGQ9bnVsbDsgaWYoaXNfZGlyKCRkKSl7ICRpdD1uZXcgUmVjdXJzaXZlSXRlcmF0b3JJdGVyYXRvcihuZXcgUmVjdXJzaXZlRGlyZWN0b3J5SXRlcmF0b3IoJGQsRmlsZXN5c3RlbUl0ZXJhdG9yOjpTS0lQX0RPVFMpKTsgZm9yZWFjaCgkaXQgYXMgJGZpKXsgaWYoc3Vic3RyKCRmaS0+Z2V0RmlsZW5hbWUoKSwtNSk9PT0nLmh0bWwnKXsgJG4rKzsgJG09JGZpLT5nZXRNVGltZSgpOyBpZigkb2xkPT09bnVsbHx8JG08JG9sZCkgJG9sZD0kbTsgfSB9IH0gJHJbJ3N1cGVyY2FjaGUnXT1bJ3BzbCc9PiRuLCdzZW5pYXVzaWFzJz0+JG9sZD8obmV3IERhdGVUaW1lKCdAJy4kb2xkKSktPnNldFRpbWV6b25lKCR0eiktPmZvcm1hdCgnSDppJyk6bnVsbF07CiAgICAkclsnbG9naW5fZWlsdXRlcyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGxhaWthcyx6aW51dGUsa2llayBGUk9NIHskUH1wc19zYXJnYXNfa2xhaWRvcyBXSEVSRSBseWdpcz0nbG9naW4nIE9SREVSIEJZIGlkIERFU0MgTElNSVQgNSIsQVJSQVlfQSk7CiAgICAkbG9nPWluaV9nZXQoJ2Vycm9yX2xvZycpOyAkclsnbG9nJ109W107IGlmKCRsb2cmJmlzX3JlYWRhYmxlKCRsb2cpKXsgJGZoPWZvcGVuKCRsb2csJ3InKTsgZnNlZWsoJGZoLC1taW4oZmlsZXNpemUoJGxvZyksMTUwMDAwKSxTRUVLX0VORCk7ICR0PWZyZWFkKCRmaCwxNTAwMDApOyBmY2xvc2UoJGZoKTsKICAgICAgZm9yZWFjaChleHBsb2RlKCJcbiIsJHQpIGFzICRsKXsgaWYoIXByZWdfbWF0Y2goJyNeXFszMC1TZXAtMjAyNiAoXGRcZDpcZFxkOlxkXGQpIFVUQ1xdIycsJGwsJG0pKSBjb250aW51ZTsgaWYoJG1bMV08JzA3OjMwOjAwJykgY29udGludWU7CiAgICAgICAgZm9yZWFjaChbJ2l2eWtvJz0+IlVua25vd24gY29sdW1uICdpdnlrbyciLCd0aWVrZWphcyc9PidzdGRDbGFzczo6JHRpZWtlamFzJywnaWRfcHJvcCc9PidzdGRDbGFzczo6JGlkJywnZmF0YWwnPT4nRmF0YWwnLCdybV9rZXNhcyc9PidybS1rZXNhcycsJ3BldHNob3BfY2FjaGUnPT4ncGV0c2hvcC1jYWNoZScsJ2xvZ2luX3Nhcmdhcyc9Pidsb2dpbi1zYXJnYXMnLCdkYXJiYWxhdWtpcyc9PidwZXRzaG9wLWRhcmJhbGF1a2lzLnBocCddIGFzICRrPT4kcCl7IGlmKHN0cnBvcygkbCwkcCkhPT1mYWxzZSl7ICRyWydsb2cnXVska11bXT0kbVsxXS4nICcubWJfc3Vic3RyKCRsLHN0cmxlbigkbVswXSksMTYwKTsgfSB9IH0gfQogICAgZm9yZWFjaCgkclsnbG9nJ10gYXMgJGs9PiR2KXsgJHJbJ2xvZyddWyRrXT1bJ24nPT5jb3VudCgkdiksJ3B2eic9PmFycmF5X3NsaWNlKCR2LC0zKV07IH0KICAgICRyWydoYiddPXdwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKHdwX3JlbW90ZV9nZXQoaG9tZV91cmwoJy8/cHNfaGI9Jy50aW1lKCkpLFsndGltZW91dCc9PjI1LCdzc2x2ZXJpZnknPT5mYWxzZSwndXNlci1hZ2VudCc9PidNb3ppbGxhLzUuMCBwcy1zMTc0MSddKSk7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9LCAxKTsK';
const VER='dep-083701';
const GKEY='ps_s1741r';
const PHASES=["1"];
const OUT='analize/s1741_r.json';
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
