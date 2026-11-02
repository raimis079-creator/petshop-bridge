process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODIzYSBEMTkgdmlzb21zIHBha8WzIMWhZWltb21zICgxIGRyeSwgMiBhcHBseSwgMyBzaG90cywgOSByZXN0b3JlKSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE4MjNhJ10pKSByZXR1cm47ICRGPSRfR0VUWydwc19zMTgyM2EnXTsgJHI9Wyd2Jz0+J1MxODIzYScsJ0YnPT4kRl07IGdsb2JhbCAkd3BkYjsKICAkcm93cz0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBwLklELHAucG9zdF9zdGF0dXMgcyxtLm1ldGFfdmFsdWUgZiwoU0VMRUNUIG1ldGFfdmFsdWUgRlJPTSB7JHdwZGItPnBvc3RtZXRhfSBXSEVSRSBwb3N0X2lkPXAuSUQgQU5EIG1ldGFfa2V5PSdfZHBfcGFja19xdHknIExJTUlUIDEpIHEgRlJPTSB7JHdwZGItPnBvc3RzfSBwIEpPSU4geyR3cGRiLT5wb3N0bWV0YX0gbSBPTiBtLnBvc3RfaWQ9cC5JRCBBTkQgbS5tZXRhX2tleT0nX3BzX2R5ZHppb19zZWltYScgV0hFUkUgcC5wb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwLnBvc3Rfc3RhdHVzPSdwdWJsaXNoJyIpOwogICRmYW09W107IGZvcmVhY2goJHJvd3MgYXMgJHgpeyAkZmFtWyR4LT5mXVtdPVsoaW50KSR4LT5JRCwoaW50KSR4LT5xXTsgfQogICR0aW5rYT1bXTsgJG1peD1bXTsgZm9yZWFjaCgkZmFtIGFzICRmPT4kbSl7ICRvaz1jb3VudCgkbSk+PTI7IGZvcmVhY2goJG0gYXMgJHkpeyBpZigkeVsxXTwyKSAkb2s9ZmFsc2U7IH0gaWYoJG9rKSAkdGlua2FbXT0kZjsgZWxzZWlmKGFycmF5X2ZpbHRlcigkbSxmdW5jdGlvbigkeSl7cmV0dXJuICR5WzFdPj0yO30pKSAkbWl4WyRmXT0kbTsgfQogICRjdXI9KGFycmF5KWdldF9vcHRpb24oJ3BzX2RrX2QxOV9zZWltb3MnLFtdKTsKICBpZigkRj09PScxJyl7ICRyWydzZWltdV92aXNvJ109Y291bnQoJGZhbSk7ICRyWyd0aW5rYSddPWNvdW50KCR0aW5rYSk7ICRyWydzYXJhc2FzJ109JHRpbmthOyAkclsnbWl4J109JG1peDsgJHJbJ2RhYmFyJ109JGN1cjsgfQogIGVsc2VpZigkRj09PScyJyl7IGlmKCFnZXRfb3B0aW9uKCdwc19zMTgyM19kMTlfYmFrJykpIHVwZGF0ZV9vcHRpb24oJ3BzX3MxODIzX2QxOV9iYWsnLFsndic9PiRjdXJdLGZhbHNlKTsgdXBkYXRlX29wdGlvbigncHNfZGtfZDE5X3NlaW1vcycsYXJyYXlfdmFsdWVzKGFycmF5X3VuaXF1ZShhcnJheV9tZXJnZSgkY3VyLCR0aW5rYSkpKSxmYWxzZSk7CiAgICAkd3BkYi0+cXVlcnkoIkRFTEVURSBGUk9NIHskd3BkYi0+b3B0aW9uc30gV0hFUkUgb3B0aW9uX25hbWUgTElLRSAnX3RyYW5zaWVudF9wc19ka18lJyBPUiBvcHRpb25fbmFtZSBMSUtFICdfdHJhbnNpZW50X3RpbWVvdXRfcHNfZGtfJSciKTsgaWYoZnVuY3Rpb25fZXhpc3RzKCd3cF9jYWNoZV9jbGVhcl9jYWNoZScpKSB3cF9jYWNoZV9jbGVhcl9jYWNoZSgpOyBpZihmdW5jdGlvbl9leGlzdHMoJ3JvY2tldF9jbGVhbl9kb21haW4nKSkgcm9ja2V0X2NsZWFuX2RvbWFpbigpOyBpZihmdW5jdGlvbl9leGlzdHMoJ2xpdGVzcGVlZF9wdXJnZV9hbGwnKSkgZG9fYWN0aW9uKCdsaXRlc3BlZWRfcHVyZ2VfYWxsJyk7CiAgICAkclsnbmF1amEnXT1jb3VudChnZXRfb3B0aW9uKCdwc19ka19kMTlfc2VpbW9zJykpOwogICAgJGhiPVtdOyBmb3JlYWNoKFsnLycsJy9rYXRlZ29yaWphL3N1bmltcy9tYWlzdGFzLXN1bmltcy9rb25zZXJ2YWktc3VuaW1zLycsJy9rYXRlZ29yaWphL2thdGVtcy9tYWlzdGFzLWthdGVtcy9rb25zZXJ2YWkta2F0ZW1zLycsZ2V0X3Blcm1hbGluaygzNzQ1OCksZ2V0X3Blcm1hbGluaygzNzQ4MCldIGFzICR1KXsgJHg9d3BfcmVtb3RlX2dldChhZGRfcXVlcnlfYXJnKCdwc19oYicsdGltZSgpLHN0cnBvcygkdSwnaHR0cCcpPT09MD8kdTpob21lX3VybCgkdSkpLFsndGltZW91dCc9PjQwLCdzc2x2ZXJpZnknPT5mYWxzZV0pOyAkYj13cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkeCk7ICRoYltdPVskdSx3cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSgkeCksc3Vic3RyX2NvdW50KCRiLCdwcy1kay0tZDE5Jyksc3Vic3RyX2NvdW50KCRiLCdwcy1wYWstLWQxOScpLHN1YnN0cl9jb3VudCgkYiwnZHAtcHYnKV07IH0KICAgICRyWydoYiddPSRoYjsgZm9yZWFjaCgkaGIgYXMgJGgpeyBpZigkaFsxXT49NTAwKXsgdXBkYXRlX29wdGlvbigncHNfZGtfZDE5X3NlaW1vcycsJGN1cixmYWxzZSk7ICRyWydBVFNUQVRZVEEnXT0xOyB9IH0gfQogIGVsc2VpZigkRj09PSczJyl7ICRldj0iKCgpPT57dmFyIHA9ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BzLXBhaycpO2lmKHApe3Auc2Nyb2xsSW50b1ZpZXcoKTt3aW5kb3cuc2Nyb2xsQnkoMCwtNzApO31yZXR1cm4gMX0pKCkiOwogICAgJGV2az0iKCgpPT57dmFyIGM9ZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnBzLWRrLS1kMTknKTtpZihjKXtjPWMuY2xvc2VzdCgnLnByb2R1Y3Qtc21hbGwnKTtjLnNjcm9sbEludG9WaWV3KCk7d2luZG93LnNjcm9sbEJ5KDAsLTgwKTt9cmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5wcy1kay0tZDE5JykubGVuZ3RofSkoKSI7CiAgICAkclsnc2hvdHMnXT1bWyduJz0+J3MxODIzX2QxOV9nZW1vbl90b3AnLCd1Jz0+Z2V0X3Blcm1hbGluaygzNzQ1OCksJ3cnPT4zOTAsJ2gnPT44NDRdLFsnbic9PidzMTgyM19kMTlfZ2Vtb25fbGVudCcsJ3UnPT5nZXRfcGVybWFsaW5rKDM3NDU4KSwndyc9PjM5MCwnaCc9Pjg0NCwnZXZhbCc9PiRldl0sWyduJz0+J3MxODIzX2QxOV9rYXRfbGVudCcsJ3UnPT5nZXRfcGVybWFsaW5rKDM3NDgwKSwndyc9PjM5MCwnaCc9Pjg0NCwnZXZhbCc9PiRldl0sWyduJz0+J3MxODIzX2QxOV9rYXRfa29ydCcsJ3UnPT5ob21lX3VybCgnL2thdGVnb3JpamEva2F0ZW1zL21haXN0YXMta2F0ZW1zL2tvbnNlcnZhaS1rYXRlbXMvJyksJ3cnPT4zOTAsJ2gnPT44NDQsJ2V2YWwnPT4kZXZrXV07IH0KICBlbHNlaWYoJEY9PT0nOScpeyAkYj1nZXRfb3B0aW9uKCdwc19zMTgyM19kMTlfYmFrJyk7IGlmKCRiKXsgdXBkYXRlX29wdGlvbigncHNfZGtfZDE5X3NlaW1vcycsJGJbJ3YnXSxmYWxzZSk7ICRyWydhdHN0YXR5dGEnXT0kYlsndiddOyB9IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LCAxKTsK';
const VER='dep-225125';
const GKEY='ps_s1823a';
const PHASES=["3"];
const OUT='analize/s1823_a3.json';
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
