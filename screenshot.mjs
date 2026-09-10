process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://petshop.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2NjggZyDigJQgUkVBRC1PTkxZOiBwYXJkYXZpbcWzIG7El3JhIOKAlCB1xb5zYWt5bWFpIHBvIFQtMCwgcGlsdHV2YXMsIGtsYWlkb3MsIGNoZWNrb3V0IGLFq2tsxJcuICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX3MxNjY4ZyddKSkgcmV0dXJuOwogIGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgJG89YXJyYXkoJ3YnPT4nUzE2NjggZycsJ2RhYmFyX3V0Yyc9PmdtZGF0ZSgnWS1tLWQgSDppJykpOwogIHRyeXsKICAvLyAxLiB1xb5zYWt5bWFpIG51byAwOS0wOAogIGZvcmVhY2god2NfZ2V0X29yZGVycyhhcnJheSgnbGltaXQnPT42MCwnZGF0ZV9jcmVhdGVkJz0+Jz49Jy5zdHJ0b3RpbWUoJzIwMjYtMDktMDggMDA6MDAnKSwnb3JkZXJieSc9PidkYXRlJywnb3JkZXInPT4nQVNDJywnc3RhdHVzJz0+YXJyYXlfa2V5cyh3Y19nZXRfb3JkZXJfc3RhdHVzZXMoKSkpKSBhcyAkb2QpewogICAgJG49YXJyYXkoKTsgZm9yZWFjaCh3Y19nZXRfb3JkZXJfbm90ZXMoYXJyYXkoJ29yZGVyX2lkJz0+JG9kLT5nZXRfaWQoKSwnbGltaXQnPT4zKSkgYXMgJHgpICRuW109bWJfc3Vic3RyKHdwX3N0cmlwX2FsbF90YWdzKCR4LT5jb250ZW50KSwwLDkwKTsKICAgICRvWyd1enMnXVtdPWFycmF5KCRvZC0+Z2V0X2lkKCksJG9kLT5nZXRfb3JkZXJfbnVtYmVyKCksJG9kLT5nZXRfc3RhdHVzKCksJG9kLT5nZXRfcGF5bWVudF9tZXRob2QoKSwkb2QtPmdldF90b3RhbCgpLCRvZC0+Z2V0X2RhdGVfY3JlYXRlZCgpPyRvZC0+Z2V0X2RhdGVfY3JlYXRlZCgpLT5kYXRlKCdtLWQgSDppJyk6JycsJG9kLT5nZXRfZGF0ZV9wYWlkKCk/JG9kLT5nZXRfZGF0ZV9wYWlkKCktPmRhdGUoJ20tZCBIOmknKTonLScsJG9kLT5nZXRfY3JlYXRlZF92aWEoKSwkb2QtPmdldF9jdXN0b21lcl9pZCgpPydyZWcnOidzdmVjaWFzJywkbik7CiAgfQogIC8vIDIuIHZhcnRhaQogIGZvcmVhY2goV0MoKS0+cGF5bWVudF9nYXRld2F5cygpLT5wYXltZW50X2dhdGV3YXlzKCkgYXMgJGlkPT4kZykgaWYoJGctPmVuYWJsZWQ9PT0neWVzJykgJG9bJ3ZhcnRhaSddW109JGlkOwogIC8vIDMuIHdlYiDEr3Z5a2lhaQogIGZvcmVhY2goJHdwZGItPmdldF9jb2woIlNIT1cgVEFCTEVTIExJS0UgJ3skcH1wc193ZWJfaXZ5a2lhaSciKSBhcyAkdCl7CiAgICAkb1snaXZ5a2lhaSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGRpZW5hLHRpcGFzLENPVU5UKCopIG4gRlJPTSAkdCBXSEVSRSBkaWVuYT49Q1VSREFURSgpLUlOVEVSVkFMIDMgREFZIEFORCB0ZXN0aW5pcz0wIEdST1VQIEJZIGRpZW5hLHRpcGFzIE9SREVSIEJZIGRpZW5hLG4gREVTQyIsQVJSQVlfQSk7CiAgICAkb1snc2FsdGluaWFpXzA5MDknXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBzYWx0aW5pcyxDT1VOVChESVNUSU5DVCBsYW5reXRvamFzX2QpIGwgRlJPTSAkdCBXSEVSRSBkaWVuYT49Q1VSREFURSgpLUlOVEVSVkFMIDEgREFZIEFORCB0ZXN0aW5pcz0wIEdST1VQIEJZIHNhbHRpbmlzIE9SREVSIEJZIGwgREVTQyBMSU1JVCAxMCIsQVJSQVlfQSk7CiAgfQogIC8vIDQuIGlzdG9yaW7ElyBiYXrElyAoZVNob3ByZW50KSB1xb5zYWt5bWFpIHBlciBkaWVuxIUKICBmb3JlYWNoKCR3cGRiLT5nZXRfY29sKCJTSE9XIFRBQkxFUyBMSUtFICclaXN0b3IlJyIpIGFzICR0KXsgJGM9JHdwZGItPmdldF9jb2woIlNIT1cgQ09MVU1OUyBGUk9NICR0Iik7ICRvWydpc3RfbGVudCddWyR0XT1hcnJheV9zbGljZSgkYywwLDE0KTsgfQogIC8vIDUuIGtsYWlkb3MKICAkbG9ncz1hcnJheShXUF9DT05URU5UX0RJUi4nL2RlYnVnLmxvZycsQUJTUEFUSC4nZXJyb3JfbG9nJyxBQlNQQVRILicuLi9sb2dzL2Vycm9yLmxvZycsaW5pX2dldCgnZXJyb3JfbG9nJykpOwogIGZvcmVhY2goYXJyYXlfdW5pcXVlKGFycmF5X2ZpbHRlcigkbG9ncykpIGFzICRsKXsgaWYoIWlzX3JlYWRhYmxlKCRsKSkgY29udGludWU7ICRzej1maWxlc2l6ZSgkbCk7ICRmaD1mb3BlbigkbCwncicpOyBmc2VlaygkZmgsbWF4KDAsJHN6LTQwMDAwMCkpOyAkcz1mcmVhZCgkZmgsNDAwMDAwKTsgZmNsb3NlKCRmaCk7CiAgICBwcmVnX21hdGNoX2FsbCgnL14uKihGYXRhbHxVbmNhdWdodHxwYXlzZXJhfGNoZWNrb3V0KS4qJC9taScsJHMsJG0pOyAkb1snbG9nJ11bJGxdPWFycmF5KCdkeWRpcyc9PiRzeiwnbXRpbWUnPT5nbWRhdGUoJ20tZCBIOmknLGZpbGVtdGltZSgkbCkpLCdoaXRfbic9PmNvdW50KCRtWzBdKSwncGFzayc9PmFycmF5X21hcChmdW5jdGlvbigkeCl7cmV0dXJuIG1iX3N1YnN0cigkeCwwLDIzMCk7fSxhcnJheV9zbGljZSgkbVswXSwtOCkpKTsgfQogIC8vIDYuIFdDIGZhdGFsIGxvZ3MKICBmb3JlYWNoKGdsb2IoV1BfQ09OVEVOVF9ESVIuJy91cGxvYWRzL3djLWxvZ3MvZmF0YWwtZXJyb3JzLTIwMjYtMDktezA5LDEwfSonLEdMT0JfQlJBQ0UpID86IGFycmF5KCkgYXMgJGYpeyAkcz1maWxlX2dldF9jb250ZW50cygkZik7ICRvWyd3Y19mYXRhbCddW2Jhc2VuYW1lKCRmKV09bWJfc3Vic3RyKCRzLC0xMjAwKTsgfQogIGZvcmVhY2goZ2xvYihXUF9DT05URU5UX0RJUi4nL3VwbG9hZHMvd2MtbG9ncy8qcGF5c2VyYSoyMDI2LTA5LXswOSwxMH0qJyxHTE9CX0JSQUNFKSA/OiBhcnJheSgpIGFzICRmKXsgJG9bJ3BheXNlcmFfbG9nJ11bYmFzZW5hbWUoJGYpXT1tYl9zdWJzdHIoZmlsZV9nZXRfY29udGVudHMoJGYpLC05MDApOyB9CiAgLy8gNy4gcHVzbGFwaWFpCiAgZm9yZWFjaChhcnJheSgnLycsJy9rcmVwc2VsaXMvJywnL2F0c2lza2FpdHltYXMvJywnL2thdGVnb3JpamEvc3VuaW1zLycpIGFzICR1KXsgJHI9d3BfcmVtb3RlX2dldChob21lX3VybCgkdSksYXJyYXkoJ3RpbWVvdXQnPT4yMCwncmVkaXJlY3Rpb24nPT4yKSk7CiAgICAkb1sncHNsJ11bJHVdPWlzX3dwX2Vycm9yKCRyKT8nRVJSICcuJHItPmdldF9lcnJvcl9tZXNzYWdlKCk6d3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJHIpLicgJy5zdHJsZW4od3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJHIpKTsgfQogICRvWyd3Y19wc2wnXT1hcnJheSgnY2FydCc9PmdldF9wZXJtYWxpbmsod2NfZ2V0X3BhZ2VfaWQoJ2NhcnQnKSksJ2NoZWNrb3V0Jz0+Z2V0X3Blcm1hbGluayh3Y19nZXRfcGFnZV9pZCgnY2hlY2tvdXQnKSkpOwogIC8vIDguIHByZWtpxbMgYsWra2zElwogICRvWydwcmVrZXMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBwbS5tZXRhX3ZhbHVlIHN0LENPVU5UKCopIG4gRlJPTSB7JHB9cG9zdHMgeCBKT0lOIHskcH1wb3N0bWV0YSBwbSBPTiBwbS5wb3N0X2lkPXguSUQgQU5EIHBtLm1ldGFfa2V5PSdfc3RvY2tfc3RhdHVzJyBXSEVSRSB4LnBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHgucG9zdF9zdGF0dXM9J3B1Ymxpc2gnIEdST1VQIEJZIHN0IixBUlJBWV9BKTsKICAkb1snYmVfa2Fpbm9zJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRwfXBvc3RzIHggTEVGVCBKT0lOIHskcH1wb3N0bWV0YSBwbSBPTiBwbS5wb3N0X2lkPXguSUQgQU5EIHBtLm1ldGFfa2V5PSdfcHJpY2UnIFdIRVJFIHgucG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgeC5wb3N0X3N0YXR1cz0ncHVibGlzaCcgQU5EIChwbS5tZXRhX3ZhbHVlIElTIE5VTEwgT1IgcG0ubWV0YV92YWx1ZT0nJykiKTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICB3cF9zZW5kX2pzb24oJG8pOwp9KTsK';
const VER='dep-070447';
const GKEY='ps_s1668g';
const PHASES=["1"];
const OUT='analize/s1668_g.json';
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
