process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzgwYiBhdi1yZWR1Y2UvYXYtbGltaXQvYXYtc291cmNlIHNhbHRpbmlzICsgdmlzdSBuZXBhdnlrdXNpdSByZXplcnZhY2lqdSBtYXN0YXMgKHJlYWQtb25seSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzgwYiddKSkgcmV0dXJuOyBAc2V0X3RpbWVfbGltaXQoMTIwKTsgJHI9Wyd2Jz0+J1MxNzgwYiddOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7CiAgJGxpbmVzPWZ1bmN0aW9uKCRmaWxlLCRmcm9tLCR0byl7IGlmKCFmaWxlX2V4aXN0cygkZmlsZSkpIHJldHVybiAnTkVSQSc7ICRhPWZpbGUoJGZpbGUpOyAkbz1bXTsgZm9yKCRpPSRmcm9tLTE7JGk8bWluKCR0byxjb3VudCgkYSkpOyRpKyspeyAkb1tdPSgkaSsxKS4nOiAnLnJ0cmltKG1iX3N1YnN0cigkYVskaV0sMCwyMDApKTsgfSByZXR1cm4gJG87IH07CiAgdHJ5ewogICAgJG11PVdQTVVfUExVR0lOX0RJUi4nLyc7CiAgICAkclsnYXZfcmVkdWNlXzMwXzEyMCddPSRsaW5lcygkbXUuJ3BldHNob3AtYXYtcmVkdWNlLnBocCcsMSwxMjUpOwogICAgJHJbJ2F2X2xpbWl0XzFfMTEwJ109JGxpbmVzKCRtdS4ncGV0c2hvcC1hdi1saW1pdC5waHAnLDEsMTEwKTsKICAgICRyWydhdl9zb3VyY2VfMTIwXzIwMCddPSRsaW5lcygkbXUuJ3BldHNob3AtYXYtc291cmNlLnBocCcsMTIwLDIwMCk7CiAgICAkclsncHNfc291cmNlc19jb2xzJ109JHdwZGItPmdldF9jb2woIlNIT1cgQ09MVU1OUyBGUk9NIHskUH1wc19zb3VyY2VzIik7CiAgICAkclsncHNfc291cmNlc18xODU1NyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUICogRlJPTSB7JFB9cHNfc291cmNlcyBXSEVSRSBwcm9kdWN0X2lkPTE4NTU3IE9SIHBvc3RfaWQ9MTg1NTcgTElNSVQgNSIsQVJSQVlfQSk7CiAgICAvLyBWaXNpIGthc29zIHV6c2FreW1haSBudW8gMDktMDggYmUgJ1N0b2NrIGhvbGQnIHBhc3RhYm9zIChyZXplcnZhY2lqYSBuZXBhdnlrbykg4oCUIG1hc3RhcwogICAgJG9yZHM9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsIHN0YXR1cywgZGF0ZV9jcmVhdGVkX2dtdCwgYmlsbGluZ19lbWFpbCwgdG90YWxfYW1vdW50IEZST00geyRQfXdjX29yZGVycyBXSEVSRSB0eXBlPSdzaG9wX29yZGVyJyBBTkQgZGF0ZV9jcmVhdGVkX2dtdD49JzIwMjYtMDktMDgnIEFORCBzdGF0dXMgSU4oJ3djLWNhbmNlbGxlZCcsJ3djLXBlbmRpbmcnLCd3Yy1mYWlsZWQnLCd3Yy1wcm9jZXNzaW5nJywnd2MtY29tcGxldGVkJywnd2Mtb24taG9sZCcpIE9SREVSIEJZIGRhdGVfY3JlYXRlZF9nbXQiLEFSUkFZX0EpOwogICAgJGJlPVtdOyAkc3U9MDsgJG49MDsgZm9yZWFjaCgkb3JkcyBhcyAkbyl7ICRuKys7ICRub3Rlcz0kd3BkYi0+Z2V0X2NvbCgkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIGNvbW1lbnRfY29udGVudCBGUk9NIHskUH1jb21tZW50cyBXSEVSRSBjb21tZW50X3Bvc3RfSUQ9JWQgQU5EIGNvbW1lbnRfdHlwZT0nb3JkZXJfbm90ZSciLCRvWydpZCddKSk7ICRob2xkPWZhbHNlOyBmb3JlYWNoKCRub3RlcyBhcyAkYyl7IGlmKHN0cmlwb3MoJGMsJ1N0b2NrIGhvbGQnKSE9PWZhbHNlKXsgJGhvbGQ9dHJ1ZTsgYnJlYWs7IH0gfSBpZigkaG9sZCl7ICRzdSsrOyBjb250aW51ZTsgfQogICAgICAkb3JkPXdjX2dldF9vcmRlcigkb1snaWQnXSk7IGlmKCEkb3JkIHx8ICRvcmQtPmdldF9jcmVhdGVkX3ZpYSgpIT09J2NoZWNrb3V0JykgY29udGludWU7ICR0ZWw9JG9yZC0+Z2V0X21ldGEoJ19wc190ZWxlZm9udScpOwogICAgICAkaXRlbXM9W107IGZvcmVhY2goJG9yZC0+Z2V0X2l0ZW1zKCkgYXMgJGl0KXsgJHBpZD0kaXQtPmdldF9wcm9kdWN0X2lkKCk7ICRpdGVtc1tdPSRpdC0+Z2V0X3F1YW50aXR5KCkuJ8OXICMnLiRwaWQuJyAnLm1iX3N1YnN0cigkaXQtPmdldF9uYW1lKCksMCw0MCkuJyBbc3RvY2sgJy5nZXRfcG9zdF9tZXRhKCRwaWQsJ19zdG9jaycsdHJ1ZSkuJyBvd24gJy5nZXRfcG9zdF9tZXRhKCRwaWQsJ19vd25fc3RvY2tfcXR5Jyx0cnVlKS4nIG1hbmFnZSAnLmdldF9wb3N0X21ldGEoJHBpZCwnX21hbmFnZV9zdG9jaycsdHJ1ZSkuJ10nOyB9CiAgICAgICRrPSRvcmQtPmdldF9tZXRhKCdfcHNfa2FuYWxhaScpOyAkaz1pc19zdHJpbmcoJGspP2pzb25fZGVjb2RlKCRrLHRydWUpOiRrOwogICAgICAkYmVbXT1bJ25yJz0+JG9yZC0+Z2V0X21ldGEoJ19wc19vcmRlcl9udW1iZXInKSwndCc9PiRvWydkYXRlX2NyZWF0ZWRfZ210J10sJ3N0Jz0+JG9bJ3N0YXR1cyddLCdzdW1hJz0+JG9bJ3RvdGFsX2Ftb3VudCddLCdlbCc9PnN1YnN0cihtZDUoc3RydG9sb3dlcigkb1snYmlsbGluZ19lbWFpbCddKSksMCw2KSwndGVsJz0+JHRlbD8xOjAsJ3Bhc3RhYnUnPT5jb3VudCgkbm90ZXMpLCdrYW5hbGFzJz0+aXNfYXJyYXkoJGspJiZpc3NldCgka1sncGlybWFzJ10pPygoJGtbJ3Bpcm1hcyddWyd1dG1fc291cmNlJ10/PycnKS4nLycuKCRrWydwaXJtYXMnXVsndXRtX2NhbXBhaWduJ10/PycnKSk6Jy0nLCdwcmVrZXMnPT4kaXRlbXNdOyB9CiAgICAkclsndXpzYWt5bXVfdmlzbyddPSRuOyAkclsnc3VfaG9sZCddPSRzdTsgJHJbJ2JlX2hvbGRfbiddPWNvdW50KCRiZSk7ICRyWydiZV9ob2xkJ109JGJlOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnZXJyJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QUkVUVFlfUFJJTlQpOyBleGl0Owp9KTsK';
const VER='dep-070122';
const GKEY='ps_s1780b';
const PHASES=["1"];
const OUT='out/s1780b.json';
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
